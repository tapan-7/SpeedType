'use client';

import { Trash2, X } from 'lucide-react';
import { useTypingStore } from '@/stores/useTypingStore';

export function HistoryModal() {
  const isOpen = useTypingStore((s) => s.isHistoryOpen);
  const history = useTypingStore((s) => s.history);
  const clearHistory = useTypingStore((s) => s.clearHistory);
  const setHistoryOpen = useTypingStore((s) => s.setHistoryOpen);

  if (!isOpen) return null;

  const bestWpm =
    history.length > 0 ? Math.max(...history.map((item) => item.wpm)) : 0;
  const avgWpm =
    history.length > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.wpm, 0) / history.length,
        )
      : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Local test history"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[80vh] w-full max-w-xl flex-col rounded-2xl border border-border-strong bg-bg-elevated p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Recent Local History
            </h2>
            <p className="text-xs text-text-muted">
              Saved locally in your browser — no account required.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                title="Clear local history"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-char-error hover:bg-char-error/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setHistoryOpen(false)}
              className="rounded-lg p-1 text-text-muted hover:bg-bg-surface-hover hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl border border-border-subtle bg-bg-primary p-3 text-center">
            <div>
              <div className="font-mono text-lg font-semibold text-accent">
                {bestWpm}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">
                Best WPM
              </div>
            </div>
            <div>
              <div className="font-mono text-lg font-semibold text-text-primary">
                {avgWpm}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">
                Avg WPM
              </div>
            </div>
            <div>
              <div className="font-mono text-lg font-semibold text-text-primary">
                {history.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">
                Tests
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted">
              Complete a test to see your local history here.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-xs"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-base font-semibold text-accent">
                      {item.wpm} <span className="text-[10px] text-text-muted">wpm</span>
                    </span>
                    <span className="font-mono text-text-secondary">
                      {item.accuracy}% acc
                    </span>
                    <span className="rounded bg-bg-surface-hover px-2 py-0.5 font-mono text-[11px] text-text-muted">
                      {item.configSummary}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted">
                    {new Date(item.completedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

