import { GeometryObject } from './GeometryObject.js';


const triangleVertices = [
  { x: 0, y: -8 },
  { x: 8, y: 8 },
  { x: -8, y: 8 },
];


export class TriangleObject extends GeometryObject {

  constructor(svgContext, options) {
    if (!svgContext || !options) throw new Error('Invalid Context or Template passed to TriangleObject');

    super(svgContext, 'triangle',triangleVertices, options);
    console.log('triangle', this);

  };
}