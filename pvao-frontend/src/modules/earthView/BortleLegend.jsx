/**
 * Renders a color-coded legend explaining the Bortle dark-sky scale.
 * Maps numeric scale values to descriptive labels and representative colors.
 */
import React from 'react';
import { BORTLE_CLASSES } from './bortleColor';
import './bortleLegend.css';

const BortleLegend = () => (
  <div className="earthview-bortle-legend">
    <div className="earthview-bortle-title">BORTLE DARK-SKY SCALE</div>
    {BORTLE_CLASSES.map((c) => (
      <div key={c.n} className="earthview-bortle-row">
        <span className="earthview-bortle-swatch" style={{ background: `rgb(${c.color.join(',')})` }} />
        <span className="earthview-bortle-num">{c.n}</span>
        <span className="earthview-bortle-label">{c.label}</span>
      </div>
    ))}
  </div>
);

export default BortleLegend;