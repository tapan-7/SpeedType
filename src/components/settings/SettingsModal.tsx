'use client';

import { useEffect, useState } from 'react';
import { Keyboard, Palette, Search, Volume2, VolumeX, X } from 'lucide-react';
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
      <div className="flex h-[88vh] max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-elevated/90 shadow-2xl backdrop-blur-2xl md:h-[660px] md:flex-row">
        {/* Left Sidebar (Top Nav on mobile) */}
        <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border-subtle bg-black/15 p-4 md:w-64 md:gap-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-1 pt-0.5 md:px-2 md:pt-1">
            <span className="text-base font-semibold tracking-tight text-text-primary">
              Settings
            </span>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              aria-label="Close settings"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-text-muted transition-colors hover:bg-white/[0.1] hover:text-text-primary md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
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

          <nav
            aria-label="Settings categories"
            className="flex flex-row gap-1 overflow-x-auto md:flex-col"
          >
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
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors md:gap-2.5 ${
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
          <div className="hidden items-center justify-between px-6 py-4 md:flex">
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

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6 md:pt-0 md:pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {showAppearance && (
              <>
                {matches('theme color palette') && (
                  <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-4">
                    <div className="mb-3 text-xs font-medium text-text-secondary">
                      Theme
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                      {THEME_OPTIONS.map((t) => {
                        const active = preferences.theme === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => updatePreferences({ theme: t.id })}
                            style={{ backgroundColor: t.bg }}
                            className={`group relative flex flex-col justify-between gap-2 overflow-hidden rounded-xl p-2.5 text-left transition-all duration-150 focus:outline-none ${
                              active
                                ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-elevated'
                                : 'ring-1 ring-white/10 hover:ring-white/25'
                            }`}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span
                                className="text-xs font-semibold"
                                style={{ color: t.accent }}
                              >
                                Aa
                              </span>
                              <span
                                className="h-2 w-5 rounded-full"
                                style={{ backgroundColor: t.accent }}
                              />
                            </div>
                            <span
                              className={`text-[11px] font-medium ${
                                t.isLight ? 'text-zinc-800' : 'text-zinc-200'
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

                {matches('font typeface typography jetbrains fira geist ibm space roboto inconsolata system') && (
                  <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-text-secondary">
                        Font
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Applied across app &amp; typing prompt
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {FONT_OPTIONS.map((font) => {
                        const active = preferences.fontFamily === font.id;
                        const fontVarMap: Record<string, string> = {
                          'jetbrains-mono': 'var(--font-jetbrains-mono)',
                          'fira-code': 'var(--font-fira-code)',
                          'geist-mono': 'var(--font-geist-mono)',
                          'ibm-plex-mono': 'var(--font-ibm-plex-mono)',
                          'space-mono': 'var(--font-space-mono)',
                          'roboto-mono': 'var(--font-roboto-mono)',
                          inconsolata: 'var(--font-inconsolata)',
                          'system-mono': 'ui-monospace, monospace',
                        };

                        return (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() =>
                              updatePreferences({ fontFamily: font.id })
                            }
                            style={{
                              fontFamily:
                                fontVarMap[font.id] ?? 'ui-monospace, monospace',
                            }}
                            className={`flex flex-col items-start gap-1 rounded-xl px-3 py-2 text-left transition-all ${
                              active
                                ? 'bg-accent-soft text-text-primary ring-1 ring-accent/50'
                                : 'bg-white/[0.035] text-text-secondary hover:bg-white/[0.07] hover:text-text-primary'
                            }`}
                          >
                            <span className="text-sm font-medium">Aa</span>
                            <span className="truncate text-[11px] opacity-85">
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
              <>
                {matches('keystroke sound profile mechanical thock soft typewriter pop beep crystal') && (
                  <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-text-secondary">
                        Keystroke sound profile
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Click to preview
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {SOUND_PROFILE_OPTIONS.map((opt) => {
                        const active = preferences.soundProfile === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              updatePreferences({ soundProfile: opt.id });
                              playKeystrokeSound(
                                opt.id,
                                preferences.soundVolume,
                                false,
                                preferences.playErrorSound,
                              );
                            }}
                            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-all duration-150 focus:outline-none ${
                              active
                                ? 'bg-white/[0.08] font-medium text-text-primary ring-1 ring-accent/50'
                                : 'bg-white/[0.02] text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {opt.id === SoundProfile.OFF ? (
                                <VolumeX className="h-3.5 w-3.5 text-text-muted" />
                              ) : (
                                <Volume2
                                  className={`h-3.5 w-3.5 ${
                                    active ? 'text-accent' : 'text-text-muted'
                                  }`}
                                />
                              )}
                              <span>{opt.label}</span>
                            </div>
                            <span className="text-[11px] text-text-muted">
                              {opt.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {matches('volume distinct error tone') && (
                    <div
                      className={`flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white/[0.02] p-4 transition-opacity ${
                        preferences.soundProfile === SoundProfile.OFF
                          ? 'pointer-events-none opacity-45'
                          : 'opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                        <span>Audio controls</span>
                        {preferences.soundProfile === SoundProfile.OFF && (
                          <span className="text-[11px] font-normal text-text-muted">
                            Select a sound profile above to enable
                          </span>
                        )}
                      </div>

                      {matches('volume') && (
                        <SettingRow
                          title="Volume"
                          description="Output level for keystroke audio"
                        >
                          <div className="flex items-center gap-3">
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
                              className="h-1.5 w-40 accent-accent"
                            />
                            <span className="w-10 text-right font-mono text-xs text-text-secondary">
                              {Math.round(preferences.soundVolume * 100)}%
                            </span>
                          </div>
                        </SettingRow>
                      )}

                      {matches('distinct error tone') && (
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
              </>
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

