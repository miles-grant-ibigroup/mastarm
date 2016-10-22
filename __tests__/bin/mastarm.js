/* globals afterEach, beforeEach, describe, it, expect */

const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

const mastarm = path.resolve('./bin/mastarm')

const util = require('../test-utils/util.js')

describe('mastarm cli', () => {
  it('should display usage with no args', (done) => {
    exec(`node ${mastarm} --help`, (err, stdout, stderr) => {
      expect(err).toBeNull()
      expect(stdout).toContain('Usage: mastarm [options] [command]')
      expect(stderr).toBe('')
      done()
    })
  })

  describe('build', function () {
    const buildFilePattern = 'built-bin-build'
    const cleanFn = util.makeCleanBuiltFilesFn(buildFilePattern)
    const mockDir = util.mockDir

    beforeEach(cleanFn)
    afterEach(cleanFn)

    it('should build a project', (done) => {
      exec(`node ${mastarm} build ${mockDir}/mockComponent.js:${mockDir}/${buildFilePattern}.js ${mockDir}/mock.css:${mockDir}/${buildFilePattern}.css`,
        (err, stdout, stderr) => {
          expect(err).toBeNull()
          expect(stdout).toBe('')
          expect(stderr).toBe('')
          expect(fs.existsSync(`${mockDir}/${buildFilePattern}.js`)).toBeTruthy()
          expect(fs.existsSync(`${mockDir}/${buildFilePattern}.css`)).toBeTruthy()
          done()
        }
      )
    })
  })

  it('should run lint on a project', (done) => {
    exec(`node ${mastarm} lint`, (err, stdout, stderr) => {
      expect(err).toBeNull()
      expect(stdout).toBe('')
      expect(stderr).toBe('')
      done()
    })
  })
})
