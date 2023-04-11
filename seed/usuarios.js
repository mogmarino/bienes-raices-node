import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "Jorge",
    email: "jorge@gmail.com",
    confirmado: 1,
    password: bcrypt.hashSync("jor%#1995", 10),
  },
];

export default usuarios;
