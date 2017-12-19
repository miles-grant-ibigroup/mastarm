// @flow
describe('babel', () => {
  /** As of 2016-12-15 this test fails in babel loose mode. https://github.com/babel/babel/issues/4916 */
  it('should iterate correctly over a set after using the spread operator', () => {
    const originalArr = [1, 1]
    const set = new Set(originalArr)
    const arr = [...set]
    expect(arr).toHaveLength(1)
  })
})
