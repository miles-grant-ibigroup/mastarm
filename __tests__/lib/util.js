/* globals describe, expect, it, jest */

const mockSyncFn = jest.fn(() => { return { status: 0, depsWereOk: true } })
jest.mock('check-dependencies', () => { return { sync: mockSyncFn } })
jest.mock('../../lib/pkg', () => { return {} })

const util = require('../../lib/util')

describe('util.js', () => {
  it('makeGetFn should find the right value', () => {
    expect(util.makeGetFn([{ a: 1 }, { a: 2 }])('a')).toEqual(1)
  })

  describe('parseEntries', () => {
    const get = () => null
    it('should try to find default file paths', () => {
      expect(util.parseEntries([], get)).toMatchSnapshot()
    })

    it('should not find any paths if no matches', () => {
      expect(util.parseEntries([], get)).toMatchSnapshot()
    })

    it('should return inputted file paths', () => {
      expect(util.parseEntries(['tests/mocks/mock.css', 'tests/mocks/mockComponent.js:blah'], get)).toMatchSnapshot()
    })
  })

  it('popMastarmFromArgv should remove the mastarm command', () => {
    const argv1 = process.argv[1]
    expect(argv1).toContain('mastarm')
    util.popMastarmFromArgv()
    expect(process.argv[1]).not.toBe(argv1)
  })

  it('updateDependencies should run check-dependencies package', () => {
    const results = util.updateDependencies()
    expect(mockSyncFn).toBeCalled()
    expect(results).toMatchSnapshot()
  })
})
