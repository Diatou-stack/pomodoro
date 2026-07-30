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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-3 short-land:px-6 short-land:py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Fond plein pour ne rien laisser apparaître derrière */}
      <div className="absolute inset-0 bg-[#e4f0fb]" />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="name-modal-title"
        className="glass-panel relative z-10 my-auto w-full max-w-sm rounded-[1.75rem] p-7 text-center sm:p-8 short-land:flex short-land:max-w-lg short-land:items-center short-land:gap-5 short-land:rounded-2xl short-land:p-4 short-land:text-left"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="short-land:min-w-0 short-land:flex-1">
          <p className="panel-label mb-3 short-land:mb-1">Bienvenue</p>
          <h2
            id="name-modal-title"
            className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-3xl short-land:mb-0.5 short-land:!text-xl"
          >
            Comment tu t’appelles ?
          </h2>
          <p className="mb-6 text-sm text-[var(--color-muted)] short-land:mb-0 short-land:hidden">
            On personnalisera ton espace focus.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 short-land:w-48 short-land:shrink-0 short-land:space-y-2"
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ton prénom"
            maxLength={24}
            className="soft-field w-full rounded-2xl px-4 py-3.5 text-center text-lg font-semibold short-land:rounded-xl short-land:py-2.5 short-land:!text-base"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 short-land:rounded-xl short-land:py-2.5 short-land:!text-sm"
          >
            Continuer
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
