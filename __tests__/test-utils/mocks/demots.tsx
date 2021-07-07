import React, { Component } from 'react'
import uuid from 'uuid'

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

  anotherFancyMethod = (
    numberOfPrints: number,
    stringToPrint: string
  ): Array<string> => {
    const array: Array<string> = Array(numberOfPrints)
    array.fill(stringToPrint)
    return array
  }

  /**
   * Render the component.
   */
  render() {
    return <div />
  }
}

console.log(uuid.v4())
