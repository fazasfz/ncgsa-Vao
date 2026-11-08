/**
 * Pure calculation and parsing utilities for Solar Observatory space weather telemetry.
 */

export const SDO_BASE = "https://sdo.gsfc.nasa.gov/assets/img/latest";
export const SOHO_BASE = "https://soho.nascom.nasa.gov/data/realtime";

export const convertUtcToPkt = (utcStr) => {
  try {
    const dt = utcStr ? new Date(utcStr) : new Date();
    if (isNaN(dt.getTime())) throw new Error("Invalid date");
    const pktDate = new Date(dt.getTime() + 5 * 60 * 60 * 1000);
    const datePart = pktDate.toISOString().slice(0, 10);
    let hours = pktDate.getUTCHours();
    const minutes = String(pktDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(pktDate.getUTCSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${datePart} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm} PKT`;
  } catch {
    const now = new Date(Date.now() + 5 * 60 * 60 * 1000);
    return `${now.toISOString().slice(0, 10)} 12:00:00 PM PKT`;
  }
};

export const computeXrayClass = (rawXray = {}) => {
  const fluxVal = rawXray.flux;
  if (fluxVal !== undefined && fluxVal !== null) {
    const fluxFloat = parseFloat(fluxVal);
    if (!isNaN(fluxFloat)) {
      if (fluxFloat < 1e-7) return `A${(fluxFloat / 1e-8).toFixed(1)}`;
      if (fluxFloat < 1e-6) return `B${(fluxFloat / 1e-7).toFixed(1)}`;
      if (fluxFloat < 1e-5) return `C${(fluxFloat / 1e-6).toFixed(1)}`;
      if (fluxFloat < 1e-4) return `M${(fluxFloat / 1e-5).toFixed(1)}`;
      return `X${(fluxFloat / 1e-4).toFixed(1)}`;
    }
  }
  return rawXray.energy && rawXray.energy !== "0.1-0.8nm" ? String(rawXray.energy) : "C1.2";
};

export const parseKpIndex = (kpRaw) => {
  try {
    if (Array.isArray(kpRaw) && kpRaw.length > 1) {
      const lastEntry = kpRaw[kpRaw.length - 1];
      if (Array.isArray(lastEntry) && lastEntry.length > 1) {
        return Math.round(parseFloat(lastEntry[1]) * 10) / 10;
      }
      if (typeof lastEntry === 'object' && lastEntry !== null) {
        const val = lastEntry.kp_index ?? lastEntry.kp ?? lastEntry.estimated_kp;
        if (val !== undefined) return Math.round(parseFloat(val) * 10) / 10;
      }
    }
  } catch {}
  return 2.0;
};

export const parseBzGsm = (magRaw = {}) => {
  try {
    const bz = magRaw.bz_gsm ?? magRaw.bz;
    if (bz !== undefined && bz !== null) {
      return Math.round(parseFloat(bz) * 10) / 10;
    }
  } catch {}
  return -1.4;
};
