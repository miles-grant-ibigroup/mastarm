import uuid from 'uuid'
import png from '../../../mastarm.png'

/** A test component */
export default class MockTestComponentUniqueName {
  static defaultProps = {
    test: 'hi'
  }

  /**
   * Render the component.
   */
  render () {
    return <div />
  }
}

console.log(uuid.v4())
console.log(png.length)
