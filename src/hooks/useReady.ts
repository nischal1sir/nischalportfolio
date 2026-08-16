import { useEffect, useState } from 'react';

const DEFAULT_DELAY = 400;

export function useReady(delay = DEFAULT_DELAY) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}
