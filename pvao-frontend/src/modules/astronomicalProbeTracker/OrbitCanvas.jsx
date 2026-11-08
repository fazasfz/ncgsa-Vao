import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import styles from "./astronomicalProbeTracker.module.css";

const MODEL_PATHS = {
  earth: "/models/planet_earth.glb",
  moon: "/models/our_moon.glb",
  mars: "/models/mars.glb",
  sun: "/models/sun.glb",
};

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));

function StandardizedCelestialBody({ target }) {
  const targetKey = target?.toLowerCase() || "earth";
  const path = MODEL_PATHS[targetKey] || MODEL_PATHS.earth;
  const { scene } = useGLTF(path);
  const modelRef = useRef();

  React.useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center);

      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);
      if (sphere.radius > 0) {
        const bodyRadiusMap = {
          sun: 10,
          earth: 7,
          mars: 7,
          moon: 7
        };
        const desiredRadius = bodyRadiusMap[targetKey] || 4.8;
        const scaleFactor = desiredRadius / sphere.radius;
        modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }
    }
  }, [scene, targetKey]);

  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function DynamicOrbitRing({ radius }) {
  const lineGeometry = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  // Cleanup WebGL Geometry from VRAM when ring unmounts or changes radius
  useEffect(() => {
    return () => {
      lineGeometry.dispose();
    };
  }, [lineGeometry]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        attach="material"
        color="#00f3ff"
        opacity={0.55}
        transparent
        linewidth={1}
      />
    </line>
  );
}

function AnimatedProbe({
  probe,
  idx,
  live,
  isSelected,
  isHovered,
  onSelectProbe,
  onHoverProbe,
  setHoveredProbeId,
  totalProbes,
  timeMultiplier,
  isLive,
  targetKey
}) {
  const groupRef = useRef();
  const rawX = Number(live?.x ?? 0);
  const rawY = Number(live?.y ?? 0);
  const rawZ = Number(live?.z ?? 0);
  const realDist = Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);

  const bodyRadiusMap = { sun: 10, earth: 7, mars: 7, moon: 7 };
  const baseRadius = bodyRadiusMap[targetKey] || 7.0;
  const orbitRadius = baseRadius + 1.2 + (idx * 0.95);

  // Dynamic initial angle recalculation when live vectors arrive
  const initialAngle = useMemo(() => {
    if (realDist > 0) {
      return Math.atan2(rawZ, rawX);
    }
    return (idx / Math.max(totalProbes, 1)) * Math.PI * 2;
  }, [probe.id, realDist > 0, rawX, rawZ, idx, totalProbes]);

  const inclinationRad = useMemo(() => {
    if (realDist > 0) {
      return Math.atan2(rawY, Math.sqrt(rawX * rawX + rawZ * rawZ));
    }
    return ((idx * 25) % 60 - 30) * (Math.PI / 180);
  }, [probe.id, realDist > 0, rawY, rawX, rawZ, idx]);

  const angleRef = useRef(initialAngle);
  const baseOrbitalSpeed = 0.008 / Math.sqrt(orbitRadius / baseRadius);

  useFrame((_, delta) => {
    if (isLive && groupRef.current) {
      const speedFactor = baseOrbitalSpeed * timeMultiplier;
      angleRef.current += delta * speedFactor;

      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
    }
  });

  const showLabel = isSelected || isHovered;

  const targetProbePayload = {
    ...probe,
    ...live,
    id: probe.id,
  };

  return (
    <group rotation={[inclinationRad, 0, 0]}>
      <DynamicOrbitRing radius={orbitRadius} />
      <group
        ref={groupRef}
        position={[
          Math.cos(initialAngle) * orbitRadius,
          0,
          Math.sin(initialAngle) * orbitRadius
        ]}
      >
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectProbe(targetProbePayload);
          }}
          onPointerOver={() => {
            setHoveredProbeId(probe.id);
            onHoverProbe?.(targetProbePayload);
          }}
          onPointerOut={() => {
            setHoveredProbeId(null);
            onHoverProbe?.(null);
          }}
        >
          <sphereGeometry args={[isSelected ? 0.16 : 0.12, 16, 16]} />
          <meshBasicMaterial color={isSelected ? "#f59e0b" : isHovered ? "#fbbf24" : "#38bdf8"} />
        </mesh>

        {showLabel && (
          <Html
            center
            occlude
            style={{
              pointerEvents: "auto",
              transform: "translate3d(14px, -50%, 0)",
            }}
          >
            <div
              className={`${styles.aptCleanProbeLabel} ${isSelected ? styles.aptCleanProbeSelected : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectProbe(targetProbePayload);
              }}
            >
              <span className={styles.aptProbeNameText}>{probe.name}</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

export const OrbitCanvas = ({
  target = "earth",
  allProbes = [],
  filteredProbes = [],
  telemetryMap = {},
  onSelectProbe,
  onHoverProbe,
  selectedProbe,
  timeMultiplier = 1,
  isLive = true
}) => {
  const [hoveredProbeId, setHoveredProbeId] = useState(null);
  const targetKey = target?.toLowerCase() || "earth";

  const targetSpecificProbes = useMemo(() => {
    return allProbes.filter((probe) => {
      // String comparison handles numerical probe IDs cleanly
      const isVisible = filteredProbes.some((p) => String(p.id) === String(probe.id));
      if (!isVisible) return false;

      const rawTarget =
        probe.target_center ||
        probe.targetCenter ||
        probe.target ||
        probe.body ||
        probe.center ||
        probe.orbiting;

      let probeTarget = rawTarget ? String(rawTarget).toLowerCase() : "";

      // Unambiguous keyword matching
      if (probeTarget === "moon" || probeTarget.includes("luna") || probeTarget === "selene") probeTarget = "moon";
      else if (probeTarget.includes("mars") || probeTarget.includes("areo")) probeTarget = "mars";
      else if (probeTarget.includes("sun") || probeTarget.includes("sol") || probeTarget.includes("helio")) probeTarget = "sun";
      else if (probeTarget.includes("earth") || probeTarget.includes("geo")) probeTarget = "earth";

      if (!probeTarget) return true;

      return probeTarget === targetKey;
    });
  }, [allProbes, filteredProbes, targetKey]);

  return (
    <div className={styles.aptCanvasContainer}>
      <Canvas
        camera={{ position: [0, 14, 26], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={targetKey === "sun" ? 3.0 : 1.6} />
        <directionalLight position={[6, 4, 6]} intensity={2.2} />
        <directionalLight position={[-6, -4, -6]} intensity={0.8} />

        <Stars radius={300} depth={60} count={12000} factor={6} saturation={0} fade speed={1} />

        <React.Suspense fallback={null}>
          <StandardizedCelestialBody key={targetKey} target={targetKey} />
        </React.Suspense>

        {targetSpecificProbes.map((probe, idx) => {
          const live = telemetryMap[probe.id] || probe;
          const isSelected = selectedProbe && String(selectedProbe.id) === String(probe.id);
          const isHovered = hoveredProbeId && String(hoveredProbeId) === String(probe.id);

          return (
            <AnimatedProbe
              key={probe.id}
              probe={probe}
              idx={idx}
              live={live}
              isSelected={isSelected}
              isHovered={isHovered}
              onSelectProbe={onSelectProbe}
              onHoverProbe={onHoverProbe}
              setHoveredProbeId={setHoveredProbeId}
              totalProbes={targetSpecificProbes.length}
              timeMultiplier={timeMultiplier}
              isLive={isLive}
              targetKey={targetKey}
            />
          );
        })}

        <OrbitControls enableZoom={true} enablePan={false} rotateSpeed={0.5} maxDistance={48} minDistance={8} />
      </Canvas>
    </div>
  );
};

export default OrbitCanvas;