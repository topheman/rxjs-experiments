/**
 * This is the "controller" launched by the micro-router
 * It returns the methods to cleanup after unmounting
 * @param { location, params }
 * @param location
 * @returns {unMount}
 */
const mount = () => {
  document.getElementById('home-container').style.display = 'block';
  const unMount = () => {
    document.getElementById('home-container').style.display = 'none';
  };
  return unMount;
};

export default mount;
