const sequelize = require('../config/index') 
const Sequelize = require('sequelize')
const Products = require('./products')
const Kits = require('./kits')

const KitInv = sequelize.define('kits_inv',{
    kit_id:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },

    serial:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },

    cantidad:{
        type: Sequelize.DOUBLE,
        allowNull: false
    },

    estado:{
        type: Sequelize.STRING,
        allowNull: true
    }
})

KitInv.hasMany(Products, {foreignKey:'serial', sourceKey:'serial'})
KitInv.hasMany(Kits, {foreignKey:'kit_id', sourceKey:'kit_id'})

module.exports = KitInv