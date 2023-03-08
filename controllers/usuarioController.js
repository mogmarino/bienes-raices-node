import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    autenticado: false,
    pagina: "Iniciar Sesion",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

const registrar = async (req, res) => {
  // validacion
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email").isEmail().withMessage("Formato email invalido").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Los passwords no coinciden")
    .run(req);
  let resultado = validationResult(req);

  // return res.json(resultado.array());

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  const usuario = await Usuario.create(req.body);
  res.json(usuario);
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/recuperar-pass", {
    pagina: "Recupera tu acceso a Bienes Raices",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
};
