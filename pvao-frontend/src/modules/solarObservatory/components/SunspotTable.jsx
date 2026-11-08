import React from 'react';
import styles from '../SolarObservatory.module.css';
import { formatCoordinates } from '../utils/sunspotHelpers';

export default function SunspotTable({ regions, loading, error, selectedSpot, onSelectSpot }) {
    if (loading) return <p className={styles.chartLoading}>Scanning solar regions...</p>;
    if (error) return <p className={styles.chartError}>{error}</p>;

    return (
        <div className={styles.sunspotTableContainer}>
            <table className={styles.sunspotTable}>
                <thead>
                    <tr>
                        <th>Region Name</th>
                        <th>Position on Sun</th>
                        <th>Area Coverage</th>
                        <th>Spot Count</th>
                        <th>Magnetic Field</th>
                    </tr>
                </thead>
                <tbody>
                    {regions.map((spot, idx) => {
                        const isSelected = selectedSpot?.region === spot.region;
                        return (
                            <tr
                                key={spot.region || idx}
                                className={isSelected ? styles.selectedRow : ''}
                                onClick={() => onSelectSpot(spot)}
                            >
                                <td className={styles.featureName}>AR {spot.region || 'N/A'}</td>
                                <td>{formatCoordinates(spot.location)}</td>
                                <td>{spot.area ? `${spot.area} MSH` : 'Unmeasured'}</td>
                                <td>{spot.number_spots || spot.spot_count || 'N/A'}</td>
                                <td>{spot.mag_class || spot.spot_class || 'N/A'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}