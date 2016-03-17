import { Observable } from 'rxjs/Rx';// @todo check how to import it

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

export const mouseDrag = (elem, { windowSize, onMouseUp }) => {
  const mouseDown = Observable.fromEvent(elem, 'mousedown');
  const mouseMove = Observable.fromEvent(elem, 'mousemove');
  const mouseUp = Observable.fromEvent(elem, 'mouseup').map(() => onMouseUp());
  const pointToRatio = compilePointToRatio(windowSize);
  return mouseDown.flatMap(() => {
    const startTime = (new Date()).getTime();
    return mouseMove.map(mm => ({
      x: mm.clientX,
      y: mm.clientY,
      startTime,
      color: ratioToRgbMouse(pointToRatio({ x: mm.clientX, y: mm.clientY }))
    }))
    .takeUntil(mouseUp);
  });
};

export const touchDrag = (elem, { windowSize, onFinalTouchEnd }) => {
  const touchStart = Observable.fromEvent(elem, 'touchstart');
  const touchMove = Observable.fromEvent(elem, 'touchmove');
  const touchEnd = Observable.fromEvent(elem, 'touchend').map((e) => {console.log('touchend', e); return e.touches.length === 0 ? onFinalTouchEnd() : e});
  const pointToRatio = compilePointToRatio(windowSize);
  const startTime = {};// stored by touch identifier
  return touchStart.flatMap((e) => {
    console.log('touchstart', e)
    // for each new touch, store the time it was created linking to its identifier in startTime
    Array.from(e.changedTouches).forEach(touch => startTime[touch.identifier] = (new Date()).getTime());
    return touchMove.map(tm => {
      console.log('touchmove', tm);
      const touches = Array.from(tm.touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        color: ratioToRgbMouse(pointToRatio({ x: touch.clientX, y: touch.clientY })),
        startTime: startTime[touch.identifier]
      }));
      return touches;
    })
    //.takeUntil(touchEnd);
  });
};
