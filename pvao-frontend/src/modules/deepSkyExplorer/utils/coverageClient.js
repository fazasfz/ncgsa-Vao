/**
 * Direct CDS MocServer integration client with 24-hour in-memory cache.
 */

const COVERAGE_CACHE = new Map();
const ALL_SKY = new Set(["CDS/P/DSS2/color", "CDS/P/2MASS/K", "CDS/P/RASS"]);
const MOCSERVER_URL = "https://alasky.cds.unistra.fr/MocServer/query";
const REQUEST_TIMEOUT_MS = 8000;

const fetchMocIds = async (params) => {
  const query = new URLSearchParams({ get: "id", fmt: "json", ...params });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${MOCSERVER_URL}?${query.toString()}`, {
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } finally {
    clearTimeout(timeout);
  }
};

export const checkCoverage = async (hipsId, ra, dec) => {
  if (ALL_SKY.has(hipsId)) return "covered";

  const key = `${hipsId}:${ra.toFixed(1)}:${dec.toFixed(1)}`;
  const hit = COVERAGE_CACHE.get(key);
  if (hit && Date.now() - hit.timestamp < 86400000) {
    return hit.result;
  }

  const fullId = hipsId.startsWith("CDS/") ? hipsId : `CDS/${hipsId}`;
  try {
    const exists = await fetchMocIds({ ID: fullId });
    if (!exists || exists.length === 0) return "unknown";

    const overlap = await fetchMocIds({
      ID: fullId,
      RA: ra.toFixed(6),
      DEC: dec.toFixed(6),
      SR: "0.15"
    });

    const result = overlap && overlap.length > 0 ? "covered" : "empty";
    COVERAGE_CACHE.set(key, { result, timestamp: Date.now() });
    return result;
  } catch {
    return "unknown";
  }
};
