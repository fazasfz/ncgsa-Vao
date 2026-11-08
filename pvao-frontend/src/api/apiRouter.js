/**
 * Central Frontend JavaScript API Router & Service Aggregator.
 * Replaces the legacy Python FastAPI backend routing with pure client-side JavaScript integrations.
 */

// Astronomical Probe Tracker (NASA JPL Horizons Ephemeris)
export {
  getSupportedTargets as getProbeTargets,
  getProbesByTarget,
  getLiveTelemetry as getProbeLiveTelemetry
} from '../modules/astronomicalProbeTracker/probeApi';

// Deep Sky Explorer (SIMBAD & MAST Clients)
export { default as simbadClient } from '../modules/deepSkyExplorer/utils/simbadClient';
export { default as mastClient } from '../modules/deepSkyExplorer/utils/mastClient';

// NASA Open APIs & APOD
export * from './nasaApi';
export * from './apod';

/**
 * Unified API Client mapping module endpoints to JavaScript client services.
 */
export const apiRouter = {
  version: '2.0.0',
  architecture: 'Pure JavaScript Client (Zero Python Backend)',
  endpoints: {
    probes: '/src/modules/astronomicalProbeTracker/probeApi.js',
    deepSky: '/src/modules/deepSkyExplorer/utils/',
    nasa: '/src/api/nasaApi.js',
  }
};

export default apiRouter;
