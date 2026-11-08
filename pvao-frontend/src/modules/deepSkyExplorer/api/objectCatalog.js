/**
 * Static curated catalog of well-known deep sky objects (Messier objects).
 * Used as a default dataset before falling back to live MAST/NED queries.
 */
// A small curated catalog of well-known deep sky objects, grouped by type.
// Later this can be replaced/expanded with live MAST/NED queries.

export const objectCatalog = {
  galaxies: [
    { name: 'Andromeda Galaxy', id: 'M31', ra: 10.6847083333, dec: 41.26875 },
    { name: 'Whirlpool Galaxy', id: 'M51', ra: 202.469575, dec: 47.1952583333 },
    { name: 'Sombrero Galaxy', id: 'M104', ra: 189.9976327459, dec: -11.6230544944 },
    { name: 'Pinwheel Galaxy', id: 'M101', ra: 210.8024291667, dec: 54.34875 },
  ],
  nebulas: [
    { name: 'Orion Nebula', id: 'M42', ra: 83.8201, dec: -5.3876 },
    { name: 'Ring Nebula', id: 'M57', ra: 283.3962365246, dec: 33.0291342465 },
    { name: 'Crab Nebula', id: 'M1', ra: 83.6324, dec: 22.0174 },
    { name: 'Eagle Nebula', id: 'M16', ra: 274.688, dec: -13.792 },
  ],
  starClusters: [
    { name: 'Pleiades', id: 'M45', ra: 56.6008333333, dec: 24.1138888889 },
    { name: 'Hercules Cluster', id: 'M13', ra: 250.423475, dec: 36.4613194444 },
    { name: 'Beehive Cluster', id: 'M44', ra: 130.0541666667, dec: 19.6211111111 },
    { name: 'Wild Duck Cluster', id: 'M11', ra: 282.7658333333, dec: -6.2719444444 },
  ],
};