/* globals afterEach, beforeEach, describe, it, expect */
const fs = require('fs')

const build = require('../../lib/build')

const util = require('../util.js')

describe('build', () => {
  const buildFilePattern = 'built-build'
  const cleanFn = util.makeCleanBuiltFilesFn(buildFilePattern)
  beforeEach(cleanFn)
  afterEach(cleanFn)

  it('should transform js and css', (done) => {
    build({
      config: {},
      files: [
        ['tests/mocks/mockComponent.js', `tests/mocks/${buildFilePattern}.js`],
        ['tests/mocks/mock.css', `tests/mocks/${buildFilePattern}.css`]
      ]
    })

    // css transform happens asynchronously, so wait 1 second before checking for file
    setTimeout(() => {
      expect(fs.existsSync(`tests/mocks/${buildFilePattern}.js`)).toBeTruthy()
      expect(fs.existsSync(`tests/mocks/${buildFilePattern}.css`)).toBeTruthy()
      done()
    }, 1000)
  })
})
