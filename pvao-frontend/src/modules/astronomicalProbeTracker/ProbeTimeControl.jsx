import React from "react";
import styles from "./astronomicalProbeTracker.module.css";

export const ProbeTimeControl = ({ isLive, timeMultiplier, onToggleLive, onSpeedChange }) => {
    return (
        <div className={styles.aptControlBar}>
            <button className={`${styles.aptBtn} ${isLive ? styles.aptBtnActive : ""}`} onClick={onToggleLive}>
                {isLive ? "● LIVE SYNC" : "PAUSED"}
            </button>
            <div className={styles.aptSpeedSelector}>
                {[1, 5, 10, 60].map((spd) => (
                    <button
                        key={spd}
                        className={`${styles.aptSpeedBtn} ${timeMultiplier === spd ? styles.aptSpeedActive : ""}`}
                        onClick={() => onSpeedChange(spd)}
                    >
                        {spd}x
                    </button>
                ))}
            </div>
        </div>
    );
};