import { useEffect, useRef } from 'react';
import { Kitten, KittenId, Knockable } from '@/operations/types';

type UseKittenObjectRefsParams = {
  kittens: Kitten[];
  objects: Knockable[];
  scheduleRoam: any;
  scheduleTarget: any;
  loopsRef: any;
  setKittens: any;
  setObjects: any;
  setShakingIds: any;
  setChaos: any;
  roomSize: any;
  reduceMotion: boolean;
  sound: any;
  clearTimersForKitten: (id: KittenId) => void;
};

/**
 * Manages refs and effects for kitten and object state synchronization and timers.
 * @param params All dependencies and state setters required for kitten/object management.
 * @returns { objectsRef } - Ref to the current objects array.
 */
export function useKittenObjectRefs({
  kittens,
  objects,
  scheduleRoam,
  scheduleTarget,
  loopsRef,
  setKittens,
  setObjects,
  setShakingIds,
  setChaos,
  roomSize,
  reduceMotion,
  sound,
  clearTimersForKitten,
}: UseKittenObjectRefsParams) {
  const objectsRef = useRef<Knockable[]>([]);
  const prevIdsRef = useRef<Set<KittenId>>(new Set());

  // Keep objectsRef in sync with objects state
  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  // Start/stop loops when kittens change
  useEffect(() => {
    const current = new Set<KittenId>(kittens.map((k) => k.id));
    kittens.forEach((k) => {
      if (!prevIdsRef.current.has(k.id)) {
        scheduleRoam(k.id, loopsRef, setKittens, roomSize);
        scheduleTarget(
          k.id,
          loopsRef,
          setKittens,
          setObjects,
          setShakingIds,
          setChaos,
          roomSize,
          reduceMotion,
          objectsRef,
          sound
        );
      }
    });
    prevIdsRef.current.forEach((id) => {
      if (!current.has(id)) {
        clearTimersForKitten(id);
      }
    });
    prevIdsRef.current = current;
    // No cleanup needed
  }, [
    kittens,
    scheduleRoam,
    scheduleTarget,
    loopsRef,
    setKittens,
    setObjects,
    setShakingIds,
    setChaos,
    roomSize,
    reduceMotion,
    objects,
    sound,
    clearTimersForKitten,
  ]);

  return { objectsRef };
}
