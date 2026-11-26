import { CodeLanguage } from '@/shared';

export interface CodeSnippetEntry {
  text: string;
  language: Exclude<CodeLanguage, CodeLanguage.ALL>;
  label: string;
}

export const CODE_SNIPPETS: readonly CodeSnippetEntry[] = [
  {
    language: CodeLanguage.TYPESCRIPT,
    label: 'TypeScript · Generic Debounce',
    text: 'export function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T { let timer: ReturnType<typeof setTimeout>; return ((...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delayMs); }) as T; }',
  },
  {
    language: CodeLanguage.TYPESCRIPT,
    label: 'TypeScript · Result Union',
    text: 'type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }; export function unwrapOr<T>(res: Result<T>, fallback: T): T { return res.ok ? res.value : fallback; }',
  },
  {
    language: CodeLanguage.TYPESCRIPT,
    label: 'TypeScript · Array GroupBy',
    text: 'export function groupBy<T, K extends string>(items: readonly T[], getKey: (item: T) => K): Record<K, T[]> { return items.reduce((acc, item) => { const key = getKey(item); (acc[key] ??= []).push(item); return acc; }, {} as Record<K, T[]>); }',
  },
  {
    language: CodeLanguage.JAVASCRIPT,
    label: 'JavaScript · Fetch Retry',
    text: 'async function fetchWithRetry(url, retries = 3) { for (let i = 0; i < retries; i++) { const res = await fetch(url); if (res.ok) return res.json(); } throw new Error("Request failed after retries"); }',
  },
  {
    language: CodeLanguage.JAVASCRIPT,
    label: 'JavaScript · LRU Cache Map',
    text: 'function touchCache(cache, key, value, max = 50) { if (cache.has(key)) cache.delete(key); cache.set(key, value); if (cache.size > max) cache.delete(cache.keys().next().value); }',
  },
  {
    language: CodeLanguage.PYTHON,
    label: 'Python · Binary Search',
    text: 'def binary_search(nums: list[int], target: int) -> int: left, right = 0, len(nums) - 1; while left <= right: mid = (left + right) // 2; if nums[mid] == target: return mid; left, right = (mid + 1, right) if nums[mid] < target else (left, mid - 1); return -1',
  },
  {
    language: CodeLanguage.PYTHON,
    label: 'Python · Memoized Fibonacci',
    text: 'from functools import lru_cache; @lru_cache(maxsize=None) def fib(n: int) -> int: return n if n < 2 else fib(n - 1) + fib(n - 2)',
  },
];

