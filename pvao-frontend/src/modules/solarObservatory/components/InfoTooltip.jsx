import React, { useState } from 'react';
import styles from '../SolarObservatory.module.css';

export const InfoTooltip = ({ text }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className={styles.tooltipContainer}>
            <span
                className={styles.tooltipIcon}
                onClick={() => setVisible(!visible)}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            >
                ⓘ
            </span>
            {visible && (
                <div className={styles.tooltipBox}>
                    {text}
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;