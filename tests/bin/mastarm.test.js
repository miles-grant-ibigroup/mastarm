/* globals describe, it, expect */

const exec = require('child_process').exec
const path = require('path')

const mastarm = path.resolve('./bin/mastarm')

describe('mastarm cli', () => {
  it('help should display', (done) => {
    exec(`node ${mastarm} --help`, (err, stdout, stderr) => {
      expect(err).toBeNull()
      expect(stdout).toContain('Usage: mastarm [options] [command]')
      expect(stderr).toBe('')
      done()
    })
  })
})
