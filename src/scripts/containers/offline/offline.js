/**
 * This is the "controller" launched by the micro-router
 * It returns the methods to cleanup after unmounting
 * @param { location, params }
 * @param location
 * @returns {unMount}
 */
const mount = () => {
  const html = require('./template.html');

  // prepare display
  document.getElementById('other-content').innerHTML = html;
  document.getElementById('generic-container').style.display = 'block';
  document.getElementById('other-content').style.display = 'block';

  // prepare handlers
  Array.from(document.querySelectorAll('.show-manifest-appcache'))
    .forEach(elm => elm.addEventListener('click', (e) => {
      e.preventDefault();
      const placeHolder = document.getElementById('placeholder-manifest-appcache');
      fetch('./manifest.appcache')
        .then(res => res.text())
        .then(text => {
          placeHolder.innerHTML = text;
          placeHolder.style.display = 'block';
        })
        .catch(() => {
          placeHolder.innerHTML = 'An error occured retrieving the manifest.appcache, please retry.';
          placeHolder.style.display = 'block';
        });
    }, false));

  const unMount = () => {
    document.getElementById('generic-container').style.display = 'none';
    document.getElementById('other-content').style.display = 'none';
    document.getElementById('other-content').innerHTML = '';
  };
  return unMount;
};

export default mount;
