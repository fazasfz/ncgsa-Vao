/**
 * Custom hook to orchestrate fetching live lunar telemetry and the core feature list.
 * Inputs: targetDate (Date). Returns: liveData, features, loading, error.
 */
import { useState, useEffect } from 'react';
import { fetchLiveData, fetchFeatures } from '../api/lunarObservatoryApi';

export const useLunarData = (targetDate = null) => {
  const [liveData, setLiveData] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [data, fData] = await Promise.all([
          fetchLiveData(targetDate),
          fetchFeatures()
        ]);
        
        if (mounted) {
          setLiveData(data);
          setFeatures(fData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to fetch lunar data:", err);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Optionally set up polling if we want live updates without refresh
    const intervalId = setInterval(loadData, 60000); // refresh every minute

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [targetDate]);

  return { liveData, features, loading, error };
};
