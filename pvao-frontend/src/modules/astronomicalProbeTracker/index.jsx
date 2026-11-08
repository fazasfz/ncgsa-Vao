import React, { useState, useEffect, useRef } from "react";
import { ProbeTrackerHeader } from "./ProbeTrackerHeader";
import { ProbeTelemetryCard } from "./ProbeTelemetryCard";
import { OrbitCanvas } from "./OrbitCanvas";
import { ProbeTimeControl } from "./ProbeTimeControl";
import { getProbesByTarget, getLiveTelemetry } from "./probeApi";
import styles from './astronomicalProbeTracker.module.css';

export default function AstronomicalProbeTracker() {
  const [target, setTarget] = useState("earth");
  const [probes, setProbes] = useState([]);
  const [telemetryMap, setTelemetryMap] = useState({});
  const [search, setSearch] = useState("");
  const [selectedProbe, setSelectedProbe] = useState(null);
  const [hoveredProbe, setHoveredProbe] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [lastSync, setLastSync] = useState("");

  // Keep a ref to track currently selected probe ID against async race conditions
  const selectedProbeIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // Reset selection and state immediately on target body switch
    setSelectedProbe(null);
    selectedProbeIdRef.current = null;
    setTelemetryMap({});
    setProbes([]);

    getProbesByTarget(target).then(async (data) => {
      const probeList = data?.probes || [];
      if (!isMounted) return;

      setProbes(probeList);

      const results = {};
      await Promise.all(
        probeList.map(async (p) => {
          try {
            const liveData = await getLiveTelemetry(target, p.id);
            results[p.id] = { ...p, ...liveData, id: p.id };
          } catch (e) {
            console.warn(`Live telemetry pending for ${p.id}`, e);
          }
        })
      );

      if (isMounted) {
        setTelemetryMap(results);
        setLastSync(new Date().toLocaleTimeString());

        if (probeList.length > 0) {
          const firstId = probeList[0].id;
          const initialProbe = results[firstId] || probeList[0];
          setSelectedProbe(initialProbe);
          selectedProbeIdRef.current = String(firstId);
        }
      }
    });

    return () => { isMounted = false; };
  }, [target]);

  const handleSelectProbe = async (probe) => {
    if (!probe || probe.id === undefined || probe.id === null) return;

    const probeIdStr = String(probe.id);
    selectedProbeIdRef.current = probeIdStr;

    const cached = telemetryMap[probe.id] || probe;
    setSelectedProbe(cached);

    try {
      const freshData = await getLiveTelemetry(target, probe.id);

      // Prevent stale async response from overwriting if user clicked another probe mid-fetch
      if (selectedProbeIdRef.current === probeIdStr) {
        const merged = { ...probe, ...freshData, id: probe.id };
        setSelectedProbe(merged);
        setTelemetryMap((prev) => ({ ...prev, [probe.id]: merged }));
      }
    } catch (err) {
      console.warn("Using fallback telemetry data for probe:", probe.id, err);
    }
    setSearch("");
  };

  const filteredProbes = probes.filter((p) =>
    String(p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.aptModuleLayout}>
      <ProbeTrackerHeader
        activeBody={target}
        setActiveBody={setTarget}
        searchQuery={search}
        setSearchQuery={setSearch}
        activeCount={filteredProbes.length}
        lastUpdated={lastSync}
      />

      <div className={styles.aptViewport}>
        <OrbitCanvas
          target={target}
          allProbes={probes}
          filteredProbes={filteredProbes}
          telemetryMap={telemetryMap}
          onSelectProbe={handleSelectProbe}
          onHoverProbe={setHoveredProbe}
          selectedProbe={selectedProbe}
          timeMultiplier={speed}
          isLive={isLive}
        />

        <ProbeTimeControl
          isLive={isLive}
          timeMultiplier={speed}
          onToggleLive={() => setIsLive(!isLive)}
          onSpeedChange={setSpeed}
        />

        {selectedProbe && (
          <ProbeTelemetryCard
            telemetry={selectedProbe}
            targetBody={target}
            onClose={() => {
              setSelectedProbe(null);
              selectedProbeIdRef.current = null;
            }}
          />
        )}
      </div>
    </div>
  );
}