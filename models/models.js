// Importar módulo para trabajar con PATH
var path = require("path");

// Importar módulo para trabajar ORM de BBDD
var Sequelize = require("sequelize");

// La BD se configura ahora con las variables
//  > DATABASE_URL     - Local y Heroku
//  > DATABASE_STORAGE - Local
// En node.js ambas variables son propiedades de process.env
// ---
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
// ---
// Se extraen sus componentes mediante RegExp que genera un array
// con los parámetros.
// Dependiendo la BD postgress|sqlite el valor de los parámetros se
// estrae de la URL de conexión o bien se inicializa a null
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var database = (url[6] || null);
var username = (url[2] || null);
var password = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// Objeto con parámetros de enlace
var enlaceDB = {
  // Productos soportados
  //  dialect: 'mysql' | 'mariadb' | 'sqlite' | 'postgres' | 'mssql',
  dialect: protocol,

  // Protocolo
  protocol: protocol,

  // IP / hostname del servidor
  host: host,

  // Puerto de escucha
  port: port,

  // Recursos asignados
  //  pool: {
  //    max: 5,
  //    min: 0,
  //    idle: 10000
  //  },

  // Sólo SQLite (.env)
  storage: storage,

  // Sólo Postgres
  omitNull: true
};

// Instancia un ORM particularizado para la base de datos "sqlite"
var sequelize = new Sequelize(database, username, password, enlaceDB);

// Ruta de la definición de tabla "quiz.js"
// El objeto global "__dirname" contiene la ruta de la carpeta del
// script que se está ejecutando, models.js, que es la misma carpeta
// que contiene la definición de la tabla "quiz.js".
var rutaModeloQuiz = path.join(__dirname, "quiz");

// Genera un ORM para la tabla "quiz" definida en "./models/quiz.js"
var Quiz = sequelize.import(rutaModeloQuiz);

// Definición de la tabla comment
var rutaModeloComment = path.join(__dirname, "comment");
var Comment = sequelize.import(rutaModeloComment);

// Relación entre tablas Quiz y Comment - 1:N
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exporta el ORM para que se pueda utilizar en otras partes de la aplicación
// y dar acceso para utilizar los elementos del modelo
exports.Quiz    = Quiz;
exports.Comment = Comment;

// Callback de la cuenta de registros de la Base de Datos
var inicializarDatos = function (numRegistros) {
  // Objeto que encapsula un Quiz
  var _quiz01 = {
    pregunta:  "Capital de Italia",
    respuesta: "Roma",
    tematica:  "Humanidades"
  };
  var _quiz02 = {
    pregunta:  "Capital de Portugal",
    respuesta: "Lisboa",
    tematica:  "Humanidades"
  };

  // Notificación de la inserción de datos
  var _notificarInicializacion = function () {
    console.log("Base de datos inicializada");
  };

  // La tabla se inicializa sólo si está vacia
  if (numRegistros === 0) {
    // Inserta el quiz actual y notifica el estado
    // El método "success" es la forma antigua de manejar
    // los callbacks en sqlite. La forma nueva parace ser
    // el método "then"
    Quiz.bulkCreate([_quiz01, _quiz02]).then(_notificarInicializacion);
  }
};

// Callback de creación de la Base de Datos
var inicializarBD = function () {
  // Cuenta el número de registros
  Quiz.count().then(inicializarDatos);
};

// El método sequelize.sync() sincroniza la BD que se
// guarda en el archivo "quiz.sqlite" con el modelo
// definido en "./models/quiz.js".
// Fisicamente crea el archivo "quiz.sqlite"
// Tras la creación se iniciaciza la BD con una primera
// pregunta
sequelize.sync().then(inicializarBD);