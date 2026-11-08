import React from "react";
import styles from "./astronomicalProbeTracker.module.css";

export const ProbeGroundTrack = ({ telemetry }) => {
    if (!telemetry) return null;

    const x = Number(telemetry.x ?? 0);
    const y = Number(telemetry.y ?? 0);
    const z = Number(telemetry.z ?? 0);
    const dist = telemetry.distance_km ?? Math.sqrt(x * x + y * y + z * z);

    const lat = dist > 0 ? Math.asin(z / dist) * (180 / Math.PI) : 0;
    const lon = dist > 0 ? Math.atan2(y, x) * (180 / Math.PI) : 0;

    const latPercent = ((90 - lat) / 180) * 100;
    const lonPercent = ((lon + 180) / 360) * 100;

    return (
        <div className={styles.aptGroundTrackContainer}>
            <div className={styles.aptMapTitle}>Sub-Satellite Ground Track</div>
            <div className={styles.aptMapFrame}>
                <div
                    className={styles.aptSatellitePoint}
                    style={{ top: `${latPercent}%`, left: `${lonPercent}%` }}
                />
            </div>
            <div className={styles.aptCoordsFooter}>
                LAT: {lat.toFixed(2)}° | LON: {lon.toFixed(2)}°
            </div>
        </div>
    );
};