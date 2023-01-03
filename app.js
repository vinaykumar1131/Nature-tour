const path=require('path');
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongose = require('mongoose');
const route = require('./routes/tourroute');
const users = require('./routes/userroutes');
const revs=require('./routes/reviewRoutes');
const Apperror = require('./utils/apperror');
const senitize = require('express-mongo-sanitize');
const globalerror = require('./control/error');
const viewRoute=require('./routes/viewRoutes');
// var bodyParser = require('body-parser')
const cookieparser=require('cookie-parser');
const cors=require('cors');
dotenv.config({ path: './config.env' });
const app = express();
mongose.connect("mongodb://localhost:27017/shop").then(con => {
  console.log("yes you connected");
});
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const corsOptions ={
  origin:'http://127.0.0.1:3000', 
  credentials:true    ,    //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  exposedHeaders: ["set-cookie"]
}
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors(corsOptions))
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(cookieparser());
app.use(senitize());
app.use(express.json());
//middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋 from the app.js');
  next();
});
//routes
app.use(
helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use('/', viewRoute);
app.use('/api/v1/tours',route);
app.use('/api/v1/user', users);
app.use('/api/v1/review',revs);

app.all('*', (req, res, next) => {
  next(new Apperror(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalerror);

app.listen(3000, () => {
  console.log("listing...")
})
