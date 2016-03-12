/**
 * This is the "controller" launched by the micro-router
 * It returns the methods to cleanup after unmounting
 * @param { location, params }
 * @param location
 * @returns {unMount}
 */
const mount = ({ location, params }, history) => {
  console.log('mount home', location, params, history);
  document.getElementById('home-container').style.display = 'block';
  const unMount = ({ location: l, params: p }, h) => {
    console.log('unMount home', l, p, h);
    document.getElementById('home-container').style.display = 'none';
  };
  return unMount;
};

export default mount;
