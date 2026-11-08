/**
 * Custom Leaflet GridLayer that renders and colorizes nighttime city lights data.
 * Processes tiles to visualize light pollution intensities.
 */
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { classify } from './bortleColor';

const TILE_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg';

const ColorizedLightsLayer = () => {
  const map = useMap();

  useEffect(() => {
    const ColorLayer = L.GridLayer.extend({
      createTile(coords, done) {
        const tile = document.createElement('canvas');
        tile.width = 256;
        tile.height = 256;
        const ctx = tile.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 256, 256);
          try {
            const data = ctx.getImageData(0, 0, 256, 256);
            for (let i = 0; i < data.data.length; i += 4) {
              const { color } = classify(data.data[i]);
              data.data[i] = color[0];
              data.data[i + 1] = color[1];
              data.data[i + 2] = color[2];
            }
            ctx.putImageData(data, 0, 0);
          } catch {
            // CORS blocked pixel access; leave original tile as fallback
          }
          done(null, tile);
        };
        img.onerror = () => done(null, tile);
        img.src = TILE_URL.replace('{z}', coords.z).replace('{x}', coords.x).replace('{y}', coords.y);
        return tile;
      },
    });

    const layer = new ColorLayer({ maxNativeZoom: 8, noWrap: true });
    layer.addTo(map);
    return () => map.removeLayer(layer);
  }, [map]);

  return null;
};

export default ColorizedLightsLayer;