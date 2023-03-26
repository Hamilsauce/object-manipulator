import { SVGCanvas } from './canvas/SVGCanvas.js';
import { ApplicationConfig } from '../config/app.config.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { utils, template } = ham;


const { combineLatest, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { sampleTime, takeWhile, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

/*
 * Application - Root Component
    - Initializes App Level Components and dependencies; 
    - Provides global context
    - Window adapter;
*/


const ApplicationOptions = {
  canvas: SVGCanvas,
}


export class Application extends HTMLElement {
  #canvas = null;
  #components = {};

  constructor(canvas, { type, name, components } = ApplicationConfig) {
    super();
    this.type = type;
    this.name = name;
    this.#components = components;
    
    this.append(template(name));

    this.body.append(template('canvas'));
    this.#canvas = new SVGCanvas(this, {
      ...components.canvas,
      template: this.querySelector('#canvas'),
    });


    this.autoSize(true);

    // console.warn({ Application: this });
  }

  get canvas() { return this.#canvas }

  get body() { return this.querySelector('#app-body'); }

  get width() { return this.body.getBoundingClientRect().width }

  get height() { return this.body.getBoundingClientRect().height }

  get components() {
    return {
      canvas: this.#canvas,
      hud: null,
    }
  }


  initialize(callback = (application = new Application) => {}) {
    callback(this);
  }

  initScene$() {
    this.scene$ = combineLatest(
      this.paddleLeft.position$,
      this.paddleRight.position$,
      this.ball.position$,
      (paddleLeft, paddleRight, ball) => ({ paddleLeft, paddleRight, ball })
    ).pipe(
      sampleTime(40),
      takeWhile(() => !this.outOfBounds),
      map(({ paddleLeft, paddleRight, ball }) => {
        return { paddleLeft, paddleRight, ball }
      }),
      map(this.detectCollision.bind(this)),
    );

    this.scene$.subscribe();
  }

  autoSize(resizeCanvas = true) {
    this.setStyle({
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
    });

    if (resizeCanvas) {
      this.#canvas.setDimensions({
        width: this.width,
        height: this.height,
      })
    }
  }

  setStyle(styleObject = {}) {
    Object.assign(this.body.style, styleObject)
  }

  $(selector) {}
}

customElements.define('app-component', Application)