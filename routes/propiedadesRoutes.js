import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
  enviarMensaje,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import identificarUsuario from "../middleware/identificarUsuario.js";
import upload from "../middleware/subirImagen.js";

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

router.post(
  "/propiedades/agregar-imagen/:id",
  protegerRuta,
  upload.single("imagen"),
  almacenarImagen
);

router.get("/propiedades/editar/:id", protegerRuta, editar);

router.post(
  "/propiedades/editar/:id",
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
  guardarCambios
);

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar);

// area publica
router.get("/propiedades/:id", identificarUsuario, mostrarPropiedad);

// almacenar los mensajes
router.post(
  "/propiedades/:id",
  identificarUsuario,
  body("mensaje")
    .isLength({ min: 10 })
    .withMessage("El mensaje no puede ir vacio o es muy corto"),
  enviarMensaje
);
export default router;
