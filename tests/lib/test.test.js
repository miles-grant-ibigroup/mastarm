/* globals describe, it, expect */
const should = require('chai').should()

const testUtils = require('../../lib/test')

describe('test.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = testUtils.generateTestConfig({
      coveragePaths: 'bin src another-folder',
      updateSnapshots: true,
      cache: false
    })
    should.exist(cfg)
    cfg.should.be.instanceOf(Array)
    cfg.length.should.equal(4)
    expect(cfg.slice(0, 3)).toMatchSnapshot()
    const jestCfg = JSON.parse(cfg[3])
    jestCfg.should.have.property('scriptPreprocessor')
    jestCfg.scriptPreprocessor.should.contain('lib/jestPreprocessor.js')
    delete jestCfg.scriptPreprocessor
    expect(jestCfg).toMatchSnapshot()
  })

  it('setupTestEnvironment should set MESSAGES environment variable if needed', () => {
    testUtils.setupTestEnvironment({ messages: { hi: 'there' } })
    expect(process.env.MESSAGES).toMatchSnapshot()
  })
})
