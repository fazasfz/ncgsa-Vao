import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS } from './routePaths';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/landing/LandingPage';
import CreditsPage from '../pages/credits/CreditsPage';
import DataSourcesPage from '../pages/dataSources/DataSourcesPage';
import GlossaryPage from '../pages/glossary/GlossaryPage';
import AstroCopilotWorkspace from '../pages/astroCopilot/AstroCopilotWorkspace';
import NotFoundPage from '../pages/notFound/NotFoundPage';

// Sub-pages
import Zenith from '../modules/zenith';
import EarthView from '../modules/earthView';
import AstronomicalProbeTracker from '../modules/astronomicalProbeTracker';

import SolarSystemSimulator from '../modules/solarSystemSimulator';
import Exora from '../modules/exora';
import DeepSkyExplorer from '../modules/deepSkyExplorer';
import ObservationPlanner from '../modules/observationPlanner';

const SolarObservatory = React.lazy(() => import('../modules/solarObservatory'));
const LunarObservatory = React.lazy(() => import('../modules/lunarObservatory'));

import LoadingOverlay from '../components/common/LoadingOverlay/LoadingOverlay';

const UnderConstruction = ({ moduleName }) => (
  <div style={{ padding: '100px', textAlign: 'center', color: 'var(--starlight)' }}>
    <h2>{moduleName}</h2>
    <p>This module is under construction.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<LoadingOverlay />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={PATHS.LANDING} element={<LandingPage />} />
          
          <Route path={PATHS.ZENITH} element={<Zenith />} />
          {/* <Route path={PATHS.EARTH_VIEW} element={<EarthView />} /> */}
          <Route path={PATHS.ASTRONOMICAL_PROBE_TRACKER} element={<AstronomicalProbeTracker />} />

          <Route path={PATHS.SOLAR_SYSTEM_SIMULATOR} element={<SolarSystemSimulator />} />
          <Route path={PATHS.SOLAR_OBSERVATORY} element={<SolarObservatory />} />

          <Route path={PATHS.EXORA} element={<Exora />} />
          <Route path={PATHS.DEEP_SKY_EXPLORER} element={<DeepSkyExplorer />} />

          <Route path={PATHS.OBSERVATION_PLANNER} element={<ObservationPlanner />} />
          <Route path={PATHS.LUNAR_OBSERVATORY} element={<LunarObservatory />} />
          <Route path={PATHS.MOON_MODULE} element={<LunarObservatory />} />

          <Route path={PATHS.DATA_SOURCES} element={<DataSourcesPage />} />
          <Route path={PATHS.GLOSSARY} element={<GlossaryPage />} />
          <Route path={PATHS.CREDITS} element={<CreditsPage />} />
          <Route path={PATHS.ASTRO_COPILOT_WORKSPACE} element={<AstroCopilotWorkspace />} />
          <Route path={PATHS.ASTROCOPILOT} element={<AstroCopilotWorkspace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
