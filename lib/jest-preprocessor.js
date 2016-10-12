const babel = require('babel-core')

const transformCfg = require('./babel-config')

module.exports = {
  process: function (src) {
    transformCfg.retainLines = true
    return babel.transform(src, transformCfg).code
  }
}
