'use client';

import { useEffect, useState } from 'react';
import { KeyState, QWERTY_ROWS } from '@speedtype/shared';
import { useTypingStore } from '@/stores/useTypingStore';

function getKeyClass(state: KeyState): string {
  switch (state) {
    case KeyState.ACTIVE:
      return 'border-accent/60 bg-key-active text-text-primary scale-95';
    case KeyState.ERROR:
      return 'border-char-error/60 bg-char-error/20 text-char-error scale-95';
    case KeyState.EXPECTED:
      return 'border-accent/45 bg-bg-surface-hover text-accent';
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

  useEffect(() => {
    if (!activeKeyPress) return;
    setRecentPress({ key: activeKeyPress.key, isError: activeKeyPress.isError });
    const timer = window.setTimeout(() => setRecentPress(null), 130);
    return () => window.clearTimeout(timer);
  }, [activeKeyPress]);

  if (!showVirtualKeyboard) return null;

  const normalizedExpected = expectedKey?.toLowerCase() ?? null;

  return (
    <div
      aria-hidden="true"
      className="mx-auto hidden w-full max-w-xl select-none flex-col items-center gap-1.5 sm:flex"
    >
      {QWERTY_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex items-center justify-center gap-1.5">
          {row.map((keyDef) => {
            let state = KeyState.IDLE;
            if (recentPress && recentPress.key === keyDef.value) {
              state = recentPress.isError ? KeyState.ERROR : KeyState.ACTIVE;
            } else if (normalizedExpected === keyDef.value) {
              state = KeyState.EXPECTED;
            }

            const widthClass = keyDef.width === 6 ? 'w-48' : 'w-9';

            return (
              <div
                key={keyDef.id}
                className={`flex h-9 ${widthClass} items-center justify-center rounded-lg border font-mono text-xs font-medium transition-all duration-100 ${getKeyClass(
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

