'use client';

import { useEffect, useMemo, useState } from 'react';
import { Flame, History, Target, Trash2, Trophy, X } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { QWERTY_ROWS, TestMode } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import {
  aggregateWeakKeys,
  computePersonalBests,
  filterHistoryByDays,
  generateWeakKeyDrill,
} from '@/lib/analytics';
import { PillToggle } from '@/components/common/PillToggle';
import { StatBadge } from '@/components/common/StatBadge';

const RANGE_OPTIONS = [7, 30, 90] as const;

export function StatsView() {
  const history = useTypingStore((s) => s.history);
  const clearHistory = useTypingStore((s) => s.clearHistory);
  const updateConfig = useTypingStore((s) => s.updateConfig);
  const setStatsOpen = useTypingStore((s) => s.setStatsOpen);

  const [days, setDays] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setStatsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setStatsOpen]);

  const filtered = useMemo(
    () => filterHistoryByDays(history, days),
    [history, days],
  );

  const chartData = useMemo(() => {
    return [...filtered]
      .reverse()
      .map((item, idx) => ({
        index: idx + 1,
        label: new Date(item.completedAt).toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
        }),
        wpm: item.wpm,
        accuracy: item.accuracy,
      }));
  }, [filtered]);

  const personalBests = useMemo(
    () => computePersonalBests(history),
    [history],
  );

  const weakKeys = useMemo(() => aggregateWeakKeys(filtered), [filtered]);
  const weakKeyMap = useMemo(() => {
    const maxErrors = weakKeys[0]?.errors ?? 1;
    const map = new Map<string, { errors: number; intensity: number }>();
    for (const wk of weakKeys) {
      map.set(wk.key, {
        errors: wk.errors,
        intensity: Math.min(1, wk.errors / Math.max(1, maxErrors)),
      });
    }
    return map;
  }, [weakKeys]);

  const bestWpm =
    filtered.length > 0 ? Math.max(...filtered.map((h) => h.wpm)) : 0;
  const avgWpm =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, h) => sum + h.wpm, 0) / filtered.length,
        )
      : 0;
  const avgAcc =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, h) => sum + h.accuracy, 0) / filtered.length,
        )
      : 0;

  const handlePracticeWeakKeys = () => {
    const drillText = generateWeakKeyDrill(weakKeys);
    updateConfig({ mode: TestMode.CUSTOM, customText: drillText });
    setStatsOpen(false);
  };

  return (
    <section
      aria-label="Performance and weakness analytics"
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-2"
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          Performance &amp; Weakness Analytics
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-white/[0.03] p-1 backdrop-blur-md">
            {RANGE_OPTIONS.map((opt) => (
              <PillToggle
                key={opt}
                active={days === opt}
                onClick={() => setDays(opt)}
              >
                {opt}d
              </PillToggle>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStatsOpen(false)}
            aria-label="Close analytics"
            title="Close (Esc)"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-md transition-colors hover:bg-white/[0.1] hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/[0.025] py-20 text-center backdrop-blur-md">
          <p className="text-sm text-text-secondary">
            No completed tests yet. Finish a typing session to unlock trends,
            personal bests, and your key accuracy heatmap.
          </p>
          <button
            type="button"
            onClick={() => setStatsOpen(false)}
            className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-bg-primary transition-opacity hover:opacity-90"
          >
            Start Typing
          </button>
        </div>
      ) : (
        <>
          {/* Summary Strip */}
          <div className="flex flex-wrap items-center justify-around gap-8 rounded-3xl bg-white/[0.025] px-6 py-6 backdrop-blur-md">
            <StatBadge label="tests" value={filtered.length} />
            <StatBadge label="best wpm" value={bestWpm} highlight size="lg" />
            <StatBadge label="avg wpm" value={avgWpm} size="lg" />
            <StatBadge label="avg acc" value={`${avgAcc}%`} />
          </div>

          {/* WPM & Accuracy Trend Chart */}
          {chartData.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                WPM &amp; Accuracy Trend ({days} days)
              </h2>
              <div className="h-64 w-full rounded-3xl bg-white/[0.025] px-3 py-5 backdrop-blur-md">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 16, left: -12, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="statsWpmFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ff7a45"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ff7a45"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
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
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#f3f4f6',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      name="Accuracy %"
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
                      fill="url(#statsWpmFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Personal Bests by Mode */}
          <section className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
              <Trophy className="h-3.5 w-3.5 text-accent" />
              <span>Personal Bests by Mode</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {personalBests.map((pb) => (
                <div
                  key={pb.configSummary}
                  className="flex flex-col gap-1 rounded-2xl bg-white/[0.025] px-4 py-3.5 backdrop-blur-md"
                >
                  <span className="font-mono text-[11px] text-text-muted">
                    {pb.configSummary}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-semibold text-accent">
                      {pb.wpm}
                    </span>
                    <span className="text-xs text-text-secondary">
                      wpm · {pb.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Accuracy Heatmap & Weakness Detector */}
          <section className="flex flex-col gap-4 rounded-3xl bg-white/[0.025] p-6 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
                  <Flame className="h-3.5 w-3.5 text-char-error" />
                  <span>Key Accuracy Heatmap &amp; Weakness Detector</span>
                </h2>
                <p className="text-xs text-text-secondary">
                  Keys highlighted in red had the most errors across your{' '}
                  {days}-day history.
                </p>
              </div>

              {weakKeys.length > 0 && (
                <button
                  type="button"
                  onClick={handlePracticeWeakKeys}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-bg-primary shadow-[0_0_20px_rgba(255,122,69,0.25)] transition-opacity hover:opacity-90"
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>Practice Weak Keys</span>
                </button>
              )}
            </div>

            {/* QWERTY Heatmap */}
            <div className="hidden flex-col items-center gap-2 py-2 sm:flex">
              {QWERTY_ROWS.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex items-center justify-center gap-2"
                >
                  {row.map((keyDef) => {
                    const info = weakKeyMap.get(keyDef.value);
                    const widthClass = keyDef.width === 6 ? 'w-56' : 'w-11';
                    const bgStyle = info
                      ? {
                          backgroundColor: `rgba(248, 113, 113, ${0.15 + info.intensity * 0.45})`,
                        }
                      : undefined;

                    return (
                      <div
                        key={keyDef.id}
                        style={bgStyle}
                        title={
                          info
                            ? `${keyDef.label}: ${info.errors} errors`
                            : `${keyDef.label}: 0 errors`
                        }
                        className={`flex h-11 ${widthClass} flex-col items-center justify-center rounded-xl font-mono text-xs font-medium ${
                          info
                            ? 'text-text-primary'
                            : 'bg-white/[0.03] text-text-muted'
                        }`}
                      >
                        <span>{keyDef.label}</span>
                        {info && (
                          <span className="text-[9px] text-char-error">
                            {info.errors}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {weakKeys.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="text-text-muted">Top weak keys:</span>
                {weakKeys.slice(0, 8).map((wk) => (
                  <span
                    key={wk.key}
                    className="rounded-full bg-char-error/15 px-2.5 py-0.5 font-mono text-[11px] text-char-error"
                  >
                    {wk.key === ' ' ? 'space' : wk.key} ({wk.errors} err)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">
                No key errors recorded in this range yet — keep typing!
              </p>
            )}
          </section>

          {/* Recent History */}
          <section id="history" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
                <History className="h-3.5 w-3.5 text-accent" />
                <span>Recent History ({history.length})</span>
              </h2>
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-char-error transition-colors hover:bg-char-error/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {history.slice(0, 20).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/[0.025] px-5 py-3 text-xs backdrop-blur-md transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-5">
                    <span className="font-mono text-base font-semibold text-accent">
                      {item.wpm}{' '}
                      <span className="text-[10px] text-text-muted">wpm</span>
                    </span>
                    <span className="font-mono text-text-secondary">
                      {item.accuracy}% acc
                    </span>
                    <span className="font-mono text-text-muted">
                      {item.consistency}% cons
                    </span>
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 font-mono text-[11px] text-text-muted">
                      {item.configSummary}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted">
                    {new Date(item.completedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

