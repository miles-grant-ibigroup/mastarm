const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('babel-preset-env')
const react = require('babel-preset-react')
const runtime = require('babel-plugin-transform-runtime')
const stage2 = require('babel-preset-stage-2')

module.exports = function (env) {
  const browsers = env === 'production'
    ? '> 1%, last 2 versions'
    : '> 10%, last 2 versions'
  return {
    presets: [
      [babelEnv, {
        targets: {browsers},
        loose: true
      }],
      react,
      stage2
    ],
    plugins: [
      addExports,
      runtime
    ]
  }
}
