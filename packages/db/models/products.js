const sequelize = require('../config/index') 
const Sequelize = require('sequelize')

const Products = sequelize.define('Application', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },

    placa:{
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    nombre:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    ubicacion:{
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    valor:{
        type: Sequelize.INTEGER,
        allowNull: false,
        required: true
    },
    cantidad:{
        type: Sequelize.FLOAT,
        allowNull: false,
        required: true
    },
    unidad:{
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    disponibles:{
        type: Sequelize.FLOAT,
        allowNull: false,
        required: true
    },
    categoria:{
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    }
    
    
},{
    tableName: 'Products',
  },

)



module.exports = Products