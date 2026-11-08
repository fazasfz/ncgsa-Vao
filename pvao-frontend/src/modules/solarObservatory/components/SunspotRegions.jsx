import React, { useEffect, useState } from 'react';
import styles from '../SolarObservatory.module.css';
import SunspotTable from './SunspotTable';
import SunspotMapOverlay from './SunspotMapOverlay';

const NASA_CONTINUUM_URL = 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_HMII.jpg';
const SWPC_SUNSPOTS_URL = 'https://services.swpc.noaa.gov/json/solar_regions.json';

export default function SunspotRegions() {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);

    useEffect(() => {
        let isMounted = true;
        fetch(SWPC_SUNSPOTS_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch live sunspot data');
                return res.json();
            })
            .then((data) => {
                if (!isMounted) return;
                const valid = data.filter((item) => item.observed_date);
                const latestDate = valid.reduce((max, item) => (item.observed_date > max ? item.observed_date : max), '');
                setRegions(valid.filter((item) => item.observed_date === latestDate));
                setLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message);
                setLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    return (
        <section className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>Sunspot Regions & Active Disk Telemetry</h2>

            <div className={styles.singleContainerCard}>
                {/* Table shifted to Left */}
                <div className={styles.tableSection}>
                    <h3 className={styles.factBadge}>ACTIVE SUNSPOT BREAKDOWN</h3>
                    <SunspotTable regions={regions} loading={loading} error={error} selectedSpot={selectedSpot} onSelectSpot={setSelectedSpot} />
                </div>

                {/* Map/Image shifted to Right & Enlarged */}
                <div className={styles.imageSection}>
                    <h3 className={styles.chartSubTitle}>Heliographic Disk Map</h3>
                    <div className={styles.diskMapWrapper}>
                        <div className={styles.imageClickWrapper} onClick={() => setIsLightboxOpen(true)}>
                            <img src={NASA_CONTINUUM_URL} alt="Live SDO Sunspot Continuum" className={styles.solarImage} />
                        </div>
                        {!loading && (
                            <SunspotMapOverlay regions={regions} selectedSpot={selectedSpot} onSelectSpot={setSelectedSpot} />
                        )}
                    </div>
                    <p className={styles.imageCaption}>SDO HMI Continuum (Live Heliographic Plot)</p>
                </div>
            </div>

            {isLightboxOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsLightboxOpen(false)}>
                    <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setIsLightboxOpen(false)}>&#10005;</button>
                        <img src={NASA_CONTINUUM_URL} alt="SDO Continuum Fullview" className={styles.modalImage} />
                    </div>
                </div>
            )}
        </section>
    );
}