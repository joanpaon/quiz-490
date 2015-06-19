// Carga los modulos necesarios para la aplicación
var express = require('express');

// Carga los controladores
var quizController      = require('../controllers/quiz_controller');
var commentController   = require('../controllers/comment_controller');
var sessionController   = require('../controllers/session_controller');
var statisticController = require('../controllers/statistic_controller');

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
    title: 'Quiz',
    errors: []
  });
}

// Créditos
function renderizarVistaCreditos(req, res) {
  // Renderiza la vista 'author'
  res.render('creditos/author', {
    title: 'Quiz',
    author: "José A. Pacheco Ondoño",
    errors: []
  });
}

// Página de entrada - http://localhost:5000
router.get('/', renderizarVistaHome);

// Autoload de comandos con :quizId
// El método "param()" de express invoca quiz_controller.load() 
// sólo SI EXISTE EL PARAMETRO :quizId en algún lugar de la
// cabecera HTTP (en query, body o param)
router.param('quizId', quizController.load);

// Autoload :commentId
// Autoload se instala con "router.param('commentId', commentController.load))"
// para que el comentario esté preparado cuando se atienda la nueva transacción
// de publicación de comentarios GET /quizes/:quizId/comments/:commentId/publish
router.param('commentId', commentController.load);

// Definición de rutas de sesión - sessionController
router.get('/login',                             sessionController.new);
router.post('/login',                            sessionController.create);
router.get('/logout',                            sessionController.destroy);

// Definición de rutas de /quizes - quizController
router.get('/quizes',                            quizController.index);
router.get('/quizes/:quizId(\\d+)',              quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',       quizController.answer);

// Una ruta puede invocarse con varios MWs en serie. Asi en la definición
// siguiente:  "get('/quizes/new', MW1, MW2)", MW1 y MW2 se ejecutan en
// serie, de forma que si MW1 no pasa el control a MW2 con "next()", MW2
// nunca llegará a ejecutarse.
// ---
// Si se añade "sessionController.loginRequired" delante de los
// controladores de accesas que necesiten autenticación, se impide que
// usuarios sin sesion ejecuten operaciones de crear, editar o borrar 
// recursos.
// ---
// Aunque los botones para realizar dichas operaciobnes se ha quitado, hay
// que evitar también que se pueda realizar de otras formas.
router.get('/quizes/new',                        sessionController.loginRequired, quizController.new);
router.post('/quizes/create',                    sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',         sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',              sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',           sessionController.loginRequired, quizController.destroy);

// Definición de rutas de comentarios - commentController
router.get('/quizes/:quizId(\\d+)/comments/new',                      commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',                         commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

// Definición de rutas de estadisticas - statisticController
router.get('/quizes/statistics',                 statisticController.statistics);

// Créditos - http://localhost:5000/author
router.get('/author', renderizarVistaCreditos);

// Exporta el enrutador
module.exports = router;