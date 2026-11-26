'use client';

import { Volume2, X } from 'lucide-react';
import {
  CaretStyle,
  FONT_OPTIONS,
  SOUND_PROFILE_OPTIONS,
  THEME_OPTIONS,
} from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { PillToggle } from '@/components/common/PillToggle';
import { playKeystrokeSound } from '@/lib/soundEngine';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-bg-elevated/85 p-6 shadow-2xl backdrop-blur-2xl">
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

        <div className="flex flex-col gap-5 text-sm">
          <div className="flex flex-col gap-3">
            <ToggleRow
              label="Show on-screen keyboard"
              checked={preferences.showVirtualKeyboard}
              onChange={(val) =>
                updatePreferences({ showVirtualKeyboard: val })
              }
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
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

          {/* Caret style */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Caret style</span>
            <div className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1">
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

          {/* Theme */}
          <div className="flex flex-col gap-2">
            <span className="text-text-secondary">Theme</span>
            <div className="grid grid-cols-2 gap-2">
              {THEME_OPTIONS.map((t) => {
                const active = preferences.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updatePreferences({ theme: t.id })}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                      active
                        ? 'bg-accent-soft text-text-primary ring-1 ring-accent/50'
                        : 'bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="flex items-center gap-1">
                      <span
                        className="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: t.bg }}
                      />
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: t.accent }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font family */}
          <div className="flex flex-col gap-2">
            <span className="text-text-secondary">Typing font</span>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((font) => (
                <PillToggle
                  key={font.id}
                  active={preferences.fontFamily === font.id}
                  onClick={() => updatePreferences({ fontFamily: font.id })}
                >
                  {font.label}
                </PillToggle>
              ))}
            </div>
          </div>

          {/* Sound profile & volume */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Volume2 className="h-3.5 w-3.5" />
                <span>Keystroke sound</span>
              </span>
              <div className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1">
                {SOUND_PROFILE_OPTIONS.map((opt) => (
                  <PillToggle
                    key={opt.id}
                    active={preferences.soundProfile === opt.id}
                    onClick={() => {
                      updatePreferences({ soundProfile: opt.id });
                      playKeystrokeSound(opt.id, preferences.soundVolume, false);
                    }}
                  >
                    {opt.label}
                  </PillToggle>
                ))}
              </div>
            </div>

            {preferences.soundProfile !== 'off' && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-text-muted">Volume</span>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={preferences.soundVolume}
                  onChange={(e) =>
                    updatePreferences({ soundVolume: Number(e.target.value) })
                  }
                  aria-label="Keystroke sound volume"
                  className="h-1.5 w-44 accent-accent"
                />
              </div>
            )}
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

