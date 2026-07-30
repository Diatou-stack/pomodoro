import { AnimatePresence, motion } from 'motion/react';
import type { Quote } from '../data/quotes';

interface QuoteCardProps {
  quote: Quote;
  quoteKey: number;
  onNext: () => void;
}

export function QuoteCard({ quote, quoteKey, onNext }: QuoteCardProps) {
  return (
    <div className="relative w-full max-w-xl overflow-hidden short-land:max-w-none">
      <AnimatePresence initial={false} mode="wait">
        <motion.section
          key={quoteKey}
          className="glass-panel relative w-full cursor-pointer rounded-[1.35rem] px-8 py-7 sm:px-10 sm:py-8 short-land:rounded-xl short-land:px-4 short-land:py-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
          <blockquote className="space-y-3 short-land:space-y-1">
            <p className="text-lg leading-relaxed font-medium text-[var(--color-ink)] sm:text-xl short-land:!text-[0.8125rem] short-land:leading-snug short-land:line-clamp-3">
              « {quote.text} »
            </p>
            <footer className="text-sm font-medium text-[var(--color-muted)] sm:text-base short-land:!text-[0.7rem]">
              — {quote.author}
            </footer>
          </blockquote>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
