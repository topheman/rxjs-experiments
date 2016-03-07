/**
 * @author Christophe Rosset - @topheman
 *
 * Micro router
 *
 * Example:
 *
 * ```js
 * import { createHashHistory } from 'history';
 * import { init as initRouter } from './scripts/libs/micro-router';
 * initRouter(createHashHistory, {
 *   '/': (location, history) => {
 *          // do something
 *          return (location, history) => {
 *            // clean up
 *          }
 *        },
 *   '/about': ...
 * });
 * ```
 * @param {Function} createHistory (from history)
 * @param {Object} routesMapping: mapping of pathname & function to call when that path name is matched
 * those functions return the unmounting function to call when leaving the path (to cleanup)
 * Example: {"/": (location, history) => }
 * @param {Function} notFoundMount (location, history) => {...} function to call when no routes matched
 */
export const init = (createHistory, routesMapping, notFoundMount = () => {
  console.log('Route not found');
  return () => console.log('Unmount Rount not found');
}) => {
  const history = createHistory();
  const routes = Object.keys(routesMapping).map(route => ({
    pattern: route,
    mount: routesMapping[route]
  }));
  let currentLocationPathname = null;
  let nextUnmount = function noop() {};
  const unlisten = history.listen(location => {
    // match the location.pathname to one of the routes passed in routesMapping
    const mountMatch = routes
      .filter(route => route.pattern === location.pathname)
      .map(route => route.mount)
      .reduce((result, mount) => mount || result, notFoundMount);
    // only redraw if the location has changed
    if (currentLocationPathname !== location.pathname) {
      nextUnmount(location, history);// unmount previous component
      currentLocationPathname = location.pathname;
      nextUnmount = mountMatch(location, history);// mount new component and store the unmount method
    }
  });
  return unlisten;
};
