/* globals afterEach, beforeEach, describe, it, expect, jasmine */

const build = require('../../lib/build')
const loadConfig = require('../../lib/load-config')
const util = require('../test-utils/util.js')

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

describe('build', () => {
  const mockDir = util.mockDir

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
  })
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  describe('development', () => {
    it('should transform js', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        files: [[`${mockDir}/index.js`]]
      })

      const transpiledString = result.toString()
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(-1)
      expect(transpiledString.length).toMatchSnapshot()
    })

    it('should transform css', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        files: [[`${mockDir}/index.css`]]
      })

      const css = result.css
      expect(css.indexOf('criticalClass')).toBeGreaterThan(-1)
      expect(css.length).toMatchSnapshot()
    })
  })

  describe('production', () => {
    it('should transform and minify js and css', async () => {
      const [jsResult, cssResult] = await build({
        config: loadConfig(process.cwd(), null, 'production'),
        env: 'production',
        files: [
          [`${mockDir}/index.js`],
          [`${mockDir}/index.css`]
        ],
        minify: true
      })
      const transpiledString = jsResult.toString()
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(-1)
      expect(cssResult.css.indexOf('criticalClass')).not.toBe(-1)
      expect(transpiledString.length).toMatchSnapshot()
      expect(cssResult.css.length).toMatchSnapshot()
    })
  })
})
