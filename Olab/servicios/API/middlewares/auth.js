const pool= require('../../../paquetes/base_datos/DB_conexion')
const codigo = require('../config/codigo')
const jwtoken= require('jsonwebtoken')

let estaLogueado = async (req,res,next)=>{
    const token = req.headers['token-acceso'];
    try{
        if(!token){
            return res.status(403).json('No proporcionó un token');
        }
        const decodificar = jwtoken.verify(token,codigo.SECRETO);
        req.usuarioCorreo=decodificar.correo;
        const consulta = await pool.query(`SELECT * FROM usuarios 
                                            WHERE correo=\'${req.usuarioCorreo}\'`);
        if(consulta.rowCount===0){
            res.status(404).json('El usuario no existe');
        }else{
            next();
        }
    }catch(error){
        if(error.name=='TokenExpiredError'){
            return res.status(401).json('El token ha expirado')
        }else{
            console.log(error)
            res.status(400).json('No se pudo verificar si esta autenticado');
        }
    }
}

let esAuxiliar = async(req,res,next)=>{
    try{
        const consulta = await pool.query(`SELECT  * FROM usuarios WHERE
        correo=\'${req.usuarioCorreo}\'`);
        if(consulta.rows[0].rol!=='auxiliar' && consulta.rows[0].rol!=='administrador'){
            return res.status(403).json('Lo siento pero no es auxiliar');
        }else{
            next();
        }
    }catch(error){
        console.log(error);
        res.status(400).json('No se pudo revisar su rol');
    }
}

let esAdministrador = async(req,res,next)=>{
    try{
        const consulta = await pool.query(`SELECT  * FROM usuarios WHERE
        correo=\'${req.usuarioCorreo}\'`);
        if(consulta.rows[0].rol!=='administrador'){
            return res.status(403).json('Lo siento pero no es administrador');
        }else{
            next();
        }
    }catch(error){
        console.log(error);
        res.status(400).json('No se pudo revisar su rol');
    }
}


module.exports={
    estaLogueado,
    esAuxiliar,
    esAdministrador
};