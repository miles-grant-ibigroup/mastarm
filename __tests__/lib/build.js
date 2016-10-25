/* globals afterEach, beforeEach, describe, it, expect */
const fs = require('fs')

const build = require('../../lib/build')

const util = require('../test-utils/util.js')

describe('build', () => {
  const buildFilePattern = 'built-build'
  const cleanFn = util.makeCleanBuiltFilesFn(buildFilePattern)
  const mockDir = util.mockDir

  beforeEach(cleanFn)
  afterEach(cleanFn)

  it('should transform js and css', (done) => {
    build({
      config: {},
      files: [
        [`${mockDir}/mockComponent.js`, `${mockDir}/${buildFilePattern}.js`],
        [`${mockDir}/mock.css`, `${mockDir}/${buildFilePattern}.css`]
      ]
    })

    // css transform happens asynchronously, so wait 1 second before checking for file
    setTimeout(() => {
      expect(fs.existsSync(`${mockDir}/${buildFilePattern}.js`)).toBeTruthy()
      expect(fs.existsSync(`${mockDir}/${buildFilePattern}.css`)).toBeTruthy()
      done()
    }, 1000)
  })
})
