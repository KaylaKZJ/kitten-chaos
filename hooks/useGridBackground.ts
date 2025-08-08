import { useMemo } from 'react';

/**
 * Returns a memoized CSSProperties object for the room grid background.
 */
export function useGridBackground() {
  return useMemo(() => {
    const c1 = 'rgba(0,0,0,0.03)';
    const c2 = 'transparent';
    return {
      backgroundImage: `
        repeating-linear-gradient(0deg, ${c1}, ${c1} 1px, ${c2} 1px, ${c2} 24px),
        repeating-linear-gradient(90deg, ${c1}, ${c1} 1px, ${c2} 1px, ${c2} 24px)
      `,
      backgroundSize: '24px 24px, 24px 24px',
    } as React.CSSProperties;
  }, []);
}
