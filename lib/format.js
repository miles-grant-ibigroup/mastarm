const path = require('path')

const eslint = require('eslint')
const prettier = require('prettier')
const Linter = require('standard-engine').linter

const {readFile, writeFile} = require('./fs-promise')
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

  return util.cliFileEntriesToArray(files, false).then(files => {
    return Promise.all(
      files.map(file =>
        readFile(file)
          .then(fileContents => {
            const prettified = prettier.format(fileContents, {
              bracketSpacing: false,
              semi: false,
              singleQuote: true
            })
            const standardized = linter.lintTextSync(prettified, {fix: true})
            let output
            if (
              !standardized.results[0].output && standardized.errorCount === 0
            ) {
              output = prettified
            } else {
              output = standardized.results[0].output
            }
            if (!output) {
              throw new Error('Failed to fix file with standard')
            }
            return writeFile(file, output)
          })
          .then(() => {
            logger.log('formatted file: ' + file)
          })
      )
    )
  })
}
