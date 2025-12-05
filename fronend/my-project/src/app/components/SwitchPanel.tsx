// ...existing code...
'use client';

import React, { useEffect, useState } from 'react';
import Switch from './Switch';
import { publishToNetpie } from '../api/netpiePublish';

interface SwitchPanelProps {
  activeSwitch?: string;
  onToggle: (value: string) => void;
}

const modeMap: Record<string, string> = {
  manual: "0",
  templight: "1",
  voice: "2",
};

const SwitchPanel: React.FC<SwitchPanelProps> = ({ activeSwitch, onToggle }) => {
  // default to manual on first load
  const [active, setActive] = useState<string>(activeSwitch || 'manual');

  // keep local state in sync if parent changes prop
  useEffect(() => {
    // ensure there is always at least one active mode; default to manual
    if (!activeSwitch) {
      setAndPublish('manual');
      return;
    }
    setActive(activeSwitch);
  }, [activeSwitch]);

  const setAndPublish = (value: string) => {
    setActive(value);
    onToggle(value);
    const payload = modeMap[value] ?? "0";
    publishToNetpie('mode', payload).catch((err) => {
      console.error('publishToNetpie error:', err);
    });
  };

  const handleToggle = (value: string) => {
    // Prevent turning off the currently active mode.
    // Always keep exactly one mode active.
    if (active === value) {
      // do nothing to avoid having zero modes active
      return;
    }

    // turn on the selected mode; other modes implicitly off
    setAndPublish(value);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Switch
        label="Manual Mode"
        value="manual"
        isChecked={active === 'manual'}
        onToggle={handleToggle}
      />
      <Switch
        label="Temperature Light Mode"
        value="templight"
        isChecked={active === 'templight'}
        onToggle={handleToggle}
      />
      <Switch
        label="Voice Mode"
        value="voice"
        isChecked={active === 'voice'}
        onToggle={handleToggle}
      />
    </div>
  );
};

export default SwitchPanel;
// ...existing code...