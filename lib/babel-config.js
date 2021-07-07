const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('@babel/preset-env')
const react = require('@babel/preset-react')
const typescript = require('@babel/preset-typescript')
const istanbul = require('babel-plugin-istanbul')
const lodash = require('babel-plugin-lodash')
const reactRequire = require('babel-plugin-react-require').default
const classProperties = require('@babel/plugin-proposal-class-properties')
const exportFrom = require('@babel/plugin-proposal-export-namespace-from')
const reactDisplayName = require('@babel/plugin-transform-react-display-name')

module.exports = function (env, instrument) {
  const plugins = [
    addExports,
    classProperties,
    exportFrom,
    lodash,
    reactDisplayName,
    reactRequire
  ]

  if (instrument) {
    plugins.push(istanbul)
  }

  return {
    // Typescript plugin requires a filename to be present,
    // but having the filename be the same each time is not a problem
    filename: env,
    ignore: ['**/*.d.ts'],
    plugins,
    // If corejs is needed, it can be enabled here (https://babeljs.io/docs/en/babel-preset-env#corejs)
    presets: [
      [
        babelEnv,
        {
          loose: false, // Loose mode breaks spread operator on `Set`s
          targets: { node: 'current' }
        }
      ],
      react,
      typescript
    ]
  }
}
