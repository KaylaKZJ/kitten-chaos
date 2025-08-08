import * as React from 'react';
import KittenComponent from './Kitten';
import KnockableObject from './KnockableObject';
import { Kitten, Knockable } from '@/operations/types';

type RoomCanvasProps = {
  roomRef: React.RefObject<HTMLDivElement | null>;
  gridBg: React.CSSProperties;
  height: string;
  minHeight: number;
  kittens: Kitten[];
  objects: Knockable[];
  shakingIds: Set<string>;
  reduceMotion: boolean;
  OBJ_SIZE: number;
  pickupObject: (id: string) => void;
  chaos: number;
  order: number;
};

export default function RoomCanvas({
  roomRef,
  gridBg,
  height,
  minHeight,
  kittens,
  objects,
  shakingIds,
  reduceMotion,
  OBJ_SIZE,
  pickupObject,
  chaos,
  order,
}: RoomCanvasProps) {
  return (
    <div
      ref={roomRef}
      className='relative w-full rounded-lg border'
      style={{
        ...gridBg,
        height,
        minHeight,
      }}
      aria-label='Room canvas'
    >
      {/* Objects */}
      {objects.map((obj) => {
        const isShaking = shakingIds.has(obj.id) && !reduceMotion;
        return (
          <KnockableObject
            key={obj.id}
            object={obj}
            OBJ_SIZE={OBJ_SIZE}
            isShaking={isShaking}
            reduceMotion={reduceMotion}
            pickupObject={pickupObject}
          />
        );
      })}

      {/* Kittens */}
      {kittens.map((k) => (
        <KittenComponent key={k.id} kitten={k} reduceMotion={reduceMotion} />
      ))}

      {/* HUD */}
      <div
        className='pointer-events-none absolute bottom-2 right-2 z-20 rounded-md bg-background/80 px-2 py-1 text-sm text-foreground shadow ring-1 ring-black/5'
        aria-live='polite'
      >
        <span className='font-medium'>Chaos</span>: {chaos}{' '}
        <span className='mx-1'>•</span>{' '}
        <span className='font-medium'>Order</span>: {order}
      </div>
    </div>
  );
}
