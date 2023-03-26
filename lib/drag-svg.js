const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;



const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}

const getPointFromEvent = ({ target, clientX, clientY } = new PointerEvent()) => {

  const t = target.closest('.audio-node')
  if (!t) {
    console.log('target, clientX, clientY', target, clientX, clientY)
    const pt = domPoint(target.closest('svg'), clientX, clientY);
    return {
      target,
      x: pt.x,
      y: pt.y,
    }
  }

  const body = t.querySelector('.node-body')

  const { width, height } = body.getBoundingClientRect();

  const pt = domPoint(target.closest('svg'), clientX - (width / 2), clientY - (height / 2));

  return {
    target: t,
    x: pt.x,
    y: pt.y,
  }
};

const translateToPoint = ({ target, x, y }) => {
  // const t = target.closest('.audio-node')
  // if (!t) return { target, x, y };

  // const body = t.querySelector('.node-body')

  // const { width, height } = body.getBoundingClientRect();

  target.setAttribute('transform', `translate(${x}, ${y})`);

  return { target, x, y };
}


export const addDrag = (target, callback) => {
  console.log('target', target)
  const drag$ = fromEvent(document.querySelectorAll('.audio-node'), 'pointerdown')
    .pipe(
      // tap(x => console.log('x', x.target)),
      filter(e => e.target.closest('.audio-node')),
      map(getPointFromEvent),
      tap(pt => callback({ drag: 'start', ...pt })),
      switchMap(startPoint => fromEvent(target, 'pointermove')
        .pipe(
          map(getPointFromEvent),
          tap(translateToPoint),
          tap(pt => callback({ drag: 'move', ...pt })),
          switchMap(endPoint => fromEvent(target, 'pointerup')
            .pipe(
              map(getPointFromEvent),
              tap(translateToPoint),
              tap(pt => callback({ drag: 'end', ...pt })),

            ),
          ),
        ),
      ),
    );
  return drag$;
};