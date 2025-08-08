'use client';

import RoomCanvas from '@/components/RoomCanvas';
import TopBar from '@/components/TopBar';
import { OBJ_SIZE } from '@/operations/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import GlobalMotionStyles from '../components/GlobalMotionStyles';
import {
  SoundManagerProvider,
  useSoundManager,
} from '../context/SoundManagerContext';
import { useAddKitten } from '../hooks/useAddKitten';
import { useAddObject } from '../hooks/useAddObject';
import { useGridBackground } from '../hooks/useGridBackground';
import { useKittenPresence } from '../hooks/useKittenPresence';
import { useKittenTimers } from '../hooks/useKittenTimers';
import { usePickupObject } from '../hooks/usePickupObject';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { useRoomSize } from '../hooks/useRoomSize';
import { scheduleRoam, scheduleTarget } from '../operations/room';
import { Kitten, KittenId, Knockable } from '../operations/types';
import MainLayout from '../layout/MainLayout';
import SectionLayout from '../layout/SectionLayout';
import ErrorFallback from '../components/ErrorFallback';

// Main page content component
function PageContent() {
  // State for kittens, objects, and HUD counters
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [objects, setObjects] = useState<Knockable[]>([]);
  const [chaos, setChaos] = useState(0);
  const [order, setOrder] = useState(0);

  // Motion/accessibility and sound context
  const reduceMotion = useReduceMotion();
  const { sound, muted, setMuted } = useSoundManager();

  // Room size and timers
  const { roomRef, roomSize } = useRoomSize({ w: 800, h: 480 });
  const { clearAllTimers, loopsRef, clearTimersForKitten } = useKittenTimers();

  // UI state for shaking animation
  const [shakingIds, setShakingIds] = useState<Set<string>>(new Set());

  // Derived state and action hooks
  const kittenPresent = useKittenPresence(kittens);
  const addKitten = useAddKitten(kittens, setKittens, roomSize, sound);
  const addObject = useAddObject(setObjects, roomSize);
  const pickupObject = usePickupObject(setObjects, setOrder, sound);
  const gridBg = useGridBackground();

  // Reset all state and timers
  const reset = useCallback(() => {
    clearAllTimers();
    setKittens(() => []);
    setObjects(() => []);
    setChaos(() => 0);
    setOrder(() => 0);
    setShakingIds(() => new Set());
  }, [clearAllTimers]);

  // --- Restore refs for objects and previous kitten IDs ---
  const objectsRef = useRef<Knockable[]>([]);
  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  const prevIdsRef = useRef<Set<KittenId>>(new Set());

  // --- Restore kitten movement scheduling effect ---
  useEffect(() => {
    const current = new Set<KittenId>(kittens.map((k) => k.id));
    // Schedule movement for new kittens
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
    // Cleanup timers for removed kittens
    prevIdsRef.current.forEach((id) => {
      if (!current.has(id)) {
        clearTimersForKitten(id);
      }
    });
    prevIdsRef.current = current;
  }, [
    kittens,
    setKittens,
    setObjects,
    setShakingIds,
    setChaos,
    roomSize,
    reduceMotion,
    sound,
    loopsRef,
    clearTimersForKitten,
  ]);

  return (
    <MainLayout>
      {/* Top bar with controls, wrapped in error boundary */}
      <ErrorBoundary
        fallback={<ErrorFallback message='Top bar failed to load.' />}
      >
        <TopBar
          kittenPresent={kittenPresent}
          addKitten={addKitten}
          addObject={addObject}
          muted={muted}
          setMuted={setMuted}
          reset={reset}
        />
      </ErrorBoundary>

      {/* Main section for the room and kittens/objects */}
      <SectionLayout>
        {/* Room area, wrapped in error boundary */}
        <div className='mx-auto mt-4 w-full max-w-5xl px-4 pb-16'>
          <ErrorBoundary
            fallback={<ErrorFallback message='Room failed to load.' />}
          >
            <RoomCanvas
              roomRef={roomRef}
              gridBg={gridBg}
              height='min(62vh, 560px)'
              minHeight={360}
              kittens={kittens}
              objects={objects}
              shakingIds={shakingIds}
              reduceMotion={reduceMotion}
              pickupObject={pickupObject}
              chaos={chaos}
              order={order}
              OBJ_SIZE={OBJ_SIZE}
            />
          </ErrorBoundary>
        </div>
      </SectionLayout>

      {/* Global keyframes and animation helpers */}
      <GlobalMotionStyles />
    </MainLayout>
  );
}

// App entry point with sound context provider
export default function Page() {
  return (
    <SoundManagerProvider>
      <PageContent />
    </SoundManagerProvider>
  );
}
