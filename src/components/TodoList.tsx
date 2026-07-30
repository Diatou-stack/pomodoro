import { Check, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { cn } from '../lib/utils';
import type { TodoItem } from '../hooks/useTodos';

interface TodoListProps {
  todos: TodoItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClearDone: () => void;
}

export function TodoList({
  todos,
  onAdd,
  onToggle,
  onRemove,
  onClearDone,
}: TodoListProps) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    onAdd(value);
    setDraft('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const doneCount = todos.filter((t) => t.done).length;
  const progress = todos.length === 0 ? 0 : doneCount / todos.length;

  return (
    <aside className="glass-panel flex w-full max-h-[min(20rem,70dvh)] flex-col rounded-[1.35rem] p-3.5 shadow-lg">
      <form onSubmit={handleSubmit} className="mb-2.5 flex gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nouvelle tâche…"
          className="soft-field min-w-0 flex-1 rounded-xl px-3 py-2 text-sm"
          autoFocus
        />
        <button
          type="button"
          onClick={submit}
          className="soft-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl active:scale-95"
          aria-label="Ajouter"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {todos.length === 0 && (
          <li className="rounded-xl bg-white/40 px-3 py-5 text-center text-xs text-[var(--color-muted)]">
            Aucune tâche pour l’instant
          </li>
        )}

        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'group flex items-center gap-2 rounded-xl px-2 py-2 transition',
                todo.done
                  ? 'bg-sky-500/20 ring-1 ring-sky-400/35'
                  : 'bg-white/45 hover:bg-white/70',
              )}
            >
              <button
                type="button"
                onClick={() => onToggle(todo.id)}
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition',
                  todo.done
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/80 text-transparent hover:text-[var(--color-muted)]',
                )}
                aria-label={todo.done ? 'Marquer non fait' : 'Marquer fait'}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
              <span
                className={cn(
                  'min-w-0 flex-1 text-sm font-medium',
                  todo.done && 'line-through opacity-65',
                )}
              >
                {todo.text}
              </span>
              <button
                type="button"
                onClick={() => onRemove(todo.id)}
                className="text-[var(--color-muted)] opacity-70 transition hover:text-[var(--color-ink)] sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {todos.length > 0 && (
        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/40 pt-2.5">
          <button
            type="button"
            onClick={onClearDone}
            disabled={doneCount === 0}
            className="text-xs text-[var(--color-muted)] transition hover:text-[var(--color-ink)] disabled:opacity-40"
          >
            Effacer terminées
          </button>
          <span className="text-xs tabular-nums text-[var(--color-ink-soft)]">
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}
    </aside>
  );
}
