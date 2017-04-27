/* globals afterEach, beforeEach, describe, expect, it */

const fs = require('fs')

const rimraf = require('rimraf')

const format = require('../../lib/format')

describe('format', () => {
  beforeEach(done => fs.writeFile('test.js', 'function a(){return 1;}', done))
  afterEach(done => rimraf('test.js', done))

  it('can format a file', done => {
    format(['test.js']).then(() => {
      expect(fs.readFileSync('test.js', {encoding: 'utf-8'})).toMatchSnapshot()
      done()
    })
  })
})
