import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerMode = 'focus' | 'break';

export interface PomodoroConfig {
  focusMinutes: number;
  breakMinutes: number;
}

const DEFAULT_CONFIG: PomodoroConfig = {
  focusMinutes: 25,
  breakMinutes: 5,
};

function clampMinutes(value: number, min = 1, max = 90): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function usePomodoro(initialConfig: PomodoroConfig = DEFAULT_CONFIG) {
  const [config, setConfig] = useState<PomodoroConfig>({
    focusMinutes: clampMinutes(initialConfig.focusMinutes),
    breakMinutes: clampMinutes(initialConfig.breakMinutes),
  });
  const [mode, setMode] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(config.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const durationForMode = useCallback(
    (nextMode: TimerMode, nextConfig = config) =>
      (nextMode === 'focus' ? nextConfig.focusMinutes : nextConfig.breakMinutes) * 60,
    [config],
  );

  const resetToMode = useCallback(
    (nextMode: TimerMode, running = false) => {
      clearTimer();
      setMode(nextMode);
      setSecondsLeft(durationForMode(nextMode));
      setIsRunning(running);
    },
    [clearTimer, durationForMode],
  );

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) return;

    clearTimer();
    setIsRunning(false);

    if (mode === 'focus') {
      setCompletedFocusSessions((n) => n + 1);
      setMode('break');
      setSecondsLeft(durationForMode('break'));
    } else {
      setMode('focus');
      setSecondsLeft(durationForMode('focus'));
    }
  }, [secondsLeft, isRunning, mode, clearTimer, durationForMode]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    resetToMode(mode, false);
  }, [mode, resetToMode]);

  const switchMode = useCallback(
    (nextMode: TimerMode) => {
      resetToMode(nextMode, false);
    },
    [resetToMode],
  );

  const updateConfig = useCallback(
    (partial: Partial<PomodoroConfig>) => {
      setConfig((prev) => {
        const next: PomodoroConfig = {
          focusMinutes: clampMinutes(partial.focusMinutes ?? prev.focusMinutes),
          breakMinutes: clampMinutes(partial.breakMinutes ?? prev.breakMinutes),
        };
        if (!isRunning) {
          setSecondsLeft(
            (mode === 'focus' ? next.focusMinutes : next.breakMinutes) * 60,
          );
        }
        return next;
      });
    },
    [isRunning, mode],
  );

  const totalSeconds = durationForMode(mode);
  const progress = totalSeconds === 0 ? 0 : 1 - secondsLeft / totalSeconds;

  return {
    config,
    mode,
    secondsLeft,
    isRunning,
    completedFocusSessions,
    progress,
    start,
    pause,
    reset,
    switchMode,
    updateConfig,
  };
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
