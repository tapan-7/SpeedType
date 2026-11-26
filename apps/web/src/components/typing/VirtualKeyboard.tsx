'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { KeyState, QWERTY_ROWS } from '@speedtype/shared';
import { useTypingStore } from '@/stores/useTypingStore';

function getKeyClass(state: KeyState): string {
  switch (state) {
    case KeyState.ACTIVE:
      return 'border-accent/70 bg-key-active text-text-primary scale-[0.94] shadow-[0_0_16px_rgba(255,122,69,0.28)]';
    case KeyState.ERROR:
      return 'border-char-error/70 bg-char-error/20 text-char-error scale-[0.94] shadow-[0_0_16px_rgba(248,113,113,0.3)]';
    case KeyState.EXPECTED:
      return 'border-accent/55 bg-accent/10 text-accent shadow-[0_0_14px_rgba(255,122,69,0.16)]';
    case KeyState.IDLE:
    default:
      return 'border-key-border bg-key-bg text-text-muted';
  }
}

export function VirtualKeyboard() {
  const showVirtualKeyboard = useTypingStore(
    (s) => s.preferences.showVirtualKeyboard,
  );
  const expectedKey = useTypingStore((s) => s.engineState.expectedKey);
  const activeKeyPress = useTypingStore((s) => s.activeKeyPress);
  const [recentPress, setRecentPress] = useState<{
    key: string;
    isError: boolean;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const keyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [glowRect, setGlowRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    visible: boolean;
    isError: boolean;
  }>({
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    visible: false,
    isError: false,
  });

  useEffect(() => {
    if (!activeKeyPress) return;
    setRecentPress({ key: activeKeyPress.key, isError: activeKeyPress.isError });
    const timer = window.setTimeout(() => setRecentPress(null), 150);
    return () => window.clearTimeout(timer);
  }, [activeKeyPress]);

  const normalizedExpected = expectedKey?.toLowerCase() ?? null;
  const targetKeyValue = recentPress?.key ?? normalizedExpected;

  useLayoutEffect(() => {
    if (!showVirtualKeyboard || !targetKeyValue) {
      setGlowRect((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const keyEl = keyRefs.current[targetKeyValue];
    if (!keyEl) {
      setGlowRect((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    setGlowRect({
      left: keyEl.offsetLeft,
      top: keyEl.offsetTop,
      width: keyEl.offsetWidth,
      height: keyEl.offsetHeight,
      visible: true,
      isError: Boolean(recentPress?.isError),
    });
  }, [showVirtualKeyboard, targetKeyValue, recentPress]);

  if (!showVirtualKeyboard) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative mx-auto hidden w-full max-w-2xl select-none flex-col items-center gap-2 sm:flex"
    >
      {/* Smoothly gliding key spotlight */}
      <div
        style={{
          transform: `translate3d(${glowRect.left - 4}px, ${glowRect.top - 4}px, 0)`,
          width: `${glowRect.width + 8}px`,
          height: `${glowRect.height + 8}px`,
          opacity: glowRect.visible ? 1 : 0,
        }}
        className={`pointer-events-none absolute left-0 top-0 z-0 rounded-2xl blur-md transition-[transform,width,height,opacity,background-color] duration-200 ease-out ${
          glowRect.isError ? 'bg-char-error/25' : 'bg-accent/25'
        }`}
      />

      {QWERTY_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex items-center justify-center gap-2">
          {row.map((keyDef) => {
            let state = KeyState.IDLE;
            if (recentPress && recentPress.key === keyDef.value) {
              state = recentPress.isError ? KeyState.ERROR : KeyState.ACTIVE;
            } else if (normalizedExpected === keyDef.value) {
              state = KeyState.EXPECTED;
            }

            const widthClass = keyDef.width === 6 ? 'w-60' : 'w-11';

            return (
              <div
                key={keyDef.id}
                ref={(el) => {
                  keyRefs.current[keyDef.value] = el;
                }}
                className={`relative z-10 flex h-11 ${widthClass} items-center justify-center rounded-xl border font-mono text-sm font-medium transition-all duration-150 ease-out ${getKeyClass(
                  state,
                )}`}
              >
                {keyDef.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

