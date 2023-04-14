import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardar,
  agregarImagen,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);
router.get("/propiedades/crear", protegerRuta, crear);
router.post(
  "/propiedades/crear",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion es obligatoria")
    .isLength({ max: 200 })
    .withMessage("La descripcion es muy larga"),
  body("categoria").isNumeric().withMessage("Seleccione una categoria"),
  body("precio").isNumeric().withMessage("Seleccione un rango para el precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Seleccione la cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Seleccione la cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Seleccione la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),

  guardar
);
router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen);

router.post("/propiedades/agregar-imagen/:id", (req, res) => {
  console.log("VAMOS MENEM LA CONCHA DE LA LORA");
});

export default router;
