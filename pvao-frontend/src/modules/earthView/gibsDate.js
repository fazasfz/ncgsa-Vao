/**
 * Utility function to compute the correct date format for NASA GIBS satellite imagery requests.
 * Accounts for data availability delays by offsetting the current date.
 */
export const getGibsDate = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
};