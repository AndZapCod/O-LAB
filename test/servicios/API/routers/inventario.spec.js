const app = require('../../../../Olab/servicios/API/config/app');
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const codigo = require('../../../../Olab/servicios/API/config/codigo');
const { EjecutarQuery, reiniciarDB } = require('../../../testUtils');
const jwtoken = require('jsonwebtoken');

chai.use(chaiHttp);
chai.use(chaiSubset);
chai.should();

const expect = chai.expect;

describe('Deberian funcionar todas las rutas de inventario', () => {

    beforeEach( async () => {
        await reiniciarDB();
    })
    
    const token = jwtoken.sign({correo: 'test2@urosario.edu.co'}, codigo.SECRETO, {expiresIn: "1m"});

    describe('Deberia funcionar la ruta para consultar el inventario', () => {
        it('Deberia devolver todos los objetos del inventario que no tengan tipo \'kit\' si está logueado y es auxiliar o admin', async () => {
            const {err,res} = await chai.request(app)
            .get('/inventario/consultar')
            .set('token-acceso', token);
            expect(err).to.be.undefined;
            expect(res).to.have.status(200);
            const result = JSON.parse(res.text);
            expect(result).to.containSubset([
                {
                    serial:"aaaa"
                }, {
                    serial:"aaac"
                }
            ])
            expect(result).to.have.length(2);
        })
    })

    describe('Deberia funcionar la ruta para crear un objeto', () => {
        it('Deberia crear un objeto en la DB con los campos mínimos', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                nombre:'protoboard',
                tipo:'obj',
                cantidad:5,
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(200);
            expect(res.text).to.be.equal('"Se ha creado el objeto en el inventario"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(1);
        })
        it('Deberia crear un objeto en la DB con algunos campos opcionales, pero no todos', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                nombre:'protoboard',
                tipo:'obj',
                cantidad:5,
                placa:'123',
                ubicacion:'claustro',
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(200);
            expect(res.text).to.be.equal('"Se ha creado el objeto en el inventario"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(1);
        })
        it('Deberia crear un objeto en la DB con todos los campos', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                placa:'123',
                nombre:'protoboard',
                ubicacion:'claustro',
                valor:'mucho',
                cantidad:5,
                unidad:'unido',
                categoria:'basico',
                tipo:'obj',
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(200);
            expect(res.text).to.be.equal('"Se ha creado el objeto en el inventario"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(1);
        })
        it('Deberia devolver 400 y un mensaje de error si se repite serial', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaaa',
                nombre:'protoboard',
                tipo:'obj',
                cantidad:5,
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Ya existe un objeto con ese serial"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaaa\'');
            expect(result.rowCount).to.equal(1);
        })
        it('Deberia devolver 400 y un mensaje de error si se repite placa', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                nombre:'protoboard',
                tipo:'obj',
                cantidad: 5,
                placa:'333',
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Ya existe un objeto con esa placa"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(0);
        })
        it('Deberia devolver 400 y un mensaje de error si no se proporciona serial', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                nombre:'protoboard',
                tipo:'obj',
                cantidad: 5,
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Tiene que proporcionarse un serial"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(0);
        })
        it('Deberia devolver 400 y un mensaje de error si no se proporciona cantidad', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                nombre:'protoboard',
                tipo:'obj',
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Tiene que proporcionarse una cantidad"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(0);
        })
        it('Deberia devolver 400 y un mensaje de error si no se proporciona nombre', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                tipo:'obj',
                cantidad:5,
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Tiene que proporcionarse un nombre"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(0);
        })
        it('Deberia devolver 400 y un mensaje de error si no se proporciona tipo', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                nombre:'protoboard',
                cantidad:5,
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Tiene que proporcionarse un tipo"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(0);
        })
        it('Deberia devolver 400 y un mensaje de error si se proporciona una cantidad no positiva', async () => {
            const {err,res} = await chai.request(app)
            .post('/inventario/crear')
            .set('token-acceso', token)
            .send({
                serial:'aaad',
                nombre:'protoboard',
                tipo:'obj',
                cantidad:-4,
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"La cantidad debe ser positiva"');

            const result = await EjecutarQuery('SELECT * FROM inventario WHERE serial=\'aaad\'');
            expect(result.rowCount).to.equal(0);
        })
    })
    
    describe('Deberia funcionar la ruta para modificar un objeto', () => {
        const ser = 'aaaa';

        it('Deberia modificar un objeto si todo esta en orden', async () => {
            const {err,res} = await chai.request(app)
            .post(`/inventario/modificar/${ser}`)
            .set('token-acceso', token)
            .send({
                cantidad:7,
                nombre:'pantalla',
                ubicacion:'mutis',
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(200);
            expect(res.text).to.be.equal('"Se ha modificado el objeto en el inventario"');

            const result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}';`);
            expect(result.rowCount).to.be.equal(1);
            expect(result.rows).to.containSubset([{
                cantidad:7,
                nombre:'pantalla',
                ubicacion:'mutis',
            }]);
        })
        it('Deberia devolver 400 y un mensaje de error si no se paso ningun cambio', async () => {
            const old_result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}'`);
            const {err,res} = await chai.request(app)
            .post(`/inventario/modificar/${ser}`)
            .set('token-acceso', token);
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"No se proporciono ningun cambio"');

            const result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}';`);
            expect(result.rowCount).to.be.equal(1);
            expect(result.rows).to.be.deep.equal(old_result.rows);
        })
        it('Deberia devolver 400 y un mensaje de error si se va a cambiar a un serial existente', async () => {
            const old_result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}'`);
            const {err,res} = await chai.request(app)
            .post(`/inventario/modificar/${ser}`)
            .set('token-acceso', token)
            .send({
                serial:'aaab',
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Ya existe un objeto con ese serial"');

            const result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}';`);
            expect(result.rowCount).to.be.equal(1);
            expect(result.rows).to.be.deep.equal(old_result.rows);
        })
        it('Deberia devolver 400 y un mensaje de error si se va a cambiar a una placa existente', async () => {
            const old_result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}'`);
            const {err,res} = await chai.request(app)
            .post(`/inventario/modificar/${ser}`)
            .set('token-acceso', token)
            .send({
                placa:'333',
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"Ya existe un objeto con esa placa"');

            const result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}';`);
            expect(result.rowCount).to.be.equal(1);
            expect(result.rows).to.be.deep.equal(old_result.rows);
        })
        it('Deberia devolver 400 y un mensaje de error si se va a cambiar a una cantidad no positiva', async () => {
            const old_result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}'`);
            const {err,res} = await chai.request(app)
            .post(`/inventario/modificar/${ser}`)
            .set('token-acceso', token)
            .send({
                cantidad:-4,
            });
            expect(err).to.be.undefined;
            expect(res).to.have.status(400);
            expect(res.text).to.be.equal('"La cantidad debe ser positiva"');

            const result = await EjecutarQuery(`SELECT * FROM inventario WHERE serial='${ser}';`);
            expect(result.rowCount).to.be.equal(1);
            expect(result.rows).to.be.deep.equal(old_result.rows);
        })
    })
})