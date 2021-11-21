const { Pool } = require('pg');
const pool = require('../../../paquetes/base_datos/DB_conexion');

let auxiliares = async (req,res)=>{
    try{
        const resp = await pool.query(`SELECT CONCAT(nombre,' ',apellido1) nombre,correo,celular,posicion
                                        FROM usuarios WHERE rol='auxiliar'`);
        res.status(200).json(resp.rows);
    }catch(error){
        console.log(error)
        res.status(400).json('Error al obtener la información de postgres')
    }
}

let agregarA = async (req,res)=>{
    const {correo} = req.body;
    try{
        const cambio = await pool.query(`UPDATE usuarios SET rol='auxiliar' WHERE
                                        correo=\'${correo}\'`);
        res.status(200).json('Auxiliar agregado exitosamente')
    }catch(error){
        console.log(error)
        res.status(400).json('Error al cambiar informacion en postgres')
    }
}

let eliminarA = async (req,res)=>{
    const {correo} = req.body;
    try{
        const eliminar = await pool.query(`UPDATE usuarios SET rol='cliente' WHERE
                                            correo=\'${correo}\'`);
        res.status(200).json('Auxiliar eliminado exitosamente')
    }catch(error){
        console.log(error)
        res.status(400).json('Error al cambiar informacion en postgres')
    }
}

module.exports={
    auxiliares,
    agregarA,
    eliminarA
}