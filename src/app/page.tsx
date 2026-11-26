'use client';

import { useEffect } from 'react';
import { TestStatus } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ModeBar } from '@/components/typing/ModeBar';
import { LiveStatsRow } from '@/components/typing/LiveStatsRow';
import { TypingViewport } from '@/components/typing/TypingViewport';
import { VirtualKeyboard } from '@/components/typing/VirtualKeyboard';
import { CustomTextModal } from '@/components/typing/CustomTextModal';
import { ResultsView } from '@/components/results/ResultsView';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { StatsView } from '@/components/stats/StatsView';
import { ThemeSync } from '@/components/layout/ThemeSync';

export default function HomePage() {
  const hydrate = useTypingStore((s) => s.hydrate);
  const hydrated = useTypingStore((s) => s.hydrated);
  const status = useTypingStore((s) => s.engineState.status);
  const lastResult = useTypingStore((s) => s.lastResult);
  const isStatsOpen = useTypingStore((s) => s.isStatsOpen);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const showResults = status === TestStatus.COMPLETED && lastResult !== null;

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-6 py-4 sm:px-10">
        {!hydrated ? (
          <div className="h-[220px] w-full max-w-4xl" />
        ) : isStatsOpen ? (
          <StatsView />
        ) : showResults ? (
          <>
            <ModeBar />
            <ResultsView />
          </>
        ) : (
          <>
            <ModeBar />
            <LiveStatsRow />
            <TypingViewport />
            <VirtualKeyboard />
          </>
        )}
      </main>

      <Footer />

      <CustomTextModal />
      <SettingsModal />
      <ThemeSync />
    </div>
  );
}

