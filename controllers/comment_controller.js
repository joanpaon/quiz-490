// Importa el modelo de la base de datos
var models = require("../models/models.js");

// Gestion de error
var gestionarError = function (error) {
  next(error);
};

// Autoload - id de comentarios
var load = function (req, res, next, commentId) {
  // Parámetros de busqueda
  // El parámetro "where: {id: Number(commentId)}" de "find" establece 
  // la búsqueda del comentario identificado por "commentId".
  var _paramBusqueda = {
    where: {id: Number(commentId)}
  };
  
  // Selecciona y renderiza el primer quiz disponible
  var _renderizarRespuesta = function (commentActual) {
    // Comprueba si se ha indicado quiz
    if (commentActual) {
      // Memoriza el quiz
      req.comment = commentActual;

      // Llama al siguiente MW
      next();
    } else {
      // Llama al siguiente MW de error
      next(new Error("No existe commentId=" + commentActual));
    }
  };

  // Recupera el registro de la BD que se corresponde la espècificación de búsqueda
  models.Comment.find(_paramBusqueda).then(_renderizarRespuesta).catch(gestionarError);
};

// GET /quizes/:quizId/comments/new
var nuevo = function (req, res) {
  // Parametros de renderización
  var _paramRender = {
    quizid: req.params.quizId,
    errors: []
  };

  // Renderiza la vista de nuevo comentario
  res.render('comments/new', _paramRender);
};

// POST /quizes/:quizId/comments
var create = function (req, res) {
  // Estructura de la tabla
  var _estructuraTabla = {
    texto: req.body.comment.texto,
    QuizId: req.params.quizId
  };
  
  // Objeto que mapea la BD
  var _comment = models.Comment.build(_estructuraTabla);

  // Procesar el resultado de la validación
  var _procesarValidacion = function (error) {
    if (error) {
      // Parámetros de renderizado
      var __paramRender = {
        comment: _comment,
        errors: error.errors
      };

      // Renderiza los errores 
      res.render("comments/new", __paramRender);
    } else {
      // res.redirect: Redirección HTTP a la lista de preguntas
      var __redirigirVista = function () {
        res.redirect('/quizes/' + req.params.quizId);
      };

      // Guarda en la BD el campo texto de "comment"
      // Después muestra la lista de preguntas actualizada
      _comment.save().then(__redirigirVista);
    }
  };

  // Valida los campos
  _comment.validate().then(_procesarValidacion).catch(gestionarError);
};

// GET /quizes/:quizId/comments/:commentId/publish
var publish = function (req, res) {
  // Semáforo de comentario publicado
  req.comment.publicado = true;

  // Explicita los campos que se van a guardar
  var _patronTabla = {
    fields: ["publicado"]
  };
  
  // res.redirect: Redirección HTTP a la lista de preguntas
  var _redirigirVista = function () {
    res.redirect('/quizes/' + req.params.quizId);
  };

  // Guarda en la BD la pregunta y la respuesta del nuevo quiz
  // Después muestra la lista de preguntas actualizada
  req.comment.save(_patronTabla).then(_redirigirVista).catch(gestionarError);
};

// Exportar funcionalidades
exports.load    = load;
exports.new     = nuevo;
exports.create  = create;
exports.publish = publish;
