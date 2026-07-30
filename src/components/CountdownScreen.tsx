import { motion } from 'motion/react';

interface CountdownScreenProps {
  value: number;
}

export function CountdownScreen({ value }: CountdownScreenProps) {
  return (
    <div className="flex min-h-[50dvh] w-full flex-col items-center justify-center text-center short-land:min-h-0 short-land:py-1">
      <p className="mb-4 text-xl font-semibold tracking-[0.2em] text-[var(--color-ink-soft)] uppercase sm:mb-8 sm:text-3xl short-land:mb-1 short-land:!text-base">
        Prépare-toi
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="timer-digits text-[clamp(4.5rem,min(28vw,42vh),22rem)] leading-[0.85]"
      >
        {value > 0 ? value : ''}
      </motion.p>
    </div>
  );
}
