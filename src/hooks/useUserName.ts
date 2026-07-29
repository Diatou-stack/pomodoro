import { useCallback, useState } from 'react';

const STORAGE_KEY = 'nuage-pomodoro-username';

function loadName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

export function useUserName() {
  const [name, setNameState] = useState(() => loadName());
  const [askName, setAskName] = useState(() => !loadName());

  const saveName = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      /* ignore */
    }
    setNameState(trimmed);
    setAskName(false);
    return true;
  }, []);

  return { name, askName, saveName };
}
