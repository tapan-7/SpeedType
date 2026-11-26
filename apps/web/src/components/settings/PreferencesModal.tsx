'use client';

import { X } from 'lucide-react';
import { CaretStyle } from '@speedtype/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { PillToggle } from '@/components/common/PillToggle';

export function PreferencesModal() {
  const isOpen = useTypingStore((s) => s.isSettingsOpen);
  const preferences = useTypingStore((s) => s.preferences);
  const updatePreferences = useTypingStore((s) => s.updatePreferences);
  const setSettingsOpen = useTypingStore((s) => s.setSettingsOpen);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Preferences"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-border-strong bg-bg-elevated p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            Preferences
          </h2>
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="rounded-lg p-1 text-text-muted hover:bg-bg-surface-hover hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <ToggleRow
            label="Show on-screen keyboard"
            checked={preferences.showVirtualKeyboard}
            onChange={(val) => updatePreferences({ showVirtualKeyboard: val })}
          />
          <ToggleRow
            label="Show live stats"
            checked={preferences.showLiveStats}
            onChange={(val) => updatePreferences({ showLiveStats: val })}
          />
          <ToggleRow
            label="Smooth caret animation"
            checked={preferences.smoothCaret}
            onChange={(val) => updatePreferences({ smoothCaret: val })}
          />
          <ToggleRow
            label="Fade out UI while typing"
            checked={preferences.focusFadeOut}
            onChange={(val) => updatePreferences({ focusFadeOut: val })}
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-text-secondary">Caret style</span>
            <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-bg-primary p-1">
              {Object.values(CaretStyle).map((style) => (
                <PillToggle
                  key={style}
                  active={preferences.caretStyle === style}
                  onClick={() => updatePreferences({ caretStyle: style })}
                >
                  {style}
                </PillToggle>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-bg-surface-hover'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-bg-primary transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

