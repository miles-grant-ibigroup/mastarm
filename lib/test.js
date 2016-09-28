const path = require('path')

module.exports.generateTestConfig = (options) => {
  const jestConfig = {
    collectCoverage: options.coverage,
    collectCoverageFrom: ['lib/**/*.js'],
    coverageDirectory: 'coverage',
    scriptPreprocessor: path.resolve(__dirname, 'jestPreprocessor.js')
  }
  const jestArguments = []
  if (options.updateSnapshots) {
    jestArguments.push('-u')
  }
  if (!options.cache) {
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
