const {Router} = require('express')
const router = Router()
const { consultarInv, crearObjeto, modificarObjeto, consultarInvAux } = require('../controladores/inventario_controladores')
const { estaLogueado, esAuxiliar } = require('../middlewares/auth')

router.get('/consultar_aux', [estaLogueado, esAuxiliar], consultarInvAux);

router.get('/consultar', estaLogueado, consultarInv);

router.post('/crear', [estaLogueado, esAuxiliar], crearObjeto);

router.post('/modificar/:serial', [estaLogueado, esAuxiliar], modificarObjeto)

module.exports = router;