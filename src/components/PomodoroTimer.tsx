import { Pause, Play, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  formatTime,
  type PomodoroConfig,
  type TimerMode,
} from '../hooks/usePomodoro';

interface PomodoroTimerProps {
  config: PomodoroConfig;
  mode: TimerMode;
  secondsLeft: number;
  isRunning: boolean;
  completedFocusSessions: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSwitchMode: (mode: TimerMode) => void;
  onUpdateConfig: (partial: Partial<PomodoroConfig>) => void;
}

export function PomodoroTimer({
  config,
  mode,
  secondsLeft,
  isRunning,
  completedFocusSessions,
  onStart,
  onPause,
  onReset,
  onSwitchMode,
  onUpdateConfig,
}: PomodoroTimerProps) {
  const totalSeconds =
    (mode === 'focus' ? config.focusMinutes : config.breakMinutes) * 60;
  const canResume = !isRunning && secondsLeft > 0 && secondsLeft < totalSeconds;
  const canStart = !isRunning && (secondsLeft === totalSeconds || secondsLeft === 0);

  return (
    <section className="flex w-full flex-col items-center">
      <div className="mb-6 flex gap-2 sm:mb-8">
        {(['focus', 'break'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSwitchMode(m)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-300',
              mode === m
                ? 'bg-white/35 text-white shadow-sm'
                : 'bg-white/10 text-white/65 hover:bg-white/20',
            )}
          >
            {m === 'focus' ? 'Étude' : 'Pause'}
          </button>
        ))}
      </div>

      {/* Contrôles à gauche + heure géante au centre */}
      <div className="relative flex w-full max-w-4xl items-center justify-center gap-4 sm:gap-8">
        <div className="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 sm:static sm:translate-y-0 sm:shrink-0">
          <button
            type="button"
            onClick={onStart}
            disabled={!canStart || isRunning}
            className={cn(
              'control-btn flex min-w-[7.5rem] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 sm:min-w-[8.5rem]',
              canStart && !isRunning
                ? 'bg-white text-[#2a1040] shadow-lg hover:bg-white/90'
                : 'bg-white/15 text-white/45 cursor-not-allowed',
            )}
          >
            <Play className="h-4 w-4 fill-current" />
            Démarrer
          </button>

          <button
            type="button"
            onClick={onPause}
            disabled={!isRunning}
            className={cn(
              'control-btn flex min-w-[7.5rem] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 sm:min-w-[8.5rem]',
              isRunning
                ? 'bg-white/90 text-[#2a1040] shadow-lg hover:bg-white'
                : 'bg-white/15 text-white/45 cursor-not-allowed',
            )}
          >
            <Pause className="h-4 w-4 fill-current" />
            Pause
          </button>

          <button
            type="button"
            onClick={onStart}
            disabled={!canResume}
            className={cn(
              'control-btn flex min-w-[7.5rem] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 sm:min-w-[8.5rem]',
              canResume
                ? 'bg-white text-[#2a1040] shadow-lg hover:bg-white/90'
                : 'bg-white/15 text-white/45 cursor-not-allowed',
            )}
          >
            <Play className="h-4 w-4 fill-current" />
            Reprendre
          </button>

          <button
            type="button"
            onClick={onReset}
            className="control-btn flex min-w-[7.5rem] items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/25 active:scale-95 sm:min-w-[8.5rem]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center pl-20 sm:pl-0">
          <p
            className="timer-digits text-[6.5rem] leading-none text-white sm:text-[9rem] md:text-[11rem] lg:text-[12.5rem]"
            aria-live="polite"
          >
            {formatTime(secondsLeft)}
          </p>

          <p className="mt-4 text-sm tracking-wide text-white/65 sm:mt-5 sm:text-base">
            {mode === 'focus' ? 'Concentration' : 'Repospiration'}
            {completedFocusSessions > 0 && (
              <span className="text-white/40">
                {' '}
                · {completedFocusSessions} session
                {completedFocusSessions !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        <div className="hidden w-[8.5rem] shrink-0 sm:block" aria-hidden />
      </div>

      <div className="mt-8 grid w-full max-w-[15rem] grid-cols-2 gap-3">
        <label className="block text-center">
          <span className="mb-1 block text-[0.65rem] font-medium tracking-wider text-white/50 uppercase">
            Étude
          </span>
          <input
            type="number"
            min={1}
            max={90}
            disabled={isRunning}
            value={config.focusMinutes}
            onChange={(e) =>
              onUpdateConfig({ focusMinutes: Number(e.target.value) || 1 })
            }
            className="w-full rounded-2xl border border-white/20 bg-white/12 px-3 py-2 text-center text-white outline-none transition focus:border-white/45 focus:bg-white/20 disabled:opacity-50"
          />
        </label>
        <label className="block text-center">
          <span className="mb-1 block text-[0.65rem] font-medium tracking-wider text-white/50 uppercase">
            Pause
          </span>
          <input
            type="number"
            min={1}
            max={90}
            disabled={isRunning}
            value={config.breakMinutes}
            onChange={(e) =>
              onUpdateConfig({ breakMinutes: Number(e.target.value) || 1 })
            }
            className="w-full rounded-2xl border border-white/20 bg-white/12 px-3 py-2 text-center text-white outline-none transition focus:border-white/45 focus:bg-white/20 disabled:opacity-50"
          />
        </label>
      </div>
    </section>
  );
}
