const {Router} = require('express');
const router = Router();
const pool = require('../../../paquetes/base_datos/DB_conexion');
const {ingresoReserva,ObtenerReservas,Reserva,
    retiroPrestamo,pruebas,misPrestamos,confirmaPrestamo,eliminarReserva,obtenerPrestamos}= require('../controladores/prestamos_controladores');
const {estaLogueado,esAuxiliar, esAdministrador}= require('../middlewares/auth')

//ruta para crear una reserva (cliente)
router.post('/crearReserva',estaLogueado,ingresoReserva);

//ruta para obtener los prestamos de todos los usuarios (auxiliar)
router.get('/estadoReservas',[estaLogueado,esAuxiliar],ObtenerReservas)

//ruta para obtener los elementos de una reserva o prestamo en particular (auxiliar)
router.get('/reservaxid/:id',[estaLogueado,esAuxiliar],Reserva)

//ruta para eliminar una reserva (auxiliar)
router.delete('/eliminarReserva/:id',[estaLogueado,esAuxiliar], eliminarReserva)

//ruta para confirmar una reserva como prestamo (se entregan los elementos) (auxiliar)
router.put('/confirmarPrestamo/:id',[estaLogueado,esAuxiliar], confirmaPrestamo)

//ruta para consultar prestamos/reservar de un usuario (cliente-usa token)
router.get('/usuarioPrestamos',estaLogueado, misPrestamos)

//ruta para devolver un prestamo (cliente-usa token)
router.post('/devolverPrestamo/:id', [estaLogueado,esAuxiliar], retiroPrestamo)

//ruta para obtener prestamos activos (no reservas) (auxiliar)
router.get('/estadoPrestamos',[estaLogueado,esAuxiliar],obtenerPrestamos)

// ruta para hacer prestamo sin reservar
router.post('/prestamoSinReserva',[estaLogueado,esAdministrador],ingresoReserva);
//rutas temporal solo de pruebas (ELIMINAR)
//router.get('/rutas/:pass',pruebas)
module.exports=router;
