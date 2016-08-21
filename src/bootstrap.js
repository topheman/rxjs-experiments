/* eslint-disable max-len */

// polyfills
require('es6-promise').polyfill();
require('fetch-polyfill');

import './scripts/libs/requestAnimationFrame.polyfill';
import modal, { show as showModal } from './scripts/components/modal/modal';
import { router, hashHistory } from './scripts/libs/micro-router';
import routes from './routes';
/** This is how you use the environments variables passed by the webpack.DefinePlugin **/

/**
 * The linter can be disabled via LINTER=false env var - show a message in console to inform if it's on or off
 * Won't show in production
 */
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.LINTER) {
    console.warn('Linter disabled, make sure to run your code against the linter, otherwise, if it fails, your commit will be rejected.');
  }
  else {
    console.info('Linter active, if you meet some problems, you can still run without linter, just set the env var LINTER=false.');
  }
}
else {
  if (process.env.DEVTOOLS) {
    console.info('Turn on the "Sources" tab of your devtools to inspect original source code - thanks to sourcemaps!');
  }
}

/**
 * You could setup some mocks for tests
 * Won't show in production
 */
if (process.env.NODE_ENV === 'mock') {
  console.info('MOCK mode');
}

if (process.env.DEVTOOLS && process.env.NODE_ENV !== 'production') {
  console.info(`You're on DEVTOOLS mode, you may have access to tools enhancing developer experience - off to you to choose to disable them in production ...`);
}

/** This is where the "REAL CODE" starts */

const main = () => {
  console.log('Welcome! More infos at https://github.com/topheman/rxjs-experiments');
  const navBarCollapse = document.querySelector('.collapse.navbar-collapse');
  // hide responsive menu when a link is clicked
  navBarCollapse.addEventListener('click', (e) => {
    if (navBarCollapse.classList.contains('in') && !e.target.classList.contains('dropdown-toggle')) {
      navBarCollapse.classList.remove('in');
    }
  }, false);
  // show/hide responsive menu when clicking hamburger button
  document.querySelector('button.navbar-toggle').addEventListener('click', () => {
    navBarCollapse.classList.toggle('in');
  });
  // show/hide sub-menus
  document.querySelector('.dropdown-toggle').addEventListener('click', () => {
    document.querySelector('.dropdown').classList.toggle('open');
  }, false);
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('in-progress')) {
      e.preventDefault();
      return showModal({ title: 'Comming soon ...', content: 'This is a work in progress.' });
    }
    if (!e.target.classList.contains('dropdown-toggle')) {
      document.querySelector('.dropdown').classList.remove('open');
    }
  }, false);
  document.getElementById('copyright-year').addEventListener('click', () => {
    document.getElementById('footer-cache-infos').style.display = 'block';
  }, false);
  modal();
};

main();
router(hashHistory, routes);
