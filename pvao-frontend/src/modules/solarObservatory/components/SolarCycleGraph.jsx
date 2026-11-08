/**
 * Renders a chart visualizing the progression of the solar cycle (sunspot activity over time).
 * Integrates external space weather data to plot solar maximum/minimum.
 */
import React, { useEffect, useState } from 'react';
import {
    ComposedChart, Area, Bar, Line, Scatter, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '../SolarObservatory.module.css';

import { useSolarCycle } from '../hooks/useSolarCycle';

export const SolarCycleGraph = () => {
    const { cycleData, loading, error } = useSolarCycle();

    return (
        <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>
                Solar Cycle Progression
            </h2>

            {loading && <div className={styles.chartLoading}>Fetching real-time NOAA data...</div>}
            {error && <div className={styles.chartError}>Error: {error}</div>}

            {!loading && !error && (
                <div className={styles.chartCard}>
                    <h3 className={styles.chartSubTitle}>Multi-variable timeline of solar activity, magnetic flux, and eruption trends.</h3>
                    <div className={styles.chartBodyComposed}>
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart
                                data={cycleData}
                                margin={{ top: 10, right: 30, bottom: 35, left: 10 }}
                            >
                                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    tick={{ fontSize: 12 }}
                                    dy={5}
                                />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: '15px' }} />
                                <Area type="monotone" dataKey="radio_flux" name="Radio Flux" fill="#312e81" stroke="#4338ca" fillOpacity={0.6} />
                                <Bar dataKey="ssn" name="Sunspot Count (SSN)" barSize={12} fill="#3b82f6" />
                                <Line type="monotone" dataKey="smoothed" name="Smoothed SSN" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                                <Scatter dataKey="dots" name="Flare Events" fill="#ef4444" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SolarCycleGraph;