#!/usr/bin/env node

var spawn = require('child_process').spawn
var path = require('path')
var Snazzy = require('snazzy')

var args = process.argv.slice(3)
var command = process.argv[2]

switch (command) {
  case 'lint':
    var standard = spawn(path.join(require.resolve('standard'), '../../.bin/standard'), args)
    standard.stderr.pipe(process.stderr)
    standard.stdout.pipe(new Snazzy()).pipe(process.stdout)
    break
}
