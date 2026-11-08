/**
 * Credits page displaying the contributors, supervisors, and interns of the project.
 * Note: Populated with real contributor data.
 */
import React from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from '../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../components/common/HUDLabel/HUDLabel';
import { contributors } from './data/contributors.data';
import styles from './CreditsPage.module.css';

const CreditsPage = () => {
  const supervisors = contributors.filter(c => c.role === 'Supervisor');
  const interns = contributors.filter(c => c.role === 'Intern');

  return (
    <SectionWrapper id="credits" className={styles.creditsPage} overlay={false}>
      <div className={styles.header}>
        <h1 className={styles.heading}>MISSION CONTRIBUTORS</h1>
        <p className={styles.description}>
          Personnel responsible for the engineering and scientific operations of the VAO system.
        </p>
      </div>

      <div className={styles.content}>
        {supervisors.length > 0 && (
          <div className={styles.roleGroup}>
            <h2 className={styles.roleHeading}>SUPERVISORY BOARD</h2>
            <Row gutter={[24, 24]}>
              {supervisors.map((person, idx) => (
                <Col xs={24} md={12} key={`sup-${idx}`}>
                  <div className={styles.personCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardInfo}>
                        <h3 className={styles.name}>{person.name || '[ TBD ]'}</h3>
                        <p className={styles.title}>{person.title || person.degree || '[ DATA PENDING ]'}</p>
                      </div>
                      <div className={styles.imagePlaceholder}>
                        {person.image ? (
                          <img 
                            src={person.image} 
                            alt={person.name} 
                            className={`${styles.personImage} ${person.noZoom ? styles.noZoom : ''}`} 
                            style={{ objectPosition: person.imagePosition || 'top center' }}
                          />
                        ) : (
                          <div className={styles.imagePlaceholderInner}></div>
                        )}
                      </div>
                    </div>
                    {person.institution && <p className={styles.institution}>{person.institution}</p>}
                    {person.description && <p className={styles.descriptionText}>{person.description}</p>}
                    {person.module && <span className={styles.moduleTag}>{person.module}</span>}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {interns.length > 0 && (
          <div className={styles.roleGroup}>
            <h2 className={styles.roleHeading}>ENGINEERING & RESEARCH INTERNS</h2>
            <Row gutter={[16, 16]}>
              {interns.map((person, idx) => (
                <Col xs={24} md={12} lg={12} key={`int-${idx}`}>
                  <div className={styles.personCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardInfo}>
                        <h3 className={styles.name}>{person.name || '[ TBD ]'}</h3>
                        <p className={styles.title}>{person.title || person.degree || '[ DATA PENDING ]'}</p>
                      </div>
                      <div className={styles.imagePlaceholder}>
                        {person.image ? (
                          <img 
                            src={person.image} 
                            alt={person.name} 
                            className={`${styles.personImage} ${person.noZoom ? styles.noZoom : ''}`} 
                            style={{ objectPosition: person.imagePosition || 'top center' }}
                          />
                        ) : (
                          <div className={styles.imagePlaceholderInner}></div>
                        )}
                      </div>
                    </div>
                    {person.institution && <p className={styles.institution}>{person.institution}</p>}
                    {person.description && <p className={styles.descriptionText}>{person.description}</p>}
                    {person.module && <span className={styles.moduleTag}>{person.module}</span>}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default CreditsPage;
