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
        const consulta = await pool.query(`SELECT rol FROM usuarios WHERE correo=\'${correo}\'`)
        if(consulta.rowCount===0){
            return res.status(404).json('El usuario no esta registrado')
        }
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
        const consulta = await pool.query(`SELECT rol FROM usuarios WHERE correo=\'${correo}\'`)
        if(consulta.rowCount===0){
            return res.status(404).json('El usuario no esta registrado')
        }
        const eliminar = await pool.query(`UPDATE usuarios SET rol='cliente' WHERE
                                            correo=\'${correo}\'`);
        res.status(200).json('Auxiliar eliminado exitosamente')
    }catch(error){
        console.log(error)
        res.status(400).json('Error al cambiar informacion en postgres')
    }
}

let usuarios = async (req,res)=>{
    try{
        const consulta = await pool.query(`SELECT correo,nombre,apellido1,celular,
                                            rol,posicion,accesibilidad
                                            FROM usuarios`);
        res.status(200).json(consulta.rows);
    }catch(error){
        console.log(error)
        res.status(400).json('Error al consultar la información en postgres')
    }
}

module.exports={
    auxiliares,
    agregarA,
    eliminarA,
    usuarios
}