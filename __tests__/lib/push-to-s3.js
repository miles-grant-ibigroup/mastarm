/* global describe, it */

const BUILD_DIR = '__tests__/test-utils/tmp'
const MOCK_DIR = '__tests__/test-utils/mocks'

describe('lib > push to s3', () => {
  const configPush = require('../../lib/push-to-s3')
  const loadConfig = require('../../lib/load-config')

  it('should compile JavaScript and CSS and send to s3 via aws-sdk', () => {
    const config = loadConfig(process.cwd(), '~/mastarm/configurations/default', 'test')
    const push = configPush({
      env: 'test',
      config,
      minify: false,
      s3bucket: 'test-bucket'
    })
    return Promise.all([
      push([`${MOCK_DIR}/index.js`, `${BUILD_DIR}/index.js`]),
      push([`${MOCK_DIR}/index.css`, `${BUILD_DIR}/index.css`])
    ])
  })
})
