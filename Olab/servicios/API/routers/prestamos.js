const {Router} = require('express');
const router = Router();
const pool = require('../../../paquetes/base_datos/DB_conexion');
const {ingresoPrestamo,ObtenerPrestamos,Prestamo}= require('../controladores/prestamos_controladores');
const {estaLogueado,esAuxiliar}= require('../middlewares/auth')
//ruta para ingresar un prestamo
router.post('/ingresarPrestamo',estaLogueado,ingresoPrestamo);

//ruta para obtener los prestamos de un usuario
router.get('/estadoPrestamos',[estaLogueado,esAuxiliar],ObtenerPrestamos)

router.get('/prestamoxid/:id',Prestamo)


module.exports=router;
