import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { SceneObject } from './objects/SceneObject.js';

const SceneObjectOptions = {
  type: 'rect',
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}

export const createSceneObject = (sceneContext, {
  type,
  point,
  dimensions,
  attributes,
  isInterface,
} = SceneObjectOptions) => {
  if (isInterface) throw new Error('Invalid Options passed to Create Scene Object');

  const ctx = sceneContext;

  const sceneTemplates = ctx.querySelector('#scene-templates');

  const container = sceneTemplates.querySelector('.object-container').cloneNode(true);

  const obj = sceneTemplates.querySelector(`[data-object-type="${type}"]`).cloneNode(true);

  container.querySelector('.object-slot').append(obj)

  container.setAttribute('transform', `translate(${point.x},${point.y})`);

  container.dataset.type = type;

  container.dataset.objectType = type;

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

  return new SceneObject(sceneContext, {
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