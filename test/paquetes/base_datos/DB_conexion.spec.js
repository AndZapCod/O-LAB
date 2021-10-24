var assert = require('assert');

describe('Deberia conectarse a una base de datos valida', async () => {
    const pool = require('../../../Olab/paquetes/base_datos/DB_conexion');
    it('Deberia poder crear un cliente y hacer NOW', async () => {
        const cliente = await pool.connect()
        const resultado = await cliente.query('SELECT NOW()');
        assert.equal(resultado.rowCount, 1)
        cliente.release()
    })
})