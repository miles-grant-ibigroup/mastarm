/* globals describe, it, expect */
const testUtils = require('../../lib/test')

describe('test.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = testUtils.generateTestConfig({
      coveragePaths: 'bin src another-folder',
      updateSnapshots: true,
      cache: false
    })
    expect(cfg).toMatchSnapshot()
  })

  it('setupTestEnvironment should set MESSAGES environment variable if needed', () => {
    testUtils.setupTestEnvironment({ messages: { hi: 'there' } })
    expect(process.env.MESSAGES).toMatchSnapshot()
  })
})
