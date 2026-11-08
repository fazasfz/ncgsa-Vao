/**
 * Root entry point for the Earth Observatory module.
 * Composes the interactive map, overlays, and telemetry panels for Earth viewing.
 */
import React from 'react';
import 'leaflet/dist/leaflet.css';
import EarthMap from './EarthMap';
import './earthView.css';

const EarthView = () => {
  return (
    <div className="earthview-page">
      <div className="earthview-title-panel">
        <span className="earthview-title">EARTH OBSERVATORY</span>
        <span className="earthview-subtitle">Live map · click anywhere</span>
      </div>
      <EarthMap />
    </div>
  );
};

export default EarthView;