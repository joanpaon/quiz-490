// Importa los módulos necesarios para la aplicación
// ---
// Express es un framework web mínimo y flexible para Node.js
// que proporciona un conjunto robusto de características para
// aplicaciones web y móviles.
var express = require('express');

// This module contains utilities for handling and transforming
// file paths. Almost all these methods perform only string
// transformations.
// The file system is not consulted to check whether paths are valid.
var path = require('path');

// El módulo "serve-favicon" es un MW para Node.js que permite
// servir un favicon.
// ---
// Un favicon es un indicador visual que el software cliente, como
// navegadores, usan para identificar un sitio.
// ---
// Los agentes de usuario hacen peticiones de favicon.ico
// frecuentemente e indiscriminadamente, por lo cual es deseable
// excluir estas peticiones de los registros usando este MW
// previamente al MW de registro (log).
// ---
// Este módulo cachea el icono en memoria para mejorar el rendimiento
// saltándose el acceso a disco
// --
// This module provides an ETag based on the contents of the icon,
// rather than file system properties.
// ---
// Este módulo servirá con el indicador "Content-Type" más compatible.
var favicon = require('serve-favicon');

// HTTP request logger middleware for node.js
var logger = require('morgan');

// Parse Cookie header and populate req.cookies with an object
// keyed by the cookie names.
// Optionally you may enable signed cookie support by passing a secret
// string, which assigns req.secret so it may be used by other middleware.
var cookieParser = require('cookie-parser');

// Node.js body parsing middleware.
var bodyParser = require('body-parser');

// 
var partials = require("express-partials");

//
var methodOverride = require("method-override");

// Gestión de sesiones
var session = require("express-session");

// Importa los enrutadores como si fueran módulos
// En la referencia a estos módulos
//  > La extensión ".js" se puede omitir
//  > Hay que indicar la ruta a partir de la carpeta donde está
//    este archivo (app.js), explicitamente "./"
var routes = require('./routes/index'); // index.js
//var users = require('./routes/users');  // users.js

// Genera la aplicación
var app = express();

// Before Express can render template files,
// the following application settings have to be set.
// ---
// Ruta de localización de las vistas
app.set('views', path.join(__dirname, 'views'));

// Motor para las vistas - Embedded Javascript
app.set('view engine', 'ejs');

// El módulo "express-partials" importa una factoria
// que debe invocarse con () para generar el MW a
// instalar
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

// Monta MWs - Por omisión de 'path' para cualquier ruta
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("Quiz 2015"));  // Semilla para cifrar las cookies
app.use(session());
app.use(methodOverride("_method"));

// Monta MWs - static - Por omisión de 'path' para cualquier ruta
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function (req, res, next) {
  // Guardar el path en "session.redir" para después de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  
  // Hacer visible "req.session" en las vistas
  res.locals.session = req.session;
  next();
});

// Monta MWs enrutadores
app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
// Cualquier otra ruta no cazada por los enrutadores
app.use(function (req, res, next) {
  // Instancia un nuevo error
  var err = new Error('Not Found');

  // Parametriza el error
  err.status = 404;

  // Delega el error
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});

// Exporta la aplicación
module.exports = app;