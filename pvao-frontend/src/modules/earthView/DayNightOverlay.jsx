/**
 * Renders a dynamic terminator line and night-shade overlay on the interactive Earth map.
 * Indicates current daytime and nighttime regions globally.
 */
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import terminator from '@joergdietrich/leaflet.terminator';

const DayNightOverlay = () => {
  const map = useMap();

  useEffect(() => {
    const nightShade = terminator({
      fillColor: '#0A0B0D',
      fillOpacity: 0.65,
      stroke: true,
      color: '#E0A85E',
      weight: 1.5,
      opacity: 0.8,
      interactive: false,
    });
    nightShade.addTo(map);

    const interval = setInterval(() => nightShade.setTime(), 60000);

    return () => {
      clearInterval(interval);
      map.removeLayer(nightShade);
    };
  }, [map]);

  return null;
};

export default DayNightOverlay;