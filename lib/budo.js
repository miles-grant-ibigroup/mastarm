const budo = require('budo')
const path = require('path')

const transform = require('./transform')

module.exports = function ({
  config,
  flyle,
  proxy
}) {
  return function ([entry, outfile]) {
    const budoOpts = {
      browserify: {
        debug: true,
        paths: [
          path.join(process.cwd(), '/node_modules'),
          path.join(__dirname, '/../node_modules')
        ],
        transform: transform({
          config,
          env: 'development',
          outfile
        })
      },
      cors: true,
      middleware: [],
      pushstate: true
    }
    if (proxy) {
      const httpProxy = require('http-proxy')
      const proxyServer = httpProxy.createProxyServer({target: proxy})
      proxyServer.on('error', function (err, req, res) {
        console.error(err.stack)
        res.writeHead(500, {'Content-Type': 'text/plain'})
        res.end(err.message)
      })
      budoOpts.middleware.push(function (req, res, next) {
        if (req.url.indexOf('/api') === 0) {
          req.url = req.url.slice(4)
          proxyServer.web(req, res)
        } else {
          next()
        }
      })
    }
    if (flyle) {
      const serveTiles = require('./flyle')
      budoOpts.middleware.push(function (req, res, next) {
        if (req.url.indexOf('/tile') === 0) {
          serveTiles(req, res)
        } else {
          next()
        }
      })
    }

    budo
      .cli([entry + ':' + outfile], budoOpts)
      .on('error', function (err) {
        console.error(err.stack)
      })
  }
}
