// Definición del formato de la tabla de comentarios
var modelarTabla = function (sequelize, DataTypes) {
  // Nombre de la tabla / Objetos
  var _nombreTabla = "Comment";
  
  // ---

  // Mensaje de validación comentario
  var _msgValComentario = {
    msg: " --> Falta comentario"
  };

  // Validador de comentario
  var _validadorComentario = {
    notEmpty: _msgValComentario
  };

  // Definición de comentario
  var _estructuraComentario = {
    type: DataTypes.STRING,
    validate: _validadorComentario
  };

  // ---

  // Definición de publicado
  var _estructuraPublicado = {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  };

  // ---

  // Definición de la estructura de campos
  var _estructuraCampos = {
    texto: _estructuraComentario,
    publicado: _estructuraPublicado
  };

  // ---

  // Devuelve el modelo de la tabla
  return sequelize.define(_nombreTabla, _estructuraCampos);
};

// Exporta el modelo de la tabla
module.exports = modelarTabla;