// MW de autorización de accesos HTTP restringidos
var loginRequired = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};


// GET /login - Formulario de login
var nuevo = function (req, res) {
  // Memoriza los errores de la sesión
  var _erroresSesion = req.session.errors || {};
  
  // Resetea los errores de la sesión
  req.session.errors = {};
  
  // Parametros de renderización
  var _paramRender = {
    errors: _erroresSesion
  };

  // Renderiza la vista de nuevo comentario
  res.render('sessions/new', _paramRender);
};

// POST /login - Crear la sesión
var create = function (req, res) {
  // Importa el módulo de control de usuarios
  var _userController = require("./user_controller");
  
  // Obtiene los datos del login
  var _username = req.body.username;
  var _password = req.body.password;
  
  // Procesa el intento de logeo del usuario
  var _procesarAutenticacion = function (error, usuario) {
    // Si hay error se retornan los mensajes de error de sesión
    if (error) {
      req.session.errors = [{"message": "Se ha producido un error: " + error}];
      res.redirect("/login");
    } else {
      // Crea "req.session.user" y guarda los campos "id" y "username"
      // La sesión se define por la existencia de "req.session.user"
      req.session.user = {
        id: usuario.id,
        username: usuario.username
      };
      
      // Redireccion a path anterior a login
      res.redirect(req.session.redir.toString());
    }
  };
  
  // Login del usuario con sus credenciales
  _userController.autenticar(_username, _password, _procesarAutenticacion);
};

// DELETE /logout - Destruir sesión
var destroy = function (req, res) {
  // Borra el usuario de la sesión
  delete req.session.user;
  
  // Redirecciona al path anterior al login
  res.redirect(req.session.redir.toString());
};

// Exportar funcionalidades
exports.loginRequired = loginRequired;
exports.new           = nuevo;
exports.create        = create;
exports.destroy       = destroy;
