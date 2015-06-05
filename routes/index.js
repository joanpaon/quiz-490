// Carga los modulos necesarios para la aplicación
var express = require('express');

// Un objeto "router" es una instancia aislada de middleware y rutas.
// Puede considerarse como una “mini-aplicación,” capacitada únicamente
// para funciones de middleware y enrutado.
// Cada aplicación Express tiene un enrutador incorporado.
// ---
// Un enrutador se comporta en sí mismo como middleware, por lo cual
// puede usarse como un argumento de app.use() o como argumento en el
// método use() de otro enrutador
// ---
// El objeto "express" de alto nivel tiene una función Router() que
// crea un nuevo objeto "router".
// ---
// Una aplicación Express es esencialmente una serie de llamadas middleware.
// ---
// Un middleware es una función con acceso a:
//  > Objeto "request" (req)
//  > Objeto "response" (res)
//  > El siguiente middleware de la secuencia en el ciclo "request-response"
//    de una aplicación Express, comunmente denotado por una variable
//    llamada "next"
// ---
// El middleware puede:
//  > Ejecutar cualquier código
//  > Hacer cambios en los objetos request/response.
//  > Terminar el ciclo request-response.
//  > Llamar al siguiente middleware de la pila.
// ---
// Si el MW actual no termina el ciclo request-response, debe de llamar a la
// función next() para pasar el control al siguiente MW, de otro modo la
// petición se quedará colgada sin respuesta.
// ---
// Con una ruta opciónal de montaje, el MW puede ser cargado en el nivel de
// La aplicación o a nivel de enrutado. Asímismo, se puede cargar
// conjuntamenteuna serie de funciones MW creado una subsecuencia de MW de
// sistema en el punto de montaje.
// ---
// Una aplicación Express puede utilizar los siguientes tipos de MW:
//  > De nivel de aplicación
//  > De nivel de enrutado
//  > De gestión de errores
//  > MW incorporado
//  > De terceras partes
// ---
// El MW de nivel de aplicación se enlaza a una instancia de express
// utilizando el método app.use()
// ---
// El MW de nivel de enrutado trabaja igual que su homónimo de nivel de
// aplicación excepto por el hecho de estar ligado a una instancia de
// express.Router().
var router = express.Router();

// Patrón en la ruta de la petición
var patronEnrutado = '/';

// Nombre de la vista
var nombreVista = 'index';

// Parámetros de la vista
var paramVista = {
  title: 'Quiz'
};

// Listener MW
function renderizarVista(req, res) {
  // Renderiza la vista 'index' usando objIds
  res.render(nombreVista, paramVista);
}

// MW de enrutado
router.get(patronEnrutado, renderizarVista);

// Exporta el enrutador
module.exports = router;
