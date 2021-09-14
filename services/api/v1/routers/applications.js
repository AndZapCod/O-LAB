const express = require('express')
const router = new express.Router()
const {createApplication,
    getApplications,
    getApplication,
    deleteApplication, 
    updateAplication
} = require('../controllers/application.controller')


//registrar aplicacion
router.post('/',  createApplication)


// //consultar todas las aplicaciones
router.get('/',  getApplications)

//consultar aplicacion por id
router.get('/:id',  getApplication)


//borrar aplicacion
router.delete('/:id', deleteApplication)

//actualizar aplicacion
router.patch('/:id', updateAplication)

module.exports = router