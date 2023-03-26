import { CanvasObject } from './CanvasObject.js';

/*
 * Scene Object 
    - Selectable
    - Draggable
    - Editable
    - Composable
*/

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


const ShapeTypeMap = new Map()

export class SceneObject extends CanvasObject {

  constructor(context, type, { dimensions, point, template }) {
    console.warn('SCENE OBJEXT context, type, dimensions, point', context, type, dimensions, point)
    super(context, { type, dimensions, point, template, });

    if (this.type === 'triangle') {
      const d = this.value.getAttribute('d')

      console.log({
        TRI: this.value,
        d,
        D: d.split(' ')
          .map(_ => {
            console.log('_', _)
            return _.split(',')
          })
          .filter(([x, y]) => !isNaN(x) && !isNaN(y))
          .map(([x, y]) => ({
            x: +x,
            y: +y,
          }))
      });
    }
  }

  get object() { return this.slots.object.firstElementChild; }

  get value() { return this.slots.object.firstElementChild; }

  get selected() { return this.dataset.selected === 'true' ? true : false; }

  get focused() { return this.dataset.focused === 'true' ? true : false; }

  get selector() { return this.slots.overlay.querySelector('.object-selector'); }

  get boundingRect() {
    return this.selectDOM('.object-bounds');
  }

  get width() {
    return this.boundingRect.width.baseVal.value;
  }

  get height() {
    return this.boundingRect.height.baseVal.value;
  }

  get slots() {
    return {
      object: this.selectDOM('.object-slot'),
      overlay: this.selectDOM('.overlay-slot'),
    }
  }

  select() {
    this.dataset.selected = true;
  }
  deselect() {
    this.dataset.selected = false;
    this.dataset.focused = false;
  }
  focus() {
    this.dataset.focused = true;
  }
  unfocus() {
    this.dataset.focused = false;
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



  static _create(context, { type, template, point, dimensions, isInterface, } = SceneObjectOptions) {
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

  getTemplate(objectType) {
    const container = this.templates.querySelector('.object-container').cloneNode(true);

    const obj = this.templates.querySelector(`[data-object-type="${type}"]`).cloneNode(true);

    container.dataset.type = type;

    container.querySelector('.object-slot').append(obj)

    return container;
  }

}