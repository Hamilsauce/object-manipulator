import { CanvasObject } from './CanvasObject.js';
const ShapeTypeMap = new Map()

export class Spatial extends CanvasObject {
  constructor({ parentSVG, type, attrs }) {
    super({ svg: parentSVG, type, attrs })
  }
}