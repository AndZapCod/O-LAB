const { Pool } = require('pg');
const pool = require('../../../paquetes/base_datos/DB_conexion');

let politicas = async (req,res)=>{
    try{
        const resp = await pool.query('SELECT * FROM politicas')
        res.status(200).json(resp.rows)
    }catch(error){
        console.log(error)
        res.status(400).json('Error al obtener la información')
    }
}

let crearCategoria = async (req,res)=>{
    const {categoria,horas_reserva,dias_prestamo,max_renovaciones}=req.body;
    try{
        const insertar = await pool.query(`INSERT INTO politicas VALUES (\'${categoria}\',
                                            ${horas_reserva},${dias_prestamo},${max_renovaciones})`);
        res.status(200).json('Categoria creada exitosamente');
    }catch(error){
        console.log(error)
        res.status(400).json('Error en postgres al crear la categoria')
    }
}

let actualizarP = async (req,res)=>{
    try{
        for(let i=0;i<req.body.length;i++){
            const {categoria,horas_reserva,dias_prestamo,max_renovaciones}=req.body[i];
            const cambio = await pool.query(`UPDATE politicas SET horas_reserva=${horas_reserva},
                                            dias_prestamo=${dias_prestamo},max_renovaciones=${max_renovaciones}
                                            WHERE categoria=\'${categoria}\'`)
        }
        res.status(200).json('Categorias actualizadas exitosamente');
    }catch(error){
        console.log(error);
        res.status(400).json('Error durante actualización de información en postgres')
    }
}

let usuariosPol = async (req,res)=>{
    const cat = req.params.categoria;
    try{
        const consulta = await pool.query(`SELECT CONCAT(nombre,' ',apellido1) nombre,correo,posicion,
                                            accesibilidad FROM usuarios 
                                            WHERE accesibilidad=\'${cat}\'`);
        res.status(200).json(consulta.rows);
    }catch(error){
        console.log(error)
        res.status(400).json('Error al obtener información de postgres')
    }
}

let agregarU = async (req,res)=>{
    const {correo,categoria}=req.body;
    try{
        const cambio = await pool.query(`UPDATE usuarios SET accesibilidad=\'${categoria}\'
                                        WHERE correo=\'${correo}\'`);
        res.status(200).json('Actualizacion de categoria exitosa');
    }catch(error){
        console.log(error)
        res.status(200).json('Error al actualizar la información en postgres')
    }
}

let eliminarU = async (req,res)=>{
    const {correo} = req.body;
    try{
        const eliminar = await pool.query(`UPDATE usuarios SET accesibilidad='abierta' 
                                            WHERE correo=\'${correo}\'`);
        res.status(200).json('Eliminación exitosa')
    }catch(error){
        console.log(error)
        res.status(400).json('Error en postgres al cambiar información')
    }
}

module.exports={
    politicas,
    crearCategoria,
    actualizarP,
    usuariosPol,
    agregarU,
    eliminarU
}