const express = require("express");
const app = express();
const cors = require('cors');
const RouterPres= require('../routers/prestamos');
const RouterAuth = require('../routers/autenticacion')
const RouterKits = require('../routers/kits')
const RouterPoliticas = require('../routers/politicas')
const RouterUsuarios = require('../routers/usuario')
const RouterInventario = require('../routers/inventario')

//Enable front conections
app.use(
	cors({
		origin: "*",
	})
);

//settings
app.set("port", 3000);
app.set("json spaces", 2);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use('/prestamos',RouterPres);
app.use('/auth',RouterAuth);
app.use('/kits', RouterKits);
app.use('/politicas',RouterPoliticas);
app.use('/usuarios',RouterUsuarios);
app.use('/inventario', RouterInventario);
module.exports=app;
