import home from './scripts/containers/home/home';

const generateHandler = (name) => (location, history) => {
  console.log(`Mounting ${name}`, location, history);
  return (l, h) => {
    console.log(`Unmounting ${name}`, l, h);
  };
};

const generatePromiseTimeout = (name, timeout = 5000) => new Promise(res => {// eslint-disable-line arrow-body-style
  return setTimeout(() => {
    console.log(`resolving ${name}, ${timeout}`);
    return res(`resolving ${name}`);
  }, timeout);
});

const routes = [
  { pattern: '/', handler: home },
  { pattern: '/test', handler: generateHandler('/test') },
  { pattern: '/foo', handler: generateHandler('/foo') },
  { pattern: '/bar', handler: generateHandler('/bar') },
  { pattern: '/resolve', handler: generateHandler('/resolve'), resolve: generatePromiseTimeout('/resolve') },
  { pattern: /\/bar\/\w+\/list/, handler: generateHandler('/bar/:string/list') },
  { pattern: '*', handler: generateHandler('CAPTURE ALL') }
];

export default routes;
