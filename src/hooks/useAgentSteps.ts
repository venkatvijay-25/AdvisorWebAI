import { useState, useEffect } from 'react';

interface UseAgentStepsOptions {
  start?: boolean;
  delay?: number;
}

/**
 * Hook that reveals agent reasoning steps one at a time
 * Progressively increases the count of "done" steps at the specified delay interval
 *
 * @param steps - Array of steps to reveal
 * @param options - Configuration options
 * @param options.start - Whether to start the animation (default: true)
 * @param options.delay - Interval in milliseconds between step reveals (default: 280ms)
 * @returns Count of steps that have been revealed
 */
export const useAgentSteps = (
  steps: unknown[],
  { start = true, delay = 280 }: UseAgentStepsOptions = {}
): number => {
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (!start) return;

    setDone(0);
    let i = 0;

    const id = setInterval(() => {
      i++;
      if (i > steps.length) {
        clearInterval(id);
      } else {
        setDone(i);
      }
    }, delay);

    return () => clearInterval(id);
  }, [start, steps.length, delay]);

  return done;
};
