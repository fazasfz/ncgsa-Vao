/**
 * Main interactive map component for the Earth View.
 * Composes basemaps, satellite overlays, light pollution layers, and handles coordinates.
 */
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import SatelliteToggle from './SatelliteToggle';
import DayNightOverlay from './DayNightOverlay';
import LiveEarthPhoto from './LiveEarthPhoto';
import BortleLegend from './BortleLegend';
import ColorizedLightsLayer from './ColorizedLightsLayer';
import BortleClickReader from './BortleClickReader';

const MAP_URL = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en';
const SATELLITE_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg';
const LABELS_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png';

const CoordinateTracker = ({ onMove }) => {
  useMapEvents({ mousemove: (e) => onMove(e.latlng) });
  return null;
};

const LocationInspector = ({ active, onSelect }) => {
  useMapEvents({
    async click(e) {
      if (!active) return;
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        const data = await res.json();
        const place = data.city || data.locality || data.principalSubdivision || 'Unnamed area';
        onSelect({ lat, lng, place, country: data.countryName || 'Ocean / unclaimed' });
      } catch {
        onSelect({ lat, lng, place: 'Lookup failed', country: '' });
      }
    },
  });
  return null;
};

const TILE_SOURCES = {
  map: { url: MAP_URL, attribution: '&copy; OpenStreetMap contributors, style by Wikimedia' },
  satellite: { url: SATELLITE_URL, attribution: 'Imagery courtesy NASA GIBS / Blue Marble' },
};

const EarthMap = () => {
  const [cursor, setCursor] = useState(null);
  const [selected, setSelected] = useState(null);
  const [bortle, setBortle] = useState(null);
  const [base, setBase] = useState('satellite');

  return (
    <div className="earthview-map-wrap">
      <MapContainer center={[30.3753, 69.3451]} zoom={4} minZoom={2} maxZoom={8} worldCopyJump={false} scrollWheelZoom={true} className="earthview-map">
        {base !== 'lights' && (
          <TileLayer key={base} url={TILE_SOURCES[base].url} attribution={TILE_SOURCES[base].attribution} noWrap={true} />
        )}
        {base === 'lights' && <ColorizedLightsLayer />}
        {base !== 'map' && <TileLayer url={LABELS_URL} attribution="Labels &copy; CARTO" noWrap={true} />}
        {base !== 'lights' && <DayNightOverlay />}
        <CoordinateTracker onMove={setCursor} />
        <LocationInspector active={base !== 'lights'} onSelect={setSelected} />
        <BortleClickReader active={base === 'lights'} onResult={setBortle} />
      </MapContainer>

      <LiveEarthPhoto />
      <SatelliteToggle mode={base} onChange={setBase} />
      {base === 'lights' && <BortleLegend />}

      <div className="earthview-hud earthview-hud--coords">
        {cursor ? `LAT ${cursor.lat.toFixed(3)}°  LONG ${cursor.lng.toFixed(3)}°` : 'Move over the map'}
      </div>

      {selected && base !== 'lights' && (
        <div className="earthview-hud earthview-hud--info">
          <div className="earthview-hud-label">{selected.place}</div>
          <div className="earthview-hud-value">{selected.country}</div>
          <div className="earthview-hud-coords">
            LAT {selected.lat.toFixed(4)}°  LONG {selected.lng.toFixed(4)}°
          </div>
        </div>
      )}

      {bortle && base === 'lights' && (
        <div className="earthview-hud earthview-hud--info">
          <div className="earthview-hud-label">{bortle.place}</div>
          <div className="earthview-hud-value">{bortle.bortle ? `Class ${bortle.bortle} - ${bortle.label}` : bortle.label}</div>
          <div className="earthview-hud-coords">
            LAT {bortle.lat.toFixed(4)}°  LONG {bortle.lng.toFixed(4)}°
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthMap;