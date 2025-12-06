'use client';

import React from 'react';

export default function CurtainStatus({
  curtainEnabled,
  timestamp,
}: {
  curtainEnabled: number;
  timestamp?: string | null;
}) {
  const enabled = !!curtainEnabled;
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-3 flex items-center justify-between mb-5">
      <div>
        <div className="text-sm font-medium text-gray-800">Device time</div>
        <div className="text-xs text-gray-500 mt-1">{timestamp ? new Date(timestamp).toLocaleString() : 'No timestamp'}</div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-sm text-gray-700">Curtain</div>
        <div
          className={`w-5 h-5 rounded-full flex-shrink-0 ${enabled ? 'bg-green-400' : 'bg-red-400'} ${
            enabled ? 'animate-pulse' : ''
          }`}
          title={enabled ? 'Curtain: ON' : 'Curtain: OFF'}
          aria-hidden
        />
      </div>
    </div>
  );
}