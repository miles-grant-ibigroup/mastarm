const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const browserify = require('./browserify')

module.exports = function ({
  cloudfront,
  config,
  env,
  minify,
  s3bucket
}) {
  return function run ([entry, outfile]) {
    const bundle = browserify({
      config,
      entry,
      env,
      minify,
      outfile
    }).bundle()

    const jsupload = upload({
      body: bundle,
      bucket: s3bucket,
      cloudfront,
      outfile
    })

    const cssPath = outfile.replace('.js', '.css')
    const cssupload = upload({
      body: fs.createReadStream(cssPath),
      bucket: s3bucket,
      cloudfront,
      outfile: cssPath
    })

    Promise
      .all([jsupload, cssupload])
      .then(() => {
        process.exit(0)
      })
      .catch((err) => {
        console.error(err.stack)
        process.exit(1)
      })
  }
}

function upload ({
  body,
  bucket,
  cloudfront,
  outfile
}) {
  return new Promise((resolve, reject) => {
    const s3object = new AWS.S3({
      params: {
        ACL: 'public-read',
        Body: body,
        Bucket: bucket,
        Key: outfile
      }
    })

    console.log('building and pushing %s to s3 bucket %s', outfile, bucket)
    s3object
      .upload()
      .send(function (err, data) {
        if (err) {
          reject(err)
        } else {
          console.log('finished pushing %s to s3', outfile)

          if (cloudfront) {
            const cf = new AWS.CloudFront()
            console.log('creating invalidation for cf distribution %s at %s', cloudfront, outfile)
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
            }, function (err, data) {
              if (err) {
                reject(err)
              } else {
                console.log('finished deploying %s', outfile)
                resolve()
              }
            })
          } else {
            console.log('finished deploying %s', outfile)
            resolve()
          }
        }
      })
  })
}
