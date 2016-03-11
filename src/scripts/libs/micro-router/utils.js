/**
 *
 * Micro router
 *
 * @author Christophe Rosset - @topheman
 *
 */

/**
 * Patterns accepted:
 * - "*": match all
 * - RegExp
 * - /post/:param1/edit/:param2 -> will match this pattern and return the matched params in a params object
 * - a string
 *
 * This method will attempt to return a matcher, according to the pattern returned
 * This matcher has the signature function(pathname) {...} will return false or the matched params
 * It takes a pattern in param and return a function that takes a pathname in param and will return:
 *  - false if no match
 *  - an object with potential matched params
 * @param {String|RegExp} pattern
 * @returns {Function} (pathname) => false|{paramsMatched}
 */
export const compilePattern = (pattern) => {
  // 1) if pattern is a regexp, return a matcher using this regexp
  if (pattern instanceof RegExp) {
    return (pathname) => {
      if (pathname.match(pattern) !== null) {
        return {};
      }
      return false;
    };
  }

  // 2) if pattern is a "match all", return a matcher that always matches
  if (pattern === '*') {
    // this matcher matches any pathname
    return () => ({});
  }

  // 3) try to create a matcher for a pattern with params in it

  const paramNamesMatcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let paramNames = pattern.match(paramNamesMatcher);
  // console.log('paramNames', paramNames);

  if (paramNames !== null) {
    paramNames = paramNames.map(match => match.slice(1));// remove the ":" to get the exact paramNames
    const paramNamesRegexpSource = pattern.replace(/:([^\/]+)/g, '([^/?#]+)');// replace ":paramName" by the regexp that will match this param
    return (pathname) => {
      const matches = pathname.match(new RegExp(`^${paramNamesRegexpSource}$`));
      let matchedParams;
      if (matches !== null) {
        matchedParams = matches.reduce((result, match, index) => {
          if (index > 0) {
            result[paramNames[index - 1]] = match;// eslint-disable-line no-param-reassign
          }
          return result;
        }, {});
        return matchedParams;
      }
      return false;
    };
  }

  // 4) if nothing of the above applied, simply return a matcher that matched a string
  return (pathname) => pathname === pattern ? {} : false;
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
    matcher: compilePattern(route.pattern),
    handler: route.handler,
    resolve: route.resolve
  };
});

/**
 * Returns a function that will match a pathname (from location.pathname) to a mount (a route with handler infos)
 * @param routes
 */
export const compileMatchMount = (routes) => (pathname) => {// eslint-disable-line arrow-body-style
  // match the location.pathname to one of the routes and extract the related mounting infos (handler, resolve ...)
  return routes
    .reduce((result, route) => {
      const params = route.matcher(pathname);// a matcher returns false if no match or an object with potentials params matched for the route
      if (params && result.length === 0) {// once we get a match, no more matching
        result.push({
          handler: route.handler,
          resolve: route.resolve,
          params
        });
      }
      return result;
    }, [])
    .reduce((result, matchedMount) => result || matchedMount, null);// 1) always reducing to the first match if multiple ones 2) if no match, reduce to null
};
