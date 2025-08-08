'use client';

import RoomCanvas from '@/components/RoomCanvas';
import TopBar from '@/components/TopBar';
import { OBJ_SIZE } from '@/operations/constants';
import { useCallback, useState } from 'react';
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
import { Kitten, Knockable } from '../operations/types';
import MainLayout from '../layout/MainLayout';
import SectionLayout from '../layout/SectionLayout';

// --- Add a ref to always have the latest objects state ---

function PageContent() {
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [objects, setObjects] = useState<Knockable[]>([]);
  const [chaos, setChaos] = useState(0);
  const [order, setOrder] = useState(0);
  const reduceMotion = useReduceMotion();
  const { sound, muted, setMuted } = useSoundManager();
  const { roomRef, roomSize } = useRoomSize({ w: 800, h: 480 });
  const { clearAllTimers } = useKittenTimers();
  const [shakingIds, setShakingIds] = useState<Set<string>>(new Set());
  const kittenPresent = useKittenPresence(kittens);
  const addKitten = useAddKitten(kittens, setKittens, roomSize, sound);
  const addObject = useAddObject(setObjects, roomSize);
  const pickupObject = usePickupObject(setObjects, setOrder, sound);
  const gridBg = useGridBackground();

  const reset = useCallback(() => {
    clearAllTimers();
    setKittens(() => []);
    setObjects(() => []);
    setChaos(() => 0);
    setOrder(() => 0);
    setShakingIds(() => new Set());
  }, [clearAllTimers]);

  return (
    <MainLayout>
      <ErrorBoundary
        fallback={
          <div className='p-4 text-red-600 bg-red-50 rounded'>
            Top bar failed to load.
          </div>
        }
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

      <SectionLayout>
        <div className='mx-auto mt-4 w-full max-w-5xl px-4 pb-16'>
          <ErrorBoundary
            fallback={
              <div className='p-4 text-red-600 bg-red-50 rounded'>
                Room failed to load.
              </div>
            }
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

      <GlobalMotionStyles />
    </MainLayout>
  );
}

export default function Page() {
  return (
    <SoundManagerProvider>
      <PageContent />
    </SoundManagerProvider>
  );
}
