import { motion } from 'motion/react';
import { CloudDecor } from './components/CloudDecor';
import { NatureSounds } from './components/NatureSounds';
import { PomodoroTimer } from './components/PomodoroTimer';
import { QuoteCard } from './components/QuoteCard';
import { usePomodoro } from './hooks/usePomodoro';
import { useQuoteRotation } from './hooks/useQuoteRotation';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function App() {
  const pomodoro = usePomodoro({ focusMinutes: 25, breakMinutes: 5 });
  const { quote, quoteKey, goNext } = useQuoteRotation(10_000);

  return (
    <div className="app-shell relative min-h-screen overflow-hidden">
      <CloudDecor />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-4 py-10 sm:py-14">
        <motion.header
          className="mb-10 text-center"
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-rose-400/90 uppercase">
            Focus doux
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-rose-900/90 sm:text-5xl">
            Nuage Pomodoro
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-rose-600/75 sm:text-base">
            Un espace apaisant pour apprendre, respirer et rester concentré.
          </p>
        </motion.header>

        <div className="flex w-full flex-col items-center gap-5">
          <motion.div
            className="w-full"
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
          >
            <PomodoroTimer
              config={pomodoro.config}
              mode={pomodoro.mode}
              secondsLeft={pomodoro.secondsLeft}
              isRunning={pomodoro.isRunning}
              progress={pomodoro.progress}
              completedFocusSessions={pomodoro.completedFocusSessions}
              onStart={pomodoro.start}
              onPause={pomodoro.pause}
              onReset={pomodoro.reset}
              onSwitchMode={pomodoro.switchMode}
              onUpdateConfig={pomodoro.updateConfig}
            />
          </motion.div>

          <motion.div
            className="w-full"
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
          >
            <QuoteCard quote={quote} quoteKey={quoteKey} onNext={goNext} />
          </motion.div>

          <motion.div
            className="w-full"
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
          >
            <NatureSounds />
          </motion.div>
        </div>

        <footer className="mt-12 text-center text-xs text-rose-400/55">
          Cycles configurables · citations · sons de nature
        </footer>
      </main>
    </div>
  );
}
