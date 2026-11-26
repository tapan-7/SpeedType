import { describe, expect, it } from 'vitest';
import {
  CharacterStatus,
  TestMode,
  TestStatus,
} from '@/shared';
import {
  TypingEngine,
  calculateAccuracy,
  calculateConsistency,
  calculateWpm,
} from '../index.js';

function createClock(initialMs = 1000) {
  let now = initialMs;
  return {
    now: () => now,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

describe('metrics calculations', () => {
  it('calculates standard WPM accurately', () => {
    // 300 correct chars in 60 seconds = 60 WPM
    expect(calculateWpm(300, 60000)).toBe(60);
    expect(calculateWpm(0, 60000)).toBe(0);
    expect(calculateWpm(50, 0)).toBe(0);
  });

  it('calculates accuracy and consistency', () => {
    expect(calculateAccuracy(95, 100)).toBe(95);
    expect(calculateAccuracy(0, 0)).toBe(100);
    expect(calculateConsistency([60, 60, 60])).toBe(100);
    expect(calculateConsistency([40, 80])).toBeLessThan(80);
  });
});

describe('TypingEngine', () => {
  it('starts in IDLE and transitions to RUNNING on first character', () => {
    const clock = createClock(0);
    const engine = new TypingEngine({
      config: { mode: TestMode.CUSTOM, customText: 'hello world' },
      nowProvider: clock.now,
    });

    expect(engine.getState().status).toBe(TestStatus.IDLE);
    expect(engine.getState().expectedKey).toBe('h');

    // Leading space or backspace in IDLE should be ignored
    expect(engine.handleKey(' ')).toBe(false);
    expect(engine.handleKey('Backspace')).toBe(false);
    expect(engine.getState().status).toBe(TestStatus.IDLE);

    expect(engine.handleKey('h')).toBe(true);
    expect(engine.getState().status).toBe(TestStatus.RUNNING);
    expect(engine.getState().expectedKey).toBe('e');
  });

  it('validates correct, incorrect, extra characters, and backspace', () => {
    const clock = createClock(0);
    const engine = new TypingEngine({
      config: { mode: TestMode.CUSTOM, customText: 'hi there' },
      nowProvider: clock.now,
    });

    engine.handleKey('h');
    engine.handleKey('x'); // incorrect ('i' expected)
    engine.handleKey('z'); // extra char beyond 'hi'

    let state = engine.getState();
    expect(state.words[0]?.characters[0]?.status).toBe(CharacterStatus.CORRECT);
    expect(state.words[0]?.characters[1]?.status).toBe(CharacterStatus.INCORRECT);
    expect(state.words[0]?.extraCharacters).toHaveLength(1);
    expect(state.words[0]?.hasError).toBe(true);

    // Backspace pops extra char first, then incorrect char
    engine.handleKey('Backspace');
    expect(engine.getState().words[0]?.extraCharacters).toHaveLength(0);

    engine.handleKey('Backspace');
    state = engine.getState();
    expect(state.words[0]?.characters[1]?.status).toBe(CharacterStatus.PENDING);
    expect(state.currentCharIndex).toBe(1);

    engine.handleKey('i');
    expect(engine.getState().words[0]?.hasError).toBe(false);
    expect(engine.getState().expectedKey).toBe(' ');
  });

  it('completes CUSTOM / WORDS mode on final character', () => {
    const clock = createClock(0);
    const engine = new TypingEngine({
      config: { mode: TestMode.CUSTOM, customText: 'go fast' },
      nowProvider: clock.now,
    });

    for (const ch of 'go') engine.handleKey(ch);
    clock.advance(1000);
    engine.handleKey(' ');
    for (const ch of 'fas') engine.handleKey(ch);
    clock.advance(1000);
    engine.handleKey('t');

    const state = engine.getState();
    expect(state.status).toBe(TestStatus.COMPLETED);

    const result = engine.getResult();
    expect(result.accuracy).toBe(100);
    expect(result.characters.correct).toBe(6);
    expect(result.characters.incorrect).toBe(0);
    expect(result.wpm).toBeGreaterThan(0);
  });

  it('completes TIME mode when duration expires and tracks weak keys', () => {
    const clock = createClock(0);
    const engine = new TypingEngine({
      config: { mode: TestMode.TIME, durationSeconds: 15 },
      nowProvider: clock.now,
    });

    const firstExpected = engine.getState().expectedKey!;
    // Intentionally mistype first character
    engine.handleKey(firstExpected === 'a' ? 'b' : 'a');

    clock.advance(5000);
    engine.tick();
    expect(engine.getState().status).toBe(TestStatus.RUNNING);
    expect(engine.getState().remainingMs).toBe(10000);

    clock.advance(10000);
    engine.tick();
    expect(engine.getState().status).toBe(TestStatus.COMPLETED);

    const result = engine.getResult();
    expect(result.elapsedSeconds).toBe(15);
    expect(result.weakKeys.length).toBeGreaterThan(0);
    expect(result.weakKeys[0]?.key).toBe(firstExpected.toLowerCase());
  });

  it('resets cleanly back to IDLE', () => {
    const clock = createClock(0);
    const engine = new TypingEngine({
      config: { mode: TestMode.WORDS, wordCount: 10 },
      nowProvider: clock.now,
    });

    engine.handleKey('a');
    clock.advance(2000);
    engine.reset({ wordCount: 25 });

    const state = engine.getState();
    expect(state.status).toBe(TestStatus.IDLE);
    expect(state.words).toHaveLength(25);
    expect(state.elapsedMs).toBe(0);
    expect(state.totalKeystrokes).toBe(0);
  });
});

