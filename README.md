# mastarm

Conveyal's front-end JavaScript tool-belt. Build, run, lint and deploy front-end code.

## Install

With [node v6+ and npm 3+ installed](https://nodejs.org/en/download/current/):

```shell
$ npm install -g mastarm
```

## Configuration

[...]

## Build

Compile JS, HTML, CSS, YAML, Markdown into a single `.js`

### Usage

```shell
Usage: mastarm build [entry file] [output file] {OPTIONS}

Options:

  --config

  --debug
```

## Deploy

Build, push to S3, and invalidate CloudFront in one command.

### Usage

[...]

## Lint

Lint using [Standard](http://standardjs.com/). Everything is passed directly to [`standard-engine`](https://github.com/Flet/standard-engine).

### Usage

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

### Usage

[...]
