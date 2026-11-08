/**
 * Lunar Ephemeris engine using astronomy-engine.
 * Computes observer-apparent lunar coordinates, illumination percentage,
 * distance, moonrise/moonset, and lunar phase events for the Pakistan Virtual Observatory.
 */
import {
  Observer,
  Body,
  Equator,
  Illumination,
  EclipticLongitude,
  SearchRiseSet,
  SearchMoonPhase,
  MoonPhase
} from 'astronomy-engine';

const KM_PER_AU = 149597870.7;
const OBSERVER_LAT = 33.7294;
const OBSERVER_LON = 73.0931;

const formatRa = (raHours) => {
  const h = Math.floor(raHours);
  const mFloat = (raHours - h) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
};

const formatDec = (decDeg) => {
  const sign = decDeg >= 0 ? '+' : '-';
  const abs = Math.abs(decDeg);
  const d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${sign}${String(d).padStart(2, '0')}deg ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
};

const getPhaseName = (phaseAngle) => {
  const pa = (phaseAngle % 360 + 360) % 360;
  if (pa < 1.0 || pa > 359.0) return "New Moon";
  if (pa < 89.0) return "Waxing Crescent";
  if (pa < 91.0) return "First Quarter";
  if (pa < 179.0) return "Waxing Gibbous";
  if (pa < 181.0) return "Full Moon";
  if (pa < 269.0) return "Waning Gibbous";
  if (pa < 271.0) return "Third Quarter";
  return "Waning Crescent";
};

export const getLiveMoonData = (targetDate = null, lat = OBSERVER_LAT, lon = OBSERVER_LON) => {
  const date = targetDate instanceof Date ? targetDate : (targetDate ? new Date(targetDate) : new Date());
  const observer = new Observer(lat, lon, 0);

  // Apparent topocentric coordinates for the observer
  const moonEquator = Equator(Body.Moon, date, observer, true, true);
  const moonIllum = Illumination(Body.Moon, date);
  const phaseAngle = MoonPhase(date);

  const percentIlluminated = Math.round(moonIllum.phase_fraction * 100 * 100) / 100;
  const distanceKm = Math.round(moonEquator.dist * KM_PER_AU * 100) / 100;

  // Search next risings and settings
  const nextRise = SearchRiseSet(Body.Moon, observer, +1, date, 2);
  const nextSet = SearchRiseSet(Body.Moon, observer, -1, date, 2);

  // Next full moon (phase angle 180) and new moon (phase angle 0)
  const nextNewPhase = SearchMoonPhase(0, date, 45);
  const nextFullPhase = SearchMoonPhase(180, date, 45);

  return {
    phase_name: getPhaseName(phaseAngle),
    illumination_percentage: percentIlluminated,
    distance_km: distanceKm,
    ra: formatRa(moonEquator.ra),
    dec: formatDec(moonEquator.dec),
    sun_moon_angle: Math.round(phaseAngle * 100) / 100,
    rise_time: nextRise ? nextRise.date.toISOString() : null,
    set_time: nextSet ? nextSet.date.toISOString() : null,
    next_full_moon: nextFullPhase ? nextFullPhase.date.toISOString() : null,
    next_new_moon: nextNewPhase ? nextNewPhase.date.toISOString() : null
  };
};
