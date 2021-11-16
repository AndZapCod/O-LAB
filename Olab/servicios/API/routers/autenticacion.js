const {Router} = require('express')
const router = Router()
const {login,registroU,cambioC} = require('../controladores/autenticacion_controladores')
const { estaLogueado, esAdministrador } = require('../middlewares/auth')

//Ruta para logearse
router.post('/login',login )

//Ruta para cambiar contraseña
router.put('/cambioContrasenia',estaLogueado,cambioC)

//Ruta creacion masiva de usuarios con contraseña generada
//solo permitida para el administrador
router.post('/signup',[estaLogueado,esAdministrador],registroU)

module.exports=router;