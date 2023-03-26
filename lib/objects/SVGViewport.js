import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { AppObject } from './AppObject.js';
import { SceneObject } from './SceneObject.js';
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

export class SVGViewport extends AppObject {
  #self = null;
  #context = null;
  #objects = new Map();
  #scale = 16;
  #dimensions = {
    width: 72,
    height: 128,
  };
  #origin = {
    x: 0,
    y: 0,
  };


  constructor(name, context, options = ViewportConfig) {
    if (typeof name !== 'string' || !context) throw new Error('Invalid args passed to Viewport Constructor. Args: ' + JSON.stringify({ name, context, options }, null, 2));

    super('viewport', name);

    const { template, width, height, viewBox, scale } = options

    this.#self = template

    this.#context = context;

  };

  get dom() {
    return this.#self;
  }

  get context() {
    return this.#context;
  }

  get objects() {
    return this.#objects;
  }

  get name() {
    return this.type;
  }

  get origin() {
    return this.#origin;
  }

  get scale() {
    return this.#scale;
  }

  get viewBox() {
    return this.#self.viewBox;
  }

  get width() { return this.#self.width }

  get height() { return this.#self.height.baseVal.value }

  get templates() { return this.selectDOM(`#${this.name}-templates`) };

  createSVGTransform() { return this.#self.createSVGTransform() }

  setProps({ width, height, viewBox, scale }) {
    this.#self.width.baseVal.value = width ? width : window.innerWidth;
    this.#self.height.baseVal.value = height ? height : window.innerHeight;
  }

  setDimensions({ width, height }) {
    this.#self.width.baseVal.value = width ? width : window.innerWidth;
    this.#self.height.baseVal.value = height ? height : window.innerHeight;
  }

  pan(width, height) {
    this.setDimensions({ width, height })

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

  createObject(options) {
    console.log('options', options)
    const type = options.type
    if (!type) return;

    const template = this.getTemplate(type);
    const TypeClass = ObjectMap.get(type);

    if (TypeClass) {
      const newObj = new TypeClass(this, { ...options, template } || {
        type,
        dimensions: {
          width: this.scale,
          height: this.scale,
        },
        point: this.origin,
        template,
      });

      return newObj;
    }
  }

  mountObject(newObject, parentObjectOrSelector) {
    console.warn('newObject, parentObjectOrSelector', { newObject, parentObjectOrSelector })

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
      this.insertInto(newObject, parentObjectOrSelector);
    }
    else {
      console.warn('Viewport.MountObject - couldnt attach to parent');
      console.log('parentObjectOrSelector', parentObjectOrSelector)
      console.log('newObject', newObject)
    }

    return newObject;
  }

  append(object) {
    if (object && object.dom) {
      this.#self.append(object.dom)
    }
  }

  insertInto(object, newParentObject, index) {
    if ((object && object.dom) && (newParentObject && newParentObject.dom) && isNaN(index)) {
      newParentObject.dom.append(object.dom)
    }
    else if ((object && object.dom) && (newParentObject instanceof Element) && isNaN(index)) {
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

    return this.#self.querySelector(selector);

    return result.length === 1 ? result[0] : result;
  }
}