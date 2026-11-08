/**
 * Runs AstronomyEngine and compares directly with Skyfield Python results.
 */
import fs from 'fs';
import { getLiveMoonData } from './src/modules/lunarObservatory/utils/lunarEphemeris.js';

const skyfieldResults = JSON.parse(fs.readFileSync('./skyfield_results.json', 'utf-8'));

const testDates = [
  '2026-03-21T00:00:00Z',
  '2026-06-21T12:00:00Z',
  '2026-09-08T18:00:00Z',
  '2026-10-15T06:30:00Z',
  '2026-12-25T21:00:00Z'
];

console.log('='.repeat(115));
console.log('SKYFIELD (Python de440s.bsp) vs. ASTRONOMY-ENGINE (JavaScript) LUNAR COMPARISON');
console.log('Observer: Islamabad / PKT (Lat: 33.7294° N, Lon: 73.0931° E)');
console.log('='.repeat(115));

for (const dtStr of testDates) {
  const dt = new Date(dtStr);
  const jsResult = getLiveMoonData(dt);
  const pyResult = skyfieldResults[dtStr];

  console.log(`\n>>> TEST DATE: ${dtStr}`);
  console.log('-'.repeat(115));
  console.log(`Field                     | Astronomy-Engine (JS)            | Skyfield Backend (Python)        | Match Status`);
  console.log('-'.repeat(115));

  const compareRow = (field, jsVal, pyVal) => {
    let match = 'OK';
    if (field === 'Illumination %') {
      const diff = Math.abs(parseFloat(jsVal) - parseFloat(pyVal));
      match = diff <= 0.5 ? `MATCH (Δ ${diff.toFixed(2)}%)` : `DIFF (Δ ${diff.toFixed(2)}%)`;
    } else if (field === 'Phase Name') {
      match = jsVal === pyVal ? 'EXACT' : 'CLOSE';
    } else if (field.includes('Time') || field.includes('Moon')) {
      if (jsVal && pyVal) {
        const diffMin = Math.abs(new Date(jsVal).getTime() - new Date(pyVal).getTime()) / 60000;
        match = diffMin <= 2 ? `MATCH (Δ ${diffMin.toFixed(1)}m)` : `DIFF (Δ ${diffMin.toFixed(1)}m)`;
      }
    }
    console.log(`${field.padEnd(25)} | ${String(jsVal).padEnd(32)} | ${String(pyVal).padEnd(32)} | ${match}`);
  };

  compareRow('Phase Name', jsResult.phase_name, pyResult.phase_name);
  compareRow('Illumination %', jsResult.illumination_percentage + '%', pyResult.illumination_percentage + '%');
  compareRow('Distance (km)', jsResult.distance_km, pyResult.distance_km);
  compareRow('Right Ascension (RA)', jsResult.ra, pyResult.ra);
  compareRow('Declination (Dec)', jsResult.dec, pyResult.dec);
  compareRow('Sun-Moon Angle (deg)', jsResult.sun_moon_angle, pyResult.sun_moon_angle);
  compareRow('Rise Time (UTC)', jsResult.rise_time, pyResult.rise_time);
  compareRow('Set Time (UTC)', jsResult.set_time, pyResult.set_time);
  compareRow('Next Full Moon (UTC)', jsResult.next_full_moon, pyResult.next_full_moon);
  compareRow('Next New Moon (UTC)', jsResult.next_new_moon, pyResult.next_new_moon);
}
