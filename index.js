// Common JS
// const express = require("express");
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

// crear la app, toda la info del server
const app = express();

// habilitar lectura de datos de formulario
app.use(express.urlencoded({ extended: true }));

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

// definir un puerto y arrancar el proyecto
const port = 3000;

app.listen(port, () => {
  console.log(`el servidor se esta ejecutando en el puerto ${port}`);
});
