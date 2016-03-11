/**
 *
 * Micro router
 *
 * @author Christophe Rosset - @topheman
 *
 */

/**
 * Returns a matcher according to the type of the pattern
 * @param {String|RegExp} pattern
 * @returns {Function}
 */
export const getMatcherFromPattern = (pattern) => {
  if (typeof pattern === 'string') {
    if (pattern === '*') {
      return () => true;// match all
    }
    return pathname => pattern === pathname;
  }
  else if (pattern instanceof RegExp) {
    return pathname => {
      console.log(pathname, pattern, pathname.match(pattern));
      return pathname.match(pattern) !== null;
    };
  }
  throw new Error('Unhandled pattern type');
};

/**
 * Returns an array of routes containing matcher & handler
 * Throws error if any param missing
 * @param routes
 * @throws
 */
export const normalizeRoutes = (routes) => routes.map(route => {
  if (typeof route.pattern === 'undefined' || typeof route.handler === 'undefined') {
    throw new Error('Missing pattern or handler attribute');
  }
  if (typeof route.resolve !== 'undefined' && typeof route.resolve.then === 'undefined') {
    throw new Error('resolve param only accepts promises');
  }
  return {
    matcher: getMatcherFromPattern(route.pattern),
    handler: route.handler,
    resolve: route.resolve
  };
});
