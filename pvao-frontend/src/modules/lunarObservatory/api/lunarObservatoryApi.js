// src/modules/lunarObservatory/api/lunarObservatoryApi.js
/**
 * Lunar Observatory API client.
 * Fetches live lunar ephemeris telemetry directly from the frontend using astronomy-engine.
 */
import { getLiveMoonData } from '../utils/lunarEphemeris';
import { getFeatures } from '../utils/lunarCalculations';

export const fetchLiveData = async (targetDate = null) => {
  // Compute live data on the client side.
  return getLiveMoonData(targetDate);
};

export const fetchFeatures = async (category = null, dataset = 'curated') => {
  return getFeatures(category, dataset);
};
