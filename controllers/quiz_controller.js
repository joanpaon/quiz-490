// Importa el modelo de la base de datos
var models = require("../models/models.js");

// Listener - Formular pregunta
var formularPregunta = function (req, res) {
  // Selecciona y renderiza el primer quiz disponible
  var _seleccionarQuiz = function (quiz) {
    // Parametros de renderización
    var __paramPregunta = {
      pregunta: quiz[0].pregunta
    };

    // Renderiza la vista de preguntas con la
    // primera pregunta seleccionada
    res.render("quizes/question", __paramPregunta);
  };

  // Recupera los registros de la BD en forma de array.
  // Ese array se entrega como parámetro a su callback
  // que selecciona el primero y lo renderiza
  // models.Quiz.findAll().success(_seleccionarQuiz);
  models.Quiz.findAll().then(_seleccionarQuiz);
};

// Listener - Comprobar respuesta
var comprobarRespuesta = function (req, res) {
  // Evalua la respuesta del usuario con la respuesta del
  // primer quiz de la lista - Posición 0
  var _evaluarRespuesta = function (quiz) {
    // Parametros de renderización
    var __paramRespuestaOK = {
      respuesta: "Correcto"
    };
    var __paramRespuestaNO = {
      respuesta: "Incorrecto"
    };

    // Determina si la respuesta es correcta o no
    if (req.query.respuesta === quiz[0].respuesta) {
      res.render("quizes/answer", __paramRespuestaOK);
    } else {
      res.render("quizes/answer", __paramRespuestaNO);
    }
  };

  // Recupera los registros de la BD en forma de array.
  // Ese array se entrega como parámetro a su callback
  // que selecciona el primero, lo compara con la
  // respuesta del usuario y renderiza el resultado
  //  models.Quiz.findAll().success(_evaluarRespuesta);
  models.Quiz.findAll().then(_evaluarRespuesta);
};

// Exportar funcionalidades
exports.question = formularPregunta;
exports.answer = comprobarRespuesta;
