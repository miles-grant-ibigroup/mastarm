/* globals afterEach, beforeEach, describe, it, expect */

const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

const rimraf = require('rimraf')

const mastarm = path.resolve('./bin/mastarm')

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
    const clean = (done) => {
      rimraf('tests/mocks/built.*', done)
    }

    beforeEach(clean)
    afterEach(clean)

    it('should build a project', (done) => {
      exec(`node ${mastarm} build tests/mocks/mockComponent.js:tests/mocks/built.js tests/mocks/mock.css:tests/mocks/built.css`,
        (err, stdout, stderr) => {
          expect(err).toBeNull()
          expect(stdout).toBe('')
          expect(stderr).toBe('')
          expect(fs.existsSync('tests/mocks/built.js')).toBeTruthy()
          expect(fs.existsSync('tests/mocks/built.css')).toBeTruthy()
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
