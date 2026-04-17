import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  speed?: number;
  start?: boolean;
}

interface UseTypewriterReturn {
  shown: string;
  done: boolean;
}

/**
 * Hook that simulates streaming text character-by-character
 * Reveals 2 characters per tick at the specified speed interval
 *
 * @param text - The text to animate
 * @param options - Configuration options
 * @param options.speed - Interval in milliseconds between ticks (default: 10ms)
 * @param options.start - Whether to start the animation (default: true)
 * @returns Object with the shown text and a done flag
 */
export const useTypewriter = (
  text: string,
  { speed = 10, start = true }: UseTypewriterOptions = {}
): UseTypewriterReturn => {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return;

    setN(0);
    let i = 0;

    const id = setInterval(() => {
      i += 2; // reveal 2 chars per tick
      if (i >= text.length) {
        setN(text.length);
        clearInterval(id);
      } else {
        setN(i);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, start, speed]);

  return { shown: text.slice(0, n), done: n >= text.length };
};
