import categorias from "./categorias.js";
import precios from "./precios.js";
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    // autenticar
    await db.authenticate();

    // generar las columnas
    await db.sync();

    // insertamos los datos
    // await Categoria.bulkCreate(categorias);
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
    ]);
    console.log("Datos importados correctamente");

    //exit 0 detiene la ejecucion sin errores
    process.exit(0);
  } catch (error) {
    console.log(error);
    //exit 1 detiene la ejecucion con errores
    process.exit(1);
  }
};

// truncate eliminar y limpiar, empezar desde el registro 0
const eliminarDatos = async () => {
  try {
    await Promise.all([
      Categoria.destroy({ where: {}, truncate: true }),
      Precio.destroy({ where: {}, truncate: true }),
    ]);

    // await db.sync({ force: true });

    console.log("Datos eliminados correctamente");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// condicional para ejecutar la funcion cdo se ejecuta el script en el pkg.json
if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
