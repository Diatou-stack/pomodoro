import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CornerPanelProps {
  open: boolean;
  onToggle: () => void;
  label: string;
  icon: ReactNode;
  badge?: string | number | null;
  align?: 'left' | 'right';
  /** Icône seule (label au hover / focus / ouvert). */
  compact?: boolean;
  children: ReactNode;
}

export function CornerPanel({
  open,
  onToggle,
  label,
  icon,
  badge,
  align = 'left',
  compact = false,
  children,
}: CornerPanelProps) {
  return (
    <div className={cn('group relative', align === 'right' && 'flex flex-col items-end')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={label}
        title={label}
        className={cn(
          'corner-chip',
          compact && 'corner-chip-compact',
          open && 'bg-white/60 ring-1 ring-sky-400/30',
        )}
      >
        <span className="corner-chip-icon">{icon}</span>
        <span
          className={cn(
            'corner-chip-label',
            compact &&
              'max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-w-[6rem] group-hover:opacity-100 group-focus-within:max-w-[6rem] group-focus-within:opacity-100',
            compact && open && 'max-w-[6rem] opacity-100',
          )}
        >
          {label}
        </span>
        {badge != null && badge !== '' && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-ink)] px-1.5 text-[0.65rem] font-bold text-white">
            {badge}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-[calc(100%+0.5rem)] z-50 w-[min(16.5rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)]',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            <div className="w-full min-w-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
