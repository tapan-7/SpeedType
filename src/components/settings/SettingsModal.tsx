'use client';

import { useEffect, useState } from 'react';
import { Keyboard, Palette, Search, Volume2, X } from 'lucide-react';
import {
  CaretStyle,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  SOUND_PROFILE_OPTIONS,
  SoundProfile,
  THEME_OPTIONS,
} from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { playKeystrokeSound } from '@/lib/soundEngine';
import { PillToggle } from '@/components/common/PillToggle';

type SettingsTab = 'appearance' | 'typing' | 'sound';

const TABS: readonly {
  id: SettingsTab;
  label: string;
  icon: typeof Palette;
}[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'typing', label: 'Typing', icon: Keyboard },
  { id: 'sound', label: 'Sound', icon: Volume2 },
];

export function SettingsModal() {
  const isOpen = useTypingStore((s) => s.isSettingsOpen);
  const preferences = useTypingStore((s) => s.preferences);
  const updatePreferences = useTypingStore((s) => s.updatePreferences);
  const setSettingsOpen = useTypingStore((s) => s.setSettingsOpen);

  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, setSettingsOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;
  const matches = (keywords: string) =>
    !isSearching || keywords.toLowerCase().includes(q);

  const showAppearance =
    (!isSearching && activeTab === 'appearance') ||
    (isSearching &&
      matches('theme color font typeface size live stats keyboard focus fade'));
  const showTyping =
    (!isSearching && activeTab === 'typing') ||
    (isSearching && matches('caret cursor smooth animation'));
  const showSound =
    (!isSearching && activeTab === 'sound') ||
    (isSearching &&
      matches('sound audio volume mechanical soft typewriter error tone'));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSettingsOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
    >
      <div className="flex h-[660px] max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-border-subtle bg-bg-elevated/90 shadow-2xl backdrop-blur-2xl">
        {/* Left Sidebar */}
        <aside className="flex w-56 shrink-0 flex-col gap-4 border-r border-border-subtle bg-black/15 p-4 sm:w-64">
          <div className="px-2 pt-1 text-base font-semibold tracking-tight text-text-primary">
            Settings
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search settings"
              aria-label="Search settings"
              className="w-full rounded-xl border border-border-subtle bg-white/[0.04] py-2 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none"
            />
          </div>

          <nav aria-label="Settings categories" className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = !isSearching && activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.09] text-text-primary'
                      : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-accent' : 'text-text-muted'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Pane */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-base font-semibold text-text-primary">
              {isSearching
                ? `Search: "${query}"`
                : TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              aria-label="Close settings"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-text-muted transition-colors hover:bg-white/[0.1] hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {showAppearance && (
              <>
                {matches('theme color palette') && (
                  <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-4">
                    <div className="mb-3.5 text-xs font-medium text-text-secondary">
                      Theme
                    </div>
                    <div className="grid grid-cols-5 gap-x-2 gap-y-3.5">
                      {THEME_OPTIONS.map((t) => {
                        const active = preferences.theme === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => updatePreferences({ theme: t.id })}
                            className="group flex flex-col items-center gap-1.5 focus:outline-none"
                          >
                            <span
                              style={{ backgroundColor: t.bg }}
                              className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 group-hover:scale-105 ${
                                active
                                  ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-elevated'
                                  : 'ring-1 ring-white/15'
                              }`}
                            >
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: t.accent }}
                              />
                            </span>
                            <span
                              className={`text-[11px] ${
                                active
                                  ? 'font-medium text-text-primary'
                                  : 'text-text-muted group-hover:text-text-secondary'
                              }`}
                            >
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {matches('font typeface typography jetbrains fira geist system') && (
                  <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-4">
                    <div className="mb-3 text-xs font-medium text-text-secondary">
                      Font
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {FONT_OPTIONS.map((font) => {
                        const active = preferences.fontFamily === font.id;
                        const fontVarStyle =
                          font.id === 'jetbrains-mono'
                            ? 'var(--font-jetbrains-mono)'
                            : font.id === 'fira-code'
                              ? 'var(--font-fira-code)'
                              : font.id === 'geist-mono'
                                ? 'var(--font-geist-mono)'
                                : 'ui-monospace, monospace';

                        return (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() =>
                              updatePreferences({ fontFamily: font.id })
                            }
                            style={{ fontFamily: fontVarStyle }}
                            className={`flex flex-col items-start gap-1 rounded-xl px-3.5 py-2.5 text-left transition-all ${
                              active
                                ? 'bg-accent-soft text-text-primary ring-1 ring-accent/50'
                                : 'bg-white/[0.035] text-text-secondary hover:bg-white/[0.07] hover:text-text-primary'
                            }`}
                          >
                            <span className="text-sm font-medium">Aa</span>
                            <span className="text-[11px] opacity-85">
                              {font.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {matches('text size scale letters live stats keyboard focus fade') && (
                  <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white/[0.02] p-4">
                    <div className="text-xs font-medium text-text-secondary">
                      Layout &amp; display
                    </div>

                    {matches('text size scale letters') && (
                      <SettingRow
                        title="Text size"
                        description="Scale of letters in the typing area"
                      >
                        <div className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1">
                          {FONT_SIZE_OPTIONS.map((opt) => (
                            <PillToggle
                              key={opt.id}
                              active={preferences.fontSize === opt.id}
                              onClick={() =>
                                updatePreferences({ fontSize: opt.id })
                              }
                            >
                              {opt.label}
                            </PillToggle>
                          ))}
                        </div>
                      </SettingRow>
                    )}

                    {matches('show live stats wpm accuracy') && (
                      <SettingToggle
                        title="Show live stats"
                        description="Display real-time WPM, accuracy, and timer"
                        checked={preferences.showLiveStats}
                        onChange={(val) =>
                          updatePreferences({ showLiveStats: val })
                        }
                      />
                    )}

                    {matches('show on-screen keyboard') && (
                      <SettingToggle
                        title="Show on-screen keyboard"
                        description="Interactive QWERTY guide with gliding key spotlight"
                        checked={preferences.showVirtualKeyboard}
                        onChange={(val) =>
                          updatePreferences({ showVirtualKeyboard: val })
                        }
                      />
                    )}

                    {matches('focus fade-out fade out ui') && (
                      <SettingToggle
                        title="Focus fade-out"
                        description="Fade out header, mode bar, and footer while typing"
                        checked={preferences.focusFadeOut}
                        onChange={(val) =>
                          updatePreferences({ focusFadeOut: val })
                        }
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {showTyping && (
              <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-white/[0.02] p-5">
                <div className="text-xs font-medium text-text-secondary">
                  Caret &amp; input
                </div>

                {matches('caret style cursor line block underline') && (
                  <SettingRow
                    title="Caret style"
                    description="Visual cursor indicator while typing"
                  >
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
                  </SettingRow>
                )}

                {matches('smooth caret animation') && (
                  <SettingToggle
                    title="Smooth caret animation"
                    description="Glide the caret smoothly between characters"
                    checked={preferences.smoothCaret}
                    onChange={(val) => updatePreferences({ smoothCaret: val })}
                  />
                )}
              </div>
            )}

            {showSound && (
              <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-white/[0.02] p-5">
                <div className="text-xs font-medium text-text-secondary">
                  Audio feedback
                </div>

                {matches('keystroke sound profile mechanical soft typewriter') && (
                  <SettingRow
                    title="Keystroke sound"
                    description="Synthesized audio feedback on each key press"
                  >
                    <div className="flex flex-wrap items-center gap-1 rounded-full bg-white/[0.04] p-1">
                      {SOUND_PROFILE_OPTIONS.map((opt) => (
                        <PillToggle
                          key={opt.id}
                          active={preferences.soundProfile === opt.id}
                          onClick={() => {
                            updatePreferences({ soundProfile: opt.id });
                            playKeystrokeSound(
                              opt.id,
                              preferences.soundVolume,
                              false,
                              preferences.playErrorSound,
                            );
                          }}
                        >
                          {opt.label}
                        </PillToggle>
                      ))}
                    </div>
                  </SettingRow>
                )}

                {preferences.soundProfile !== SoundProfile.OFF &&
                  matches('volume') && (
                    <SettingRow
                      title="Volume"
                      description={`${Math.round(preferences.soundVolume * 100)}%`}
                    >
                      <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={preferences.soundVolume}
                        onChange={(e) =>
                          updatePreferences({
                            soundVolume: Number(e.target.value),
                          })
                        }
                        aria-label="Keystroke sound volume"
                        className="h-1.5 w-44 accent-accent"
                      />
                    </SettingRow>
                  )}

                {preferences.soundProfile !== SoundProfile.OFF &&
                  matches('distinct error tone') && (
                    <SettingToggle
                      title="Distinct error tone"
                      description="Play a subtle low tone on incorrect characters"
                      checked={preferences.playErrorSound}
                      onChange={(val) =>
                        updatePreferences({ playErrorSound: val })
                      }
                    />
                  )}
              </div>
            )}

            {isSearching && !showAppearance && !showTyping && !showSound && (
              <div className="py-12 text-center text-xs text-text-muted">
                No settings matching &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-medium text-text-primary">{title}</div>
        <div className="text-xs text-text-muted">{description}</div>
      </div>
      {children}
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-text-primary">{title}</div>
        <div className="text-xs text-text-muted">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-white/[0.12]'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-bg-primary transition-transform ${
            checked ? 'translate-x-5.5' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

