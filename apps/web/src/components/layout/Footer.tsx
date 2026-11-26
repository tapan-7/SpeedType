'use client';

import { TestStatus, UI_STRINGS } from '@speedtype/shared';
import { useTypingStore } from '@/stores/useTypingStore';

export function Footer() {
  const status = useTypingStore((s) => s.engineState.status);
  const focusFadeOut = useTypingStore((s) => s.preferences.focusFadeOut);
  const isTyping = status === TestStatus.RUNNING && focusFadeOut;

  return (
    <footer
      className={`mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-6 py-5 text-xs text-text-muted transition-opacity duration-300 ${
        isTyping ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <kbd className="rounded border border-border-subtle bg-bg-surface px-1.5 py-0.5 font-mono text-[11px] text-text-secondary">
          {UI_STRINGS.RESTART_HINT_KEY_1}
        </kbd>
        <span>+</span>
        <kbd className="rounded border border-border-subtle bg-bg-surface px-1.5 py-0.5 font-mono text-[11px] text-text-secondary">
          {UI_STRINGS.RESTART_HINT_KEY_2}
        </kbd>
        <span className="ml-1">— {UI_STRINGS.RESTART_HINT_LABEL}</span>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-text-muted/80">
        <span>English</span>
        <span>·</span>
        <span>No login required</span>
        <span>·</span>
        <span>Local stats saved automatically</span>
      </div>
    </footer>
  );
}

