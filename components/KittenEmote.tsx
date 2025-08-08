import React from 'react';

type KittenEmoteProps = {
  x: number;
  y: number;
  emote: string;
  sounds?: (() => void)[];
};

export default function KittenEmote({ x, y, emote }: KittenEmoteProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 60, // center above kitten
        pointerEvents: 'none',
        zIndex: 20,
      }}
      className='select-none'
    >
      <span className='inline-block rounded bg-white/90 px-2 py-1 text-xs shadow ring-1 ring-black/10'>
        {emote}
      </span>
    </div>
  );
}
