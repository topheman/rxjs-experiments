import homeHandler from './scripts/containers/home/home';
import routerHandler from './scripts/containers/router/router';

const generateHandler = (name, handler) => ({ location, params }, history) => {
  console.log(`Mounting ${name}`, location, params, history);
  if (typeof handler === 'function') {
    return handler(location, history);
  }
  return ({ location: l, params: p }, h) => {
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
  { pattern: '*', handler: generateHandler('CAPTURE ALL', homeHandler) }
];

export default routes;
