'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  CaretStyle,
  CharacterStatus,
  TestMode,
  TestStatus,
  UI_STRINGS,
} from '@/shared';
import type { WordEntry } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';

const FONT_SIZE_METRICS = {
  compact: {
    lineHeight: 46,
    caretHeight: 32,
    caretTopOffset: 7,
    textClass: 'text-[24px] leading-[46px] sm:text-[28px]',
  },
  comfortable: {
    lineHeight: 60,
    caretHeight: 42,
    caretTopOffset: 9,
    textClass: 'text-[30px] leading-[60px] sm:text-[36px] lg:text-[40px]',
  },
  large: {
    lineHeight: 70,
    caretHeight: 48,
    caretTopOffset: 11,
    textClass: 'text-[34px] leading-[70px] sm:text-[42px] lg:text-[48px]',
  },
} as const;

function getCharColorClass(status: CharacterStatus): string {
  switch (status) {
    case CharacterStatus.CORRECT:
      return 'text-char-correct';
    case CharacterStatus.INCORRECT:
      return 'text-char-error';
    case CharacterStatus.EXTRA:
      return 'text-char-extra';
    case CharacterStatus.PENDING:
    default:
      return 'text-char-pending';
  }
}

export function TypingViewport() {
  const engineState = useTypingStore((s) => s.engineState);
  const preferences = useTypingStore((s) => s.preferences);
  const isCustomModalOpen = useTypingStore((s) => s.isCustomModalOpen);
  const isSettingsOpen = useTypingStore((s) => s.isSettingsOpen);
  const isHistoryOpen = useTypingStore((s) => s.isHistoryOpen);
  const handleKey = useTypingStore((s) => s.handleKey);
  const tick = useTypingStore((s) => s.tick);
  const restart = useTypingStore((s) => s.restart);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  const [isFocused, setIsFocused] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [caretPos, setCaretPos] = useState<{
    left: number;
    top: number;
    height: number;
    width: number;
  }>({ left: 0, top: 6, height: 30, width: 2.5 });
  const tabPressedAtRef = useRef<number>(0);

  const anyModalOpen = isCustomModalOpen || isSettingsOpen || isHistoryOpen;
  const sizeMetrics =
    FONT_SIZE_METRICS[preferences.fontSize ?? 'comfortable'] ??
    FONT_SIZE_METRICS.comfortable;

  // High-precision timer tick loop while test is running
  useEffect(() => {
    if (engineState.status !== TestStatus.RUNNING) return;
    let rafId = 0;
    let lastTick = 0;

    const loop = (now: number) => {
      if (now - lastTick >= 50) {
        tick();
        lastTick = now;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [engineState.status, tick]);

  // Keep hidden input focused on load and after restarts
  useEffect(() => {
    if (!anyModalOpen) {
      inputRef.current?.focus({ preventScroll: true });
      setIsFocused(true);
    }
  }, [anyModalOpen, engineState.words]);

  // Global Tab + Enter shortcut and direct typing capture
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (anyModalOpen) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        tabPressedAtRef.current = performance.now();
        return;
      }

      if (e.key === 'Enter' && performance.now() - tabPressedAtRef.current < 1200) {
        e.preventDefault();
        tabPressedAtRef.current = 0;
        restart();
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Redirect focus to hidden input if user starts typing anywhere on the page
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus({ preventScroll: true });
        setIsFocused(true);
      }

      if (e.key === 'Backspace' || e.key === ' ' || e.key.length === 1) {
        e.preventDefault();
        handleKey(e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [anyModalOpen, handleKey, restart]);

  // Measure active word & character to drive 3-line smooth scrolling and gliding caret
  useLayoutEffect(() => {
    const container = wordsContainerRef.current;
    const activeWordEl = activeWordRef.current;
    if (!container || !activeWordEl) return;

    const wordTop = activeWordEl.offsetTop;
    const nextScroll =
      wordTop > sizeMetrics.lineHeight ? wordTop - sizeMetrics.lineHeight : 0;
    setScrollOffset(nextScroll);

    const charEl = activeCharRef.current;
    if (charEl) {
      setCaretPos({
        left: charEl.offsetLeft,
        top: charEl.offsetTop + sizeMetrics.caretTopOffset,
        height: sizeMetrics.caretHeight,
        width: Math.max(14, charEl.offsetWidth),
      });
    } else {
      // Caret sits at the right edge of the active word (after last typed/extra char)
      setCaretPos({
        left: activeWordEl.offsetLeft + activeWordEl.offsetWidth,
        top: activeWordEl.offsetTop + sizeMetrics.caretTopOffset,
        height: sizeMetrics.caretHeight,
        width: 14,
      });
    }
  }, [
    engineState.currentWordIndex,
    engineState.currentCharIndex,
    engineState.words,
    sizeMetrics.lineHeight,
    sizeMetrics.caretHeight,
    sizeMetrics.caretTopOffset,
  ]);

  const handleContainerClick = () => {
    inputRef.current?.focus({ preventScroll: true });
    setIsFocused(true);
  };

  const renderCaret = () => {
    const baseTransition = preferences.smoothCaret
      ? 'transition-[transform] duration-75 ease-out'
      : '';
    const blinkClass =
      engineState.status === TestStatus.IDLE ? 'animate-caret-blink' : '';

    if (preferences.caretStyle === CaretStyle.BLOCK) {
      return (
        <span
          aria-hidden="true"
          style={{
            transform: `translate3d(${caretPos.left}px, ${caretPos.top}px, 0)`,
            width: `${caretPos.width}px`,
            height: `${caretPos.height}px`,
          }}
          className={`pointer-events-none absolute left-0 top-0 rounded-sm bg-caret/25 ring-1 ring-caret ${baseTransition} ${blinkClass}`}
        />
      );
    }

    if (preferences.caretStyle === CaretStyle.UNDERLINE) {
      return (
        <span
          aria-hidden="true"
          style={{
            transform: `translate3d(${caretPos.left}px, ${caretPos.top + caretPos.height - 2}px, 0)`,
            width: `${caretPos.width}px`,
            height: '2.5px',
          }}
          className={`pointer-events-none absolute left-0 top-0 rounded-full bg-caret ${baseTransition} ${blinkClass}`}
        />
      );
    }

    return (
      <span
        aria-hidden="true"
        style={{
          transform: `translate3d(${caretPos.left}px, ${caretPos.top}px, 0)`,
          height: `${caretPos.height}px`,
        }}
        className={`pointer-events-none absolute left-0 top-0 w-[2.5px] rounded-full bg-caret ${baseTransition} ${blinkClass}`}
      />
    );
  };

  return (
    <section
      aria-label="Typing practice area"
      className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6"
    >
      <div
        onClick={handleContainerClick}
        className="relative w-full cursor-text select-none rounded-2xl px-2 py-2"
      >
        {/* Hidden input ensures mobile/IME focus and accessibility */}
        <input
          ref={inputRef}
          type="text"
          aria-label="Typing input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value=""
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              for (const ch of val) handleKey(ch);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        {/* 3-line clipped viewport */}
        <div
          style={{ height: `${sizeMetrics.lineHeight * 3}px` }}
          className={`relative overflow-hidden transition-opacity duration-200 ${
            !isFocused && engineState.status !== TestStatus.COMPLETED
              ? 'opacity-45 blur-[1.5px]'
              : 'opacity-100'
          }`}
        >
          <div
            ref={wordsContainerRef}
            style={{ transform: `translate3d(0, -${scrollOffset}px, 0)` }}
            className={`relative flex flex-wrap content-start gap-x-5 font-mono tracking-normal transition-transform duration-150 ease-out ${sizeMetrics.textClass}`}
          >
            {renderCaret()}

            {engineState.words.map((word: WordEntry, wordIdx: number) => {
              const isActiveWord = wordIdx === engineState.currentWordIndex;
              const wordErrorUnderline =
                word.isCompleted && word.hasError
                  ? 'underline decoration-char-error/80 decoration-2 underline-offset-4'
                  : '';

              return (
                <div
                  key={wordIdx}
                  ref={isActiveWord ? activeWordRef : undefined}
                  className={`inline-flex ${wordErrorUnderline}`}
                >
                  {word.characters.map((charEntry, charIdx) => {
                    const isActiveChar =
                      isActiveWord && charIdx === engineState.currentCharIndex;
                    return (
                      <span
                        key={charIdx}
                        ref={isActiveChar ? activeCharRef : undefined}
                        className={getCharColorClass(charEntry.status)}
                      >
                        {charEntry.expected}
                      </span>
                    );
                  })}

                  {word.extraCharacters.map((extra, extraIdx) => (
                    <span
                      key={`extra-${extraIdx}`}
                      className="text-char-extra underline decoration-char-extra/60"
                    >
                      {extra.typed}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus prompt overlay when blurred */}
        {!isFocused && !anyModalOpen && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-lg border border-border-subtle bg-bg-elevated/90 px-4 py-2 text-xs font-medium text-text-secondary shadow-lg backdrop-blur-md">
              {UI_STRINGS.CLICK_TO_FOCUS}
            </span>
          </div>
        )}
      </div>

      {/* Quote or Code Snippet attribution */}
      {(engineState.config.mode === TestMode.QUOTE ||
        engineState.config.mode === TestMode.CODE) &&
        engineState.quoteAuthor && (
          <p className="text-xs font-medium tracking-wide text-text-muted">
            — {engineState.quoteAuthor}
          </p>
        )}

      {/* Subtle restart button */}
      <button
        type="button"
        onClick={restart}
        aria-label="Restart test"
        title="Restart test (Tab + Enter)"
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-200 hover:bg-bg-surface-hover hover:text-text-primary ${
          engineState.status === TestStatus.RUNNING && preferences.focusFadeOut
            ? 'opacity-40 hover:opacity-100'
            : 'opacity-100'
        }`}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>restart</span>
      </button>
    </section>
  );
}

