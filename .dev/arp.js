import { getArpRhythm } from '../lib/create-rhythm.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const arpOutput = document.querySelector('#arp-output')
const containers = document.querySelectorAll('.container')



const ctx = new AudioContext();

const osc1 = new OscillatorNode(ctx, {
  frequency: 220,
  type: 'triangle',
})

const gain1 = new GainNode(ctx, {
  gain: 0.3,
});

osc1.connect(gain1)
osc1.start(0);
// gain1.connect(ctx.destination);

let cnt = 0;

getArpRhythm()
  .pipe(
    // map(x => x.frequency),
    tap(({ frequency }) => osc1.frequency.value = frequency),
    tap(({ frequency, pitch }) => {
      arpOutput.innerHTML = `${arpOutput.innerHTML}${['C2','C3','C4', 'C5'].includes(pitch) ? '\n\n': ' '}${pitch}`.trim()
    }),
    tap(() => cnt = cnt >= 3 ? 0 : cnt + 1),
  )
  .subscribe()