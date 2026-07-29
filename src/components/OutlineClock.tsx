import { formatTime } from '../hooks/usePomodoro';

interface OutlineClockProps {
  secondsLeft: number;
}

export function OutlineClock({ secondsLeft }: OutlineClockProps) {
  return (
    <section className="flex w-full flex-col items-center">
      <p
        className="outline-clock text-[8rem] leading-[0.85] sm:text-[11rem] md:text-[14rem] lg:text-[16rem]"
        aria-live="polite"
      >
        {formatTime(secondsLeft)}
      </p>
    </section>
  );
}
