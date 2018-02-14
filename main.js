const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

const startObservable = Rx.Observable.fromEvent(startButton, 'click');
const stopObservable = Rx.Observable.fromEvent(stopButton, 'click');
const resetObservable = Rx.Observable.fromEvent(resetButton, 'click');

const resetCounter = Rx.Observable.merge(stopObservable, resetObservable);
const counterValue = 10;
const counterObservable = Rx.Observable.interval(counterValue).takeUntil(resetCounter);

const initVal = 0,
      incFn = arr => arr + 1,
      resetFn = arr => initVal;

const incOrReset = Rx.Observable.merge(
  counterObservable.mapTo(incFn),
  resetObservable.mapTo(resetFn)
);

function getTimeObject(miliseconds) {
  //1000
  return {
    minutes: Math.floor(miliseconds / 6000),
    seconds: Math.floor((miliseconds / 100) % 60),
    miliseconds: Math.floor(miliseconds % 1000)
  }
}

function pad(value) {
  return value;
}

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const milisecondsEl = document.getElementById('miliseconds');

function renderTimer(time) {
  minutesEl.innerHTML = pad(time.minutes);
  secondsEl.innerHTML = pad(time.seconds);
  milisecondsEl.innerHTML = pad(time.miliseconds);
}

startObservable
  .switchMapTo(incOrReset)
  .startWith(initVal)
  .scan((acc, currentFn) => currentFn(acc))
  .subscribe(value => renderTimer(getTimeObject(value)));