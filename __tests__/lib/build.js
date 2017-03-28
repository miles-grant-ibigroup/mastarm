/* globals afterEach, beforeEach, describe, it, expect, jasmine */

const build = require('../../lib/build')
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
        config: {},
        files: [[`${mockDir}/index.js`]]
      })

      console.log(result)

      expect(result.toString().indexOf('MockTestComponentUniqueName')).not.toBe(-1)
    })

    it('should transform css', async () => {
      const [result] = await build({
        config: {},
        files: [[`${mockDir}/index.css`]]
      })

      const css = result.css
      expect(css.indexOf('criticalClass')).toBeGreaterThan(-1)
    })
  })

  describe('production', () => {
    it('should transform and minify js', async () => {
      const output = await build({
        config: {},
        env: 'production',
        files: [
          [`${mockDir}/index.js`],
          [`${mockDir}/index.css`]
        ],
        minify: true
      })

      expect(output[0].toString().indexOf('MockTestComponentUniqueName')).not.toBe(-1)
      expect(output[1].css.indexOf('criticalClass')).not.toBe(-1)
    })
  })
})
