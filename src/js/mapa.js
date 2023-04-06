// funcion que se invoca a si misma
(function () {
  // https://www.google.com.ar/maps/@-32.8866271,-68.8612278,3a,75y,107.9h,90t/
  const lat = -32.8866271;
  const lng = -68.8612278;
  const mapa = L.map("mapa").setView([lat, lng], 16);
  let marker;

  // utilizar provider y geocoder, L -> Leaflet
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // el pin - draggable para moverse, autopan para centrar el mapa al moverse
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  // detectar el movimiento del pin
  marker.on("moveend", function (e) {
    marker = e.target;

    const posicion = marker.getLatLng();

    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    // obtener la informacion de las calles al soltar el pin
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, resultado) {
        // console.log(resultado);

        marker.bindPopup(resultado.address.LongLabel);

        // llenar los campos
        document.querySelector(".calle").textContent =
          resultado?.address?.Address ?? "";
        document.querySelector("#calle").value =
          resultado?.address?.Address ?? "";
        document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
        document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
      });
  });
})();
