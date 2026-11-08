/**
 * Search SIMBAD for object details and MAST for available observations.
 * Returns: info, images, loading, error states, and search function.
 */
import { useCallback, useState } from 'react';
import { queryMastImages } from '../utils/mastClient';
import { querySimbadObject } from '../utils/simbadClient';

const toNumberOrNull = (value) => {
  if (value == null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const mapSimbadInfo = (result) => ({
  name: result.name ?? null,
  type: result.type ?? 'Unknown',
  aliases: Array.isArray(result.aliases) ? result.aliases : [],
  ra: toNumberOrNull(result.ra),
  dec: toNumberOrNull(result.dec),
  magnitude: toNumberOrNull(result.magnitude),
  magnitude_b: toNumberOrNull(result.magnitude_b),
  spectral_type: result.spectral_type ?? null,
  morphology: result.morphology ?? null,
  size_arcmin: toNumberOrNull(result.size_arcmin),
  distance: toNumberOrNull(result.distance),
  distance_unit: result.distance_unit ?? null,
  redshift: toNumberOrNull(result.redshift),
  radial_velocity: toNumberOrNull(result.radial_velocity),
});

const mapMastImages = (results) =>
  (Array.isArray(results) ? results : []).map((result) => ({
    mission: result.mission ?? null,
    instrument: result.instrument ?? null,
    target: result.target ?? null,
  }));

/** Search SIMBAD and MAST independently so one service can fail without discarding the other result. */
export function useObjectSearch() {
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (objectName) => {
    if (!objectName) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    setImages([]);

    const [simbadResult, mastResult] = await Promise.allSettled([
      querySimbadObject(objectName),
      queryMastImages(objectName),
    ]);

    let infoError = null;
    if (simbadResult.status === 'fulfilled' && !simbadResult.value.error) {
      setInfo(mapSimbadInfo(simbadResult.value));
    } else {
      const reason = simbadResult.status === 'rejected'
        ? simbadResult.reason?.message
        : simbadResult.value.error;
      infoError = /was not found in SIMBAD/i.test(reason ?? '')
        ? `Object not found: ${objectName}.`
        : 'SIMBAD lookup failed due to a network or CORS error.';
    }

    const mastUnavailable = mastResult.status === 'rejected'
      || Boolean(mastResult.value?.error);
    if (mastResult.status === 'fulfilled' && !mastResult.value.error) {
      setImages(mapMastImages(mastResult.value.results));
    }

    setError(
      infoError
      ?? (mastUnavailable ? 'MAST unavailable; object details may still be available.' : null),
    );
    setLoading(false);
  }, []);

  return { search, info, images, loading, error };
}
