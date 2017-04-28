/* globals describe, it, expect */

const jestUtils = require('../../lib/jest')

const JEST_CONFIG_INDEX = 5

describe('test.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = jestUtils.generateTestConfig(['these', 'files', 'only'], {
      cache: false,
      coveragePaths: 'bin src another-folder',
      runInBand: true,
      setupFiles: 'beforeTestsSetup.js',
      testEnvironment: 'node',
      updateSnapshots: true
    })
    cfg[JEST_CONFIG_INDEX] = JSON.parse(cfg[JEST_CONFIG_INDEX])
    expect(cfg[JEST_CONFIG_INDEX].transform['.*']).toContain(
      'lib/jest-preprocessor.js'
    )
    delete cfg[JEST_CONFIG_INDEX].transform
    expect(cfg).toMatchSnapshot()
  })
})
