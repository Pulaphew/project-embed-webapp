'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import styles from './Slider.module.css';
import { publishToNetpie } from '../api/netpiePublish';

type Mode = 'manual' | 'templight';

interface Props {
  mode: Mode;
  manualValue?: number;
  onManualChange?: (v: number) => void;
  tempValue?: number;
  onTempChange?: (v: number) => void;
  lightValue?: number;
  onLightChange?: (v: number) => void;
  curtainEnabled?: number;       // 1 = enabled, 0 = disabled
  curtainReady?: boolean;        // true when we have received curtain status
  animationDelay?: number;       // ms
}

function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}

export default function Slider({
  mode,
  manualValue = 0,
  onManualChange,
  tempValue = 25,
  onTempChange,
  lightValue = 75,
  onLightChange,
  curtainEnabled = 1,
  curtainReady = false,
  animationDelay = 100,
}: Props) {
  const [entered, setEntered] = useState(false);
  const [msgApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay, mode]);

  // Publish once when mode changes AND curtain status is known
  useEffect(() => {
    if (!curtainReady) return;

    if (mode === 'manual') {
      tryPublish('manual-command', clamp(Math.round(manualValue)));
    } else if (mode === 'templight') {
      tryPublish('templight-command', {
        temp: clamp(Math.round(tempValue)),
        light: clamp(Math.round(lightValue)),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, curtainReady]);

  const tryPublish = (topic: string, payload: any) => {
    // Skip silently until we know curtain status
    if (!curtainReady) {
      return;
    }
    if (!curtainEnabled) {
      msgApi.warning('please enabled Curtain before use');
      return;
    }
    publishToNetpie(topic, payload).catch((err) => {
      console.error('publishToNetpie error:', err);
    });
  };

  const ticks = useMemo(() => [0, 25, 50, 75, 100], []);

  const snapToAllowed = (v: number) => {
    const allowed = [0, 25, 50, 75, 100];
    let nearest = allowed[0];
    let bestDiff = Math.abs(v - nearest);
    for (let i = 1; i < allowed.length; i++) {
      const diff = Math.abs(v - allowed[i]);
      if (diff < bestDiff) {
        bestDiff = diff;
        nearest = allowed[i];
      }
    }
    return nearest;
  };

  const trackStyleFor = (value: number, type: 'manual' | 'temp' | 'light') => {
    const pct = clamp(Math.round(value));
    if (type === 'manual') {
      return {
        ['--pct' as any]: `${pct}%`,
        background: `linear-gradient(to right, rgba(31, 135, 75, 0.95) 0%, rgba(46,204,113,0.95) ${pct}%, rgba(204, 46, 46, 0.95) ${pct}%, rgba(255, 0, 0, 0.95) 100%)`,
      } as React.CSSProperties;
    }

    const color = type === 'temp' ? 'rgba(255,140,0,0.95)' : 'rgba(255,204,0,0.95)';
    return {
      ['--pct' as any]: `${pct}%`,
      background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #e6e6e6 ${pct}%, #e6e6e6 100%)`,
    } as React.CSSProperties;
  };

  function RangeRow({
    value,
    onChange,
    type,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    type: 'manual' | 'temp' | 'light';
    label?: string;
  }) {
    const displayed = type === 'manual' ? snapToAllowed(clamp(Math.round(value))) : clamp(Math.round(value));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value);
      if (type === 'manual') {
        const snapped = snapToAllowed(raw);
        onChange(snapped);
      } else {
        onChange(raw);
      }
    };

    const pct = displayed;

    return (
      <div className={styles.rangeRow}>
        {label && <div className={styles.title}>{label}</div>}

        <div className={styles.trackWrap}>
          <input
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={handleChange}
            className={styles.range}
            style={trackStyleFor(pct, type)}
            aria-label={`${type}-slider`}
          />

          <div
            className={styles.badge}
            style={{ left: `calc(${pct}% - 12px)` }}
            aria-hidden
          >
            {pct}
          </div>

          {type === 'manual' && (
            <div className={styles.ticks}>
              {ticks.map((t) => (
                <div
                  key={t}
                  className={styles.tick}
                  style={{ left: `calc(${t}% - 1px)` }}
                >
                  <span className={styles.tickLabel}>{t}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className={`${styles.container} ${entered ? styles.enter : ''}`}>
        {mode === 'manual' && (
          <div className={styles.manual}>
            <div className={styles.labelRow}>
              <span>close</span>
              <span>open</span>
            </div>

            <RangeRow
              value={manualValue}
              onChange={(v) => {
                onManualChange?.(v);
                const snapped = snapToAllowed(v);
                tryPublish('manual-command', snapped);
              }}
              type="manual"
            />
          </div>
        )}

        {mode === 'templight' && (
          <div className={styles.templight}>
            <RangeRow
              label="temp limit"
              value={tempValue}
              onChange={(v) => {
                onTempChange?.(v);
                tryPublish('templight-command', {
                  temp: clamp(Math.round(v)),
                  light: clamp(Math.round(lightValue)),
                });
              }}
              type="temp"
            />
            <RangeRow
              label="light limit"
              value={lightValue}
              onChange={(v) => {
                onLightChange?.(v);
                tryPublish('templight-command', {
                  temp: clamp(Math.round(tempValue)),
                  light: clamp(Math.round(v)),
                });
              }}
              type="light"
            />
          </div>
        )}
      </div>
    </>
  );
}