import { RectObject, LineObject, TriangleObject, CircleObject } from './shapes/index.js';

export const ObjectMap = new Map([
  ['circle', CircleObject],
  ['line', LineObject],
  ['rect', RectObject],
  ['triangle', TriangleObject],
]);