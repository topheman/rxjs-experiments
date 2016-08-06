console.info('The service worker is ON, it will cache every assets (js, css, images ...)');
if (process.env.NODE_ENV === 'development') {
  console.warn('To work properly with the latest version of your sources, go to devtools/Application/Service Workers and check "Update on reload"');
}
