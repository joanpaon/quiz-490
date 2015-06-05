// Listener - Formular pregunta
var formularPregunta = function (req, res) {
  res.render("quizes/question", {pregunta: "Capital de Italia"});
};

// Listener - Comprobar respuesta
var comprobarRespuesta = function (req, res) {
  if (req.query.respuesta === "Roma") {
    res.render("quizes/answer", {respuesta: "Correcto"});
  } else {
    res.render("quizes/answer", {respuesta: "Incorrecto"});
  }
};

// Exportar funcionalidades
exports.question = formularPregunta;
exports.answer = comprobarRespuesta;