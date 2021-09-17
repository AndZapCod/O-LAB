const pool = require('../../../paquetes/base_datos/DB_conexion');

let ingresoPrestamo = async (req,res)=>{
    const {documento,elementos}=req.body;
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
        const resp3= await pool.query(`INSERT INTO prestamo VALUES (\'${idd}\',${documento},now()::date,
                                       now()::date+3,now()::date+15,5)`);
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
        res.status(200).json(`Prestamo ${idd} confirmado`);
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un problema para insertar el prestamo');
    }
}

let ObtenerPrestamos = async (req,res)=>{
    const doc=req.params.documento;
    try{
        const resp= await pool.query(`SELECT * FROM prestamo WHERE documento=${doc}`);
        res.status(200).json(resp.rows);
    }catch(error){
        console.log(error);
        res.status(400).json('Hay un problema para obtener los prestamos del usuario');
    }
}
module.exports={ingresoPrestamo,ObtenerPrestamos};