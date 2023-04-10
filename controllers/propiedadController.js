import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad, Usuario } from "../models/index.js";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    barra: true,
  });
};

const crear = async (req, res) => {
  // consultar modelo de precio y categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  });
};

const guardar = async (req, res) => {
  // validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // consultar modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      barra: true,
      categorias,
      csrfToken: req.csrfToken(),
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  // crea un registro

  const {
    titulo,
    descripcion,
    categoria: categoriaId,
    precio: precioId,
    habitaciones,
    estacionamiento,
    wc,
    calle,
    lat,
    lng,
  } = req.body;

  console.log(
    `titulo ${titulo} - descripcion ${descripcion} - categoriaId ${categoriaId} - precioId ${precioId} - habitaciones ${habitaciones} - estacionamiento ${estacionamiento} - wc ${wc} - calle ${calle} - lat ${lat} - lng ${lng}`
  );
  return;

  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
    });
  } catch (error) {
    console.log(error);
  }
};

export { admin, crear, guardar };
