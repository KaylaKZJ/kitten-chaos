import { Button } from '@/components/ui/button';
import {
  Sprout,
  Coffee,
  Book,
  VolumeX,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import * as React from 'react';
import { ObjType } from '@/operations/types';
import { KITTENS } from '@/operations/constants';

type TopBarProps = {
  kittenPresent: Record<string, boolean>;
  addKitten: (id: string) => void;
  addObject: (type: ObjType) => void;
  muted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
};

export default function TopBar({
  kittenPresent,
  addKitten,
  addObject,
  muted,
  setMuted,
  reset,
}: TopBarProps) {
  return (
    <header className='sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3'>
        <div className='font-semibold mr-2'>Kitten Chaos</div>
        <div className='ml-auto flex flex-wrap items-center gap-2'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Add Kitten:</span>
            {KITTENS.map((k) => (
              <Button
                key={k.id}
                size='sm'
                variant='secondary'
                onClick={() => addKitten(k.id)}
                disabled={kittenPresent[k.id]}
              >
                Add {k.name}
              </Button>
            ))}
          </div>
          <div className='h-5 w-px bg-border' />
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Add Object:</span>
            <Button
              size='sm'
              variant='outline'
              onClick={() => addObject('plant')}
            >
              <Sprout className='mr-1 h-4 w-4' />
              Plant
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => addObject('mug')}
            >
              <Coffee className='mr-1 h-4 w-4' />
              Mug
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => addObject('book')}
            >
              <Book className='mr-1 h-4 w-4' />
              Book
            </Button>
          </div>
          <div className='h-5 w-px bg-border' />
          <Button
            size='sm'
            variant='ghost'
            className='gap-1'
            onClick={() => setMuted((m) => !m)}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? (
              <VolumeX className='h-4 w-4' />
            ) : (
              <Volume2 className='h-4 w-4' />
            )}
            {muted ? 'Muted' : 'Mute'}
          </Button>
          <Button
            size='sm'
            variant='ghost'
            className='gap-1'
            onClick={reset}
            aria-label='Reset the room'
          >
            <RotateCcw className='h-4 w-4' />
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
}
