import { useCallback } from 'react';
import { Knockable, ObjType } from '@/operations/types';
import { randInt } from '@/operations/helpers';
import { OBJ_SIZE, ROOM_PADDING } from '@/operations/constants';

/**
 * Returns a callback to add an object to the state.
 * @param setObjects State setter for objects.
 * @param roomSize The current room size ({ w, h }).
 */
export function useAddObject(
  setObjects: React.Dispatch<React.SetStateAction<Knockable[]>>,
  roomSize: { w: number; h: number }
) {
  return useCallback(
    (type: ObjType) => {
      const id = `${type}-${crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString(16)}`;
      const x = randInt(
        ROOM_PADDING,
        Math.max(ROOM_PADDING, roomSize.w - OBJ_SIZE - ROOM_PADDING)
      );
      const y = randInt(
        ROOM_PADDING,
        Math.max(ROOM_PADDING, roomSize.h - OBJ_SIZE - ROOM_PADDING)
      );
      setObjects((prev) => [...prev, { id, type, x, y, state: 'upright' }]);
    },
    [roomSize.w, roomSize.h, setObjects]
  );
}
