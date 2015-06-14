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
      quizes: listaQuizes,
      errors: []
    };

    // Renderiza la vista de preguntas con la pregunta
    // del quiz seleccionado
    res.render("quizes/index", __paramRender);
  };

  // Extrae el parámetro de la URL que contiene el texto
  // que el usuario ha introducido en el campo de busqueda
  var _patronBusqueda = req.query.search || "";

  // Sustituye los espacios por el caracter "%" que también
  // se pone al principio y al final
  // El caracter "%" es un comodín que equivale a cualquier
  // cadena de caracteres.
  // La expresión regular, delimitada por caracteres "/",
  // busca cualquier separador "\s" en toda la cadena "g"
  // de forma insensible a mayusculas o minúsculas "i"
  _patronBusqueda = "%" + _patronBusqueda.replace(/\s/gi, "%") + "%";

  // Objeto que modela una pseudo clausula WHERE de SQL
  var _paramBusqueda = {
    // El comodin "?" de la expresión de la primera posición
    // del array se sustituye por el contenido de la segunda posición
    where: ["pregunta like ?", _patronBusqueda]
  };

  // Recupera de la BD los quizes almacenados en cuya pregunta
  // exista el patrón de texto introducido por el usuario y los
  // suministra en forma de array.
  // Esa lista se entrega como parámetro a su callback
  // que los muestra en forma de tabla
  models.Quiz.findAll(_paramBusqueda).then(_renderizarRespuesta).catch(gestionarError);
};

// Plantear el quiz seleccionado - GET /quizes/:id
var show = function (req, res) {
  // Parámetros de renderización
  var _paramRender = {
    // Quiz actual
    quiz: req.quiz,
    errors: []
  };

  // Renderiza la vista de preguntas con la pregunta
  // del quiz seleccionado
  res.render("quizes/show", _paramRender);
};

// Comprobar respuesta - GET /quizes/:id/answer
var answer = function (req, res) {
  // Determina la corrección de la respuesta
  var _respuestaAct = "Incorrecto";
  if (req.query.respuesta === req.quiz.respuesta) {
    _respuestaAct = "Correcto";
  }

  // Parametros de renderización
  var _paramRender = {
    quiz: req.quiz,
    respuesta: _respuestaAct,
    errors: []
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
    quiz: _quiz,
    errors: []
  };

  //
  res.render('quizes/new', _paramRender);
};

// POST /quizes/create
var create = function (req, res) {
  // Objeto que mapea la BD
  var _quiz = models.Quiz.build(req.body.quiz);

  // Procesar el resultado de la validación
  var _procesarValidacion = function (error) {
    if (error) {
      // Parámetros de renderizado
      var _paramRender = {
        quiz: _quiz,
        errors: error.errors
      };

      // Renderiza los errores 
      res.render("quizes/new", _paramRender);
    } else {
      // Explicita los campos que se van a guardar
      var _patronTabla = {
        fields: ["pregunta", "respuesta"]
      };

      // res.redirect: Redirección HTTP a la lista de preguntas
      var _redirigirListaQuizes = function () {
        res.redirect('/quizes');
      };

      // Guarda en la BD la pregunta y la respuesta del nuevo quiz
      // Después muestra la lista de preguntas actualizada
      _quiz.save(_patronTabla).then(_redirigirListaQuizes);
    }
  };

  // Valida los campos
  _quiz.validate().then(_procesarValidacion);
};

// GET /quizes/:id/edit
var edit = function (req, res) {
  // Autoload de una instancia de quiz
  var _quiz = req.quiz;

  // Parametros de renderización
  var _paramRender = {
    quiz: _quiz,
    errors: []
  };

  // Renderiza la página de petición de edición
  res.render('quizes/edit', _paramRender);
};

// PUT /quizes/:id
var update = function (req, res) {
  // Memoriza los valores recibidos pregunta/respuesta
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  // Procesar el resultado de la validación
  var _procesarValidacion = function (error) {
    if (error) {
      // Parámetros de renderizado
      var _paramRender = {
        quiz: req.quiz,
        errors: error.errors
      };

      // Renderiza los errores 
      res.render("quizes/edit", _paramRender);
    } else {
      // Explicita los campos que se van a guardar
      var _patronTabla = {
        fields: ["pregunta", "respuesta"]
      };

      // res.redirect: Redirección HTTP a la lista de preguntas
      var _redirigirListaQuizes = function () {
        res.redirect('/quizes');
      };

      // Guarda en la BD la pregunta y la respuesta del nuevo quiz
      // Después muestra la lista de preguntas actualizada
      req.quiz.save(_patronTabla).then(_redirigirListaQuizes);
    }
  };

  // Valida los campos
  req.quiz.validate().then(_procesarValidacion);
};

// DELETE /quizes/:id
var destroy = function (req, res) {
  // res.redirect: Redirección HTTP a la lista de preguntas
  var _redirigirListaQuizes = function () {
    res.redirect('/quizes');
  };

  // Borra de la BD el quiz actual
  // Después muestra la lista de preguntas actualizada
  req.quiz.destroy().then(_redirigirListaQuizes).catch(gestionarError);
};

// Exportar funcionalidades
exports.load    = load;
exports.index   = index;
exports.show    = show;
exports.answer  = answer;
exports.new     = nuevo;
exports.create  = create;
exports.edit    = edit;
exports.update  = update;
exports.destroy = destroy;