import {
  KittenId,
  KittenName,
  KittenMode,
  ObjType,
  Kitten,
  Knockable,
} from '../types';
import {
  ROOM_PADDING,
  KITTEN_SIZE,
  OBJ_SIZE,
  ROAM_MIN_MS,
  ROAM_MAX_MS,
  TARGET_MIN_MS,
  TARGET_MAX_MS,
} from '../constants';
import { randInt, clamp, pickRandom } from '../helpers';
import { SoundManager } from '../../classes/soundmanager';

// These are templates for how to use these helpers in your component.
// You may need to adapt them to your state management.

export function scheduleRoam(
  kittenId: string,
  loopsRef: React.MutableRefObject<any>,
  setKittens: React.Dispatch<React.SetStateAction<Kitten[]>>,
  roomSize: { w: number; h: number }
) {
  const t =
    loopsRef.current[kittenId] ||
    (loopsRef.current[kittenId] = {
      roamTimeout: null,
      targetTimeout: null,
      dashTimeout: null,
    });
  if (t.roamTimeout) clearTimeout(t.roamTimeout);
  const delay = randInt(ROAM_MIN_MS, ROAM_MAX_MS);
  t.roamTimeout = setTimeout(() => {
    setKittens((prev) =>
      prev.map((k) => {
        if (k.id !== kittenId) return k;
        const hop = randInt(20, 80);
        const angle = Math.random() * Math.PI * 2;
        const nx = clamp(
          k.x + Math.cos(angle) * hop,
          ROOM_PADDING,
          Math.max(ROOM_PADDING, roomSize.w - KITTEN_SIZE - ROOM_PADDING)
        );
        const ny = clamp(
          k.y + Math.sin(angle) * hop,
          ROOM_PADDING,
          Math.max(ROOM_PADDING, roomSize.h - KITTEN_SIZE - ROOM_PADDING)
        );
        return { ...k, x: nx, y: ny, mode: 'roam' };
      })
    );
    scheduleRoam(kittenId, loopsRef, setKittens, roomSize);
  }, delay);
}

export function scheduleTarget(
  kittenId: string,
  loopsRef: React.MutableRefObject<any>,
  setKittens: React.Dispatch<React.SetStateAction<Kitten[]>>,
  setObjects: React.Dispatch<React.SetStateAction<Knockable[]>>,
  setShakingIds: React.Dispatch<React.SetStateAction<Set<string>>>,
  setChaos: React.Dispatch<React.SetStateAction<number>>,
  roomSize: { w: number; h: number },
  reduceMotion: boolean,
  objectsRef: React.MutableRefObject<Knockable[]>,
  sound: SoundManager
) {
  const t =
    loopsRef.current[kittenId] ||
    (loopsRef.current[kittenId] = {
      roamTimeout: null,
      targetTimeout: null,
      dashTimeout: null,
    });
  if (t.targetTimeout) clearTimeout(t.targetTimeout);
  const delay = randInt(TARGET_MIN_MS, TARGET_MAX_MS);
  t.targetTimeout = setTimeout(() => {
    setKittens((prevK) => {
      const k = prevK.find((kk) => kk.id === kittenId);
      if (!k) return prevK;
      const upright = objectsRef.current.filter((o) => o.state === 'upright');
      if (!upright.length) {
        scheduleTarget(
          kittenId,
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
        return prevK;
      }
      const target = pickRandom(upright)!;
      const targetX = clamp(
        target.x + OBJ_SIZE / 2 - KITTEN_SIZE / 2 + randInt(-6, 6),
        ROOM_PADDING,
        roomSize.w - KITTEN_SIZE - ROOM_PADDING
      );
      const targetY = clamp(
        target.y + OBJ_SIZE / 2 - KITTEN_SIZE / 2 + randInt(-6, 6),
        ROOM_PADDING,
        roomSize.h - KITTEN_SIZE - ROOM_PADDING
      );
      const dashMs = reduceMotion ? 0 : randInt(300, 380);
      const updated = prevK.map((kk) =>
        kk.id === kittenId
          ? {
              ...kk,
              x: targetX,
              y: targetY,
              mode: 'dash' as KittenMode,
              targetObjectId: target.id,
            }
          : kk
      );
      const curT = loopsRef.current[kittenId];
      if (curT?.dashTimeout) clearTimeout(curT.dashTimeout!);
      curT!.dashTimeout = setTimeout(() => {
        setObjects((prevO) => {
          const idx = prevO.findIndex((o) => o.id === target.id);
          if (idx === -1) {
            scheduleTarget(
              kittenId,
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
            setKittens((ks) =>
              ks.map((kk) =>
                kk.id === kittenId
                  ? { ...kk, mode: 'idle', targetObjectId: null }
                  : kk
              )
            );
            return prevO;
          }
          if (prevO[idx].state === 'knocked') {
            scheduleTarget(
              kittenId,
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
            setKittens((ks) =>
              ks.map((kk) =>
                kk.id === kittenId
                  ? { ...kk, mode: 'idle', targetObjectId: null }
                  : kk
              )
            );
            return prevO;
          }
          const next = prevO.slice();
          next[idx] = { ...next[idx], state: 'knocked' };
          setShakingIds((s) => {
            const newS = new Set(s);
            newS.add(target.id);
            setTimeout(() => {
              setShakingIds((ss) => {
                const copy = new Set(ss);
                copy.delete(target.id);
                return copy;
              });
            }, 350);
            return newS;
          });
          setChaos((c) => c + 1);
          sound.thunk();
          setKittens((ks) =>
            ks.map((kk) =>
              kk.id === kittenId
                ? { ...kk, mode: 'idle', targetObjectId: null }
                : kk
            )
          );
          scheduleTarget(
            kittenId,
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
          return next;
        });
      }, dashMs + 10);
      return updated;
    });
  }, delay);
}

export function resetRoom(
  loopsRef: React.MutableRefObject<any>,
  setKittens: React.Dispatch<React.SetStateAction<Kitten[]>>,
  setObjects: React.Dispatch<React.SetStateAction<Knockable[]>>,
  setChaos: React.Dispatch<React.SetStateAction<number>>,
  setOrder: React.Dispatch<React.SetStateAction<number>>,
  setMuted: React.Dispatch<React.SetStateAction<boolean>>,
  setShakingIds: React.Dispatch<React.SetStateAction<Set<string>>>
) {
  Object.values(loopsRef.current).forEach((t: any) => {
    if (t.roamTimeout) clearTimeout(t.roamTimeout);
    if (t.targetTimeout) clearTimeout(t.targetTimeout);
    if (t.dashTimeout) clearTimeout(t.dashTimeout);
  });
  loopsRef.current = {};
  setKittens([]);
  setObjects([]);
  setChaos(0);
  setOrder(0);
  setMuted(false);
  setShakingIds(new Set());
}

export function addKittenToRoom(
  id: KittenId,
  kittens: Kitten[],
  setKittens: React.Dispatch<React.SetStateAction<Kitten[]>>,
  roomSize: { w: number; h: number },
  sound: SoundManager
) {
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
}

export function addObjectToRoom(
  type: ObjType,
  setObjects: React.Dispatch<React.SetStateAction<Knockable[]>>,
  roomSize: { w: number; h: number }
) {
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
}

export function pickupObjectFromRoom(
  id: string,
  setObjects: React.Dispatch<React.SetStateAction<Knockable[]>>,
  setOrder: React.Dispatch<React.SetStateAction<number>>,
  sound: SoundManager
) {
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
}
