// Nombre de la tabla / Objetos
var nombreTabla = "Quiz";

// Definición del modelo de Quiz
module.exports = function (sequelize, DataTypes) {
  // Definición de campos
  var _estructuraCampos = {
    pregunta: DataTypes.STRING,
    respuesta: DataTypes.STRING
  };

  return sequelize.define(nombreTabla, _estructuraCampos);
};