import { resolveDeviceOrientation } from './scripts/services/accelerometer';

import homeHandler from './scripts/containers/home/home';
import routerHandler from './scripts/containers/router/router';
import accelerometerHandler from './scripts/containers/accelerometer/accelerometer';
import dragHandler from './scripts/containers/drag/drag';

const generateHandler = (name, handler) => ({ location, params, history }) => {
  console.log(`Mounting ${name}`, location, params, history);
  if (typeof handler === 'function') {
    return handler();
  }
  return ({ location: l, params: p, history: h }) => {
    console.log(`Unmounting ${name}`, l, p, h);
  };
};

const generatePromiseTimeout = (name, timeout = 5000) => new Promise(res => {// eslint-disable-line arrow-body-style
  return setTimeout(() => {
    console.log(`resolving ${name}, ${timeout}`);
    return res(`resolving ${name}`);
  }, timeout);
});

const routes = [
  { pattern: '/', handler: homeHandler },
  { pattern: '/router', handler: routerHandler },
  { pattern: /^\/router\/user\/([^\/?#]+)\/([^\/?#]+)$/i, handler: routerHandler },
  { pattern: '/router/posts/:category/:title/edit', handler: routerHandler },
  { pattern: '/router/resolve', handler: generateHandler('/router/resolve'), resolve: generatePromiseTimeout('/router/resolve') },
  { pattern: '/accelerometer', handler: accelerometerHandler, resolve: resolveDeviceOrientation() },
  { pattern: '/multitouch-mouse-drag', handler: dragHandler, resolve: resolveDeviceOrientation() },
  { pattern: '*', handler: generateHandler('CAPTURE ALL', homeHandler) }
];

export default routes;
