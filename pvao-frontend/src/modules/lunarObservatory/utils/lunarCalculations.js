import curatedFeatures from '../data/lunar_features_curated.json';
import fullFeatures from '../data/lunar_features_full.json';

const MOON_RADIUS_KM = 1737.4;

export const haversineMoon = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dphi = toRad(lat2 - lat1);
  const dlambda = toRad(lon2 - lon1);

  const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
  return 2 * MOON_RADIUS_KM * Math.asin(Math.sqrt(a));
};

export const getFeatures = (category = null, dataset = 'curated') => {
  const data = dataset === 'full' ? fullFeatures : curatedFeatures;
  if (category && category.toLowerCase() !== 'all') {
    const catLower = category.toLowerCase();
    return data.filter(
      (f) =>
        (f.category && f.category.toLowerCase() === catLower) ||
        (f.type && f.type.toLowerCase() === catLower)
    );
  }
  return data;
};

export const getFeatureById = (featureId) => {
  return fullFeatures.find((f) => f.id === featureId) || null;
};

export const getNearbyFeatures = (featureId, limit = 5) => {
  const target = getFeatureById(featureId);
  if (!target) return [];

  const { latitude: lat, longitude: lon } = target;
  const nearby = [];

  for (const f of fullFeatures) {
    if (f.id === featureId) continue;
    const dist = haversineMoon(lat, lon, f.latitude, f.longitude);
    nearby.push({ ...f, distance_km: Math.round(dist * 10) / 10 });
  }

  nearby.sort((a, b) => a.distance_km - b.distance_km);
  return nearby.slice(0, limit);
};
