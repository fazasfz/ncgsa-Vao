/**
 * 3D WebGL viewer of the Moon's surface using Three.js and a GLTF model.
 * Renders directional lighting and orbit controls.
 * Props: liveData, features, onSelectFeature.
 */
import React, { memo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import styles from './LunarSurfaceViewer.module.css';

const LunarSurfaceViewer = ({ liveData, features = [], onSelectFeature }) => {
  const mountRef = useRef(null);
  const dirLightRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000
    );
    // Position camera far enough to see a typical 1-unit or 2-unit radius sphere
    camera.position.z = 4;

    // 2.5 Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.03); // Subtle earthshine, prevents washout
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5); // Main sun illumination
    dirLight.position.set(0, 0, 5); // Default to full moon position
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountNode.appendChild(renderer.domElement);

    // 4. Orbit Controls (replicates camera-controls drag/zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 5. Load GLTF Model
    const loader = new GLTFLoader();
    let moonMesh = null;

    loader.load('/assets/moon.glb', (gltf) => {
      moonMesh = gltf.scene;

      // Center the model dynamically just in case it's offset
      const box = new THREE.Box3().setFromObject(moonMesh);
      const center = box.getCenter(new THREE.Vector3());
      moonMesh.position.sub(center);

      // Dynamically frame the camera (replicates model-viewer's auto-framing)
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const fovRad = THREE.MathUtils.degToRad(camera.aspect < 1 ? camera.fov : camera.fov * camera.aspect); // rough aspect adjustment
      
      // Calculate perfect distance to fit the sphere
      let fitDistance = sphere.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2);
      // If window is portrait, pull camera back further so horizontal edges aren't cropped
      if (camera.aspect < 1) {
        fitDistance = fitDistance / camera.aspect;
      }

      camera.position.z = fitDistance * 1.15; // 15% visual padding

      // Lock zoom controls so user can't zoom inside the moon or get lost in space
      controls.minDistance = sphere.radius * 1.1;
      controls.maxDistance = fitDistance * 3.0;
      controls.update();

      // Force smooth shading and a predictable standard diffuse material
      moonMesh.traverse(child => {
        if (child.isMesh) {
          // Recompute normals for smooth surface curvature (fixes hard straight line shadow)
          child.geometry.computeVertexNormals();
          
          // Override the complex physical material with a classic diffuse standard material
          const oldMat = child.material;
          child.material = new THREE.MeshStandardMaterial({
            map: oldMat.map,
            roughness: 1.0, // The moon is highly diffuse/rough (Lambertian-like)
            metalness: 0.0,
          });
          oldMat.dispose(); // clean up the original GLTF material
        }
      });

      scene.add(moonMesh);
      setIsLoading(false);
    }, undefined, (error) => {
      console.error('Error loading moon.glb:', error);
      setIsLoading(false);
    });

    // 6. Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 7. Handle window resize
    const handleResize = () => {
      if (!mountNode) return;
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const cleanMaterial = material => {
      material.dispose();
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose();
        }
      }
    };

    // 8. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Prevent memory leaks by properly disposing geometries and materials
      scene.traverse((object) => {
        if (!object.isMesh) return;
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(cleanMaterial);
          } else {
            cleanMaterial(object.material);
          }
        }
      });

      controls.dispose();
      renderer.dispose();
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update light position when liveData changes
  useEffect(() => {
    if (dirLightRef.current) {
      const sunAngle = liveData?.sun_moon_angle ?? 180;
      
      // Convert angle to radians. 
      // 180 (Full moon) -> light at +Z (shining from camera)
      // 90 (First quarter) -> light at +X (shining from right)
      // 0 (New moon) -> light at -Z (shining from behind)
      // 270 (Third quarter) -> light at -X (shining from left)
      const radians = THREE.MathUtils.degToRad(sunAngle);
      const radius = 5; // Fixed distance in world space
      
      const x = Math.sin(radians) * radius;
      const z = -Math.cos(radians) * radius;
      
      dirLightRef.current.position.set(x, 0, z);
    }
  }, [liveData]);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Karachi',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className={styles.wrapper}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          Loading 3D Model...
        </div>
      )}
      <div ref={mountRef} className={styles.viewer} />
    </div>
  );
};

export default memo(LunarSurfaceViewer);
