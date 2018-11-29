//where all the page connections happen and back-end javascript
var team = require('./team.js');
var data_entry = require('./data_entry.js');
var misc = require('./misc.js');

var fs = require("fs");
var TBA = require('thebluealliance');
var tba = new TBA('FRCScout2018','Software for scouting for 2018 season','1.1.1');
var message = "";

function REST_ROUTER(router, connectionLocal)
{
    var self = this;
    self.handleRoutes(router, connectionLocal);
}

REST_ROUTER.prototype.handleRoutes = function(router, connectionLocal)
{
  var most_recent = 0;
  var most_recent_match = 0;
  var num_matches = 0;
  var query_bool = 0;
  var query_res = "";

  router.get("/api/team/:team_num", function(req, res) {
    var query = "SELECT * FROM teams WHERE team_num=" + req.params.team_num;
    connectionLocal.query(query, function(err, rows) {
      if(err) console.log(err);
      res.send(rows);
    });
  });

  // index page
  router.get('/', function(req, res) {       //PAGE RENDER
    misc.loadIndex(connectionLocal, req, (dat) => {
      res.render('pages/index', dat);
    });
  });

  router.get("/sql", function(req, res) {
    var message = "";
    if(query_bool == -1)
      message = "<div class=\"alert alert-danger\" role=\"alert\"><p><b>Oh snap</b>, looks like there's a mistake in your query. Data not queried.</p></div>";
    else if(query_bool != -1 && query_bool != 0)
      message = "<div class=\"alert alert-success\" role=\"alert\"><p>Data has been <b>successfully</b> queried.</p></div>";
    else if(query_bool == 1)
    {
      query_res = "";
      query_bool = 0;
    }
    
    res.render("pages/sql", {
      req: req,
      message: message,
      result: query_res
    });
  });

  router.post("/query", function(req, res) {
    misc.sqlQuery(connectionLocal, req, (result, bool) => {
      query_res = result;
      query_bool = bool;
      res.redirect("/sql");
    });
  });

  router.get("/export", function(req, res) {
    misc.exportData(connectionLocal, res, fs);
  });

  router.get("/event", function(req, res) {
    misc.getEvents(tba, req, (dat) => {
      res.render("pages/event", dat);
    });
  });

  router.post("/parse-event", function(req, res) {
    misc.loadEvent(connectionLocal, req, () => {
      res.redirect("/");
    });
  });

  router.get("/alliance-gen", function(req, res) {
    res.render("pages/alliance_gen", { req: req });
  });

  router.post("/alliance-gen", function(req, res) {
    var team_1 = Number(req.body.team_1);
    var team_2 = Number(req.body.team_2);
    var team_3 = Number(req.body.team_3);
    res.redirect("/alliance/" + team_1 + "," + team_2 + "," + team_3);
  });

  router.get('/alliance/:team_1,:team_2,:team_3', function(req, res) {
    var team_num_1 = !Number.isNaN(req.params.team_1) ? Number(req.params.team_1) : 0;
    var team_num_2 = !Number.isNaN(req.params.team_2) ? Number(req.params.team_2) : 0;
    var team_num_3 = !Number.isNaN(req.params.team_3) ? Number(req.params.team_3) : 0;

    team.getTeamData(connectionLocal, req, team_num_1, (dat_1) => {
      team.getTeamData(connectionLocal, req, team_num_2, (dat_2) => {
        team.getTeamData(connectionLocal, req, team_num_3, (dat_3) => {
          setTimeout(() => { res.render('pages/alliance', {
            team_1: dat_1,
            team_2: dat_2,
            team_3: dat_3
          })}, 1000);
        });
      });
    });
	});

  router.get('/team/:team_num', function(req,res) {
    team.getTeamData(connectionLocal, req, req.params.team_num, (dat) => {
      if(dat.skip_render) {
        res.redirect("/");
      }
      else {
        res.render('pages/team', dat);
      }
    });
  });

  router.get('/data-entry', function(req, res) {
    var display_entry = "";
    if(most_recent == -1)
      display_entry = '<div class="alert alert-danger" role="alert"><p><b>Oh snap</b>, looks like this may be a duplicate entry. Data not entered.</p></div>';
    else if(most_recent != -1 && most_recent != 0)
      display_entry = "<div class=\"alert alert-success\" role=\"alert\"><p>Data for <b>"+ most_recent +"</b> has been <b>successfully</b> entered. <b>" + num_matches + " teams</b> have been entered for <b>match #" + most_recent_match + ".</b></p></div>";

    res.render('pages/data_entry', {
      req: req,
      message: display_entry
    });
  });

  router.post('/parse-data', function(req, res) {
    data_entry.parseData(connectionLocal, req, (recent, recent_match, num) => {
      most_recent = recent;
      most_recent_match = recent_match;
      num_matches = num;
      res.redirect('/data-entry');
    });
  });
}

module.exports = REST_ROUTER;
