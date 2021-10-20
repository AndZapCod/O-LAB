const express = require("express");
const app = express();
const RouterPres= require('../routers/prestamos');
const RouterAuth = require('../routers/autenticacion')
const RouterKits = require('../routers/kits')
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
module.exports=app;