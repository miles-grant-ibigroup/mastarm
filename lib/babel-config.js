// @flow
const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('babel-preset-env')
const flowRuntime = require('babel-plugin-flow-runtime').default
const react = require('babel-preset-react')
const reactRequire = require('babel-plugin-react-require').default
const lodash = require('babel-plugin-lodash')
const runtime = require('babel-plugin-transform-runtime')
const stage2 = require('babel-preset-stage-2')

module.exports = function (env) {
  const browsers =
    env === 'production' ? '> 1%, last 2 versions' : '> 10%, last 2 versions'
  return {
    plugins: [
      addExports,
      [
        flowRuntime,
        {
          warn: true
        }
      ],
      lodash,
      reactRequire,
      runtime
    ],
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
