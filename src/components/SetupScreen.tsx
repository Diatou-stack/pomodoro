import { Minus, Play, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import type { PomodoroConfig } from '../hooks/usePomodoro';

interface SetupScreenProps {
  config: PomodoroConfig;
  userName: string;
  onUpdateConfig: (partial: Partial<PomodoroConfig>) => void;
  onStart: () => void;
}

const FOCUS_PRESETS = [15, 25, 45];
const BREAK_PRESETS = [5, 10, 15];

function clamp(n: number, min = 1, max = 90) {
  return Math.min(max, Math.max(min, n));
}

function DurationControl({
  label,
  value,
  presets,
  onChange,
}: {
  label: string;
  value: number;
  presets: number[];
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3">
      <p className="text-sm font-semibold text-[var(--color-muted)]">{label}</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[var(--color-ink)] transition hover:bg-white active:scale-95"
          aria-label={`Diminuer ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>

        <p className="min-w-[4.5rem] text-center text-5xl font-extrabold tracking-tight text-[var(--color-ink)] tabular-nums">
          {value}
        </p>

        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[var(--color-ink)] transition hover:bg-white active:scale-95"
          aria-label={`Augmenter ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-semibold transition',
              value === preset
                ? 'bg-[var(--color-ink)] text-white'
                : 'text-[var(--color-muted)] hover:bg-white/50 hover:text-[var(--color-ink)]',
            )}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SetupScreen({
  config,
  userName,
  onUpdateConfig,
  onStart,
}: SetupScreenProps) {
  return (
    <section className="mx-auto w-full max-w-md text-center">
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-5xl">
        Bienvenue {userName}
      </h1>
      <p className="mb-10 text-base text-[var(--color-muted)]">
        Définis ton rythme, puis lance.
      </p>

      <div className="glass-panel mb-6 rounded-[1.75rem] px-5 py-8 sm:px-8">
        <div className="flex items-start gap-4 sm:gap-8">
          <DurationControl
            label="Étude"
            value={config.focusMinutes}
            presets={FOCUS_PRESETS}
            onChange={(focusMinutes) => onUpdateConfig({ focusMinutes })}
          />

          <div className="mt-8 h-16 w-px shrink-0 bg-[rgba(30,58,95,0.12)]" aria-hidden />

          <DurationControl
            label="Pause"
            value={config.breakMinutes}
            presets={BREAK_PRESETS}
            onChange={(breakMinutes) => onUpdateConfig({ breakMinutes })}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105 active:scale-[0.98]"
      >
        <Play className="h-5 w-5 fill-current" />
        Lancer
      </button>
    </section>
  );
}
