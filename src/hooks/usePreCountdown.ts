import { useEffect, useRef, useState } from 'react';

/** Compte à rebours N → 1, puis appelle onDone une seule fois. */
export function usePreCountdown(
  seconds: number,
  active: boolean,
  onDone: () => void,
) {
  const [value, setValue] = useState(seconds);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setValue(seconds);
      finishedRef.current = false;
      return;
    }

    finishedRef.current = false;
    setValue(seconds);

    const id = setInterval(() => {
      setValue((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [active, seconds]);

  useEffect(() => {
    if (!active || value !== 0 || finishedRef.current) return;
    finishedRef.current = true;
    onDoneRef.current();
  }, [active, value]);

  return value;
}
