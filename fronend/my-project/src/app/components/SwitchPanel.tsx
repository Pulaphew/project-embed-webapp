'use client';

import React from 'react';
import Switch from './Switch';

interface SwitchPanelProps {
  activeSwitch: string;
  onToggle: (value: string) => void;
}

const SwitchPanel: React.FC<SwitchPanelProps> = ({ activeSwitch, onToggle }) => {
  return (
    <div className="flex flex-col space-y-4">
      <Switch
        label="Manual Mode"
        value="manual"
        isChecked={activeSwitch === 'manual'}
        onToggle={onToggle}
      />
      <Switch
        label="Temperature Light Mode"
        value="templight"
        isChecked={activeSwitch === 'templight'}
        onToggle={onToggle}
      />
      <Switch
        label="Voice Mode"
        value="voice"
        isChecked={activeSwitch === 'voice'}
        onToggle={onToggle}
      />
    </div>
  );
};

export default SwitchPanel;