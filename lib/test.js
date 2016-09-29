const path = require('path')

module.exports.generateTestConfig = (options) => {
  // jest config params
  const jestConfig = {
    cacheDirectory: 'tmp',
    collectCoverage: options.coverage,
    collectCoverageFrom: ['lib/**/*.js'],
    coverageDirectory: 'coverage',
    scriptPreprocessor: path.resolve(__dirname, 'jestPreprocessor.js')
  }

  if (options.coveragePaths) {
    jestConfig.collectCoverageFrom = jestConfig.collectCoverageFrom.concat(options.coveragePaths.split(' '))
  }

  // jest cli params
  const jestArguments = []
  if (options.updateSnapshots) {
    jestArguments.push('-u')
  }

  if (options.cache === false) {
    jestArguments.push('--no-cache')
  }

  jestArguments.push('--config', JSON.stringify(jestConfig))
  return jestArguments
}

module.exports.setupTestEnvironment = (config) => {
  if (config.messages) {
    process.env.MESSAGES = JSON.stringify(config.messages)
  }
}
