'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TestMode } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';

export function CustomTextModal() {
  const isOpen = useTypingStore((s) => s.isCustomModalOpen);
  const currentCustomText = useTypingStore((s) => s.engineState.config.customText);
  const setCustomModalOpen = useTypingStore((s) => s.setCustomModalOpen);
  const updateConfig = useTypingStore((s) => s.updateConfig);

  const [draft, setDraft] = useState(currentCustomText);

  useEffect(() => {
    if (isOpen) setDraft(currentCustomText);
  }, [isOpen, currentCustomText]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    updateConfig({ mode: TestMode.CUSTOM, customText: trimmed });
    setCustomModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Custom typing text"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
    >
      <div className="w-full max-w-lg rounded-3xl bg-bg-elevated/85 p-6 shadow-2xl backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            Custom Practice Text
          </h2>
          <button
            type="button"
            onClick={() => setCustomModalOpen(false)}
            className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <textarea
          rows={5}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste or write your custom English passage here..."
          className="w-full rounded-2xl bg-white/[0.04] p-3.5 font-mono text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent/50 focus:outline-none"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setCustomModalOpen(false)}
            className="rounded-lg px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-bg-primary transition-opacity hover:opacity-90"
          >
            Apply Text
          </button>
        </div>
      </div>
    </div>
  );
}

