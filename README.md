<h1 align="center">mastarm</h1>

<p align="center"><img src="mastarm.png" /></p>

<p align="center">Conveyal's front-end JavaScript tool-belt. Build, run, lint and deploy front-end code.</p>

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

## Usage

Entries are in the format `input/file.js:output/file.js`. Not all options pertain to all commands.

```shell
$ mastarm --help

Usage: mastarm <cmd> [options]


Commands:

  build [entries...]             Bundle JavaScript & CSS
  deploy [options] [entries...]  Bundle & Deploy JavaScript & CSS
  lint [paths...]                Lint JavaScript [& CSS coming soon!]

Options:

  -h, --help               output usage information
  -V, --version            output the version number
  -c, --config <path>      Path to configuration files.
  -e, --env <environment>  Environment to use.
  -m, --minify             Minify built files.
  -p, --proxy <address>    Proxy calls through to target address.
  -s, --serve              Serve with budo.
  -w, --watch              Rebuild on changes with watchify.

```

### `build`

Compile JS, HTML, CSS, YAML, Markdown into a single `.js`. Utilizes [babel](https://babeljs.io/), [browserify](https://github.com/substack/node-browserify), [budo](https://github.com/mattdesl/budo), and [postcss](http://postcss.org/).

### `deploy`

Build, push to S3, and invalidate CloudFront in one command.

```shell
$ mastarm deploy --help

Usage: deploy [entries...] [options]

Bundle & Deploy JavaScript & CSS

Options:

  -h, --help    output usage information
  --cloudfront  CloudFront Distribution ID to invalidate.
  --s3bucket    S3 Bucket to push to.

```

### `lint`

Lint using [Standard](http://standardjs.com/). Everything is passed directly to [`standard-engine`](https://github.com/Flet/standard-engine).

```shell
$ mastarm lint
```

You can optionally pass in a directory (or directories) using the glob pattern. Be sure to quote paths containing glob patterns so that they are expanded by standard instead of your shell:

```shell
$ mastarm lint "src/util/**/*.js" "test/**/*.js"
```

Note: by default standard will look for all files matching the patterns: "**/*.js", "**/*.jsx".

