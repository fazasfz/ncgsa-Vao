// SolarFlares.jsx
/**
 * Displays recent solar flare activity and X-ray flux data fetched from NOAA.
 * Renders interactive images and telemetry metrics.
 * Props: flareImage (string), loading (boolean).
 */
import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';

export const SolarFlares = ({ flareImage = '', loading = false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [telemetry, setTelemetry] = useState({ current: '...', peak: '...', loading: true, error: null });
    const [latestFlare, setLatestFlare] = useState(null);
    const [dailyEvents, setDailyEvents] = useState([]);

    useEffect(() => {
        // 1. Fetch Real-time GOES X-ray Flux
        fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json')
            .then((res) => (res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`)))
            .then((data) => {
                if (!Array.isArray(data) || !data.length) throw new Error('No telemetry');
                const getClass = (flux) => {
                    if (!flux || flux <= 0) return 'N/A';
                    if (flux < 1e-7) return `A${(flux / 1e-8).toFixed(1)}`;
                    if (flux < 1e-6) return `B${(flux / 1e-7).toFixed(1)}`;
                    if (flux < 1e-5) return `C${(flux / 1e-6).toFixed(1)}`;
                    if (flux < 1e-4) return `M${(flux / 1e-5).toFixed(1)}`;
                    return `X${(flux / 1e-4).toFixed(1)}`;
                };
                const latest = data[data.length - 1];
                const maxFlux = Math.max(...data.map((d) => d.flux || 0));
                setTelemetry({ current: getClass(latest.flux), peak: getClass(maxFlux), loading: false, error: null });
            })
            .catch(() => setTelemetry({ current: 'N/A', peak: 'N/A', loading: false, error: 'Telemetry Feed Unavailable' }));

        // 2. Fetch Automated Dedicated GOES Flare Feed
        fetch('https://services.swpc.noaa.gov/json/goes/primary/xray-flares-7-day.json')
            .then((res) => (res.ok ? res.json() : []))
            .then((events) => {
                if (!Array.isArray(events) || events.length === 0) return;

                const parsedEvents = events.map((e) => {
                    // Parse timestamp and convert UTC -> PKT (UTC + 5 hours)
                    const rawISO = e.begin_time || e.beginTime || e.max_time || e.time_tag;
                    let formattedTime = 'N/A';

                    if (rawISO) {
                        const dateObj = new Date(rawISO);
                        if (!isNaN(dateObj.getTime())) {
                            // Add 5 hours for Pakistan Standard Time
                            const pktDate = new Date(dateObj.getTime() + 5 * 60 * 60 * 1000);
                            const hours = String(pktDate.getUTCHours()).padStart(2, '0');
                            const mins = String(pktDate.getUTCMinutes()).padStart(2, '0');
                            formattedTime = `${hours}:${mins} PKT`;
                        }
                    }

                    const flareClass = e.max_class || e.current_class || e.particulars || 'C1.0+';
                    const regionVal = e.active_region_num || e.region || e.activeRegion;

                    // Updated fallbacks according to Option 2
                    const regionStr = regionVal && regionVal !== 0 ? `AR ${regionVal}` : 'Unassigned';
                    const locStr = e.location && e.location !== 'N/A' && e.location !== 'Solar Disk' ? e.location : 'Full Disk';

                    return {
                        class: String(flareClass).trim(),
                        time: formattedTime,
                        region: regionStr,
                        location: locStr,
                    };
                });

                if (parsedEvents.length > 0) {
                    setLatestFlare(parsedEvents[parsedEvents.length - 1]);
                    setDailyEvents(parsedEvents.slice(-5).reverse());
                }
            })
            .catch((err) => console.error("Error loading flare data:", err));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => e.key === 'Escape' && setSelectedImage(null);
        if (selectedImage) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    return (
        <section className={styles.flaresSection}>
            <h2 className={styles.sectionTitle}>Solar Flare Activity & High-Energy EUV</h2>
            <div className={styles.flareTelemetryCard}>
                <div className={styles.telemetryHeader}>
                </div>
                <h3 className={styles.chartSubTitle}>Current flare intensity metrics, recent eruption logs, and live EUV solar feed.</h3>

                <div className={styles.cardInnerLayout}>
                    <div className={styles.cardTextContent}>
                        {telemetry.loading ? (
                            <div className={styles.telemetryStatus}>Fetching real-time satellite telemetry...</div>
                        ) : telemetry.error ? (
                            <div className={styles.telemetryError}>{telemetry.error}</div>
                        ) : (
                            <div className={styles.flareClassContainer}>
                                <div className={styles.flareMetric}>
                                    <span className={styles.metricLabel}>Current X-Ray Flare Level</span>
                                    <span className={styles.metricValueNormal}>{telemetry.current}</span>
                                </div>
                                <div className={styles.flareMetric}>
                                    <span className={styles.metricLabel}>24h Peak Flare Activity</span>
                                    <span className={styles.metricValueNormal}>{telemetry.peak}</span>
                                </div>
                            </div>
                        )}

                        {/* Live Latest Flare Info */}
                        <div className={styles.flareClassContainer}>
                            <div className={styles.flareMetric}>
                                <span className={styles.metricLabel}>Latest Flare Class & Time</span>
                                <span className={styles.metricValueNormal}>
                                    {latestFlare ? `${latestFlare.class} @ ${latestFlare.time}` : 'None Recorded Today'}
                                </span>
                            </div>
                            <div className={styles.flareMetric}>
                                <span className={styles.metricLabel}>Region / Location</span>
                                <span className={styles.metricValueNormal}>
                                    {latestFlare ? `${latestFlare.region} (${latestFlare.location})` : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Live Daily Flare Events Table */}
                        <div className={styles.sunspotTableContainer}>
                            <table className={styles.sunspotTable}>
                                <thead>
                                    <tr>
                                        <th>Class</th>
                                        <th>Time (PKT)</th>
                                        <th>Region</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dailyEvents.length > 0 ? (
                                        dailyEvents.map((e, idx) => (
                                            <tr key={idx}>
                                                <td>{e.class}</td>
                                                <td>{e.time}</td>
                                                <td>{e.region}</td>
                                                <td>{e.location}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No major solar flares recorded in current period.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div
                        className={styles.embeddedRightImageWrapper}
                        onClick={() => flareImage && setSelectedImage({ title: 'SDO AIA 131 Å (Solar Flares)', src: flareImage })}
                    >
                        {loading || !flareImage ? (
                            <div className={styles.imagePlaceholder}>Loading Live Flare Channel Feed...</div>
                        ) : (
                            <img src={flareImage} alt="SDO AIA 131 Live Flare Channel" className={styles.galleryStyleImage} />
                        )}
                        <span className={styles.imageCaption}>SDO AIA 131 Å (Solar Flares)</span>
                    </div>
                </div>

                {selectedImage && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>&times;</button>
                            <img src={selectedImage.src} alt={selectedImage.title} className={styles.fullSolarImage} />
                            <div className={styles.modalCaption}>
                                <h3>{selectedImage.title}</h3>
                                <p>Press <kbd>ESC</kbd> or click outside to close</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SolarFlares;