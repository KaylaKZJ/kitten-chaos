import { cn } from '@/lib/utils';
import { iconForType } from '@/operations/helpers/iconForType';
import { Knockable } from '@/operations/types';

type KnockableObjectProps = {
  object: Knockable;
  OBJ_SIZE: number;
  isShaking: boolean;
  reduceMotion: boolean;
  pickupObject: (id: string) => void;
};

export default function KnockableObject({
  object,
  OBJ_SIZE,
  isShaking,
  reduceMotion,
  pickupObject,
}: KnockableObjectProps) {
  const Icon = iconForType(object.type)!;
  const isKnocked = object.state === 'knocked';

  return (
    <div
      className='absolute'
      style={{
        transform: `translate(${object.x}px, ${object.y}px)`,
        width: OBJ_SIZE,
        height: OBJ_SIZE,
        transition: 'transform 120ms ease',
      }}
    >
      <button
        type='button'
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-md bg-background/70 text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur-sm',
          'hover:bg-background/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
        )}
        onClick={() => {
          if (isKnocked) pickupObject(object.id);
        }}
        aria-label={
          isKnocked
            ? 'Pick up knocked ' + object.type
            : object.type + ' is upright'
        }
        tabIndex={isKnocked ? 0 : -1}
        onKeyDown={(e) => {
          if (
            isKnocked &&
            (e.key === 'Enter' || e.key === ' ' || e.code === 'Space')
          ) {
            e.preventDefault();
            pickupObject(object.id);
          }
        }}
        disabled={!isKnocked}
        aria-disabled={!isKnocked}
      >
        <Icon
          className={cn('h-8 w-8 transition-transform duration-150 ease-out', {
            'text-emerald-600': object.type === 'plant',
            'text-amber-700': object.type === 'mug',
            'text-indigo-700': object.type === 'book',
          })}
          style={{
            transform: isKnocked
              ? 'rotate(-20deg) translate(-2px, 4px)'
              : 'rotate(0deg)',
            filter: isKnocked
              ? 'drop-shadow(1px 2px 0 rgba(0,0,0,0.25))'
              : 'none',
            animation: isShaking ? 'shake 0.18s ease-in-out 2' : undefined,
          }}
        />
      </button>
    </div>
  );
}
