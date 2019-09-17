const path = require('path')

const pkg = require('./pkg')

module.exports.generateTestConfig = (patterns, options) => {
  // jest config params
  const jestConfig = {
    collectCoverage: options.coverage,
    collectCoverageFrom: ['lib/**/*.js'],
    coverageDirectory: 'coverage',
    moduleFileExtensions: [
      'js',
      'jsx',
      'json',
      'yml'
    ],
    notify: true,
    testPathIgnorePatterns: [
      '<rootDir>/node_modules/',
      '<rootDir>/__tests__/test-utils'
    ],
    testURL: 'http://localhost:9966',
    transform: {
      '\\.yml$': 'jest-yaml-transform',
      '^.+\\.jsx?$': path.resolve(__dirname, 'jest-preprocessor.js')
    }
  }

  // add local package.json-level config options
  if (pkg.jest != null) {
    Object.keys(pkg.jest).forEach(key => {
      jestConfig[key] = pkg.jest[key]
    })
  }

  if (options.coveragePaths) {
    jestConfig.collectCoverageFrom = jestConfig.collectCoverageFrom.concat(
      options.coveragePaths.split(' ')
    )
  }

  if (options.testEnvironment) {
    jestConfig.testEnvironment = options.testEnvironment
  }

  const stringArrayOverrides = ['setupFiles', 'testPathIgnorePatterns']

  stringArrayOverrides.forEach(option => {
    if (options[option]) {
      jestConfig[option] = options[option].split(' ')
    }
  })

  // override config with the values found in a specified file
  if (options.customConfigFile) {
    const customConfig = require(
      path.resolve(process.cwd(), options.customConfigFile)
    )
    Object.keys(customConfig).forEach(key => {
      jestConfig[key] = customConfig[key]
    })
  }

  // jest cli params
  let jestArguments = []

  if (options.forceExit) {
    jestArguments.push('--forceExit')
  }

  if (options.updateSnapshots) {
    jestArguments.push('--updateSnapshot')
  }

  if (options.cache === false) {
    jestArguments.push('--no-cache')
  }

  if (options.runInBand || process.env.CI) {
    jestArguments.push('--runInBand')
  }

  jestArguments.push('--config', JSON.stringify(jestConfig))

  if (options.jestCliArgs) {
    jestArguments = jestArguments.concat(...options.jestCliArgs.split(' '))
  }

  if (patterns) {
    jestArguments = jestArguments.concat(patterns)
  }

  return jestArguments
}
