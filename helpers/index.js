const esVendedor = (usuarioId, propUsuarioId) => {
  return usuarioId === propUsuarioId;
};

const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha).toISOString().split("T")[0];
  console.log(nuevaFecha);
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(nuevaFecha).toLocaleDateString("es-ES", opciones);
};

export { esVendedor, formatearFecha };
