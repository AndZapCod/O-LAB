const {Router} = require('express');
const router = Router();
const pool = require('../../../paquetes/base_datos/DB_conexion');
const {
    estaLogueado,
    esAdministrador
} = require('../middlewares/auth');
const {
    consultarKits,
    consultarKit,
    crearKit,
    deleteKit,
    updateKit
} = require('../controladores/kits_controladores');

// ruta para consultar kits
router.get('/kits', estaLogueado, consultarKits);

// ruta para consultar kit conociendo el id
router.get('/kits/:id', estaLogueado,consultarKit);

// ruta para crear un kit
router.post('/crearKit', [estaLogueado,esAdministrador] ,crearKit);

// ruta para borrar kit
router.delete('/borrarKit/:id', [estaLogueado,esAdministrador] ,deleteKit);

// ruta actualizar kit
router.patch('/actualizarKit/:id', [estaLogueado,esAdministrador], updateKit);

module.exports = router;