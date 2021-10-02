const {Router} = require('express');
const router = Router();
const pool = require('../../../paquetes/base_datos/DB_conexion');
const {ingresoPrestamo,ObtenerPrestamos,Prestamo}= require('../controladores/prestamos_controladores');

//ruta para ingresar un prestamo
router.post('/ingresarPrestamo',ingresoPrestamo);

//ruta para obtener los prestamos de un usuario
router.get('/estadoPrestamos/:documento',ObtenerPrestamos)

router.get('/prestamoxid/:id',Prestamo)


module.exports=router;
