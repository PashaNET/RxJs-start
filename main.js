const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

const startObservable = Rx.Observable.fromEvent(startButton, 'click');
const stopObservable = Rx.Observable.fromEvent(stopButton, 'click');
const resetObservable = Rx.Observable.fromEvent(resetButton, 'click');

const resetCounter = Rx.Observable.merge(stopObservable, resetObservable);
const counterValue = 1000;
const counterObservable = Rx.Observable.interval(counterValue).takeUntil(resetCounter);

const initVal = 0,
      incFn = arr => arr + 1,
      resetFn = arr => initVal;

const incOrReset = Rx.Observable.merge(
  counterObservable.mapTo(incFn),
  resetObservable.mapTo(resetFn)
);

startObservable
  .switchMapTo(incOrReset)
  .startWith(initVal)
  .scan((acc, currentFn) => currentFn(acc))
  .subscribe(value => console.log(value));