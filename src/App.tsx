import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ListTodo, LogOut } from 'lucide-react';
import { CornerPanel } from './components/CornerPanel';
import { CountdownScreen } from './components/CountdownScreen';
import { NameModal } from './components/NameModal';
import { OutlineClock } from './components/OutlineClock';
import { QuoteCard } from './components/QuoteCard';
import { SetupScreen } from './components/SetupScreen';
import { TodoList } from './components/TodoList';
import { usePomodoro } from './hooks/usePomodoro';
import { usePreCountdown } from './hooks/usePreCountdown';
import { useQuoteRotation } from './hooks/useQuoteRotation';
import { useTodos } from './hooks/useTodos';
import { useUserName } from './hooks/useUserName';

type Phase = 'setup' | 'countdown' | 'session';

export default function App() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [todoOpen, setTodoOpen] = useState(false);
  const pomodoro = usePomodoro({ focusMinutes: 25, breakMinutes: 5 });
  const { quote, quoteKey, goNext } = useQuoteRotation(10_000);
  const todos = useTodos();
  const { askName, saveName } = useUserName();

  const handleCountdownDone = useCallback(() => {
    pomodoro.beginSession();
    setPhase('session');
  }, [pomodoro.beginSession]);

  const countdownValue = usePreCountdown(5, phase === 'countdown', handleCountdownDone);

  const startFromSetup = () => {
    pomodoro.pause();
    setTodoOpen(false);
    setPhase('countdown');
  };

  const backToSetup = () => {
    pomodoro.pause();
    setTodoOpen(false);
    setPhase('setup');
  };

  // Ferme le panneau to-do hors session
  useEffect(() => {
    if (phase !== 'session' && todoOpen) {
      setTodoOpen(false);
    }
  }, [phase, todoOpen]);

  useEffect(() => {
    if (!todoOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTodoOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [todoOpen]);

  const remainingTodos = todos.todos.filter((t) => !t.done).length;

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

      {/* L’app ne s’affiche qu’après le prénom — évite « Bienvenue … » derrière la popup */}
      {!askName && (
        <>
          <AnimatePresence>
            {todoOpen && (
              <motion.button
                type="button"
                aria-label="Fermer le panneau"
                className="fixed inset-0 z-30 cursor-default bg-[rgba(30,58,95,0.08)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setTodoOpen(false)}
              />
            )}
          </AnimatePresence>

          {phase === 'session' && (
            <div className="safe-corners absolute top-3 left-3 z-40 flex max-w-[calc(100vw-1.5rem)] flex-col items-start gap-2 sm:top-6 sm:left-6 sm:gap-2.5 short-land:top-2 short-land:left-2">
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
                open={todoOpen}
                onToggle={() => setTodoOpen((o) => !o)}
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
          )}

          <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-4 py-12 short-land:min-h-0 short-land:h-full short-land:max-w-none short-land:px-[max(4.5rem,env(safe-area-inset-left))] short-land:pr-[max(1rem,env(safe-area-inset-right))] short-land:py-2 sm:py-16">
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
        </>
      )}
    </div>
  );
}
