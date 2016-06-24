
## master

* Fix linter.

## 0.3.3 — 2016-06-21

* feat: Check and install dependencies with `--check-dependencies` flag. closes #15.

## 0.3.2 — 2016-06-14

* Revert solution to #10 for now.

## 0.3.1 — 2016-06-14

* Push CSS to S3 along with JS on deploy. (addresses #11)
* Add error handling to `budo` and `http-proxy`. (addresses #13)
* Update `babel-core` to `6.9.1` to fix a path not found error when installing as local dependency. [More info](https://github.com/mapbox/docbox/issues/13)

## 0.3.0 — 2016-06-10

* Allow for tiered `env.yml` based on `process.env.NODE_ENV`. (addresses #7)
* Add `engines` field to `package.json`.
* Pass multiple input files using `entry:output` signature. (addresses #6)
* Auto-parse objects passed into `envify`. (addresses #10)  
* Switch from `minimist` to `commander`. (addresses #8)

## 0.2.2 — 2016-06-01

* Allow HTML in Markdown.
* Show path when file is missing for PostCSS base64ify errors.
* Emit `file` event on CSS files for `watchify`.
