var autenticar = function (username, password, gestionarAutenticacion) {
  // Definición de usuarios
  var _user1 = {
    id: 1,
    username: "admin",
    password: "admin"
  };
  var _user2 = {
    id: 2,
    username: "pepe",
    password: "pepe"
  };

  // Usuarios registrados de la aplicación
  var _usuariosRegistrados = {
    admin: _user1,
    pepe: _user2
  };

  // Si existe el usuario
  if (_usuariosRegistrados[username]) {
    // Si coincide el password
    if (password === _usuariosRegistrados[username].password) {
      gestionarAutenticacion(null, _usuariosRegistrados[username]);
    } else {
      gestionarAutenticacion(new Error("Password erróneo."));
    }
  } else {
    gestionarAutenticacion(new Error("No existe el usuario."));
  }
};

// Exportar funcionalidades
exports.autenticar = autenticar;