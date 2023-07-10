(function () {
  // https://www.google.com.ar/maps/@-32.8866271,-68.8612278,3a,75y,107.9h,90t/
  const lat = -32.8866271;
  const lng = -68.8612278;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 16);

  let markers = L.featureGroup().addTo(mapa);

  let propiedades = [];

  // Filtros
  const filtros = {
    categoria: "",
    precio: "",
  };

  const categoriaSelect = document.querySelector("#categorias");
  const preciosSelect = document.querySelector("#precios");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // filtrado de categorias y precios
  categoriaSelect.addEventListener("change", (e) => {
    filtros.categoria = +e.target.value;
    filtrarPropiedades();
  });

  preciosSelect.addEventListener("change", (e) => {
    filtros.precio = +e.target.value;
    filtrarPropiedades();
  });

  const obtenerPropiedades = async () => {
    try {
      const url = "/api/propiedades";
      const respuesta = await fetch(url);
      const result = await respuesta.json();
      propiedades = result.propiedades;
      mostrarPropiedades(result.propiedades);
    } catch (error) {
      console.log(error);
    }
  };
  const mostrarPropiedades = (propiedades) => {
    // limpiar los pines anteriores
    markers.clearLayers();
    propiedades.forEach((propiedad) => {
      // Agregar pines
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true,
      }).addTo(mapa).bindPopup(`
          <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
          <h1 class="text-xl font-extrabold uppercase my-5">${propiedad?.titulo}</h1>
          <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}" />
          <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
          <a href="/propiedades/${propiedad.id}" class="block p-2 bg-indigo-600 font-bold text-center uppercase">Ver propiedad</a>
          `);

      markers.addLayer(marker);
    });
  };

  const filtrarPropiedades = () => {
    // method chaining
    const resultado = propiedades
      .filter(filtrarCategoria)
      .filter(filtrarPrecio);
    mostrarPropiedades(resultado);
  };

  const filtrarCategoria = (prop) => {
    return filtros.categoria ? prop.categoriaId === filtros.categoria : prop;
  };

  const filtrarPrecio = (prop) => {
    return filtros.precio ? prop.precioId === filtros.precio : prop;
  };
  obtenerPropiedades();
})();
