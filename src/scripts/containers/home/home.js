/**
 * This is the "controller" launched by the micro-router
 * It returns the methods to cleanup after unmounting
 * @param history
 * @param location
 * @returns {unMount}
 */
const mount = (location, history) => {
  console.log('mount home', location, history);
  document.getElementById('home-container').style.display = 'block';
  const unMount = (l, h) => {
    console.log('unMount home', l, h);
    document.getElementById('home-container').style.display = 'none';
  };
  return unMount;
};

export default mount;
