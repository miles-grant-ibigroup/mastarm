const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('babel-preset-env')
const flowRuntime = require('babel-plugin-flow-runtime')
const react = require('babel-preset-react')
const reactRequire = require('babel-plugin-react-require')
const lodash = require('babel-plugin-lodash')
const runtime = require('babel-plugin-transform-runtime')
const stage2 = require('babel-preset-stage-2')

module.exports = function (env) {
  const browsers = env === 'production'
    ? '> 1%, last 2 versions'
    : '> 10%, last 2 versions'
  return {
    presets: [
      [
        babelEnv, {
          targets: {browsers},
          loose: false // Loose mode breaks spread operator on `Set`s
        }
      ],
      react,
      stage2
    ],
    plugins: [
      addExports,
      [
        flowRuntime, {
          warn: true
        }
      ],
      lodash,
      reactRequire,
      runtime
    ]
  }
}
