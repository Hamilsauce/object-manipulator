import { defineStore } from '../lib/rx-store.js';


const initialViewportState = {
  scale: 16,
  viewBox: {
    x: -36,
    y: -64,
    width: 72,
    height: 128,
  },
  origin: {
    x: 0,
    y: 0
  },
  viewport: {
    width: 412,
    height: 781,
  },
};


const sceneViewportReducer = (state, action) => {
  switch (action.type) {
    case '[ Pan Scene ]': {
      const { x, y } = action;
      if (!(x && y)) return { ...state };

      return {
        ...state,
        viewBox: { ...state.viewBox, x, y },
        origin: {
          ...state.origin,
          x: x - initialViewportState.viewBox.x,
          y: y - initialViewportState.viewBox.y,
        },
      };
    }
  }
};


export const getSceneViewportStore = defineStore('sceneViewport', {
  state: initialViewportState,
  reducer: sceneViewportReducer,
})