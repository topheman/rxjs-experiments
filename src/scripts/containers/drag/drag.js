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
import { mouseColor, accelerometerColor, windowResize, mouseDrag, touchDrag } from '../../services/observables';

const mount = () => {
  const CLEAR_CANVAS_TIMEOUT = 2000;
  const html = require('./template.html');
  // prepare display
  const container = document.getElementById('app-container');
  container.innerHTML = html;
  container.classList.add('full-screen');
  const deviceOrientationActive = isDeviceOrientationActive();
  const touchSupportActive = 'ontouchstart' in document.documentElement;
  const hideModal = showModal({
    title: 'Multitouch/Mouse drag',
    content: `<p class="lead"><strong>${touchSupportActive ? 'Tap and drag' : 'Click and drag'}</strong> to draw circles!</p>
              ${touchSupportActive ? '<p><strong>Use ALL your fingers ! Multitouch is supported !</strong></p>' : '<p>Try it on your mobile to test the multi-touch!</p>'}`
  });
  const enableMouseScroll = disableMouseScroll();
  const canvas = document.getElementById('drag-canvas');
  const context = canvas.getContext('2d');
  let requestId = null;
  let timeoutClearCanvas = null;
  const displayInfos = {
    circles: [],
    lastEndTime: 0// timestamp of the last final "end" callback
  };

  // prepare callbacks
  const eventToBackground = (e) => `rgb(${e.r}, ${e.g}, ${e.b})`;
  const paintBackground = (e) => {
    container.style.background = eventToBackground(e);
  };
  const updateCircles = (circles) => {
    displayInfos.circles = circles;
  };
  const drawCircle = (circle) => {
    const radius = ((new Date()).getTime() - circle.startTime) * 0.02;

    context.beginPath();
    context.arc(circle.x, circle.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = eventToBackground(circle.color);
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
  };
  const drawCircles = (circles) => {
    circles.forEach(circle => drawCircle(circle));
  };
  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  const onDragStart = () => {
    // if restarting to paint between 0 millisecs and CLEAR_CANVAS_TIMEOUT millisecs since last "end", callback, cancel clearCanvas
    if ((new Date()).getTime() - displayInfos.lastEndTime < CLEAR_CANVAS_TIMEOUT) {
      clearTimeout(timeoutClearCanvas);
    }
  };
  const onDragEnd = () => {
    updateCircles([]);// clear circles
    displayInfos.lastEndTime = (new Date()).getTime();
    timeoutClearCanvas = setTimeout(clearCanvas, CLEAR_CANVAS_TIMEOUT);
  };
  const draw = () => {
    drawCircles(displayInfos.circles);
    requestId = requestAnimationFrame(draw);
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
  }
  else {
    subscriptions.accelerometerColor = accelerometerColor().subscribe(paintBackground);
  }
  if (touchSupportActive === false) {
    const _mouseDrag = mouseDrag(canvas, windowSize);
    subscriptions.mouseDragStart = _mouseDrag.start.subscribe(onDragStart);
    subscriptions.mouseDragMove = _mouseDrag.move.subscribe((circle) => updateCircles([circle]));
    subscriptions.mouseDragEnd = _mouseDrag.end.subscribe(onDragEnd);
  }
  else {
    const _touchDrag = touchDrag(canvas, windowSize);
    subscriptions.touchDragStart = _touchDrag.start.subscribe(onDragStart);
    subscriptions.touchDragMove = _touchDrag.move.subscribe(updateCircles);
    subscriptions.touchDragEnd = _touchDrag.end.subscribe(onDragEnd);
  }

  // launch
  window.dispatchEvent(new Event('resize'));
  draw();

  const unMount = () => {
    // cleanup what you messed up ...
    document.getElementById('app-container').innerHTML = '';
    document.getElementById('app-container').classList.remove('full-screen');
    hideModal(true);// remove the modal (whatever its state) when leaving
    enableMouseScroll();// reenable mouse scroll for other routes
    clearTimeout(timeoutClearCanvas);
    cancelAnimationFrame(requestId);
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
