import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { EyeOutlined, ExpandOutlined, CompassOutlined } from '@ant-design/icons';
import { fetchAPOD } from '../../../api/nasaApi';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import defaultNebulaImg from '../../../assets/images/modules/nebula.webp';
import styles from './ApodSpotlightSection.module.css';

const ApodSpotlightSection = () => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(defaultNebulaImg);

  useEffect(() => {
    let mounted = true;
    fetchAPOD()
      .then(data => {
        if (mounted && data) {
          setApodData(data);
          setImageSrc(data.hdurl || data.url || defaultNebulaImg);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('APOD fetch failed on landing:', err);
        if (mounted) {
          setImageSrc(defaultNebulaImg);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const apodTitle = apodData?.title || "The Pillars of Creation (M16)";
  const apodDate = apodData?.date || "Featured Cosmic Observation";
  const apodExplanation = apodData?.explanation || 
    "Towering celestial tendrils of interstellar gas and dust stand inside the Eagle Nebula (M16). Star formation unfolds within these dense columns where newborn stars sculpt the surrounding landscape with intense stellar radiation.";
  const apodCopyright = apodData?.copyright || "NASA, ESA, CSA, STScI";
  
  const isVideo = apodData?.media_type === 'video' || (typeof imageSrc === 'string' && (imageSrc.endsWith('.mp4') || imageSrc.endsWith('.webm')));
  const isEmbedVideo = isVideo && (typeof imageSrc === 'string' && (imageSrc.includes('youtube.com') || imageSrc.includes('youtu.be') || imageSrc.includes('vimeo.com')));
  const hdUrl = apodData?.hdurl || (typeof imageSrc === 'string' ? imageSrc : null);

  const handleImageError = () => {
    setImageSrc(defaultNebulaImg);
  };

  return (
    <SectionWrapper id="apod-spotlight" className={styles.apodSection} overlay={false}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>ASTRONOMY PICTURE OF THE DAY</h2>
          <HUDLabel text={`LIVE FEED | APOD ${isVideo ? '(VIDEO)' : ''}`} />
        </div>

        <div className={styles.spotlightCard}>
          <Row gutter={[0, 0]} className={styles.cardRow}>
            {/* Visual Media Column */}
            <Col xs={24} lg={14} className={styles.mediaCol}>
              <div className={styles.mediaFrame}>
                {isVideo ? (
                  isEmbedVideo ? (
                    <iframe
                      src={imageSrc}
                      title={apodTitle}
                      className={styles.apodIframe}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={imageSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className={styles.apodVideo}
                    />
                  )
                ) : (
                  <img 
                    src={imageSrc} 
                    alt={apodTitle} 
                    className={styles.apodImage}
                    onError={handleImageError} 
                  />
                )}
                <div className={styles.mediaBadge}>
                  <span className={styles.livePulse}></span>
                  <span>{isVideo ? 'COSMIC VIDEO FEED' : 'NASA DEEP SPACE'}</span>
                </div>
              </div>
            </Col>

            {/* Narrative & Telemetry Column */}
            <Col xs={24} lg={10} className={styles.contentCol}>
              <div className={styles.contentInner}>
                <div className={styles.metaRow}>
                  <span className={styles.dateTag}>
                    <CompassOutlined className={styles.metaIcon} />
                    {apodDate}
                  </span>
                </div>

                <h3 className={styles.apodTitle}>{apodTitle}</h3>

                <p className={styles.apodDesc}>
                  {apodExplanation}
                </p>

                <div className={styles.footerRow}>
                  <div className={styles.creditBlock}>
                    <span className={styles.creditLabel}>CREDIT / ARCHIVE</span>
                    <span className={styles.creditValue}>© {apodCopyright}</span>
                  </div>

                  {hdUrl && typeof hdUrl === 'string' && (
                    <a 
                      href={hdUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.hdButton}
                    >
                      <ExpandOutlined />
                      <span>FULL ASSET</span>
                    </a>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ApodSpotlightSection;
