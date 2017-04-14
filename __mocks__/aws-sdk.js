/* global jest */

const AWS = (module.exports = jest.genMockFromModule('aws-sdk'))
AWS.S3.prototype.upload = () => ({send: fn => fn()})
