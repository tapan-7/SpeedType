'use client';

import { TestMode, TestStatus } from '@speedtype/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { StatBadge } from '@/components/common/StatBadge';

export function LiveStatsRow() {
  const showLiveStats = useTypingStore((s) => s.preferences.showLiveStats);
  const status = useTypingStore((s) => s.engineState.status);
  const config = useTypingStore((s) => s.engineState.config);
  const liveWpm = useTypingStore((s) => s.engineState.liveWpm);
  const liveAccuracy = useTypingStore((s) => s.engineState.liveAccuracy);
  const remainingMs = useTypingStore((s) => s.engineState.remainingMs);
  const currentWordIndex = useTypingStore((s) => s.engineState.currentWordIndex);
  const totalWords = useTypingStore((s) => s.engineState.words.length);

  if (!showLiveStats) return null;

  const isRunning = status === TestStatus.RUNNING;
  const primaryTimerOrProgress =
    config.mode === TestMode.TIME
      ? isRunning
        ? Math.ceil(remainingMs / 1000)
        : config.durationSeconds
      : `${currentWordIndex}/${totalWords}`;

  const progressLabel = config.mode === TestMode.TIME ? 'sec' : 'words';

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-12 sm:gap-20">
        <StatBadge
          label="wpm"
          value={isRunning ? liveWpm : '—'}
          highlight={isRunning}
        />
        <StatBadge
          label="acc"
          value={isRunning ? `${liveAccuracy}%` : '—'}
        />
        <StatBadge
          label={progressLabel}
          value={primaryTimerOrProgress}
          highlight={isRunning && config.mode === TestMode.TIME}
        />
      </div>
      <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
    </div>
  );
}

