const pool = require('../../../paquetes/base_datos/DB_conexion');

const consultarKits = async (req, res) => {
    try{
        const response = await pool.query('SELECT * FROM kits');
        res.status(200).json(response.rows);
    }catch(e){
        console.log(e)
        res.status(400).json('Error: No se pudo conectar con la base de datos')
    }
};

const consultarKit = async (req, res) => {
    try{
        const kit_id = req.params.id;
        const response = await pool.query(`SELECT * FROM kits WHERE kit_id = \'${kit_id}\';`);
        res.status(200).json(response.rows)
    }catch(e){
        console.log(e);
        res.status(400).json('Error: No se pudo conectar con la base de datos')
    }
};

const crearKit = async (req, res) => {
        // Extraer datos de una request como:
        //    {
        //     "kit_id": "id", 
        //     "nombre": "nombre",
        //     "categoria": "categoria",
        //     "items": [
        //         {
        //             "serial": "serial",
        //             "cantidad": 0,
        //             "estado": "estado"
        //         }
        //     ]
        // }

        const {kit_id, nombre, categoria, items} = req.body;
        
        // Consultar disponibilidad
        try{
            for (let i=0; i < items.length; i++){
                const {serial, cantidad, estado} = items[i];
                
                query = `SELECT disponibles FROM inventario WHERE serial = \'${serial}\';`;
                const response = await pool.query(query);
                const {disponibles} = response.rows[0]

                if(cantidad > disponibles){
                    res.status(400).json(`Error: No hay suficientes items disponibles de ${serial}`)
                }
            };
        }catch(e){
            res.status(400).json('Error: Fallo en la consulta a inventario')
        }
        
        // Agregar Kit y actualizar inventario
        try{
            // INICIO TRANSACCION
            let transac = 'BEGIN;\n';

            // Agregar el kit al inventario
            transac = transac + 'INSERT INTO inventario(serial, nombre, cantidad, disponibles, categoria, tipo)\n';
            transac = transac + `VALUES (\'${kit_id}\', \'${nombre}\', 1, 1, \'${categoria}\', \'kit\');\n`;

            // Insertar items del kit a tabla kits_inv
            transac = transac + 'INSERT INTO kits_inv(kit_id, serial, cantidad, estado)\nVALUES';
            for (let i=0; i < items.length-1; i++){
                const {serial, cantidad, estado} = items[i];
                transac = transac + `(\'${kit_id}\', \'${serial}\', ${cantidad}, \'${estado}\'),\n`;
            };
            const {serial, cantidad, estado} = items[items.length-1];
            transac = transac + `(\'${kit_id}\', \'${serial}\', ${cantidad}, \'${estado}\');\n`;

            // Actualizar la disponibilidad en el inventario
            transac = transac + 'UPDATE inventario SET disponibles = disponibles - kits_inv.cantidad\n';
            transac = transac + `FROM kits_inv WHERE kit_id = \'${kit_id}\' AND inventario.serial = kits_inv.serial;\n` ;
            
            // FIN TRANSACCION
            transac = transac + 'COMMIT;\n';
            await pool.query(transac);
            res.status(200).json('Kit creado con exito');
        }catch(e){
            res.status(400).json('Error: Fallo en la creacion del kit');
        }

};

const deleteKit = async (req, res) => {
    const kit_id = req.params.id;

    try{
        // INICIO TRANSACCION
        let transac = 'BEGIN;\n';

        // Actualizar la disponibilidad en el inventario
        transac = transac + 'UPDATE inventario SET disponibles = disponibles + kits_inv.cantidad\n';
        transac = transac + `FROM kits_inv WHERE kit_id = \'${kit_id}\' AND inventario.serial = kits_inv.serial;\n`;
        
        // Eliminar kit de kits_inv
        transac = transac + `DELETE FROM kits_inv WHERE kit_id = \'${kit_id}\';\n`;
        // Eliminar de inventario
        transac = transac + `DELETE FROM inventario WHERE serial = \'${kit_id}\';\n`;

        // FIN TRANSACCION
        transac = transac + 'COMMIT;';
        await pool.query(transac);
        res.status(200).json('Kit borrado con exito');
    }catch(e){
        res.status(400).json('Error: Fallo en la eliminación del kit');
    }

}

module.exports = {
    consultarKits,
    consultarKit,
    crearKit, 
    deleteKit
}