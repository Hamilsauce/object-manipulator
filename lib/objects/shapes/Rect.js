import { Shape } from './Shape.js';

export class RectObject extends Shape {
  #vertices = new Array(4).fill(null);

  constructor(svgContext, options) {
    if (!svgContext || !options.template) throw new Error('Invalid Context or Template passed to RectObject');
    super(svgContext, 'rect', options)
  };
}