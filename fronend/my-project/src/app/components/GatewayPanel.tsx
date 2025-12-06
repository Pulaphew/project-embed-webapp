// ...existing code...
'use client';

import React from 'react';

type GatewayPayload = {
  data?: {
    light?: number;
    temperature?: number;
    humidity?: number;
    mode?: number;
    timestamp?: string;
    curtainEnabled?: number;
  };
};

function percentFromValue(value: number | undefined, min = 0, max = 100) {
  if (value == null || isNaN(value)) return 0;
  const v = Math.max(min, Math.min(max, value));
  return Math.round(((v - min) / (max - min)) * 100);
}

function getComputedColor(key: string) {
  switch (key) {
    case 'text-red-500':
      return '#ef4444';
    case 'text-yellow-500':
      return '#f59e0b';
    case 'text-green-500':
      return '#10b981';
    case 'text-blue-500':
      return '#3b82f6';
    default:
      return '#3b82f6';
  }
}

function Gauge({
  label,
  value,
  unit,
  min,
  max,
  color = 'text-blue-500',
}: {
  label: string;
  value?: number;
  unit?: string;
  min?: number;
  max?: number;
  color?: string;
}) {
  const pct = percentFromValue(value, min ?? 0, max ?? 100);
  const radius = 28;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center mx-3">
      <div className="w-24 h-24 flex items-center justify-center">
        <svg width="92" height="92" viewBox="-6 -6 84 84" aria-hidden>
          <circle cx="36" cy="36" r={radius} stroke="#eef2f6" strokeWidth={stroke} fill="none" />
          <circle
            cx="36"
            cy="36"
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${dash} ${circumference - dash}`}
            style={{ color: getComputedColor(color) }}
            transform="rotate(-90 36 36)"
          />
          <text x="36" y="40" textAnchor="middle" fontSize="12" fill="#111827" fontWeight={600}>
            {value ?? '--'}
            {unit ?? ''}
          </text>
        </svg>
      </div>
      <div className="text-xs mt-2 text-gray-600">{label}</div>
    </div>
  );
}

export default function GatewayPanel({
  latest,
  wsConnected,
}: {
  latest?: GatewayPayload | null;
  wsConnected?: boolean;
}) {
  const data = latest?.data;
  // layout styling similar to Switch: rounded, soft bg, medium font
  return (
    <section className="bg-gray-100 rounded-lg shadow-md p-4 mt-2 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-800 text-base font-semibold">Environment Temperature Light</h2>
        <div className="text-xs text-gray-500">
          {wsConnected ? <span className="text-green-500">● live</span> : <span className="text-red-400">● offline</span>}
        </div>
      </div>

      {/* Gauges centered */}
      <div className="flex justify-center">
        <div className="flex items-center">
          <Gauge label="Temperature" value={data?.temperature} unit="°C" min={-10} max={50} color="text-red-500" />
          <Gauge label="Humidity" value={data?.humidity} unit="%" min={0} max={100} color="text-blue-500" />
          <Gauge label="Light" value={data?.light} unit="%" min={0} max={100} color="text-yellow-500" />
        </div>
      </div>
    </section>
  );
}
// ...existing code...