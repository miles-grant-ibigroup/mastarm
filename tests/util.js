const rimraf = require('rimraf')

exports.makeCleanBuiltFilesFn = (filePattern) => {
  return (done) => {
    rimraf(`tests/mocks/${filePattern}*`, done)
  }
}
