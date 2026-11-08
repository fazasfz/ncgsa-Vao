// modules/deepSkyExplorer/components/ObjectInfoPanel.jsx
//
// Stellarium-style detail panel plus image download.
//
// Two download routes, because they serve different purposes:
//
//   Save current view — aladin.getViewDataURL() grabs exactly what's on screen,
//                       including the current colormap and zoom. Instant.
//
//   Download PNG/FITS — the CDS hips2fits service renders a fresh cutout
//                       server-side at any size, so it isn't limited by the
//                       on-screen canvas. FITS keeps the real pixel values,
//                       which is what you'd open in DS9 or astropy.

import React, { useState } from 'react';
import { BANDS } from '../hooks/useAladin';

const HIPS2FITS = 'https://alasky.cds.unistra.fr/hips-image-services/hips2fits';

function Row({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="oi-row">
      <span className="oi-label">{label}</span>
      <span className="oi-value">{value}</span>
    </div>
  );
}

/** Decimal degrees to sexagesimal, the way catalogues print it. */
function fmtRA(deg) {
  if (deg == null) return null;
  const h = deg / 15;
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  const ss = ((h - hh) * 60 - mm) * 60;
  return `${hh}h ${mm}m ${ss.toFixed(1)}s`;
}

function fmtDec(deg) {
  if (deg == null) return null;
  const sign = deg < 0 ? '-' : '+';
  const a = Math.abs(deg);
  const dd = Math.floor(a);
  const mm = Math.floor((a - dd) * 60);
  const ss = ((a - dd) * 60 - mm) * 60;
  return `${sign}${dd}° ${mm}' ${ss.toFixed(1)}"`;
}

export default function ObjectInfoPanel({ info, aladin, bandKey }) {
  const [busy, setBusy] = useState(false);
  if (!info) return null;

  const band = BANDS[bandKey] ?? BANDS.Optical;
  const safeName = (info.name || 'object').replace(/[^\w-]+/g, '_');

  const triggerDownload = (href, filename) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadFull = async (format) => {
    if (info.ra == null || info.dec == null) return;
    setBusy(true);
    try {
      const fov = aladin ? aladin.getFov()[0] : 3;
      const params = new URLSearchParams({
        hips: band.id, // hips2fits wants the registry id, not the tile URL
        ra: info.ra.toFixed(6),
        dec: info.dec.toFixed(6),
        fov: fov.toFixed(6),
        width: '1600',
        height: '1200',
        projection: 'TAN',
        coordsys: 'icrs',
        format,
      });
      const res = await fetch(`${HIPS2FITS}?${params}`);
      if (!res.ok) throw new Error(`hips2fits returned ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${safeName}_${bandKey}.${format === 'fits' ? 'fits' : 'png'}`);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error('[deepSky] download failed', e);
      alert('Download failed — see console for details.');
    } finally {
      setBusy(false);
    }
  };

  const downloadSnapshot = () => {
    if (!aladin) {
      downloadFull('png');
      return;
    }
    try {
      const url = aladin.getViewDataURL({ format: 'image/png' });
      triggerDownload(url, `${safeName}_${bandKey}_view.png`);
    } catch (e) {
      console.error('[deepSky] snapshot failed', e);
    }
  };

  return (
    <div className="object-info">
      <div className="oi-header">
        <h3>{info.name}</h3>
        <span className="oi-type">{info.type}</span>
      </div>

      {info.aliases?.length > 0 && (
        <p className="oi-aliases">Also known as: {info.aliases.join(' · ')}</p>
      )}

      <div className="oi-grid">
        <Row label="Right ascension" value={fmtRA(info.ra)} />
        <Row label="Declination" value={fmtDec(info.dec)} />
        <Row
          label="Magnitude (V)"
          value={info.magnitude != null ? info.magnitude.toFixed(2) : null}
        />
        <Row
          label="Magnitude (B)"
          value={info.magnitude_b != null ? info.magnitude_b.toFixed(2) : null}
        />
        <Row label="Spectral type" value={info.spectral_type} />
        <Row label="Morphology" value={info.morphology} />
        <Row
          label="Angular size"
          value={info.size_arcmin != null ? `${info.size_arcmin.toFixed(1)}′` : null}
        />
        <Row
          label="Distance"
          value={
            info.distance != null
              ? `${info.distance.toFixed(2)} ${info.distance_unit ?? ''}`.trim()
              : null
          }
        />
        <Row
          label="Redshift"
          value={info.redshift != null ? info.redshift.toExponential(3) : null}
        />
        <Row
          label="Radial velocity"
          value={
            info.radial_velocity != null
              ? `${info.radial_velocity.toFixed(1)} km/s`
              : null
          }
        />
      </div>

      <div className="oi-actions">
        <button onClick={downloadSnapshot} className="oi-btn">
          {aladin ? 'Save current view' : 'Download current cutout'}
        </button>
        <button onClick={() => downloadFull('png')} className="oi-btn" disabled={busy}>
          {busy ? 'Preparing…' : 'Download PNG'}
        </button>
        <button onClick={() => downloadFull('fits')} className="oi-btn" disabled={busy}>
          Download FITS
        </button>
      </div>
      <p className="oi-hint">
        FITS keeps the real pixel values for analysis in DS9 or astropy; PNG is a
        rendered picture.
      </p>
    </div>
  );
}