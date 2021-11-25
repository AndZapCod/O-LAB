const app = require('../../../../Olab/servicios/API/config/app');
const chai = require('chai')
const chaiHttp = require('chai-http')
const codigo = require('../../../../Olab/servicios/API/config/codigo');
const { EjecutarQuery, reiniciarDB } = require('../../../testUtils');
const jwtoken = require('jsonwebtoken');

chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

describe("Deberian funcionar todas las rutas de prestamos", () => {
    
    beforeEach( async () => {
        await reiniciarDB();
    })

    describe("Deberia funcionar la ruta para eliminar prestamos", () => {

        const token1 = jwtoken.sign({correo: 'test1@urosario.edu.co'}, codigo.SECRETO, {expiresIn: "1m"});
        const token2 = jwtoken.sign({correo: 'test2@urosario.edu.co'}, codigo.SECRETO, {expiresIn: "1m"});


        it("Deberia devolver 403 si el usuario no esta autenticado", async () => {
            const id = 2;
            const {err,res} = await chai.request(app)
            .post(`/prestamos/devolverPrestamo/${id}`);
            expect(err).to.be.undefined;
            expect(res).to.have.status(403);
            expect(res.text).to.equal('"No proporcionó un token"');
        })

        it("Deberia devolver 403 si esta logueado, pero no es auxiliar", async () => {
            const id = 2;
            let {err,res} = await chai.request(app)
            .post(`/prestamos/devolverPrestamo/${id}`)
            .set('token-acceso', token1);
            expect(err).to.be.undefined;
            expect(res).to.have.status(403);
            expect(res.text).to.equal('"Lo siento pero no es auxiliar"')
        })
        
        it("Deberia devolver 404 si no existe prestamo con ese ID", async () => {
            const id = 2;
            let {err,res} = await chai.request(app)
            .post(`/prestamos/devolverPrestamo/${id}`)
            .set('token-acceso', token2);
            expect(err).to.be.undefined;
            expect(res).to.have.status(404);
            expect(res.text).to.equal('"No hay un prestamo con ese id"')
        })

        it("Deberia devolver 200 si el prestamo existe, esta logueado y es auxiliar, deberia actualizar valores y eliminar entradas", async () => {
            const id = 1;
            let {err,res} = await chai.request(app)
            .post(`/prestamos/devolverPrestamo/${id}`)
            .set('token-acceso', token2);
            expect(err).to.be.undefined;
            expect(res).to.have.status(200);
            expect(res.text).to.equal('"Se actualizo la base de datos eliminando el prestamo"')

            consulta = await EjecutarQuery('SELECT * FROM prestamo_inv WHERE prestamo_id=\''+id+'\';');
            expect(consulta.rowCount).to.equal(0);

            consulta = await EjecutarQuery('SELECT * FROM prestamo WHERE prestamo_id=\''+id+'\';');
            expect(consulta.rowCount).to.equal(0);

            consulta = await EjecutarQuery('SELECT disponibles FROM inventario WHERE serial=\'aaaa\';');
            expect(consulta.rows[0].disponibles).to.equal(5);

            consulta = await EjecutarQuery('SELECT disponibles FROM inventario WHERE serial=\'aaab\';');
            expect(consulta.rows[0].disponibles).to.equal(1);
        })
    })
})