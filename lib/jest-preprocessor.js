const babel = require('babel-core')
const babel2015 = require('babel-preset-es2015')
const jestPreset = require('babel-preset-jest')
const reactPreset = require('babel-preset-react')
const stage0Preset = require('babel-preset-stage-0')

module.exports = {
  process: function (src) {
    const transformCfg = {
      presets: [babel2015, reactPreset, stage0Preset, jestPreset],
      retainLines: true
    }
    return babel.transform(src, transformCfg).code
  }
}
