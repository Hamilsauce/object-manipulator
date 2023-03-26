import { createAction } from '../lib/create-action.js';

export const SCENE_ACTION_MAP = {
  
}

export const updateSceneOrigin = createAction(
  '[ Pan Scene ]', {
    x: Number,
    y: Number,
  }
)

export const updateOscillator = createAction(
  'oscillator', {
    oscillator: Object,
  }
)

export const updateDelay = createAction(
  'delay', {
    time: Number,
    // level:  Number,
  }
)

export const updateWarbler = createAction(
  'warbler', {
    active: Boolean,
    // time:  Number,
    // level:  Number,
  }
)