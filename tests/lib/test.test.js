/* globals describe, it, expect */

const testUtils = require('../../lib/test')

describe('test.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = testUtils.generateTestConfig({
      coveragePaths: 'bin src another-folder',
      updateSnapshots: true,
      cache: false
    })
    expect(cfg).toBeTruthy()
    expect(cfg.length).toEqual(4)
    expect(cfg.slice(0, 3)).toMatchSnapshot()
    const jestCfg = JSON.parse(cfg[3])
    expect(jestCfg.scriptPreprocessor).toContain('lib/jestPreprocessor.js')
    delete jestCfg.scriptPreprocessor
    expect(jestCfg).toMatchSnapshot()
  })

  it('setupTestEnvironment should set MESSAGES environment variable if needed', () => {
    testUtils.setupTestEnvironment({ messages: { hi: 'there' } })
    expect(process.env.MESSAGES).toMatchSnapshot()
  })
})
