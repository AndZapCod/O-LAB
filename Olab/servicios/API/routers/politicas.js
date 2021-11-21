const {Router} = require('express');
const router = Router();
const {politicas,crearCategoria,actualizarP,usuariosPol,agregarU,eliminarU}=require('../controladores/politicas_controladores');
const { estaLogueado, esAdministrador } = require('../middlewares/auth');
//ruta para obtener la informacion de todas las categorias
router.get('/',[estaLogueado,esAdministrador],politicas);

//ruta para crear una nueva categoria
router.post('/crearCategoria',[estaLogueado,esAdministrador],crearCategoria)

//ruta para modificar las categorias (todas!)
router.put('/actualizarPoliticas',[estaLogueado,esAdministrador],actualizarP)

//ruta para obtener usuarios de una categoria en particular
router.get('/usuarios/:categoria',[estaLogueado,esAdministrador],usuariosPol)

//ruta para agregar usuarios a una categoria
router.put('/agregarUsuario',[estaLogueado,esAdministrador],agregarU)

//ruta para eliminar usuarios de una categoria (se asume que eliminar es pasar a categoria abierta)
router.put('/eliminarUsuario',[estaLogueado,esAdministrador],eliminarU)

module.exports=router;