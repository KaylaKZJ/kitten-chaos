import { useMemo } from 'react';
import { Kitten } from '@/operations/types';

/**
 * Returns an object indicating which kittens are present.
 * @param kittens The current array of kittens.
 * @returns { eep: boolean, meep: boolean }
 */
export function useKittenPresence(kittens: Kitten[]) {
  return useMemo(
    () => ({
      eep: kittens.some((k) => k.id === 'eep'),
      meep: kittens.some((k) => k.id === 'meep'),
    }),
    [kittens]
  );
}
