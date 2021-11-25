const bcrypt = require('bcrypt');
const { resourceLimits } = require('worker_threads');
const pool = require('../Olab/paquetes/base_datos/DB_conexion');

let reiniciarDB = async () => {

    const email1 = "test1@urosario.edu.co";
    const email2 = "test2@urosario.edu.co";
    const usr_nombre1 = "Pepito";
    const usr_nombre2 = "Pedro"
    const apellido1 = "Perez";
    const apellido2 = "Paramo";
    const contrasenia1 = "1234";
    const contrasenia2 = "4321";
    const rol1 = "cliente";
    const rol2 = "auxiliar";
    
    const serial1 = "aaaa";
    const serial2 = "aaab";
    const serial3 = "aaac";
    const nombre1 = "arduino";
    const nombre2 = "maccito";
    const nombre3 = "impresora3d";
    const cantidad1 = "5";
    const cantidad2 = "1";
    const cantidad3 = "2";
    const disponibles1 = "3";
    const disponibles2 = "0";
    const disponibles3 = "2";
    const tipo1 = "obj";
    const tipo2 = "kit";
    const tipo3 = "obj";

    const prestamo_id = "1";
    let reserva = new Date();
    reserva.setHours(reserva.getHours()-1)
    reserva = reserva.toISOString();
    let entrega = new Date();
    entrega = entrega.toISOString();
    let devolucion = new Date();
    devolucion.setHours(devolucion.getHours()+1);
    devolucion = devolucion.toISOString();
    const renovaciones = "0";
    const en_reserva = "FALSE";
    
    const inv_cantidad1 = "2";
    const inv_cantidad2 = "1";

    // Limpiando la base de datos
    const result = await pool.query('SELECT tablename FROM pg_tables WHERE schemaname=\'public\';');
    for (row of result.rows) {
        await pool.query(`TRUNCATE TABLE ${row.tablename} CASCADE;`);
    }

    // LLenando la base de datos
    // Creamos un usuario en la base de datos
    const hash_contrasenia1 = await hashearContrasenia(contrasenia1);
    const hash_contrasenia2 = await hashearContrasenia(contrasenia2);
    await pool.query(`INSERT INTO usuarios \
        (correo, nombre, apellido1, contrasenia, rol) VALUES \
        (\'`+email1+'\',\''+usr_nombre1+'\',\''+apellido1+'\',\''+hash_contrasenia1+'\',\''+rol1+'\'),\
        (\''+email2+'\',\''+usr_nombre2+'\',\''+apellido2+'\',\''+hash_contrasenia2+'\',\''+rol2+'\');');

    // Creamos objetos en el inventario
    await pool.query('INSERT INTO inventario \
    (serial, nombre, cantidad, disponibles, tipo, placa) VALUES \
    ('+'\''+serial1+'\',\''+nombre1+'\',\''+cantidad1+'\',\''+disponibles1+'\',\''+tipo1+'\',NULL), \
    ('+'\''+serial2+'\',\''+nombre2+'\',\''+cantidad2+'\',\''+disponibles2+'\',\''+tipo2+'\',NULL), \
    ('+'\''+serial3+'\',\''+nombre3+'\',\''+cantidad3+'\',\''+disponibles3+'\',\''+tipo3+'\',\'333\');');

    // Creamos un prestamo
    await pool.query('INSERT INTO prestamo \
    (prestamo_id, correo_usuario, reserva, entrega, devolucion, renovaciones, en_reserva) VALUES\
    (\''+prestamo_id+'\',\''+email1+'\',\''+reserva+'\',\''+entrega+'\',\''+devolucion+'\',\''+renovaciones+'\',\''+en_reserva+'\');');

    // Agregamos los datos del prestamo a prestamo_inv
    await pool.query('INSERT INTO prestamo_inv \
                (prestamo_id, serial, cantidad) VALUES \
                (\''+prestamo_id+'\',\''+serial1+'\',\''+inv_cantidad1+'\'), \
                (\''+prestamo_id+'\',\''+serial2+'\',\''+inv_cantidad2+'\');');
}

let hashearContrasenia = async(contraseniaI)=>{
    const genSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(contraseniaI,genSalt);
}

let EjecutarQuery = async (query) => {
    return pool.query(query);
}

module.exports={hashearContrasenia, EjecutarQuery, reiniciarDB}