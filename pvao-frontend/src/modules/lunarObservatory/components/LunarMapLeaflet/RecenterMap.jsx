/**
 * Utility component to automatically pan the map.
 * Centers on the provided selectedFeature.
 */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function RecenterMap({ selectedFeature }) {
  const map = useMap();
  useEffect(() => {
    if (selectedFeature && selectedFeature.latitude !== undefined) {
      map.panTo([selectedFeature.latitude, selectedFeature.longitude], {
        animate: true,
      });
    }
  }, [selectedFeature, map]);
  return null;
}
