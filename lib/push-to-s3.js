const AWS = require('aws-sdk')
const mime = require('mime')
const path = require('path')
const uuid = require('uuid')

const browserify = require('./browserify')
const transformCss = require('./css-transform')

module.exports = function ({
  cloudfront,
  config,
  env,
  log,
  minify,
  s3bucket,
  tag
}) {
  const upload = createUpload({bucket: s3bucket, cloudfront, log, tag})
  return ([entry, outfile]) =>
    log(`:hammer_and_wrench: ${tag} building ${outfile}`)
      .then(() => path.extname(entry) === '.js'
        ? new Promise((resolve, reject) =>
          browserify({config, entry, env, minify})
            .bundle((err, buffer) => err
              ? reject(err)
              : resolve(upload({body: buffer, outfile}))
            )
          )
        : transformCss({config, entry, env, minify})
            .then((results) =>
              upload({body: results.css, outfile}))
      )
}

const createUpload = ({bucket, cloudfront, log, tag}) =>
  ({body, outfile}) =>
    upload({body, bucket, cloudfront, log, outfile, tag})

function upload ({
  body,
  bucket,
  cloudfront,
  log,
  outfile,
  tag
}) {
  const bucketUrl = `https://s3.amazonaws.com/${bucket}`
  return new Promise((resolve, reject) => {
    const s3object = new AWS.S3({
      params: {
        ACL: 'public-read',
        Body: body,
        Bucket: bucket,
        ContentType: mime.lookup(outfile),
        Key: outfile
      }
    })

    const bytes = bytesToSize(body.byteLength || body.length)
    const bucketLink = `<${bucketUrl}/${outfile}|${bucket}/${outfile}>`
    log(`:satellite_antenna: ${tag} uploading to ${bucketLink} (${bytes})`)
    s3object
      .upload()
      .send(function (err) {
        if (err) return reject(new Error(`s3 upload to ${bucket} rejected with ${err.code} ${err.message}`))
        log(`:ok_hand: ${tag} finished uploading to ${bucketLink}`).then(() => {
          if (cloudfront) {
            const cf = new AWS.CloudFront()
            log(`:earth_asia: ${tag} creating cloudfront invalidation at ${outfile}`).then(() => {
              cf.createInvalidation({
                DistributionId: cloudfront,
                InvalidationBatch: {
                  CallerReference: uuid.v4(),
                  Paths: {
                    Quantity: 1,
                    Items: [
                      '/' + outfile
                    ]
                  }
                }
              }, function (err) {
                if (err) return reject(new Error(`cf invalidation rejected with ${err.message}`))
                done()
              })
            })
          } else {
            done()
          }
        })
      })

    function done () {
      log(`:checkered_flag: ${tag} finished with ${outfile}`).then(resolve)
    }
  })
}

function bytesToSize (bytes) {
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb']
  if (bytes === 0) return '0 byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return (bytes / Math.pow(1024, i)).toFixed(2) + sizes[i]
}
