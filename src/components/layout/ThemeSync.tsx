'use client';

import { useEffect } from 'react';
import { THEME_OPTIONS } from '@/shared';
import { useTypingStore } from '@/stores/useTypingStore';

export function ThemeSync() {
  const theme = useTypingStore((s) => s.preferences.theme);
  const fontFamily = useTypingStore((s) => s.preferences.fontFamily);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font', fontFamily);

    const themeMeta = THEME_OPTIONS.find((t) => t.id === theme);
    if (themeMeta?.isLight) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme, fontFamily]);

  return null;
}

