/* globals describe, expect, it, jest */

const mockSyncFn = jest.fn(() => { return { status: 0, depsWereOk: true } })
jest.mock('check-dependencies', () => { return { sync: mockSyncFn } })

const util = require('../../lib/util')

describe('util.js', () => {
  describe('getCssFiles', () => {
    it('should return correct results', () => {
      expect(util.getCssFiles({ css: false })).toMatchSnapshot()
      expect(util.getCssFiles({ css: true })).toMatchSnapshot()
      expect(util.getCssFiles({ css: true, cssFiles: 'a:b c' })).toMatchSnapshot()
    })
  })

  it('makeGetFn should find the right value', () => {
    expect(util.makeGetFn([{ a: 1 }, { a: 2 }])('a')).toEqual(1)
  })

  describe('parseEntries', () => {
    it('should return default file paths', () => {
      expect(util.parseEntries([], () => null)).toMatchSnapshot()
    })

    it('should return inputted file paths', () => {
      expect(util.parseEntries(['a:b', 'c'])).toMatchSnapshot()
    })
  })

  it('popMastarmFromArgv should remove the mastarm command', () => {
    const argv1 = process.argv[1]
    expect(argv1).toContain('mastarm')
    util.popMastarmFromArgv()
    expect(process.argv[1]).not.toBe(argv1)
  })

  it('updateDependencies should run check-dependencies package', () => {
    util.updateDependencies()
    expect(mockSyncFn).toBeCalled()
  })
})
