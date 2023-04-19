import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad, Usuario } from "../models/index.js";

const admin = async (req, res) => {
  const { id } = req.usuario;

  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id,
    },
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });

  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    propiedades,
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

  const { id: usuarioId } = req.usuario;
  console.log(`id de usuario: ${usuarioId}`);
  // return;

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
      usuarioId,
      imagen: "",
    });

    const { id } = propiedadGuardada;

    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;

  // validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  // validar que la propiedad pertenece a quien visita esta pagina
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }
  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;

  // validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  // validar que la propiedad pertenece a quien visita esta pagina
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  try {
    // almacenar la imagen y publicar propiedad
    propiedad.imagen = req.file.filename;
    propiedad.publicado = 1;

    await propiedad.save();

    next();
  } catch (error) {
    console.log(error);
  }
};

export { admin, crear, guardar, agregarImagen, almacenarImagen };
