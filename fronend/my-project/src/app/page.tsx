'use client';

import React, { useState } from 'react';
import Banner from './components/Banner';
import SwitchPanel from './components/SwitchPanel';
import VoiceRecorder from './components/VoiceRecorder';
import AnimatedDiv from './components/AnimatedDiv';

export default function Home() {
  const [activeSwitch, setActiveSwitch] = useState<string>(''); // Tracks which switch is enabled

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
        {/* Use the SwitchPanel component */}
        <SwitchPanel activeSwitch={activeSwitch} onToggle={handleToggle} />

        {/* Render VoiceRecorder with AnimatedDiv */}
        <AnimatedDiv isVisible={activeSwitch === 'voice'}>
          <VoiceRecorder />
        </AnimatedDiv>
      </div>
    </div>
  );
}