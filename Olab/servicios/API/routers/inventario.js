const {Router} = require('express')
const router = Router()
const { consultarInv, crearObjeto, modificarObjeto } = require('../controladores/inventario_controladores')
const { estaLogueado, esAuxiliar } = require('../middlewares/auth')

router.get('/consultar', [estaLogueado, esAuxiliar], consultarInv);

router.post('/crear', [estaLogueado, esAuxiliar], crearObjeto);

router.post('/modificar/:serial', [estaLogueado, esAuxiliar], modificarObjeto)

module.exports = router;