const StandardError = require('standard-error')


/**
 * Este middleware verifica que un usuario loggeado tenga el rol y el expediente activo
 * La idea es utilizarlo en rutas que necesitan verificar rol y expediente
 * Utilizar dentro de asyncWrapper
 * @param {*} req
 */

async function isSuperAdmin(req) {
  if (req.headers['admin-token'] !== process.env.ADMIN_TOKEN) {
    throw new StandardError('polices:adminToken', {
      status: 401,
    })
  }
}

module.exports = isSuperAdmin
