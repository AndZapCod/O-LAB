const express = require('express')
const router = new express.Router()
const {
    createKit,
    getKits,
    deleteKit
} = require('../controllers/kits.controller')


// Crear nuevo kit
router.post('/', createKit)

// Obtener todos los kits
router.get('/', getKits)

// Borrar kit
router.delete('/:id', deleteKit)

module.exports = router