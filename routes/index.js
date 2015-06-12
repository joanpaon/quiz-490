// Carga los modulos necesarios para la aplicación
var express = require('express');
var quizController = require('../controllers/quiz_controller');

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

// Listener MW - Home Page
function renderizarVistaHome(req, res) {
  // Renderiza la vista 'index'
  res.render('index', {
    title: 'Quiz'
  });
}

// Créditos
function renderizarVistaCreditos(req, res) {
  // Renderiza la vista 'author'
  res.render('creditos/author', {
    title: 'Quiz',
    author: "José A. Pacheco Ondoño"
  });
}

// Página de entrada - http://localhost:5000
router.get('/', renderizarVistaHome);

// Autoload de comandos con :quizId
// El método "param()" de express invoca quiz_controller.load() 
// sólo SI EXISTE EL PARAMETRO :quizId en algún lugar de la
// cabecera HTTP (en query, body o param)
router.param('quizId', quizController.load);

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// Créditos - http://localhost:5000/author
router.get('/author', renderizarVistaCreditos);

// Exporta el enrutador
module.exports = router;
