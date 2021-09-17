const express = require("express");
const app = express();
const RouterPres= require('../routers/prestamos');

//settings
app.set("port", 3000);
app.set("json spaces", 2);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use('/prestamos',RouterPres);

module.exports=app;