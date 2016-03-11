/**
 *
 * Micro router
 *
 * @author Christophe Rosset - @topheman
 *
 * I needed a simple router, framework agnostic, it started simple here: #ca85e3b
 * and I ended doing something a little more advanced :-) ...
 *
 * Example:
 *
 * ```js
 * import { router, hashHistory } from './scripts/libs/micro-router';
 * router(hashHistory, [
 *   { pattern: '/', handler: (location, history) => { console.log('mounting'); return (loc, his) => console.log('unmounting'); } }
 * ]);
 * ```
 */

import { createHashHistory } from 'history';
export const hashHistory = createHashHistory;

import { normalizeRoutes } from './utils';

/*
 * @param {Function} createHistory
 * @param {Array} options containing objects { pattern, handler }
 *    pattern: {String|RegExp} to match to pathname - '*' will match any path
 *    handler: {Function} Called when the pathname is match, must return a function that will be called when leaving the route. Ex:
 *      (location, history) => { console.log('mounting'); return (loc, his) => console.log('unmounting'); }
 */
export const router = (createHistory, options) => {
  const history = createHistory();
  const routes = normalizeRoutes(options);
  let currentLocationPathname = null;
  let unmountHandler = function noop() {};
  const unlisten = history.listen(location => {
    // match the location.pathname to one of the routes and extract the related mounting infos (handler, resolve ...)
    const mount = routes
      .filter(route => route.matcher(location.pathname))
      .reduce((result, matchedMount) => result || matchedMount, null);// 1) always reducing to the first match if multiple ones 2) if no match, reduce to null
    // only redraw if a handler was matched & the location has changed
    if (mount && currentLocationPathname !== location.pathname) {
      // mount new component and store the unmount method
      if (mount.resolve) { // support for deferred mounting
        mount.resolve.then(() => {
          unmountHandler(location, history);// unmount previous component with its unmount method
          currentLocationPathname = location.pathname;
          unmountHandler = mount.handler(location, history);
          if (process.env.NODE_ENV !== 'production') {
            if (typeof unmountHandler === 'undefined') {
              console.warn(`Handler matching ${location.pathname} should return an unmount function.`);
            }
          }
        });
      }
      else {
        unmountHandler(location, history);// unmount previous component with its unmount method
        currentLocationPathname = location.pathname;
        unmountHandler = mount.handler(location, history);
        if (process.env.NODE_ENV !== 'production') {
          if (typeof unmountHandler === 'undefined') {
            console.warn(`Handler matching ${location.pathname} should return an unmount function.`);
          }
        }
      }
    }
  });
  return unlisten;
};
