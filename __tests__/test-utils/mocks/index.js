import uuid from 'uuid'

export default class MockTestComponentUniqueName {
  static defaultProps = {
    test: 'hi'
  }

  render () {
    return <div />
  }
}

console.log(uuid.v4())
