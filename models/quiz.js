var modelarTabla = function (sequelize, DataTypes) {
  // Nombre de la tabla / Objetos
  var _nombreTabla = "Quiz";
  
  // ---

  // Mensaje de validación pregunta
  var _msgValPregunta = {
    msg: " --> Falta pregunta"
  };

  // Validador de pregunta
  var _validadorPregunta = {
    notEmpty: _msgValPregunta
  };

  // Definición de pregunta
  var _estructuraPregunta = {
    type: DataTypes.STRING,
    validate: _validadorPregunta
  };

  // ---

  // Mensaje de validación respuesta
  var _msgValRespuesta = {
    msg: " --> Falta respuesta"
  };

  // Validador de respuesta
  var _validadorRespuesta = {
    notEmpty: _msgValRespuesta
  };

  // Definición de respuesta
  var _estructuraRespuesta = {
    type: DataTypes.STRING,
    validate: _validadorRespuesta
  };

  // ---

  // Mensaje de validación temática
  var _msgValTematica = {
    msg: " --> Falta temática"
  };

  // Validador de temática
  var _validadorTematica = {
    notEmpty: _msgValTematica
  };

  // Definición de temática
  var _estructuraTematica = {
    type: DataTypes.STRING,
    validate: _validadorTematica
  };

  // ---

  // Definición de la estructura de campos
  var _estructuraCampos = {
    pregunta:  _estructuraPregunta,
    respuesta: _estructuraRespuesta,
    tematica:  _estructuraTematica
  };

  // ---

  // Devuelve el modelo de la tabla
  return sequelize.define(_nombreTabla, _estructuraCampos);
};

// Exporta el modelo de la tabla
module.exports = modelarTabla;