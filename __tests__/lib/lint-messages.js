// @flow

const testFile = `
import messages, { analysis, project as proj } from '../utils/messages'
import Component, { React, PropTypes } from 'react'

const test = messages.common.download
const test2 = messages.common.downloadRegional
const test3 = <div>{analysis.run}</div>
const test3b = <div>{analysis.stop}</div>
const test4 = analysis.stop
const test5 = proj.new
// handle multiple messages in one line
const test6 = test5 ? proj.delete : proj.new
const test7 = test6 ? proj.new : proj.delete
const test8 = test7 ? messages.common.runRegional : messages.common.stopRegional
`

// test messages, some of the referenced messages are undefined
const testMessages = {
  analysis: {
    run: 'Run'
  },
  common: {
    download: 'Download'
  },
  project: {
    new: 'New'
  }
}

describe('lint-messages', () => {
  const {lintFileContents, parseImportLine} = require('../../lib/lint-messages')
  it('should parse root import correctly', () => {
    expect(
      parseImportLine("import msgs from '../utils/messages'")
    ).toMatchSnapshot("import msgs from '../utils/messages'")
  })

  it('should parse named imports correctly', () => {
    expect(
      parseImportLine(
        "import { analysis, project as proj } from '../utils/messages'"
      )
    ).toMatchSnapshot(
      "import { analysis, project as proj } from '../utils/messages'"
    )

    // make sure it works when spacing is smaller
    expect(
      parseImportLine(
        "import {analysis, project as proj} from '../utils/messages'"
      )
    ).toMatchSnapshot(
      "import {analysis, project as proj} from '../utils/messages'"
    )
  })

  it('should parse named and default imports together correctly', () => {
    expect(
      parseImportLine(
        "import messages, { analysis, project as proj } from '../utils/messages'"
      )
    ).toMatchSnapshot(
      "import messages, { analysis, project as proj } from '../utils/messages'"
    )

    // try it with the default import after the named imports
    expect(
      parseImportLine(
        "import { analysis, project as proj }, messages from '../utils/messages'"
      )
    ).toMatchSnapshot(
      "import { analysis, project as proj }, messages from '../utils/messages'"
    )
  })

  it('should lint file', () => {
    expect(lintFileContents(testMessages, testFile)).toMatchSnapshot()
  })
})
