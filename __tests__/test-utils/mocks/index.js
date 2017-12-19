import {Component} from 'react'
import uuid from 'uuid'

import png from '../../../mastarm.png'

export default class MockTestComponentUniqueName extends Component {
  static defaultProps = {
    test: 'hi'
  }

  render () {
    return <div />
  }
}

console.log(uuid.v4())
console.log(png.length)
