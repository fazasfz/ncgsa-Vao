import React from 'react';
import AstroCopilotWorkspace from './astroCopilot/AstroCopilotWorkspace';

/**
 * Dedicated Next.js Pages Router page for AstroCopilot Workspace.
 * Route: /astrocopilot
 */
export default function AstroCopilotPage() {
  return (
    <div className="w-full h-screen min-h-screen overflow-hidden bg-[#080a0f]">
      <AstroCopilotWorkspace />
    </div>
  );
}
