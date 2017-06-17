## RxJS Experiments - distribution version (gh-pages branch)

This is the distribution version of [topheman/rxjs-experiments](https://github.com/topheman/rxjs-experiments) - v<%= pkg.version %><% if (urlToCommit !== null) { %> - [#<%= gitRevisionShort %>](<%= urlToCommit %>)<% } %>.

**Warning**: This is the **generated** code, versionned on the `gh-pages` branch, testable online [here](https://topheman.github.io/rxjs-experiments/). If you wish to see the original source code, switch to the [master branch](https://github.com/topheman/rxjs-experiments).

### Infos:

* [How those files where generated (Readme - build section)](https://github.com/topheman/rxjs-experiments#build)
* [How to deploy your generated version (Wiki - deploy section)](https://github.com/topheman/rxjs-experiments/wiki#deploy)

As explained in the [README](https://github.com/topheman/rxjs-experiments#build), when you `npm run build-prod-all`, two versions will be generated:

* One at the root (the production version)
* One in the [devtools folder](https://github.com/topheman/rxjs-experiments/tree/gh-pages/devtools), which contains as you'll see sourcemaps and are not minified.

Test the demo [here](https://topheman.github.io/rxjs-experiments/).

------

You can disable the generation of this file by removing the following line in the `package.json`:

```js
"postbuild-prod-all": "npm run generate-dist-readme"
```
