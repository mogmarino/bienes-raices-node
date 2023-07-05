import { Precio, Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {
  const [precios, categorias] = await Promise.all([
    Precio.findAll({ raw: true }),
    Categoria.findAll({ raw: true }),
  ]);
  res.render("inicio", {
    pagina: "Inicio",
    categorias,
    precios,
  });
};

const categoria = (req, res) => {};

const noEncontrado = (req, res) => {};

const buscador = (req, res) => {};

export { inicio, categoria, noEncontrado, buscador };
