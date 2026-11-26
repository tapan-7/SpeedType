'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Keyboard, Settings, Zap } from 'lucide-react';
import { APP_NAME, TestStatus, UI_STRINGS } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { IconButton } from '@/components/common/IconButton';

export function Header() {
  const pathname = usePathname();
  const status = useTypingStore((s) => s.engineState.status);
  const preferences = useTypingStore((s) => s.preferences);
  const restart = useTypingStore((s) => s.restart);
  const updatePreferences = useTypingStore((s) => s.updatePreferences);
  const setSettingsOpen = useTypingStore((s) => s.setSettingsOpen);

  const isTyping =
    pathname === '/' &&
    status === TestStatus.RUNNING &&
    preferences.focusFadeOut;

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
      <Link
        href="/"
        onClick={() => {
          if (pathname === '/') restart();
        }}
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
      </Link>

      <nav
        aria-label="Secondary navigation"
        className={`flex items-center gap-1 transition-opacity duration-300 ${
          isTyping ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <Link
          href="/stats"
          aria-label="Analytics & history"
          title="Stats & History"
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            pathname === '/stats'
              ? 'bg-accent-soft text-accent'
              : 'text-text-muted hover:bg-bg-surface-hover hover:text-text-primary'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
        </Link>
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
          label="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </IconButton>
      </nav>
    </header>
  );
}

