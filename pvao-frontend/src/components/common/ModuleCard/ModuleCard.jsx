/**
 * UI card component for displaying and linking to a specific observatory module.
 * Minimalist editorial portrait style with centered uppercase title.
 * Props: name, linkTo, bgImage, isExternal.
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ModuleCard.module.css';

const FALLBACK_IMG = 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg'; 

const ModuleCard = ({ name, linkTo, bgImage, isExternal }) => {
  const [currentBg, setCurrentBg] = useState(bgImage);

  const handleImageError = () => {
    setCurrentBg(FALLBACK_IMG);
  };

  const cardInner = (
    <>
      <img src={currentBg} style={{ display: 'none' }} onError={handleImageError} alt="" />
      
      <div 
        className={styles.bgImage} 
        style={{ backgroundImage: `url(${currentBg})` }} 
      />
      <div className={styles.overlay} />
      
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
      </div>
    </>
  );

  const isExt = isExternal || (typeof linkTo === 'string' && (linkTo.startsWith('http://') || linkTo.startsWith('https://')));

  if (isExt) {
    return (
      <a
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.moduleCard}
        aria-label={name}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <NavLink 
      to={linkTo} 
      className={styles.moduleCard}
      aria-label={name}
    >
      {cardInner}
    </NavLink>
  );
};

export default ModuleCard;

