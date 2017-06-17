// for the moment, importing whole RxJS, because silently breaks on .flatMap() with observables made with .fromEvent() using touch events
import { Observable } from 'rxjs/Rx'; // import entire RxJS :(

// That way, we only pick what we need (and end up with a MUCH lighter build!)
// BUT for the moment, there seem to be a bug with fromEvent() and touchevents ...
// import { Observable } from 'rxjs/Observable';// doesn't work well with flatMap on fromEvent
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/fromEvent';
// import 'rxjs/add/operator/mergeMap'; // flatMap is an alias of mergeMap
// import 'rxjs/add/operator/takeUntil';

const toColor = (num) => parseInt(num * 255, 10);

export const windowResize = () => Observable.fromEvent(window, 'resize')
  .map(e => ({ width: e.target.innerWidth, height: e.target.innerHeight }));

const ratioToRgbAccelerometer = (ratio) => ({ r: (toColor(ratio.rRatio) + 127) % 255, g: toColor(ratio.gRatio), b: toColor(ratio.bRatio) });
const ratioToRgbMouse = (ratio) => ({ r: toColor(ratio.rRatio), g: toColor(ratio.gRatio), b: toColor(ratio.bRatio) });

const compilePointToRatio = (windowSize) => (point) => ({ rRatio: point.x / windowSize.width, gRatio: point.y / windowSize.height, bRatio: 0.5 });

export const mouseColor = (windowSize) => {
  const pointToRatio = compilePointToRatio(windowSize);
  return Observable.fromEvent(window, 'mousemove')
    .map(e => ({ x: e.clientX, y: e.clientY }))
    .map(pointToRatio)
    .map(ratioToRgbMouse);
};

export const accelerometerColor = () => Observable.fromEvent(window, 'deviceorientation')
  .map(e => ({ rRatio: e.alpha / 360, gRatio: (e.beta + 180) / 360, bRatio: (e.gamma + 90) / 180 }))
  .map(ratioToRgbAccelerometer);

export const mouseDrag = (elem, windowSize) => {
  const mouseDown = Observable.fromEvent(elem, 'mousedown');
  const mouseMove = Observable.fromEvent(elem, 'mousemove');
  const mouseUp = Observable.fromEvent(elem, 'mouseup');
  const pointToRatio = compilePointToRatio(windowSize);

  const move = mouseDown.flatMap(() => {
    const startTime = (new Date()).getTime();
    return mouseMove.map(mm => ({
      x: mm.clientX,
      y: mm.clientY,
      startTime,
      color: ratioToRgbMouse(pointToRatio({ x: mm.clientX, y: mm.clientY }))
    }))
      .takeUntil(mouseUp);
  });

  return {
    start: mouseDown,
    move,
    end: mouseUp
  };
};

export const touchDrag = (elem, windowSize) => {
  const touchStart = Observable.fromEvent(elem, 'touchstart');
  const touchMove = Observable.fromEvent(elem, 'touchmove');
  const touchEnd = Observable.fromEvent(elem, 'touchend');
  const pointToRatio = compilePointToRatio(windowSize);
  const startTime = {};// stored by touch identifier

  const move = touchStart.flatMap((e) => {
    // for each new touch, store the time it was created linking to its identifier in startTime
    Array.from(e.changedTouches).forEach(touch => startTime[touch.identifier] = (new Date()).getTime());// eslint-disable-line no-return-assign
    return touchMove.map(tm => {
      const touches = Array.from(tm.touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        color: ratioToRgbMouse(pointToRatio({ x: touch.clientX, y: touch.clientY })),
        startTime: startTime[touch.identifier]
      }));
      return touches;
    });
  });

  return {
    // don't return intermediate touchstart events (rising in multitouch)
    start: touchStart.filter((e) => e.touches.length === e.changedTouches.length),
    move,
    // don't return intermediate touchend events (rising in multitouch)
    end: touchEnd.filter((e) => e.touches.length === 0)
  };
};
