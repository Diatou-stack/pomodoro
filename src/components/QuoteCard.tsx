import { Quote as QuoteIcon, SkipForward } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Quote } from '../data/quotes';

interface QuoteCardProps {
  quote: Quote;
  quoteKey: number;
  onNext: () => void;
}

export function QuoteCard({ quote, quoteKey, onNext }: QuoteCardProps) {
  return (
    <section className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-rose-500/80">
          <QuoteIcon className="h-4 w-4" aria-hidden />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase">
            Inspiration
          </span>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 rounded-xl bg-white/45 px-3 py-1.5 text-xs font-medium text-rose-700/80 transition hover:bg-white/70 hover:text-rose-800 active:scale-95"
          aria-label="Citation suivante"
        >
          Suivante
          <SkipForward className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative min-h-[7.5rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={quoteKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="space-y-3"
          >
            <p className="font-display text-lg leading-relaxed text-rose-900/85 sm:text-xl">
              « {quote.text} »
            </p>
            <footer className="text-sm text-rose-500/75">— {quote.author}</footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <p className="mt-4 text-[0.7rem] tracking-wide text-rose-400/60">
        Nouvelle citation toutes les 10 secondes
      </p>
    </section>
  );
}
