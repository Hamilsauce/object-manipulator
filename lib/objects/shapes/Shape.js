import { SceneObject } from '../SceneObject.js';

const ShapeOptions = {
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

export class Shape extends SceneObject {
  constructor(svgContext, type, options) {
    console.log('Shape options', options)
    super(svgContext, type, options);

    // console.warn('SHAPE CONSTRUCTOR', this);
  };

  // get prop() { return this.#prop };
  // set prop(v) { this.#prop = v };

}