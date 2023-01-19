const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const busboy = require('connect-busboy');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const environment = require('./environment/environment');

const app = express();
require('dotenv').config();

const corsOptions = {
  origin: function (origin, callback){
  	// console.log('ORIGIN:', origin);
    if([
    	undefined,
      'http://localhost:4200'
    ].indexOf(origin) !== -1){
      callback(null, true)
    }
    else{
      callback(new Error('Not allowed by CORS'));
    }
  }
};

mongoose.set('strictQuery', false);
mongoose.connect(`${environment.dbUrl}`).then(()=>{
  console.log('Connected to mongoDB');
}).catch(err => console.error('Error to connect to mongoDB: ', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(cors());
app.use(cors(corsOptions));

app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  // fileSize: 1048576
})); // Insert the busboy middle-ware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.render('error');
})

module.exports = app;
