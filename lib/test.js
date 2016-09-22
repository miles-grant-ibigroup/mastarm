
module.exports = function generateTestConfig (config, options) {
  if (config.messages) {
    process.env.MESSAGES = JSON.stringify(config.messages)
  }
  const jestConfig = {
    collectCoverage: true,
    collectCoverageFrom: ['lib/**/*.js'],
    coverageDirectory: 'coverage'
  }
  const jestArguments = []
  if (options.updateSnapshots) {
    jestArguments.push('-u')
  }
  jestArguments.push('--config', JSON.stringify(jestConfig))
  return jestArguments
}
