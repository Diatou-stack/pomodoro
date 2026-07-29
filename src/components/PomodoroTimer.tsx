import { Pause, Play, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
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
  progress: number;
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
  progress,
  completedFocusSessions,
  onStart,
  onPause,
  onReset,
  onSwitchMode,
  onUpdateConfig,
}: PomodoroTimerProps) {
  const size = 260;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <section className="glass-card w-full max-w-lg rounded-3xl p-8 sm:p-10">
      <div className="mb-8 flex justify-center gap-2">
        {(['focus', 'break'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSwitchMode(m)}
            className={cn(
              'rounded-2xl px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300',
              mode === m
                ? 'bg-rose-400/90 text-white shadow-soft scale-[1.02]'
                : 'bg-white/40 text-rose-700/70 hover:bg-white/60',
            )}
          >
            {m === 'focus' ? 'Étude' : 'Pause'}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mb-8 flex h-[260px] w-[260px] items-center justify-center">
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="100%" stopColor="#e879a9" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 text-center">
          <p className="mb-1 font-display text-sm font-medium tracking-widest text-rose-400/80 uppercase">
            {mode === 'focus' ? 'Concentration' : 'Repospiration'}
          </p>
          <p
            className="font-display text-6xl font-semibold tracking-tight text-rose-900/90 tabular-nums sm:text-7xl"
            aria-live="polite"
          >
            {formatTime(secondsLeft)}
          </p>
          <p className="mt-2 text-xs text-rose-500/70">
            {completedFocusSessions} session
            {completedFocusSessions !== 1 ? 's' : ''} terminée
            {completedFocusSessions !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50 text-rose-600 shadow-soft transition hover:bg-white/80 hover:scale-105 active:scale-95"
          aria-label="Réinitialiser"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={isRunning ? onPause : onStart}
          className="flex h-14 min-w-[9.5rem] items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 px-6 text-base font-semibold text-white shadow-glow transition hover:brightness-105 hover:scale-[1.03] active:scale-95"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 fill-current" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current" />
              Démarrer
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-rose-600/70 uppercase">
            Étude (min)
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
            className="w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-2.5 text-center text-rose-900 outline-none transition focus:border-rose-300 focus:bg-white/70 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-rose-600/70 uppercase">
            Pause (min)
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
            className="w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-2.5 text-center text-rose-900 outline-none transition focus:border-rose-300 focus:bg-white/70 disabled:opacity-50"
          />
        </label>
      </div>
    </section>
  );
}
