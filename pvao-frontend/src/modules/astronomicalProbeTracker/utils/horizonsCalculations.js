import {
  SPEED_OF_LIGHT_KMS,
  AU_TO_KM,
  BODY_RADII,
  BODY_MU,
  COORD_FRAMES,
  BODY_EARTH_OWLT_SEC
} from '../constants/probeCatalog';

export const HORIZONS_API = "https://ssd.jpl.nasa.gov/api/horizons.api";
export const PROXIED_HORIZONS_API = "/api/nasa-horizons";

export const parseHorizonsVectors = (textResult) => {
  if (!textResult.includes("$$SOE") || !textResult.includes("$$EOE")) {
    const errLines = textResult.split('\n').map(l => l.trim()).filter(Boolean);
    throw new Error(errLines.slice(0, 3).join(' | ') || "No ephemeris block returned");
  }

  const dataBlock = textResult.split("$$SOE")[1].split("$$EOE")[0];

  const extract = (prefix) => {
    const regex = new RegExp(`${prefix}\\s*=\\s*([+-]?\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)`);
    const match = dataBlock.match(regex);
    return match ? parseFloat(match[1]) : 0;
  };

  let x = extract('X');
  let y = extract('Y');
  let z = extract('Z');
  let vx = extract('VX');
  let vy = extract('VY');
  let vz = extract('VZ');
  let lt = extract('LT'); // One-way light time in seconds
  let rg = extract('RG'); // Range to coordinate center in km
  let rr = extract('RR'); // Range-rate in km/s

  const rCheck = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  if (rCheck > 0 && rCheck < 500.0) {
    x *= AU_TO_KM;
    y *= AU_TO_KM;
    z *= AU_TO_KM;
    vx = (vx * AU_TO_KM) / 86400.0;
    vy = (vy * AU_TO_KM) / 86400.0;
    vz = (vz * AU_TO_KM) / 86400.0;
  }

  return { x, y, z, vx, vy, vz, lt, rg, rr };
};

export const computeProbeTelemetry = (vectors, probe, target) => {
  const { x, y, z, vx, vy, vz, lt, rg } = vectors;
  const rMag = rg > 0 ? rg : Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  const vMag = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2);
  const radiusBody = BODY_RADII[target] ?? 6378.137;
  const muBody = BODY_MU[target] ?? 398600.4418;

  const altitude = Math.max(0.0, rMag - radiusBody);
  const velocityKmh = vMag * 3600.0;
  const lat = (Math.asin(Math.max(-1.0, Math.min(1.0, z / Math.max(rMag, 1e-3)))) * 180) / Math.PI;
  const lon = (Math.atan2(y, x) * 180) / Math.PI;

  const hx = y * vz - z * vy;
  const hy = z * vx - x * vz;
  const hz = x * vy - y * vx;
  const hMag = Math.sqrt(hx ** 2 + hy ** 2 + hz ** 2);
  const incDeg = hMag > 1e-6
    ? (Math.acos(Math.max(-1.0, Math.min(1.0, hz / hMag))) * 180) / Math.PI
    : parseFloat((probe.inclination || "0").replace("°", "").trim()) || 0.0;

  // OWLT (One Way Light Time) in seconds
  let owlt = 0;
  if (lt > 0) {
    owlt = (target === "earth" || target === "sun")
      ? lt
      : (BODY_EARTH_OWLT_SEC[target] ?? 0.0) + lt;
  } else {
    owlt = target === "earth"
      ? rMag / SPEED_OF_LIGHT_KMS
      : (BODY_EARTH_OWLT_SEC[target] ?? 0.0) + (rMag / SPEED_OF_LIGHT_KMS);
  }

  const specificEnergy = (vMag ** 2) / 2.0 - (muBody / Math.max(rMag, 1e-3));
  let rp = rMag, ra = rMag;
  if (Math.abs(specificEnergy) > 1e-9) {
    const a = -muBody / (2.0 * specificEnergy);
    const eccTerm = hMag > 1e-6 ? 1.0 + (2.0 * specificEnergy * (hMag ** 2)) / (muBody ** 2) : 0.0;
    const ecc = Math.sqrt(Math.max(0.0, eccTerm));
    rp = Math.max(0.0, a * (1.0 - ecc));
    ra = ecc < 1.0 ? a * (1.0 + ecc) : rMag * 1.5;
  }

  const earthDistKm = target === "earth"
    ? rMag
    : (target === "sun" && probe.id === "jwst")
      ? 1500000.0 // JWST at L2 is ~1.5 million km from Earth
      : ((BODY_EARTH_OWLT_SEC[target] ?? 0.0) * SPEED_OF_LIGHT_KMS + rMag);

  const round = (val, d) => Math.round(val * 10 ** d) / 10 ** d;
  return {
    probe_id: probe.id,
    id: probe.id,
    satId: probe.id,
    name: probe.name,
    target_body: target,
    targetCenter: target,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    x: round(x, 2),
    y: round(y, 2),
    z: round(z, 2),
    vx: round(vx, 4),
    vy: round(vy, 4),
    vz: round(vz, 4),
    velocity: vMag > 0 ? `${vMag.toFixed(2)} km/s` : "Live Orbital",
    raw_velocity: vMag > 0 ? `${vMag.toFixed(2)} km/s` : "Live Orbital",
    velocity_kms: round(vMag, 3),
    velocity_kmh: round(velocityKmh, 1),
    distance_km: round(rMag, 2),
    orbital_radius: round(rMag, 2),
    orbital_radius_km: round(rMag, 2),
    altitude_km: round(altitude, 2),
    earth_distance_km: round(earthDistKm, 2),
    inclination: probe.inclination || `${round(incDeg, 2)}°`,
    inclination_deg: round(incDeg, 2),
    sub_sat_lat: round(lat, 4),
    sub_sat_lon: round(lon, 4),
    owlt_sec: round(owlt, 4),
    rtlt_sec: round(owlt * 2, 4),
    apogee_km: round(ra, 1),
    perigee_km: round(rp, 1),
    coord_frame: COORD_FRAMES[target] || "ICRF / Relative",
    period: probe.period || "N/A",
    raw_status: "Active (NASA JPL Horizons Live)"
  };
};

export const computeClientFallback = (probe, target) => {
  const targetKey = String(target).toLowerCase().trim();
  const radiusBody = BODY_RADII[targetKey] ?? 6378.137;
  const muBody = BODY_MU[targetKey] ?? 398600.4418;

  const altDefaults = {
    earth: 420.0,
    moon: 100.0,
    mars: 300.0,
    sun: 149600000.0
  };

  let alt = altDefaults[targetKey] ?? 500.0;
  if (probe.id === "jwst") alt = 150000000.0;
  else if (probe.id === "voyager1") alt = 24300000000.0;
  else if (probe.id === "voyager2") alt = 20200000000.0;
  else if (probe.id === "parker") alt = 20000000.0;
  else if (probe.id === "solar_orbiter") alt = 45000000.0;
  else if (probe.id === "new_horizons") alt = 8500000000.0;

  const r = radiusBody + alt;
  const v = Math.sqrt(muBody / r);
  const inc = parseFloat((probe.inclination || "0").replace("°", "").trim()) || 0.0;
  const owlt = targetKey === "earth"
    ? r / SPEED_OF_LIGHT_KMS
    : (BODY_EARTH_OWLT_SEC[targetKey] ?? 0.0) + (r / SPEED_OF_LIGHT_KMS);

  const earthDist = (targetKey === "sun" && probe.id === "jwst")
    ? 1500000.0
    : targetKey === "earth" ? r : ((BODY_EARTH_OWLT_SEC[targetKey] ?? 0.0) * SPEED_OF_LIGHT_KMS + r);

  return {
    probe_id: probe.id,
    id: probe.id,
    satId: probe.id,
    name: probe.name,
    target_body: targetKey,
    targetCenter: targetKey,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    x: Math.round(r * 0.707),
    y: Math.round(r * 0.707),
    z: 0.0,
    vx: Number((-v * 0.707).toFixed(4)),
    vy: Number((v * 0.707).toFixed(4)),
    vz: 0.0,
    velocity: `${v.toFixed(2)} km/s`,
    raw_velocity: `${v.toFixed(2)} km/s`,
    velocity_kms: Number(v.toFixed(3)),
    velocity_kmh: Math.round(v * 3600),
    distance_km: Math.round(r),
    orbital_radius: Math.round(r),
    orbital_radius_km: Math.round(r),
    altitude_km: Math.round(alt),
    earth_distance_km: Math.round(earthDist),
    inclination: probe.inclination || `${inc.toFixed(2)}°`,
    inclination_deg: inc,
    sub_sat_lat: 0.0,
    sub_sat_lon: 0.0,
    owlt_sec: Number(owlt.toFixed(4)),
    rtlt_sec: Number((owlt * 2).toFixed(4)),
    coord_frame: COORD_FRAMES[targetKey] || "ICRF / Relative",
    period: probe.period || "N/A",
    raw_status: "Active (NASA JPL Reference)"
  };
};
