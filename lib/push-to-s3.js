const AWS = require('aws-sdk')
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
    const s3object = new AWS.S3({
      params: {
        ACL: 'public-read',
        Body: browserify({
          config,
          entry,
          env,
          minify,
          outfile
        }).bundle(),
        Bucket: s3bucket,
        Key: outfile
      }
    })

    console.log('building and pushing %s to s3 bucket %s', outfile, s3bucket)
    s3object
      .upload()
      .send(function (err, data) {
        if (err) {
          console.error(err.stack)
          process.exit(1)
        } else {
          console.log('finished pushing to s3')

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
                console.error(err.stack)
                process.exit(1)
              } else {
                console.log('finished deploying')
                process.exit(0)
              }
            })
          } else {
            console.log('finished deploying')
            process.exit(0)
          }
        }
      })
  }
}
