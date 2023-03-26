import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { AppObject } from './AppObject.js';
import { CanvasObject } from './CanvasObject.js';
import { ObjectMap } from './object-map.js';
const { utils } = ham;

export const ViewportConfig = {
  scale: 1,
  width: 412,
  height: 781,
  viewBox: {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  }
};

export class SVGViewport extends CanvasObject {
  // #self = null;
  // #context = null;
  #objects = new Map();
  // #scale = 0;
  // #dimensions = {
  //   width: 72,
  //   height: 128,
  // };
  // #origin = {
  //   x: 0,
  //   y: 0,
  // };

  constructor(context, name, options = ViewportConfig) {
    if (typeof name !== 'string' || !context) throw new Error('Invalid args passed to Viewport Constructor. Args: ' + JSON.stringify({ name, context, options }, null, 2));
    // consol_e.log(context, { ...options, name });
    super(context, { ...options, name });

    const { template, width, height, viewBox, scale } = options
    this._scale = options.scale || 17
    // this.#scale = scale;

    // consol_e.log('SVGVIEWPORT', this);
  };

  get dom() {
    return this.self;
  }

  // get context() {
  //   return this.#context;
  // }

  get objects() {
    return this.#objects;
  }

  // get scale() {
  //   return this.#scale;
  // }

  get origin() {
    return this.point;
  }

  get viewBox() {
    return this.self.viewBox.baseVal;
  }

  get width() { return this.self.width }

  get height() { return this.self.height.baseVal.value }

  get templates() { return this.selectDOM(`#${this.id}-templates`) };

  createSVGTransform() { return this.self.createSVGTransform() }

  setProps({ width, height, viewBox, scale }) {
    this.self.width.baseVal.value = width ? width : window.innerWidth;
    this.self.height.baseVal.value = height ? height : window.innerHeight;
  }

  setDimensions({ width, height }) {
    this.self.width.baseVal.value = width ? width : window.innerWidth;
    this.self.height.baseVal.value = height ? height : window.innerHeight;
  }

  pan(x, y) {
    this.viewBox.x = x;
    this.viewBox.y = y;

    return this;
  }

  zoom(width, height) {
    this.setDimensions({ width, height })

    return this;
  }

  resize(width, height) {
    this.setDimensions({ width, height })

    return this;
  }

  getTemplate(objectType) {
    const container = this.templates.querySelector('.object-container').cloneNode(true);

    const obj = this.templates.querySelector(`[data-object-type="${objectType}"]`).cloneNode(true);

    container.dataset.objectType = objectType;
    container.dataset.type = objectType;

    container.querySelector('.object-slot').append(obj)

    return container;
  }

  addObject() {}

  createObject(type, options) {
    if (!type) return;
    // consol_e.log('this', this)
    // consol_e.log('type', type)
    const template = this.getTemplate(type);

    const ObjectClass = ObjectMap.get(type);

    if (ObjectClass) {
      options = options ? { ...options, template } : {
        dimensions: {
          width: 16, //this.scale,
          height: 16, //this.scale,
        },
        point: this.origin,
        template,
      }

      const newObj = new ObjectClass(this, options);

      return newObj;
    }
  }

  mountObject(newObject, parentObjectOrSelector) {

    if (!parentObjectOrSelector) {
      this.append(newObject);
    }

    else if (typeof parentObjectOrSelector === 'string') {
      const parent = this.selectDOM(parentObjectOrSelector);
      parent.append(newObject.dom);
    }

    else if (parentObjectOrSelector.dom) {
      this.insertInto(newObject, parentObjectOrSelector);
    }

    else if (parentObjectOrSelector instanceof Element) {
      console.warn('newObject, parentObjectOrSelector', { newObject, parentObjectOrSelector })
      this.insertInto(newObject, parentObjectOrSelector);
    }
    else {
      // consol_e.warn('Viewport.MountObject - couldnt attach to parent');
      // consol_e.log('parentObjectOrSelector', parentObjectOrSelector)
      // consol_e.log('newObject', newObject)
    }

    return newObject;
  }

  append(object) {
    if (object && object.dom) {
      this.self.append(object.dom)
    }
  }

  insertInto(object, newParentObject, index) {
    if ((object && object.dom) && (newParentObject && newParentObject.dom) && isNaN(index)) {
      newParentObject.dom.append(object.dom)
    }
    else if ((object && object.dom) && (newParentObject instanceof Element) && isNaN(index)) {
      console.log('APPENDING OBJ.DOM TO DOM ELEMENT', { parentId: newParentObject.id, objId: object.dom });
      newParentObject.append(object.dom)
    }
    else if ((object && object.dom) && (newParentObject instanceof Element) && !isNaN(index)) {
      newParentObject.insertAdjacentElement(index, object.dom)
    }
  }

  injectDOM(child, parent) {
    if (child instanceof Element && parent instanceof Element) {
      parent.append(child);
    }
  }

  selectDOM(selector, selectAll = false) {
    if (selectAll) {
      return [...this.self.querySelectorAll(selector)];
    }

    return this.self.querySelector(selector);

    return result.length === 1 ? result[0] : result;
  }
}