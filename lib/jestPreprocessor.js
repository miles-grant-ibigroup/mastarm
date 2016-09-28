const babel = require('babel-core')
const jestPreset = require('babel-preset-jest')

module.exports = {
  process: function (src) {
    const transformCfg = {
      presets: ['es2015', 'react', 'stage-0', jestPreset]
    }
    return babel.transform(src, transformCfg).code
  }
}
