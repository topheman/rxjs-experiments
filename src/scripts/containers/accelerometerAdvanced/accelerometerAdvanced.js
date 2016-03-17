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
import { mouseColor, accelerometerColor, windowResize, mouseDrag } from '../../services/observables';

const mount = ({ location, params }, history) => {
  const html = require('./template.html');
  console.log('mount /accelerometer/advanced', location, params, history);

  // prepare display
  const container = document.getElementById('app-container');
  container.innerHTML = html;
  container.classList.add('full-screen');
  const deviceOrientationActive = isDeviceOrientationActive();
  const hideModal = showModal({
    title: 'Infos',
    content: `<p>${deviceOrientationActive ? 'An accelerometer has been detected on your device, the demo will be based on it.' : '<strong>No accelerometer</strong> was detected on your device, the demo will be based on <strong>mouse mouvements</strong>.'}</p>
              <p><strong>Move your ${deviceOrientationActive ? 'phone' : 'mouse'}</strong> to change the background color.</p>
              <p><strong>${deviceOrientationActive ? 'Tap and drag (not yet implemented)' : 'Click and drag'}</strong> to draw circles!</p>`
  });
  const enableMouseScroll = disableMouseScroll();
  const canvas = document.getElementById('accelerometer-advanced-canvas');
  const context = canvas.getContext('2d');

  // prepare callbacks
  const eventToBackground = (e) => `rgb(${e.r}, ${e.g}, ${e.b})`;
  const paintBackground = (e) => {
    container.style.background = eventToBackground(e);
  };
  const paintCanvas = (infos) => {
    console.log(infos);
    const radius = ((new Date()).getTime() - infos.startTime) * 0.02;

    context.beginPath();
    context.arc(infos.x, infos.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = eventToBackground(infos.color);
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
  };
  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
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
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
  });
  if (deviceOrientationActive === false) {
    subscriptions.mouseColor = mouseColor(windowSize).subscribe(paintBackground);
    subscriptions.mouseDrag = mouseDrag(canvas, { windowSize, onMouseUp: clearCanvas }).subscribe(paintCanvas);
  }
  else {
    subscriptions.accelerometerRatio = accelerometerColor().subscribe(paintBackground);
  }

  // launch
  window.dispatchEvent(new Event('resize'));

  const unMount = ({ location: l, params: p }, h) => {
    // cleanup what you messed up ...
    console.log('unMount /accelerometer/advanced', l, p, h);
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
