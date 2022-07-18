const express = require('express');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser')
// middleware
require('dotenv').config({
    path: path.join(__dirname, '.env')
})

var session = require('express-session');
var morgan = require('morgan');
var cors = require('cors')
var port = process.env.PORT;
const MongoStore = require('connect-mongo');
const router = require('./routes/router')


// middleware
require('./db/conn')



// middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'this is  very secret',
    store: MongoStore.create({
        mongoUrl: process.env.DB,
        autoRemove: 'interval',
        autoRemoveInterval: 10, // In minutes. Default
        touchAfter: 24 * 3600 // time period in seconds

    }),
    cookie: { secure: true }


}));
app.use(cors())
app.use(morgan('tiny'))
app.use(cookieParser())


// Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});


// require router  as middleware
app.use('/', router);


// create server 
app.listen(port, function () {
    console.log('Express started on port 3001');
    console.log(`http://localhost:${port}`)
});
