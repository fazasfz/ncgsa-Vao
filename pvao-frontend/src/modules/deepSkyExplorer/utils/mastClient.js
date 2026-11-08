/**
 * Direct browser client for the MAST Portal REST API.
 * Replaces backend astroquery.mast.Observations.query_object() calls.
 * Endpoint: https://mast.stsci.edu/api/v0/invoke (CORS: *)
 */

const MAST_URL = 'https://mast.stsci.edu/api/v0/invoke';
const REQUEST_TIMEOUT_MS = 12000;

/** POST a service request to the MAST API and return parsed JSON. */
async function mastInvoke(service, params, pagesize = 3) {
  const body = new URLSearchParams({
    request: JSON.stringify({
      service,
      params,
      format: 'json',
      pagesize,
      page: 1,
    }),
    format: 'json',
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(MAST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`MAST API ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Resolve an object name to RA/Dec via MAST's name resolver.
 * @param {string} name - e.g. "M 31"
 * @returns {Promise<{ra: number, dec: number, radius: number}>}
 */
async function resolveName(name) {
  const json = await mastInvoke('Mast.Name.Lookup', {
    input: name, format: 'json',
  });
  const resolved = json.resolvedCoordinate?.[0];
  if (!resolved) throw new Error(`MAST could not resolve '${name}'`);
  return { ra: resolved.ra, dec: resolved.decl, radius: resolved.radius || 0.2 };
}

/**
 * Query MAST observations for an object — mirrors backend get_object_images().
 * Two-step: name → coords, then filtered positional search.
 * @param {string} objectName - e.g. "M 31", "Vega"
 * @param {number} [limit=3] - max results
 * @returns {Promise<{results: Array<{mission,instrument,target}>}>}
 */
export async function queryMastImages(objectName, limit = 3) {
  try {
    const { ra, dec, radius } = await resolveName(objectName);
    const searchRadius = Math.min(radius || 0.2, 0.5);

    const json = await mastInvoke(
      'Mast.Caom.Filtered.Position',
      {
        columns: 'obs_collection,instrument_name,target_name',
        filters: [],
        position: `${ra},${dec},${searchRadius}`,
      },
      limit,
    );

    if (json.status !== 'COMPLETE') {
      return { results: [], error: `MAST query status: ${json.status}` };
    }

    const results = (json.data || []).map((row) => ({
      mission: row.obs_collection ?? null,
      instrument: row.instrument_name ?? null,
      target: row.target_name ?? null,
    }));

    return { results };
  } catch (e) {
    return {
      results: [],
      error: `Could not find MAST data for '${objectName}': ${e.message}`,
    };
  }
}
