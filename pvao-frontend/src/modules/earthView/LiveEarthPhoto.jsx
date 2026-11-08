/**
 * Fetches and displays the latest full-disk image of Earth from the NASA EPIC camera.
 * Handles API integration and image rendering.
 */
import React, { useEffect, useState } from 'react';
import './liveEarthPhoto.css';

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;

const LiveEarthPhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_KEY}`);
        const data = await res.json();
        const latest = data[data.length - 1];
        const [y, m, d] = latest.date.split(' ')[0].split('-');
        const url = `https://api.nasa.gov/EPIC/archive/natural/${y}/${m}/${d}/png/${latest.image}.png?api_key=${NASA_KEY}`;
        setPhoto({ url, date: latest.date });
        setError(false);
      } catch {
        setError(true);
      }
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="earthview-live-photo">
      <div className="earthview-live-photo-label">LIVE EARTH · NASA EPIC</div>
      {error && <div className="earthview-live-photo-error">Feed unavailable</div>}
      {photo && (
        <>
          <img src={photo.url} alt="Live sunlit Earth from DSCOVR satellite" className="earthview-live-photo-img" />
          <div className="earthview-live-photo-time">Captured {photo.date} UTC</div>
        </>
      )}
    </div>
  );
};

export default LiveEarthPhoto;