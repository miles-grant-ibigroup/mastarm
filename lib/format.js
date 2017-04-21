const fs = require('fs')
const path = require('path')

const eslint = require('eslint')
const prettier = require('prettier')
const Linter = require('standard-engine').linter

const logger = require('./logger')
const util = require('./util')

module.exports = function format (files) {
  const linter = new Linter({
    eslint,
    eslintConfig: {
      configFile: path.join(__dirname, './eslintrc.json')
    }
  })

  if (files.length === 0) {
    files = ['__mocks__', '__tests__', 'bin', 'lib', 'src', './']
  }

  const allFiles = util.cliFileEntriesToArray(files, false)
  allFiles.forEach(file => {
    logger.log('formating file: ' + file)
    const fileContents = fs.readFileSync(file, {encoding: 'utf-8'})
    const prettified = prettier.format(fileContents, {
      bracketSpacing: false,
      semi: false,
      singleQuote: true
    })
    const standardized = linter.lintTextSync(prettified, {fix: true})
    let output
    if (!standardized.results[0].output && standardized.errorCount === 0) {
      output = prettified
    } else {
      output = standardized.results[0].output
    }
    if (!output) {
      throw new Error('Failed to fix file with standard')
    }
    fs.writeFileSync(file, output)
  })
}
