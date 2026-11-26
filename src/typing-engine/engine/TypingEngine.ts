import {
  CharacterStatus,
  DEFAULT_TEST_CONFIG,
  TestMode,
  TestStatus,
} from '@/shared';
import type {
  KeyErrorStat,
  TestConfig,
  TestResult,
  TimelineSnapshot,
  TypingEngineState,
  WordEntry,
} from '@/shared';
import {
  buildCharacterBreakdown,
  calculateAccuracy,
  calculateConsistency,
  calculateRawWpm,
  calculateWpm,
} from '../calculations/metrics.js';
import { generateTestWords, generateWordList } from '../generators/textGenerator.js';

const MAX_EXTRA_CHARS_PER_WORD = 20;

export interface TypingEngineOptions {
  config?: Partial<TestConfig>;
  /** Injectable clock for deterministic testing; defaults to performance.now() */
  nowProvider?: () => number;
}

/**
 * Framework-agnostic typing session state machine.
 */
export class TypingEngine {
  private status: TestStatus = TestStatus.IDLE;
  private config: TestConfig;
  private words: WordEntry[] = [];
  private quoteAuthor?: string;

  private currentWordIndex = 0;
  private currentCharIndex = 0;

  private startTimeMs: number | null = null;
  private elapsedMs = 0;

  private correctKeystrokes = 0;
  private totalKeystrokes = 0;
  private snapshots: TimelineSnapshot[] = [];
  private lastSnapshotSecond = 0;
  private errorsSinceLastSnapshot = 0;
  private keyStats = new Map<string, KeyErrorStat>();

  private readonly now: () => number;

  constructor(options: TypingEngineOptions = {}) {
    this.now = options.nowProvider ?? (() => performance.now());
    this.config = { ...DEFAULT_TEST_CONFIG, ...options.config };
    this.reset(this.config);
  }

  /**
   * Resets the session back to IDLE with optional updated config.
   */
  reset(nextConfig?: Partial<TestConfig>): void {
    if (nextConfig) {
      this.config = { ...this.config, ...nextConfig };
    }

    const generated = generateTestWords(this.config);
    this.words = generated.words;
    this.quoteAuthor = generated.quoteAuthor;

    this.status = TestStatus.IDLE;
    this.currentWordIndex = 0;
    this.currentCharIndex = 0;
    this.startTimeMs = null;
    this.elapsedMs = 0;
    this.correctKeystrokes = 0;
    this.totalKeystrokes = 0;
    this.snapshots = [];
    this.lastSnapshotSecond = 0;
    this.errorsSinceLastSnapshot = 0;
    this.keyStats.clear();
  }

  /**
   * Processes a single keyboard key (printable character, ' ', or 'Backspace').
   * Returns true if state changed.
   */
  handleKey(key: string): boolean {
    if (this.status === TestStatus.COMPLETED) return false;

    if (key === 'Backspace') {
      return this.handleBackspace();
    }

    if (key === ' ') {
      return this.handleSpace();
    }

    if (key.length === 1) {
      return this.handleCharacter(key);
    }

    return false;
  }

  /**
   * Advances elapsed time and records per-second snapshots.
   * Completes TIME-mode tests when duration expires.
   */
  tick(nowMs: number = this.now()): void {
    if (this.status !== TestStatus.RUNNING || this.startTimeMs === null) {
      return;
    }

    this.elapsedMs = Math.max(0, nowMs - this.startTimeMs);

    const currentSecond = Math.floor(this.elapsedMs / 1000);
    while (this.lastSnapshotSecond < currentSecond) {
      this.lastSnapshotSecond++;
      const snapshotElapsedMs = this.lastSnapshotSecond * 1000;
      const correctChars = this.countCorrectCharacters();
      this.snapshots.push({
        second: this.lastSnapshotSecond,
        wpm: calculateWpm(correctChars, snapshotElapsedMs),
        rawWpm: calculateRawWpm(this.totalKeystrokes, snapshotElapsedMs),
        errors: this.errorsSinceLastSnapshot,
      });
      this.errorsSinceLastSnapshot = 0;
    }

    if (this.config.mode === TestMode.TIME) {
      const targetMs = this.config.durationSeconds * 1000;
      if (this.elapsedMs >= targetMs) {
        this.elapsedMs = targetMs;
        this.complete();
      }
    }
  }

  /**
   * Returns a read-only snapshot of current engine state for UI rendering.
   */
  getState(): TypingEngineState {
    if (this.status === TestStatus.RUNNING) {
      this.tick();
    }

    const correctChars = this.countCorrectCharacters();
    const targetMs =
      this.config.mode === TestMode.TIME ? this.config.durationSeconds * 1000 : 0;

    return {
      status: this.status,
      config: { ...this.config },
      words: this.words,
      currentWordIndex: this.currentWordIndex,
      currentCharIndex: this.currentCharIndex,
      elapsedMs: this.elapsedMs,
      remainingMs:
        this.config.mode === TestMode.TIME
          ? Math.max(0, targetMs - this.elapsedMs)
          : 0,
      liveWpm: calculateWpm(correctChars, this.elapsedMs),
      liveRawWpm: calculateRawWpm(this.totalKeystrokes, this.elapsedMs),
      liveAccuracy: calculateAccuracy(this.correctKeystrokes, this.totalKeystrokes),
      correctKeystrokes: this.correctKeystrokes,
      totalKeystrokes: this.totalKeystrokes,
      expectedKey: this.getExpectedKey(),
      quoteAuthor: this.quoteAuthor,
    };
  }

  /**
   * Produces the final TestResult summary once completed (or current snapshot).
   */
  getResult(): TestResult {
    const breakdown = buildCharacterBreakdown(this.words, this.currentWordIndex);
    const effectiveMs = Math.max(1000, this.elapsedMs);
    const correctCharsForWpm = breakdown.correct + this.countCompletedSpaces();

    const wpm = calculateWpm(correctCharsForWpm, effectiveMs);
    const rawWpm = calculateRawWpm(this.totalKeystrokes, effectiveMs);
    const accuracy = calculateAccuracy(this.correctKeystrokes, this.totalKeystrokes);
    const consistency = calculateConsistency(this.snapshots.map((s) => s.wpm));

    const weakKeys = Array.from(this.keyStats.values())
      .filter((stat) => stat.errors > 0)
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 6);

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mode: this.config.mode,
      configSummary: this.formatConfigSummary(),
      wpm,
      rawWpm,
      accuracy,
      consistency,
      elapsedSeconds: Number((effectiveMs / 1000).toFixed(1)),
      characters: breakdown,
      timeline: [...this.snapshots],
      weakKeys,
      quoteAuthor: this.quoteAuthor,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns the next expected character (or ' ' if at the end of a word).
   */
  getExpectedKey(): string | null {
    if (this.status === TestStatus.COMPLETED) return null;
    const word = this.words[this.currentWordIndex];
    if (!word) return null;

    if (this.currentCharIndex < word.characters.length) {
      return word.characters[this.currentCharIndex]?.expected ?? null;
    }
    return ' ';
  }

  private handleCharacter(key: string): boolean {
    if (this.status === TestStatus.IDLE) {
      this.status = TestStatus.RUNNING;
      this.startTimeMs = this.now();
    } else {
      this.tick();
      if ((this.status as TestStatus) === TestStatus.COMPLETED) return false;
    }

    const word = this.words[this.currentWordIndex];
    if (!word) return false;

    this.totalKeystrokes++;

    if (this.currentCharIndex < word.characters.length) {
      const charEntry = word.characters[this.currentCharIndex]!;
      const isCorrect = key === charEntry.expected;

      charEntry.typed = key;
      charEntry.status = isCorrect
        ? CharacterStatus.CORRECT
        : CharacterStatus.INCORRECT;

      this.recordKeyStat(charEntry.expected, !isCorrect);

      if (isCorrect) {
        this.correctKeystrokes++;
      } else {
        this.errorsSinceLastSnapshot++;
      }

      this.currentCharIndex++;
      this.refreshWordErrorFlag(word);

      // Auto-complete non-timed modes on the final character of the final word
      if (
        this.config.mode !== TestMode.TIME &&
        this.currentWordIndex === this.words.length - 1 &&
        this.currentCharIndex === word.characters.length &&
        word.extraCharacters.length === 0
      ) {
        word.isCompleted = true;
        this.tick();
        this.complete();
      }
      return true;
    }

    // Extra character beyond word length
    if (word.extraCharacters.length < MAX_EXTRA_CHARS_PER_WORD) {
      word.extraCharacters.push({
        expected: '',
        typed: key,
        status: CharacterStatus.EXTRA,
      });
      word.hasError = true;
      this.errorsSinceLastSnapshot++;
      return true;
    }

    return false;
  }

  private handleSpace(): boolean {
    if (this.status !== TestStatus.RUNNING) return false;

    const word = this.words[this.currentWordIndex];
    if (!word) return false;

    // Ignore accidental space before typing any character in the current word
    if (this.currentCharIndex === 0 && word.extraCharacters.length === 0) {
      return false;
    }

    this.tick();
    if ((this.status as TestStatus) === TestStatus.COMPLETED) return false;

    word.isCompleted = true;
    this.refreshWordErrorFlag(word);

    this.totalKeystrokes++;
    if (!word.hasError) {
      this.correctKeystrokes++;
    } else {
      this.errorsSinceLastSnapshot++;
    }

    if (this.currentWordIndex === this.words.length - 1) {
      if (this.config.mode === TestMode.TIME) {
        // Append another batch so timed tests never run out of words
        const more = generateWordList(40, {
          punctuation: this.config.punctuation,
          numbers: this.config.numbers,
        });
        this.words.push(...more);
        this.currentWordIndex++;
        this.currentCharIndex = 0;
      } else {
        this.complete();
      }
      return true;
    }

    this.currentWordIndex++;
    this.currentCharIndex = 0;
    return true;
  }

  private handleBackspace(): boolean {
    if (this.status !== TestStatus.RUNNING) return false;

    const word = this.words[this.currentWordIndex];
    if (!word) return false;

    if (word.extraCharacters.length > 0) {
      word.extraCharacters.pop();
      this.refreshWordErrorFlag(word);
      return true;
    }

    if (this.currentCharIndex > 0) {
      this.currentCharIndex--;
      const charEntry = word.characters[this.currentCharIndex];
      if (charEntry) {
        charEntry.typed = null;
        charEntry.status = CharacterStatus.PENDING;
      }
      this.refreshWordErrorFlag(word);
      return true;
    }

    // Step back into previous word only if it had errors or missed characters
    if (this.currentWordIndex > 0) {
      const prevWord = this.words[this.currentWordIndex - 1];
      if (prevWord && prevWord.hasError) {
        prevWord.isCompleted = false;
        this.currentWordIndex--;
        const firstPending = prevWord.characters.findIndex(
          (c) => c.status === CharacterStatus.PENDING,
        );
        this.currentCharIndex =
          firstPending === -1 ? prevWord.characters.length : firstPending;
        this.refreshWordErrorFlag(prevWord);
        return true;
      }
    }

    return false;
  }

  private complete(): void {
    this.status = TestStatus.COMPLETED;
    const currentSec = Math.max(1, Math.round(this.elapsedMs / 1000));
    if (this.snapshots.length === 0 || this.lastSnapshotSecond < currentSec) {
      const correctChars = this.countCorrectCharacters();
      this.snapshots.push({
        second: currentSec,
        wpm: calculateWpm(correctChars, Math.max(1000, this.elapsedMs)),
        rawWpm: calculateRawWpm(
          this.totalKeystrokes,
          Math.max(1000, this.elapsedMs),
        ),
        errors: this.errorsSinceLastSnapshot,
      });
    }
  }

  private refreshWordErrorFlag(word: WordEntry): void {
    const hasWrongChar = word.characters.some(
      (c) =>
        c.status === CharacterStatus.INCORRECT ||
        (word.isCompleted && c.status === CharacterStatus.PENDING),
    );
    word.hasError = hasWrongChar || word.extraCharacters.length > 0;
  }

  private countCorrectCharacters(): number {
    let correct = 0;
    for (let i = 0; i <= this.currentWordIndex; i++) {
      const word = this.words[i];
      if (!word) continue;
      for (const ch of word.characters) {
        if (ch.status === CharacterStatus.CORRECT) correct++;
      }
    }
    return correct + this.countCompletedSpaces();
  }

  private countCompletedSpaces(): number {
    let spaces = 0;
    for (let i = 0; i < this.currentWordIndex; i++) {
      const word = this.words[i];
      if (word && word.isCompleted && !word.hasError) {
        spaces++;
      }
    }
    return spaces;
  }

  private recordKeyStat(expectedKey: string, isError: boolean): void {
    const normalized = expectedKey.toLowerCase();
    const existing = this.keyStats.get(normalized) ?? {
      key: normalized,
      attempts: 0,
      errors: 0,
    };
    existing.attempts++;
    if (isError) existing.errors++;
    this.keyStats.set(normalized, existing);
  }

  private formatConfigSummary(): string {
    switch (this.config.mode) {
      case TestMode.TIME:
        return `time ${this.config.durationSeconds}s`;
      case TestMode.WORDS:
        return `words ${this.config.wordCount}`;
      case TestMode.QUOTE:
        return `quote (${this.config.quoteLength})`;
      case TestMode.CUSTOM:
        return 'custom';
    }
  }
}

