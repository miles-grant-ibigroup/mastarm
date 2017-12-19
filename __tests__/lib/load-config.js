// @flow

const loadConfig = require('../../lib/load-config')

describe('load-config', () => {
  it('should work without any config files present', () => {
    const config = loadConfig(process.cwd(), 'configurations/default', 'test')
    expect(config.path).toContain('mastarm/configurations/default')
    delete config.path
    expect(config).toMatchSnapshot()
  })
})
