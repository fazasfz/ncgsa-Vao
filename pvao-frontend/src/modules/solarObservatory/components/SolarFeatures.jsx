import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';

// Utility to parse coordinates like N15W54 -> 15° North, 54° West
const formatSunCoordinates = (coord) => {
    if (!coord || coord === 'Disk Surface' || coord === 'Limb / Disk') {
        return coord || 'Visible Disk Surface';
    }

    const match = coord.match(/^([NS])(\d+)([EW])(\d+)$/i);
    if (!match) return coord;

    const [, latDir, latVal, longDir, longVal] = match;
    const latitude = `${latVal}° ${latDir.toUpperCase() === 'N' ? 'North' : 'South'}`;
    const longitude = `${longVal}° ${longDir.toUpperCase() === 'E' ? 'East' : 'West'}`;

    return `${latitude}, ${longitude}`;
};

// Utility to convert raw detail strings into readable summaries
const formatDetails = (type, desc, rawData = {}) => {
    if (type === 'Filament') {
        return 'Active magnetic plasma loop';
    }
    if (type === 'Coronal Eruption') {
        return 'Solar plasma outburst detected';
    }

    const area = rawData.area !== undefined ? rawData.area : (desc.match(/Area:\s*([^|]+)/)?.[1]?.replace('MSH', '').trim());
    const spots = rawData.spot_count !== undefined ? rawData.spot_count : (desc.match(/Spots:\s*([^|]+)/)?.[1]?.trim());
    const magClass = rawData.mag_type || (desc.match(/Class:\s*(.+)/)?.[1]?.trim());

    const parts = [];

    if (area && area !== 'N/A' && area !== 'null') {
        parts.push(`Area: ${area} millionths of solar face`);
    } else {
        parts.push('Area: Unmeasured');
    }

    if (spots && spots !== 'N/A' && spots !== 'null') {
        parts.push(`${spots} spot${spots === 1 ? '' : 's'}`);
    }

    if (magClass && magClass !== 'N/A') {
        parts.push(`${magClass} Field`);
    }

    return parts.join(' • ');
};

export const SolarFeatures = ({ solarImage = '' }) => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedImage, setSelectedImage] = useState(null);

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedImage(null);
            }
        };

        if (selectedImage) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage]);

    useEffect(() => {
        Promise.all([
            fetch('https://services.swpc.noaa.gov/json/solar_regions.json').then((r) => (r.ok ? r.json() : [])),
            fetch('https://services.swpc.noaa.gov/json/edited_events.json').then((r) => (r.ok ? r.json() : [])),
        ])
            .then(([regionsData, eventsData]) => {
                const featureList = [];

                if (Array.isArray(regionsData)) {
                    regionsData.slice(-6).forEach((r) => {
                        featureList.push({
                            id: `AR-${r.region}-${r.location}`,
                            type: 'Active Region',
                            displayType: 'Active Sunspot Region',
                            name: `AR ${r.region}`,
                            location: formatSunCoordinates(r.location),
                            desc: formatDetails('Active Region', '', r),
                        });
                    });
                }

                if (Array.isArray(eventsData)) {
                    const dynamicEvents = eventsData.filter((e) => {
                        const t = (e.type || e.eventType || '').toUpperCase();
                        return t === 'CME' || t === 'DSF' || t === 'FIL';
                    });

                    dynamicEvents.slice(-6).forEach((e, idx) => {
                        const isEruption = (e.type || '').toUpperCase() === 'CME';
                        const featureType = isEruption ? 'Coronal Eruption' : 'Filament';
                        featureList.push({
                            id: `FEAT-${idx}-${e.beginTime || idx}`,
                            type: featureType,
                            displayType: isEruption ? 'Coronal Eruption' : 'Solar Filament',
                            name: e.region ? `AR ${e.region}` : 'Disk Event',
                            location: formatSunCoordinates(e.location),
                            desc: formatDetails(featureType, e.particulars || ''),
                        });
                    });
                }

                setFeatures(featureList);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Strict Category Matching
    const filtered = features.filter((f) => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'ACTIVE REGION') return f.type === 'Active Region';
        if (activeFilter === 'FILAMENT') return f.type === 'Filament';
        if (activeFilter === 'CORONAL') return f.type === 'Coronal Eruption';
        return true;
    });

    return (
        <section className={styles.flaresSection}>
            <h2 className={styles.sectionTitle}>Solar Features & Active Disk Mapping</h2>
            <div className={styles.flareTelemetryCard}>
                <div className={styles.telemetryHeader}>
                    <span className={styles.telemetryBadge}>SURFACE FEATURES</span>
                    <div className={styles.filterGroup}>
                        {['ALL', 'ACTIVE REGION', 'FILAMENT', 'CORONAL'].map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                <h3 className={styles.chartSubTitle}>Real-time spatial mapping and physical metrics of active sunspot clusters, filaments, and plasma eruptions tracked across the solar disk.</h3>

                <div className={styles.cardInnerLayout}>
                    <div className={styles.cardTextContent}>
                        <div className={styles.sunspotTableContainer}>
                            <table className={styles.sunspotTable}>
                                <thead>
                                    <tr>
                                        <th>FEATURE NAME</th>
                                        <th>CATEGORY</th>
                                        <th>POSITION ON SUN</th>
                                        <th>KEY CHARACTERISTICS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4">Scanning solar surface features...</td></tr>
                                    ) : filtered.length > 0 ? (
                                        filtered.map((f) => (
                                            <tr key={f.id}>
                                                <td className={styles.featureName}>{f.name}</td>
                                                <td>{f.displayType || (f.type === 'Active Region' ? 'Active Sunspot Region' : f.type === 'Filament' ? 'Solar Filament' : f.type)}</td>
                                                <td>{formatSunCoordinates(f.location)}</td>
                                                <td className={styles.featureDesc}>{f.desc}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4">No active features in this category.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {solarImage && (
                        <div
                            className={styles.embeddedRightImageWrapper}
                            onClick={() => setSelectedImage({ src: solarImage, title: 'SDO HMI / AIA Surface Map' })}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={solarImage} alt="Annotated Solar Disk" className={styles.galleryStyleImage} />
                            <span className={styles.imageCaption}>SDO HMI / AIA Surface Map</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.title}
                            className={styles.fullSolarImage}
                        />
                        <div className={styles.modalCaption}>
                            <h3>{selectedImage.title}</h3>
                            <p>Press <kbd>ESC</kbd> or click outside to close</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SolarFeatures;