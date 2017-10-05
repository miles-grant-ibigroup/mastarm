const AWS = require('aws-sdk')
const mime = require('mime')
const uuid = require('uuid')

const logger = require('./logger')

module.exports = ({s3bucket, cloudfront}) => ({body, outfile}) =>
  upload({body, s3bucket, cloudfront, outfile})

function upload ({body, s3bucket, cloudfront, outfile}) {
  const bucketUrl = `https://s3.amazonaws.com/${s3bucket}`
  return new Promise((resolve, reject) => {
    const s3object = new AWS.S3({
      params: {
        ACL: 'public-read',
        Body: body,
        Bucket: s3bucket,
        ContentType: mime.getType(outfile),
        Key: outfile
      }
    })

    const bytes = bytesToSize(body.byteLength || body.length)
    const bucketLink = `<${bucketUrl}/${outfile}|${s3bucket}/${outfile}>`
    s3object.upload().send(function (err) {
      if (err) {
        return reject(
          new Error(
            `s3 upload to ${bucketLink} rejected with ${err.code} ${err.message}`
          )
        )
      }
      if (cloudfront) {
        const cf = new AWS.CloudFront()
        logger
          .log(`:lightning: *cloudfront:* invalidating path ${outfile}`)
          .then(() => {
            cf.createInvalidation(
              {
                DistributionId: cloudfront,
                InvalidationBatch: {
                  CallerReference: uuid.v4(),
                  Paths: {
                    Quantity: 1,
                    Items: ['/' + outfile]
                  }
                }
              },
              function (err) {
                if (err) {
                  return reject(
                    new Error(`cf invalidation rejected with ${err.message}`)
                  )
                }
                done()
              }
            )
          })
      } else {
        done()
      }
    })

    function done () {
      logger
        .log(`:checkered_flag: *uploaded:* ${bucketLink} (${bytes})`)
        .then(resolve)
    }
  })
}

function bytesToSize (bytes) {
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb']
  if (bytes === 0) return '0 byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return (bytes / Math.pow(1024, i)).toFixed(2) + sizes[i]
}
