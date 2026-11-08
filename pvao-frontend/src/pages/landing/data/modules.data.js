/**
 * Static data store defining the available modules, their routes, and metadata.
 */
// pvao-frontend/src/pages/landing/data/modules.data.js
import imgZenith from '../../../assets/images/modules/sky-portal.jpg';
import imgAstronomicalProbe from '../../../assets/images/modules/astronomical-probe-tracker.jpg';
import imgSolarObservatory from '../../../assets/images/modules/solar-observatory.jpg';
import imgDeepSky from '../../../assets/images/modules/deep-sky.jpg';
import imgExora from '../../../assets/images/modules/exora-bg.jpg';
import imgLunar from '../../../assets/images/modules/lunar-bg.jpg';

export const modulesData = [
  { 
    id: 'solar-observatory', 
    name: 'Solar Observatory', 
    number: 'SEC.01',
    readout: 'WIND: 420.5 km/s', /* TODO: Wire up to live solar wind API */
    path: '/solar-observatory',
    description: "Track real-time solar activity, space weather telemetry, and multi-wavelength imagery from NASA's Solar Dynamics Observatory.",
    bgImage: imgSolarObservatory
  },
  {
    id: 'lunar-observatory',
    name: 'Lunar Observatory',
    number: 'SEC.02',
    readout: 'PHASE: 98% WAXING', /* TODO: Wire up to live moon phase calculation */
    path: '/lunar-observatory',
    description: 'Explore the Moon in 3D with live phase calculations, topological feature catalogs, and real-time orbital telemetry.',
    bgImage: imgLunar,
    sourceTag: 'NASA Goddard SVS • USGS Gazetteer'
  },
  { 
    id: 'exora', 
    name: 'Exora', 
    number: 'SEC.03',
    readout: 'EXOPLANETS: 5,602', /* TODO: Wire up to NASA Exoplanet Archive */
    path: '/exora',
    description: 'Unveil distant worlds, where every signal holds a story and every discovery reveals a new chapter of the cosmos.',
    bgImage: imgExora,
    externalUrl: 'https://exora-space.vercel.app/'
  },
  { 
    id: 'deep-sky-explorer', 
    name: 'Deep Sky Explorer', 
    number: 'SEC.04',
    readout: 'TARGETS: 24,101', /* TODO: Wire up to deep sky catalog count */
    path: '/deep-sky-explorer',
    description: 'Inspect deep-space objects, distant galaxies, and nebulae using interactive multi-wavelength all-sky survey data.',
    bgImage: imgDeepSky
  },
  { 
    id: 'zenith', 
    name: 'Zenith', 
    number: 'SEC.05',
    readout: 'VISIBLE: 1,402 OBJS', /* TODO: Wire up to active Stellarium object count */
    path: '/zenith',
    description: 'Navigate an interactive real-time planetarium of stars, constellations, and celestial bodies from any location on Earth.',
    bgImage: imgZenith
  },
  { 
    id: 'astronomical-probe-tracker', 
    name: 'Astronomical Probes', 
    number: 'SEC.06',
    readout: 'ACTIVE: 34 PROBES', /* TODO: Wire up to JPL Horizons data */
    path: '/astronomical-probe-tracker',
    description: 'Track the live trajectories, orbital paths, and telemetry of active interplanetary spacecraft and deep-space missions.',
    bgImage: imgAstronomicalProbe
  }
];
