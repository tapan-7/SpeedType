'use client';

import { TestStatus, UI_STRINGS } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';

export function Footer() {
  const status = useTypingStore((s) => s.engineState.status);
  const focusFadeOut = useTypingStore((s) => s.preferences.focusFadeOut);
  const isTyping = status === TestStatus.RUNNING && focusFadeOut;

  return (
    <footer
      className={`mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-6 py-5 text-xs text-text-muted transition-opacity duration-300 sm:px-10 ${
        isTyping ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="hidden items-center gap-2 sm:flex">
        <kbd className="rounded border border-border-subtle bg-bg-surface px-1.5 py-0.5 font-mono text-[11px] text-text-secondary">
          {UI_STRINGS.RESTART_HINT_KEY_1}
        </kbd>
        <span>+</span>
        <kbd className="rounded border border-border-subtle bg-bg-surface px-1.5 py-0.5 font-mono text-[11px] text-text-secondary">
          {UI_STRINGS.RESTART_HINT_KEY_2}
        </kbd>
        <span className="ml-1">— {UI_STRINGS.RESTART_HINT_LABEL}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-text-muted/80">
        <span>English</span>
        <span aria-hidden="true">·</span>
        <span>No login required</span>
        <span aria-hidden="true" className="hidden sm:inline">·</span>
        <span className="basis-full text-center sm:basis-auto">Stats saved automatically</span>
      </div>
    </footer>
  );
}

