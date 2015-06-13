// Importa el modelo de la base de datos
var models = require("../models/models.js");

// Gestion de error
var gestionarError = function (error) {
  next(error);
};

// Autoload - Factoriza el código si la ruta incluye :quizId
var load = function (req, res, next, quizId) {
  // Selecciona y renderiza el primer quiz disponible
  var _renderizarRespuesta = function (quizActual) {
    // Comprueba si se ha indicado quiz
    if (quizActual) {
      // Memoriza el quiz
      req.quiz = quizActual;

      // Llama al siguiente MW
      next();
    } else {
      // Llama al siguiente MW de error
      next(new Error("No existe quizId=" + quizId));
    }
  };

  // Recupera el registro de la BD que se corresponde con su
  // clave primaria "quizId"
  models.Quiz.findById(quizId).then(_renderizarRespuesta).catch(gestionarError);
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
  models.Quiz.findAll().then(_renderizarRespuesta).catch(gestionarError);
};

// Plantear el quiz seleccionado - GET /quizes/:id
var show = function (req, res) {
  // Parámetros de renderización
  var _paramRender = {
    // Quiz actual
    quiz: req.quiz
  };

  // Renderiza la vista de preguntas con la pregunta
  // del quiz seleccionado
  res.render("quizes/show", _paramRender);
};

// Comprobar respuesta - GET /quizes/:id/answer
var answer = function (req, res) {
  // Determina la corrección de la respuesta
  var respuestaAct = "Incorrecto";
  if (req.query.respuesta === req.quiz.respuesta) {
    respuestaAct = "Correcto";
  }

  // Parametros de renderización
  var _paramRender = {
    quiz: req.quiz,
    respuesta: respuestaAct
  };

  // Renderiza la evaluación de la respuesta del usuario
  res.render("quizes/answer", _paramRender);
};

// GET /quizes/new
var nuevo = function (req, res) {
  //
  var _patronTabla = {
    pregunta: "Pregunta",
    respuesta: "Respuesta"
  };

  //
  var _quiz = models.Quiz.build(_patronTabla);

  // Parametros de renderización
  var _paramRender = {
    quiz: _quiz
  };

  //
  res.render('quizes/new', _paramRender);
};

// POST /quizes/create
var create = function (req, res) {
  //
  var _quiz = models.Quiz.build(req.body.quiz);

  //
  var _patronTabla = {
    fields: ["pregunta", "respuesta"]
  };

  // res.redirect: Redirección HTTP a lista de preguntas
  var _redirigirListaQuizes = function () {
    res.redirect('/quizes');
  };

  // guarda en DB los campos pregunta y respuesta de quiz
  _quiz.save(_patronTabla).then(_redirigirListaQuizes);
};

// Exportar funcionalidades
exports.load   = load;
exports.index  = index;
exports.show   = show;
exports.answer = answer;
exports.new    = nuevo;
exports.create = create;