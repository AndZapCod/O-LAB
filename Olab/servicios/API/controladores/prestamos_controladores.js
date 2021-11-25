const { Pool } = require('pg');
const pool = require('../../../paquetes/base_datos/DB_conexion');
const generator = require('generate-password');

let ingresoReserva = async (req,res)=>{
    const {elementos,administrador}=req.body;
    try{
        let query='SELECT serial,disponibles FROM inventario WHERE serial IN (';
        for(let i=0;i<elementos.length-1;i++){
            query=query+'\''+elementos[i][0]+'\',';
        }
        query=query+'\''+elementos[elementos.length-1][0]+'\')';
        var resp = await pool.query(query);
        for(let i=0;i<elementos.length;i++){
            for(let j=0;j<resp.rowCount;j++){
                if(elementos[i][0]===resp.rows[j].serial){
                    if(elementos[i][1]>resp.rows[j].disponibles){
                        return res.status(400).json(`No hay suficientes unidades disponibles para el dispositivo con serial ${elementos[i][0]}`)
                    }
                }
            }
        }
        //const resp2= await pool.query('SELECT count(*) AS num_prestamos FROM prestamo');
    }catch(error){
        console.log(error)
        res.status(400).json('No fue posible revisar el inventario')
    }
    let idd='P-'+ generator.generate({length:8,numbers:true});    
    try{

        const consulta1 = await pool.query(`SELECT p.* FROM usuarios u JOIN politicas p 
                                            ON (u.accesibilidad=p.categoria) 
                                            WHERE u.correo=\'${req.usuarioCorreo}\'`);
        if (consulta1.rowCount!==0){
            if(administrador){
                const resp3= await pool.query(`INSERT INTO prestamo VALUES (\'${idd}\',\'${req.usuarioCorreo}\',now()::date,
                (now() + interval '1 hr'*${consulta1.rows[0].horas_reserva})::date,now()::date+${consulta1.rows[0].dias_prestamo},
                ${consulta1.rows[0].max_renovaciones},'FALSE')`);
            }else{
                const resp3= await pool.query(`INSERT INTO prestamo VALUES (\'${idd}\',\'${req.usuarioCorreo}\',now()::date,
                (now() + interval '1 hr'*${consulta1.rows[0].horas_reserva})::date,now()::date+${consulta1.rows[0].dias_prestamo},
                ${consulta1.rows[0].max_renovaciones},'TRUE')`);
            }
        }else{
            return res.status(404).json('No se encontro el usuario')
        }
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un problema para crear el registro en prestamos');
    }
    try{
        let query2='INSERT INTO prestamo_inv VALUES '
        for(let j=0;j<elementos.length;j++){
            if(j!==elementos.length-1){
                query2=query2+'(\''+idd+'\',\''+elementos[j][0]+'\','+elementos[j][1]+'),'
            }else{
                query2=query2+'(\''+idd+'\',\''+elementos[j][0]+'\','+elementos[j][1]+')'
            }
        }
        const resp4 = await pool.query(query2);
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un problema para ingresar datos en prestamos_inv');
    }
    try{
        for (let i=0;i<elementos.length;i++){
            for(let j=0;j<resp.rowCount;j++){
                if(elementos[i][0]===resp.rows[j].serial){
                    const resp5 = await pool.query(`UPDATE inventario SET disponibles=${resp.rows[j].disponibles-elementos[i][1]}
                    WHERE serial=\'${elementos[i][0]}\'`);
                }
            }
        }
        if(administrador){
            res.status(200).json(`Prestamo No. ${idd} creado`); 
        }else{
            res.status(200).json(`Reserva No. ${idd} creada`);
        }
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un problema al cambiar el inventario');
    }
}

let ObtenerReservas = async (req,res)=>{
    try{
        const resp= await pool.query(`SELECT p.prestamo_id, CONCAT(u.nombre,' ',u.apellido1) nombre,u.posicion,
                                    u.correo,p.entrega FROM
                                    usuarios AS u JOIN prestamo AS p ON (u.correo=p.correo_usuario)
                                    WHERE p.en_reserva=TRUE`);
        res.status(200).json(resp.rows);
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un problema para obtener las reservas de los usuarios');
    }
}

let Reserva = async (request,res)=>{
    const idprestamo = request.params.id;
    try{
        const chequeo =await pool.query(`SELECT * FROM prestamo WHERE prestamo_id=\'${idprestamo}\'`);
        if(chequeo.rowCount===0){
            return res.status(404).json('No hay reserva con ese id')
        }
        const consulta = await pool.query(`SELECT pi.serial,i.nombre AS descripcion,i.categoria,i.ubicacion,pi.cantidad 
                                            FROM prestamo_inv AS pi JOIN inventario AS i 
                                            ON (pi.serial=i.serial) WHERE pi.prestamo_id=\'${idprestamo}\'`);
        res.status(200).json(consulta.rows);
    }catch(error){
        console.log(error);
        res.json('Hubo un error para obtener la información');
    }
}

let retiroPrestamo = async (req, res) => {
    const idprestamo = req.params.id;
    try {
        const chequeo = await pool.query(`SELECT * FROM prestamo WHERE prestamo_id=\'${idprestamo}\'
        AND en_reserva=FALSE`);

        if (chequeo.rowCount === 0) {
            res.status(404).json('No hay un prestamo con ese id');
        }
        else {
            const datos = await pool.query('SELECT serial, cantidad FROM prestamo_inv WHERE prestamo_id=\''+idprestamo+'\';')
            var resultados_tmp;
            for (var col of datos.rows) {
                var serial = col.serial;
                var cantidad = col.cantidad;
                resultados_tmp = await pool.query('SELECT disponibles FROM inventario WHERE serial=\''+serial+'\';')
                var disponibles = resultados_tmp.rows[0].disponibles;
                resultado = await pool.query('UPDATE inventario SET disponibles=\''+(disponibles+cantidad).toString()+'\' WHERE serial=\''+serial+'\';');
            }
            await pool.query('DELETE FROM prestamo_inv WHERE prestamo_id=\''+idprestamo+'\';');
            await pool.query('DELETE FROM prestamo WHERE prestamo_id=\''+idprestamo+'\';');
            res.status(200).json('Se actualizo la base de datos eliminando el prestamo')
        }
    }
    catch(error) {
        console.log(error)
    }
}

let pruebas = async (req,res)=>{
    const pass = req.params.pass;
    const nrw = await hashearContrasenia(pass) 
    res.json(nrw);
}

let misPrestamos = async (req,res)=>{
    try{
        const resp= await pool.query(`SELECT prestamo_id,reserva,entrega,devolucion,
                                     renovaciones,en_reserva FROM prestamo WHERE correo_usuario=\'${req.usuarioCorreo}\'`)
        res.status(200).json(resp.rows);
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un error para retornar la información.')
    }
}

let confirmaPrestamo = async (req,res)=>{
    const idd = req.params.id;
    try{
        const confir = await pool.query(`UPDATE prestamo SET en_reserva='0' WHERE prestamo_id=\'${idd}\'`);
        res.status(200).json(`La reserva ${idd} se ha confirmado como prestamo`);
    }catch(error){
        console.log(error)
        res.status(400).json('Hubo error al tratar de confirmar la reserva')
    }
}

let eliminarReserva = async (req,res)=>{
    const idd = req.params.id;
    try{
        const consulta = await pool.query(`SELECT correo_usuario FROM prestamo
                                           WHERE prestamo_id=\'${idd}\' AND en_reserva='1'`)
        if(consulta.rowCount===0){
            return res.status(404).json('No hay reserva con ese id');
        }
        const consulta2 = await pool.query(`SELECT * FROM prestamo_inv WHERE prestamo_id=\'${idd}\'`)
        const resp = await pool.query(`DELETE FROM prestamo WHERE prestamo_id=\'${idd}\'`)
        for(let i=0;i<consulta2.rowCount;i++){
            let consulta3 = await pool.query(`SELECT serial,disponibles 
                                          FROM inventario WHERE serial=\'${consulta2.rows[i].serial}\'`)
            let nuevoC = consulta2.rows[i].cantidad+consulta3.rows[0].disponibles
            const resp2 = await pool.query(`UPDATE inventario SET disponibles=${nuevoC} 
                                           WHERE serial=\'${consulta2.rows[i].serial}\'`);
        }
        res.status(200).json(`La reserva ${idd} ha sido eliminada`);
    }catch(error){
        console.log(error)
        res.status(400).json('No se pudo eliminar la reserva')
    }
}

let obtenerPrestamos = async (req,res)=>{
    try{
        const consulta = await pool.query(`SELECT p.prestamo_id, CONCAT(u.nombre,' ',u.apellido1) nombre,u.posicion,
                                            u.correo,p.entrega,p.devolucion FROM
                                            usuarios AS u JOIN prestamo AS p ON (u.correo=p.correo_usuario)
                                            WHERE p.en_reserva=FALSE`);
        res.status(200).json(consulta.rows);
    }catch(error){
        console.log(error)
        res.status(400).json('Error al obtener la información en postgres');
    }
}

let Elprestamo = async (req,res)=>{
    const idd = req.params.id;
    try{
        const chequeo = await pool.query(`SELECT correo_usuario FROM prestamo
                                         WHERE prestamo_id=\'${idd}\' and en_reserva='0'`);
        if(chequeo.rowCount===0){
            return res.status(404).json('El prestamo no existe o aun es reserva');
        }else if (chequeo.rows[0].correo_usuario!==req.usuarioCorreo){
            return res.status(403).json('No puede ver información de este préstamo');
        }else{
            const prestamo = await pool.query(`SELECT pi.serial,i.nombre AS descripcion,i.categoria,i.ubicacion,pi.cantidad 
                                                FROM prestamo_inv AS pi JOIN inventario AS i 
                                                ON (pi.serial=i.serial) WHERE pi.prestamo_id=\'${idd}\'`)
            res.status(200).json(prestamo.rows);
        }
    }catch(error){
        console.log(error)
        res.status(400).json(`Error al consultar la información de postgres`)
    }
}

module.exports={ingresoReserva,
    ObtenerReservas,Reserva,
    retiroPrestamo,pruebas,
    misPrestamos,confirmaPrestamo,
    eliminarReserva,
    obtenerPrestamos,
    Elprestamo};