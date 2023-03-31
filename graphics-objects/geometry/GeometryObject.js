// import { GraphicObject } from '../GraphicObject.js';
import { SceneObject } from '../SceneObject.js';
import { domPoint } from '../../lib/utils.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, shareReplay, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;

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

export class GeometryObject extends SceneObject {
  // vertices = [];
  panOrigin = { x: 0, y: 0 };

  constructor(svgContext, type, vertices, options, pointsToPathFn) {
    super(svgContext, type, options);

    this.vertices = vertices;

    const path = document.createElementNS(SVG_NS, 'path');

    path.classList.add('canvas-object', 'penus');
    path.dataset.type = type;
    path.dataset.component = type;

    this.slotObject(path);

    this.setPath(vertices, pointsToPathFn);

    this.vertices.forEach((v, i) => {
      this.createVertex(this.context, v, i)
    });


    this.vertexEvents$ = fromEvent(this.dom, 'pointermove')
      .pipe(
        filter(({ target }) => target.classList.contains('vertex')),
        map(({ target, clientX, clientY }) => {
          const p = domPoint(target, clientX, clientY)
          return {
            target,
            index: +target.dataset.index,
            x: p.x,
            y: p.y
          }

        }),
        tap(({ index, x, y }) => {
          const verts = [...this.vertices, { ...this.vertices[index], x, y }];
          console.log('verts', verts)
          this.setPath(verts)
        }),
        tap(x => console.log('vertexEvents$', x))
      );

    this.vertexEvents$.subscribe()
  }

  get path() {
    return this.object;
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

  createVertex(context, { x, y }, index) {
    const obj = this.context.templates.querySelector(`[data-template="vertex"]`).cloneNode(true);

    delete obj.dataset.template;

    obj.dataset.component = 'vertex';
    obj.dataset.index = index;
    obj.cx.baseVal.value = x;
    obj.cy.baseVal.value = y;

    this.slots.object.append(obj)
  }
}