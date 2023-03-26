import { defineStore } from '../lib/rx-store.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const testObject1 = {
  id: 'testObject1',
  type: 'circle',
  point: {
    x: 10,
    y: -10,
  },
  dimensions: {
    width: 16,
    height: 16,
  },
  selected: false,
  focused: false,
};

const initialScenObjectState = {
  objects: { testObject1 },
  objectIndex: [],
  selectedObjectIds: [],
  focusedObjectId: null,
};


const sceneObjectsReducer = (state, action) => {
  switch (action.type) {
    case '[ Add Object ]': {
      const { object } = action;
      
      // console.log('{{{{{ STORE object', object)

      if (!object) return { ...state };
      // object.id = object.id ? object.id : utils.uuid()
      // const cleanedIds = ids.filter(id => !state.selectedObjectIds.includes(id));

      return {
        ...state,
        objects: { ...state.objects, [object.id]: object },
      };
    }

    case '[ Select Objects ]': {
      const { ids } = action;

      if (!ids) return { ...state };

      const cleanedIds = ids.filter(id => !state.selectedObjectIds.includes(id));

      return {
        ...state,
        selectedObjectIds: [...state.selectedObjectIds, ...cleanedIds],
      };
    }

    case '[ Deselect Objects ]': {
      const { ids } = action;

      if (!ids) return { ...state };

      return {
        ...state,
        selectedObjectIds: state.selectedObjectIds.filter(id => !ids.includes(id)),
      };
    }

    case '[ Focus Object ]': {
      const { id } = action;

      if (!id) return { ...state };
      const target = state.objects[id]

      return {
        ...state,
        focusedObjectId: id,
      };
    }

    default:
      return state;
  }
};


export const getSceneObjectsStore = defineStore('sceneObjects', {
  state: initialScenObjectState,
  reducer: sceneObjectsReducer,
  getters: {
    _objects: ({ objects }) => objects,
    objects: ({ objects }) => Object.values(objects).map(_ => ({ id: _.id, object: _ })),
    focusedObject: ({ objects, focusedObjectId }) => objects[focusedObjectId],
    selectedObjects: ({ objects, selectedObjectIds }) => selectedObjectIds.map(id => objects[id]),
  },
})