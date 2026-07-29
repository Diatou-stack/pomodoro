import { useCallback, useEffect, useRef, useState } from 'react';
import type { SoundId } from '../data/sounds';

type SoundNodes = {
  stop: () => void;
};

function createNoiseBuffer(ctx: AudioContext, seconds: number, color: 'white' | 'pink' | 'brown'): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let last = 0;
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;

      if (color === 'white') {
        data[i] = white;
      } else if (color === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        data[i] = (b0 + b1 + b2 + white * 0.3) * 0.25;
      } else {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    }
  }

  return buffer;
}

function startLoop(
  ctx: AudioContext,
  master: GainNode,
  opts: {
    color: 'white' | 'pink' | 'brown';
    filterType: BiquadFilterType;
    frequency: number;
    q?: number;
    gain: number;
    seconds?: number;
    lfoHz?: number;
    lfoDepth?: number;
  },
): SoundNodes {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(master);

  const now = ctx.currentTime;
  gain.gain.linearRampToValueAtTime(opts.gain, now + 0.4);

  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, opts.seconds ?? 3, opts.color);
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = opts.filterType;
  filter.frequency.value = opts.frequency;
  if (opts.q != null) filter.Q.value = opts.q;

  source.connect(filter);
  filter.connect(gain);
  source.start();

  let lfo: OscillatorNode | null = null;
  let lfoGain: GainNode | null = null;

  if (opts.lfoHz && opts.lfoDepth) {
    lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = opts.lfoHz;
    lfoGain = ctx.createGain();
    lfoGain.gain.value = opts.lfoDepth;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();
  }

  return {
    stop: () => {
      const t = ctx.currentTime;
      try {
        lfoGain?.disconnect();
        lfo?.stop();
      } catch {
        /* ignore */
      }
      try {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t);
        gain.gain.linearRampToValueAtTime(0.0001, t + 0.25);
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        try {
          source.stop();
        } catch {
          /* already stopped */
        }
        source.disconnect();
        filter.disconnect();
        lfo?.disconnect();
        gain.disconnect();
      }, 280);
    },
  };
}

function startRain(ctx: AudioContext, master: GainNode): SoundNodes {
  return startLoop(ctx, master, {
    color: 'pink',
    filterType: 'highpass',
    frequency: 400,
    q: 0.5,
    gain: 0.35,
    seconds: 2.5,
  });
}

function startWaves(ctx: AudioContext, master: GainNode): SoundNodes {
  return startLoop(ctx, master, {
    color: 'brown',
    filterType: 'lowpass',
    frequency: 380,
    gain: 0.42,
    seconds: 4,
    lfoHz: 0.11,
    lfoDepth: 0.18,
  });
}

function startWind(ctx: AudioContext, master: GainNode): SoundNodes {
  return startLoop(ctx, master, {
    color: 'pink',
    filterType: 'bandpass',
    frequency: 700,
    q: 0.7,
    gain: 0.32,
    seconds: 3,
    lfoHz: 0.07,
    lfoDepth: 0.12,
  });
}

function startForest(ctx: AudioContext, master: GainNode): SoundNodes {
  const bed = startLoop(ctx, master, {
    color: 'brown',
    filterType: 'lowpass',
    frequency: 450,
    gain: 0.22,
    seconds: 3,
  });

  const chirpGain = ctx.createGain();
  chirpGain.gain.value = 0.7;
  chirpGain.connect(master);

  let alive = true;
  const timers: number[] = [];

  const scheduleChirp = () => {
    if (!alive) return;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const freq = 1600 + Math.random() * 1600;
    const t = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, t + 0.14);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.025);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.connect(g);
    g.connect(chirpGain);
    osc.start(t);
    osc.stop(t + 0.25);

    timers.push(window.setTimeout(scheduleChirp, 700 + Math.random() * 2600));
  };

  timers.push(window.setTimeout(scheduleChirp, 350));

  return {
    stop: () => {
      alive = false;
      timers.forEach(clearTimeout);
      bed.stop();
      window.setTimeout(() => chirpGain.disconnect(), 300);
    },
  };
}

const STARTERS: Record<SoundId, (ctx: AudioContext, master: GainNode) => SoundNodes> = {
  rain: startRain,
  waves: startWaves,
  wind: startWind,
  forest: startForest,
};

export function useNatureAudio() {
  const [activeIds, setActiveIds] = useState<Set<SoundId>>(new Set());
  const [volume, setVolume] = useState(0.65);
  const [error, setError] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Partial<Record<SoundId, SoundNodes>>>({});
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const ensureContext = useCallback(async () => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AC();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = volumeRef.current;
      masterRef.current.connect(ctxRef.current.destination);
    }

    if (ctxRef.current.state === 'suspended') {
      await ctxRef.current.resume();
    }

    return ctxRef.current;
  }, []);

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.setTargetAtTime(volume, masterRef.current.context.currentTime, 0.05);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      (Object.keys(nodesRef.current) as SoundId[]).forEach((id) => {
        nodesRef.current[id]?.stop();
      });
      nodesRef.current = {};
      // Ne pas fermer le contexte trop tôt (StrictMode) — juste couper les nœuds.
    };
  }, []);

  const toggleSound = useCallback(async (id: SoundId) => {
    try {
      const ctx = await ensureContext();
      const master = masterRef.current;
      if (!master) return;

      if (nodesRef.current[id]) {
        nodesRef.current[id]?.stop();
        delete nodesRef.current[id];
        setActiveIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setError(null);
        return;
      }

      nodesRef.current[id] = STARTERS[id](ctx, master);
      setActiveIds((prev) => new Set(prev).add(id));
      setError(null);
    } catch {
      setError('Audio indisponible — cliquez à nouveau');
    }
  }, [ensureContext]);

  return { activeIds, volume, setVolume, toggleSound, error };
}
