/**
 * Custom hook to manage the lunar feature catalogue state using frontend calculation/data.
 */
import { useState, useEffect, useMemo } from 'react';
import { getFeatures, getFeatureById, getNearbyFeatures } from '../utils/lunarCalculations';

export const useFeatureCatalogue = (viewMode = '3D') => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [nearbyFeatures, setNearbyFeatures] = useState([]);

  useEffect(() => {
    setLoading(true);
    try {
      const dataset = viewMode === '3D' ? 'curated' : 'full';
      const rawFeatures = getFeatures(activeCategory, dataset);
      const mappedFeatures = rawFeatures.map(f => ({
        ...f,
        diameter_km: f.diameter !== undefined && f.diameter !== null ? f.diameter : null,
        type: f.type || 'Unknown'
      }));
      setFeatures(mappedFeatures);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    setSelectedFeatureId(null);
  }, [activeCategory, viewMode]);

  useEffect(() => {
    if (!selectedFeatureId) {
      setSelectedFeature(null);
      setNearbyFeatures([]);
      return;
    }
    const feature = getFeatureById(selectedFeatureId);
    const nearby = getNearbyFeatures(selectedFeatureId, 5);
    setSelectedFeature(feature);
    setNearbyFeatures(nearby);
  }, [selectedFeatureId]);

  const filteredFeatures = useMemo(() => {
    return features.filter(f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [features, searchTerm]);

  useEffect(() => {
    if (filteredFeatures.length > 0 && !selectedFeatureId && !loading) {
      setSelectedFeatureId(filteredFeatures[0].id);
    }
  }, [filteredFeatures, selectedFeatureId, loading]);

  return {
    features: filteredFeatures,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    selectedFeatureId,
    setSelectedFeatureId,
    selectedFeature,
    nearbyFeatures,
  };
};
