import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticar,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.post("/login", autenticar);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/recuperar-pass", formularioOlvidePassword);
router.get("/confirmar/:token", confirmar);
router.post("/recuperar-pass", resetPassword);

// Almacena el nuevo password
router.get("/recuperar-pass/:token", comprobarToken);
// si eliminamos el action en el formulario va hacia la misma ruta
router.post("/recuperar-pass/:token", nuevoPassword);

/*
router
  .route("/user")
  .get((req, res) => {
    res.json({ msj: "la madre del Yonatan" });
  })
  .post((req, res) => {
    res.json({ msj: "A la madre del yonatan le entregan un pedido por post" });
  });
  */

export default router;
