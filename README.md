RxJS Experiments
================

[![Build Status](https://travis-ci.org/topheman/rxjs-experiments.svg?branch=master)](https://travis-ci.org/topheman/rxjs-experiments)

New features comming, "progressive app" related - roadmap:

- [x] Offline support via AppCache - [READ BLOG POST](http://dev.topheman.com/automate-appcache-offline-support-in-your-webpack-build/)
- [ ] Offline support via Service Workers
- [ ] Notifications
- [ ] Add to homescreen ([webapp manifest ready](https://github.com/topheman/rxjs-experiments/commit/a6d137d34f6003e1baac5e0d4e5b10bb8455e943) - but not service worker engagement yet)
- [ ] ?...

All of those being integrated inside the webpack workflow (both at dev & build time). Check the [WIKI](https://github.com/topheman/rxjs-experiments/wiki) for more infos about how I managed this part of the app.

##Introduction

The motivation of this project is to try out [RxJS](https://github.com/ReactiveX/rxjs), without relying on any framework (CycleJS, ReactJS or AngularJS 2), not to experience the library in a specific context.

So far, I implemented the following features:

* **Multitouch/Mouse** painting on a canvas
* **Accelerometer** based background color (fallback on mouse position if no accelerometer)

Works on both desktop/mobile, but you'll enjoy it more on your tablet/phone (with touch and accelerometer).



[![image](https://raw.githubusercontent.com/topheman/rxjs-experiments/master/src/assets/images/qr-code.png)](https://topheman.github.io/rxjs-experiments/)

#####[Run the Demo](https://topheman.github.io/rxjs-experiments/) / [Check out the sources of the Observables](https://github.com/topheman/rxjs-experiments/blob/master/src/scripts/services/observables.js)

For the purpose fo this project, I developed the following:

* A [micro-router](https://github.com/topheman/rxjs-experiments/tree/master/src/scripts/libs/micro-router) (based on [history](https://github.com/mjackson/history))
* A VanillaJS implementation of the [bootstrap modal](https://github.com/topheman/rxjs-experiments/tree/master/src/scripts/components/modal)
* It also uses [sensors-checker](https://github.com/topheman/sensorsChecker.js) to detect accelerometers on devices

Resources:

* [Read the blog post about this project](http://dev.topheman.com/rxjs-first-steps/)
* Checkout [topheman/angular2-sandbox](https://github.com/topheman/angular2-sandbox), a mix of Angular2, **RxJS** and **ngrx/store**
* It uses the [CommonJS version of RxJS 5 (beta)](https://github.com/ReactiveX/rxjs#commonjs-via-npm)

##Dev Workflow

Based on the boilerplate [topheman/webpack-babel-starter](https://github.com/topheman/webpack-babel-starter).

###Install

```shell
git clone https://github.com/topheman/rxjs-experiments.git
cd rxjs-experiments
npm install
```

###Run

```shell
npm start
```

Goto [http://localhost:8080](http://localhost:8080)

If you need to access from a remote device (such as a smartphone on the same network), just `LOCALHOST=false npm start` and your site will be accessible via your IP (which will be output on the terminal at launch).

I'm using [sensors-checker](https://github.com/topheman/sensorsChecker.js) to check for accelerometer (since you can't only rely on feature detection). To disable this detection (and be able to use the accelerometer emulator of the devtools), just:

```shell
SENSORS_CHECKER=false npm start
```

You can mix and match with `LOCALHOST=false` like: `LOCALHOST=false SENSORS_CHECKER=false npm start`

###Build

The `./build` directory is ignored by git, it will contain a `dist` directory which holds the distribution version of your website (the one that you will [ship once built](#deploy)).

All the build tasks will create a built version of the project in the `./build/dist` folder, cleaning it before making the build.

* `npm run build`
* `npm run build-prod` optimized / uglified version
* `npm run build-prod-all` will build:
	* production version (optimized / uglified)
	* a debuggable version accessible at `/devtools` shipping all the sourcemaps, to ease sharing transpiled source code

`npm run serve-dist` will serve your `./build/dist` folder at [http://localhost:3000](http://localhost:3000) so that you could test the built version you just made.

###Linter

* eslint is running while you're developping, check your console for errors
* you can also launch it via `npm run lint`
* see `.eslintrc` for the configuration (currently, this project uses [the airbnb presets](https://github.com/airbnb/javascript/tree/eslint-config-airbnb-v5.0.1/packages/eslint-config-airbnb) - if you find it to restrictive, just remove `"extends": "airbnb/base"` in the `.eslintrc`)

###Customizations

You can customize the behavior of the scripts by specifying environments vars:

* `NODE_ENV` by default at `development`, `NODE_ENV=production` when you `npm run build-prod`
* `LINTER=false` will disable the linter (enabled by default, ex: `LINTER=false npm start`)
* `STATS=true` will write `stats.json` profiling file on disk from webpack at build (disabled by default, ex: `STATS=true npm run build`)
* `FAIL_ON_ERROR=true` will break the build if any errors occurs (useful for CIs such ase Travis - at `false` in dev-server, at `true` when building)
* `LOCALHOST=false` to access via IP from other devices on the same network (ex: `LOCALHOST=false npm start` - default `true`)
* `DEVTOOLS`: By default at `null`. Used internally in `npm run build-prod-all` (you may not need that if you don't do OSS)
* `APPCACHE`: You can use `APPCACHE=false` with a build task to generate an `appcache.manifest` that wont contain anything to cache (usefull if you want to reset cache on testing devices)

###FAQ / Deploy

See the [topheman/webpack-babel-starter](https://github.com/topheman/webpack-babel-starter)'s FAQ:

* deploy on github pages - [see wiki](https://github.com/topheman/webpack-babel-starter/wiki#deploy)
* a problem ? Checkout the [FAQ](https://github.com/topheman/webpack-babel-starter/wiki#faq)

Copyright 2016 © Christophe Rosset

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software
> and associated documentation files (the "Software"), to deal in the Software without
> restriction, including without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
> Software is furnished to do so, subject to the following conditions:
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
> The Software is provided "as is", without warranty of any kind, express or implied, including
> but not limited to the warranties of merchantability, fitness for a particular purpose and
> noninfringement. In no event shall the authors or copyright holders be liable for any claim,
> damages or other liability, whether in an action of contract, tort or otherwise, arising from,
> out of or in connection with the software or the use or other dealings in the Software.


