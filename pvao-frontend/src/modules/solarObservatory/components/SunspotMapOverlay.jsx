import React from 'react';
import styles from '../SolarObservatory.module.css';
import { calculateDiskPosition, formatCoordinates } from '../utils/sunspotHelpers';

export default function SunspotMapOverlay({ regions, selectedSpot, onSelectSpot }) {
    return (
        <div className={styles.diskOverlayContainer}>
            {regions.map((spot, idx) => {
                const pos = calculateDiskPosition(spot.latitude, spot.longitude);
                const isSelected = selectedSpot?.region === spot.region;

                return (
                    <div
                        key={spot.region || idx}
                        className={`${styles.sunspotPin} ${isSelected ? styles.activePin : ''}`}
                        style={pos}
                        onClick={() => onSelectSpot(spot)}
                        title={`AR ${spot.region}: ${formatCoordinates(spot.location)}`}
                    />
                );
            })}
        </div>
    );
}