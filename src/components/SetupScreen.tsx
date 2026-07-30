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
  emphasis = 'primary',
}: {
  label: string;
  value: number;
  presets: number[];
  onChange: (n: number) => void;
  emphasis?: 'primary' | 'secondary';
}) {
  const isPrimary = emphasis === 'primary';

  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center gap-3 short-land:gap-1.5',
        !isPrimary && 'opacity-80',
      )}
    >
      <p className="text-sm font-semibold text-[var(--color-ink-soft)] short-land:text-xs">
        {label}
      </p>

      <div className="flex items-center gap-2.5 sm:gap-3 short-land:gap-1.5">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(30,58,95,0.14)] bg-white/70 text-[var(--color-ink)] transition hover:border-[rgba(30,58,95,0.28)] hover:bg-white hover:shadow-sm active:scale-95 short-land:h-8 short-land:w-8"
          aria-label={`Diminuer ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="flex min-w-[4.5rem] flex-col items-center short-land:min-w-[3.25rem]">
          <p
            className={cn(
              'text-center font-extrabold tracking-tight text-[var(--color-ink)] tabular-nums',
              isPrimary
                ? 'text-5xl sm:text-6xl short-land:!text-[2.35rem]'
                : 'text-4xl sm:text-5xl short-land:!text-[2rem]',
            )}
          >
            {value}
          </p>
          <span className="mt-0.5 text-xs font-semibold tracking-wide text-[var(--color-ink-soft)] short-land:text-[0.65rem]">
            min
          </span>
        </div>

        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(30,58,95,0.14)] bg-white/70 text-[var(--color-ink)] transition hover:border-[rgba(30,58,95,0.28)] hover:bg-white hover:shadow-sm active:scale-95 short-land:h-8 short-land:w-8"
          aria-label={`Augmenter ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 short-land:gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={cn(
              'flex min-h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition short-land:min-h-7 short-land:min-w-7 short-land:px-2 short-land:text-xs',
              value === preset
                ? 'bg-[var(--color-ink)] text-white'
                : 'text-[var(--color-ink-soft)] hover:bg-white/55 hover:text-[var(--color-ink)]',
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
    <section className="mx-auto w-full max-w-md text-center short-land:flex short-land:max-w-3xl short-land:items-center short-land:gap-6 short-land:text-left">
      <header className="short-land:w-[11.5rem] short-land:shrink-0">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-5xl short-land:mb-1 short-land:!text-2xl">
          Bienvenue {userName}
        </h1>
        <p className="mb-10 text-base text-[var(--color-ink-soft)] short-land:mb-0 short-land:!text-sm">
          Définis ton rythme, puis lance.
        </p>
      </header>

      <div className="short-land:min-w-0 short-land:flex-1">
        <div className="glass-panel mb-6 rounded-[1.75rem] px-5 py-8 sm:px-8 short-land:mb-2.5 short-land:rounded-2xl short-land:px-4 short-land:py-3">
          <div className="flex items-start gap-3 sm:gap-6 short-land:gap-4">
            <DurationControl
              label="Étude"
              value={config.focusMinutes}
              presets={FOCUS_PRESETS}
              onChange={(focusMinutes) => onUpdateConfig({ focusMinutes })}
              emphasis="primary"
            />

            <div
              className="mt-10 h-14 w-px shrink-0 bg-[rgba(30,58,95,0.12)] short-land:mt-6 short-land:h-10"
              aria-hidden
            />

            <DurationControl
              label="Pause"
              value={config.breakMinutes}
              presets={BREAK_PRESETS}
              onChange={(breakMinutes) => onUpdateConfig({ breakMinutes })}
              emphasis="secondary"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105 active:scale-[0.98] short-land:py-2.5 short-land:text-sm"
        >
          <Play className="h-5 w-5 fill-current short-land:h-4 short-land:w-4" />
          Lancer
        </button>

        <p className="mt-3 text-sm font-medium text-[var(--color-ink-soft)] short-land:mt-1.5 short-land:text-center short-land:!text-xs">
          {config.focusMinutes} min d’étude · {config.breakMinutes} min de pause
        </p>
      </div>
    </section>
  );
}
