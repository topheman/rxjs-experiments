/**
 * This is the "controller" launched by the micro-router for the route /router (and some others)
 * It returns the methods to cleanup after unmounting
 * @param history
 * @param location
 * @returns {unMount}
 */
const mount = (location, history) => {
  console.log('mount router', location, history);
  const html = require('./template.html');
  document.getElementById('app-container').innerHTML = html;
  document.getElementById('matched-route').innerHTML = location.pathname;
  const unMount = (l, h) => {
    console.log('unMount router', l, h);
    document.getElementById('app-container').innerHTML = '';
  };
  return unMount;
};

export default mount;
