import React, { createContext, useContext, useMemo, useState } from 'react';
import { SoundManager } from '../classes/soundmanager';

type SoundManagerContextType = {
  sound: SoundManager;
  muted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

const SoundManagerContext = createContext<SoundManagerContextType | undefined>(
  undefined
);

export function SoundManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [muted, setMuted] = useState(false);
  const sound = useMemo(() => new SoundManager(), []);

  // Keep muted state in sync
  React.useEffect(() => {
    sound.setMuted(muted);
  }, [muted, sound]);

  return (
    <SoundManagerContext.Provider value={{ sound, muted, setMuted }}>
      {children}
    </SoundManagerContext.Provider>
  );
}

export function useSoundManager() {
  const ctx = useContext(SoundManagerContext);
  if (!ctx)
    throw new Error('useSoundManager must be used within SoundManagerProvider');
  return ctx;
}
