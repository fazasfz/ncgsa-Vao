/**
 * Root entry point for the Exora module.
 * Renders an ExternalModuleLaunch wrapper to redirect users to the external Exora application.
 */
import React from 'react';
import ExternalModuleLaunch from '../../components/common/ExternalModuleLaunch/ExternalModuleLaunch';
import { modulesData } from '../../pages/landing/data/modules.data';

const data = modulesData.find((m) => m.id === 'exora');

export default function ExoraPage() {
  return <ExternalModuleLaunch {...data} />;
}
