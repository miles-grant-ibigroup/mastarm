const budo = require('budo')
const path = require('path')

const transformJs = require('./jsTransform')
const transformCss = require('./cssTransform')
const util = require('./util')

module.exports = function ({
  config,
  files,
  flyle,
  proxy
}) {
  const budoOpts = {
    browserify: {
      debug: true,
      paths: [
        path.join(process.cwd(), '/node_modules'),
        path.join(__dirname, '/../node_modules')
      ],
      transform: transformJs({
        config,
        env: 'development'
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

  const organizedFiles = util.separateCssFiles(files)

  // build css files
  for (var i = 0; i < organizedFiles.css.length; i++) {
    const file = organizedFiles.css[i]
    transformCss({
      filename: file[0],
      outfile: file[1]
    })
  }

  // prepare array of js file for budo
  const budoFiles = organizedFiles.notCss.reduce((prev, cur) => {
    prev.push(cur.join(':'))
    return prev
  }, [])

  budo
    .cli(budoFiles, budoOpts)
    .on('error', function (err) {
      console.error(err.stack)
    })
}
