// Common JS
// const express = require("express");
import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";

import db from "./config/db.js";

// crear la app, toda la info del server
const app = express();

// habilitar lectura de datos de formulario -  para archivos de tipo texto, input de tipo text
app.use(express.urlencoded({ extended: true }));

// habilitar cookie parser
app.use(cookieParser());

// habilitar CSRF
app.use(csrf({ cookie: true }));

// conexion a la base de datos
try {
  await db.authenticate();
  db.sync(); //crear tablas en caso de inexistencia de las mismas
  console.log("Conexion correcta a la base de datos");
} catch (error) {
  console.log(error);
}

// habilitar Pug - set para configuracion
app.set("view engine", "pug");
app.set("views", "./views");

// carpeta publica
app.use(express.static("public"));

// routing
// use busca todas las rutas que empiecen con el string entre comillas
app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);

// definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`el servidor se esta ejecutando en el puerto ${port}`);
});
