// src/api/apod.js
// Utility to fetch NASA APOD directly from the frontend.
import axios from 'axios';

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const APOD_ENDPOINT = 'https://api.nasa.gov/planetary/apod';

export const fetchApod = async (params = {}) => {
  try {
    const response = await axios.get(APOD_ENDPOINT, {
      params: { api_key: NASA_API_KEY, ...params },
      timeout: 8000,
    });
    if (response.data && (response.data.url || response.data.hdurl)) {
      return response.data;
    }
  } catch (error) {
    console.warn('Direct NASA APOD fetch failed, falling back to local images:', error);
  }
  // Fallback static images (same as current fallback in backend)
  const fallbacks = [
    {
      title: 'The Pillars of Creation (M16)',
      url: 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg',
      explanation: 'Towering celestial tendrils of interstellar gas and dust stand inside the Eagle Nebula (M16).',
      media_type: 'image',
      date: 'Featured Cosmic Observation',
    },
    // Additional fallback entries can be added here
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
