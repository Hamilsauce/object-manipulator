import { SceneObject } from '../SceneObject.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { SVGViewport } from '../SVGViewport.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';

import { getSceneViewportStore, getSceneObjectsStore } from '../../../store/index.js';
import { updateSceneOrigin } from '../../../store/scene-viewport/scene-viewport.actions.js';
import { addObject, addSelectedObjects, setFocusedObject } from '../../../store/scene-objects/scene-objects.actions.js';



const { utils, template } = ham;

const { combineLatest, iif, Subject, interval, of, fromEvent, merge, from } = rxjs;
const { shareReplay, distinct, mergeAll, groupBy, sampleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter } = rxjs.operators;


export const SceneConfig = {
  scale: 16,
  width: 412,
  height: 781,
  viewBox: {
    x: -36,
    y: -64,
    width: 72,
    height: 128,
  }
};

const SceneObjectOptions = {
  type: 'rect',
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}


const sceneViewportStore = getSceneViewportStore();
const sceneObjectsStore = getSceneObjectsStore();

export class Scene extends SVGViewport {

  constructor(context, options = SceneConfig) {
    super('scene', context, options)

    this.origin$ = sceneViewportStore.select(state => state.origin)
    // this.objects$ = sceneObjectsStore.select(({ objects }) => objects)
    this.groupedObjectsGetter$ = sceneObjectsStore.getters.objectGroupedById

    this._objectsGetter$ = sceneObjectsStore.getters._objects.pipe(
      //.pipe(
      // distinct(o => o.id),
      map(objs => from(Object.entries(objs))),
      mergeMap(_ => _.pipe(
        filter(([id, object]) => !this.objects.has(id)),
        // tap(x => console.log('STORE _OBJECTS', x)),
        tap(([id, object] ) => console.log('(this.objects.has(id))', this.objects.has(id))),
        tap(([id, object]) => {
          this.addObject(object)
        }),
        // ),

        // ),
      ))
    )

    this.objectsGetter$ = sceneObjectsStore.getters.objects.pipe(
      mergeMap(_ => from(_)
        .pipe(
          distinct(o => o.id),
          filter(({ id }) => !this.objects.has(id)),
        ),
      ),
    )
    //.subscribe()
    this._objectsGetter$.subscribe()

    this.newObjects$ = this.objectsGetter$
      .pipe(
        // tap(x => console.log('~~~~~~~ NEW OBJECT ~~~~~~~', x)),
        // tap(x => console.log('BEFORE FILTER IN NEW OBJS', x)),
        // tap(({ id }) => console.log('!this.objects.has(id)', !this.objects.has(id))),
        // tap(({ id }) => console.log('id', id)),
        // tap(x => console.warn('[[Scene newObjects$]]', [...this.objects])),
        // tap(x => console.warn('[[Scene newObjects$]]', this.objects)),
        filter(({ id }) => !this.objects.has(id)),
        // tap(x => console.log('AFTER FILTER IN NEW OBJS', x)),
        tap(({ id, object }) => {
          this.addObject(object)
        }),
      )
    // .subscribe()

    this.origin$.pipe(
      // tap(x => console.log('[[ ORIGIN, IN SCENE ]]: ', x)),
      tap(_ => {
        Object.assign(this.origin, _)
      }),
    ).subscribe()
  };

  get layers() {
    return {
      surface: this.selectDOM('#surface-layer'),
      objects: this.selectDOM('#object-layer'),
    }
  };


  init() {
    this.scene$ = combineLatest(
      this.paddleLeft.position$,
      this.paddleRight.position$,
      this.ball.position$,
      (paddleLeft, paddleRight, ball) => ({ paddleLeft, paddleRight, ball })
    ).pipe(
      sampleTime(40),
      takeWhile(() => !this.outOfBounds),
      map(({ paddleLeft, paddleRight, ball }) => {
        return { paddleLeft, paddleRight, ball }
      }),
      map(this.detectCollision.bind(this)),
    );

    this.scene$.subscribe();
  }

  addObject(options) {
    const newObj = this.createObject(options);

    this.objects.set(newObj.id, newObj);
    // console.log('[...this.objects]', [...this.objects])

    this.mountObject(this.objects.get(newObj.id), this.layers.objects);
  }
};