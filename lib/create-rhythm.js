const { range, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { window, mergeAll, take, throttleTime, startWith, bufferCount, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

import { noteDataSets } from '../data/notes.data.js';
const { getArpeggio, getTriad, frequencyMap, pitchMap, noteArray } = noteDataSets
// getArpeggio()
/*
  Bars and Beats
  
  BARS
    - Triggered by Start Events or by Bar Completing
    - A Bar Triggers Beats (Beats per bar)
    - Completion of last beat completes Bar
  
*/

const _state = {
  tempo: 140,
  beats: 4,
  noteValue: 4,
  baseNote: 'C2'
}


const secondsToMilli = (seconds) => seconds * 1000;


const getBeatDuration = (tempo) => {
  return (60 / tempo) / _state.noteValue;
};

const getBarDuration = (tempo, beats) => {
  return getBeatDuration(tempo) * beats;
};


const range$ = range(1, 4)


export const beats$ = interval(secondsToMilli(getBeatDuration(_state.tempo)))

// export const bars$ = interval(secondsToMilli(getBarDuration(_state.tempo, _state.beats))).pipe(
//     scan((p, c) => p + 1, 0),
//     tap(x => console.warn('[ BAR ' + x + ' ]')),
//     map(() => getTriad(_state.baseNote, 4)),
//     switchMap(arpNotes => beats$
//       .pipe(
//         startWith(0),
//         scan((p, c) => p + 1, 0),
//         filter(_ => _ <= 2),
//         tap(x => console.log('\t[ ' + (x) + ' ] ' + ' ' + (arpNotes[x] || {}).frequency)),
//       ),
//     )
//   );
let cnt = 0;
export const getArpRhythm = (osc) => {
  return interval(secondsToMilli(getBarDuration(_state.tempo, _state.beats)))
    .pipe(
      scan((p, c) => p + 1, 0),
      map(() => getTriad(_state.baseNote, 3)),
      tap(triad => {
        if (triad[0].pitch === 'C4') {
          _state.baseNote = 'C2'
        } else {
          _state.baseNote = triad[1].pitch
        }
      }),
      switchMap(arpNotes => beats$
        .pipe(
          map(i => (arpNotes[i] || {})),
          // tap(x => console.log('x', x.pitch)),
        ),
      )
    );
};