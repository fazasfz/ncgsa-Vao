import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';

const CORONAL_MEDIA = [
    {
        id: 'coronal-hole',
        title: 'Coronal Holes (SDO AIA 193 Å)',
        subtitle: 'SDO AIA 193 Å',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg',
    },
    {
        id: 'ccor-1',
        title: 'CME Watch (GOES SUVI 304 Å)',
        subtitle: 'GOES SUVI 304 Å',
        url: 'https://services.swpc.noaa.gov/images/animations/suvi/primary/304/latest.png',
    },
    {
        id: 'ccor-2',
        title: 'CME Watch (GOES SUVI 195 Å)',
        subtitle: 'GOES SUVI 195 Å',
        url: 'https://services.swpc.noaa.gov/images/animations/suvi/primary/195/latest.png',
    },
    {
        id: 'lasco-c2',
        title: 'CME Watch (SOHO LASCO C2)',
        subtitle: 'SOHO LASCO C2',
        url: 'https://soho.nascom.nasa.gov/data/realtime/c2/1024/latest.jpg',
    }
];

export default function CoronalEvents() {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        if (selectedImage) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    return (
        <section className={styles.gallerySection}>
            <h2 className={styles.sectionTitle}>
                Coronal Holes & Coronal Mass Ejections
            </h2>

            {/* Gallery Grid Matching LiveSunGallery */}
            <div className={styles.galleryGrid}>
                {CORONAL_MEDIA.map((item) => (
                    <div
                        key={item.id}
                        className={styles.imageCard}
                        onClick={() => setSelectedImage(item)}
                    >
                        <img
                            src={item.url}
                            alt={item.title}
                            className={styles.solarImage}
                        />
                        <span className={styles.imageCaption}>{item.title}</span>
                    </div>
                ))}
            </div>

            {/* Fullscreen Lightbox Modal Matching LiveSunGallery */}
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
                            src={selectedImage.url}
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
}