const app = require('../../../../Olab/servicios/API/config/app');
const chai = require('chai')
const chaiHttp = require('chai-http')
const codigo = require('../../../../Olab/servicios/API/config/codigo');
const { hashearContrasenia, EjecutarQuery } = require('../../../testUtils');
const jwtoken = require('jsonwebtoken');
const { string } = require('yargs');

chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

describe("Deberian funcionar todas las rutas de prestamos", () => {

    describe("Deberia funcionar la ruta para eliminar prestamos", () => {

        const email1 = "test1@urosario.edu.co";
        const email2 = "test2@urosario.edu.co";
        const usr_nombre1 = "Pepito";
        const usr_nombre2 = "Pedro"
        const apellido1 = "Perez";
        const apellido2 = "Paramo";
        const contrasenia1 = "1234";
        const contrasenia2 = "4321";
        const rol1 = "cliente";
        const rol2 = "auxiliar";
        
        const serial1 = "aaaa";
        const serial2 = "aaab";
        const nombre1 = "arduino";
        const nombre2 = "maccito";
        const cantidad1 = "5";
        const cantidad2 = "1";
        const disponibles1 = "3";
        const disponibles2 = "0";
    
        const prestamo_id = "1";
        let reserva = new Date();
        reserva.setHours(reserva.getHours()-1)
        reserva = reserva.toISOString();
        let entrega = new Date();
        entrega = entrega.toISOString();
        let devolucion = new Date();
        devolucion.setHours(devolucion.getHours()+1);
        devolucion = devolucion.toISOString();
        const renovaciones = "0";
        const en_reserva = "FALSE";
        
        const inv_cantidad1 = "2";
        const inv_cantidad2 = "1";
        
        const token1 = jwtoken.sign({correo: email1}, codigo.SECRETO, {expiresIn: "1m"});
        const token2 = jwtoken.sign({correo: email2}, codigo.SECRETO, {expiresIn: "1m"});

        before(async () => {
            // Creamos un usuario en la base de datos
            const hash_contrasenia1 = await hashearContrasenia(contrasenia1);
            const hash_contrasenia2 = await hashearContrasenia(contrasenia2);
            result = await EjecutarQuery(`INSERT INTO usuarios \
                (correo, nombre, apellido1, contrasenia, rol) VALUES \
                (\'`+email1+'\',\''+usr_nombre1+'\',\''+apellido1+'\',\''+hash_contrasenia1+'\',\''+rol1+'\'),\
                (\''+email2+'\',\''+usr_nombre2+'\',\''+apellido2+'\',\''+hash_contrasenia2+'\',\''+rol2+'\');');
            expect(result.rowCount).to.equal(2);

            // Creamos objetos en el inventario
            result = await EjecutarQuery('INSERT INTO inventario \
                (serial, nombre, cantidad, disponibles) VALUES \
                ('+'\''+serial1+'\',\''+nombre1+'\',\''+cantidad1+'\',\''+disponibles1+'\'), \
                ('+'\''+serial2+'\',\''+nombre2+'\',\''+cantidad2+'\',\''+disponibles2+'\');');
            expect(result.rowCount).to.equal(2);

            // Creamos un prestamo
            result = await EjecutarQuery('INSERT INTO prestamo \
                (prestamo_id, correo_usuario, reserva, entrega, devolucion, renovaciones, en_reserva) VALUES\
                (\''+prestamo_id+'\',\''+email1+'\',\''+reserva+'\',\''+entrega+'\',\''+devolucion+'\',\''+renovaciones+'\',\''+en_reserva+'\');');
            expect(result.rowCount).to.equal(1);

            // Agregamos los datos del prestamo a prestamo_inv
            result = await EjecutarQuery('INSERT INTO prestamo_inv \
                (prestamo_id, serial, cantidad) VALUES \
                (\''+prestamo_id+'\',\''+serial1+'\',\''+inv_cantidad1+'\'), \
                (\''+prestamo_id+'\',\''+serial2+'\',\''+inv_cantidad2+'\');');
            expect(result.rowCount).to.equal(2);
        })

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
            let {err,res} = await chai.request(app)
            .post(`/prestamos/devolverPrestamo/${prestamo_id}`)
            .set('token-acceso', token2);
            expect(err).to.be.undefined;
            expect(res).to.have.status(200);
            expect(res.text).to.equal('"Se actualizo la base de datos eliminando el prestamo"')

            consulta = await EjecutarQuery('SELECT * FROM prestamo_inv WHERE prestamo_id=\''+prestamo_id+'\';');
            expect(consulta.rowCount).to.equal(0);

            consulta = await EjecutarQuery('SELECT * FROM prestamo WHERE prestamo_id=\''+prestamo_id+'\';');
            expect(consulta.rowCount).to.equal(0);

            consulta = await EjecutarQuery('SELECT disponibles FROM inventario WHERE serial=\''+serial1+'\';');
            expect(consulta.rows[0].disponibles).to.equal(5);

            consulta = await EjecutarQuery('SELECT disponibles FROM inventario WHERE serial=\''+serial2+'\';');
            expect(consulta.rows[0].disponibles).to.equal(1);
        })

        after(async () => {
            // Vaciamos todas las tablas

            result = await EjecutarQuery('DELETE FROM prestamo_inv WHERE \
                prestamo_id=\''+prestamo_id+'\';');

            result = await EjecutarQuery('DELETE FROM prestamo WHERE prestamo_id=\''+prestamo_id+'\';');

            result = await EjecutarQuery('DELETE FROM inventario WHERE \
                serial=\''+serial1+'\' OR serial=\''+serial2+'\';')

            result = await EjecutarQuery(`DELETE FROM usuarios WHERE \
                correo=\'${email1}\' OR correo=\'${email2}\';`);
        })
    })
})