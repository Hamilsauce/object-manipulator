import { createAction } from '../lib/create-action.js';
// import { SceneObject } from '../../lib/objects/SceneObject.js';
export const SCENE_ACTION_MAP = {}

export const addObject = createAction(
  '[ Add Object ]', {
    object: Object
  },
)

export const addSelectedObjects = createAction(
  '[ Select Objects ]', {
    ids: Array
  },
)

export const removeSelectedObjects = createAction(
  '[ Deselect Objects ]', {
    ids: Array
  },
)

export const setFocusedObject = createAction(
  '[ Focus Object ]', {
    id: String
  }
)