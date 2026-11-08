import { useState, useEffect } from 'react';

const NOAA_SOLAR_CYCLE_URL = 'https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json';

export const useSolarCycle = () => {
  const [cycleData, setCycleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch(NOAA_SOLAR_CYCLE_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const recent = data.slice(-30).map((item) => {
            const ssn = typeof item.ssn === 'number' && item.ssn >= 0 ? item.ssn : 0;
            const smoothed = typeof item.smoothed_ssn === 'number' && item.smoothed_ssn >= 0 ? item.smoothed_ssn : 0;
            return {
              date: item['time-tag'] || item['month'] || '',
              ssn,
              smoothed,
              radio_flux: ssn * 1.2,
              dots: ssn * 0.4
            };
          });
          setCycleData(recent);
        } else {
          setError('No cycle data returned from NOAA.');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return { cycleData, loading, error };
};
