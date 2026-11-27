'use client';

import { BarChart3, Keyboard, Settings } from 'lucide-react';
import { TestStatus, UI_STRINGS } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { IconButton } from '@/components/common/IconButton';
import { SpeedTypeLogo } from '@/components/common/SpeedTypeLogo';

export function Header() {
  const status = useTypingStore((s) => s.engineState.status);
  const preferences = useTypingStore((s) => s.preferences);
  const isStatsOpen = useTypingStore((s) => s.isStatsOpen);
  const restart = useTypingStore((s) => s.restart);
  const updatePreferences = useTypingStore((s) => s.updatePreferences);
  const setSettingsOpen = useTypingStore((s) => s.setSettingsOpen);
  const setStatsOpen = useTypingStore((s) => s.setStatsOpen);
  const setCustomModalOpen = useTypingStore((s) => s.setCustomModalOpen);

  const isTyping =
    !isStatsOpen && status === TestStatus.RUNNING && preferences.focusFadeOut;

  const handleLogoClick = () => {
    setStatsOpen(false);
    setSettingsOpen(false);
    setCustomModalOpen(false);
    restart();
  };

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-10 sm:py-5">
      <button
        type="button"
        onClick={handleLogoClick}
        aria-label="SpeedType — Return to initial state"
        className="group flex cursor-pointer items-center text-left focus:outline-none"
      >
        <SpeedTypeLogo />
      </button>

      <nav
        aria-label="Secondary navigation"
        className={`flex items-center gap-1 transition-opacity duration-300 ${
          isTyping ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <IconButton
          label="Stats & History"
          active={isStatsOpen}
          onClick={() => setStatsOpen(!isStatsOpen)}
        >
          <BarChart3 className="h-4 w-4" />
        </IconButton>
        <span className="hidden sm:inline-flex">
          <IconButton
            label={
              preferences.showVirtualKeyboard
                ? UI_STRINGS.KEYBOARD_TOGGLE_HIDE
                : UI_STRINGS.KEYBOARD_TOGGLE_SHOW
            }
            active={preferences.showVirtualKeyboard}
            onClick={() =>
              updatePreferences({
                showVirtualKeyboard: !preferences.showVirtualKeyboard,
              })
            }
          >
            <Keyboard className="h-4 w-4" />
          </IconButton>
        </span>

        <IconButton
          label="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </IconButton>
      </nav>
    </header>
  );
}

