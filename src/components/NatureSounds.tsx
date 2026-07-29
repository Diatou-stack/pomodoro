import { CloudRain, Trees, Volume2, Waves, Wind } from 'lucide-react';
import { cn } from '../lib/utils';
import { NATURE_SOUNDS, type SoundId } from '../data/sounds';

const ICONS: Record<SoundId, typeof CloudRain> = {
  rain: CloudRain,
  waves: Waves,
  wind: Wind,
  forest: Trees,
};

interface NatureSoundsProps {
  activeIds: Set<SoundId>;
  volume: number;
  error?: string | null;
  onVolumeChange: (v: number) => void;
  onToggle: (id: SoundId) => void;
}

export function NatureSounds({
  activeIds,
  volume,
  error,
  onVolumeChange,
  onToggle,
}: NatureSoundsProps) {
  return (
    <aside className="glass-panel flex flex-col rounded-[1.35rem] p-3.5 shadow-lg">
      <div className="flex flex-col gap-1.5">
        {NATURE_SOUNDS.map((sound) => {
          const Icon = ICONS[sound.id];
          const isActive = activeIds.has(sound.id);

          return (
            <button
              key={sound.id}
              type="button"
              onClick={() => onToggle(sound.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all duration-250',
                isActive
                  ? 'bg-sky-500/20 text-[var(--color-ink)] ring-1 ring-sky-400/35'
                  : 'bg-white/40 text-[var(--color-ink-soft)] hover:bg-white/65',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/70 text-[var(--color-muted)]',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight">
                  {sound.label}
                </span>
                <span className="block truncate text-xs text-[var(--color-muted)]">
                  {sound.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-white/40 px-0.5 pt-3">
        <Volume2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="volume-slider w-full"
          aria-label="Volume global"
        />
      </div>

      {error && (
        <p className="mt-2 px-0.5 text-xs leading-snug text-rose-600/90">{error}</p>
      )}
    </aside>
  );
}
