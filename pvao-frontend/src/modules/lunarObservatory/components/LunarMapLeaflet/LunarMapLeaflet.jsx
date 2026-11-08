/**
 * 2D interactive map of the Moon using Leaflet.
 * Renders feature markers and handles pan/zoom and feature selection.
 * Props: features (array), selectedFeature (object), onSelectFeature (function).
 */
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LunarMapLeaflet.module.css';
import RecenterMap from './RecenterMap';
import MarkerLayer from './MarkerLayer';

const imageBounds = [[-90, -180], [90, 180]];


export default function LunarMapLeaflet({ features, selectedFeatureId, onSelectFeature }) {
  const selectedFeature = features?.find(f => f.id === selectedFeatureId);

  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <MapContainer 
          crs={CRS.EPSG4326}
          center={[0, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%', background: '#000' }}
          minZoom={0}
          maxZoom={8}
        >
          <TileLayer
            url="https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg"
            tileSize={256}
            minZoom={0}
            maxZoom={8}
          />
          
          <RecenterMap selectedFeature={selectedFeature} />

          <MarkerLayer 
            features={features} 
            selectedFeatureId={selectedFeatureId} 
            onSelectFeature={onSelectFeature} 
          />
        </MapContainer>
      </div>
    </div>
  );
}
