// pvao-frontend/src/utils/formatCoordinates.js
export const getLocalCoordinates = () => {
  // Simplified placeholder coordinates for Islamabad (as per prompt example)
  return 'LAT 33.6844° N · LONG 73.0479° E - ISLAMABAD';
};

export const getLiveTime = () => {
  const now = new Date();
  const options = { 
    timeZone: 'Asia/Karachi', 
    year: 'numeric', month: '2-digit', day: '2-digit', 
    hour: '2-digit', minute: '2-digit', second: '2-digit', 
    hour12: false 
  };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(now);
  const getPart = (type) => parts.find(p => p.type === type)?.value || '00';
  
  return `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')} PKT`;
};
