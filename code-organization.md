# Code Organization: Refactoring `page.tsx` into Smaller Components

This document analyzes `app/page.tsx` and suggests how to refactor large sections into smaller, reusable components for improved readability and maintainability.

---

## 1. Kitten Renderer

**Section:**  
Rendering of kittens inside the room canvas.

**Suggested Component:**

- **File:** `components/Kitten.tsx`
- **Props:**
  - `kitten: Kitten`
  - `reduceMotion: boolean`
- **Enclosed Functions:**
  - None (all logic can be handled via props)

---

## 2. Object Renderer

**Section:**  
Rendering of objects (plant, mug, book) inside the room canvas.

**Suggested Component:**

- **File:** `components/KnockableObject.tsx`
- **Props:**
  - `object: Knockable`
  - `OBJ_SIZE: number`
  - `isShaking: boolean`
  - `reduceMotion: boolean`
  - `pickupObject: (id: string) => void`
- **Enclosed Functions:**
  - Keyboard event handler for pickup
  - Click handler for pickup

---

## 3. Room Canvas

**Section:**  
The entire room area, including kittens, objects, and HUD.

**Suggested Component:**

- **File:** `components/RoomCanvas.tsx`
- **Props:**
  - `kittens: Kitten[]`
  - `objects: Knockable[]`
  - `shakingIds: Set<string>`
  - `reduceMotion: boolean`
  - `roomRef: React.RefObject<HTMLDivElement>`
  - `roomSize: { w: number, h: number }`
  - `pickupObject: (id: string) => void`
  - `chaos: number`
  - `order: number`
  - `OBJ_SIZE: number`
- **Enclosed Functions:**
  - None (all logic passed via props)

---

## 4. Top Bar (Header)

**Section:**  
The header with controls for adding kittens/objects, muting, and resetting.

**Suggested Component:**

- **File:** `components/TopBar.tsx`
- **Props:**
  - `kittenPresent: { eep: boolean; meep: boolean }`
  - `addKitten: (id: KittenId) => void`
  - `addObject: (type: ObjType) => void`
  - `muted: boolean`
  - `setMuted: (muted: boolean) => void`
  - `reset: () => void`
- **Enclosed Functions:**
  - None (all logic passed via props)

---

## 5. Keyframes and Motion Helpers

**Section:**  
Global styles for animations.

**Suggested Component:**

- **File:** `components/GlobalMotionStyles.tsx`
- **Props:** None
- **Enclosed Functions:** None

---

## 6. Utility Hooks

**Section:**  
Room measurement, reduce motion listener, and timer management.

**Suggested Files:**

- `hooks/useRoomSize.ts`
- `hooks/useReduceMotion.ts`
- `hooks/useKittenTimers.ts`
- **Props:**
  - As needed per hook
- **Enclosed Functions:**
  - Each hook encapsulates its own logic

---

## Summary Table

| Section          | File/Folder                       | Props (main)                                            | Enclosed Functions      |
| ---------------- | --------------------------------- | ------------------------------------------------------- | ----------------------- |
| Kitten Renderer  | components/Kitten.tsx             | kitten, reduceMotion                                    | None                    |
| Object Renderer  | components/KnockableObject.tsx    | object, OBJ_SIZE, isShaking, reduceMotion, pickupObject | Keyboard/click handlers |
| Room Canvas      | components/RoomCanvas.tsx         | kittens, objects, shakingIds, ...                       | None                    |
| Top Bar (Header) | components/TopBar.tsx             | kittenPresent, addKitten, ...                           | None                    |
| Keyframes/Motion | components/GlobalMotionStyles.tsx | None                                                    | None                    |
| Utility Hooks    | hooks/                            | As needed                                               | Each hook's logic       |

---

Refactoring as above will improve code readability, reusability, and maintainability.
