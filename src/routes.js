import home from './scripts/containers/home/home';

const generateHandler = (name) => (location, history) => {
  console.log(`Mounting ${name}`, location, history);
  return (l, h) => {
    console.log(`Unmounting ${name}`, l, h);
  };
};

const routes = [
  { pattern: '/', handler: home },
  { pattern: '/test', handler: generateHandler('/test') },
  { pattern: '/foo', handler: generateHandler('/foo') },
  { pattern: '/bar', handler: generateHandler('/bar') },
  { pattern: /\/bar\/\w+\/list/, handler: generateHandler('/bar/:string/list') },
  { pattern: '*', handler: generateHandler('CAPTURE ALL') }
];

export default routes;
