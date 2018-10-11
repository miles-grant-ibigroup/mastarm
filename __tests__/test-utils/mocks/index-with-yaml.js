import React, {Component} from 'react'
import uuid from 'uuid'

const yaml = require('./mock.yaml')
console.log(yaml)

/**
 * A Mock Component to test to ensure that building of React jsx components works
 */
export default class MockTestComponentUniqueName extends Component {
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
