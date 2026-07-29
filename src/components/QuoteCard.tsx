import { AnimatePresence, motion } from 'motion/react';
import type { Quote } from '../data/quotes';

interface QuoteCardProps {
  quote: Quote;
  quoteKey: number;
  onNext: () => void;
}

export function QuoteCard({ quote, quoteKey, onNext }: QuoteCardProps) {
  return (
    <div className="relative w-full max-w-xl overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.section
          key={quoteKey}
          className="glass-panel relative w-full cursor-pointer rounded-[1.35rem] px-8 py-7 sm:px-10 sm:py-8"
          initial={{ opacity: 0.7, x: '105%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.7, x: '-105%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={onNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNext();
            }
          }}
          aria-label="Citation suivante"
        >
          <blockquote className="space-y-3">
            <p className="text-lg leading-relaxed font-medium text-[var(--color-ink)] sm:text-xl">
              « {quote.text} »
            </p>
            <footer className="text-sm font-medium text-[var(--color-muted)] sm:text-base">
              — {quote.author}
            </footer>
          </blockquote>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
