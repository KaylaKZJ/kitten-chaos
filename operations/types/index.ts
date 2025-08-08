export type KittenId = 'eep' | 'meep';
export type KittenName = 'Eep' | 'Meep';
export type KittenMode = 'idle' | 'roam' | 'dash';
export type ObjType = 'plant' | 'mug' | 'book';
export type ObjState = 'upright' | 'knocked';

export type Kitten = {
  id: KittenId;
  name: KittenName;
  x: number;
  y: number;
  mode: KittenMode;
  targetObjectId?: string | null;
};

export type Knockable = {
  id: string;
  type: ObjType;
  x: number;
  y: number;
  state: ObjState;
};
