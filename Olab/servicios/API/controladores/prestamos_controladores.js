const { Pool } = require('pg');
const pool = require('../../../paquetes/base_datos/DB_conexion');

let ingresoReserva = async (req,res)=>{
    const {elementos}=req.body;
    try{
        let query='SELECT serial,disponibles FROM inventario WHERE serial IN (';
        for(let i=0;i<elementos.length-1;i++){
            query=query+'\''+elementos[i][0]+'\',';
        }
        query=query+'\''+elementos[elementos.length-1][0]+'\')';
        const resp = await pool.query(query);
        for(let i=0;i<elementos.length-1;i++){
            if(elementos[i][1]>resp.rows[i].disponibles){
                return res.status(400).json(`No hay suficientes unidades disponibles para el dispositivo con serial ${elementos[i][0]}`)
            }
        }
        const resp2= await pool.query('SELECT count(*) AS num_prestamos FROM prestamo');
        const idd='PRE-'+(parseInt(resp2.rows[0].num_prestamos)+1);
        const resp3= await pool.query(`INSERT INTO prestamo VALUES (\'${idd}\',\'${req.usuarioCorreo}\',now()::date,
                                       now()::date+3,now()::date+15,5,'TRUE')`);
        let query2='INSERT INTO prestamo_inv VALUES '
        for(let j=0;j<elementos.length;j++){
            if(j!==elementos.length-1){
                query2=query2+'(\''+idd+'\',\''+elementos[j][0]+'\','+elementos[j][1]+'),'
            }else{
                query2=query2+'(\''+idd+'\',\''+elementos[j][0]+'\','+elementos[j][1]+')'
            }
        }
        const resp4 = await pool.query(query2);
        for (let i=0;i<elementos.length;i++){
            const resp5 = await pool.query(`UPDATE inventario SET disponibles=${resp.rows[i].disponibles-elementos[i][1]}
            WHERE serial=\'${elementos[i][0]}\'`);
        }
        res.status(200).json(`Reserva No. ${idd} creada`);
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un problema para crear la reserva');
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
        const chequeo =await pool.query(`SELECT * FROM prestamo WHERE prestamo_id=\'${idprestamo}\'
                                        AND en_reserva=TRUE`);
        if(chequeo.rowCount===0){
            return res.status(404).json('No hay reserva con ese id')
        }
        const consulta = await pool.query(`SELECT pi.serial,i.categoria,i.ubicacion,pi.cantidad 
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

module.exports={ingresoReserva,ObtenerReservas,Reserva, retiroPrestamo};