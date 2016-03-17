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
