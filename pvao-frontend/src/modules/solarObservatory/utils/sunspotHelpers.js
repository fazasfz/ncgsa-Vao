// Convert "N04E55" -> "4° North, 55° East"
export const formatCoordinates = (coord) => {
    if (!coord) return 'Disk Surface';
    const match = coord.match(/^([NS])(\d+)([EW])(\d+)$/i);
    if (!match) return coord;

    const [, latDir, latVal, longDir, longVal] = match;
    const latitude = `${latVal}° ${latDir.toUpperCase() === 'N' ? 'North' : 'South'}`;
    const longitude = `${longVal}° ${longDir.toUpperCase() === 'E' ? 'East' : 'West'}`;

    return `${latitude}, ${longitude}`;
};

// Map latitude and longitude to percentage coordinates for 2D disk projection
export const calculateDiskPosition = (latitude, longitude) => {
    const lat = latitude || 0;
    const lon = longitude || 0;

    const y = 50 - (lat / 90) * 40;
    const x = 50 + (lon / 90) * 40;

    return {
        left: `${Math.min(Math.max(x, 10), 90)}%`,
        top: `${Math.min(Math.max(y, 10), 90)}%`
    };
};