const {Router} = require('express');
const router = Router();
const pool = require('../../../paquetes/base_datos/DB_conexion');
const {ingresoReserva,ObtenerReservas,Reserva, retiroPrestamo}= require('../controladores/prestamos_controladores');
const {estaLogueado,esAuxiliar}= require('../middlewares/auth')
//ruta para crear una reserva (cliente)
router.post('/crearReserva',estaLogueado,ingresoReserva);

//ruta para obtener los prestamos de todos los usuarios (auxiliar)
router.get('/estadoReservas',[estaLogueado,esAuxiliar],ObtenerReservas)

//ruta para obtener los elementos de una reserva en particular (auxiliar)
router.get('/reservaxid/:id',[estaLogueado,esAuxiliar],Reserva)

//ruta para eliminar una reserva (auxiliar)


//ruta para confirmar una reserva como prestamo (se entregan los elementos) (auxiliar)

//ruta para consultar prestamos/reservar de un usuario (cliente-usa token)

//ruta para devolver un prestamo (cliente-usa token)
router.post('/devolverPrestamo/:id', [estaLogueado,esAuxiliar], retiroPrestamo)

module.exports=router;
