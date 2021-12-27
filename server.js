const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middlerware/error.js');
const fileupload = require('express-fileupload');
const path = require('path');
//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to DB

connectDB();

//Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

//Body parser
app.use(express.json());

//dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//fileUploading

app.use(fileupload());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on ${PORT}!`.yellow.bold
  )
);

//Handle unhandled promose rejections

process.on('unhandledRejection', (err, promise) => {
  console.log('err :>> ', err.message);
  //CLOSE SERVER AND EXIT PROCESS
  server.close(() => process.exit(1));
});
