// ...existing code...
'use client';

import React, { useEffect, useState } from 'react';
import Banner from './components/Banner';
import SwitchPanel from './components/SwitchPanel';
import VoiceRecorder from './components/VoiceRecorder';
import AnimatedDiv from './components/AnimatedDiv';
import Slider from './components/Slider';
import GatewayPanel from './components/GatewayPanel';
import CurtainStatus from './components/CurtainStatus';

type RawMsg = { topic: string; message: string; ts: number };

// Use a distinct, explicit payload type that matches the shape your backend sends:
// { data: { light, temperature, humidity, mode, timestamp, curtainEnabled } }
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

export default function Home() {
  const [activeSwitch, setActiveSwitch] = useState<string>(''); // Tracks which switch is enabled
  const [manualValue, setManualValue] = useState<number>(50);
  const [tempValue, setTempValue] = useState<number>(25);
  const [lightValue, setLightValue] = useState<number>(75);

  // latest now typed to GatewayPayload | null
  const [latest, setLatest] = useState<GatewayPayload | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const wsUrl = `ws://${host}:8000/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
    };
    ws.onmessage = (e) => {
      try {
        const raw = JSON.parse(e.data) as RawMsg;
        // backend sends message as stringified JSON in raw.message (with .data field)
        const parsed = JSON.parse(raw.message) as GatewayPayload;
        setLatest(parsed);
      } catch {
        // ignore invalid payload
      }
    };
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);

    return () => ws.close();
  }, []);

  const handleToggle = (value: string) => {
    setActiveSwitch(value); // Update the active switch
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #452829, #57595B, #E8D1C5, #F3E8DF)',
      }}
    >
      <Banner />

      <div className="w-[85vw] bg-[#E3E3E3] rounded-lg p-4 mt-10">
        <CurtainStatus
          curtainEnabled={latest?.data?.curtainEnabled ?? 0}
          timestamp={latest?.data?.timestamp ?? null}
        />
        {/* Use the SwitchPanel component */}
        <SwitchPanel activeSwitch={activeSwitch} onToggle={handleToggle} />

        {/* Render VoiceRecorder with AnimatedDiv */}
        <AnimatedDiv isVisible={activeSwitch === 'voice'}>
          <VoiceRecorder />
        </AnimatedDiv>
        <AnimatedDiv isVisible={activeSwitch === 'manual'}>
          <Slider mode="manual" manualValue={manualValue} onManualChange={setManualValue} animationDelay={120} />
        </AnimatedDiv>
        <AnimatedDiv isVisible={activeSwitch === 'templight'}>
          {/* Render GatewayPanel */}
          <GatewayPanel latest={latest} wsConnected={wsConnected} />
          <Slider
            mode="templight"
            tempValue={tempValue}
            onTempChange={setTempValue}
            lightValue={lightValue}
            onLightChange={setLightValue}
            animationDelay={120}
          />
        </AnimatedDiv>
      </div>
    </div>
  );
}
// ...existing code...