import { useRef } from 'react';
import { KittenId } from '@/operations/types';

type TimerSet = {
  roamTimeout: ReturnType<typeof setTimeout> | null;
  targetTimeout: ReturnType<typeof setTimeout> | null;
  dashTimeout: ReturnType<typeof setTimeout> | null;
};

/**
 * Provides refs and functions to manage kitten timers.
 * @returns { loopsRef, clearAllTimers, clearTimersForKitten }
 */
export function useKittenTimers() {
  const loopsRef = useRef<Record<string, TimerSet>>({});

  /**
   * Clears all kitten timers.
   */
  const clearAllTimers = () => {
    Object.values(loopsRef.current).forEach((t) => {
      if (t.roamTimeout) clearTimeout(t.roamTimeout);
      if (t.targetTimeout) clearTimeout(t.targetTimeout);
      if (t.dashTimeout) clearTimeout(t.dashTimeout);
    });
    loopsRef.current = {};
  };

  /**
   * Clears timers for a specific kitten.
   * @param id The kitten's id.
   */
  const clearTimersForKitten = (id: KittenId) => {
    const t = loopsRef.current[id];
    if (t?.roamTimeout) clearTimeout(t.roamTimeout);
    if (t?.targetTimeout) clearTimeout(t.targetTimeout);
    if (t?.dashTimeout) clearTimeout(t.dashTimeout);
    delete loopsRef.current[id];
  };

  return { loopsRef, clearAllTimers, clearTimersForKitten };
}
