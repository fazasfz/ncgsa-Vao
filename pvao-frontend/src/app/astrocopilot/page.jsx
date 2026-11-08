'use client';

import React from 'react';
import AstroCopilotWorkspace from '../../pages/astroCopilot/AstroCopilotWorkspace';

/**
 * Dedicated Next.js App Router page for AstroCopilot Workspace.
 * Route: /astrocopilot
 */
export default function AstroCopilotPage() {
  return (
    <div className="w-full h-screen min-h-screen overflow-hidden bg-[#080a0f]">
      <AstroCopilotWorkspace />
    </div>
  );
}
