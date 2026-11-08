/**
 * Invisible map layer that intercepts click events to sample light pollution pixel data.
 * Computes the Bortle scale value for the clicked geographic location.
 */
import { useMap, useMapEvents } from 'react-leaflet';
import { classify } from './bortleColor';

const TILE_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg';

const samplePixel = (map, latlng) =>
  new Promise((resolve, reject) => {
    const zoom = Math.min(map.getZoom(), 8);
    const point = map.project(latlng, zoom);
    const tx = Math.floor(point.x / 256);
    const ty = Math.floor(point.y / 256);
    const px = Math.floor(point.x - tx * 256);
    const py = Math.floor(point.y - ty * 256);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 256, 256);
      try {
        resolve(ctx.getImageData(px, py, 1, 1).data[0]);
      } catch {
        reject(new Error('CORS blocked'));
      }
    };
    img.onerror = () => reject(new Error('Tile load failed'));
    img.src = TILE_URL.replace('{z}', zoom).replace('{x}', tx).replace('{y}', ty);
  });

const fetchPlaceName = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    const data = await res.json();
    return data.city || data.locality || data.countryName || 'Ocean / unclaimed';
  } catch {
    return 'Unknown location';
  }
};

const BortleClickReader = ({ active, onResult }) => {
  const map = useMap();
  useMapEvents({
    async click(e) {
      if (!active) return;
      const { lat, lng } = e.latlng;
      const place = await fetchPlaceName(lat, lng);
      try {
        const brightness = await samplePixel(map, e.latlng);
        const { n, label } = classify(brightness);
        onResult({ lat, lng, place, bortle: n, label });
      } catch {
        onResult({ lat, lng, place, bortle: null, label: 'Reading unavailable' });
      }
    },
  });
  return null;
};

export default BortleClickReader;