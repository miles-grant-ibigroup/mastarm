/** Lint messages, find missing messages and those that are unused */

const YAML = require('yamljs')
const { readFileSync } = require('fs')
const glob = require('glob')

const IMPORT = /import ([a-zA-Z0-9]+) from '[^ ]+\/messages'/

module.exports = function () {
  // TODO don't hardwire paths
  const messages = YAML.parse(readFileSync('configurations/default/messages.yml', 'utf8'))

  const missing = [].concat(...glob
    .sync('lib/**/*.js')
    .map(filename => {
      return lintMessages(messages, readFileSync(filename, 'utf8'))
        .map(([message, line]) => [message, filename, line])
    }))

  if (missing.length > 0) {
    console.log(`${missing.length} missing messages`)
    for (const [message, file, line] of missing) {
      console.log(`${file} line ${line}: ${message} is not defined`)
    }
  }
}

/** Lint a file against messages. Exported for testing */
function lintMessages (messages, js) {
  // what was messages imported as
  let importedAtRootAs = false
  let matcher

  // TODO handle importing members, e.g. import { analysis } from messages

  const foundMessages = []

  let lineNumber = 0 // first increment lands at 0

  for (const line of js.split('\n')) {
    lineNumber++
    if (IMPORT.test(line)) {
      importedAtRootAs = IMPORT.exec(line)[1] // get what it was imported as
      matcher = new RegExp(`${importedAtRootAs}\\.([^ ,\\(\\)\\[}]+)`, 'g')
    } else if (importedAtRootAs) {
      let result
      // each subsequent call gets next match
      while ((result = matcher.exec(line)) != null) {
        foundMessages.push([result[1], lineNumber])
      }
    }
  }

  // filter to only the missing ones
  return foundMessages.filter(([message, lineNumber]) => {
    let current = messages
    for (const sub of message.split('.')) {
      current = current[sub]
      if (current == null) {
        return true // something in the chain is undefined
      }
    }

    return false
  })
}
