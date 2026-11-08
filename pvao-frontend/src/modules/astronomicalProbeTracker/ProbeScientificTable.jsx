import React from "react";
import styles from "./astronomicalProbeTracker.module.css";

export const ProbeScientificTable = ({ telemetry }) => {
    if (!telemetry) return null;

    const x = Number(telemetry.x ?? 0);
    const y = Number(telemetry.y ?? 0);
    const z = Number(telemetry.z ?? 0);
    const dist = telemetry.distance_km ?? Math.sqrt(x * x + y * y + z * z);

    // Clean numeric extraction from strings like "7.66 km/s"
    const rawVel = parseFloat(telemetry.velocity) || 0;
    const velocityKmH = rawVel ? Math.round(rawVel * 3600) : null;

    return (
        <div className={styles.aptTablePanel}>
            <div className={styles.aptTableTitle}>Scientific Details</div>
            <div className={styles.aptRow}>
                <span>Velocity:</span>
                <b>{velocityKmH ? `${velocityKmH.toLocaleString()} km/h` : "N/A"}</b>
            </div>
            <div className={styles.aptRow}>
                <span>Distance:</span>
                <b>{dist > 0 ? `${Math.round(dist).toLocaleString()} km` : "N/A"}</b>
            </div>
            <div className={styles.aptRow}>
                <span>Coord Frame:</span>
                <b>ICRF / Geocentric</b>
            </div>
            <div className={styles.aptRow}>
                <span>Status:</span>
                <b>Active</b>
            </div>
        </div>
    );
};