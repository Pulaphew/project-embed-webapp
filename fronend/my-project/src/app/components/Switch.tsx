'use client';

import React from 'react';
import { Switch as AntSwitch } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported

interface SwitchProps {
  label: string; // Custom text for the switch
  value: string; // Unique value for the switch
  isChecked: boolean; // Whether the switch is enabled
  onToggle: (value: string) => void; // Callback to handle toggle
}

export default function Switch({ label, value, isChecked, onToggle }: SwitchProps) {
  const handleToggle = (checked: boolean) => {
    if (checked) {
      onToggle(value); // Notify parent when this switch is enabled
    } else {
      onToggle(''); // Notify parent when this switch is disabled
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Label */}
      <span className="text-gray-800 text-lg font-medium">{label}</span>

      {/* Ant Design Switch */}
      <AntSwitch checked={isChecked} onChange={handleToggle} />
    </div>
  );
}