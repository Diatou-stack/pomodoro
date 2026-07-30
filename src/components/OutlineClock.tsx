import type { ReactNode } from 'react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { formatTime, type TimerMode } from '../hooks/usePomodoro';

interface OutlineClockProps {
  secondsLeft: number;
  mode: TimerMode;
  isRunning: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function OutlineClock({
  secondsLeft,
  mode,
  isRunning,
  onTogglePause,
  onReset,
  onSkip,
}: OutlineClockProps) {
  const phaseLabel = mode === 'focus' ? 'Étude' : 'Pause';

  return (
    <section className="group flex w-full flex-col items-center">
      <p
        className="mb-3 text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-muted)] sm:mb-4 sm:text-sm"
        aria-live="polite"
      >
        {phaseLabel}
      </p>

      <button
        type="button"
        onClick={onTogglePause}
        className="outline-clock cursor-pointer text-[8rem] leading-[0.85] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:opacity-90 sm:text-[11rem] md:text-[14rem] lg:text-[16rem]"
        aria-live="polite"
        aria-label={isRunning ? 'Mettre en pause' : 'Reprendre'}
        title={isRunning ? 'Cliquer pour pause' : 'Cliquer pour reprendre'}
      >
        {formatTime(secondsLeft)}
      </button>

      <div
        className="mt-5 flex items-center gap-2 opacity-100 transition-opacity duration-300 sm:mt-6 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        role="group"
        aria-label="Contrôles du timer"
      >
        <ControlButton
          label={isRunning ? 'Pause' : 'Reprendre'}
          onClick={onTogglePause}
        >
          {isRunning ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </ControlButton>

        <ControlButton label="Passer" onClick={onSkip}>
          <SkipForward className="h-4 w-4" />
        </ControlButton>

        <ControlButton label="Réinitialiser" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </ControlButton>
      </div>
    </section>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[rgba(255,255,255,0.45)] text-[var(--color-ink-soft)] shadow-[var(--glass-shadow)] backdrop-blur-md transition hover:bg-[rgba(255,255,255,0.7)] active:scale-95"
    >
      {children}
    </button>
  );
}
