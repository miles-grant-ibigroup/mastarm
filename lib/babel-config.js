const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('@babel/preset-env')
const flow = require('@babel/preset-flow')
const react = require('@babel/preset-react')
const istanbul = require('babel-plugin-istanbul')
const lodash = require('babel-plugin-lodash')
const reactRequire = require('babel-plugin-react-require').default
const classProperties = require('@babel/plugin-proposal-class-properties')
const exportFrom = require('@babel/plugin-proposal-export-namespace-from')
const reactDisplayName = require('@babel/plugin-transform-react-display-name')
const runtime = require('@babel/plugin-transform-runtime')

const browsers = require('./constants').BROWSER_SUPPORT

module.exports = function (env, instrument) {
  const plugins = [
    addExports,
    classProperties,
    exportFrom,
    lodash,
    [runtime, { corejs: 2 }],
    reactDisplayName,
    reactRequire
  ]

  if (instrument) { plugins.push(istanbul) }

  return {
    plugins,
    presets: [
      [
        babelEnv,
        {
          loose: false, // Loose mode breaks spread operator on `Set`s
          targets: { browsers },
          useBuiltIns: 'entry'
        }
      ],
      flow,
      react
    ]
  }
}
