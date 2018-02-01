// server.js
// only thing that ever needs to be changed is IP address of 'host' in pool variable to location of server computer

var mysql = require('mysql');
var rest = require("./REST.js");
var morgan = require("morgan");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var md5 = require("md5");
var express = require('express');
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var app = express();
var connection = null;

app.set('view engine', 'ejs');

app.use(express.static("public"));

passport.use(new LocalStrategy(
  function(username, password, done) {
    connection.query("SELECT * FROM users WHERE password=" + JSON.stringify(md5(password)) + "", function(err, rows) {
      if(err) { return done(err); }
      if(!rows[0]) { return done(null, false, { message: 'Invalid username or password' }); }
      if(rows[0].password != md5(password)) { return done(null, false, { message: 'Invalid username or password' }); }
      rows[0].username = username;
      return done(null, rows[0]);
    });
  }
));

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //console.log(username);
  /*connection.query("SELECT * FROM users WHERE username=" + JSON.stringify(username) + "", function(err, rows) {
    if(err) return done(err);
    done(err, rows[0]);
  });*/
  done(null, user);
});

function REST()
{
    var self = this;
    self.connectMysql();
}

REST.prototype.connectMysql = function()
{
    var self = this;

    var pool = null;
    if(process.argv[2] && process.argv[2] === "local")
    {
      console.log("Connecting to local DB");
      pool = mysql.createPool({
          connectionLimit: 100,
          host     : '127.0.0.1',
          user     : 'root',
          password : '',
          database : 'frcscout2018',
          debug    : false
      });
    }
    else
    {
      console.log("Connecting to remote DB");
      /* DEPLOY ONLY*/
      pool = mysql.createPool({
        connectionLimit: 100,
        host     : 'sql9.freesqldatabase.com',
        user     : 'sql9207328',
        password : 'WaNG8mTXnN',
        database : 'sql9207328',
        debug    : false
      });
    }
    pool.getConnection(function(err, connection) {
        if(err)
            self.stop(err);
        else
            self.configureExpress(connection);
    });
}

REST.prototype.configureExpress = function(connect)
{
    var self = this;
    connection = connect;
    app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(morgan("dev"));
    // app.use(multer({dest: "public/images"}));
    var router = express.Router();
    app.use('/', router);
    var rest_router = new rest(router, connection, passport);
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
