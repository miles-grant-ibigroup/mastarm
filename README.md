# mastarm

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

<p align="center"><img src="mastarm.png" /></p>

<p align="center">Conveyal's front-end JavaScript tool-belt. Build, run, lint and deploy front-end code.</p>

## Table of Contents

* [Node](#node)
* [Install](#install)
* [Configuration](#configuration)
* [CLI Usage](#cli-usage)
  * [Build](#build)
  * [Commit](#commit)
  * [Deploy](#deploy)
  * [Flow](#flow)
  * [Format](#format)
  * [Lint](#lint)
  * [Prepublish](#prepublish)
  * [Test](#test)
  * [Lint Messages](#lint-messages)

## Node

We pin mastarm to a specific version of node due to inconsistencies across installation and building when using multiple versions. *Node 8 is now required to run mastarm*.

## Install

With [node v8 and npm 5 installed](https://nodejs.org/en/download/current/):

```shell
$ npm install -g mastarm
```

## Configuration

Mastarm can be pointed to a directory containing configuration files using the `--config` flag. It will fall back to files in the `configurations/default` path of the current working directory if one of the files below does not exist in config folder specified.

### `env.yml`

This file should contain strings that can be replaced in front-end JavaScript code using [`envify`](https://github.com/hughsk/envify). [Example in Scenario Editor](https://github.com/conveyal/scenario-editor/blob/master/configurations/default/env.yml.tmp).

### `messages.yml`

This file should contain string messages to be used throughout the application. It will replace `process.env.MESSAGES` with a string-ified version of the object. Just `JSON.parse` it on the client to have access to all of your messages.

### `settings.yml`

Settings contain both Mastarm configuration settings and per environment settings to be used in the application and are usually duplicates of what can be passed from the command line. Current Mastarm settings are:

* `cloudfront` {String} CloudFront distribution id that will automatically invalidate file paths after they are deployed to S3
* `entries` {Array} input:output JavaScript & CSS file pairs
* `env` {String} environment override
* `environments` {Object} override top level settings (see [example](https://github.com/conveyal/modeify/blob/master/configurations/example/settings.yml#L40))
* `flyle` {Boolean} serve map tiles from a local cache for working offline
* `s3bucket` {String} bucket to deploy to
* `serve` {Boolean} serve client side files via budo

### `store.yml`

Auto-populate your redux store with this configuration data instead of setting defaults directly in code.

### `style.css`

Add a stylesheet that gets `@import`ed at the beginning of your entry stylesheet. This allows you to override styles for specific deployments and use [custom CSS properties](http://cssnext.io/features/#custom-properties-var). Useful for configuration specific images and colors.

## CLI Usage

Not all options pertain to all commands.  Entries are in the format `input/file.js:output/file.js`.

```shell
$ mastarm --help

  Usage: mastarm [options] [command]


  Commands:

    build [entries...]        Bundle JavaScript & CSS
    commit                    Force intelligent commit messages.
    deploy                    Bundle & Deploy JavaScript & CSS
    flow [command]            Run flow on the current directory.
    format [entries...]       Format JavaScript
    lint                      Lint JavaScript
    lint-messages [paths...]  Check existence of messages used in source code.
    prepublish [entries...]   Transpile JavaScript down to ES5 with Babel
    test [patterns...]        Run tests using Jest
    help [cmd]                display help for [cmd]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -c, --config <path>      Path to configuration files.
    -e, --env <environment>  Environment to use.
    -m, --minify             Minify built files.
    -O, --outdir <dir>       Publish directory
```

### `build`

Compile JS, HTML, CSS, YAML, Markdown into a single `.js`. Utilizes [babel](https://babeljs.io/), [browserify](https://github.com/substack/node-browserify), [budo](https://github.com/mattdesl/budo), and [postcss](http://postcss.org/).

```shell
$ mastarm build --help

  Usage: mastarm-build [options]

  Options:

    -h, --help             output usage information
    -F, --flyle            Cache and serve tiles.
    -p, --proxy <address>  Proxy calls through to target address.
    -s, --serve            Serve with budo. Automatically rebuilds on changes.
    -w, --watch            Automatically rebuild on changes.
```

If no entries are provided, mastarm will use the `entries` option from your `settings.yml` config file. If no entries are found, build will not run.

#### CSS Building

CSS builds occur separately from the browserify build. Any CSS imports into a JavaScript file cause a build error. To build CSS file(s), specify the CSS file(s) as entries in the command. When running in `serve` or `watch` mode, the CSS files get automatically rebuilt, but a manual page refresh is necessary.

### `commit`

Utilize best practices when forming a commit message using [Commitzen](http://commitizen.github.io/cz-cli/) & the [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog) standard.

### `deploy`

Build, push to S3, and invalidate CloudFront in one command. If the static-file-directory flag is set, then mastarm will not build any files with browserify, and instead it will just upload all files in the base level of the specified directory.

```shell
$ mastarm deploy --help

Usage: mastarm-deploy [options]

Options:
  -m, --minify                   Minify built files.
  -O, --outdir <dir>             Publish directory (default: "")
  --cloudfront <id>              CloudFront Distribution ID to invalidate.
  --s3bucket <bucket>            S3 Bucket to push to.
  --static-file-directory <dir>  Directory of static files to deploy in lieu of building
  -h, --help                     output usage information
```

#### Slack Notifications

To enable Slack notifications during the deploy process create a [Slack Webhook](https://api.slack.com/incoming-webhooks) and add two entries `SLACK_WEBHOOK` and `SLACK_CHANNEL` to your `env.yml`.

```
SLACK_CHANNEL: '#devops'
SLACK_WEBHOOK: https://hooks.slack.com/services/fake-code
```

#### MS Teams Notifications

To enable an MS Teams notification upon the completion (successful or not) of the deploy process, create a [MS Teams Webhook](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/connectors/connectors-using#setting-up-a-custom-incoming-webhook) and add the incoming webhook url as the `MS_TEAMS_WEBHOOK` key/value to your `env.yml`.

```
MS_TEAMS_WEBHOOK: https://outlook.office.com/webhook/123...abc
```

### `flow`

Run [Flow](https://flow.org/). Must have a `.flowconfig` in the current working directory and a `// @flow` annotation at the top of each file you want to check. See the Flow website for documentation.

### `format`

Format JavaScript code using [Prettier](https://github.com/prettier/prettier). By default it globs all JavaScript files from the current directory and `__mocks__`, `__tests__`, `bin`, `lib`, and `src`. If you pass files in it directly it will just use those.

```shell
$ mastarm format
```

To format one file:

```shell
$ mastarm format index.js
```

### `lint`

Lint using [Standard](http://standardjs.com/) and various configurations noted in an [internal eslintrc.json file](https://github.com/conveyal/mastarm/blob/dev/lib/eslintrc.json). Everything is passed directly to [`standard-engine`](https://github.com/Flet/standard-engine).

```shell
$ mastarm lint [paths...]
```

Optionally pass in a directory (or directories) using the glob pattern. Quote paths containing glob patterns so that they are expanded by standard instead of your shell:

```shell
$ mastarm lint "src/util/**/*.js" "test/**/*.js"
```

Note: by default standard will look for all files matching the patterns: `"**/*.js"`, `"**/*.jsx"`. Always quote the globs. Needed when used as an `npm` command.

### `prepublish`

Transpile a library using [Babel](http://babeljs.io/) and our custom config. Usually used as a prepublish step for libraries written in ES6+ that will be published to NPM. Pass it a directory and it will look for `.js` files to transpile.

```shell
$ mastarm prepublish lib:build
```

### `test`

Run the [Jest](http://facebook.github.io/jest/) test runner on your project.

```shell
$ mastarm test

Usage: test [options] [patterns...]

Run tests using Jest

Options:

-c, --config <path>                     Path to configuration files. (default: path.join(process.cwd() + '/configurations/default'))
-e, --env <environment>                 Environment to use.
-u, --update-snapshots                  Force update of snapshots. USE WITH CAUTION.
--coverage                              Run Jest with coverage reporting
--coverage-paths <paths>                Extra paths to collect code coverage from in addition to the mastarm default of `lib/**/*.js`
--custom-config-file <path>             Override the Jest config with the values found in a file path relative to the current working directory
--force-exit                            Force Jest to exit after all tests have completed running.
--jest-cli-args <args>                  Extra arguments to pass directly to the Jest Cli. Make sure to encapsulate all extra arguments in quotes
--no-cache                              Run Jest without cache (defaults to using cache)
--run-in-band                           Run all tests serially in the current process. This is always set to true while running on in a continuous integration environment.
--setup-files <paths>                   Setup files to run before each test
--test-environment <env>                Jest test environment to use (Jest default is jsdom)
--test-path-ignore-patterns <patterns>  File patterns to ignore when scanning for test files
-h, --help                              output usage information

```

By default, mastarm will run Jest with most of the defaults in place. The defaults that mastarm adds include:

- some transforms needed to read certain .js files and also YAML files.  
- ignoring the test path directory `__tests__/test-utils`
- setting the [testURL](https://jestjs.io/docs/en/configuration#testurl-string) to `http://localhost:9966`
- turning on [notifications](https://jestjs.io/docs/en/configuration#notify-boolean) of test completion

If the `coverage` flag is set to true, mastarm will automatically generate coverage reports of all .js files in the `lib` folder and will save the reports to the `coverage` folder.

The `patterns` argument will make Jest run only tests whose filename match the provided pattern.

There are a number of ways to set the [Jest config](https://jestjs.io/docs/en/configuration). The first is by adding a `jest` object to the package.json of the project. A number of other mastarm options will override the config. And finally, it is possible to use a custom config file (either .json or .js) via the `--custom-config-file` option. The config values are set and potentially overridden in the following order:

1. mastarm defaults.
2. Options in the `jest` object of the project's package.json file.
3. The values specified in the mastarm arguments `--coverage-paths`, `--setup-files`, `--test-environment` and `--test-path-ignore-patterns`
4. Options set in a custom config file specified in the mastarm argument `--custom-config-file`.

Here is an example of how to set the config using a custom file:

```shell
mastarm test --custom-config-file __tests__/test-utils/mocks/mock-jest-config.json
```

It is also possible to override any [Jest CLI Options](https://jestjs.io/docs/en/cli) by setting the `--jest-cli-args` flag. Ex:

```shell
mastarm test --jest-cli-args "--json --outputFile e2e-test-results/results.json"
```

### `lint-messages`

```shell
$ mastarm lint-messages

Usage: lint-messages [options] [paths...]

Check that all messages used in source code are present in config. Pass in path to source file(s). Set the config with --config.

```

This checks to ensure that all of the messages referenced in JS code are defined in the `messages.yml`
file. It defaults to using the messages in `configurations/default/messages.yml`, however a different
config can be specified with `--config`. By default it will check the JS files in `lib`, but you can
also pass in an arbitrary number of paths to directories or files to lint.

`lint-messages` is somewhat opinionated about how messages should be used in code. They should be imported
from a local module called `messages`, and referred to using dot notation. It will work regardless
of whether you import the top-level messages object or named children. The following import strategies
all work:

    import messages from '../utils/messages'
    import msgs from './messages'
    import { analysis } from './messages'
    import msgs, { project as proj } from '../messages'
    import {analysis, project as proj}, msgs from '../messages'

and permutations thereof. Messages should be referred to directly from these top-level imports, i.e.
you should not refer to messages like this:

    import messages from './messages'
    const { analysis, project } = messages
    return analysis.newScenario

but the following is fine:

    import { analysis } from './messages'
    return analysis.newScenario

[npm-image]: https://img.shields.io/npm/v/mastarm.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/mastarm
[travis-image]: https://img.shields.io/travis/conveyal/mastarm.svg?style=flat-square
[travis-url]: https://travis-ci.org/conveyal/mastarm
