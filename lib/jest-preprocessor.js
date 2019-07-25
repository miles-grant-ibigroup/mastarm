const {transform} = require('@babel/core')

const babelCfg = require('./babel-config')
const transformCfg = babelCfg('test')
transformCfg.retainLines = true

module.exports = {
  process: function (src) {
    return transform(src, transformCfg).code
  }
}
