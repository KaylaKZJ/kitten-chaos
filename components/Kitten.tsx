import { cn } from '@/lib/utils';
import * as React from 'react';
import { Kitten } from '@/operations/types';
import KittenEmote from './KittenEmote';

type KittenProps = {
  kitten: Kitten;
  reduceMotion: boolean;
};

export default function KittenComponent({ kitten, reduceMotion }: KittenProps) {
  const duration =
    kitten.mode === 'dash'
      ? reduceMotion
        ? '0ms'
        : '340ms'
      : reduceMotion
      ? '0ms'
      : '740ms';
  const hue = kitten.id === 'eep' ? 320 : 20; // Eep pink, Meep orange

  React.useEffect(() => {
    console.log(`Kitten ${kitten.name} is now in ${kitten.mode} mode`);
    // Additional side effects can be handled here if needed
  }, [kitten.mode, kitten.name]);

  return (
    <div
      className='absolute z-10 will-change-transform'
      style={{
        transform: `translate(${kitten.x}px, ${kitten.y}px)`,
        transitionProperty: 'transform',
        transitionTimingFunction: 'ease',
        transitionDuration: duration,
      }}
      aria-label={`${kitten.name} the kitten`}
    >
      <div
        className={cn(
          'flex h-[44px] w-[44px] items-center justify-center rounded-full text-lg shadow-sm ring-1 ring-black/5',
          !reduceMotion && 'wiggle'
        )}
        style={{
          background: `hsl(${hue} 90% 86%)`,
          color: `hsl(${hue} 70% 30%)`,
          position: 'relative',
        }}
        role='img'
        aria-label={kitten.name}
      >
        {kitten.mode === 'dash' && (
          <KittenEmote x={kitten.x} y={kitten.y} emote={kitten.name} />
        )}

        {'😺'}
      </div>
      <div className='mt-1 text-center text-[10px] leading-none text-muted-foreground'>
        {kitten.name}
      </div>
    </div>
  );
}
