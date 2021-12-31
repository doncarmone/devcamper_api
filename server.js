const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error.js');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to DB

connectDB();

//Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

//Body parser
app.use(express.json());

app.use(cookieParser());

//dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//fileUploading

app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//XSS Security
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 100, //10 min
  max: 100,
});
app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Cors security
app.use(cors());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

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
