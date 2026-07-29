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
  children: ReactNode;
}

export function CornerPanel({
  open,
  onToggle,
  label,
  icon,
  badge,
  align = 'left',
  children,
}: CornerPanelProps) {
  return (
    <div className={cn('relative', align === 'right' && 'flex flex-col items-end')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          'corner-chip',
          open && 'bg-white/60 ring-1 ring-sky-400/30',
        )}
      >
        <span className="corner-chip-icon">{icon}</span>
        <span className="corner-chip-label">{label}</span>
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
              'absolute top-[calc(100%+0.5rem)] z-50 w-[16.5rem]',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
