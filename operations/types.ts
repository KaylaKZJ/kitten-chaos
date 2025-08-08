export type KittenId = string;

export type Kitten = {
  id: KittenId;
  name: string;
  x: number;
  y: number;
  mode: string;
  targetObjectId: string | null;
  color?: number;
  emote?: string;
};
