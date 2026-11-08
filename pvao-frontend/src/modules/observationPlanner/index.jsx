/**
 * Root entry point for the Observation Planner module.
 * Renders an ExternalModuleLaunch wrapper to redirect users to the observation planning application.
 */
import React from 'react';
import ExternalModuleLaunch from '../../components/common/ExternalModuleLaunch/ExternalModuleLaunch';
import imgObservationPlanner from '../../assets/images/modules/observation-planner.jpg';

const data = {
  id: 'observation-planner',
  name: 'Observation Planner',
  description: 'Plan and schedule your astronomical observations with real-time celestial data.',
  bgImage: imgObservationPlanner
};

export default function ObservationPlannerPage() {
  return <ExternalModuleLaunch {...data} />;
}
