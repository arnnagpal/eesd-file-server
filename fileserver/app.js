var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var getFilesRouter = require('./routes/files');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function logResponseBody(req, res, next) {
  var oldWrite = res.write,
      oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk)
      chunks.push(chunk);

    var body = Buffer.concat(chunks).toString('utf8');
    console.log(req.path, body);

    oldEnd.apply(res, arguments);
  };

  next();
}

// app.use(logResponseBody);

app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/api/files', getFilesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    "data": {
      "message": "Internal Server Error",
      "status": err.status,
      "error": err.message,
      "stacktrace": err.stack
    }
  });
});

module.exports = app;
