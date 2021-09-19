const sequelize = require('../config/index') 
const Sequelize = require('sequelize')

const Kits = sequelize.define('kits',{
    kit_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },

    nombre:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    
    cantidad:{
        type: Sequelize.DOUBLE,
    },

    disponibles:{
        type: Sequelize.DOUBLE
    }
})


module.exports = Kits