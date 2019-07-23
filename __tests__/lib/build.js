// @flow
// Polyfills to support IE, etc.
// Note: I attempted to update to core-js@3, but ran into issues about ES6
// imports. core-js@2 does not have core-js/stable, which is why we're importing
// the root.
// $FlowFixMe - import required for babel polyfill, see https://babeljs.io/docs/en/babel-polyfill
import 'core-js'
// $FlowFixMe - import required for babel polyfill, see https://babeljs.io/docs/en/babel-polyfill
import 'regenerator-runtime/runtime'
// Imports for test
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

  describe('js', () => {
    let unminifiedJsSize = 0
    let minifiedJsDevSize = 0

    it('should transform', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        env: 'development',
        files: [[`${mockDir}/index.js`]]
      })

      const transpiledString = result.toString()
      unminifiedJsSize = transpiledString.length
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(
        -1
      )
    })

    it('should transform and minify', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        env: 'development',
        files: [[`${mockDir}/index.js`]],
        minify: true
      })

      const transpiledString = result.toString()
      minifiedJsDevSize = transpiledString.length
      expect(transpiledString.indexOf('MockTestComponentUniqueName')).not.toBe(
        -1
      )
      expect(minifiedJsDevSize).toBeLessThan(unminifiedJsSize)
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
      expect(transpiledString.length).toBeLessThan(minifiedJsDevSize)
    })
  })

  describe('css', () => {
    let unminifiedCssSize = 0
    it('should transform', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        files: [[`${mockDir}/index.css`]]
      })

      const css = result.css
      expect(css.indexOf('criticalClass')).toBeGreaterThan(-1)
      unminifiedCssSize = css.length
    })

    it('should transform and minify', async () => {
      const [result] = await build({
        config: loadConfig(process.cwd(), null, 'development'),
        files: [[`${mockDir}/index.css`]],
        minify: true
      })

      const css = result.css
      expect(css.indexOf('criticalClass')).toBeGreaterThan(-1)
      expect(css.length).toBeLessThan(unminifiedCssSize)
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
