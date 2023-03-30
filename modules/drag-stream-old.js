const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export const pointerStream = (el, startHandler, moveHandler, endHandler) => {
  return fromEvent(el, 'pointerdown')
    .pipe(map(startHandler))
    .pipe(switchMap(e => fromEvent(document, 'pointermove').pipe(map(moveHandler))
      .pipe(switchMap(e => fromEvent(document, 'pointerup').pipe(map(endHandler))))
    ))
}
