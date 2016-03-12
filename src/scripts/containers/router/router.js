/**
 * This is the "controller" launched by the micro-router for the route /router (and some others)
 * It returns the methods to cleanup after unmounting
 * @param { location, params }
 * @param location
 * @returns {unMount}
 */
const mount = ({ location, params }, history) => {
  console.log('mount router', location, params, history);
  const html = require('./template.html');
  document.getElementById('app-container').innerHTML = html;
  document.getElementById('matched-route').innerHTML = location.pathname;
  document.getElementById('matched-params').innerHTML = Object.keys(params).reduce((infos, param) => {
    infos += `<li>${param}: <strong>${params[param]}</strong></li>`;// eslint-disable-line no-param-reassign
    return infos;
  }, '');
  const unMount = ({ location: l, params: p }, h) => {
    console.log('unMount router', l, p, h);
    document.getElementById('app-container').innerHTML = '';
  };
  return unMount;
};

export default mount;
