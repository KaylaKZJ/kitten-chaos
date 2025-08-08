import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref for the room element and its current size.
 * @param defaultSize The default room size ({ w, h }).
 * @returns { roomRef, roomSize }
 */
export function useRoomSize(defaultSize = { w: 800, h: 480 }) {
  const roomRef = useRef<HTMLDivElement>(null);
  const [roomSize, setRoomSize] = useState(defaultSize);

  useEffect(() => {
    if (!roomRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setRoomSize({ w: cr.width, h: cr.height });
      }
    });
    ro.observe(roomRef.current);
    return () => ro.disconnect();
  }, []);

  return { roomRef, roomSize };
}
