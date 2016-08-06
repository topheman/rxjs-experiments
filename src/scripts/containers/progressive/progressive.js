/**
 * This is the "controller" launched by the micro-router
 * It returns the methods to cleanup after unmounting
 * @param { location, params }
 * @param location
 * @returns {unMount}
 */
const mount = () => {
  const html = require('./template.html');

  // prepare display
  document.getElementById('other-content').innerHTML = html;
  document.getElementById('generic-container').style.display = 'block';
  document.getElementById('other-content').style.display = 'block';

  const unMount = () => {
    document.getElementById('generic-container').style.display = 'none';
    document.getElementById('other-content').style.display = 'none';
    document.getElementById('other-content').innerHTML = '';
  };
  return unMount;
};

export default mount;
