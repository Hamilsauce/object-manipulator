import { Scene } from '../scene/Scene.js';
import { SVGViewport } from '../SVGViewport.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils, template } = ham;



export const CanvasConfig = {
  objectType: 'viewport',
  name: 'canvas',
  scale: 1,
  width: 412,
  height: 781,
  viewBox: {
    x: -36,
    y: -64,
    width: 72,
    height: 128,
  },
  components: {
    scene: {
      objectType: 'viewport',
      name: 'scene',
      scale: 16,
      width: 412,
      height: 781,
      viewBox: {
        x: -36,
        y: -64,
        width: 72,
        height: 128,
      },
      layers: {
        surface: {
          objectType: 'layer',
          name: 'surface',
        },
        objects: {
          objectType: 'layer',
          name: 'objects',
        },
      },
    },
    hud: {
      objectType: 'component',
      name: 'hud',
      widgets: {
        panes: {
          detail: null,
          origin: null,
        },
        toolbox: null,
      },
    },
  },
};

export const OBJECT_TYPES = new Set(['view', 'model'])

export class SVGCanvas extends SVGViewport {
  #scene;
  #hud;

  constructor(name, context, options = CanvasConfig) {
    super('canvas', context, options)

    const sceneContainer = this.selectDOM('[data-component-container="scene"]');

    this.containers.scene.append(template('scene'))

    this.#scene = new Scene(this, {
      ...options.scene,
      template: this.selectDOM('#scene')
    });
  }

  get containers() {
    return {
      scene: this.selectDOM('[data-component-container="scene"]'),
      hud: this.selectDOM('[data-component-container="hud"]'),
    }
  }

  get scene() { return this.#scene }

  get hud() { return this.selectDOM('#hud') }

  handleToolboxClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const tbObject = e.target.closest('.toolbox-object');

    if (tbObject) {
      const shapeName = tbObject.dataset.objectType;
      const pt = domPoint(scene, e.clientX, e.clientY);

this.scene.addObject()
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
};