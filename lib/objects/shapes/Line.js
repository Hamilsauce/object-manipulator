import { Shape } from './Shape.js';

export class LineObject extends Shape {
  #vertices = new Array(4).fill(null);

  constructor(svgContext, options) {
    if (!svgContext || !options.template) throw new Error('Invalid Context or Template passed to LineObject');
    super(svgContext, 'line', options)
  };
}