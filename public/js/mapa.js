/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// funcion que se invoca a si misma\n(function () {\n  // https://www.google.com.ar/maps/@-32.8866271,-68.8612278,3a,75y,107.9h,90t/\n  const lat = document.querySelector(\"#lat\").value || -32.8866271;\n  const lng = document.querySelector(\"#lng\").value || -68.8612278;\n  const mapa = L.map(\"mapa\").setView([lat, lng], 16);\n  let marker;\n\n  // utilizar provider y geocoder, L -> Leaflet\n  const geocodeService = L.esri.Geocoding.geocodeService();\n\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\n    attribution:\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n  }).addTo(mapa);\n\n  // el pin - draggable para moverse, autopan para centrar el mapa al moverse\n  marker = new L.marker([lat, lng], {\n    draggable: true,\n    autoPan: true,\n  }).addTo(mapa);\n\n  // detectar el movimiento del pin\n  marker.on(\"moveend\", function (e) {\n    marker = e.target;\n\n    const posicion = marker.getLatLng();\n\n    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\n\n    // obtener la informacion de las calles al soltar el pin\n    geocodeService\n      .reverse()\n      .latlng(posicion, 13)\n      .run(function (error, resultado) {\n        // console.log(resultado);\n\n        marker.bindPopup(resultado.address.LongLabel);\n\n        // llenar los campos\n        document.querySelector(\".calle\").textContent =\n          resultado?.address?.Address ?? \"\";\n        document.querySelector(\"#calle\").value =\n          resultado?.address?.Address ?? \"\";\n        document.querySelector(\"#lat\").value = resultado?.latlng?.lat ?? \"\";\n        document.querySelector(\"#lng\").value = resultado?.latlng?.lng ?? \"\";\n      });\n  });\n})();\n\n\n//# sourceURL=webpack://1_bienes-raices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;