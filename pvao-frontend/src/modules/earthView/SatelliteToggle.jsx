/**
 * UI toggle control to switch between different map baselayers (Map, Satellite, Lights).
 * Props: mode (string), onChange (function).
 */
import React from 'react';
import './satelliteToggle.css';

const MODES = [
  { id: 'map', label: 'MAP' },
  { id: 'satellite', label: 'SATELLITE' },
  { id: 'lights', label: 'LIGHTS' },
];

const SatelliteToggle = ({ mode, onChange }) => (
  <div className="earthview-toggle">
    {MODES.map((m) => (
      <button
        key={m.id}
        className={`earthview-toggle-btn ${mode === m.id ? 'earthview-toggle-btn--active' : ''}`}
        onClick={() => onChange(m.id)}
      >
        {m.label}
      </button>
    ))}
  </div>
);

export default SatelliteToggle;