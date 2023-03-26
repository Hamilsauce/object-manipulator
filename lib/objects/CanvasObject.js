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

  constructor(
    // instantiationKey,
    context, { type, dimensions, point, scale, template }
  ) {
    // if (!(instantiationKey === INSTANTIATION_KEY)) throw new Error('[ CanvasObject ]: ILLEGAL CONSTRUCTOR for Type ' + type);
    console.warn('+++++ CANVAS OBJECT', { point })
    super('shape', type);
  
    this.point = point;
    this.dimensions = dimensions;
    this.scale = scale;
    this.#context = context;
    this.#self = template //this.#context.assembleTemplate('shape', type);


    // this.attrs = attrs;

    // this.#canvas = context;
    console.log('Canvas Object this.#context', this.#context)
    // this.#self = this.#context.assembleTemplate('shape', type);

    // console.log('this.#self', this.#self)
    // Object.assign(this, attrs)

    this.self.id = this.objectId;
    console.log('point', point)
    this.transformList = new TransformList(this,
    {
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
          values: [1, 1],
        },
      ],
    })
  }

  create() {

  }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }

  get self() { return this.#self }

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

  translate({ x, y }) {
    this.transformList.translateTo(x, y);
  }

  translate({ x, y }) {
    this.transformList.translateTo(x, y);
  }
  rotate({ x, y }) {
    this.transformList.rotateTo(x, y);
  }
  scale({ x, y }) {
    this.transformList.scaleTo(x, y);;
  }
}