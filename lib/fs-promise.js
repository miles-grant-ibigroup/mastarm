const fs = require('fs')

exports.readFile = function (file, options) {
  options = options || { encoding: 'utf-8' }
  return new Promise((resolve, reject) =>
    fs.readFile(
      file,
      options,
      (err, data) => (err ? reject(err) : resolve(data))
    )
  )
}

exports.stat = function (file) {
  return new Promise(resolve =>
    fs.stat(file, (err, stats) => resolve({ err, stats }))
  )
}

exports.writeFile = function (file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => (err ? reject(err) : resolve()))
  })
}
