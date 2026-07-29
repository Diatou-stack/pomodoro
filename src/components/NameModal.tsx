import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';

interface NameModalProps {
  onSubmit: (name: string) => boolean;
}

export function NameModal({ onSubmit }: NameModalProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[rgba(30,58,95,0.28)] backdrop-blur-sm" />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="name-modal-title"
        className="glass-panel relative z-10 w-full max-w-sm rounded-[1.75rem] p-7 text-center sm:p-8"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="panel-label mb-3">Bienvenue</p>
        <h2
          id="name-modal-title"
          className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-3xl"
        >
          Comment tu t’appelles ?
        </h2>
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          On personnalisera ton espace focus.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ton prénom"
            maxLength={24}
            className="soft-field w-full rounded-2xl px-4 py-3.5 text-center text-lg font-semibold"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Continuer
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
