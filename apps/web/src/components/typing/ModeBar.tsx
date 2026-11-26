'use client';

import { AtSign, Hash, Pencil } from 'lucide-react';
import {
  MODE_OPTIONS,
  QUOTE_LENGTH_OPTIONS,
  TIME_PRESETS,
  TestMode,
  TestStatus,
  UI_STRINGS,
  WORD_PRESETS,
} from '@speedtype/shared';
import { useTypingStore } from '@/stores/useTypingStore';
import { PillToggle } from '@/components/common/PillToggle';

export function ModeBar() {
  const config = useTypingStore((s) => s.engineState.config);
  const status = useTypingStore((s) => s.engineState.status);
  const focusFadeOut = useTypingStore((s) => s.preferences.focusFadeOut);
  const updateConfig = useTypingStore((s) => s.updateConfig);
  const setCustomModalOpen = useTypingStore((s) => s.setCustomModalOpen);

  const isTyping = status === TestStatus.RUNNING && focusFadeOut;
  const showModifiers =
    config.mode === TestMode.TIME || config.mode === TestMode.WORDS;

  return (
    <div
      className={`mx-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-xl border border-border-subtle bg-bg-surface px-2.5 py-1.5 backdrop-blur-md transition-opacity duration-300 ${
        isTyping ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {showModifiers && (
        <>
          <div className="flex items-center gap-0.5">
            <PillToggle
              active={config.punctuation}
              accent="lavender"
              onClick={() => updateConfig({ punctuation: !config.punctuation })}
            >
              <AtSign className="h-3 w-3" />
              <span>{UI_STRINGS.MODIFIER_PUNCTUATION}</span>
            </PillToggle>

            <PillToggle
              active={config.numbers}
              accent="lavender"
              onClick={() => updateConfig({ numbers: !config.numbers })}
            >
              <Hash className="h-3 w-3" />
              <span>{UI_STRINGS.MODIFIER_NUMBERS}</span>
            </PillToggle>
          </div>
          <span
            aria-hidden="true"
            className="mx-1.5 h-4 w-px bg-border-subtle"
          />
        </>
      )}

      <div className="flex items-center gap-0.5">
        {MODE_OPTIONS.map((option) => (
          <PillToggle
            key={option.value}
            active={config.mode === option.value}
            onClick={() => updateConfig({ mode: option.value })}
          >
            {option.label}
          </PillToggle>
        ))}
      </div>

      <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border-subtle" />

      <div className="flex items-center gap-0.5">
        {config.mode === TestMode.TIME &&
          TIME_PRESETS.map((seconds) => (
            <PillToggle
              key={seconds}
              active={config.durationSeconds === seconds}
              onClick={() => updateConfig({ durationSeconds: seconds })}
            >
              {seconds}
            </PillToggle>
          ))}

        {config.mode === TestMode.WORDS &&
          WORD_PRESETS.map((count) => (
            <PillToggle
              key={count}
              active={config.wordCount === count}
              onClick={() => updateConfig({ wordCount: count })}
            >
              {count}
            </PillToggle>
          ))}

        {config.mode === TestMode.QUOTE &&
          QUOTE_LENGTH_OPTIONS.map((opt) => (
            <PillToggle
              key={opt.value}
              active={config.quoteLength === opt.value}
              onClick={() => updateConfig({ quoteLength: opt.value })}
            >
              {opt.label}
            </PillToggle>
          ))}

        {config.mode === TestMode.CUSTOM && (
          <PillToggle onClick={() => setCustomModalOpen(true)}>
            <Pencil className="h-3 w-3" />
            <span>edit text</span>
          </PillToggle>
        )}
      </div>
    </div>
  );
}

