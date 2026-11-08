import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';

export const InteractiveSun = ({ telemetry, loading }) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Karachi',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            setCurrentTime(now.toLocaleString('en-US', options));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const embedUrl =
        'https://sketchfab.com/models/4cc0061b574941c4b6e77858a3d6acc7/embed?autostart=1&internal=1&ui_animation=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_controls=0';

    const overlayStats = [
        { label: 'AGE', value: '4.5 Billion Years' },
        { label: 'STAR TYPE', value: 'Yellow Dwarf' },
        { label: 'RADIUS', value: '696,340 kilometers' },
        { label: 'TEMPERATURE', value: '5,500 degrees Celsius' }
    ];

    return (
        <div className={styles.solarStage}>
            <div className={styles.sketchfabWrapper}>
                <iframe
                    title="Star/Celestial object/Sun"
                    className={styles.sketchfabIframe}
                    src={embedUrl}
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    execution-while-out-of-viewport="true"
                    execution-while-not-rendered="true"
                    web-share="true"
                />
            </div>

            <div className={styles.timestampBadge}>
                LIVE OBSERVED TIME (PKT):{' '}
                {currentTime}
            </div>
        </div>
    );
};

export default InteractiveSun;