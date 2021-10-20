const bcrypt = require('bcrypt');
const jwtoken = require('jsonwebtoken')
const pool = require('../../../paquetes/base_datos/DB_conexion');
const codigo = require('../config/codigo');
const generator = require('generate-password');


let compararContrasenia = async (contraseniaIn,contraseniaG)=>{
    return await bcrypt.compare(contraseniaIn,contraseniaG);
}

let hashearContrasenia = async(contraseniaI)=>{
    const genSalt = await bcrypt.genSalt(10);
    return await bcrypt.hash(contraseniaI,genSalt);
}

let login = async(req,res)=>{
    const {correo,contrasenia} = req.body;
    const consulta1 = await pool.query(`SELECT * FROM usuarios WHERE correo=\'${correo}'\ `);
    if(consulta1.rowCount===0){
        res.status(404).json('No hay usuario con ese email');
    }
    const confirmacion = await compararContrasenia(contrasenia,consulta1.rows[0].contrasenia);
    if(confirmacion){
        const token = jwtoken.sign({correo: correo}, codigo.SECRETO, 
            {expiresIn: 86400});
        res.status(200).json({token});
    }else{
        res.status(401).json('Contraseña errada');
    }
}

let registroU = async (req,res)=>{
    resultado = []
    try{
        let consulta = 'INSERT INTO usuarios (correo,nombre,apellido1,contrasenia,rol,posicion) VALUES (';
        for(let i=0;i<req.body.length;i++){
            const {correo,nombre,apellido1,rol,posicion}=req.body[i]
            const contrasenia = generator.generate({length:10,numbers:true});
            const hashC = await hashearContrasenia(contrasenia);
            if(i!==req.body.length-1){
                consulta = consulta+'\''+correo+'\',\''+nombre+'\',\''+apellido1+'\',\''+hashC+'\',\''+rol+'\',\''+posicion+'\'),('
            }else{
                consulta = consulta+'\''+correo+'\',\''+nombre+'\',\''+apellido1+'\',\''+hashC+'\',\''+rol+'\',\''+posicion+'\')'
            }
            let objeto = {usuario:correo,contrasenia: contrasenia}
            resultado.push(objeto)
        }
        const insercion = await pool.query(consulta);
        res.status(200).json(resultado);
    }catch(error){
        console.log(error);
        res.status(400).json('Hay problemas para registrar los usuarios');
    }
}

let cambioC = async (req,res)=>{
    const Ncontrasenia = req.body.nuevaContrasenia;
    const Vcontrasenia = req.body.antiguaContrasenia;
    try{
        const consulta = await pool.query(`SELECT contrasenia FROM usuarios
        WHERE correo=\'${req.usuarioCorreo}\'`);
        const bool = await compararContrasenia(Vcontrasenia,consulta.rows[0].contrasenia);
        if(bool){
            const HNcont = await hashearContrasenia(Ncontrasenia);
            const insercion = pool.query(`UPDATE usuarios SET contrasenia=\'${HNcont}\'
                                         WHERE correo=\'${req.usuarioCorreo}\'`);
            res.status(200).json('Contraseña actualizada correctamente');
        }else{
            res.status(400).json('Contraseña incorrecta')
        }
    }catch(error){
        console.log(error);
        res.status(400).json('No fue posible actualizar la contraseña')
    }
}

module.exports={login,registroU,cambioC};