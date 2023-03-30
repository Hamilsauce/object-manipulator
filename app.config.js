// imp
import { SVGCanvas } from './components/SVGCanvas.js';
import { Scene } from './components/SVGScene.js';
// import { Hud } from './graphics-objects/index.js';
import { ObjectRegistry } from './graphics-objects/ObjectRegistry.js';


export const AppConfig = {
  type: 'app',
  name: 'app',
  // componentClass: Application,
  components: {
    canvas: {
      type: 'viewport',
      name: 'canvas',
      componentClass: SVGCanvas,
      viewBox: {
        x: 0,
        y: 0,
        width: 412,
        height: 781,
      },
      viewport: {
        width: 412,
        height: 781,
      },
      dimensions: {
        width: 412,
        height: 781,
      },
      origin: {
        x: 0,
        y: 0,
      },
      layers: {
        hud: {
          type: 'viewport-layer',
          name: 'hud',
          componentClass: ObjectRegistry.get('hud'),
          objects: {},
        },
        scene: {
          type: 'viewport',
          name: 'scene',
          componentClass: Scene,
          viewBox: {
            x: -36,
            y: -64,
            width: 72,
            height: 128,
          },
          viewport: {
            width: 412,
            height: 781,
          },
          dimensions: {
            width: 72,
            height: 128,
          },
          origin: {
            x: -36,
            y: -72,
          },
          layers: {},
        }
      }
    },
  },
}