import { AppObject } from './AppObject.js';
import { TransformList } from './TransformList.js';


const ShapeTypeMap = new Map()

const INSTANTIATION_KEY = '124';
// instantiationKey
const CanvasObjectOptions = {
  type: 'rect',
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}

export class CanvasObject extends AppObject {
  #self;
  #canvas;
  #context;
  #scale = 0;
  #point = { x: 0, y: 0 };
  #dimensions = { width: 0, height: 0 };
  #name = null

  constructor(
    // instantiationKey,
    context, { type, dimensions, point, template, name,scale }
  ) {
    // if (!(instantiationKey === INSTANTIATION_KEY)) throw new Error('[ CanvasObject ]: ILLEGAL CONSTRUCTOR for Type ' + type);
    // consol_e.warn('+++++ CANVAS OBJECT', { type, dimensions, point, template, name,scale })
    // consol_e.log('type, name', type, name)
    super(type, name);

    this.#point = point;
    this.#dimensions = dimensions;
    this.#scale = type === 'viewport' ? scale : context.scale;
    this.#context = context;
    this.#self = template;

    this.self.id = name ? name : this.objectId;

    this.transformList = new TransformList(this, {
      transforms: [
        {
          type: 'translate',
          values: [this.point.x, this.point.y],
        },
        {
          type: 'rotate',
          values: [0, 0, 0],
        },
        {
          type: 'scale',
          values: [this.scale, this.scale],
        },
      ],
    })
  }

  create() {

  }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }

  get name() { return this.#name }
  get self() { return this.#self }

  get point() { return this.#point }

  get dimensions() { return this.#dimensions }

  get scale() { return this.#scale }

  get transforms() { return this.self.transform.baseVal }

  get dom() { return this.self }

  get dataset() { return this.self.dataset }

  set dataset(propMap) { Object.entries(propMap).forEach(([prop, value]) => this.dataset[prop] = value) }

  get classList() { return this.self.classList }

  set classList(val) { this.self.classList.add(...val) }

  get id() { return this.self.id }

  // get canvas() { return this.#canvas }

  get radiusX() { return this.width / 2 }

  get radiusY() { return this.height / 2 }

  get centroid() {
    return {
      x: this.x ? this.x + this.radiusX : this.cx + this.radiusX,
      y: this.y ? this.y + this.radiusY : this.cy + this.radiusY,
      // y: this.y + this.radiusY,
    }
  }

  get x() { try { return this.transforms[0].matrix.e } catch (e) { return null } }


  set x(val) { this.value.x.baseVal.value = val }

  get y() { try { return this.transforms[0].matrix.f } catch (e) { return null } }

  set y(val) { this.value.y.baseVal.value = val }

  get cx() { try { return this.transforms[0].matrix.e } catch (e) { return null } }

  get cy() { try { return this.transforms[0].matrix.f } catch (e) { return null } }

  get r() { try { return this.value.r.baseVal.value } catch (e) { return null } }

  set r(val) { this.value.r.baseVal.value = val }

  get height() { try { return this.value.height.baseVal.value } catch (e) { return null } }

  set height(val) { this.value.height.baseVal.value = val }

  get width() { try { return this.value.width.baseVal.value } catch (e) { return null } }

  set width(val) { this.value.width.baseVal.value = val }

  get x1() { try { return this.value.x1.baseVal.value } catch (e) { return null } }

  get y1() { try { return this.value.y1.baseVal.value } catch (e) { return null } }

  get x2() { try { return this.value.x2.baseVal.value } catch (e) { return null } }

  get y2() { try { return this.value.y2.baseVal.value } catch (e) { return null } }

  get fill() { return this.self.getAttribute('fill') }

  set fill(val) { this.value.setAttribute('fill', val) }

  setStyle(styleObject = {}) {
    Object.assign(this.body.style, styleObject)
  }

  createSVGTransform() { return this.#context.createSVGTransform() }

  selectDOM(selector) {
    const result = [...this.self.querySelectorAll(selector)];

    return result.length === 1 ? result[0] : result;
  }

  translateTo({ x, y }) {
    this.transformList.translateTo(x, y);
  }
  rotateTo({ x, y }) {
    this.transformList.rotateTo(x, y);
  }

  scaleTo({ x, y }) {
    this.transformList.scaleTo(x, y);;
  }
}