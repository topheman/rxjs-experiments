// inspired by http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

const preventDefault = (e) => {
  e.preventDefault();
  e.returnValue = false;// eslint-disable-line no-param-reassign
};

const preventDefaultForScrollKeys = (e) => {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
};

/**
 * Disable mouseScroll - returns the function to turn it back on
 * @returns {Function}
 */
export const disableMouseScroll = () => {
  window.addEventListener('DOMMouseScroll', preventDefault, false);
  const originalWindowOnWheel = window.onwheel;
  const originalWindowOnMouseWheel = window.onmousewheel;
  const originalWindowOnTouchMove = window.ontouchmove;
  const originalDocumentOnKeyDown = document.onkeydown;
  const originalDocumentOnMouseWheel = document.onmousewheel;
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove = preventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
  return () => {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = originalWindowOnWheel;
    window.onmousewheel = originalWindowOnMouseWheel;
    document.onmousewheel = originalDocumentOnMouseWheel;
    window.ontouchmove = originalWindowOnTouchMove;
    document.onkeydown = originalDocumentOnKeyDown;
  };
};
