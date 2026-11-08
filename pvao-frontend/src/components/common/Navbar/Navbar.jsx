/**
 * Global navigation bar for the PVAO application.
 * Features an Outfitters-inspired left-aligned brand logo, hamburger menu,
 * adjacent primary navigation links, right-side search, and Astro-Copilot trigger.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Drawer, Dropdown } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';

import { PATHS } from '../../../routes/routePaths';
import { useAstroCopilotContext } from '../../../context/AstroCopilotContext';
import vaoLogo from '../../../assets/images/vao-logo.png';
import styles from './Navbar.module.css';

const { Header } = Layout;

const searchableItems = [
  { title: 'Solar Observatory', category: 'Module', path: PATHS.SOLAR_OBSERVATORY, desc: 'Real-time solar wind telemetry, 3D sun, flares, and sunspots' },
  { title: 'Lunar Observatory', category: 'Module', path: PATHS.LUNAR_OBSERVATORY, desc: '3D interactive Moon, live ephemeris telemetry, and lunar cartography' },
  { title: 'Deep Sky Explorer', category: 'Module', path: PATHS.DEEP_SKY_EXPLORER, desc: 'HiPS sky atlas and astronomical object catalog' },
  { title: 'Zenith Sky Map', category: 'Module', path: PATHS.ZENITH, desc: 'Interactive celestial sphere, constellations, and live night sky' },
  { title: 'Astronomical Probes', category: 'Module', path: PATHS.ASTRONOMICAL_PROBE_TRACKER, desc: 'Real-time deep space probes and orbital telemetry' },
  { title: 'Exora', category: 'External Tool', url: 'https://exora-space.vercel.app/', desc: 'Unveil distant worlds, where every signal holds a story and every discovery reveals a new chapter of the cosmos.' },
  { title: 'Solar System Simulator', category: 'Tool', url: 'https://dynamix209.github.io/solar-system-orbital-simulator/', desc: 'N-body physics orbital simulator' },
  { title: 'Data Sources', category: 'Explore', path: PATHS.DATA_SOURCES, desc: 'Observational data pipelines from NASA, SDO, USGS, and ESA' },
  { title: 'Astronomy Glossary', category: 'Explore', path: PATHS.GLOSSARY, desc: 'Dictionary of astronomical definitions and formulas' },
  { title: 'Credits & Acknowledgments', category: 'Explore', path: PATHS.CREDITS, desc: 'PVAO mission team, libraries, and open-source credits' },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const { openCopilot } = useAstroCopilotContext();
  const navigate = useNavigate();

  const moduleItems = [
    { key: 'solar', label: <NavLink to={PATHS.SOLAR_OBSERVATORY}>Solar Observatory</NavLink> },
    { key: 'lunar', label: <NavLink to={PATHS.LUNAR_OBSERVATORY}>Lunar Observatory</NavLink> },
    { key: 'exora', label: <a href="https://exora-space.vercel.app/" target="_blank" rel="noopener noreferrer">Exora</a> },
    { key: 'deepSky', label: <NavLink to={PATHS.DEEP_SKY_EXPLORER}>Deep Sky Explorer</NavLink> },
    { key: 'sky', label: <NavLink to={PATHS.ZENITH}>Zenith</NavLink> },
    { key: 'probes', label: <NavLink to={PATHS.ASTRONOMICAL_PROBE_TRACKER}>Astronomical Probes</NavLink> },
  ];

  const exploreItems = [
    { key: 'credits', label: <NavLink to={PATHS.CREDITS}>Credits</NavLink> },
    { key: 'dataSources', label: <NavLink to={PATHS.DATA_SOURCES}>Data Sources</NavLink> },
    { key: 'glossary', label: <NavLink to={PATHS.GLOSSARY}>Glossary</NavLink> },
  ];

  const toolsItems = [
    { key: 'simulator', label: <a href="https://dynamix209.github.io/solar-system-orbital-simulator/" target="_blank" rel="noopener noreferrer">Solar System Simulator</a> },
    { key: 'copilot', label: <div onClick={openCopilot} style={{ cursor: 'pointer' }}>Astro-Copilot</div> },
  ];

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredResults = searchableItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectResult = (item) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (item.path) {
      navigate(item.path);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getNavClass = ({ isActive }) => isActive ? `${styles.navBtn} ${styles.activeNavBtn}` : styles.navBtn;
  const getMobileNavClass = ({ isActive }) => isActive ? `${styles.mobileModuleLink} ${styles.activeMobileLink}` : styles.mobileModuleLink;

  return (
    <>
      <Header className={styles.navbar}>
        {/* Left Section: Menu button + Brand Logo on Left + Nav items next to it */}
        <div className={styles.leftSection}>
          <button 
            type="button" 
            className={styles.hamburgerBtn} 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

          <NavLink to={PATHS.LANDING} className={styles.brandLink}>
            <img src={vaoLogo} alt="VAO logo" className={styles.logoImage} />
          </NavLink>

          <nav className={styles.desktopNav}>
            <NavLink to={PATHS.LANDING} className={getNavClass} end>HOME</NavLink>
            <Dropdown menu={{ items: moduleItems }} trigger={['hover']} rootClassName={styles.navDropdown}>
              <span className={`${styles.navBtn} ${styles.dropdownTrigger}`}>MODULES</span>
            </Dropdown>
            <Dropdown menu={{ items: exploreItems }} trigger={['hover']} rootClassName={styles.navDropdown}>
              <span className={`${styles.navBtn} ${styles.dropdownTrigger}`}>EXPLORE</span>
            </Dropdown>
            <Dropdown menu={{ items: toolsItems }} trigger={['hover']} rootClassName={styles.navDropdown}>
              <span className={`${styles.navBtn} ${styles.dropdownTrigger}`}>TOOLS</span>
            </Dropdown>
          </nav>
        </div>

        {/* Right Section: Search & Utilities */}
        <div className={styles.rightSection}>
          <div 
            className={styles.searchBox} 
            onClick={() => setSearchOpen(true)}
            role="button"
            tabIndex={0}
          >
            <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className={styles.searchText}>Search</span>
          </div>

          <button 
            type="button" 
            className={styles.iconBtn} 
            onClick={openCopilot}
            title="Astro-Copilot AI"
            aria-label="Open Astro-Copilot"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
              <rect x="4" y="8" width="16" height="12" rx="4"/>
              <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
              <path d="M9 17h6"/>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <Drawer 
          title="SYSTEM NAVIGATION" 
          placement="left" 
          onClose={() => setMobileMenuOpen(false)} 
          open={mobileMenuOpen} 
          className={styles.mobileDrawer}
        >
          <div className={styles.mobileModuleList}>
            <NavLink to={PATHS.LANDING} className={getMobileNavClass} onClick={() => setMobileMenuOpen(false)} end>
              HOME
            </NavLink>
            
            <div className={styles.mobileSectionHeader}>MODULES</div>
            <div className={styles.mobileSubMenu}>
              {moduleItems.map(item => (
                <div key={item.key} className={styles.mobileSubMenuItem} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </div>
              ))}
            </div>

            <div className={styles.mobileSectionHeader}>EXPLORE</div>
            <div className={styles.mobileSubMenu}>
              {exploreItems.map(item => (
                <div key={item.key} className={styles.mobileSubMenuItem} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </div>
              ))}
            </div>

            <div className={styles.mobileSectionHeader}>TOOLS</div>
            <div className={styles.mobileSubMenu}>
              {toolsItems.map(item => (
                <div key={item.key} className={styles.mobileSubMenuItem} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      </Header>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
          <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.searchInputRow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search observatories, celestial maps, tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.modalSearchInput}
              />
              <button className={styles.modalCloseBtn} onClick={() => setSearchOpen(false)}>ESC</button>
            </div>

            <div className={styles.searchResultsList}>
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <div 
                    key={index} 
                    className={styles.searchResultItem}
                    onClick={() => handleSelectResult(item)}
                  >
                    <div className={styles.resultMain}>
                      <span className={styles.resultTitle}>{item.title}</span>
                      <span className={styles.resultDesc}>{item.desc}</span>
                    </div>
                    <span className={styles.resultBadge}>{item.category}</span>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>No matching astronomical modules found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
