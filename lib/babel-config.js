const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('@babel/preset-env')
const flow = require('@babel/preset-flow')
const react = require('@babel/preset-react')
const reactRequire = require('babel-plugin-react-require').default
const lodash = require('babel-plugin-lodash')
const reactDisplayName = require('@babel/plugin-transform-react-display-name')
const transformRuntime = require('@babel/plugin-transform-runtime')
const classProperties = require('@babel/plugin-proposal-class-properties')
const exportFrom = require('@babel/plugin-proposal-export-namespace-from')

const browsers = '> 1%'

module.exports = function (env) {
  const plugins = [
    addExports,
    classProperties,
    exportFrom,
    lodash,
    reactDisplayName,
    reactRequire,
    transformRuntime
  ]

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
      flow,
      react
    ]
  }
}
