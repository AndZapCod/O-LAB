const {Router} = require('express');
const router = Router();
const pool = require('../../../paquetes/base_datos/DB_conexion');
const {estaLogueado,esAuxiliar} = require('../middlewares/auth');
const {
    consultarKits,
    consultarKit,
    crearKit,
    deleteKit
} = require('../controladores/kits_controladores');

// ruta para consultar kits
router.get('/kits', estaLogueado, consultarKits);

// ruta para consultar kit conociendo el id
router.get('/kits/:id', estaLogueado,consultarKit);

// ruta para crear un kit
router.post('/crearKit', [estaLogueado,esAuxiliar] ,crearKit);

// ruta para borrar kit
router.delete('/borrarKit/:id', [estaLogueado,esAuxiliar] ,deleteKit);

module.exports = router;