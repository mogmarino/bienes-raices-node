import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/token.js";
import { emailRegistro, emailOlvidePass } from "../helpers/emails.js";
import { response } from "express";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    autenticado: false,
    pagina: "Iniciar Sesion",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  await check("email")
    .isEmail()
    .withMessage("El email es obligatorio")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("El password es obligatorio")
    .run(req);

  let resultado = validationResult(req);

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  // comprobar si el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no existe" }],
    });
  }

  // comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Tu cuenta no ha sido confirmada" }],
    });
  }

  // comprobar el password del usuario
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El password es incorrecto" }],
    });
  }

  // autenticar al usuario
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

  // almacenar token en un cookie - secure con certificado SSL
  return res
    .cookie("_token", token, {
      httpOnly: true,
      // secure: true,
      // sameSite: true,
    })
    .redirect("/mis-propiedades");
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
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

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // extraer los datos
  const { nombre, email, password } = req.body;

  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya esta registrado" }],
      usuario: {
        nombre,
        email,
      },
    });
  }

  // Almacenar un usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  // Envia email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  // Mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    pagina: "Cuenta Creada Correctamente",
    mensaje: "Hemos enviado un email de confirmacion, presiona en el enlace",
  });
}; //fin del metodo registrar

// funcion para confirmar una cuenta
const confirmar = async (req, res, next) => {
  const { token } = req.params;
  console.log("confirmando la cuenta...");
  console.log(token);

  // verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token: token } });
  console.log(usuario);

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta nuevamente",
      error: true,
    });
  }

  // confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "Cuenta confirmada correctamente",
  });

  // next();
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/recuperar-pass", {
    pagina: "Recupera tu acceso a Bienes Raices",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  // validacion
  await check("email").isEmail().withMessage("Formato email invalido").run(req);

  let resultado = validationResult(req);

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/recuperar-pass", {
      pagina: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  // Buscar al usuario
  const { email } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/recuperar-pass", {
      pagina: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El Email no pertenece a ningun usuario" }],
    });
  }

  // Generar un token y enviar el email
  usuario.token = generarId();
  await usuario.save();

  // Enviar email
  emailOlvidePass({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  // Renderizar un mensaje
  res.render("templates/mensaje", {
    pagina: "Reestablece tu password",
    mensaje: "Hemos enviado un email con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token: token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Reestablece tu Password",
      mensaje: "Hubo un error al validar tu informacion, intenta de nuevo",
      error: true,
    });
  }

  // mostrar un formulario para modificar el password

  res.render("auth/reset-pass", {
    pagina: "Reestablece Tu Password",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  // validar el password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);

  let resultado = validationResult(req);

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/reset-pass", {
      pagina: "Reestablece Tu Password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  // identificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });

  // hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(usuario.password, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Reestablece tu password",
    mensaje: "Password actualizado correctamente",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticar,
};
