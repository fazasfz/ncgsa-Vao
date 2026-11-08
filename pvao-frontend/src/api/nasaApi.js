// pvao-frontend/src/api/nasaApi.js
import axios from 'axios';

// Since this is frontend only, we are directly calling NASA for APOD for the Landing Page demo.
// In production, this should proxy through the pvao-backend to protect API keys.
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const APOD_ENDPOINT = 'https://api.nasa.gov/planetary/apod';

export const fetchAPOD = async () => {
  try {
    const response = await axios.get(APOD_ENDPOINT, {
      params: { api_key: NASA_API_KEY },
      timeout: 8000
    });
    if (response.data && (response.data.url || response.data.hdurl)) {
      return response.data;
    }
  } catch (error) {
    console.warn('Direct NASA APOD fetch warning, serving local fallback:', error);
  }

  const fallbacks = [
    {
      title: "The Pillars of Creation (M16)",
      url: "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
      explanation: "Towering celestial tendrils of interstellar gas and dust stand inside the Eagle Nebula (M16). Star formation unfolds within these dense columns where newborn stars sculpt the surrounding landscape with intense stellar radiation.",
      media_type: "image",
      date: "Featured Cosmic Observation"
    },
    {
      title: "The Milky Way over the Pinnacles",
      url: "https://apod.nasa.gov/apod/image/2308/PinnaclesMilkyWay_Goh_960.jpg",
      explanation: "A stunning view of the Milky Way galaxy stretching across the night sky above the ancient limestone Pinnacles in Western Australia.",
      media_type: "image",
      date: "Featured Cosmic Observation"
    },
    {
      title: "Andromeda Galaxy (M31)",
      url: "https://apod.nasa.gov/apod/image/2308/Andromeda_Gendler_960.jpg",
      explanation: "The majestic Andromeda Galaxy, our closest large galactic neighbor, spanning over 220,000 light-years across and containing hundreds of billions of stars.",
      media_type: "image",
      date: "Featured Cosmic Observation"
    },
    {
      title: "The Orion Nebula",
      url: "https://apod.nasa.gov/apod/image/2307/Orion_webb_960.jpg",
      explanation: "A breathtaking view of the Orion Nebula's active stellar nursery, showcasing glowing hydrogen gas and intricate cosmic filaments.",
      media_type: "image",
      date: "Featured Cosmic Observation"
    }
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
