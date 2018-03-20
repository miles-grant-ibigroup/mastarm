// @flow

const build = require('../../lib/build')
const loadConfig = require('../../lib/load-config')
const util = require('../test-utils/util.js')

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

const MINIFIED_PROD_JS = 250000
const MINIFIED_JS = 350000
const UNMINIFIED_JS = 430000

const UNMINIFIED_CSS = 180000
const MINIFIED_CSS = 100000

describe('build', () => {
  const mockDir = util.mockDir

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
  })
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  describe('js', () => {
    it('should transform', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        env: 'development',
        files: [[`${mockDir}/index.js`]]
      })

      const transpiledString = result.toString()
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(
        -1
      )
      expect(transpiledString.length).toBeGreaterThan(UNMINIFIED_JS)
      expect(transpiledString.length).toBeLessThan(UNMINIFIED_JS + UNMINIFIED_JS)
    })

    it('should transform and minify', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        env: 'development',
        files: [[`${mockDir}/index.js`]],
        minify: true
      })

      const transpiledString = result.toString()
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(
        -1
      )
      expect(transpiledString.length).toBeGreaterThan(MINIFIED_JS)
      expect(transpiledString.length).toBeLessThan(UNMINIFIED_JS)
    })

    it('should transform, minify, and use production settings', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'production'),
        env: 'production',
        files: [[`${mockDir}/index.js`]],
        minify: true
      })

      const transpiledString = result.toString()
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(
        -1
      )
      expect(transpiledString.length).toBeGreaterThan(MINIFIED_PROD_JS)
      expect(transpiledString.length).toBeLessThan(MINIFIED_JS)
    })
  })

  describe('css', () => {
    it('should transform', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        files: [[`${mockDir}/index.css`]]
      })

      const css = result.css
      expect(css.indexOf('criticalClass')).toBeGreaterThan(-1)
      expect(css.length).toBeGreaterThan(UNMINIFIED_CSS)
    })

    it('should transform and minify', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        files: [[`${mockDir}/index.css`]],
        minify: true
      })

      const css = result.css
      expect(css.indexOf('criticalClass')).toBeGreaterThan(-1)
      expect(css.length).toBeGreaterThan(MINIFIED_CSS)
      expect(css.length).toBeLessThan(UNMINIFIED_CSS)
    })
  })

  describe('production', () => {
    it('should transform and minify js and css at the same time', async () => {
      const [jsResult, cssResult] = await build({
        config: loadConfig(process.cwd(), null, 'production'),
        env: 'production',
        files: [[`${mockDir}/index.js`], [`${mockDir}/index.css`]],
        minify: true
      })
      const transpiledString = jsResult.toString()
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(
        -1
      )
      expect(cssResult.css.indexOf('criticalClass')).not.toBe(-1)
    })
  })
})
