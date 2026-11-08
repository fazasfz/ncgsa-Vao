/**
 * Root entry point for the Solar System Simulator module.
 * Renders an ExternalModuleLaunch wrapper to redirect users to the external interactive 3D simulator.
 */
import React from 'react';
import ExternalModuleLaunch from '../../components/common/ExternalModuleLaunch/ExternalModuleLaunch';
import imgSolarSystem from '../../assets/images/modules/solar-system.jpg';

const data = {
  id: 'solar-system-simulator',
  name: 'Solar System Simulator',
  description: 'Interactive 3D simulation of our solar system with real-time planetary positions.',
  bgImage: imgSolarSystem,
  externalUrl: 'https://dynamix209.github.io/solar-system-orbital-simulator/'
};

export default function SolarSystemSimulatorPage() {
  return <ExternalModuleLaunch {...data} />;
}
