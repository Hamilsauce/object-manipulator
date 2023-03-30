import { GraphicObject } from '../GraphicObject.js';

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

export class GeometryObject extends GraphicObject {
  #vertices = [];

  constructor(svgContext, type, vertices, options, pointsToPathFn) {
    super(svgContext, type, options);

    this.#vertices = vertices;

    const path = document.createElementNS(SVG_NS, 'path');

    path.classList.add('canvas-object', 'penus');
    path.dataset.type = type;
    path.dataset.component = type;
    
    this.slotObject(path);

    this.setPath(vertices, pointsToPathFn);

    this.#vertices.forEach((v, i) => {
      this.createVertex(this.context, v)
    });
  }

  get path() {
    return this.object;
  }

  get vertices() {
    return this.#vertices;
  }

  get d() {
    return this.path.getAttribute('d');
  }

  set d(d) {
    this.path.setAttribute('d', d);
  }

  updatePath() {}

  setPath(vertices, pointsToPathFn) {
    const pathData = pointsToPathFn ?
      pointsToPathFn(this) :
      vertices.reduce((acc, { x, y }) => `${acc} ${x},${y}`, 'M ') + 'Z';

    this.d = pathData;
  }

  createVertex(context, { x, y }) {
    const obj = this.context.templates.querySelector(`[data-template="vertex"]`).cloneNode(true);

    delete obj.dataset.template;

    obj.dataset.component = 'vertex';
    obj.cx.baseVal.value = x;
    obj.cy.baseVal.value = y;

    this.slots.object.append(obj)
  }
}