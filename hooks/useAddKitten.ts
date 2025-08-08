import { useCallback } from 'react';
import { Kitten, KittenId, KittenName } from '@/operations/types';
import { randInt } from '@/operations/helpers';
import { KITTEN_SIZE, ROOM_PADDING } from '@/operations/constants';

/**
 * Returns a callback to add a kitten to the state.
 * @param kittens The current array of kittens.
 * @param setKittens State setter for kittens.
 * @param roomSize The current room size ({ w, h }).
 * @param sound An object with a meow() method for sound effects.
 */
export function useAddKitten(
  kittens: Kitten[],
  setKittens: React.Dispatch<React.SetStateAction<Kitten[]>>,
  roomSize: { w: number; h: number },
  sound: { meow: () => void }
) {
  return useCallback(
    (id: KittenId) => {
      if (kittens.some((k) => k.id === id)) return;
      const name: KittenName = id === 'eep' ? 'Eep' : 'Meep';
      const x = randInt(
        ROOM_PADDING,
        Math.max(ROOM_PADDING, roomSize.w - KITTEN_SIZE - ROOM_PADDING)
      );
      const y = randInt(
        ROOM_PADDING,
        Math.max(ROOM_PADDING, roomSize.h - KITTEN_SIZE - ROOM_PADDING)
      );
      setKittens((prev) => [
        ...prev,
        { id, name, x, y, mode: 'idle', targetObjectId: null },
      ]);
      sound.meow();
    },
    [kittens, roomSize.w, roomSize.h, setKittens, sound]
  );
}
