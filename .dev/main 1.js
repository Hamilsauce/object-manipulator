import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { addPanAction } from './lib/pan-viewport.js';
import { CanvasObject } from './lib/objects/CanvasObject.js';
import { Application } from './lib/objects/Application.js';
import { createSceneObject } from './lib/create-scene-object.js';
import { DetailPane } from './lib/objects/canvas/hud/DetailPane.js';

import { getSceneViewportStore } from './store/index.js';
import { getSceneObjectsStore } from './store/index.js';
import { updateSceneOrigin } from './store/scene-viewport/scene-viewport.actions.js';
import { addObject, addSelectedObjects, setFocusedObject } from './store/scene-objects/scene-objects.actions.js';



const { template, utils, addDragAction } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const app = new Application();

// console.warn('app', { app });

app.initialize((app) => {
  const canvasTemplates = app.canvas.scene.templates
  const domPoint = (element, x, y) => {
    return new DOMPoint(x, y).matrixTransform(
      element.getScreenCTM().inverse()
    );
  }


  const selectObject = (target) => {
    target = target.closest('.object-container')
    target.dataset.selected = true;

    const sel = canvasTemplates
      .querySelector(`[data-template="object-selector"]`)
      .cloneNode(true);

    target.querySelector(`.overlay-slot`)
      .append(sel);

    target.stopDrag = draggable(scene, target);


  }

  const deselectObject = (target) => {
    target = target.closest('.object-container')

    const s = target.querySelector(`.overlay-slot`)

    if (s) {
      s.querySelector('.object-selector').remove();

      if (target.stopDrag) {
        target.stopDrag();
      }
    }

    target.dataset.selected = false;
    target.dataset.focused = false;
  }

  const focusObject = (target, state = null) => {
    selectObject(target);

    objectLayer.querySelectorAll('[data-focused="true"')
      .forEach(_ => _.dataset.focused = false)

    target.dataset.focused = true;

    objectLayer.append(target);
    const selectors = [...document.querySelectorAll('.object-container[data-focused="true"] .selector-marker')]

    sceneObjectsStore.dispatch(setFocusedObject({ id: target.id }))
  }

  const unFocusObject = (target) => {
    deselectObject(target);

    target.dataset.focused = false;

    sceneObjectsStore.dispatch(setFocusedObject({ id: target.id }))
  }

  const getUnitBoundingBox = (el) => {
    if (!(
        el instanceof SVGElement
      )) return {};

    return {
      x: el.x.baseVal.value,
      y: el.y.baseVal.value,
      width: el.width.baseVal.value,
      height: el.height.baseVal.value,
      top: el.y.baseVal.value,
      left: el.x.baseVal.value,
      bottom: el.y.baseVal.value + el.height.baseVal.value,
      right: el.x.baseVal.value + el.width.baseVal.value,

    }

    return el.getBoundingClientRect()
  }

  // console.log('app.canvas.dom', app.components.canvas.dom)

  const getCanvasBoundingBox = () => getUnitBoundingBox(document.querySelector('#canvas'));
  const getSceneBoundingBox = () => getUnitBoundingBox(document.querySelector('#scene').querySelector('#surface'));

  const appBody = document.querySelector('#app-body')
  const canvasEl = document.querySelector('#canvas');
  const hudLayer = document.querySelector('#hud');
  const scene = document.querySelector('#scene');
  const toolbox = document.querySelector('#toolbox');
  const tbSurface = document.querySelector('#toolbox-surface');
  const tbObjects = document.querySelector('#toolbox-objects');
  const sceneObjects = document.querySelector('#toolbox-objects');
  const objectLayer = document.querySelector('#object-layer');
  const surfaceLayer = document.querySelector('#surface-layer');
  const sceneSurface = document.querySelector('#surface');
  const selectors = [...document.querySelectorAll('.selector')];
  const canvasObjects = [...document.querySelectorAll('.object-container')];


  const LocalVewportState = {
    origin: { x: 0, y: 0 }
  };


  const sceneViewportStore = getSceneViewportStore();
  const sceneObjectsStore = getSceneObjectsStore();

  const scenePan$ = sceneViewportStore.select(({ origin, viewBox }) => ({ origin, viewBox }));

  const focusedObjectGetter$ = sceneObjectsStore.getters.focusedObject
  const focusedObject$ = sceneObjectsStore.select(({ focusedObjectId, focusedObject }) => ({ focusedObjectId, focusedObject }));

  const [originElX, originElY] = [...document.querySelectorAll('#origin-coords-content text')];



  scenePan$.pipe(
    startWith({ origin: { x: 0, y: 0 }, viewBox: { x: -36, y: -64, width: 72, height: 128 } }),
    filter(({ origin, viewBox }) => origin.x && viewBox.x && viewBox.y && origin.y),
    // tap(x => console.warn('[[ SCREEN PAN$ ]]: ', { x })),
    tap(x => Object.assign(LocalVewportState.origin, x.origin)),
    tap((panState) => {
      const viewBox = scene.viewBox.baseVal;

      Object.assign(viewBox, { ...panState.viewBox });

      originElX.textContent = `x: ${Math.trunc(panState.origin.x)}`
      originElY.textContent = `y: ${Math.trunc(panState.origin.y)}`
    }),
  ).subscribe();


  focusedObjectGetter$.pipe(
    tap(x => console.warn('[[ FOCUSED OBJECT GETTER ]]', x)),
    filter(_ => _),
    tap((focusedObject) => {
      DetailPane.name.textContent = focusedObject.id.slice(0, focusedObject.id.indexOf('-') + 3)
      DetailPane.selected.textContent = focusedObject.selected;
      DetailPane.focused.textContent = focusedObject.focused;
      DetailPane.xcoord.textContent = Math.trunc(focusedObject.x || 0);
      DetailPane.ycoord.textContent = Math.trunc(focusedObject.y || 0);
      DetailPane.width.textContent = Math.trunc(focusedObject.width || 0);
      DetailPane.height.textCqontent = Math.trunc(focusedObject.height || 0);
      // DetailPane.vertices.value = focusedObject.vertices
    }),
  ).subscribe();

  const canvasObjectsDrags = canvasObjects.map((obj, i) => {
    return draggable(scene, obj)
  });

  const pan$ = addPanAction(surfaceLayer);


  pan$.pipe().subscribe();


  tbObjects.addEventListener('pointerdown', e =>
  {
    e.preventDefault();
    e.stopPropagation();

    const tbObject = e.target.closest('.toolbox-object');

    if (tbObject) {
      const shapeName = tbObject.dataset.objectType;
      const pt = domPoint(scene, e.clientX, e.clientY);



      // const shapeObj = createSceneObject(scene,
      // {
      //   type: shapeName,
      //   dimensions: {
      //     r: 16,
      //     width: 16,
      //     height: 16,
      //   },
      //   attributes: {},
      //   point: { ...LocalVewportState.origin }
      // });

      sceneObjectsStore.dispatch(
        addObject({
          object: {
            id: shapeName + '-' + utils.uuid(),
            type: shapeName,
            dimensions: {
              r: 16,
              width: 16,
              height: 16,
            },
            attributes: {},
            point: LocalVewportState.origin,
          }
        }))

      // shapeObj.select()
      // focusObject(shapeObj.dom)
      // objectLayer.append(shapeObj.dom);

      // console.warn('[[ New Shape Object ]]: ', shapeObj);
    }
  }
  );

  toolbox.addEventListener('pointerdown', e => {
    const state = toolbox.dataset.expanded === 'true' ? true : false;
    toolbox.dataset.expanded = !state;
  });


  objectLayer.addEventListener('pointerdown', e => {
    const point = domPoint(scene, e.clientX, e.clientY)
    const targetObject = document.elementFromPoint(e.clientX, e.clientY)
      .closest('.object-container[data-selected="true"]')

    if (targetObject) {
      objectLayer.append(targetObject)

    }
  });


  // toolbox.addEventListener('pointermove', e => {
  //   if (selectedTbObject) {
  //     // draggable(scene, selectedTbObject.dom);
  //   }
  // });


  // tbObjects.addEventListener('pointerup', e => {
  //   if (selectedTbObject) {
  //     // objectLayer.append(selectedTbObject.dom);
  //     selectedTbObject = null;
  //   }
  // });




  objectLayer.addEventListener('click', (e) => {
    const target = e.target
    const t = target.closest('.object-container');
    const selector = target.closest('.object-selector');

    e.preventDefault();
    e.stopPropagation();

    if (selector) {}
    else if (!t) {}
    else if (t.dataset.focused !== 'true') {
      focusObject(t);
    }

    else if (t.dataset.selected !== 'true') {
      selectObject(t);
    }

    else if (t) {
      deselectObject(t)
    }
  });

  // objectLayer.addEventListener('click', e => {
  //   const t = e.target.closest('.object-container');
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (t) {
  //     const s = t.querySelector('.object-selector');

  //     if (s) {
  //       s.remove();

  //       if (t.stopDrag) {
  //         t.stopDrag();
  //       }
  //     }

  //     else {
  //       const sel = canvasTemplates
  //         .querySelector(`[data-template="object-selector"]`)
  //         .cloneNode(true);

  //       t.append(sel);

  //       t.stopDrag = draggable(scene, t);
  //     }
  //   }
  // });

})
//, 1000)