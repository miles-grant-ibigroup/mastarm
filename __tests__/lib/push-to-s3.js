// @flow
const fs = require('fs')
const path = require('path')

const BUILD_DIR = path.join(process.cwd(), '__tests__/test-utils/tmp')
const MOCK_DIR = path.join(process.cwd(), '__tests__/test-utils/mocks')
const files = [
  [`${MOCK_DIR}/index.js`, `${BUILD_DIR}/index.js`],
  [`${MOCK_DIR}/index.css`, `${BUILD_DIR}/index.css`]
]

describe('lib > push to s3', () => {
  const build = require('../../lib/build')
  const createPushToS3 = require('../../lib/push-to-s3')
  const loadConfig = require('../../lib/load-config')

  it('should compile JavaScript and CSS and send to s3 via aws-sdk', () => {
    const config = loadConfig(
      process.cwd(),
      'configurations/default',
      'development'
    )
    const push = createPushToS3({
      config,
      env: 'development',
      minify: false,
      s3bucket: 'test-bucket'
    })
    return build({
      config,
      env: 'development',
      files
    }).then(() =>
      Promise.all(
        files.map((f) => push({ body: fs.readFileSync(f[0]), outfile: f[0] }))
      )
    )
  })
})
