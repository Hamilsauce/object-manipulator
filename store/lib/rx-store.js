const { BehaviorSubject, Subject } = rxjs
const { startWith, shareReplay, distinctUntilChanged, tap, map, scan } = rxjs.operators;

/*  */


const AUTH_KEY = '123';

const StoreOptionsDef = {
  state: Object,
  reducer: Function,
  getters: Object,
  isDef: true,
}

class BhsStore extends BehaviorSubject {
  #name = null;
  #reducer = null;
  #getters = {};
  #updateSubject$ = new Subject();
  #reducePipe$ = null;
  #stateSubscription = null;

  constructor(name, { state, reducer, getters, isDef } = StoreOptionsDef) {
    if (!(name && state && reducer) || isDef) throw new Error('Missing something in BhsStore Construxtor');

    super(state);

    this.#name = name;

    this.#reducer = reducer;
    this.#reducePipe$ = this.#updateSubject$
      .pipe(
        map(action => this.#reducer(this.snapshot(), action)),
        tap(newState => this.next(newState, AUTH_KEY)),
        tap(x => window.appState = { ...(window.appState || {}), ...x }),
      );

    if (getters) {
      Object.entries(getters).forEach(([key, selectorFn], i) => {
        this.#getters[key] = this.select(selectorFn)
      });
    }

    this.#stateSubscription = this.#reducePipe$.subscribe();
  }

  get name() { return this.#name }

  get getters() { return this.#getters }

  dispatch(action) {
    if (!action.type) return;

    this.#updateSubject$.next(action);
  }

  snapshot(selectorFn) {
    return { ...(selectorFn ? selectorFn(this.getValue()) : this.getValue()) };
  }

  select(selectorFn = (state) => state) {
    return this.asObservable()
      .pipe(
        map(selectorFn),
        distinctUntilChanged( /* Put something good here */ ),
        shareReplay(1),
      );
  }

  next(newValue, authKey) {
    if (authKey != AUTH_KEY || typeof newValue != 'object') throw new Error('ILLEGAL CALL TO STORE.NEXT OR INVALID VALUE PASSED TO STORE.UPDATE');

    super.next(newValue);
  }

  #assign(newValue) {
    if (typeof newValue != 'object') throw new Error('NEW VALUE PUSHED ISNT OBJECT. FAILED IN ASSIGNG, VALUE: ' + newValue);

    return { ...this.getValue(), ...newValue }
  }
}


class StoreRegistery extends Map {
  constructor() {
    super();
  }

  set(name, options) {
    if (!(name && options)) throw new Error('Invalid name or state passed to store');

    super.set(name, new BhsStore(name, options));
  }
}


const storeRegistery = new StoreRegistery();


export const defineStore = (name, storeOptions = StoreOptionsDef) => {
  if (!storeRegistery.has(name)) {
    storeRegistery.set(name, storeOptions);
  }

  return () => storeRegistery.get(name);
}






/* 
 * WIP 
 */

const TODO_createReducer = (name, storeOptions = StoreOptionsDef) => {
  if (!storeRegistery.has(name)) {
    storeRegistery.set(name, storeOptions);
  }

  return () => storeRegistery.get(name);
}

// export const defineStoreNoOptions = (name, reducer) => {
//   if (!storeRegistery.has(name)) {
//     storeRegistery.set(name, reducer);
//   }

//   return () => storeRegistery.get(name);
// }