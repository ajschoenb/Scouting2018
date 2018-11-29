// server.js

var mysql = require('mysql');
var rest = require("./js/REST.js");
var morgan = require("morgan");
var md5 = require("md5");
var express = require('express');
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var app = express();
var connectionLocal = null;

app.set('view engine', 'ejs');

app.use(express.static("public"));

function REST()
{
    var self = this;
    self.connectMysql();
}

REST.prototype.connectMysql = function()
{
    var self = this;

    var poolLocal = null;

    console.log("Connecting to local DB");
    poolLocal = mysql.createPool({
        connectionLimit: 100,
        host     : '127.0.0.1',
        user     : 'root',
        password : '',
        database : 'frcscout2018',
        debug    : false
    });
    poolLocal.getConnection(function(err, connection) {
      if(err)
        self.stop(err);
      else
        connectionLocal = connection;
      self.configureExpress();
    });
}

REST.prototype.configureExpress = function()
{
    var self = this;
    app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(morgan("dev"));
    // app.use(multer({dest: "public/images"}));
    var router = express.Router();
    app.use('/', router);
    var rest_router = new rest(router, connectionLocal);
    self.startServer();
}

REST.prototype.startServer = function()
{
    var port = Number(process.env.PORT || 8000);
    app.listen(port, function() {
        console.log('FRC Scout servers running on port 8000');
    });
}

REST.prototype.stop = function(err)
{
    console.log("MYSQL ERROR THROWN: \n" + err);
    process.exit(1);
}

new REST();
