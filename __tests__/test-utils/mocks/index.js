import uuid from 'uuid'

export default class MockTestComponentUniqueName {
  static defaultProps = {
    test: 'hi'
  }

  render () {
    <div />
  }
}

uuid.v4()
