[npm]: https://img.shields.io/npm/v/@rollup/plugin-run
[npm-url]: https://www.npmjs.com/package/@rollup/plugin-run
[size]: https://packagephobia.now.sh/badge?p=@rollup/plugin-run
[size-url]: https://packagephobia.now.sh/result?p=@rollup/plugin-run

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

# @rollup/plugin-run

🍣 A Rollup plugin which runs your bundles in Node once they're built.

Using this plugin gives much faster results compared to what you would do with [nodemon](https://nodemon.io/).

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v14.0.0+) and Rollup v2.0.0+.

## Install

Using npm:

```console
npm install @rollup/plugin-run --save-dev
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
import run from '@rollup/plugin-run';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [run()]
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api). If the build produces any errors, the plugin will write a 'alias' character to stderr, which should be audible on most systems.

The plugin `forks` a child process with the generated file, every time the bundle is rebuilt (after first closing the previous process, if it's not the first run).

_Note: This plugin works with Rollup's code-splitting if you're using dynamic `import(...)` — the only constraint is that you have a single entry point specified in the config._

## Options

This plugin supports pass through option available for [child_process.fork(...)](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options).

Example:

Debugging with sourcemaps using [source-map-support](https://www.npmjs.com/package/source-map-support):

```diff
// rollup.config.js
import run from '@rollup/plugin-run';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
+    sourcemap: true
  },
  plugins: [
-    run()
+    run({
+      execArgv: ['-r', 'source-map-support/register']
+    })
  ]
};
```

### `allowRestarts`

Type: `Boolean`<br>
Default: `false`

If `true`, instructs the plugin to listen to `stdin` for the sequences listed below followed by enter (carriage return).

#### `stdin` Input Actions

When this option is enabled, `stdin` will listen for the following input and perform the associated action:

- `restart` → Kills the currently running bundle and starts it again. _Note: This does not create a new bundle, the bundle is run again "as-is". This can be used to test configuration changes or other changes that are made without modifying your source_
  Also allowed: `rs`, `CTRL+K`

- `clear` → Clears the screen of all text
  Also allowed: `cls`, `CTRL+L`

### `input`

Type: `String`<br>
Default: `null`

Specifies the entry point this plugin will use. Not necessary if you only have a single entry point.

## Practical Example

The feature is usually intended for development use, you may prefer to only include it when Rollup is being run in watch mode:

```diff
// rollup.config.js
import run from '@rollup/plugin-run';

+const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
-    run()
+    dev && run()
  ]
};
```

## Meta

[CONTRIBUTING](/.github/CONTRIBUTING.md)

[LICENSE (MIT)](/LICENSE)

---

PR:

feat(run): add `input` option

<!--
  ⚡️ katchow! We ❤️ Pull Requests!

  If you remove or skip this template, you'll make the 🐼 sad and the mighty god
  of Github will appear and pile-drive the close button from a great height
  while making animal noises.

  Pull Request Requirements:
  * Please include tests to illustrate the problem this PR resolves.
  * Please lint your changes by running `npm run lint` before creating a PR.
  * Please update the documentation in `/docs` where necessary

  Please place an x (no spaces - [x]) in all [ ] that apply.
-->

<!-- the plugin(s) this PR is for -->

## Rollup Plugin Name: `run`

This PR contains:

- [ ] bugfix
- [x] feature
- [ ] refactor
- [ ] documentation
- [ ] other

Are tests included?

- [x] yes (_bugfixes and features will not be merged without tests_)
- [ ] no

Breaking Changes?

- [ ] yes (_breaking changes will not be merged unless absolutely necessary_)
- [x] no

If yes, then include "BREAKING CHANGES:" in the first commit message body, followed by a description of what is breaking.

### Description

<!--
  Please be thorough and clearly explain the problem being solved.
  * If this PR adds a feature, look for previous discussion on the feature by searching the issues first.
  * Is this PR related to an issue?
-->

This changeset adds an `input` option to the `run` plugin. This options allows specifying which entry point to run if you have multiple in your bundle.
