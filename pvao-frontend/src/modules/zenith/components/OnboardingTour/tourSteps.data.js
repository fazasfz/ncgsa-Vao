/**
 * Static data store defining the sequence of steps for the Zenith Sky Portal onboarding tour.
 * Matches the bottom toolbar icons and corner controls in Stellarium Web.
 */
export const tourSteps = [
  {
    id: 'constellations',
    title: '1. Constellations',
    description: 'Toggle constellation stick figures and connecting lines between stars to map out patterns across the celestial sphere.',
    image: '/assets/sky-portal/constellations.svg'
  },
  {
    id: 'constellations-art',
    title: '2. Constellations Art',
    description: 'Overlay artistic illustrations and mythological figures onto constellations across the night sky.',
    image: '/assets/sky-portal/constellation-art.svg'
  },
  {
    id: 'atmosphere',
    title: '3. Atmosphere',
    description: 'Toggle daylight scattering and atmospheric glow to simulate daytime or switch to a pristine, dark-sky view.',
    image: '/assets/sky-portal/atmosphere.svg'
  },
  {
    id: 'landscape',
    title: '4. Landscape',
    description: 'Show or hide the horizon terrain and ground silhouette to observe stars and planets below the local horizon.',
    image: '/assets/sky-portal/landscape.svg'
  },
  {
    id: 'azimuthal-grid',
    title: '5. Azimuthal Grid',
    description: 'Display coordinate grid lines based on Altitude (elevation above horizon) and Azimuth (compass direction).',
    image: '/assets/sky-portal/azimuthal-grid.svg'
  },
  {
    id: 'equatorial-grid',
    title: '6. Equatorial Grid',
    description: 'Display celestial coordinate lines based on Right Ascension (RA) and Declination (Dec) aligned with celestial poles.',
    image: '/assets/sky-portal/equatorial-grid.svg'
  },
  {
    id: 'dso',
    title: '7. Deep Sky Objects',
    description: 'Highlight and label deep-sky objects including nebulae, galaxies, star clusters, and deep space targets.',
    image: '/assets/sky-portal/dso.svg'
  },
  {
    id: 'night-mode',
    title: '8. Night Mode',
    description: 'Switch to a red-light display mode to preserve eye night-vision adaptation during live telescope sessions.',
    image: '/assets/sky-portal/night-mode.svg'
  },
  {
    id: 'full-screen',
    title: '9. Full Screen',
    description: 'Expand the sky portal to true full-screen mode for an uninterrupted, immersive planetarium observation.',
    image: '/assets/sky-portal/full-screen.svg'
  },
  {
    id: 'location',
    title: '10. Location (Bottom-Left)',
    description: 'Located in the bottom-left corner: check and configure your geographical observing site, latitude, longitude, and elevation.',
    image: '/assets/sky-portal/location.svg'
  },
  {
    id: 'time',
    title: '11. Time & Date (Bottom-Right)',
    description: 'Located in the bottom-right corner: view live time, change simulation date, and play, pause, or fast-forward celestial motion.',
    image: '/assets/sky-portal/time.svg'
  }
];

