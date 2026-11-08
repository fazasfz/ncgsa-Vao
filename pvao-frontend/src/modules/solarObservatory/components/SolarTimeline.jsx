import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styles from '../SolarObservatory.module.css';

export const SolarTimeline = () => {
    const [windowRange, setWindowRange] = useState('24H');
    const [timelineData, setTimelineData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let endpoint = 'https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json';
        if (windowRange === '7D' || windowRange === '30D') {
            endpoint = 'https://services.swpc.noaa.gov/json/goes/primary/xrays-7-day.json';
        }

        fetch(endpoint)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (!Array.isArray(data) || !data.length) {
                    setLoading(false);
                    return;
                }

                const primaryData = data.filter((item) => item.energy === '0.1-0.8nm' || !item.energy);
                const sourceList = primaryData.length ? primaryData : data;

                const total = sourceList.length;
                const step = windowRange === '24H' ? Math.max(1, Math.floor(total / 30)) : Math.max(1, Math.floor(total / 50));
                const sampled = [];

                for (let i = 0; i < total; i += step) {
                    const item = sourceList[i];
                    const rawTime = item.time_tag || item.timeTag || item.time;
                    const rawFlux = item.flux ?? item.flux_1 ?? 1e-8;

                    if (!rawTime) continue;

                    const dateObj = new Date(rawTime);
                    const pktDate = new Date(dateObj.getTime() + 5 * 60 * 60 * 1000);
                    const label = windowRange === '24H'
                        ? `${String(pktDate.getUTCHours()).padStart(2, '0')}:00`
                        : `${pktDate.getUTCMonth() + 1}/${pktDate.getUTCDate()}`;

                    sampled.push({
                        time: label,
                        flux: Number(rawFlux) > 0 ? Number(rawFlux) : 1e-8,
                    });
                }

                setTimelineData(sampled);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [windowRange]);

    return (
        <section className={styles.flaresSection}>
            <h2 className={styles.sectionTitle}>Solar Activity Timeline</h2>
            <div className={styles.flareTelemetryCard}>
                <div className={styles.telemetryHeader}>
                    <span className={styles.telemetryBadge}>X-RAY FLUX TIME-SERIES</span>
                    <div className={styles.filterGroup}>
                        {['24H', '7D'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setWindowRange(range)}
                                className={`${styles.filterBtn} ${windowRange === range ? styles.activeFilter : ''}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.timelineContainer}>
                    <p className={styles.timelineDesc}>
                        0.1–0.8nm Solar X-Ray Flux trend over the last <strong>{windowRange}</strong> (PKT Time).
                    </p>

                    {loading ? (
                        <div className={styles.telemetryStatus}>Rendering solar time-series chart...</div>
                    ) : timelineData.length > 0 ? (
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={timelineData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="fluxGlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" />
                                    <XAxis dataKey="time" stroke="#718096" tick={{ fontSize: 11 }} />
                                    <YAxis
                                        stroke="#718096"
                                        tick={{ fontSize: 10 }}
                                        scale="log"
                                        domain={['auto', 'auto']}
                                        tickFormatter={(val) => val.toExponential(0)}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a111e', borderColor: '#1e2d42', borderRadius: '6px' }}
                                        labelStyle={{ color: '#00e5ff', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#a0aec0' }}
                                        formatter={(val) => [`${Number(val).toExponential(2)} W/m²`, 'X-Ray Flux']}
                                    />
                                    <Area type="monotone" dataKey="flux" stroke="#00e5ff" strokeWidth={2} fillOpacity={1} fill="url(#fluxGlow)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className={styles.telemetryError}>Failed to load timeline stream.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SolarTimeline;