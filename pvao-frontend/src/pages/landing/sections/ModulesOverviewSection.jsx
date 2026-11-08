/**
 * Landing page section rendering a 6-column editorial grid of ModuleCards for navigation.
 */
import React from 'react';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import ModuleCard from '../../../components/common/ModuleCard/ModuleCard';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { modulesData } from '../data/modules.data';
import styles from './ModulesOverviewSection.module.css';

const ModulesOverviewSection = () => {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <SectionWrapper id="modules" className={styles.modulesSection} overlay={false}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>INSTRUMENTS & OBSERVATORIES</span>
            <h2 className={styles.heading}>NAVIGATE THE COSMOS</h2>
            <p className={styles.subhead}>SIX INSTRUMENTS. ONE SKY.</p>
          </div>

          <div className={styles.cardGrid}>
            {modulesData.map((mod) => (
              <ModuleCard 
                key={mod.id}
                name={mod.name}
                linkTo={mod.externalUrl || mod.path}
                bgImage={mod.bgImage}
                isExternal={Boolean(mod.externalUrl)}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ModulesOverviewSection;

