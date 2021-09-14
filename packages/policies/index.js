const asyncWrapper = require('./asyncWrapper')
const isSuperAdmin = require('./isSuperAdmin')

module.exports = {
  asyncWrapper,
  isSuperAdmin: asyncWrapper(isSuperAdmin),
}
