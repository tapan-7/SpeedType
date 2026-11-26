'use client';

import { History, Keyboard, Settings, Zap } from 'lucide-react';
import { APP_NAME, TestStatus, UI_STRINGS } from '@speedtype/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { IconButton } from '@/components/common/IconButton';

export function Header() {
  const status = useTypingStore((s) => s.engineState.status);
  const preferences = useTypingStore((s) => s.preferences);
  const historyCount = useTypingStore((s) => s.history.length);
  const restart = useTypingStore((s) => s.restart);
  const updatePreferences = useTypingStore((s) => s.updatePreferences);
  const setSettingsOpen = useTypingStore((s) => s.setSettingsOpen);
  const setHistoryOpen = useTypingStore((s) => s.setHistoryOpen);

  const isTyping = status === TestStatus.RUNNING && preferences.focusFadeOut;

  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
      <button
        type="button"
        onClick={restart}
        className="group flex items-center gap-2.5 text-left focus:outline-none"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle bg-bg-surface text-accent transition-transform duration-150 group-hover:scale-105">
          <Zap className="h-4 w-4 fill-accent/20" />
        </span>
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-text-primary">
            {APP_NAME}
          </span>
          <span
            className={`text-[10px] font-medium uppercase tracking-widest text-text-muted transition-opacity duration-300 ${
              isTyping ? 'opacity-0' : 'opacity-100'
            }`}
          >
            practice
          </span>
        </div>
      </button>

      <nav
        aria-label="Secondary navigation"
        className={`flex items-center gap-1 transition-opacity duration-300 ${
          isTyping ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
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

        <IconButton
          label={`Local history (${historyCount})`}
          onClick={() => setHistoryOpen(true)}
        >
          <History className="h-4 w-4" />
        </IconButton>

        <IconButton
          label="Preferences"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </IconButton>
      </nav>
    </header>
  );
}

