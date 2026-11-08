import React, { useState, useEffect, useRef } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import styles from './astronomicalProbeTracker.module.css';

const SPEED_OF_LIGHT_KMS = 299792.458;
const EARTH_ESCAPE_VELOCITY_KMS = 11.18;
const SOLAR_ESCAPE_VELOCITY_KMS = 16.60;

const BODY_RADII = {
    earth: 6371,
    moon: 1737,
    mars: 3389,
    sun: 696340
};

const COORD_FRAMES = {
    earth: "ICRF / Geocentric",
    moon: "ICRF / Selenocentric",
    mars: "ICRF / Areocentric",
    sun: "ICRF / Heliocentric"
};

const AVERAGE_EARTH_DIST_MAP = {
    earth: 0,
    moon: 384400,       // ~1.28 s
    mars: 225000000,    // ~12.5 min
    sun: 149600000      // ~8.3 min
};

export const ProbeTelemetryCard = ({ telemetry, targetBody = "earth", onClose }) => {
    const [history, setHistory] = useState([]);
    const probeId = telemetry?.id || telemetry?.probe_id || telemetry?.satId;

    const targetKey = String(targetBody || "earth").toLowerCase().trim();
    const orbitDistKm = Number(telemetry?.orbital_radius || telemetry?.distance_km || 0);

    // Safely extract real NASA velocity (prefer numeric velocity_kms or parse velocity string)
    const rawVel = Number(telemetry?.velocity_kms) || parseFloat(telemetry?.velocity) || 0;

    // Reset trend history when probe selection changes
    useEffect(() => {
        setHistory([]);
    }, [probeId]);

    // Append real incoming telemetry ticks
    useEffect(() => {
        if (!telemetry || rawVel <= 0) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setHistory((prev) => {
            // Avoid duplicate identical time entries within the same second
            if (prev.length > 0 && prev[prev.length - 1].time === timestamp) {
                return prev;
            }
            return [
                ...prev.slice(-14),
                {
                    time: timestamp,
                    velocity: Number(rawVel.toFixed(2)),
                    distance: Math.round(orbitDistKm)
                }
            ];
        });
    }, [telemetry, rawVel, orbitDistKm]);

    if (!telemetry) return null;

    const probeName = telemetry.name || "Spacecraft";

    const x = Number(telemetry.x ?? 0);
    const y = Number(telemetry.y ?? 0);
    const z = Number(telemetry.z ?? 0);

    const velKmH = rawVel > 0 ? Math.round(rawVel * 3600) : null;

    const planetRadius = BODY_RADII[targetKey] || BODY_RADII.earth;
    const altitudeKm = telemetry.altitude_km ?? (orbitDistKm > planetRadius ? orbitDistKm - planetRadius : 0);

    const localVectorLen = Math.sqrt(x * x + y * y + z * z);
    const lat = localVectorLen > 0 ? (Math.asin(z / localVectorLen) * (180 / Math.PI)).toFixed(2) : "0.00";
    const lon = localVectorLen > 0 ? (Math.atan2(y, x) * (180 / Math.PI)).toFixed(2) : "0.00";

    const inclinationFormatted = telemetry.inclination !== undefined && telemetry.inclination !== null
        ? String(telemetry.inclination)
        : "N/A";

    // Enforce robust target lookups and distance calculations
    const baseEarthDistKm = Number(AVERAGE_EARTH_DIST_MAP[targetKey] ?? 0);
    const validOrbitKm = Number(orbitDistKm) || 0;

    const distanceToEarthKm = Number(telemetry.earth_distance_km) ||
        (targetKey !== "earth" ? baseEarthDistKm + validOrbitKm : validOrbitKm);

    // Compute OWLT seconds cleanly
    const rawOwltSec = Number(telemetry.owlt_sec || 0);
    const owltSeconds = (rawOwltSec > 10 || targetKey === "earth")
        ? rawOwltSec
        : distanceToEarthKm / SPEED_OF_LIGHT_KMS;

    const formatLightTime = (sec) => {
        if (!sec || sec <= 0) return "0.00 s";
        if (sec < 60) return `${sec.toFixed(2)} s`;
        if (sec < 3600) return `${(sec / 60).toFixed(2)} min`;
        return `${(sec / 3600).toFixed(2)} hrs`;
    };

    const owltFormatted = formatLightTime(owltSeconds);
    const rtltFormatted = formatLightTime(owltSeconds * 2);

    const escapeThreshold = targetKey === "sun" ? SOLAR_ESCAPE_VELOCITY_KMS : EARTH_ESCAPE_VELOCITY_KMS;
    const escapeRatio = Math.min(1, rawVel / escapeThreshold);
    const strokeDashoffset = 126 - 126 * escapeRatio;

    const coordFrame = COORD_FRAMES[targetKey] || "ICRF / Relative";

    const formatDist = (valKm) => {
        const num = Number(valKm);
        if (!num || isNaN(num) || num <= 0) return "N/A";
        if (num >= 149597870) {
            const au = (num / 149597870.7).toFixed(2);
            return `${Math.round(num).toLocaleString()} km (${au} AU)`;
        }
        return `${Math.round(num).toLocaleString()} km`;
    };

    return (
        <div className={styles.aptTelemetryCard}>
            <div className={styles.aptCardHeader}>
                <div>
                    <h3 className={styles.aptCardTitle}>{probeName}</h3>
                    <span className={styles.aptSubTitle}>Live NASA Horizons Payload</span>
                </div>
                {onClose && (
                    <button className={styles.aptCloseBtn} onClick={onClose} aria-label="Close telemetry card">
                        ×
                    </button>
                )}
            </div>

            <div className={styles.aptCardBody}>
                <div className={styles.aptGaugeRow}>
                    <div className={styles.aptStatBlock}>
                        <span className={styles.aptLabel}>Velocity:</span>
                        <span className={styles.aptValueHighlight}>
                            {rawVel > 0 ? `${rawVel.toFixed(2)} km/s` : (telemetry.raw_velocity || telemetry.velocity || "Live Orbital")}
                        </span>
                        {velKmH && <span className={styles.aptSubValue}>({velKmH.toLocaleString()} km/h)</span>}
                    </div>

                    <div className={styles.aptGaugeContainer} title="Percentage of gravitational escape velocity reached">
                        <svg className={styles.aptGaugeSvg} viewBox="0 0 50 30">
                            <path d="M 5 25 A 20 20 0 0 1 45 25" fill="none" stroke="#1e293b" strokeWidth="4" />
                            <path
                                d="M 5 25 A 20 20 0 0 1 45 25"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="4"
                                strokeDasharray="126"
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className={styles.aptGaugeLabel}>
                            {Math.round(escapeRatio * 100)}% Escape Speed
                        </span>
                    </div>
                </div>

                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Altitude (AGL):</span>
                    <span className={styles.aptValue}>
                        {formatDist(altitudeKm)}
                    </span>
                </div>
                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Orbital Radius:</span>
                    <span className={styles.aptValue}>
                        {formatDist(orbitDistKm)}
                    </span>
                </div>
                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Orbital Inclination:</span>
                    <span className={styles.aptValue}>{inclinationFormatted}</span>
                </div>

                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Latitude / Longitude:</span>
                    <span className={styles.aptValue}>{lat}° / {lon}°</span>
                </div>

                <div className={styles.aptSignalSection}>
                    <div className={styles.aptStatRow}>
                        <span className={styles.aptLabel}>Signal OWLT (One-Way Light Time):</span>
                        <span className={styles.aptValue}>{owltFormatted}</span>
                    </div>
                    <div className={styles.aptStatRow}>
                        <span className={styles.aptLabel}>Signal RTLT (Round-Trip Light Time):</span>
                        <span className={styles.aptValue}>{rtltFormatted}</span>
                    </div>
                </div>

                {history.length > 1 && (
                    <div className={styles.aptChartContainer}>
                        <div className={styles.aptChartTitle}>
                            Live Velocity Trend ({history.length} ticks)
                        </div>
                        <div style={{ width: "100%", height: 80 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ background: "#0f172a", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "6px", fontSize: "11px" }}
                                        itemStyle={{ color: "#38bdf8" }}
                                    />
                                    <Area type="monotone" dataKey="velocity" stroke="#38bdf8" fillOpacity={1} fill="url(#velGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Coord Frame:</span>
                    <span className={styles.aptValue}>{coordFrame}</span>
                </div>
            </div>
        </div>
    );
};

export default ProbeTelemetryCard;