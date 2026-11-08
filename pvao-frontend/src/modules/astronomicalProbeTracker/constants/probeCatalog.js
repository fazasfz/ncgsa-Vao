export const PROBE_CATALOG = {
  earth: [
    { id: "iss", name: "International Space Station (ISS)", horizons_id: "-125544", norad_id: "25544", inclination: "51.64°", period: "92.68 min" },
    { id: "hubble", name: "Hubble Space Telescope", horizons_id: "-48", norad_id: "20580", inclination: "28.47°", period: "95.42 min" },
    { id: "tess", name: "TESS Observatory", horizons_id: "-95", norad_id: "43435", inclination: "54.00°", period: "13.70 days" },
  ],
  moon: [
    { id: "lro", name: "Lunar Reconnaissance Orbiter (LRO)", horizons_id: "-85", inclination: "88.50°", period: "113.00 min" },
    { id: "capstone", name: "CAPSTONE Lunar CubeSat", horizons_id: "-156", inclination: "89.20°", period: "7.00 days" },
    { id: "chandrayaan2", name: "Chandrayaan-2 Orbiter", horizons_id: "-155", inclination: "90.00°", period: "118.00 min" },
  ],
  mars: [
    { id: "mro", name: "Mars Reconnaissance Orbiter (MRO)", horizons_id: "-74", inclination: "92.60°", period: "112.00 min" },
    { id: "mars_odyssey", name: "2001 Mars Odyssey", horizons_id: "-53", inclination: "93.10°", period: "120.00 min" },
    { id: "tgo", name: "ExoMars Trace Gas Orbiter (TGO)", horizons_id: "-143", inclination: "74.00°", period: "120.00 min" },
    { id: "hope", name: "Hope Probe (Emirates Mars Mission)", horizons_id: "-62", inclination: "25.00°", period: "55.00 hrs" },
  ],
  sun: [
    { id: "jwst", name: "James Webb Space Telescope (JWST)", horizons_id: "-170", norad_id: "49961", inclination: "5.28°", period: "Sun-Earth L2 (365.25 days)" },
    { id: "parker", name: "Parker Solar Probe", horizons_id: "-96", inclination: "3.40°", period: "88.00 days" },
    { id: "solar_orbiter", name: "Solar Orbiter", horizons_id: "-144", inclination: "18.00°", period: "168.00 days" },
    { id: "voyager1", name: "Voyager 1", horizons_id: "-31", inclination: "35.00°", period: "Interstellar" },
    { id: "voyager2", name: "Voyager 2", horizons_id: "-32", inclination: "79.00°", period: "Interstellar" },
    { id: "juno", name: "Juno Spacecraft", horizons_id: "-61", inclination: "6.50°", period: "53.00 days" },
    { id: "new_horizons", name: "New Horizons", horizons_id: "-98", inclination: "2.40°", period: "Interstellar" },
    { id: "bepicolombo", name: "BepiColombo", horizons_id: "-121", inclination: "7.00°", period: "Heliocentric Cruise" },
  ]
};

export const CENTER_MAP = {
  earth: "@399",
  moon: "@301",
  mars: "@499",
  sun: "@10"
};

export const SPEED_OF_LIGHT_KMS = 299792.458;
export const AU_TO_KM = 149597870.7;

export const BODY_RADII = {
  earth: 6378.137,
  moon: 1737.4,
  mars: 3389.5,
  sun: 696340.0
};

export const BODY_MU = {
  earth: 398600.4418,
  moon: 4902.8,
  mars: 42828.375,
  sun: 132712440018.0
};

export const COORD_FRAMES = {
  earth: "ICRF / Geocentric @399",
  moon: "ICRF / Selenocentric @301",
  mars: "ICRF / Areocentric @499",
  sun: "ICRF / Heliocentric @10"
};

export const BODY_EARTH_OWLT_SEC = {
  earth: 0.0,
  moon: 1.282,
  mars: 750.5,
  sun: 499.0
};
