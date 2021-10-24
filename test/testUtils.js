const bcrypt = require('bcrypt');
const pool = require('../Olab/paquetes/base_datos/DB_conexion');

let hashearContrasenia = async(contraseniaI)=>{
    const genSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(contraseniaI,genSalt);
}

let crearUsuario = async (correo, nombre, apellido1, apellido2, contrasenia, celular, rol, posicion) => {
    let hash_contrasenia = await hashearContrasenia(contrasenia);
    return pool.query(`INSERT INTO usuarios \
    (correo, nombre, apellido1, apellido2, contrasenia, celular, rol, posicion) \
    VALUES (${correo}, ${nombre}, ${apellido1}, ${apellido2}, ${hash_contrasenia}, ${celular}, ${rol}, ${posicion});`);
}

let EjecutarQuery = async (query) => {
    return pool.query(query);
}

module.exports={hashearContrasenia, EjecutarQuery}