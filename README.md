# mastarm

Conveyal's front-end JavaScript tool-belt. Build, run, lint and deploy front-end code.

## Install

With [node v6+ and npm 3+ installed](https://nodejs.org/en/download/current/):

```shell
$ npm install -g mastarm
```

## Configuration

Mastarm commands can be pointed to a directory containing configuration files using the `--config` flag. By default, Mastarm will look in the `configurations/default` path of the current working directory. Mastarm currently looks for four different files: `env.yml`, `settings.yml`, `store.yml`, and `messages.yml`.

#### `env.yml`

This file should contain strings that can be replaced in front-end JavaScript code using [`envify`](https://github.com/hughsk/envify). [Example in Scenario Editor](https://github.com/conveyal/scenario-editor/blob/master/configurations/default/env.yml.tmp).

#### `messages.yml`

This file should contain string messages to be used throughout the application. It will replace `process.env.MESSAGES` with a string-ified version of the object. Just `JSON.parse` it to have access to all of your messages.

#### `settings.yml`

Settings contain both Mastarm configuration settings and per environment settings to be used in the application. To override base settings, create an environments section in the `yml` file. [Example in Modeify](https://github.com/conveyal/modeify/blob/master/configurations/example/settings.yml#L40). Each section below will contain the settings that they can use.

## Build

Compile JS, HTML, CSS, YAML, Markdown into a single `.js`

Usage:

```shell
$ mastarm build [entry file] [output file] {OPTIONS}
```

Options:

`--config path [default: ./configurations/default]`

Path to find your configurations file.

`--debug [default: process.env.NODE_ENV === 'development']`

Debug mode turns off `uglify`,

`--watch [default: false]`

Auto-rebuilds files on changes.

Example:

```shell
$ mastarm build lib/index.js dist/index.js --debug --watch --config configurations/custom
```

## Deploy

Build, push to S3, and invalidate CloudFront in one command.

#### Usage

[...]

## Lint

Lint using [Standard](http://standardjs.com/). Everything is passed directly to [`standard-engine`](https://github.com/Flet/standard-engine).

#### Usage

```shell
$ mastarm lint
```

You can optionally pass in a directory (or directories) using the glob pattern. Be sure to quote paths containing glob patterns so that they are expanded by standard instead of your shell:

```shell
$ mastarm lint "src/util/**/*.js" "test/**/*.js"
```

Note: by default standard will look for all files matching the patterns: "**/*.js", "**/*.jsx".

## Serve

Build, but with support from `budo`.

#### Usage

[...]
