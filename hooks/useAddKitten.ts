import { useCallback } from 'react';
import { Kitten } from '@/operations/types';
import { randInt } from '@/operations/helpers';
import { KITTEN_SIZE, ROOM_PADDING, KITTENS } from '@/operations/constants';

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
    (id: string) => {
      if (kittens.some((k) => k.id === id)) return;
      const kittenDef = KITTENS.find((k) => k.id === id);
      if (!kittenDef) return;
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
        {
          id: kittenDef.id,
          name: kittenDef.name,
          x,
          y,
          mode: 'idle',
          targetObjectId: null,
          color: kittenDef.color,
          emote: kittenDef.emote,
        },
      ]);
      sound.meow();
    },
    [kittens, roomSize.w, roomSize.h, setKittens, sound]
  );
}
