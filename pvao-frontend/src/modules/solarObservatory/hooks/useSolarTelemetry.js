import { useState, useEffect } from 'react';
import {
  SDO_BASE,
  SOHO_BASE,
  convertUtcToPkt,
  computeXrayClass,
  parseKpIndex,
  parseBzGsm
} from '../utils/solarCalculations';

const NOAA_ENDPOINTS = {
  WIND: "https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json",
  MAG: "https://services.swpc.noaa.gov/json/rtsw/rtsw_mag_1m.json",
  KP: "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
  XRAY: "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json",
  SUNSPOTS: "https://services.swpc.noaa.gov/json/solar_regions.json"
};

const safeFetch = async (url) => {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch {}
  return null;
};

export const useSolarTelemetry = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const [windRaw, magRaw, kpRaw, xrayRaw, spotsRaw] = await Promise.all([
        safeFetch(NOAA_ENDPOINTS.WIND),
        safeFetch(NOAA_ENDPOINTS.MAG),
        safeFetch(NOAA_ENDPOINTS.KP),
        safeFetch(NOAA_ENDPOINTS.XRAY),
        safeFetch(NOAA_ENDPOINTS.SUNSPOTS)
      ]);

      if (!isMounted) return;

      const windData = Array.isArray(windRaw) && windRaw.length ? windRaw[windRaw.length - 1] : (windRaw || {});
      const magData = Array.isArray(magRaw) && magRaw.length ? magRaw[magRaw.length - 1] : (magRaw || {});
      const kpData = Array.isArray(kpRaw) ? kpRaw : [];
      const xrayData = Array.isArray(xrayRaw) && xrayRaw.length ? xrayRaw[xrayRaw.length - 1] : (xrayRaw || {});
      const spotsData = Array.isArray(spotsRaw) ? spotsRaw : [];

      const rawTime = windData.time_tag || xrayData.time_tag || "";
      const rawSpeed = windData.proton_speed ?? windData.wind_speed ?? 337.8;
      const rawDensity = windData.proton_density ?? windData.density ?? 0.7;

      setTelemetry({
        solar_wind_speed: Math.round(parseFloat(rawSpeed) * 10) / 10,
        proton_density: Math.round(parseFloat(rawDensity) * 10) / 10,
        xray_flux: computeXrayClass(xrayData),
        sunspot_count: spotsData.length,
        kp_index: parseKpIndex(kpData),
        bz_gsm: parseBzGsm(magData),
        timestamp_pkt: convertUtcToPkt(rawTime),
        active_regions: spotsData.slice(0, 3),
        live_images: {
          aia_171: `${SDO_BASE}/latest_1024_0171.jpg`,
          aia_304: `${SDO_BASE}/latest_1024_0304.jpg`,
          hmi_mag: `${SDO_BASE}/latest_1024_HMIIC.jpg`,
          lasco_c3: `${SOHO_BASE}/c3/1024/latest.jpg`,
          aia_131: `${SDO_BASE}/latest_1024_0131.jpg`
        }
      });
      setLoading(false);
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  return { telemetry, loading };
};
