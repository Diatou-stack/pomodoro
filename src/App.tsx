import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ListTodo, LogOut, Volume2 } from 'lucide-react';
import { CornerPanel } from './components/CornerPanel';
import { CountdownScreen } from './components/CountdownScreen';
import { NameModal } from './components/NameModal';
import { NatureSounds } from './components/NatureSounds';
import { OutlineClock } from './components/OutlineClock';
import { QuoteCard } from './components/QuoteCard';
import { SetupScreen } from './components/SetupScreen';
import { TodoList } from './components/TodoList';
import { useNatureAudio } from './hooks/useNatureAudio';
import { usePomodoro } from './hooks/usePomodoro';
import { usePreCountdown } from './hooks/usePreCountdown';
import { useQuoteRotation } from './hooks/useQuoteRotation';
import { useTodos } from './hooks/useTodos';
import { useUserName } from './hooks/useUserName';

type Phase = 'setup' | 'countdown' | 'session';
type PanelId = 'todo' | 'sounds' | null;

export default function App() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [openPanel, setOpenPanel] = useState<PanelId>(null);
  const pomodoro = usePomodoro({ focusMinutes: 25, breakMinutes: 5 });
  const { quote, quoteKey, goNext } = useQuoteRotation(10_000);
  const todos = useTodos();
  const { name, askName, saveName } = useUserName();
  const { activeIds, volume, setVolume, toggleSound, error } = useNatureAudio();

  const handleCountdownDone = useCallback(() => {
    pomodoro.beginSession();
    setPhase('session');
  }, [pomodoro.beginSession]);

  const countdownValue = usePreCountdown(5, phase === 'countdown', handleCountdownDone);

  const startFromSetup = () => {
    pomodoro.pause();
    setOpenPanel(null);
    setPhase('countdown');
  };

  const backToSetup = () => {
    pomodoro.pause();
    setOpenPanel(null);
    setPhase('setup');
  };

  const togglePanel = (id: Exclude<PanelId, null>) => {
    setOpenPanel((prev) => (prev === id ? null : id));
  };

  // Ferme le panneau ouvert au clic extérieur / Escape ; ferme aussi hors session
  useEffect(() => {
    if (phase !== 'session' && openPanel) {
      setOpenPanel(null);
    }
  }, [phase, openPanel]);

  useEffect(() => {
    if (!openPanel) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPanel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openPanel]);

  const remainingTodos = todos.todos.filter((t) => !t.done).length;
  const activeSounds = activeIds.size;

  const shellMode =
    phase === 'session' ? (pomodoro.mode === 'break' ? 'break' : 'focus') : 'idle';

  return (
    <div
      className="app-shell relative min-h-dvh overflow-x-hidden overflow-y-auto short-land:h-dvh short-land:max-h-dvh short-land:overflow-y-auto"
      data-mode={shellMode}
    >
      <AnimatePresence>
        {askName && <NameModal key="name-modal" onSubmit={saveName} />}
      </AnimatePresence>

      {/* Overlay léger quand un panneau est ouvert */}
      <AnimatePresence>
        {openPanel && (
          <motion.button
            type="button"
            aria-label="Fermer le panneau"
            className="fixed inset-0 z-30 cursor-default bg-[rgba(30,58,95,0.08)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenPanel(null)}
          />
        )}
      </AnimatePresence>

      {phase === 'session' && (
        <>
          <div className="safe-corners absolute top-3 left-3 z-40 flex flex-row items-center gap-2 sm:top-6 sm:left-6 sm:flex-col sm:items-start sm:gap-2.5 short-land:top-2 short-land:left-2 short-land:!flex-row">
            <button
              type="button"
              onClick={backToSetup}
              className="corner-chip"
              aria-label="Fin de session"
              title="Fin de session — retour au setup"
            >
              <span className="corner-chip-icon">
                <LogOut className="h-4 w-4" />
              </span>
              <span className="corner-chip-label">Fin de session</span>
            </button>

            <CornerPanel
              open={openPanel === 'todo'}
              onToggle={() => togglePanel('todo')}
              label="To do"
              icon={<ListTodo className="h-4 w-4" />}
              badge={remainingTodos > 0 ? remainingTodos : null}
              align="left"
            >
              <TodoList
                todos={todos.todos}
                onAdd={todos.addTodo}
                onToggle={todos.toggleTodo}
                onRemove={todos.removeTodo}
                onClearDone={todos.clearDone}
              />
            </CornerPanel>
          </div>

          <div className="safe-corners-right absolute top-3 right-3 z-40 sm:top-6 sm:right-6 short-land:top-2 short-land:right-2">
            <CornerPanel
              open={openPanel === 'sounds'}
              onToggle={() => togglePanel('sounds')}
              label="Sons"
              icon={<Volume2 className="h-4 w-4" />}
              badge={activeSounds > 0 ? activeSounds : null}
              align="right"
            >
              <NatureSounds
                activeIds={activeIds}
                volume={volume}
                error={error}
                onVolumeChange={setVolume}
                onToggle={(id) => void toggleSound(id)}
              />
            </CornerPanel>
          </div>
        </>
      )}

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-4 py-12 short-land:min-h-0 short-land:h-full short-land:max-w-none short-land:px-[max(4.5rem,env(safe-area-inset-left))] short-land:pr-[max(4.5rem,env(safe-area-inset-right))] short-land:py-2 sm:py-16">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div
              key="setup"
              className="w-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <SetupScreen
                config={pomodoro.config}
                userName={name || 'toi'}
                onUpdateConfig={pomodoro.updateConfig}
                onStart={startFromSetup}
              />
            </motion.div>
          )}

          {phase === 'countdown' && (
            <motion.div
              key="countdown"
              className="flex w-full items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CountdownScreen value={countdownValue} />
            </motion.div>
          )}

          {phase === 'session' && (
            <motion.div
              key="session"
              className="flex w-full flex-col items-center short-land:flex-row short-land:items-center short-land:justify-center short-land:gap-6"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <OutlineClock
                secondsLeft={pomodoro.secondsLeft}
                mode={pomodoro.mode}
                isRunning={pomodoro.isRunning}
                onTogglePause={() =>
                  pomodoro.isRunning ? pomodoro.pause() : pomodoro.start()
                }
                onReset={pomodoro.reset}
                onSkip={pomodoro.skip}
              />

              <div className="mt-6 flex w-full justify-center sm:mt-8 short-land:mt-0 short-land:max-w-xs short-land:shrink short-land:min-w-0">
                <QuoteCard quote={quote} quoteKey={quoteKey} onNext={goNext} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
