import React, { Component } from 'react'

import png from '../../../mastarm.png'

// Check that we can import both commonjs and es6 modules
const uuid = require('uuid')

/**
 * A Mock Component to test to ensure that building of React jsx components works
 */
export default class MockTestComponentUniqueName extends Component {
  static defaultProps = {
    test: 'hi'
  }

  doSomeFancyAsyncThingy = async () => {
    await Promise.resolve('hi')
  }

  /**
   * Render the component.
   */
  render() {
    return <div />
  }
}

console.log(uuid.v4())
console.log(png.length)
