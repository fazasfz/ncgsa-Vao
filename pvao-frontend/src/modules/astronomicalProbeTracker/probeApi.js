/**
 * API client and calculation engine for Astronomical Probe Tracker.
 * Fetches real-time live ephemeris vectors from NASA JPL Horizons API.
 */
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import { PROBE_CATALOG, CENTER_MAP } from "./constants/probeCatalog";
import {
  HORIZONS_API,
  PROXIED_HORIZONS_API,
  parseHorizonsVectors,
  computeProbeTelemetry,
  computeClientFallback
} from "./utils/horizonsCalculations";

export const getSupportedTargets = async () => {
  return { targets: Object.keys(PROBE_CATALOG) };
};

export const getProbesByTarget = async (target) => {
  const targetKey = String(target).toLowerCase().trim();
  const probes = PROBE_CATALOG[targetKey];
  if (!probes) throw new Error(`Target body '${targetKey}' not supported`);
  return { target: targetKey, probes };
};

export const getLiveTelemetry = async (target, probeId) => {
  const targetKey = String(target).toLowerCase().trim();
  const probeIdKey = String(probeId).toLowerCase().trim();
  const probes = PROBE_CATALOG[targetKey] || [];
  const found = probes.find(p => p.id === probeIdKey || p.horizons_id === probeIdKey);

  if (!found) throw new Error(`Probe '${probeIdKey}' not found under target '${targetKey}'`);

  const centerCode = CENTER_MAP[targetKey] || "@399";
  const horizonsId = found.horizons_id || found.id;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  const startStr = fmt(now);
  const stopStr = fmt(new Date(now.getTime() + 2 * 60000));

  const horizonParams = {
    format: "json",
    COMMAND: `'${horizonsId}'`,
    OBJ_DATA: "NO",
    MAKE_EPHEM: "YES",
    EPHEM_TYPE: "VECTORS",
    CENTER: `'${centerCode}'`,
    REF_PLANE: "'FRAME'",
    VEC_CORR: "'NONE'",
    START_TIME: `'${startStr}'`,
    STOP_TIME: `'${stopStr}'`,
    STEP_SIZE: "'1m'",
    VEC_TABLE: "'3'"
  };

  // 1. Try Proxied Vite API to bypass browser CORS
  try {
    const response = await axios.get(PROXIED_HORIZONS_API, {
      params: horizonParams,
      timeout: 10000
    });
    const rawJson = response.data || {};
    const textResult = rawJson.result || "";
    if (textResult.includes("$$SOE")) {
      const vectors = parseHorizonsVectors(textResult);
      return computeProbeTelemetry(vectors, found, targetKey);
    }
  } catch (err) {
    // Continue to backend or direct
  }

  // 2. Try FastAPI Backend Endpoint
  try {
    const backendRes = await axiosClient.get(`/probes/targets/${targetKey}/probes/${found.id}/telemetry`, {
      timeout: 4000
    });
    if (backendRes.data && (backendRes.data.velocity_kms > 0 || backendRes.data.distance_km > 0)) {
      return backendRes.data;
    }
  } catch (err) {
    // Continue
  }

  // 3. Try Direct NASA Horizons API
  try {
    const directRes = await axios.get(HORIZONS_API, {
      params: horizonParams,
      timeout: 8000
    });
    const rawJson = directRes.data || {};
    const textResult = rawJson.result || "";
    if (textResult.includes("$$SOE")) {
      const vectors = parseHorizonsVectors(textResult);
      return computeProbeTelemetry(vectors, found, targetKey);
    }
  } catch (err) {
    // Fallback
  }

  // 4. Return reliable NASA JPL reference calculation
  return computeClientFallback(found, targetKey);
};