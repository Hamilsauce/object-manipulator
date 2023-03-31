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

    this.vertices = vertices.map((vert, i) => {
      return { ...vert, dom: this.createVertex(vert, i) }
    });

    // this.vertices.forEach((v, i) => {
    //   this.createVertex(this.context, v, i)
    // });

    this.vertexEvents$ = fromEvent(this.dom, 'pointerdown')
      .pipe(

        filter(({ target }) => target.classList.contains('vertex')),
        switchMap(event => fromEvent(this.dom, 'pointermove')
          // this.vertexEvents$ = fromEvent(this.dom, 'pointermove')
          .pipe(
            // tap(x => console.log('this.dom', this.dom)),
            map(({ target, clientX, clientY }) => {
              const p = domPoint(this.dom, clientX, clientY)
              console.log('POINT:v', p.x, p.y)
              return {
                dom: target,
                index: +target.dataset.index,
                x: p.x,
                y: p.y
              }
            }),
            tap(({ index, x, y, dom }) => {
              // const verts = [...this.vertices, { ...this.vertices[index], x, y }];
              // const vert = this.vertices[index]
              // const verts = [..., { ...this.vertices[index], x, y }];
              this.setVertices({ index, x, y, dom })
              // this.vertices[index] = { ...this.vertices[index], ...{ x, y } }
              // console.log('this.vertices', this.vertices)
              // this.setPath(this.vertices)
            }),
          ))

        // tap(x => console.log('vertexEvents$', x))
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

  setVertices(...verts) {
    verts.forEach(({ index, x, y, dom }, i) => {
      // const vert = this.vertices[index]
      this.vertices[index] = { ...this.vertices[index], x, y, dom }
      // this.createVertex(this.context, v, i)
      this.vertices[index].dom.setAttribute('transform', `translate(${this.vertices[index].x},${this.vertices[index].y})`)
    });

    this.setPath(this.vertices)
    console.log('this.vertices', { x: this.vertices[2].x, y: this.vertices[2].y })
  }

  createVertex({ x, y }, index) {
    const obj = this.context.templates.querySelector(`[data-template="vertex"]`).cloneNode(true);

    delete obj.dataset.template;

    obj.dataset.component = 'vertex';
    obj.dataset.index = index;
    obj.cx.baseVal.value = x;
    obj.cy.baseVal.value = y;
    obj.setAttribute('transform', `translate(${x},${y})`)

    this.slots.object.append(obj);

    return obj;
  }
}