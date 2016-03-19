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
import { mouseColor, accelerometerColor, windowResize } from '../../services/observables';

const mount = () => {
  const html = require('./template.html');

  // prepare display
  const container = document.getElementById('app-container');
  container.innerHTML = html;
  container.classList.add('full-screen');
  const deviceOrientationActive = isDeviceOrientationActive();
  const hideModal = showModal({
    title: 'Accelerometer',
    content: `<p>${deviceOrientationActive ? '<strong>An accelerometer has been detected on your device</strong>, the demo will be based on it.' : '<strong>No accelerometer</strong> was detected on your device, the demo will be based on <strong>mouse mouvements</strong>.'}</p>
              <p class="lead"><strong>Move your ${deviceOrientationActive ? 'phone' : 'mouse'}</strong> to change the background color.</p>`
  });
  const enableMouseScroll = disableMouseScroll();
  const debug = document.getElementById('accelerometer-simple-debug');

  // prepare callbacks
  const eventToBackground = (e) => `rgb(${e.r}, ${e.g}, ${e.b})`;
  const paintBackground = (e) => {
    container.style.background = eventToBackground(e);
  };
  const draw = (e) => {
    debug.innerHTML = JSON.stringify(e, null, '  ');
    paintBackground(e);
  };

  // prepare events
  const subscriptions = {};
  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  subscriptions.resize = windowResize().subscribe(e => {
    windowSize.width = e.width;
    windowSize.height = e.height;
  });
  if (deviceOrientationActive === false) {
    subscriptions.mouseRatio = mouseColor(windowSize).subscribe(draw);
  }
  else {
    subscriptions.accelerometerColor = accelerometerColor().subscribe(draw);
  }

  const unMount = () => {
    // cleanup what you messed up ...
    document.getElementById('app-container').innerHTML = '';
    document.getElementById('app-container').classList.remove('full-screen');
    hideModal(true);// remove the modal (whatever its state) when leaving
    enableMouseScroll();// reenable mouse scroll for other routes
    // unsubscribe from the observable
    for (const sub in subscriptions) {
      if (subscriptions.hasOwnProperty(sub)) {
        subscriptions[sub].unsubscribe();// .dispose is now .unsubscribe https://github.com/ReactiveX/RxJS/blob/master/MIGRATION.md#subscription-dispose-is-now-unsubscribe
      }
    }
    container.style.background = 'transparent';
  };
  return unMount;
};

export default mount;
