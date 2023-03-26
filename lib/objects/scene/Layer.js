import { SceneObject } from '../SceneObject.js';

const LayerOptions = {
  type: String,
  point: {
    x: Number,
    y: Number,
  },
  dimensions: {
    width: Number,
    height: Number,
  },
}

export class Layer extends SceneObject {
  constructor(svgContext, options = ShapeOptions) {
    super(svgContext, type);

    console.warn('SHAPE CONSTRUCTOR', this);
  };
}