import { Observable } from 'rxjs/Rx';// @todo check how to import it

const toColor = (num) => parseInt(num * 255, 10);

export const windowResize = () => Observable.fromEvent(window, 'resize')
  .map(e => ({ width: e.target.innerWidth, height: e.target.innerHeight }));

export const mouseColor = (windowSize) => Observable.fromEvent(window, 'mousemove')
    .map(e => ({ x: e.clientX, y: e.clientY }))
    .map(point => ({ rRatio: point.x / windowSize.width, gRatio: point.y / windowSize.height, bRatio: 0.5 }))
    .map(e => ({ r: toColor(e.rRatio), g: toColor(e.gRatio), b: toColor(e.bRatio) }));

export const accelerometerColor = () => Observable.fromEvent(window, 'deviceorientation')
    .map(e => ({ rRatio: e.alpha / 360, gRatio: (e.beta + 180) / 360, bRatio: (e.gamma + 90) / 180 }))
    .map(e => ({ r: (toColor(e.rRatio) + 127) % 255, g: toColor(e.gRatio), b: toColor(e.bRatio) }));
