/* globals describe, it, expect */

const jestUtils = require('../../lib/jest')

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
    expect(cfg).toBeTruthy()
    expect(cfg.length).toEqual(8)
    const jestCfg = JSON.parse(cfg.splice(4, 1))
    expect(cfg).toMatchSnapshot()
    expect(jestCfg.transform['.*']).toContain('lib/jest-preprocessor.js')
    delete jestCfg.transform
    expect(jestCfg).toMatchSnapshot()
  })
})
