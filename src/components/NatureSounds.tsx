import { useEffect, useRef, useState } from 'react';
import { CloudRain, Leaf, Pause, Play, Trees, Volume2, Waves, Wind } from 'lucide-react';
import { cn } from '../lib/utils';
import { NATURE_SOUNDS, type SoundId } from '../data/sounds';

const ICONS: Record<SoundId, typeof CloudRain> = {
  rain: CloudRain,
  waves: Waves,
  wind: Wind,
  forest: Trees,
};

export function NatureSounds() {
  const [activeIds, setActiveIds] = useState<Set<SoundId>>(new Set());
  const [volume, setVolume] = useState(0.45);
  const [errorId, setErrorId] = useState<SoundId | null>(null);
  const audioRefs = useRef<Partial<Record<SoundId, HTMLAudioElement>>>({});

  useEffect(() => {
    for (const audio of Object.values(audioRefs.current)) {
      if (audio) audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      for (const audio of Object.values(audioRefs.current)) {
        audio?.pause();
      }
    };
  }, []);

  const setAudioRef = (id: SoundId, el: HTMLAudioElement | null) => {
    if (el) {
      audioRefs.current[id] = el;
      el.volume = volume;
    } else {
      delete audioRefs.current[id];
    }
  };

  const toggleSound = async (id: SoundId) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (activeIds.has(id)) {
      audio.pause();
      setActiveIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }

    try {
      audio.volume = volume;
      await audio.play();
      setActiveIds((prev) => new Set(prev).add(id));
      setErrorId(null);
    } catch {
      setErrorId(id);
    }
  };

  return (
    <section className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-2 text-rose-500/80">
        <Leaf className="h-4 w-4" aria-hidden />
        <span className="text-xs font-semibold tracking-[0.18em] uppercase">
          Ambiance sonore
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {NATURE_SOUNDS.map((sound) => {
          const Icon = ICONS[sound.id];
          const isActive = activeIds.has(sound.id);

          return (
            <button
              key={sound.id}
              type="button"
              onClick={() => void toggleSound(sound.id)}
              className={cn(
                'group flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-300',
                isActive
                  ? 'border-rose-300/80 bg-rose-200/50 shadow-soft scale-[1.01]'
                  : 'border-white/40 bg-white/35 hover:bg-white/55 hover:border-rose-200/60',
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl transition',
                    isActive
                      ? 'bg-rose-400 text-white'
                      : 'bg-white/60 text-rose-500 group-hover:bg-white',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {isActive ? (
                  <Pause className="h-4 w-4 text-rose-600" />
                ) : (
                  <Play className="h-4 w-4 text-rose-400/70" />
                )}
              </div>
              <div>
                <p className="font-semibold text-rose-900/85">{sound.label}</p>
                <p className="text-xs text-rose-500/65">{sound.description}</p>
              </div>
              {errorId === sound.id && (
                <p className="text-[0.65rem] text-rose-600/80">
                  Lecture bloquée — réessayez
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Volume2 className="h-4 w-4 shrink-0 text-rose-400" aria-hidden />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider w-full"
          aria-label="Volume global"
        />
        <span className="w-9 text-right text-xs tabular-nums text-rose-500/70">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {NATURE_SOUNDS.map((sound) => (
        <audio
          key={sound.id}
          ref={(el) => setAudioRef(sound.id, el)}
          src={sound.src}
          loop
          preload="none"
        />
      ))}
    </section>
  );
}
