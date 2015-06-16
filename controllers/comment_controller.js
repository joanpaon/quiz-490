// Importa el modelo de la base de datos
var models = require("../models/models.js");

// Gestion de error
var gestionarError = function (error) {
  next(error);
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

// Exportar funcionalidades
exports.new     = nuevo;
exports.create  = create;