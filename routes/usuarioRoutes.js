import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/recuperar-pass", formularioOlvidePassword);
router.get("/confirmar/:token", confirmar);

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
