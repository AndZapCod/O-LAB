const pool = require('../../../paquetes/base_datos/DB_conexion');

let consultarInvAux = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM inventario WHERE tipo != \'kit\';');
        res.status(200).json(response.rows);
        return;
    }
    catch (e) {
        res.status(400).json('Error: No se pudo conectar con la base de datos');
        return;
    }
}

let consultarInv = async (req,res) => {
    try {
        const response = await pool.query('SELECT * FROM cliente_inventario WHERE tipo != \'kit\';');
        res.status(200).json(response.rows);
        return;
    }
    catch (e) {
        res.status(400).json('Error: No se pudo conectar con la base de datos');
        return;
    }
}

let crearObjeto = async (req, res) => {

    const {
        serial,
        placa,
        nombre,
        ubicacion,
        valor,
        cantidad,
        unidad,
        categoria,
        tipo
    } = req.body;

    if (serial == undefined) {
        res.status(400).json("Tiene que proporcionarse un serial");
        return;
    }
    if (nombre == undefined) {
        res.status(400).json("Tiene que proporcionarse un nombre");
        return;
    }
    if (tipo == undefined) {
        res.status(400).json("Tiene que proporcionarse un tipo");
        return;
    }
    if (cantidad == undefined) {
        res.status(400).json("Tiene que proporcionarse una cantidad");
        return;
    }
    
    inicio = 'INSERT INTO inventario';
    campos = '(serial,nombre,tipo,cantidad,disponibles';
    valores = `('${serial}','${nombre}','${tipo}','${cantidad}','${cantidad}'`;
    if (placa != undefined) {
        campos += ',placa';
        valores += `,'${placa}'`;
    }
    if (ubicacion != undefined) {
        campos += ',ubicacion';
        valores += `,'${ubicacion}'`;
    }
    if (valor != undefined) {
        campos += ',valor';
        valores += `,'${valor}'`;
    }
    if (unidad != undefined) {
        campos += ',unidad';
        valores += `,'${unidad}'`;
    }
    if (categoria != undefined) {
        campos += ',categoria';
        valores += `,'${categoria}'`;
    }
    campos += ')';
    valores += ')';
    const query = inicio+campos+' VALUES '+valores+';';
    try {
        await pool.query(query);
        res.status(200).json("Se ha creado el objeto en el inventario");
        return;
    }
    catch (e) {
        if ('code' in e) {
            switch (e.constraint) {
                case 'inventario_pkey':
                    res.status(400).json("Ya existe un objeto con ese serial");
                    break;
                case 'inventario_placa_key':
                    res.status(400).json("Ya existe un objeto con esa placa");
                    break;
                case 'inventario_cantidad_check':
                    res.status(400).json("La cantidad debe ser positiva");
                default:
                    res.status(500).json('No se creo el nuevo objeto, razon: '+e);
            }
            return;
        }
        res.status(500).json('No se creo el nuevo objeto, razon: '+e);
        return;
    }
}

let modificarObjeto = async (req,res) => {
    const ser = req.params.serial;
    const {
        serial,
        placa,
        nombre,
        ubicacion,
        valor,
        cantidad,
        unidad,
        categoria,
        tipo
    } = req.body;
    
    var query = 'UPDATE inventario SET ';
    var added = false;
    if (serial != undefined) {
        query += `serial='${serial}'`;
        added = true;
    }
    if (placa != undefined) {
        if (added) {
            query += `,placa='${placa}'`;
        }
        else {
            query += `placa='${placa}'`;
            added = true;
        }
    }
    if (nombre != undefined) {
        if (added) {
            query += `,nombre='${nombre}'`;
        }
        else {
            query += `nombre='${nombre}'`;
            added = true;
        }
    }
    if (ubicacion != undefined) {
        if (added) {
            query += `,ubicacion='${ubicacion}'`;
        }
        else {
            query += `ubicacion='${ubicacion}'`;
            added = true;
        }
    }
    if (valor != undefined) {
        if (added) {
            query += `,valor='${valor}'`;
        }
        else {
            query += `valor='${valor}'`;
            added = true;
        }
    }
    if (cantidad != undefined) {
        if (added) {
            query += `,cantidad='${cantidad}'`;
        }
        else {
            query += `cantidad='${cantidad}'`;
            added = true;
        }
    }
    if (unidad != undefined) {
        if (added) {
            query += `,unidad='${unidad}'`;
        }
        else {
            query += `unidad='${unidad}'`;
            added = true;
        }
    }
    if (categoria != undefined) {
        if (added) {
            query += `,categoria='${categoria}'`;
        }
        else {
            query += `categoria='${categoria}'`;
            added = true;
        }
    }
    if (tipo != undefined) {
        if (added) {
            query += `,tipo='${tipo}'`;
        }
        else {
            query += `tipo='${tipo}'`;
            added = true;
        }
    }
    if (!added) {
        res.status(400).json("No se proporciono ningun cambio");
        return;
    }
    query += ` WHERE serial='${ser}';`;
    try {
        await pool.query(query);
        res.status(200).json("Se ha modificado el objeto en el inventario");
        return;
    }
    catch (e) {
        if ('code' in e) {
            switch (e.constraint) {
                case 'inventario_pkey':
                    res.status(400).json("Ya existe un objeto con ese serial");
                    break;
                case 'inventario_placa_key':
                    res.status(400).json("Ya existe un objeto con esa placa");
                    break;
                case 'inventario_cantidad_check':
                    res.status(400).json("La cantidad debe ser positiva");
                default:
                    res.status(500).json('No se modifico el objeto, razon: '+e);
            }
            return;
        }
        res.status(500).json('No se modifico el objeto, razon: '+e);
        return;
    }
}

module.exports = {
    consultarInv,
    crearObjeto,
    modificarObjeto,
    consultarInvAux,
};