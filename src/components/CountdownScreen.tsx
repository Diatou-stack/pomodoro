import { motion } from 'motion/react';

interface CountdownScreenProps {
  value: number;
}

export function CountdownScreen({ value }: CountdownScreenProps) {
  return (
    <div className="flex min-h-[55vh] w-full flex-col items-center justify-center text-center">
      <p className="mb-6 text-2xl font-semibold tracking-[0.2em] text-[var(--color-ink-soft)] uppercase sm:mb-8 sm:text-3xl md:text-4xl">
        Prépare-toi
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="timer-digits text-[14rem] leading-[0.85] sm:text-[18rem] md:text-[22rem]"
      >
        {value > 0 ? value : ''}
      </motion.p>
    </div>
  );
}
