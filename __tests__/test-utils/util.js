const rimraf = require('rimraf')

const mockDir = '__tests__/test-utils/mocks'

exports.mockDir = mockDir

exports.makeCleanBuiltFilesFn = (filePattern) => {
  return (done) => {
    rimraf(`${mockDir}/${filePattern}*`, done)
  }
}
