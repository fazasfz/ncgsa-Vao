/**
 * Defines the Bortle scale classification logic and color mappings.
 * Provides utility functions to map pixel brightness to dark-sky classes.
 */
export const BORTLE_CLASSES = [
  { max: 20, n: 1, label: 'Excellent dark sky', color: [10, 10, 20] },
  { max: 40, n: 2, label: 'Typical dark site', color: [10, 60, 120] },
  { max: 60, n: 3, label: 'Rural sky', color: [10, 130, 180] },
  { max: 90, n: 4, label: 'Rural/suburban transition', color: [20, 170, 120] },
  { max: 120, n: 5, label: 'Suburban sky', color: [120, 200, 60] },
  { max: 150, n: 6, label: 'Bright suburban', color: [220, 220, 40] },
  { max: 190, n: 7, label: 'Suburban/urban transition', color: [240, 150, 30] },
  { max: 225, n: 8, label: 'City sky', color: [230, 60, 30] },
  { max: 256, n: 9, label: 'Inner-city sky', color: [255, 255, 255] },
];

export const classify = (brightness) =>
  BORTLE_CLASSES.find((c) => brightness <= c.max) || BORTLE_CLASSES[BORTLE_CLASSES.length - 1];