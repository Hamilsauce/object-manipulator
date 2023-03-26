import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils } = ham;

export const OBJECT_TYPES = new Set([
  'app',
  'app-component',
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
  #id;
  #type;
  #name;

  constructor(type, name) {
    if (!type || !OBJECT_TYPES.has(type)) throw new Error('Invalid or no name or type passed to constructor for ' + this.constructor.name + ': ' + JSON.stringify({ name, type }, null, 2));

    // this.#objectType = type;
// consol_e.log('App Object', {type, name});
    this.#type = type;
    this.#name = name;

    this.#id = name ? name : AppObject.uuid(type)
  };

  get id() { return this.#id };

  get name() { return this.#id };

  // get objectType() { return this.#type };

  get type() { return this.#type };

  static uuid(type) {
    return `${type.toLowerCase()}-${utils.uuid()}`;
  }

  create() {}

  insertDOM() {}
};