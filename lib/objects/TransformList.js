import { roundTwo } from '../utils.js';
const TransformListOptions = {
  transforms: Array,
}

const TransformMatrixMap = {
  e: 'tx',
  f: 'ty',
}

const DEFAULT_TRANSFORMS = {
  transforms: [
    {
      type: 'translation',
      values: [0, 0],
    },
    {
      type: 'rotate',
      values: [0, 0, 0],
    },
    {
      type: 'scale',
      values: [1, 1],
    },
  ]
};

export class TransformList {
  #self = null;
  #context = null;
  #transforms = null;
  #transformMap = new Map();

  constructor(contextObject, { transforms } = DEFAULT_TRANSFORMS) {
    this.#context = contextObject;
    console.log('transforms', transforms)
    this.#self = contextObject.dom.transform.baseVal;

    this.init(transforms);
  };

  init(transforms = []) {
    transforms.forEach(({ type, values }, i) => {
      const t = this.createTransform(type, ...(values || []))

      if (i === 0) {
        this.#self.initialize(t);
      }
      else {
        this.insert(t);
      }
    });
  }



  getMatrixAt(index = 0) {
    const { a, b, c, d, e, f } = index < this.#self.numberOfItems ? this.#self.getItem(index).matrix : null;

    return [a, b, c, d, e, f].some(_ => isNaN(_)) ? null : { a, b, c, d, e, f, }
  }

  createTransform(type, ...values) {
    const t = this.#context.createSVGTransform();

    switch (type) {
      case 'translate': {
        t.setTranslate(...values);
        break;
      }
      case 'rotate': {
        t.setRotate(...values);
        break;
      }
      case 'scale': {
        t.setScale(...values);
        break;
      }
      default: {}
    }

    return t;
  }

  consolidate() {
    return this.#self.consolidate();
  }

  translateTo(x = 0, y = 0) {
    this.#self.replaceItem(this.createTransform('translate', x, y), 0);

    return this;
  }

  rotateTo(deg = 0, x = 0, y = 0) {
    this.#self.replaceItem(this.createTransform('rotate', deg, x, y), 1);

    return this;
  }

  scaleTo(x = 1, y = 1) {
    this.#self.replaceItem(this.createTransform('scale', deg, x, y), 2);

    return this;
  }

  insert(transform, beforeIndex) {
    if (!beforeIndex) {
      this.#self.appendItem(transform)
    } else {
      this.#self.insertItemBefore(transform, beforeIndex)
    }

    return this;
  }

  getItem(index) {
    return this.#self.getItem(index)
  }

  get transforms() {
    return {
      translate: this.getItem(0),
      rotate: this.getItem(1),
      scale: this.getItem(2),
    }
  }

  get transformItems() { return [...this.#self] };


  get translation() {
    return {
      x: roundTwo(this.getMatrixAt(0).e),
      y: roundTwo(this.getMatrixAt(0).f),
    }
  }

  get rotation() {
    return {
      x: roundTwo(this.getMatrixAt(1).b),
      y: roundTwo(this.getMatrixAt(1).c),
    }
  }

  get scale() {
    return {
      x: roundTwo(this.getMatrixAt(2).a),
      y: roundTwo(this.getMatrixAt(2).d),
    }
  }
}