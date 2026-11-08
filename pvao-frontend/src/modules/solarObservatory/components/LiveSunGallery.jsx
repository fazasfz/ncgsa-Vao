/**
 * Displays a gallery of live solar images across different wavelengths from SDO.
 * Allows users to select and view specific solar imagery feeds.
 * Props: images (array), loading (boolean).
 */
import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';
import SectionHeading from '../../../components/common/SectionHeading/SectionHeading';

export const LiveSunGallery = ({ images, loading }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const cards = [
        { key: 'aia_171', title: 'SDO AIA 171 Å (Atmosphere)', src: images?.aia_171 },
        { key: 'aia_304', title: 'SDO AIA 304 Å (Chromosphere)', src: images?.aia_304 },
        { key: 'hmi_mag', title: 'SDO HMI Magnetogram', src: images?.hmi_mag },
        { key: 'lasco_c3', title: 'SOHO LASCO C3 (Corona)', src: images?.lasco_c3 },
    ];

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

    return (
        <section className={styles.gallerySection}>
            <h2 className={styles.sectionTitle}>
                The Sun Through Different Lenses
            </h2>
            <div className={styles.galleryGrid}>
                {cards.map((card) => (
                    <div
                        key={card.key}
                        className={styles.imageCard}
                        onClick={() => card.src && setSelectedImage(card)}
                    >
                        {loading || !card.src ? (
                            <div className={styles.imagePlaceholder}>Loading Live Satellite Feed...</div>
                        ) : (
                            <img
                                src={card.src}
                                alt={card.title}
                                className={styles.solarImage}
                            />
                        )}
                        <span className={styles.imageCaption}>{card.title}</span>
                    </div>
                ))}
            </div>

            {/* Fullscreen Lightbox Modal */}
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

export default LiveSunGallery;