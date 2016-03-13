/**
 * This is the "controller" launched by the micro-router for the route /accelerometer
 * It returns the methods to cleanup after unmounting
 * @param { location, params }
 * @param location
 * @returns {unMount}
 */
import { isDeviceOrientationActive } from '../../services/accelerometer';

const mount = () => {
  const html = require('./template.html');
  const container = document.getElementById('app-container');
  container.innerHTML = html;
  const deviceOrientationActive = isDeviceOrientationActive();
  if (deviceOrientationActive) {
    document.getElementById('accelerometer-detected').style.display = 'block';
  }
  else {
    document.getElementById('accelerometer-not-detected').style.display = 'block';
  }
  const unMount = () => {
    document.getElementById('app-container').innerHTML = '';
  };
  return unMount;
};

export default mount;
