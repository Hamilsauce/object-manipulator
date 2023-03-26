import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils } = ham;

export const OBJECT_TYPES = new Set([
  'canvas',
  'scene',
  'shape',
  'entity',
  'rect',
  'circle',
  'triangle',
  'line',
  'point',
  'edge',
  'viewport',
]);

export class AppObject {
  #objectType;
  #id;
  #type;

  constructor(objectType, type) {
    if (!type || !objectType || !OBJECT_TYPES.has(objectType)) throw new Error('Invalid or no name or type passed to constructor for ' + this.constructor.name + ': ' + JSON.stringify({ objectType, type }, null, 2));

    this.#objectType = objectType;

    this.#type = type;

    this.#id = AppObject.uuid(type)
  };

  get id() { return this.#id };

  get objectType() { return this.#objectType };

  get type() { return this.#type };

  static uuid(type) {
    return `${type.toLowerCase()}-${utils.uuid()}`;
  }

  create() {}

  insertDOM() {}
};