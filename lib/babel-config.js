const es2015 = require('babel-preset-es2015')

module.exports = {
  presets: [
    es2015.buildPreset(null, {loose: true}),
    require('babel-preset-react'),
    require('babel-preset-stage-2')
  ],
  plugins: [
    require('babel-plugin-add-module-exports'),
    require('babel-plugin-transform-runtime')
  ]
}
