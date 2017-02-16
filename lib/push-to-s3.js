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
  return ([entry, outfile]) => (
    path.extname(entry) === '.js'
    ? upload({
      body: browserify({config, entry, env, minify}).bundle(),
      outfile
    })
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

    log(`${tag} building ${outfile} and pushing to ${bucket}`)
    s3object
      .upload()
      .send(function (err) {
        if (err) return reject(err)
        log(`${tag} finished pushing ${outfile} to ${bucket}`)

        if (cloudfront) {
          const cf = new AWS.CloudFront()
          log(`${tag} creating invalidation for CloudFront distribution ${cloudfront} at ${outfile}`)
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
            if (err) return reject(err)
            done()
          })
        } else {
          done()
        }
      })

    function done () {
      log(`${tag} finished deploying ${outfile}`)
      resolve()
    }
  })
}
