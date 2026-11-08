/**
 * Dropdown selector to switch the lunar viewer between 2D Map and 3D Globe modes.
 * Props: viewMode (string), setViewMode (function).
 */
import React from 'react';
import { Select } from 'antd';

import styles from './ViewModeSelector.module.css';

export default function ViewModeSelector({ viewMode, setViewMode }) {
  return (
    <div className={styles.selectorWrapper}>
      <Select
        value={viewMode}
        onChange={setViewMode}
        className={styles.selector}
        dropdownClassName={styles.dropdown}
        bordered={false}
        options={[
          {
            value: 'Snapshot',
            label: (
              <div className={styles.option}>
                <span>[ MOON ]</span>
                <span>2D Snapshot</span>
              </div>
            ),
          },
          {
            value: '3D',
            label: (
              <div className={styles.option}>
                <span>[ GLB ]</span>
                <span>3D Model</span>
              </div>
            ),
          },
          {
            value: 'Terrain',
            label: (
              <div className={styles.option}>
                <span>[ MTN ]</span>
                <span>Terrain Map</span>
              </div>
            ),
          },
          {
            value: 'Geographic',
            label: (
              <div className={styles.option}>
                <span>[ MAP ]</span>
                <span>Geographic Map</span>
              </div>
            ),
          },
          {
            value: 'Shade',
            label: (
              <div className={styles.option}>
                <span>[ SUN ]</span>
                <span>Shaded Relief</span>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
