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

const mount = ({ location, params }, history) => {
  const html = require('./template.html');
  console.log('mount /accelerometer/simple', location, params, history);

  // prepare display
  const container = document.getElementById('app-container');
  container.innerHTML = html;
  container.classList.add('full-screen');
  const deviceOrientationActive = isDeviceOrientationActive();
  const hideModal = showModal({
    title: 'Infos',
    content: `<p>${deviceOrientationActive ? 'An accelerometer has been detected on your device, the demo will be based on it.' : '<strong>No accelerometer</strong> was detected on your device, the demo will be based on <strong>mouse mouvements</strong>.'}
              <br><strong>Move your ${deviceOrientationActive ? 'phone' : 'mouse'}</strong> to change the background color.</p>`
  });
  const enableMouseScroll = disableMouseScroll();
  const debug = document.getElementById('reactive-screen-debug');

  const eventToBackground = (e) => `rgb(${e.r}, ${e.g}, ${e.b})`;
  const paint = (e) => {
    container.style.background = eventToBackground(e);
  };
  // prepare events
  const subscriptions = {};
  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  subscriptions.resize = windowResize().subscribe(e => {
    console.log(e);
    windowSize.width = e.width;
    windowSize.height = e.height;
    // maybe resize a canvas if using one ...
  });
  if (deviceOrientationActive === false) {
    subscriptions.mouseRatio = mouseColor(windowSize).subscribe((e) => {
      console.log(e);
      debug.innerHTML = JSON.stringify(e, null, '  ');
      paint(e);
    });
  }
  else {
    subscriptions.accelerometerRatio = accelerometerColor().subscribe((e) => {
      console.log(e);
      debug.innerHTML = JSON.stringify(e, null, '  ');
      paint(e);
    });
  }

  const unMount = ({ location: l, params: p }, h) => {
    // cleanup what you messed up ...
    console.log('unMount /accelerometer/simple', l, p, h);
    document.getElementById('app-container').innerHTML = '';
    document.getElementById('app-container').classList.remove('full-screen');
    hideModal();// remove the modal (whatever its state) when leaving
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
