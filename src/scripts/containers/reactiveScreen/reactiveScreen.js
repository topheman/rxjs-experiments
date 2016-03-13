/**
 * This is the "controller" launched by the micro-router
 * It returns the methods to cleanup after unmounting
 * @param { location, params }
 * @param location
 * @returns {unMount}
 */

import { disableMouseScroll } from '../../services/utils';
import { isDeviceOrientationActive } from '../../services/accelerometer';
import { show as showModal } from '../../components/modal/modal';

const mount = ({ location, params }, history) => {
  console.log('mount reactive-screen', location, params, history);
  document.getElementById('app-container').innerHTML = '';
  document.getElementById('app-container').classList.add('full-screen');
  const deviceOrientationActive = isDeviceOrientationActive();
  const hideModal = showModal({
    title: 'Infos',
    content: `<p>${deviceOrientationActive ? 'An accelerometer has been detected on your device, the demo will be based on it.' : '<strong>No accelerometer</strong> was detected on your device, the demo will be based on <strong>mouse mouvements</strong>.'}</p>`
  });
  const enableMouseScroll = disableMouseScroll();
  const unMount = ({ location: l, params: p }, h) => {
    // cleanup what you messed up ...
    console.log('unMount reactive-screen', l, p, h);
    document.getElementById('app-container').innerHTML = '';
    document.getElementById('app-container').classList.remove('full-screen');
    hideModal();// remove the modal (whatever its state) when leaving
    enableMouseScroll();// reenable mouse scroll for other routes
  };
  return unMount;
};

export default mount;
