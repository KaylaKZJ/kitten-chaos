import { Sprout, Coffee, Book } from 'lucide-react';
import { ObjType } from '../../operations/types';

export function iconForType(type: ObjType) {
  switch (type) {
    case 'plant':
      return Sprout;
    case 'mug':
      return Coffee;
    case 'book':
      return Book;
  }
}
