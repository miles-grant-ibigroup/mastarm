const fs = require('fs')

const glob = require('glob')
const unique = require('lodash.uniq')

const logger = require('./logger')

exports.assertEntriesExist = function (entries) {
  if (entries.length === 0) {
    throw new Error(
      'No file(s) found! Did you spell the filename(s) correctly?'
    )
  }
  entries.forEach(entry => {
    if (!fs.existsSync(entry[0])) {
      throw new Error(`Entry: ${entry[0]} does not exist`)
    }
  })
}

exports.cliFileEntriesToArray = function (files, failOnMissingFile) {
  const foundFiles = []
  const missingFiles = []
  files.forEach(file => {
    if (fs.existsSync(file)) {
      foundFiles.push(file)
    } else {
      missingFiles.push(file)
    }
  })
  if (missingFiles.length > 0) {
    logger.log('some files were not found:')
    missingFiles.forEach(f => logger.log(` - ${f}`))
    if (failOnMissingFile) process.exit(1)
  }

  return [].concat(
    ...foundFiles.map(file => {
      if (fs.statSync(file).isDirectory()) {
        // TODO what if file is already slash-terminated?
        switch (file) {
          case './':
            return glob.sync('./*.js')
          case 'bin':
            return glob.sync('bin/*')
          default:
            return glob.sync(`${file}/**/*.js`)
        }
      } else {
        return file
      }
    })
  )
}

exports.configureEnvironment = ({ config, env }) => {
  Object.assign(
    process.env,
    {
      CONFIG_PATH: config.path,
      MESSAGES: JSON.stringify(config.messages),
      NODE_ENV: env,
      SETTINGS: JSON.stringify(config.settings),
      STORE: JSON.stringify(config.store)
    },
    config.env
  )
}

exports.makeGetFn = targets => {
  return item => {
    const target = targets.find(t => t[item] !== undefined)
    if (target) return target[item]
  }
}

/**
 * Parse entry pairs in the format of `input:output` passed either through the CLI or settings file. If it is not a pair then it uses the `outdir` setting to determine the pairing.
 *
 * @return {Array[String, String]} entries
 */
exports.parseEntries = function (entries, outdir) {
  return unique(entries).map(entry => entry.split(':'))
}

/**
 * A lot of subcommands utilize exact argument lengths. Pop mastarm to handle it.
 */
exports.popMastarmFromArgv = function () {
  process.argv = process.argv.slice(0, 1).concat(process.argv.slice(2))
}
