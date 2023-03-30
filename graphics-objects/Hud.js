import { ViewportLayer } from './ViewportLayer.js';
import { ObjectRegistry } from './ObjectRegistry.js';

const CanvasOptions = {
  type: 'viewport',
  name: 'canvas',
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
    // hud: {},
    scene: {
      type: 'viewport',
      name: 'scene',
      fuck: 'me',
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
      layers: {
        surface: null,
        objects: null,
      },
    }
  }
};

export class Hud extends ViewportLayer {
  constructor(context, options) {
    super(context, 'hud', { ...options, id: 'hud' });

    this.slotObject('hud');
    this.removeDOM('.overlay-slot');
    // this.removeDOM('.selection-slot');
    const [originElX, originElY] = [...this.querySelectorAll('#origin-coords-content text')];

    this.originElX = originElX
    this.originElY = originElY

    this.widgets.toolbox.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()

      const targ = e.target.closest('g.toolbox-object')

      if (targ) {
        const type = targ.dataset.objectType
        if (type) {
          console.log('type', type)
          this.emit(type, e);
        }
      }
      else {
        const expanded = this.widgets.toolbox.dataset.expanded === 'true' ? true : false
        console.log('expanded', expanded)
        this.widgets.toolbox.dataset.expanded = !expanded;
      }
    });
  }

  get widgets() {
    return {
      toolbox: this.querySelector('#toolbox'),
    }
  }

  emit(label, e) {
    const { x, y } = this.adaptEvent(e);

    this.self.dispatchEvent(new CustomEvent('createobject', {
      bubbles: true,
      detail: { action: label, objectId: this.id, object: this, x, y, type: e.type }
    }));
  }

}