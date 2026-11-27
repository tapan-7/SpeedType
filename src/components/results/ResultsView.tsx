'use client';

import { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { TestMode } from '@/shared';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTypingStore } from '@/stores/useTypingStore';
import { StatBadge } from '@/components/common/StatBadge';

export function ResultsView() {
  const result = useTypingStore((s) => s.lastResult);
  const restart = useTypingStore((s) => s.restart);
  const isCustomModalOpen = useTypingStore((s) => s.isCustomModalOpen);
  const isSettingsOpen = useTypingStore((s) => s.isSettingsOpen);
  const isHistoryOpen = useTypingStore((s) => s.isHistoryOpen);
  const anyModalOpen = isCustomModalOpen || isSettingsOpen || isHistoryOpen;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (anyModalOpen) return;
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        restart();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [anyModalOpen, restart]);

  if (!result) return null;

  const isTimeMode = result.mode === TestMode.TIME;

  return (
    <section
      aria-label="Test results"
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-2 py-2"
    >
      {/* Completion Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-semibold text-accent backdrop-blur-md">
              {isTimeMode ? (
                <Clock className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              <span>{isTimeMode ? "Time's Up" : 'Test Complete'}</span>
            </span>
            <span className="text-xs text-text-muted">
              Switch modes above or start a new test below
            </span>
          </div>
          <span className="hidden font-mono text-xs text-text-muted sm:inline">
            Press{' '}
            <kbd className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[11px] text-text-secondary backdrop-blur-sm">
              Tab
            </kbd>{' '}
            or{' '}
            <kbd className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[11px] text-text-secondary backdrop-blur-sm">
              Enter
            </kbd>{' '}
            to restart
          </span>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
      </div>

      {/* Top Hero Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-6 sm:gap-10">
          <StatBadge label="wpm" value={result.wpm} highlight size="lg" />
          <StatBadge label="acc" value={`${result.accuracy}%`} size="lg" />
        </div>

        <div className="flex flex-wrap items-center gap-5 sm:gap-8">
          <StatBadge label="raw" value={result.rawWpm} />
          <StatBadge label="consistency" value={`${result.consistency}%`} />
          <StatBadge label="time" value={`${result.elapsedSeconds}s`} />
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-mono text-sm font-medium text-text-secondary">
              {result.characters.correct}/{result.characters.incorrect}/
              {result.characters.extra}/{result.characters.missed}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">
              chars
            </span>
          </div>
        </div>
      </div>

      {/* WPM Timeline Chart */}
      {result.timeline.length > 0 && (
        <div className="h-52 w-full rounded-3xl bg-white/[0.025] px-3 py-4 backdrop-blur-md">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={result.timeline}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="stWpmFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7a45" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#ff7a45" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="second"
                tick={{ fill: '#555b66', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#555b66', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14161c',
                  borderColor: 'rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#f3f4f6',
                }}
              />
              <Area
                type="monotone"
                dataKey="rawWpm"
                name="Raw WPM"
                stroke="#a78bfa"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="wpm"
                name="WPM"
                stroke="#ff7a45"
                strokeWidth={2}
                fill="url(#stWpmFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weak Keys & Mode Metadata */}
      <div className="flex flex-col gap-5">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="rounded-full bg-white/[0.04] px-3 py-1 font-mono text-text-secondary backdrop-blur-sm">
              {result.configSummary}
            </span>
            {result.quoteAuthor && (
              <span className="text-text-muted">— {result.quoteAuthor}</span>
            )}
            {result.weakKeys.length > 0 && (
              <div className="ml-2 flex items-center gap-1.5">
                <span>weak keys:</span>
                {result.weakKeys.map((wk) => (
                  <span
                    key={wk.key}
                    className="rounded-full bg-char-error/10 px-2 py-0.5 font-mono text-[11px] text-char-error backdrop-blur-sm"
                  >
                    {wk.key === ' ' ? 'space' : wk.key} ({wk.errors})
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-bg-primary shadow-[0_0_20px_rgba(255,122,69,0.25)] transition-all hover:opacity-90"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Next Test</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

