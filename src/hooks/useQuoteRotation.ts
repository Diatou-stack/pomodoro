import { useCallback, useEffect, useState } from 'react';
import { QUOTES, type Quote } from '../data/quotes';

const ROTATION_MS = 10_000;

function nextIndex(current: number, length: number): number {
  return (current + 1) % length;
}

export function useQuoteRotation(intervalMs = ROTATION_MS) {
  const [index, setIndex] = useState(0);
  const [quoteKey, setQuoteKey] = useState(0);
  /** Incrémente pour relancer l'intervalle après un passage manuel. */
  const [rotationEpoch, setRotationEpoch] = useState(0);

  const quote: Quote = QUOTES[index] ?? QUOTES[0];

  const advance = useCallback(() => {
    setIndex((i) => nextIndex(i, QUOTES.length));
    setQuoteKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    advance();
    setRotationEpoch((e) => e + 1);
  }, [advance]);

  useEffect(() => {
    const id = setInterval(advance, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, advance, rotationEpoch]);

  return { quote, quoteKey, goNext, total: QUOTES.length };
}
