const {Router} = require('express');
const router = Router();
const {auxiliares,agregarA,eliminarA}=require('../controladores/usuarios_controladores');
const { estaLogueado, esAdministrador } = require('../middlewares/auth');

//ruta obtener auxiliares
router.get('/auxiliares',[estaLogueado,esAdministrador],auxiliares)

//ruta agregar un auxiliar de usuarios ya registrados
router.put('/agregarAuxiliar',[estaLogueado,esAdministrador],agregarA)

//ruta modificar informacion de auxiliares
//router.put('/modificarAuxiliar',modificarA)

//ruta eliminar un auxiliar (cambiar rol a cliente)
router.put('/eliminarAuxiliar',[estaLogueado,esAdministrador],eliminarA)


module.exports=router;