import { useCallback } from 'react';
import { Knockable } from '@/operations/types';

/**
 * Returns a callback to pick up (reset) a knocked object.
 * @param setObjects State setter for objects.
 * @param setOrder State setter for order count.
 * @param sound An object with a ding() method for sound effects.
 */
export function usePickupObject(
  setObjects: React.Dispatch<React.SetStateAction<Knockable[]>>,
  setOrder: React.Dispatch<React.SetStateAction<number>>,
  sound: { ding: () => void }
) {
  return useCallback(
    (id: string) => {
      setObjects((prev) => {
        const idx = prev.findIndex((o) => o.id === id);
        if (idx === -1) return prev;
        if (prev[idx].state !== 'knocked') return prev;
        const next = prev.slice();
        next[idx] = { ...next[idx], state: 'upright' };
        return next;
      });
      setOrder((o) => o + 1);
      sound.ding();
    },
    [setObjects, setOrder, sound]
  );
}
