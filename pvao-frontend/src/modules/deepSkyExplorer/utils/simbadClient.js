/**
 * Direct browser client for the SIMBAD TAP service.
 * Replaces backend astroquery.simbad.query_object() calls.
 * Endpoint: https://simbad.u-strasbg.fr/simbad/sim-tap/sync (CORS: *)
 */

const TAP_URL = 'https://simbad.u-strasbg.fr/simbad/sim-tap/sync';
const REQUEST_TIMEOUT_MS = 12000;

/** Normalise catalogue names: "m31" → "M 31", "ngc224" → "NGC 224" */
function normalise(name) {
  const m = name.trim().match(/^\s*(M|NGC|IC|Mel|Cr)\s*(\d+)\s*$/i);
  return m ? `${m[1].toUpperCase()} ${m[2]}` : name.trim();
}

/** Run an ADQL query against SIMBAD TAP and return parsed JSON rows. */
async function tap(adql) {
  const url = `${TAP_URL}?${new URLSearchParams({
    REQUEST: 'doQuery', LANG: 'ADQL', FORMAT: 'json', QUERY: adql,
  })}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let json;
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`SIMBAD TAP ${res.status}`);
    json = await res.json();
  } finally {
    clearTimeout(timeout);
  }
  if (!json.data?.length) return null;
  const cols = json.metadata.map((m) => m.name);
  return json.data.map((row) =>
    Object.fromEntries(cols.map((c, i) => [c, row[i]]))
  );
}

/**
 * Query SIMBAD for object info — mirrors backend get_object_info().
 * @param {string} objectName - e.g. "M 31", "NGC 224", "Vega"
 * @returns {Promise<object>} ObjectInfo-shaped result or { error }
 */
export async function querySimbadObject(objectName) {
  const id = normalise(objectName);
  try {
    // Main properties
    const mainQ = `
      SELECT TOP 1
        b.main_id, b.otype, b.ra, b.dec,
        b.sp_type, b.morph_type, b.galdim_majaxis,
        b.rvz_redshift, b.rvz_radvel
      FROM basic AS b
      JOIN ident ON b.oid = ident.oidref
      WHERE ident.id = '${id}'`.trim();

    const rows = await tap(mainQ);
    if (!rows) return { error: `'${objectName}' was not found in SIMBAD.` };
    const r = rows[0];

    // Aliases (pipe-separated ids)
    let aliases = [];
    const idsRows = await tap(
      `SELECT ids FROM ids WHERE oidref IN (
         SELECT oidref FROM ident WHERE id = '${id}'
       )`
    );
    if (idsRows?.[0]?.ids) {
      aliases = idsRows[0].ids.split('|').map((s) => s.trim()).slice(0, 8);
    }

    // Flux V & B magnitudes
    let magnitude = null, magnitude_b = null;
    const fluxRows = await tap(
      `SELECT flux, filter FROM flux WHERE oidref IN (
         SELECT oidref FROM ident WHERE id = '${id}'
       ) AND filter IN ('V','B')`
    );
    if (fluxRows) {
      for (const f of fluxRows) {
        if (f.filter === 'V') magnitude = f.flux;
        if (f.filter === 'B') magnitude_b = f.flux;
      }
    }

    return {
      name: r.main_id ?? objectName,
      type: r.otype ?? 'Unknown',
      all_types: null,
      aliases,
      ra: r.ra,
      dec: r.dec,
      magnitude,
      magnitude_b,
      spectral_type: r.sp_type ?? null,
      morphology: r.morph_type ?? null,
      size_arcmin: r.galdim_majaxis ?? null,
      redshift: r.rvz_redshift ?? null,
      radial_velocity: r.rvz_radvel ?? null,
      distance: null,
      distance_unit: null,
    };
  } catch (e) {
    return { error: `SIMBAD lookup failed for '${objectName}': ${e.message}` };
  }
}
