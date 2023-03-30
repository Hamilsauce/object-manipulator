import { GraphicObject } from './GraphicObject.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, shareReplay, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;


const SceneObjectOptions = {
  type: String,
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}

const DEFAULT_SCENE_CONFIG = {
  type: 'rect',
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}


export class SceneObject extends GraphicObject {
  #state$ = new BehaviorSubject({
    type: 'rect',
    point: {},
    dimensions: {},
  });

  constructor(context, type, options = SceneObjectOptions) {
    // console.warn('SCENE OBJEXT context, type, dimensions, point', context, type, dimensions, point)
    super(context, type, options = SceneObjectOptions);

  }

  observe(options = {}) {
    const state$ = this.#state$.asObservable()
      .pipe(
        map(x => x),
        tap(x => console.log('observe', x)),
        distinctUntilChanged(),
        shareReplay(1),
      );

    return state$;
  }

  setState(stateMap = {}) {}


  static create(context, { type, template, point, dimensions, isInterface, } = SceneObjectOptions) {
    if (isInterface) throw new Error('Invalid Options passed to Create Scene Object');

    if (type !== 'circle') {
      container
        .querySelector('.object-slot')
        .setAttribute('transform', `translate(-${dimensions.width / 2},-${dimensions.height / 2})`);
    }

    else {
      obj.setAttribute('r', dimensions.width / 2);
    }

    if (type == 'rect') {
      obj.setAttribute('width', dimensions.width);
      obj.setAttribute('height', dimensions.height);
    }

    return new SceneObject(INSTANTIATION_KEY, sceneContext, {
      // svg: sceneContext,
      template: container,
      type,
      attrs: {
        dataset: {
          selected: false,
          focused: false,
          cum: 'fuck',
        }
      }
    });
  };

}