import { Shape } from './Shape.js';

export class TriangleObject extends Shape {
  #vertices = new Array(3).fill(null);

  constructor(svgContext, options) {
    if (!svgContext || !options.template) throw new Error('Invalid Context or Template passed to TriangleObject');

    super(svgContext, 'triangle', options)
  };
}