/**
 * Reusable loading spinner component with customizable text.
 * Props: text (string).
 */
//This is a loader component for the React application. It is used to display a loading animation while the application is loading. It is a React component that is used to display a loading animation while the application is loading.
import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.core}></div>
      </div>
      <div className={styles.text}>CALIBRATING INSTRUMENTS...</div>
    </div>
  );
};

export default Loader;
