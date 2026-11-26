'use client';

import { create } from 'zustand';
import {
  DEFAULT_TEST_CONFIG,
  DEFAULT_USER_PREFERENCES,
  MAX_LOCAL_HISTORY,
  STORAGE_KEYS,
  TestStatus,
} from '@/shared';
import type {
  TestConfig,
  TestResult,
  TypingEngineState,
  UserPreferences,
} from '@/shared';
import { TypingEngine } from '@/typing-engine';
import { playKeystrokeSound } from '@/lib/soundEngine';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function loadHistoryFromStorage(): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

interface ActiveKeyPress {
  key: string;
  isError: boolean;
  timestamp: number;
}

interface TypingStore {
  engine: TypingEngine;
  engineState: TypingEngineState;
  lastResult: TestResult | null;
  history: TestResult[];
  preferences: UserPreferences;
  activeKeyPress: ActiveKeyPress | null;
  isCustomModalOpen: boolean;
  isSettingsOpen: boolean;
  isHistoryOpen: boolean;
  hydrated: boolean;

  hydrate: () => void;
  handleKey: (key: string) => void;
  tick: () => void;
  restart: () => void;
  updateConfig: (partial: Partial<TestConfig>) => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  clearHistory: () => void;
  setCustomModalOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setHistoryOpen: (open: boolean) => void;
}

const initialEngine = new TypingEngine({ config: DEFAULT_TEST_CONFIG });

export const useTypingStore = create<TypingStore>((set, get) => ({
  engine: initialEngine,
  engineState: initialEngine.getState(),
  lastResult: null,
  history: [],
  preferences: DEFAULT_USER_PREFERENCES,
  activeKeyPress: null,
  isCustomModalOpen: false,
  isSettingsOpen: false,
  isHistoryOpen: false,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const savedConfig = loadFromStorage<TestConfig>(
      STORAGE_KEYS.CONFIG,
      DEFAULT_TEST_CONFIG,
    );
    const savedPrefs = loadFromStorage<UserPreferences>(
      STORAGE_KEYS.PREFERENCES,
      DEFAULT_USER_PREFERENCES,
    );
    const savedHistory = loadHistoryFromStorage();

    const engine = get().engine;
    engine.reset(savedConfig);

    set({
      engineState: engine.getState(),
      preferences: savedPrefs,
      history: savedHistory,
      hydrated: true,
    });
  },

  handleKey: (key: string) => {
    const { engine, history, lastResult: prevResult } = get();
    const prevState = engine.getState();
    const prevErrors = prevState.totalKeystrokes - prevState.correctKeystrokes;
    const changed = engine.handleKey(key);
    const nextState = engine.getState();

    if (!changed) {
      if (nextState.status === TestStatus.COMPLETED && prevResult === null) {
        const result = engine.getResult();
        const nextHistory = [result, ...history].slice(0, MAX_LOCAL_HISTORY);
        saveToStorage(STORAGE_KEYS.HISTORY, nextHistory);
        set({
          engineState: nextState,
          lastResult: result,
          history: nextHistory,
          activeKeyPress: null,
        });
      }
      return;
    }

    const nextErrors = nextState.totalKeystrokes - nextState.correctKeystrokes;
    const wasError = nextErrors > prevErrors;
    const { soundProfile, soundVolume, playErrorSound } = get().preferences;
    playKeystrokeSound(soundProfile, soundVolume, wasError, playErrorSound);

    let lastResult = prevResult;
    let nextHistory = history;

    if (nextState.status === TestStatus.COMPLETED && prevResult === null) {
      lastResult = engine.getResult();
      nextHistory = [lastResult, ...history].slice(0, MAX_LOCAL_HISTORY);
      saveToStorage(STORAGE_KEYS.HISTORY, nextHistory);
    }

    set({
      engineState: nextState,
      lastResult,
      history: nextHistory,
      activeKeyPress:
        key.length === 1
          ? { key: key.toLowerCase(), isError: wasError, timestamp: Date.now() }
          : null,
    });
  },

  tick: () => {
    const { engine, engineState, history, lastResult } = get();
    if (engineState.status !== TestStatus.RUNNING) return;

    engine.tick();
    const nextState = engine.getState();

    if (nextState.status === TestStatus.COMPLETED) {
      if (lastResult !== null) return;
      const result = engine.getResult();
      const nextHistory = [result, ...history].slice(0, MAX_LOCAL_HISTORY);
      saveToStorage(STORAGE_KEYS.HISTORY, nextHistory);
      set({
        engineState: nextState,
        lastResult: result,
        history: nextHistory,
      });
      return;
    }

    set({ engineState: nextState });
  },

  restart: () => {
    const { engine } = get();
    engine.reset();
    set({
      engineState: engine.getState(),
      lastResult: null,
      activeKeyPress: null,
    });
  },

  updateConfig: (partial: Partial<TestConfig>) => {
    const { engine } = get();
    engine.reset(partial);
    const nextState = engine.getState();
    saveToStorage(STORAGE_KEYS.CONFIG, nextState.config);
    set({
      engineState: nextState,
      lastResult: null,
      activeKeyPress: null,
    });
  },

  updatePreferences: (partial: Partial<UserPreferences>) => {
    const nextPrefs = { ...get().preferences, ...partial };
    saveToStorage(STORAGE_KEYS.PREFERENCES, nextPrefs);
    set({ preferences: nextPrefs });
  },

  clearHistory: () => {
    saveToStorage(STORAGE_KEYS.HISTORY, []);
    set({ history: [] });
  },

  setCustomModalOpen: (open: boolean) => set({ isCustomModalOpen: open }),
  setSettingsOpen: (open: boolean) => set({ isSettingsOpen: open }),
  setHistoryOpen: (open: boolean) => set({ isHistoryOpen: open }),
}));

