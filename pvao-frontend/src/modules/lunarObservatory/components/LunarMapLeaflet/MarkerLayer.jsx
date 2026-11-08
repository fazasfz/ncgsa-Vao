/**
 * Renders the interactive feature markers for the lunar map.
 * Handles marker clustering and tooltips.
 */
import React, { useState } from 'react';
import { useMap, useMapEvents, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import styles from './LunarMapLeaflet.module.css';

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: styles.customClusterIcon,
    iconSize: L.point(28, 28, true),
  });
};

export default function MarkerLayer({ features, selectedFeatureId, onSelectFeature }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  if (!features) return null;

  return (
    <MarkerClusterGroup
      chunkedLoading
      showCoverageOnHover={false}
      maxClusterRadius={(zoom) => (zoom <= 3 ? 80 : 40)}
      iconCreateFunction={createClusterCustomIcon}
    >
      {features.map(f => {
        if (f.latitude == null || f.longitude == null) return null;
        const isSelected = selectedFeatureId === f.id;

        return (
          <CircleMarker 
            key={f.id}
            center={[f.latitude, f.longitude]}
            radius={isSelected ? 5 : 2}
            pathOptions={{
              className: isSelected ? styles.selectedMarker : styles.unselectedMarker
            }}
            eventHandlers={{
              click: () => {
                if (onSelectFeature) onSelectFeature(f.id);
              }
            }}
          >
            {isSelected && (
              <Popup>
                <strong style={{ color: '#000', display: 'block', fontSize: '14px' }}>{f.name}</strong>
                <span style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{f.category}</span>
              </Popup>
            )}
            {zoom >= 6 && (
              <Tooltip permanent direction="top" className={styles.featureLabel}>
                {f.name}
              </Tooltip>
            )}
          </CircleMarker>
        );
      })}
    </MarkerClusterGroup>
  );
}
