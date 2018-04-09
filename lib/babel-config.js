const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('babel-preset-env')
const flowStripTypes = require('babel-plugin-transform-flow-strip-types')
const react = require('babel-preset-react')
const reactRequire = require('babel-plugin-react-require').default
const lodash = require('babel-plugin-lodash')
const runtime = require('babel-plugin-transform-runtime')
const stage2 = require('babel-preset-stage-2')
const transformDecorators = require('babel-plugin-transform-decorators-legacy').default

module.exports = function (env) {
  const browsers =
    env === 'production' ? '> 1%, last 2 versions' : '> 10%, last 2 versions'

  const plugins = [
    addExports,
    lodash,
    reactRequire,
    runtime
  ]
  if (env === 'production') {
    plugins.push(flowStripTypes)
  } else {
    plugins.push(transformDecorators)
  }

  return {
    plugins,
    presets: [
      [
        babelEnv,
        {
          loose: false, // Loose mode breaks spread operator on `Set`s
          targets: { browsers }
        }
      ],
      react,
      stage2
    ]
  }
}
