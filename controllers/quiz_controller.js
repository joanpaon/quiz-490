// Importa el modelo de la base de datos
var models = require("../models/models.js");

// Formular pregunta - GET /quizes/answer - DESCONECTADO
var question = function (req, res) {
  // Selecciona y renderiza el primer quiz disponible
  var _renderizarRespuesta = function (quiz) {
    // Parametros de renderización
    var __paramRender = {
      pregunta: quiz[0].pregunta
    };

    // Renderiza la vista de preguntas con la
    // primera pregunta seleccionada
    res.render("quizes/question", __paramRender);
  };

  // Recupera los registros de la BD en forma de array.
  // Ese array se entrega como parámetro a su callback
  // que selecciona el primero y lo renderiza
  // models.Quiz.findAll().success(_seleccionarQuiz);
  models.Quiz.findAll().then(_renderizarRespuesta);
};

// Comprobar respuesta - GET /quizes/:id/answer
var answer = function (req, res) {
  // Compara la respuesta del usuario con la del quiz seleccionado
  var _renderizarRespuesta = function (quizActual) {
    // Parametros de renderización
    var __paramRespuestaOK = {
      quiz: quizActual,
      respuesta: "Correcto"
    };
    var __paramRespuestaNO = {
      quiz: quizActual,
      respuesta: "Incorrecto"
    };

    // Determina si la respuesta es correcta o no
    if (req.query.respuesta === quizActual.respuesta) {
      res.render("quizes/answer", __paramRespuestaOK);
    } else {
      res.render("quizes/answer", __paramRespuestaNO);
    }
  };

  // Recupera el registro de la BD que se corresponde con su
  // clave primaria "quizId"
  // Ese registro se entrega como parámetro a su callback
  // que compara su respuestra con la suministrada por el
  // usuario y renderiza su corrección.
  models.Quiz.findById(req.params.quizId).then(_renderizarRespuesta);
};

// Plantear el quiz seleccionado - GET /quizes/:id
var show = function (req, res) {
  // Muestra la pregunta del quiz actual
  var _renderizarRespuesta = function (quizActual) {
    // Parámetros de renderización
    var __paramRender = {
      quiz: quizActual
    };

    // Renderiza la vista de preguntas con la pregunta
    // del quiz seleccionado
    res.render("quizes/show", __paramRender);
  };

  // Recupera el registro de la BD que se corresponde con su
  // clave primaria "quizId"
  // Ese registro se entrega como parámetro a su callback
  // que selecciona sólo la pregunta la renderiza
  models.Quiz.findById(req.params.quizId).then(_renderizarRespuesta);
};

// Mostrar la lista de quizes - GET /quizes/
var index = function (req, res) {
  // Muestra la lista de quizes disponibles
  var _renderizarRespuesta = function (listaQuizes) {
    // Parámetros de renderización
    var __paramRender = {
      quizes: listaQuizes
    };

    // Renderiza la vista de preguntas con la pregunta
    // del quiz seleccionado
    res.render("quizes/index", __paramRender);
  };

  // Recupera de la BD todos los quizes almacenados y los
  // suministra en forma de array.
  // Esa lista se entrega como parámetro a su callback
  // que los muestra en forma de tabla
  models.Quiz.findAll().then(_renderizarRespuesta);
};

// Exportar funcionalidades
exports.index  = index;
exports.show   = show;
exports.answer = answer;
