//where all the page connections happen and back-end javascript
var mysql = require("mysql");
var fs = require("fs");
var TBA = require('thebluealliance');
var tba = new TBA('FRCScout2018','Software for scouting for 2018 season','1.1.1');
var ensureLogin = require('connect-ensure-login');
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

  // index page
  router.get('/', function(req, res) {       //PAGE RENDER
    var team_list = "";
    var score_list = "";
    var rating_list = "";
    var notes_query = "";

    var get_teams = "SELECT * FROM teams";
    //TEAM QUERY
    connectionLocal.query(get_teams, function(err,rows,fields) {
      for(var x in rows)
      {
        team_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].team_name +"</td></tr>";
        updateTeams(rows[x].team_num);
      }
    });

    //CONTRIB SCORE QUERY
    var get_contrib_score_rank = "SELECT * FROM teams ORDER BY avg_tele_cubes_scored DESC, avg_tele_intake DESC, team_num ASC";
    connectionLocal.query(get_contrib_score_rank, function(err, rows, fields) {
      for(var x in rows)
      {
        score_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].avg_tele_cubes_scored +"</td><td>"+ rows[x].avg_tele_intake +"</td></tr>";
      }
    });

    var get_rating_rank = "SELECT * FROM teams ORDER BY alliance_rating DESC, team_num ASC";
    connectionLocal.query(get_rating_rank, function(err, rows) {
      // console.log(rows);
      for(var x in rows)
      {
        rating_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].alliance_rating + "</td></tr>";
      }
      res.render('pages/index', {
        req: req,
        team_list: team_list,
        score_list: score_list,
        rating_list: rating_list
      });
    });
  });

  router.get("/sql", function(req, res) {
    var message = "";
    if(query_bool == -1)
      message = "<div class=\"alert alert-danger\" role=\"alert\"><p><b>Oh snap</b>, looks like there's a mistake in your query. Data not queried.</p></div>";
    else if(query_bool != -1 && query_bool != 0)
      message = "<div class=\"alert alert-success\" role=\"alert\"><p>Data has been <b>successfully</b> queried.</p></div>";
    res.render("pages/sql", {
      req: req,
      message: message,
      result: query_res
    });
    if(query_bool == 1)
    {
      query_res = "";
      query_bool = 0;
    }
  });

  router.post("/query", function(req, res) {
    var sql = req.body.query;
    query_res = "";
    connectionLocal.query(sql, function(err, rows, fields) {
      if(err)
      {
        console.log(err);
        query_bool = -1;
      }
      else
      {
        query_bool = 1;
        query_res += "<tr>";
        for(var p in rows[0])
        {
          query_res += "<th>" + p + "</th>";
        }
        for(var i in rows)
        {
          query_res += "</tr><tr>";
          for(var p in rows[i])
          {
            query_res += "<td>" + rows[i][p] + "</td>";
          }
          query_res += "</tr>";
        }
      }
      res.redirect("/sql");
    });
  });

  router.get("/export", function(req, res) {
    var teams_sql = "SELECT * FROM teams";
    var filename = "teams.csv";
    var data = "";
    connectionLocal.query(teams_sql, function(err, rows, fields) {
      for(var p in rows[0])
      {
        data += p + ", ";
      }
      data = data.slice(0, data.length - 2); // Remove the extra comma
      data += "\n";
      for(var i in rows)
      {
        for(var p in rows[i])
        {
          data += rows[i][p] + ", ";
        }
        data = data.slice(0, data.length - 2); // Remove the extra comma
        data += "\n";
      }
      fs.writeFile(filename, data, function(err) {
        console.log(err ? err : "File saved to " + __dirname);
        res.download(__dirname + "/teams.csv");
      });
    });
  });

  router.get("/event", function(req, res) {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var date_str = "2018-" + month + "-" + day;
    var events = "";
    tba.getEventList(function(err, list_of_teams) {
      for(var x in list_of_teams) {
        var event_date = list_of_teams[x].start_date.split("-");
        events += "<option>" + list_of_teams[x].event_code + "-" + list_of_teams[x].name + "</option>\n";
      }

      res.render("pages/event", {
	      req: req,
        events: events
      });
    });
  });

  router.post("/parse-event", function(req, res) {
    var event_code = req.body.event.split("-")[0];
    var teams = [];
    tba.getEventTeams(event_code, 2018, function(err, team_list) {
      var drop_teams_sql = "TRUNCATE `teams`;"
      var drop_matches_sql = "TRUNCATE `matches`;"
      var drop_notes_sql = "TRUNCATE `notes`;"
      var insert_notes_sql = "INSERT INTO `notes` (user, notes) VALUES ('admin', '');";
      connectionLocal.query(drop_teams_sql, function(err) {
        if(err) console.log(err);
        connectionLocal.query(drop_matches_sql, function(err) {
          if(err) console.log(err);
          connectionLocal.query(drop_notes_sql, function(err) {
            if(err) console.log(err);
            connectionLocal.query(insert_notes_sql, function(err) {
              if(err) console.log(err);
              for(var x in team_list) {
                var team_sql = "INSERT INTO teams (team_num, team_name) VALUES (" + team_list[x].team_number + ", \"" + team_list[x].nickname + "\")";
                connectionLocal.query(team_sql, function(err) {
                  if(err)
                  console.log(err);
                });
              }
              res.redirect("/");
            });
          });
        });
      });
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
    var team_name_1 = "";
    var num_matches_1 = 0;
    var most_recent_match_1 = [];
    var tot_auto_cross_1 = 0;
    var tot_auto_left_1 = 0;
    var tot_auto_center_1 = 0;
    var tot_auto_right_1 = 0;
    var tot_auto_pyramid_intake_1 = 0;
    var tot_auto_unprotected_intake_1 = 0;
    var tot_auto_near_switch_made_1 = 0;
    var tot_auto_near_switch_attempts_1 = 0;
    var tot_auto_exchange_made_1 = 0;
    var tot_auto_exchange_attempts_1 = 0;
    var tot_auto_scale_high_made_1 = 0;
    var tot_auto_scale_high_attempts_1 = 0;
    var tot_auto_scale_low_made_1 = 0;
    var tot_auto_scale_low_attempts_1 = 0;
    var avg_tele_cubes_scored_1 = 0;
    var max_tele_cubes_scored_1 = 0;
    var avg_tele_exchange_made_1 = 0;
    var avg_tele_exchange_attempts_1 = 0;
    var avg_tele_near_switch_made_1 = 0;
    var avg_tele_near_switch_attempts_1 = 0;
    var avg_tele_far_switch_made_1 = 0;
    var avg_tele_far_switch_attempts_1 = 0;
    var avg_tele_scale_high_made_1 = 0;
    var avg_tele_scale_high_attempts_1 = 0;
    var avg_tele_scale_low_made_1 = 0;
    var avg_tele_scale_low_attempts_1 = 0;
    var avg_tele_knockouts_1 = 0;
    var avg_tele_cubes_dropped_1 = 0;
    var avg_tele_intake_1 = 0;
    var max_tele_intake_1 = 0;
    var avg_tele_portal_intake_made_1 = 0;
    var avg_tele_portal_intake_attempts_1 = 0;
    var avg_tele_pyramid_intake_1 = 0;
    var avg_tele_unprotected_intake_1 = 0;
    var avg_tele_floor_intake_1 = 0;
    var tot_tele_orderly_1 = 0;
    var max_tele_highest_level_1 = 0;
    var frq_tele_highest_level_1 = 0;
    var tot_tele_platform_1 = 0;
    var tot_tele_climb_1 = 0;
    var tot_tele_climb_attempts_1 = 0;
    var tot_tele_climb_assisted_1 = 0;
    var tot_tele_plus_one_1 = 0;
    var tot_tele_plus_one_attempts_1 = 0;
    var tot_tele_plus_two_1 = 0;
    var tot_tele_plus_two_attempts_1 = 0;
    var avg_pyramid_scale_cycles_1 = 0;
    var avg_pyramid_near_switch_cycles_1 = 0;
    var avg_pyramid_far_switch_cycles_1 = 0;
    var avg_pyramid_exchange_cycles_1 = 0;
    var avg_unprotected_scale_cycles_1 = 0;
    var avg_unprotected_near_switch_cycles_1 = 0;
    var avg_unprotected_far_switch_cycles_1 = 0;
    var avg_unprotected_exchange_cycles_1 = 0;
    var avg_portal_scale_cycles_1 = 0;
    var avg_portal_near_switch_cycles_1 = 0;
    var avg_portal_far_switch_cycles_1 = 0;
    var avg_portal_exchange_cycles_1 = 0;
    var avg_floor_scale_cycles_1 = 0;
    var avg_floor_near_switch_cycles_1 = 0;
    var avg_floor_far_switch_cycles_1 = 0;
    var avg_floor_exchange_cycles_1 = 0;
    var tot_pyramid_scale_cycles_1 = 0;
    var tot_pyramid_near_switch_cycles_1 = 0;
    var tot_pyramid_far_switch_cycles_1 = 0;
    var tot_pyramid_exchange_cycles_1 = 0;
    var tot_unprotected_scale_cycles_1 = 0;
    var tot_unprotected_near_switch_cycles_1 = 0;
    var tot_unprotected_far_switch_cycles_1 = 0;
    var tot_unprotected_exchange_cycles_1 = 0;
    var tot_portal_scale_cycles_1 = 0;
    var tot_portal_near_switch_cycles_1 = 0;
    var tot_portal_far_switch_cycles_1 = 0;
    var tot_portal_exchange_cycles_1 = 0;
    var tot_floor_scale_cycles_1 = 0;
    var tot_floor_near_switch_cycles_1 = 0;
    var tot_floor_far_switch_cycles_1 = 0;
    var tot_floor_exchange_cycles_1 = 0;
    var max_pyramid_scale_cycles_1 = 0;
    var max_pyramid_near_switch_cycles_1 = 0;
    var max_pyramid_far_switch_cycles_1 = 0;
    var max_pyramid_exchange_cycles_1 = 0;
    var max_unprotected_scale_cycles_1 = 0;
    var max_unprotected_near_switch_cycles_1 = 0;
    var max_unprotected_far_switch_cycles_1 = 0;
    var max_unprotected_exchange_cycles_1 = 0;
    var max_portal_scale_cycles_1 = 0;
    var max_portal_near_switch_cycles_1 = 0;
    var max_portal_far_switch_cycles_1 = 0;
    var max_portal_exchange_cycles_1 = 0;
    var max_floor_scale_cycles_1 = 0;
    var max_floor_near_switch_cycles_1 = 0;
    var max_floor_far_switch_cycles_1 = 0;
    var max_floor_exchange_cycles_1 = 0;
    var tot_auto_left_switch_made_1 = 0;
    var tot_auto_left_scale_made_1 = 0;
    var tot_auto_center_switch_made_1 = 0;
    var tot_auto_center_scale_made_1 = 0;
    var tot_auto_right_switch_made_1 = 0;
    var tot_auto_right_scale_made_1 = 0;
    var tot_auto_left_switch_missed_1 = 0;
    var tot_auto_left_scale_missed_1 = 0;
    var tot_auto_center_switch_missed_1 = 0;
    var tot_auto_center_scale_missed_1 = 0;
    var tot_auto_right_switch_missed_1 = 0;
    var tot_auto_right_scale_missed_1 = 0;
    var auto_made_trend_1 = "";
    var auto_missed_trend_1 = "";
    var avg_driver_rating_1 = 0;
    var avg_defense_rating_1 = 0;

    var team_num_2 = !Number.isNaN(req.params.team_2) ? Number(req.params.team_2) : 0;
    var team_name_2 = "";
    var num_matches_2 = 0;
    var most_recent_match_2 = [];
    var tot_auto_cross_2 = 0;
    var tot_auto_left_2 = 0;
    var tot_auto_center_2 = 0;
    var tot_auto_right_2 = 0;
    var tot_auto_pyramid_intake_2 = 0;
    var tot_auto_unprotected_intake_2 = 0;
    var tot_auto_near_switch_made_2 = 0;
    var tot_auto_near_switch_attempts_2 = 0;
    var tot_auto_exchange_made_2 = 0;
    var tot_auto_exchange_attempts_2 = 0;
    var tot_auto_scale_high_made_2 = 0;
    var tot_auto_scale_high_attempts_2 = 0;
    var tot_auto_scale_low_made_2 = 0;
    var tot_auto_scale_low_attempts_2 = 0;
    var avg_tele_cubes_scored_2 = 0;
    var max_tele_cubes_scored_2 = 0;
    var avg_tele_exchange_made_2 = 0;
    var avg_tele_exchange_attempts_2 = 0;
    var avg_tele_near_switch_made_2 = 0;
    var avg_tele_near_switch_attempts_2 = 0;
    var avg_tele_far_switch_made_2 = 0;
    var avg_tele_far_switch_attempts_2 = 0;
    var avg_tele_scale_high_made_2 = 0;
    var avg_tele_scale_high_attempts_2 = 0;
    var avg_tele_scale_low_made_2 = 0;
    var avg_tele_scale_low_attempts_2 = 0;
    var avg_tele_knockouts_2 = 0;
    var avg_tele_cubes_dropped_2 = 0;
    var avg_tele_intake_2 = 0;
    var max_tele_intake_2 = 0;
    var avg_tele_portal_intake_made_2 = 0;
    var avg_tele_portal_intake_attempts_2 = 0;
    var avg_tele_pyramid_intake_2 = 0;
    var avg_tele_unprotected_intake_2 = 0;
    var avg_tele_floor_intake_2 = 0;
    var tot_tele_orderly_2 = 0;
    var max_tele_highest_level_2 = 0;
    var frq_tele_highest_level_2 = 0;
    var tot_tele_platform_2 = 0;
    var tot_tele_climb_2 = 0;
    var tot_tele_climb_attempts_2 = 0;
    var tot_tele_climb_assisted_2 = 0;
    var tot_tele_plus_one_2 = 0;
    var tot_tele_plus_one_attempts_2 = 0;
    var tot_tele_plus_two_2 = 0;
    var tot_tele_plus_two_attempts_2 = 0;
    var avg_pyramid_scale_cycles_2 = 0;
    var avg_pyramid_near_switch_cycles_2 = 0;
    var avg_pyramid_far_switch_cycles_2 = 0;
    var avg_pyramid_exchange_cycles_2 = 0;
    var avg_unprotected_scale_cycles_2 = 0;
    var avg_unprotected_near_switch_cycles_2 = 0;
    var avg_unprotected_far_switch_cycles_2 = 0;
    var avg_unprotected_exchange_cycles_2 = 0;
    var avg_portal_scale_cycles_2 = 0;
    var avg_portal_near_switch_cycles_2 = 0;
    var avg_portal_far_switch_cycles_2 = 0;
    var avg_portal_exchange_cycles_2 = 0;
    var avg_floor_scale_cycles_2 = 0;
    var avg_floor_near_switch_cycles_2 = 0;
    var avg_floor_far_switch_cycles_2 = 0;
    var avg_floor_exchange_cycles_2 = 0;
    var tot_pyramid_scale_cycles_2 = 0;
    var tot_pyramid_near_switch_cycles_2 = 0;
    var tot_pyramid_far_switch_cycles_2 = 0;
    var tot_pyramid_exchange_cycles_2 = 0;
    var tot_unprotected_scale_cycles_2 = 0;
    var tot_unprotected_near_switch_cycles_2 = 0;
    var tot_unprotected_far_switch_cycles_2 = 0;
    var tot_unprotected_exchange_cycles_2 = 0;
    var tot_portal_scale_cycles_2 = 0;
    var tot_portal_near_switch_cycles_2 = 0;
    var tot_portal_far_switch_cycles_2 = 0;
    var tot_portal_exchange_cycles_2 = 0;
    var tot_floor_scale_cycles_2 = 0;
    var tot_floor_near_switch_cycles_2 = 0;
    var tot_floor_far_switch_cycles_2 = 0;
    var tot_floor_exchange_cycles_2 = 0;
    var max_pyramid_scale_cycles_2 = 0;
    var max_pyramid_near_switch_cycles_2 = 0;
    var max_pyramid_far_switch_cycles_2 = 0;
    var max_pyramid_exchange_cycles_2 = 0;
    var max_unprotected_scale_cycles_2 = 0;
    var max_unprotected_near_switch_cycles_2 = 0;
    var max_unprotected_far_switch_cycles_2 = 0;
    var max_unprotected_exchange_cycles_2 = 0;
    var max_portal_scale_cycles_2 = 0;
    var max_portal_near_switch_cycles_2 = 0;
    var max_portal_far_switch_cycles_2 = 0;
    var max_portal_exchange_cycles_2 = 0;
    var max_floor_scale_cycles_2 = 0;
    var max_floor_near_switch_cycles_2 = 0;
    var max_floor_far_switch_cycles_2 = 0;
    var max_floor_exchange_cycles_2 = 0;
    var tot_auto_left_switch_made_2 = 0;
    var tot_auto_left_scale_made_2 = 0;
    var tot_auto_center_switch_made_2 = 0;
    var tot_auto_center_scale_made_2 = 0;
    var tot_auto_right_switch_made_2 = 0;
    var tot_auto_right_scale_made_2 = 0;
    var tot_auto_left_switch_missed_2 = 0;
    var tot_auto_left_scale_missed_2 = 0;
    var tot_auto_center_switch_missed_2 = 0;
    var tot_auto_center_scale_missed_2 = 0;
    var tot_auto_right_switch_missed_2 = 0;
    var tot_auto_right_scale_missed_2 = 0;
    var auto_made_trend_2 = "";
    var auto_missed_trend_2 = "";
    var avg_driver_rating_2 = 0;
    var avg_defense_rating_2 = 0;

    var team_num_3 = !Number.isNaN(req.params.team_3) ? Number(req.params.team_3) : 0;
    var team_name_3 = "";
    var num_matches_3 = 0;
    var most_recent_match_3 = [];
    var tot_auto_cross_3 = 0;
    var tot_auto_left_3 = 0;
    var tot_auto_center_3 = 0;
    var tot_auto_right_3 = 0;
    var tot_auto_pyramid_intake_3 = 0;
    var tot_auto_unprotected_intake_3 = 0;
    var tot_auto_near_switch_made_3 = 0;
    var tot_auto_near_switch_attempts_3 = 0;
    var tot_auto_exchange_made_3 = 0;
    var tot_auto_exchange_attempts_3 = 0;
    var tot_auto_scale_high_made_3 = 0;
    var tot_auto_scale_high_attempts_3 = 0;
    var tot_auto_scale_low_made_3 = 0;
    var tot_auto_scale_low_attempts_3 = 0;
    var avg_tele_cubes_scored_3 = 0;
    var max_tele_cubes_scored_3 = 0;
    var avg_tele_exchange_made_3 = 0;
    var avg_tele_exchange_attempts_3 = 0;
    var avg_tele_near_switch_made_3 = 0;
    var avg_tele_near_switch_attempts_3 = 0;
    var avg_tele_far_switch_made_3 = 0;
    var avg_tele_far_switch_attempts_3 = 0;
    var avg_tele_scale_high_made_3 = 0;
    var avg_tele_scale_high_attempts_3 = 0;
    var avg_tele_scale_low_made_3 = 0;
    var avg_tele_scale_low_attempts_3 = 0;
    var avg_tele_knockouts_3 = 0;
    var avg_tele_cubes_dropped_3 = 0;
    var avg_tele_intake_3 = 0;
    var max_tele_intake_3 = 0;
    var avg_tele_portal_intake_made_3 = 0;
    var avg_tele_portal_intake_attempts_3 = 0;
    var avg_tele_pyramid_intake_3 = 0;
    var avg_tele_unprotected_intake_3 = 0;
    var avg_tele_floor_intake_3 = 0;
    var tot_tele_orderly_3 = 0;
    var max_tele_highest_level_3 = 0;
    var frq_tele_highest_level_3 = 0;
    var tot_tele_platform_3 = 0;
    var tot_tele_climb_3 = 0;
    var tot_tele_climb_attempts_3 = 0;
    var tot_tele_climb_assisted_3 = 0;
    var tot_tele_plus_one_3 = 0;
    var tot_tele_plus_one_attempts_3 = 0;
    var tot_tele_plus_two_3 = 0;
    var tot_tele_plus_two_attempts_3 = 0;
    var avg_pyramid_scale_cycles_3 = 0;
    var avg_pyramid_near_switch_cycles_3 = 0;
    var avg_pyramid_far_switch_cycles_3 = 0;
    var avg_pyramid_exchange_cycles_3 = 0;
    var avg_unprotected_scale_cycles_3 = 0;
    var avg_unprotected_near_switch_cycles_3 = 0;
    var avg_unprotected_far_switch_cycles_3 = 0;
    var avg_unprotected_exchange_cycles_3 = 0;
    var avg_portal_scale_cycles_3 = 0;
    var avg_portal_near_switch_cycles_3 = 0;
    var avg_portal_far_switch_cycles_3 = 0;
    var avg_portal_exchange_cycles_3 = 0;
    var avg_floor_scale_cycles_3 = 0;
    var avg_floor_near_switch_cycles_3 = 0;
    var avg_floor_far_switch_cycles_3 = 0;
    var avg_floor_exchange_cycles_3 = 0;
    var tot_pyramid_scale_cycles_3 = 0;
    var tot_pyramid_near_switch_cycles_3 = 0;
    var tot_pyramid_far_switch_cycles_3 = 0;
    var tot_pyramid_exchange_cycles_3 = 0;
    var tot_unprotected_scale_cycles_3 = 0;
    var tot_unprotected_near_switch_cycles_3 = 0;
    var tot_unprotected_far_switch_cycles_3 = 0;
    var tot_unprotected_exchange_cycles_3 = 0;
    var tot_portal_scale_cycles_3 = 0;
    var tot_portal_near_switch_cycles_3 = 0;
    var tot_portal_far_switch_cycles_3 = 0;
    var tot_portal_exchange_cycles_3 = 0;
    var tot_floor_scale_cycles_3 = 0;
    var tot_floor_near_switch_cycles_3 = 0;
    var tot_floor_far_switch_cycles_3 = 0;
    var tot_floor_exchange_cycles_3 = 0;
    var max_pyramid_scale_cycles_3 = 0;
    var max_pyramid_near_switch_cycles_3 = 0;
    var max_pyramid_far_switch_cycles_3 = 0;
    var max_pyramid_exchange_cycles_3 = 0;
    var max_unprotected_scale_cycles_3 = 0;
    var max_unprotected_near_switch_cycles_3 = 0;
    var max_unprotected_far_switch_cycles_3 = 0;
    var max_unprotected_exchange_cycles_3 = 0;
    var max_portal_scale_cycles_3 = 0;
    var max_portal_near_switch_cycles_3 = 0;
    var max_portal_far_switch_cycles_3 = 0;
    var max_portal_exchange_cycles_3 = 0;
    var max_floor_scale_cycles_3 = 0;
    var max_floor_near_switch_cycles_3 = 0;
    var max_floor_far_switch_cycles_3 = 0;
    var max_floor_exchange_cycles_3 = 0;
    var tot_auto_left_switch_made_3 = 0;
    var tot_auto_left_scale_made_3 = 0;
    var tot_auto_center_switch_made_3 = 0;
    var tot_auto_center_scale_made_3 = 0;
    var tot_auto_right_switch_made_3 = 0;
    var tot_auto_right_scale_made_3 = 0;
    var tot_auto_left_switch_missed_3 = 0;
    var tot_auto_left_scale_missed_3 = 0;
    var tot_auto_center_switch_missed_3 = 0;
    var tot_auto_center_scale_missed_3 = 0;
    var tot_auto_right_switch_missed_3 = 0;
    var tot_auto_right_scale_missed_3 = 0;
    var auto_made_trend_3 = "";
    var auto_missed_trend_3 = "";
    var avg_driver_rating_3 = 0;
    var avg_defense_rating_3 = 0;

    if(team_num_1 != 0 && team_num_2 != 0 && team_num_3 != 0)
    {
      updateTeams(team_num_1);
      updateTeams(team_num_2);
      updateTeams(team_num_3);

      var get_data_1 = "SELECT * FROM teams WHERE team_num='"+ team_num_1 +"'";
      connectionLocal.query(get_data_1, function(err, rows, fields) {
        team_name_1 = rows[0].team_name;
        num_matches_1 = rows[0].num_matches;
        tot_auto_cross_1 = rows[0].tot_auto_cross;
        tot_auto_left_1 = rows[0].tot_auto_left;
        tot_auto_center_1 = rows[0].tot_auto_center;
        tot_auto_right_1 = rows[0].tot_auto_right;
        tot_auto_pyramid_intake_1 = rows[0].tot_auto_pyramid_intake;
        tot_auto_unprotected_intake_1 = rows[0].tot_auto_unprotected_intake;
        tot_auto_near_switch_made_1 = rows[0].tot_auto_near_switch_made;
        tot_auto_near_switch_attempts_1 = rows[0].tot_auto_near_switch_attempts;
        tot_auto_exchange_made_1 = rows[0].tot_auto_exchange_made;
        tot_auto_exchange_attempts_1 = rows[0].tot_auto_exchange_attempts;
        tot_auto_scale_high_made_1 = rows[0].tot_auto_scale_high_made;
        tot_auto_scale_high_attempts_1 = rows[0].tot_auto_scale_high_attempts;
        tot_auto_scale_low_made_1 = rows[0].tot_auto_scale_low_made;
        tot_auto_scale_low_attempts_1 = rows[0].tot_auto_scale_low_attempts;
        avg_tele_cubes_scored_1 = rows[0].avg_tele_cubes_scored;
        max_tele_cubes_scored_1 = rows[0].max_tele_cubes_scored;
        avg_tele_exchange_made_1 = rows[0].avg_tele_exchange_made;
        avg_tele_exchange_attempts_1 = rows[0].avg_tele_exchange_attempts;
        avg_tele_near_switch_made_1 = rows[0].avg_tele_near_switch_made;
        avg_tele_near_switch_attempts_1 = rows[0].avg_tele_near_switch_attempts;
        avg_tele_far_switch_made_1 = rows[0].avg_tele_far_switch_made;
        avg_tele_far_switch_attempts_1 = rows[0].avg_tele_far_switch_attempts;
        avg_tele_scale_high_made_1 = rows[0].avg_tele_scale_high_made;
        avg_tele_scale_high_attempts_1 = rows[0].avg_tele_scale_high_attempts;
        avg_tele_scale_low_made_1 = rows[0].avg_tele_scale_low_made;
        avg_tele_scale_low_attempts_1 = rows[0].avg_tele_scale_low_attempts;
        avg_tele_knockouts_1 = rows[0].avg_tele_knockouts;
        avg_tele_cubes_dropped_1 = rows[0].avg_tele_cubes_dropped;
        avg_tele_intake_1 = rows[0].avg_tele_intake;
        max_tele_intake_1 = rows[0].max_tele_intake;
        avg_tele_portal_intake_made_1 = rows[0].avg_tele_portal_intake_made;
        avg_tele_portal_intake_attempts_1 = rows[0].avg_tele_portal_intake_attempts;
        avg_tele_pyramid_intake_1 = rows[0].avg_tele_pyramid_intake;
        avg_tele_unprotected_intake_1 = rows[0].avg_tele_unprotected_intake;
        avg_tele_floor_intake_1 = rows[0].avg_tele_floor_intake;
        tot_tele_orderly_1 = rows[0].tot_tele_orderly;
        max_tele_highest_level_1 = rows[0].max_tele_highest_level;
        frq_tele_highest_level_1 = rows[0].frq_tele_highest_level;
        tot_tele_platform_1 = rows[0].tot_tele_platform;
        tot_tele_climb_1 = rows[0].tot_tele_climb;
        tot_tele_climb_attempts_1 = rows[0].tot_tele_climb_attempts;
        tot_tele_climb_assisted_1 = rows[0].tot_tele_climb_assisted;
        tot_tele_plus_one_1 = rows[0].tot_tele_plus_one;
        tot_tele_plus_one_attempts_1 = rows[0].tot_tele_plus_one_attempts;
        tot_tele_plus_two_1 = rows[0].tot_tele_plus_two;
        tot_tele_plus_two_attempts_1 = rows[0].tot_tele_plus_two_attempts;
        avg_pyramid_scale_cycles_1 = rows[0].avg_tele_pyramid_scale_cycle;
        avg_pyramid_near_switch_cycles_1 = rows[0].avg_tele_pyramid_near_switch_cycle;
        avg_pyramid_far_switch_cycles_1 = rows[0].avg_tele_pyramid_far_switch_cycle;
        avg_pyramid_exchange_cycles_1 = rows[0].avg_tele_pyramid_exchange_cycle;
        avg_unprotected_scale_cycles_1 = rows[0].avg_tele_unprotected_scale_cycle;
        avg_unprotected_near_switch_cycles_1 = rows[0].avg_tele_unprotected_near_switch_cycle;
        avg_unprotected_far_switch_cycles_1 = rows[0].avg_tele_unprotected_far_switch_cycle;
        avg_unprotected_exchange_cycles_1 = rows[0].avg_tele_unprotected_exchange_cycle;
        avg_portal_scale_cycles_1 = rows[0].avg_tele_portal_scale_cycle;
        avg_portal_near_switch_cycles_1 = rows[0].avg_tele_portal_near_switch_cycle;
        avg_portal_far_switch_cycles_1 = rows[0].avg_tele_portal_far_switch_cycle;
        avg_portal_exchange_cycles_1 = rows[0].avg_tele_portal_exchange_cycle;
        avg_floor_scale_cycles_1 = rows[0].avg_tele_floor_scale_cycle;
        avg_floor_near_switch_cycles_1 = rows[0].avg_tele_floor_near_switch_cycle;
        avg_floor_far_switch_cycles_1 = rows[0].avg_tele_floor_far_switch_cycle;
        avg_floor_exchange_cycles_1 = rows[0].avg_tele_floor_exchange_cycle;
        tot_pyramid_scale_cycles_1 = rows[0].tot_tele_pyramid_scale_cycle / num_matches_1;
        tot_pyramid_near_switch_cycles_1 = rows[0].tot_tele_pyramid_near_switch_cycle / num_matches_1;
        tot_pyramid_far_switch_cycles_1 = rows[0].tot_tele_pyramid_far_switch_cycle / num_matches_1;
        tot_pyramid_exchange_cycles_1 = rows[0].tot_tele_pyramid_exchange_cycle / num_matches_1;
        tot_unprotected_scale_cycles_1 = rows[0].tot_tele_unprotected_scale_cycle / num_matches_1;
        tot_unprotected_near_switch_cycles_1 = rows[0].tot_tele_unprotected_near_switch_cycle / num_matches_1;
        tot_unprotected_far_switch_cycles_1 = rows[0].tot_tele_unprotected_far_switch_cycle / num_matches_1;
        tot_unprotected_exchange_cycles_1 = rows[0].tot_tele_unprotected_exchange_cycle / num_matches_1;
        tot_portal_scale_cycles_1 = rows[0].tot_tele_portal_scale_cycle / num_matches_1;
        tot_portal_near_switch_cycles_1 = rows[0].tot_tele_portal_near_switch_cycle / num_matches_1;
        tot_portal_far_switch_cycles_1 = rows[0].tot_tele_portal_far_switch_cycle / num_matches_1;
        tot_portal_exchange_cycles_1 = rows[0].tot_tele_portal_exchange_cycle / num_matches_1;
        tot_floor_scale_cycles_1 = rows[0].tot_tele_floor_scale_cycle / num_matches_1;
        tot_floor_near_switch_cycles_1 = rows[0].tot_tele_floor_near_switch_cycle / num_matches_1;
        tot_floor_far_switch_cycles_1 = rows[0].tot_tele_floor_far_switch_cycle / num_matches_1;
        tot_floor_exchange_cycles_1 = rows[0].tot_tele_floor_exchange_cycle / num_matches_1;
        max_pyramid_scale_cycles_1 = rows[0].max_tele_pyramid_scale_cycle;
        max_pyramid_near_switch_cycles_1 = rows[0].max_tele_pyramid_near_switch_cycle;
        max_pyramid_far_switch_cycles_1 = rows[0].max_tele_pyramid_far_switch_cycle;
        max_pyramid_exchange_cycles_1 = rows[0].max_tele_pyramid_exchange_cycle;
        max_unprotected_scale_cycles_1 = rows[0].max_tele_unprotected_scale_cycle;
        max_unprotected_near_switch_cycles_1 = rows[0].max_tele_unprotected_near_switch_cycle;
        max_unprotected_far_switch_cycles_1 = rows[0].max_tele_unprotected_far_switch_cycle;
        max_unprotected_exchange_cycles_1 = rows[0].max_tele_unprotected_exchange_cycle;
        max_portal_scale_cycles_1 = rows[0].max_tele_portal_scale_cycle;
        max_portal_near_switch_cycles_1 = rows[0].max_tele_portal_near_switch_cycle;
        max_portal_far_switch_cycles_1 = rows[0].max_tele_portal_far_switch_cycle;
        max_portal_exchange_cycles_1 = rows[0].max_tele_portal_exchange_cycle;
        max_floor_scale_cycles_1 = rows[0].max_tele_floor_scale_cycle;
        max_floor_near_switch_cycles_1 = rows[0].max_tele_floor_near_switch_cycle;
        max_floor_far_switch_cycles_1 = rows[0].max_tele_floor_far_switch_cycle;
        max_floor_exchange_cycles_1 = rows[0].max_tele_floor_exchange_cycle;
        avg_driver_rating_1 = rows[0].avg_driver_rating;
        avg_defense_rating_1 = rows[0].avg_defense_rating;
      });

      var auto_sql_1 = "SELECT * FROM matches WHERE team_num='"+ team_num_1 +"'";
      connectionLocal.query(auto_sql_1, function(err, rows, fields) {
        for(var x in rows)
        {
          if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_made > 0) tot_auto_left_switch_made_1 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_left_scale_made_1 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_made > 0) tot_auto_center_switch_made_1 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_center_scale_made_1 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_made > 0) tot_auto_right_switch_made_1 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_right_scale_made_1 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_missed > 0) tot_auto_left_switch_missed_1 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_missec + rows[x].auto_scale_low_missed > 0) tot_auto_left_scale_missed_1 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_missed > 0) tot_auto_center_switch_missed_1 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_center_scale_missed_1 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_missed > 0) tot_auto_right_switch_missed_1 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_right_scale_missed_1 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          auto_made_trend_1 = tot_auto_left_switch_made_1 + ", " + tot_auto_left_scale_made_1 + ", " + tot_auto_center_switch_made_1 + ", " + tot_auto_center_scale_made_1 + ", " + tot_auto_right_switch_made_1 + ", " + tot_auto_right_scale_made_1;
          auto_missed_trend_1 = tot_auto_left_switch_missed_1 + ", " + tot_auto_left_scale_missed_1 + ", " + tot_auto_center_switch_missed_1 + ", " + tot_auto_center_scale_missed_1 + ", " + tot_auto_right_switch_missed_1 + ", " + tot_auto_right_scale_missed_1;
        }
      });
      
      var get_data_2 = "SELECT * FROM teams WHERE team_num='"+ team_num_2 +"'";
      connectionLocal.query(get_data_2, function(err, rows, fields) {
        // console.log(rows[0] != undefined);
        if(rows[0] != undefined)
        {
          team_name_2 = rows[0].team_name;
          num_matches_2 = rows[0].num_matches;
          tot_auto_cross_2 = rows[0].tot_auto_cross;
          tot_auto_left_2 = rows[0].tot_auto_left;
          tot_auto_center_2 = rows[0].tot_auto_center;
          tot_auto_right_2 = rows[0].tot_auto_right;
          tot_auto_pyramid_intake_2 = rows[0].tot_auto_pyramid_intake;
          tot_auto_unprotected_intake_2 = rows[0].tot_auto_unprotected_intake;
          tot_auto_near_switch_made_2 = rows[0].tot_auto_near_switch_made;
          tot_auto_near_switch_attempts_2 = rows[0].tot_auto_near_switch_attempts;
          tot_auto_exchange_made_2 = rows[0].tot_auto_exchange_made;
          tot_auto_exchange_attempts_2 = rows[0].tot_auto_exchange_attempts;
          tot_auto_scale_high_made_2 = rows[0].tot_auto_scale_high_made;
          tot_auto_scale_high_attempts_2 = rows[0].tot_auto_scale_high_attempts;
          tot_auto_scale_low_made_2 = rows[0].tot_auto_scale_low_made;
          tot_auto_scale_low_attempts_2 = rows[0].tot_auto_scale_low_attempts;
          avg_tele_cubes_scored_2 = rows[0].avg_tele_cubes_scored;
          max_tele_cubes_scored_2 = rows[0].max_tele_cubes_scored;
          avg_tele_exchange_made_2 = rows[0].avg_tele_exchange_made;
          avg_tele_exchange_attempts_2 = rows[0].avg_tele_exchange_attempts;
          avg_tele_near_switch_made_2 = rows[0].avg_tele_near_switch_made;
          avg_tele_near_switch_attempts_2 = rows[0].avg_tele_near_switch_attempts;
          avg_tele_far_switch_made_2 = rows[0].avg_tele_far_switch_made;
          avg_tele_far_switch_attempts_2 = rows[0].avg_tele_far_switch_attempts;
          avg_tele_scale_high_made_2 = rows[0].avg_tele_scale_high_made;
          avg_tele_scale_high_attempts_2 = rows[0].avg_tele_scale_high_attempts;
          avg_tele_scale_low_made_2 = rows[0].avg_tele_scale_low_made;
          avg_tele_scale_low_attempts_2 = rows[0].avg_tele_scale_low_attempts;
          avg_tele_knockouts_2 = rows[0].avg_tele_knockouts;
          avg_tele_cubes_dropped_2 = rows[0].avg_tele_cubes_dropped;
          avg_tele_intake_2 = rows[0].avg_tele_intake;
          max_tele_intake_2 = rows[0].max_tele_intake;
          avg_tele_portal_intake_made_2 = rows[0].avg_tele_portal_intake_made;
          avg_tele_portal_intake_attempts_2 = rows[0].avg_tele_portal_intake_attempts;
          avg_tele_pyramid_intake_2 = rows[0].avg_tele_pyramid_intake;
          avg_tele_unprotected_intake_2 = rows[0].avg_tele_unprotected_intake;
          avg_tele_floor_intake_2 = rows[0].avg_tele_floor_intake;
          tot_tele_orderly_2 = rows[0].tot_tele_orderly;
          max_tele_highest_level_2 = rows[0].max_tele_highest_level;
          frq_tele_highest_level_2 = rows[0].frq_tele_highest_level;
          tot_tele_platform_2 = rows[0].tot_tele_platform;
          tot_tele_climb_2 = rows[0].tot_tele_climb;
          tot_tele_climb_attempts_2 = rows[0].tot_tele_climb_attempts;
          tot_tele_climb_assisted_2 = rows[0].tot_tele_climb_assisted;
          tot_tele_plus_one_2 = rows[0].tot_tele_plus_one;
          tot_tele_plus_one_attempts_2 = rows[0].tot_tele_plus_one_attempts;
          tot_tele_plus_two_2 = rows[0].tot_tele_plus_two;
          tot_tele_plus_two_attempts_2 = rows[0].tot_tele_plus_two_attempts;
          avg_pyramid_scale_cycles_2 = rows[0].avg_tele_pyramid_scale_cycle;
          avg_pyramid_near_switch_cycles_2 = rows[0].avg_tele_pyramid_near_switch_cycle;
          avg_pyramid_far_switch_cycles_2 = rows[0].avg_tele_pyramid_far_switch_cycle;
          avg_pyramid_exchange_cycles_2 = rows[0].avg_tele_pyramid_exchange_cycle;
          avg_unprotected_scale_cycles_2 = rows[0].avg_tele_unprotected_scale_cycle;
          avg_unprotected_near_switch_cycles_2 = rows[0].avg_tele_unprotected_near_switch_cycle;
          avg_unprotected_far_switch_cycles_2 = rows[0].avg_tele_unprotected_far_switch_cycle;
          avg_unprotected_exchange_cycles_2 = rows[0].avg_tele_unprotected_exchange_cycle;
          avg_portal_scale_cycles_2 = rows[0].avg_tele_portal_scale_cycle;
          avg_portal_near_switch_cycles_2 = rows[0].avg_tele_portal_near_switch_cycle;
          avg_portal_far_switch_cycles_2 = rows[0].avg_tele_portal_far_switch_cycle;
          avg_portal_exchange_cycles_2 = rows[0].avg_tele_portal_exchange_cycle;
          avg_floor_scale_cycles_2 = rows[0].avg_tele_floor_scale_cycle;
          avg_floor_near_switch_cycles_2 = rows[0].avg_tele_floor_near_switch_cycle;
          avg_floor_far_switch_cycles_2 = rows[0].avg_tele_floor_far_switch_cycle;
          avg_floor_exchange_cycles_2 = rows[0].avg_tele_floor_exchange_cycle;
          tot_pyramid_scale_cycles_2 = rows[0].tot_tele_pyramid_scale_cycle / num_matches_2;
          tot_pyramid_near_switch_cycles_2 = rows[0].tot_tele_pyramid_near_switch_cycle / num_matches_2;
          tot_pyramid_far_switch_cycles_2 = rows[0].tot_tele_pyramid_far_switch_cycle / num_matches_2;
          tot_pyramid_exchange_cycles_2 = rows[0].tot_tele_pyramid_exchange_cycle / num_matches_2;
          tot_unprotected_scale_cycles_2 = rows[0].tot_tele_unprotected_scale_cycle / num_matches_2;
          tot_unprotected_near_switch_cycles_2 = rows[0].tot_tele_unprotected_near_switch_cycle / num_matches_2;
          tot_unprotected_far_switch_cycles_2 = rows[0].tot_tele_unprotected_far_switch_cycle / num_matches_2;
          tot_unprotected_exchange_cycles_2 = rows[0].tot_tele_unprotected_exchange_cycle / num_matches_2;
          tot_portal_scale_cycles_2 = rows[0].tot_tele_portal_scale_cycle / num_matches_2;
          tot_portal_near_switch_cycles_2 = rows[0].tot_tele_portal_near_switch_cycle / num_matches_2;
          tot_portal_far_switch_cycles_2 = rows[0].tot_tele_portal_far_switch_cycle / num_matches_2;
          tot_portal_exchange_cycles_2 = rows[0].tot_tele_portal_exchange_cycle / num_matches_2;
          tot_floor_scale_cycles_2 = rows[0].tot_tele_floor_scale_cycle / num_matches_2;
          tot_floor_near_switch_cycles_2 = rows[0].tot_tele_floor_near_switch_cycle / num_matches_2;
          tot_floor_far_switch_cycles_2 = rows[0].tot_tele_floor_far_switch_cycle / num_matches_2;
          tot_floor_exchange_cycles_2 = rows[0].tot_tele_floor_exchange_cycle / num_matches_2;
          max_pyramid_scale_cycles_2 = rows[0].max_tele_pyramid_scale_cycle;
          max_pyramid_near_switch_cycles_2 = rows[0].max_tele_pyramid_near_switch_cycle;
          max_pyramid_far_switch_cycles_2 = rows[0].max_tele_pyramid_far_switch_cycle;
          max_pyramid_exchange_cycles_2 = rows[0].max_tele_pyramid_exchange_cycle;
          max_unprotected_scale_cycles_2 = rows[0].max_tele_unprotected_scale_cycle;
          max_unprotected_near_switch_cycles_2 = rows[0].max_tele_unprotected_near_switch_cycle;
          max_unprotected_far_switch_cycles_2 = rows[0].max_tele_unprotected_far_switch_cycle;
          max_unprotected_exchange_cycles_2 = rows[0].max_tele_unprotected_exchange_cycle;
          max_portal_scale_cycles_2 = rows[0].max_tele_portal_scale_cycle;
          max_portal_near_switch_cycles_2 = rows[0].max_tele_portal_near_switch_cycle;
          max_portal_far_switch_cycles_2 = rows[0].max_tele_portal_far_switch_cycle;
          max_portal_exchange_cycles_2 = rows[0].max_tele_portal_exchange_cycle;
          max_floor_scale_cycles_2 = rows[0].max_tele_floor_scale_cycle;
          max_floor_near_switch_cycles_2 = rows[0].max_tele_floor_near_switch_cycle;
          max_floor_far_switch_cycles_2 = rows[0].max_tele_floor_far_switch_cycle;
          max_floor_exchange_cycles_2 = rows[0].max_tele_floor_exchange_cycle;
          avg_driver_rating_2 = rows[0].avg_driver_rating;
          avg_defense_rating_2 = rows[0].avg_defense_rating;
        }
      });

      var auto_sql_2 = "SELECT * FROM matches WHERE team_num='"+ team_num_2 +"'";
      connectionLocal.query(auto_sql_2, function(err, rows, fields) {
        for(var x in rows)
        {
          if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_made > 0) tot_auto_left_switch_made_2 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_left_scale_made_2 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_made > 0) tot_auto_center_switch_made_2 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_center_scale_made_2 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_made > 0) tot_auto_right_switch_made_2 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_right_scale_made_2 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_missed > 0) tot_auto_left_switch_missed_2 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_missec + rows[x].auto_scale_low_missed > 0) tot_auto_left_scale_missed_2 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_missed > 0) tot_auto_center_switch_missed_2 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_center_scale_missed_2 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_missed > 0) tot_auto_right_switch_missed_2 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_right_scale_missed_2 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          auto_made_trend_2 = tot_auto_left_switch_made_2 + ", " + tot_auto_left_scale_made_2 + ", " + tot_auto_center_switch_made_2 + ", " + tot_auto_center_scale_made_2 + ", " + tot_auto_right_switch_made_2 + ", " + tot_auto_right_scale_made_2;
          auto_missed_trend_2 = tot_auto_left_switch_missed_2 + ", " + tot_auto_left_scale_missed_2 + ", " + tot_auto_center_switch_missed_2 + ", " + tot_auto_center_scale_missed_2 + ", " + tot_auto_right_switch_missed_2 + ", " + tot_auto_right_scale_missed_2;
        }
      });

      var get_data_3 = "SELECT * FROM teams WHERE team_num='"+ team_num_3 +"'";
      connectionLocal.query(get_data_3, function(err, rows, fields) {
        team_name_3 = rows[0].team_name;
        num_matches_3 = rows[0].num_matches;
        tot_auto_cross_3 = rows[0].tot_auto_cross;
        tot_auto_left_3 = rows[0].tot_auto_left;
        tot_auto_center_3 = rows[0].tot_auto_center;
        tot_auto_right_3 = rows[0].tot_auto_right;
        tot_auto_pyramid_intake_3 = rows[0].tot_auto_pyramid_intake;
        tot_auto_unprotected_intake_3 = rows[0].tot_auto_unprotected_intake;
        tot_auto_near_switch_made_3 = rows[0].tot_auto_near_switch_made;
        tot_auto_near_switch_attempts_3 = rows[0].tot_auto_near_switch_attempts;
        tot_auto_exchange_made_3 = rows[0].tot_auto_exchange_made;
        tot_auto_exchange_attempts_3 = rows[0].tot_auto_exchange_attempts;
        tot_auto_scale_high_made_3 = rows[0].tot_auto_scale_high_made;
        tot_auto_scale_high_attempts_3 = rows[0].tot_auto_scale_high_attempts;
        tot_auto_scale_low_made_3 = rows[0].tot_auto_scale_low_made;
        tot_auto_scale_low_attempts_3 = rows[0].tot_auto_scale_low_attempts;
        avg_tele_cubes_scored_3 = rows[0].avg_tele_cubes_scored;
        max_tele_cubes_scored_3 = rows[0].max_tele_cubes_scored;
        avg_tele_exchange_made_3 = rows[0].avg_tele_exchange_made;
        avg_tele_exchange_attempts_3 = rows[0].avg_tele_exchange_attempts;
        avg_tele_near_switch_made_3 = rows[0].avg_tele_near_switch_made;
        avg_tele_near_switch_attempts_3 = rows[0].avg_tele_near_switch_attempts;
        avg_tele_far_switch_made_3 = rows[0].avg_tele_far_switch_made;
        avg_tele_far_switch_attempts_3 = rows[0].avg_tele_far_switch_attempts;
        avg_tele_scale_high_made_3 = rows[0].avg_tele_scale_high_made;
        avg_tele_scale_high_attempts_3 = rows[0].avg_tele_scale_high_attempts;
        avg_tele_scale_low_made_3 = rows[0].avg_tele_scale_low_made;
        avg_tele_scale_low_attempts_3 = rows[0].avg_tele_scale_low_attempts;
        avg_tele_knockouts_3 = rows[0].avg_tele_knockouts;
        avg_tele_cubes_dropped_3 = rows[0].avg_tele_cubes_dropped;
        avg_tele_intake_3 = rows[0].avg_tele_intake;
        max_tele_intake_3 = rows[0].max_tele_intake;
        avg_tele_portal_intake_made_3 = rows[0].avg_tele_portal_intake_made;
        avg_tele_portal_intake_attempts_3 = rows[0].avg_tele_portal_intake_attempts;
        avg_tele_pyramid_intake_3 = rows[0].avg_tele_pyramid_intake;
        avg_tele_unprotected_intake_3 = rows[0].avg_tele_unprotected_intake;
        avg_tele_floor_intake_3 = rows[0].avg_tele_floor_intake;
        tot_tele_orderly_3 = rows[0].tot_tele_orderly;
        max_tele_highest_level_3 = rows[0].max_tele_highest_level;
        frq_tele_highest_level_3 = rows[0].frq_tele_highest_level;
        tot_tele_platform_3 = rows[0].tot_tele_platform;
        tot_tele_climb_3 = rows[0].tot_tele_climb;
        tot_tele_climb_attempts_3 = rows[0].tot_tele_climb_attempts;
        tot_tele_climb_assisted_3 = rows[0].tot_tele_climb_assisted;
        tot_tele_plus_one_3 = rows[0].tot_tele_plus_one;
        tot_tele_plus_one_attempts_3 = rows[0].tot_tele_plus_one_attempts;
        tot_tele_plus_two_3 = rows[0].tot_tele_plus_two;
        tot_tele_plus_two_attempts_3 = rows[0].tot_tele_plus_two_attempts;
        avg_pyramid_scale_cycles_3 = rows[0].avg_tele_pyramid_scale_cycle;
        avg_pyramid_near_switch_cycles_3 = rows[0].avg_tele_pyramid_near_switch_cycle;
        avg_pyramid_far_switch_cycles_3 = rows[0].avg_tele_pyramid_far_switch_cycle;
        avg_pyramid_exchange_cycles_3 = rows[0].avg_tele_pyramid_exchange_cycle;
        avg_unprotected_scale_cycles_3 = rows[0].avg_tele_unprotected_scale_cycle;
        avg_unprotected_near_switch_cycles_3 = rows[0].avg_tele_unprotected_near_switch_cycle;
        avg_unprotected_far_switch_cycles_3 = rows[0].avg_tele_unprotected_far_switch_cycle;
        avg_unprotected_exchange_cycles_3 = rows[0].avg_tele_unprotected_exchange_cycle;
        avg_portal_scale_cycles_3 = rows[0].avg_tele_portal_scale_cycle;
        avg_portal_near_switch_cycles_3 = rows[0].avg_tele_portal_near_switch_cycle;
        avg_portal_far_switch_cycles_3 = rows[0].avg_tele_portal_far_switch_cycle;
        avg_portal_exchange_cycles_3 = rows[0].avg_tele_portal_exchange_cycle;
        avg_floor_scale_cycles_3 = rows[0].avg_tele_floor_scale_cycle;
        avg_floor_near_switch_cycles_3 = rows[0].avg_tele_floor_near_switch_cycle;
        avg_floor_far_switch_cycles_3 = rows[0].avg_tele_floor_far_switch_cycle;
        avg_floor_exchange_cycles_3 = rows[0].avg_tele_floor_exchange_cycle;
        tot_pyramid_scale_cycles_3 = rows[0].tot_tele_pyramid_scale_cycle / num_matches_3;
        tot_pyramid_near_switch_cycles_3 = rows[0].tot_tele_pyramid_near_switch_cycle / num_matches_3;
        tot_pyramid_far_switch_cycles_3 = rows[0].tot_tele_pyramid_far_switch_cycle / num_matches_3;
        tot_pyramid_exchange_cycles_3 = rows[0].tot_tele_pyramid_exchange_cycle / num_matches_3;
        tot_unprotected_scale_cycles_3 = rows[0].tot_tele_unprotected_scale_cycle / num_matches_3;
        tot_unprotected_near_switch_cycles_3 = rows[0].tot_tele_unprotected_near_switch_cycle / num_matches_3;
        tot_unprotected_far_switch_cycles_3 = rows[0].tot_tele_unprotected_far_switch_cycle / num_matches_3;
        tot_unprotected_exchange_cycles_3 = rows[0].tot_tele_unprotected_exchange_cycle / num_matches_3;
        tot_portal_scale_cycles_3 = rows[0].tot_tele_portal_scale_cycle / num_matches_3;
        tot_portal_near_switch_cycles_3 = rows[0].tot_tele_portal_near_switch_cycle / num_matches_3;
        tot_portal_far_switch_cycles_3 = rows[0].tot_tele_portal_far_switch_cycle / num_matches_3;
        tot_portal_exchange_cycles_3 = rows[0].tot_tele_portal_exchange_cycle / num_matches_3;
        tot_floor_scale_cycles_3 = rows[0].tot_tele_floor_scale_cycle / num_matches_3;
        tot_floor_near_switch_cycles_3 = rows[0].tot_tele_floor_near_switch_cycle / num_matches_3;
        tot_floor_far_switch_cycles_3 = rows[0].tot_tele_floor_far_switch_cycle / num_matches_3;
        tot_floor_exchange_cycles_3 = rows[0].tot_tele_floor_exchange_cycle / num_matches_3;
        max_pyramid_scale_cycles_3 = rows[0].max_tele_pyramid_scale_cycle;
        max_pyramid_near_switch_cycles_3 = rows[0].max_tele_pyramid_near_switch_cycle;
        max_pyramid_far_switch_cycles_3 = rows[0].max_tele_pyramid_far_switch_cycle;
        max_pyramid_exchange_cycles_3 = rows[0].max_tele_pyramid_exchange_cycle;
        max_unprotected_scale_cycles_3 = rows[0].max_tele_unprotected_scale_cycle;
        max_unprotected_near_switch_cycles_3 = rows[0].max_tele_unprotected_near_switch_cycle;
        max_unprotected_far_switch_cycles_3 = rows[0].max_tele_unprotected_far_switch_cycle;
        max_unprotected_exchange_cycles_3 = rows[0].max_tele_unprotected_exchange_cycle;
        max_portal_scale_cycles_3 = rows[0].max_tele_portal_scale_cycle;
        max_portal_near_switch_cycles_3 = rows[0].max_tele_portal_near_switch_cycle;
        max_portal_far_switch_cycles_3 = rows[0].max_tele_portal_far_switch_cycle;
        max_portal_exchange_cycles_3 = rows[0].max_tele_portal_exchange_cycle;
        max_floor_scale_cycles_3 = rows[0].max_tele_floor_scale_cycle;
        max_floor_near_switch_cycles_3 = rows[0].max_tele_floor_near_switch_cycle;
        max_floor_far_switch_cycles_3 = rows[0].max_tele_floor_far_switch_cycle;
        max_floor_exchange_cycles_3 = rows[0].max_tele_floor_exchange_cycle;
        avg_driver_rating_3 = rows[0].avg_driver_rating;
        avg_defense_rating_3 = rows[0].avg_defense_rating;
      });

      var auto_sql_3 = "SELECT * FROM matches WHERE team_num='"+ team_num_3 +"'";
      connectionLocal.query(auto_sql_3, function(err, rows, fields) {
        for(var x in rows)
        {
          if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_made > 0) tot_auto_left_switch_made_3 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_left_scale_made_3 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_made > 0) tot_auto_center_switch_made_3 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_center_scale_made_3 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_made > 0) tot_auto_right_switch_made_3 += rows[x].auto_near_switch_made;
          if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_right_scale_made_3 += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
          if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_missed > 0) tot_auto_left_switch_missed_3 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_missec + rows[x].auto_scale_low_missed > 0) tot_auto_left_scale_missed_3 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_missed > 0) tot_auto_center_switch_missed_3 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_center_scale_missed_3 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_missed > 0) tot_auto_right_switch_missed_3 += rows[x].auto_near_switch_missed;
          if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_right_scale_missed_3 += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
          auto_made_trend_3 = tot_auto_left_switch_made_3 + ", " + tot_auto_left_scale_made_3 + ", " + tot_auto_center_switch_made_3 + ", " + tot_auto_center_scale_made_3 + ", " + tot_auto_right_switch_made_3 + ", " + tot_auto_right_scale_made_3;
          auto_missed_trend_3 = tot_auto_left_switch_missed_3 + ", " + tot_auto_left_scale_missed_3 + ", " + tot_auto_center_switch_missed_3 + ", " + tot_auto_center_scale_missed_3 + ", " + tot_auto_right_switch_missed_3 + ", " + tot_auto_right_scale_missed_3;
        }
      });
    }

    setTimeout(function() {
      res.render('pages/alliance', {
        req: req,
        team_num_1: team_num_1,
        team_name_1: team_name_1,
        num_matches_1: num_matches_1,
        tot_auto_cross_1: tot_auto_cross_1,
        tot_auto_left_1: tot_auto_left_1,
        tot_auto_center_1: tot_auto_center_1,
        tot_auto_right_1: tot_auto_right_1,
        tot_auto_pyramid_intake_1: tot_auto_pyramid_intake_1,
        tot_auto_unprotected_intake_1: tot_auto_unprotected_intake_1,
        tot_auto_near_switch_made_1: tot_auto_near_switch_made_1,
        tot_auto_near_switch_attempts_1: tot_auto_near_switch_attempts_1,
        tot_auto_exchange_made_1: tot_auto_exchange_made_1,
        tot_auto_exchange_attempts_1: tot_auto_exchange_attempts_1,
        tot_auto_scale_high_made_1: tot_auto_scale_high_made_1,
        tot_auto_scale_high_attempts_1: tot_auto_scale_high_attempts_1,
        tot_auto_scale_low_made_1: tot_auto_scale_low_made_1,
        tot_auto_scale_low_attempts_1: tot_auto_scale_low_attempts_1,
        avg_tele_cubes_scored_1: avg_tele_cubes_scored_1,
        max_tele_cubes_scored_1: max_tele_cubes_scored_1,
        avg_tele_exchange_made_1: avg_tele_exchange_made_1,
        avg_tele_exchange_attempts_1: avg_tele_exchange_attempts_1,
        avg_tele_near_switch_made_1: avg_tele_near_switch_made_1,
        avg_tele_near_switch_attempts_1: avg_tele_near_switch_attempts_1,
        avg_tele_far_switch_made_1: avg_tele_far_switch_made_1,
        avg_tele_far_switch_attempts_1: avg_tele_far_switch_attempts_1,
        avg_tele_scale_high_made_1: avg_tele_scale_high_made_1,
        avg_tele_scale_high_attempts_1: avg_tele_scale_high_attempts_1,
        avg_tele_scale_low_made_1: avg_tele_scale_low_made_1,
        avg_tele_scale_low_attempts_1: avg_tele_scale_low_attempts_1,
        avg_tele_knockouts_1: avg_tele_knockouts_1,
        avg_tele_cubes_dropped_1: avg_tele_cubes_dropped_1,
        avg_tele_intake_1: avg_tele_intake_1,
        max_tele_intake_1: max_tele_intake_1,
        avg_tele_portal_intake_made_1: avg_tele_portal_intake_made_1,
        avg_tele_portal_intake_attempts_1: avg_tele_portal_intake_attempts_1,
        avg_tele_pyramid_intake_1: avg_tele_pyramid_intake_1,
        avg_tele_unprotected_intake_1: avg_tele_unprotected_intake_1,
        avg_tele_floor_intake_1: avg_tele_floor_intake_1,
        tot_tele_orderly_1: tot_tele_orderly_1,
        max_tele_highest_level_1: max_tele_highest_level_1,
        frq_tele_highest_level_1: frq_tele_highest_level_1,
        tot_tele_platform_1: tot_tele_platform_1,
        tot_tele_climb_1: tot_tele_climb_1,
        tot_tele_climb_attempts_1: tot_tele_climb_attempts_1,
        tot_tele_climb_assisted_1: tot_tele_climb_assisted_1,
        tot_tele_plus_one_1: tot_tele_plus_one_1,
        tot_tele_plus_one_attempts_1: tot_tele_plus_one_attempts_1,
        tot_tele_plus_two_1: tot_tele_plus_two_1,
        tot_tele_plus_two_attempts_1: tot_tele_plus_two_attempts_1,
        avg_pyramid_scale_cycles_1: avg_pyramid_scale_cycles_1,
        avg_pyramid_near_switch_cycles_1: avg_pyramid_near_switch_cycles_1,
        avg_pyramid_far_switch_cycles_1: avg_pyramid_far_switch_cycles_1,
        avg_pyramid_exchange_cycles_1: avg_pyramid_exchange_cycles_1,
        avg_unprotected_scale_cycles_1: avg_unprotected_scale_cycles_1,
        avg_unprotected_near_switch_cycles_1: avg_unprotected_near_switch_cycles_1,
        avg_unprotected_far_switch_cycles_1: avg_unprotected_far_switch_cycles_1,
        avg_unprotected_exchange_cycles_1: avg_unprotected_exchange_cycles_1,
        avg_portal_scale_cycles_1: avg_portal_scale_cycles_1,
        avg_portal_near_switch_cycles_1: avg_portal_near_switch_cycles_1,
        avg_portal_far_switch_cycles_1: avg_portal_far_switch_cycles_1,
        avg_portal_exchange_cycles_1: avg_portal_exchange_cycles_1,
        avg_floor_scale_cycles_1: avg_floor_scale_cycles_1,
        avg_floor_near_switch_cycles_1: avg_floor_near_switch_cycles_1,
        avg_floor_far_switch_cycles_1: avg_floor_far_switch_cycles_1,
        avg_floor_exchange_cycles_1: avg_floor_exchange_cycles_1,
        tot_pyramid_scale_cycles_1: tot_pyramid_scale_cycles_1,
        tot_pyramid_near_switch_cycles_1: tot_pyramid_near_switch_cycles_1,
        tot_pyramid_far_switch_cycles_1: tot_pyramid_far_switch_cycles_1,
        tot_pyramid_exchange_cycles_1: tot_pyramid_exchange_cycles_1,
        tot_unprotected_scale_cycles_1: tot_unprotected_scale_cycles_1,
        tot_unprotected_near_switch_cycles_1: tot_unprotected_near_switch_cycles_1,
        tot_unprotected_far_switch_cycles_1: tot_unprotected_far_switch_cycles_1,
        tot_unprotected_exchange_cycles_1: tot_unprotected_exchange_cycles_1,
        tot_portal_scale_cycles_1: tot_portal_scale_cycles_1,
        tot_portal_near_switch_cycles_1: tot_portal_near_switch_cycles_1,
        tot_portal_far_switch_cycles_1: tot_portal_far_switch_cycles_1,
        tot_portal_exchange_cycles_1: tot_portal_exchange_cycles_1,
        tot_floor_scale_cycles_1: tot_floor_scale_cycles_1,
        tot_floor_near_switch_cycles_1: tot_floor_near_switch_cycles_1,
        tot_floor_far_switch_cycles_1: tot_floor_far_switch_cycles_1,
        tot_floor_exchange_cycles_1: tot_floor_exchange_cycles_1,
        max_pyramid_scale_cycles_1: max_pyramid_scale_cycles_1,
        max_pyramid_near_switch_cycles_1: max_pyramid_near_switch_cycles_1,
        max_pyramid_far_switch_cycles_1: max_pyramid_far_switch_cycles_1,
        max_pyramid_exchange_cycles_1: max_pyramid_exchange_cycles_1,
        max_unprotected_scale_cycles_1: max_unprotected_scale_cycles_1,
        max_unprotected_near_switch_cycles_1: max_unprotected_near_switch_cycles_1,
        max_unprotected_far_switch_cycles_1: max_unprotected_far_switch_cycles_1,
        max_unprotected_exchange_cycles_1: max_unprotected_exchange_cycles_1,
        max_portal_scale_cycles_1: max_portal_scale_cycles_1,
        max_portal_near_switch_cycles_1: max_portal_near_switch_cycles_1,
        max_portal_far_switch_cycles_1: max_portal_far_switch_cycles_1,
        max_portal_exchange_cycles_1: max_portal_exchange_cycles_1,
        max_floor_scale_cycles_1: max_floor_scale_cycles_1,
        max_floor_near_switch_cycles_1: max_floor_near_switch_cycles_1,
        max_floor_far_switch_cycles_1: max_floor_far_switch_cycles_1,
        max_floor_exchange_cycles_1: max_floor_exchange_cycles_1,
        auto_made_trend_1: auto_made_trend_1,
        auto_missed_trend_1: auto_missed_trend_1,
        avg_driver_rating_1: avg_driver_rating_1,
        avg_defense_rating_1: avg_defense_rating_1,
        most_recent_match_1: most_recent_match_1,

        team_num_2: team_num_2,
        team_name_2: team_name_2,
        num_matches_2: num_matches_2,
        tot_auto_cross_2: tot_auto_cross_2,
        tot_auto_left_2: tot_auto_left_2,
        tot_auto_center_2: tot_auto_center_2,
        tot_auto_right_2: tot_auto_right_2,
        tot_auto_pyramid_intake_2: tot_auto_pyramid_intake_2,
        tot_auto_unprotected_intake_2: tot_auto_unprotected_intake_2,
        tot_auto_near_switch_made_2: tot_auto_near_switch_made_2,
        tot_auto_near_switch_attempts_2: tot_auto_near_switch_attempts_2,
        tot_auto_exchange_made_2: tot_auto_exchange_made_2,
        tot_auto_exchange_attempts_2: tot_auto_exchange_attempts_2,
        tot_auto_scale_high_made_2: tot_auto_scale_high_made_2,
        tot_auto_scale_high_attempts_2: tot_auto_scale_high_attempts_2,
        tot_auto_scale_low_made_2: tot_auto_scale_low_made_2,
        tot_auto_scale_low_attempts_2: tot_auto_scale_low_attempts_2,
        avg_tele_cubes_scored_2: avg_tele_cubes_scored_2,
        max_tele_cubes_scored_2: max_tele_cubes_scored_2,
        avg_tele_exchange_made_2: avg_tele_exchange_made_2,
        avg_tele_exchange_attempts_2: avg_tele_exchange_attempts_2,
        avg_tele_near_switch_made_2: avg_tele_near_switch_made_2,
        avg_tele_near_switch_attempts_2: avg_tele_near_switch_attempts_2,
        avg_tele_far_switch_made_2: avg_tele_far_switch_made_2,
        avg_tele_far_switch_attempts_2: avg_tele_far_switch_attempts_2,
        avg_tele_scale_high_made_2: avg_tele_scale_high_made_2,
        avg_tele_scale_high_attempts_2: avg_tele_scale_high_attempts_2,
        avg_tele_scale_low_made_2: avg_tele_scale_low_made_2,
        avg_tele_scale_low_attempts_2: avg_tele_scale_low_attempts_2,
        avg_tele_knockouts_2: avg_tele_knockouts_2,
        avg_tele_cubes_dropped_2: avg_tele_cubes_dropped_2,
        avg_tele_intake_2: avg_tele_intake_2,
        max_tele_intake_2: max_tele_intake_2,
        avg_tele_portal_intake_made_2: avg_tele_portal_intake_made_2,
        avg_tele_portal_intake_attempts_2: avg_tele_portal_intake_attempts_2,
        avg_tele_pyramid_intake_2: avg_tele_pyramid_intake_2,
        avg_tele_unprotected_intake_2: avg_tele_unprotected_intake_2,
        avg_tele_floor_intake_2: avg_tele_floor_intake_2,
        tot_tele_orderly_2: tot_tele_orderly_2,
        max_tele_highest_level_2: max_tele_highest_level_2,
        frq_tele_highest_level_2: frq_tele_highest_level_2,
        tot_tele_platform_2: tot_tele_platform_2,
        tot_tele_climb_2: tot_tele_climb_2,
        tot_tele_climb_attempts_2: tot_tele_climb_attempts_2,
        tot_tele_climb_assisted_2: tot_tele_climb_assisted_2,
        tot_tele_plus_one_2: tot_tele_plus_one_2,
        tot_tele_plus_one_attempts_2: tot_tele_plus_one_attempts_2,
        tot_tele_plus_two_2: tot_tele_plus_two_2,
        tot_tele_plus_two_attempts_2: tot_tele_plus_two_attempts_2,
        avg_pyramid_scale_cycles_2: avg_pyramid_scale_cycles_2,
        avg_pyramid_near_switch_cycles_2: avg_pyramid_near_switch_cycles_2,
        avg_pyramid_far_switch_cycles_2: avg_pyramid_far_switch_cycles_2,
        avg_pyramid_exchange_cycles_2: avg_pyramid_exchange_cycles_2,
        avg_unprotected_scale_cycles_2: avg_unprotected_scale_cycles_2,
        avg_unprotected_near_switch_cycles_2: avg_unprotected_near_switch_cycles_2,
        avg_unprotected_far_switch_cycles_2: avg_unprotected_far_switch_cycles_2,
        avg_unprotected_exchange_cycles_2: avg_unprotected_exchange_cycles_2,
        avg_portal_scale_cycles_2: avg_portal_scale_cycles_2,
        avg_portal_near_switch_cycles_2: avg_portal_near_switch_cycles_2,
        avg_portal_far_switch_cycles_2: avg_portal_far_switch_cycles_2,
        avg_portal_exchange_cycles_2: avg_portal_exchange_cycles_2,
        avg_floor_scale_cycles_2: avg_floor_scale_cycles_2,
        avg_floor_near_switch_cycles_2: avg_floor_near_switch_cycles_2,
        avg_floor_far_switch_cycles_2: avg_floor_far_switch_cycles_2,
        avg_floor_exchange_cycles_2: avg_floor_exchange_cycles_2,
        tot_pyramid_scale_cycles_2: tot_pyramid_scale_cycles_2,
        tot_pyramid_near_switch_cycles_2: tot_pyramid_near_switch_cycles_2,
        tot_pyramid_far_switch_cycles_2: tot_pyramid_far_switch_cycles_2,
        tot_pyramid_exchange_cycles_2: tot_pyramid_exchange_cycles_2,
        tot_unprotected_scale_cycles_2: tot_unprotected_scale_cycles_2,
        tot_unprotected_near_switch_cycles_2: tot_unprotected_near_switch_cycles_2,
        tot_unprotected_far_switch_cycles_2: tot_unprotected_far_switch_cycles_2,
        tot_unprotected_exchange_cycles_2: tot_unprotected_exchange_cycles_2,
        tot_portal_scale_cycles_2: tot_portal_scale_cycles_2,
        tot_portal_near_switch_cycles_2: tot_portal_near_switch_cycles_2,
        tot_portal_far_switch_cycles_2: tot_portal_far_switch_cycles_2,
        tot_portal_exchange_cycles_2: tot_portal_exchange_cycles_2,
        tot_floor_scale_cycles_2: tot_floor_scale_cycles_2,
        tot_floor_near_switch_cycles_2: tot_floor_near_switch_cycles_2,
        tot_floor_far_switch_cycles_2: tot_floor_far_switch_cycles_2,
        tot_floor_exchange_cycles_2: tot_floor_exchange_cycles_2,
        max_pyramid_scale_cycles_2: max_pyramid_scale_cycles_2,
        max_pyramid_near_switch_cycles_2: max_pyramid_near_switch_cycles_2,
        max_pyramid_far_switch_cycles_2: max_pyramid_far_switch_cycles_2,
        max_pyramid_exchange_cycles_2: max_pyramid_exchange_cycles_2,
        max_unprotected_scale_cycles_2: max_unprotected_scale_cycles_2,
        max_unprotected_near_switch_cycles_2: max_unprotected_near_switch_cycles_2,
        max_unprotected_far_switch_cycles_2: max_unprotected_far_switch_cycles_2,
        max_unprotected_exchange_cycles_2: max_unprotected_exchange_cycles_2,
        max_portal_scale_cycles_2: max_portal_scale_cycles_2,
        max_portal_near_switch_cycles_2: max_portal_near_switch_cycles_2,
        max_portal_far_switch_cycles_2: max_portal_far_switch_cycles_2,
        max_portal_exchange_cycles_2: max_portal_exchange_cycles_2,
        max_floor_scale_cycles_2: max_floor_scale_cycles_2,
        max_floor_near_switch_cycles_2: max_floor_near_switch_cycles_2,
        max_floor_far_switch_cycles_2: max_floor_far_switch_cycles_2,
        max_floor_exchange_cycles_2: max_floor_exchange_cycles_2,
        auto_made_trend_2: auto_made_trend_2,
        auto_missed_trend_2: auto_missed_trend_2,
        avg_driver_rating_2: avg_driver_rating_2,
        avg_defense_rating_2: avg_defense_rating_2,
        most_recent_match_2: most_recent_match_2,

        team_num_3: team_num_3,
        team_name_3: team_name_3,
        num_matches_3: num_matches_3,
        tot_auto_cross_3: tot_auto_cross_3,
        tot_auto_left_3: tot_auto_left_3,
        tot_auto_center_3: tot_auto_center_3,
        tot_auto_right_3: tot_auto_right_3,
        tot_auto_pyramid_intake_3: tot_auto_pyramid_intake_3,
        tot_auto_unprotected_intake_3: tot_auto_unprotected_intake_3,
        tot_auto_near_switch_made_3: tot_auto_near_switch_made_3,
        tot_auto_near_switch_attempts_3: tot_auto_near_switch_attempts_3,
        tot_auto_exchange_made_3: tot_auto_exchange_made_3,
        tot_auto_exchange_attempts_3: tot_auto_exchange_attempts_3,
        tot_auto_scale_high_made_3: tot_auto_scale_high_made_3,
        tot_auto_scale_high_attempts_3: tot_auto_scale_high_attempts_3,
        tot_auto_scale_low_made_3: tot_auto_scale_low_made_3,
        tot_auto_scale_low_attempts_3: tot_auto_scale_low_attempts_3,
        avg_tele_cubes_scored_3: avg_tele_cubes_scored_3,
        max_tele_cubes_scored_3: max_tele_cubes_scored_3,
        avg_tele_exchange_made_3: avg_tele_exchange_made_3,
        avg_tele_exchange_attempts_3: avg_tele_exchange_attempts_3,
        avg_tele_near_switch_made_3: avg_tele_near_switch_made_3,
        avg_tele_near_switch_attempts_3: avg_tele_near_switch_attempts_3,
        avg_tele_far_switch_made_3: avg_tele_far_switch_made_3,
        avg_tele_far_switch_attempts_3: avg_tele_far_switch_attempts_3,
        avg_tele_scale_high_made_3: avg_tele_scale_high_made_3,
        avg_tele_scale_high_attempts_3: avg_tele_scale_high_attempts_3,
        avg_tele_scale_low_made_3: avg_tele_scale_low_made_3,
        avg_tele_scale_low_attempts_3: avg_tele_scale_low_attempts_3,
        avg_tele_knockouts_3: avg_tele_knockouts_3,
        avg_tele_cubes_dropped_3: avg_tele_cubes_dropped_3,
        avg_tele_intake_3: avg_tele_intake_3,
        max_tele_intake_3: max_tele_intake_3,
        avg_tele_portal_intake_made_3: avg_tele_portal_intake_made_3,
        avg_tele_portal_intake_attempts_3: avg_tele_portal_intake_attempts_3,
        avg_tele_pyramid_intake_3: avg_tele_pyramid_intake_3,
        avg_tele_unprotected_intake_3: avg_tele_unprotected_intake_3,
        avg_tele_floor_intake_3: avg_tele_floor_intake_3,
        tot_tele_orderly_3: tot_tele_orderly_3,
        max_tele_highest_level_3: max_tele_highest_level_3,
        frq_tele_highest_level_3: frq_tele_highest_level_3,
        tot_tele_platform_3: tot_tele_platform_3,
        tot_tele_climb_3: tot_tele_climb_3,
        tot_tele_climb_attempts_3: tot_tele_climb_attempts_3,
        tot_tele_climb_assisted_3: tot_tele_climb_assisted_3,
        tot_tele_plus_one_3: tot_tele_plus_one_3,
        tot_tele_plus_one_attempts_3: tot_tele_plus_one_attempts_3,
        tot_tele_plus_two_3: tot_tele_plus_two_3,
        tot_tele_plus_two_attempts_3: tot_tele_plus_two_attempts_3,
        avg_pyramid_scale_cycles_3: avg_pyramid_scale_cycles_3,
        avg_pyramid_near_switch_cycles_3: avg_pyramid_near_switch_cycles_3,
        avg_pyramid_far_switch_cycles_3: avg_pyramid_far_switch_cycles_3,
        avg_pyramid_exchange_cycles_3: avg_pyramid_exchange_cycles_3,
        avg_unprotected_scale_cycles_3: avg_unprotected_scale_cycles_3,
        avg_unprotected_near_switch_cycles_3: avg_unprotected_near_switch_cycles_3,
        avg_unprotected_far_switch_cycles_3: avg_unprotected_far_switch_cycles_3,
        avg_unprotected_exchange_cycles_3: avg_unprotected_exchange_cycles_3,
        avg_portal_scale_cycles_3: avg_portal_scale_cycles_3,
        avg_portal_near_switch_cycles_3: avg_portal_near_switch_cycles_3,
        avg_portal_far_switch_cycles_3: avg_portal_far_switch_cycles_3,
        avg_portal_exchange_cycles_3: avg_portal_exchange_cycles_3,
        avg_floor_scale_cycles_3: avg_floor_scale_cycles_3,
        avg_floor_near_switch_cycles_3: avg_floor_near_switch_cycles_3,
        avg_floor_far_switch_cycles_3: avg_floor_far_switch_cycles_3,
        avg_floor_exchange_cycles_3: avg_floor_exchange_cycles_3,
        tot_pyramid_scale_cycles_3: tot_pyramid_scale_cycles_3,
        tot_pyramid_near_switch_cycles_3: tot_pyramid_near_switch_cycles_3,
        tot_pyramid_far_switch_cycles_3: tot_pyramid_far_switch_cycles_3,
        tot_pyramid_exchange_cycles_3: tot_pyramid_exchange_cycles_3,
        tot_unprotected_scale_cycles_3: tot_unprotected_scale_cycles_3,
        tot_unprotected_near_switch_cycles_3: tot_unprotected_near_switch_cycles_3,
        tot_unprotected_far_switch_cycles_3: tot_unprotected_far_switch_cycles_3,
        tot_unprotected_exchange_cycles_3: tot_unprotected_exchange_cycles_3,
        tot_portal_scale_cycles_3: tot_portal_scale_cycles_3,
        tot_portal_near_switch_cycles_3: tot_portal_near_switch_cycles_3,
        tot_portal_far_switch_cycles_3: tot_portal_far_switch_cycles_3,
        tot_portal_exchange_cycles_3: tot_portal_exchange_cycles_3,
        tot_floor_scale_cycles_3: tot_floor_scale_cycles_3,
        tot_floor_near_switch_cycles_3: tot_floor_near_switch_cycles_3,
        tot_floor_far_switch_cycles_3: tot_floor_far_switch_cycles_3,
        tot_floor_exchange_cycles_3: tot_floor_exchange_cycles_3,
        max_pyramid_scale_cycles_3: max_pyramid_scale_cycles_3,
        max_pyramid_near_switch_cycles_3: max_pyramid_near_switch_cycles_3,
        max_pyramid_far_switch_cycles_3: max_pyramid_far_switch_cycles_3,
        max_pyramid_exchange_cycles_3: max_pyramid_exchange_cycles_3,
        max_unprotected_scale_cycles_3: max_unprotected_scale_cycles_3,
        max_unprotected_near_switch_cycles_3: max_unprotected_near_switch_cycles_3,
        max_unprotected_far_switch_cycles_3: max_unprotected_far_switch_cycles_3,
        max_unprotected_exchange_cycles_3: max_unprotected_exchange_cycles_3,
        max_portal_scale_cycles_3: max_portal_scale_cycles_3,
        max_portal_near_switch_cycles_3: max_portal_near_switch_cycles_3,
        max_portal_far_switch_cycles_3: max_portal_far_switch_cycles_3,
        max_portal_exchange_cycles_3: max_portal_exchange_cycles_3,
        max_floor_scale_cycles_3: max_floor_scale_cycles_3,
        max_floor_near_switch_cycles_3: max_floor_near_switch_cycles_3,
        max_floor_far_switch_cycles_3: max_floor_far_switch_cycles_3,
        max_floor_exchange_cycles_3: max_floor_exchange_cycles_3,
        auto_made_trend_3: auto_made_trend_3,
        auto_missed_trend_3: auto_missed_trend_3,
        avg_driver_rating_3: avg_driver_rating_3,
        avg_defense_rating_3: avg_defense_rating_3,
        most_recent_match_3: most_recent_match_3
      });
    }, 1000);
	});

  router.get('/team/:team_num', function(req,res) {
    var team_num = Number(req.params.team_num);
    var team_name = "";
    var num_matches = 0;
    var next_team_num = 0;
    var previous_team_num = 0;
    var tot_auto_cross = 0;
    var tot_auto_left = 0;
    var tot_auto_center = 0;
    var tot_auto_right = 0;
    var tot_auto_pyramid_intake = 0;
    var tot_auto_unprotected_intake = 0;
    var tot_auto_near_switch_made = 0;
    var tot_auto_near_switch_attempts = 0;
    var tot_auto_exchange_made = 0;
    var tot_auto_exchange_attempts = 0;
    var tot_auto_scale_high_made = 0;
    var tot_auto_scale_high_attempts = 0;
    var tot_auto_scale_low_made = 0;
    var tot_auto_scale_low_attempts = 0;
    var avg_tele_cubes_scored = 0;
    var max_tele_cubes_scored = 0;
    var avg_tele_exchange_made = 0;
    var avg_tele_exchange_attempts = 0;
    var avg_tele_near_switch_made = 0;
    var avg_tele_near_switch_attempts = 0;
    var avg_tele_far_switch_made = 0;
    var avg_tele_far_switch_attempts = 0;
    var avg_tele_scale_high_made = 0;
    var avg_tele_scale_high_attempts = 0;
    var avg_tele_scale_high_missed = 0;
    var avg_tele_scale_low_made = 0;
    var avg_tele_scale_low_attempts = 0;
    var avg_tele_scale_low_missed = 0;
    var avg_tele_knockouts = 0;
    var avg_tele_cubes_descored = 0;
    var avg_tele_cubes_dropped = 0;
    var avg_tele_intake = 0;
    var max_tele_intake = 0;
    var avg_tele_portal_intake_made = 0;
    var avg_tele_portal_intake_attempts = 0;
    var avg_tele_pyramid_intake = 0;
    var avg_tele_unprotected_intake = 0;
    var avg_tele_floor_intake = 0;
    var tot_tele_orderly = 0;
    var max_tele_highest_level = 0;
    var frq_tele_highest_level = 0;
    var tot_tele_climb = 0;
    var tot_tele_climb_attempts = 0;
    var tot_tele_platform = 0;
    var tot_tele_climb_assisted = 0;
    var tot_tele_plus_one = 0;
    var tot_tele_plus_one_attempts = 0;
    var tot_tele_plus_two = 0;
    var tot_tele_plus_two_attempts = 0;
    var avg_driver_rating = 0;
    var avg_defense_rating = 0;

    var pyramid_intake_trend = "";
    var unprotected_intake_trend = "";
    var portal_intake_trend = "";
    var floor_intake_trend = "";
    var total_intake_trend = "";
    var near_switch_cubes_trend = "";
    var far_switch_cubes_trend = "";
    var scale_high_cubes_trend = "";
    var scale_low_cubes_trend = "";
    var exchange_cubes_trend = "";
    var cubes_descored_trend = "";
    var total_cubes_trend = "";
    var pyramid_radar_trend = "";
    var unprotected_radar_trend = "";
    var portal_radar_trend = "";
    var floor_radar_trend = "";
    var avg_pyramid_scale_cycles = 0;
    var avg_pyramid_near_switch_cycles = 0;
    var avg_pyramid_far_switch_cycles = 0;
    var avg_pyramid_exchange_cycles = 0;
    var avg_unprotected_scale_cycles = 0;
    var avg_unprotected_near_switch_cycles = 0;
    var avg_unprotected_far_switch_cycles = 0;
    var avg_unprotected_exchange_cycles = 0;
    var avg_portal_scale_cycles = 0;
    var avg_portal_near_switch_cycles = 0;
    var avg_portal_far_switch_cycles = 0;
    var avg_portal_exchange_cycles = 0;
    var avg_floor_scale_cycles = 0;
    var avg_floor_near_switch_cycles = 0;
    var avg_floor_far_switch_cycles = 0;
    var avg_floor_exchange_cycles = 0;
    var tot_pyramid_scale_cycles = 0;
    var tot_pyramid_near_switch_cycles = 0;
    var tot_pyramid_far_switch_cycles = 0;
    var tot_pyramid_exchange_cycles = 0;
    var tot_unprotected_scale_cycles = 0;
    var tot_unprotected_near_switch_cycles = 0;
    var tot_unprotected_far_switch_cycles = 0;
    var tot_unprotected_exchange_cycles = 0;
    var tot_portal_scale_cycles = 0;
    var tot_portal_near_switch_cycles = 0;
    var tot_portal_far_switch_cycles = 0;
    var tot_portal_exchange_cycles = 0;
    var tot_floor_scale_cycles = 0;
    var tot_floor_near_switch_cycles = 0;
    var tot_floor_far_switch_cycles = 0;
    var tot_floor_exchange_cycles = 0;
    var max_pyramid_scale_cycles = 0;
    var max_pyramid_near_switch_cycles = 0;
    var max_pyramid_far_switch_cycles = 0;
    var max_pyramid_exchange_cycles = 0;
    var max_unprotected_scale_cycles = 0;
    var max_unprotected_near_switch_cycles = 0;
    var max_unprotected_far_switch_cycles = 0;
    var max_unprotected_exchange_cycles = 0;
    var max_portal_scale_cycles = 0;
    var max_portal_near_switch_cycles = 0;
    var max_portal_far_switch_cycles = 0;
    var max_portal_exchange_cycles = 0;
    var max_floor_scale_cycles = 0;
    var max_floor_near_switch_cycles = 0;
    var max_floor_far_switch_cycles = 0;
    var max_floor_exchange_cycles = 0;
    var tot_auto_left_switch_made = 0;
    var tot_auto_left_scale_made = 0;
    var tot_auto_center_switch_made = 0;
    var tot_auto_center_scale_made = 0;
    var tot_auto_right_switch_made = 0;
    var tot_auto_right_scale_made = 0;
    var tot_auto_left_switch_missed = 0;
    var tot_auto_left_scale_missed = 0;
    var tot_auto_center_switch_missed = 0;
    var tot_auto_center_scale_missed = 0;
    var tot_auto_right_switch_missed = 0;
    var tot_auto_right_scale_missed = 0;
    var auto_made_trend = "";
    var auto_missed_trend = "";
    var trend_labels = 0;
    var skip_render = false;
    var get_data = "SELECT * FROM teams WHERE team_num="+ team_num +"";
    var next_team = "SELECT * FROM teams WHERE team_num > "+ team_num +" ORDER BY team_num LIMIT 1";
    var previous_team = "SELECT * FROM teams WHERE team_num < "+ team_num +" ORDER BY team_num DESC LIMIT 1";
    var get_graph_data = "SELECT * FROM matches WHERE team_num="+ team_num +" ORDER BY match_num";

    updateTeams(team_num);

    connectionLocal.query(get_data, function(err, rows, fields) {
      if(err || rows[0] === undefined) {
        skip_render = true;
        console.log("returning to home page, bad team entered");
      }
      else {
        team_name = rows[0].team_name;
        num_matches = rows[0].num_matches;
        tot_auto_cross = rows[0].tot_auto_cross;
        tot_auto_left = rows[0].tot_auto_left;
        tot_auto_center = rows[0].tot_auto_center;
        tot_auto_right = rows[0].tot_auto_right;
        tot_auto_pyramid_intake = rows[0].tot_auto_pyramid_intake;
        tot_auto_unprotected_intake = rows[0].tot_auto_unprotected_intake;
        tot_auto_near_switch_made = rows[0].tot_auto_near_switch_made;
        tot_auto_near_switch_attempts = rows[0].tot_auto_near_switch_attempts;
        tot_auto_exchange_made = rows[0].tot_auto_exchange_made;
        tot_auto_exchange_attempts = rows[0].tot_auto_exchange_attempts;
        tot_auto_scale_high_made = rows[0].tot_auto_scale_high_made;
        tot_auto_scale_high_attempts = rows[0].tot_auto_scale_high_attempts;
        tot_auto_scale_low_made = rows[0].tot_auto_scale_low_made;
        tot_auto_scale_low_attempts = rows[0].tot_auto_scale_low_attempts;
        avg_tele_cubes_scored = rows[0].avg_tele_cubes_scored;
        max_tele_cubes_scored = rows[0].max_tele_cubes_scored;
        avg_tele_exchange_made = rows[0].avg_tele_exchange_made;
        avg_tele_exchange_attempts = rows[0].avg_tele_exchange_attempts;
        avg_tele_near_switch_made = rows[0].avg_tele_near_switch_made;
        avg_tele_near_switch_attempts = rows[0].avg_tele_near_switch_attempts;
        avg_tele_far_switch_made = rows[0].avg_tele_far_switch_made;
        avg_tele_far_switch_attempts = rows[0].avg_tele_far_switch_attempts;
        avg_tele_scale_high_made = rows[0].avg_tele_scale_high_made;
        avg_tele_scale_high_attempts = rows[0].avg_tele_scale_high_attempts;
        avg_tele_scale_high_missed = rows[0].avg_tele_scale_high_missed;
        avg_tele_scale_low_made = rows[0].avg_tele_scale_low_made;
        avg_tele_scale_low_attempts = rows[0].avg_tele_scale_low_attempts;
        avg_tele_scale_low_missed = rows[0].avg_tele_scale_low_missed;
        avg_tele_knockouts = rows[0].avg_tele_knockouts;
        avg_tele_cubes_descored = rows[0].avg_tele_cubes_descored;
        avg_tele_cubes_dropped = rows[0].avg_tele_cubes_dropped;
        avg_tele_intake = rows[0].avg_tele_intake;
        max_tele_intake = rows[0].max_tele_intake;
        avg_tele_portal_intake_made = rows[0].avg_tele_portal_intake_made;
        avg_tele_portal_intake_attempts = rows[0].avg_tele_portal_intake_attempts;
        avg_tele_pyramid_intake = rows[0].avg_tele_pyramid_intake;
        avg_tele_unprotected_intake = rows[0].avg_tele_unprotected_intake;
        avg_tele_floor_intake = rows[0].avg_tele_floor_intake;
        tot_tele_orderly = rows[0].tot_tele_orderly;
        max_tele_highest_level = rows[0].max_tele_highest_level;
        frq_tele_highest_level = rows[0].frq_tele_highest_level;
        tot_tele_climb = rows[0].tot_tele_climb;
        tot_tele_climb_attempts = rows[0].tot_tele_climb_attempts;
        tot_tele_platform = rows[0].tot_tele_platform;
        tot_tele_climb_assisted = rows[0].tot_tele_climb_assisted;
        tot_tele_plus_one = rows[0].tot_tele_plus_one;
        tot_tele_plus_one_attempts = rows[0].tot_tele_plus_one_attempts;
        tot_tele_plus_two = rows[0].tot_tele_plus_two;
        tot_tele_plus_two_attempts = rows[0].tot_tele_plus_two_attempts;
        avg_driver_rating = rows[0].avg_driver_rating;
        avg_defense_rating = rows[0].avg_defense_rating;
        pyramid_radar_trend = rows[0].avg_tele_pyramid_scale_cycle + ", " + rows[0].avg_tele_pyramid_near_switch_cycle + ", " + rows[0].avg_tele_pyramid_far_switch_cycle + ", " + rows[0].avg_tele_pyramid_exchange_cycle;
        unprotected_radar_trend = rows[0].avg_tele_unprotected_scale_cycle + ", " + rows[0].avg_tele_unprotected_near_switch_cycle + ", " + rows[0].avg_tele_unprotected_far_switch_cycle + ", " + rows[0].avg_tele_unprotected_exchange_cycle;
        portal_radar_trend = rows[0].avg_tele_portal_scale_cycle + ", " + rows[0].avg_tele_portal_near_switch_cycle + ", " + rows[0].avg_tele_portal_far_switch_cycle + ", " + rows[0].avg_tele_portal_exchange_cycle;
        floor_radar_trend = rows[0].avg_tele_floor_scale_cycle + ", " + rows[0].avg_tele_floor_near_switch_cycle + ", " + rows[0].avg_tele_floor_far_switch_cycle + ", " + rows[0].avg_tele_floor_exchange_cycle;
        avg_pyramid_scale_cycles = rows[0].avg_tele_pyramid_scale_cycle;
        avg_pyramid_near_switch_cycles = rows[0].avg_tele_pyramid_near_switch_cycle;
        avg_pyramid_far_switch_cycles = rows[0].avg_tele_pyramid_far_switch_cycle;
        avg_pyramid_exchange_cycles = rows[0].avg_tele_pyramid_exchange_cycle;
        avg_unprotected_scale_cycles = rows[0].avg_tele_unprotected_scale_cycle;
        avg_unprotected_near_switch_cycles = rows[0].avg_tele_unprotected_near_switch_cycle;
        avg_unprotected_far_switch_cycles = rows[0].avg_tele_unprotected_far_switch_cycle;
        avg_unprotected_exchange_cycles = rows[0].avg_tele_unprotected_exchange_cycle;
        avg_portal_scale_cycles = rows[0].avg_tele_portal_scale_cycle;
        avg_portal_near_switch_cycles = rows[0].avg_tele_portal_near_switch_cycle;
        avg_portal_far_switch_cycles = rows[0].avg_tele_portal_far_switch_cycle;
        avg_portal_exchange_cycles = rows[0].avg_tele_portal_exchange_cycle;
        avg_floor_scale_cycles = rows[0].avg_tele_floor_scale_cycle;
        avg_floor_near_switch_cycles = rows[0].avg_tele_floor_near_switch_cycle;
        avg_floor_far_switch_cycles = rows[0].avg_tele_floor_far_switch_cycle;
        avg_floor_exchange_cycles = rows[0].avg_tele_floor_exchange_cycle;
        tot_pyramid_scale_cycles = rows[0].tot_tele_pyramid_scale_cycle / num_matches; // tot is really per match :|
        tot_pyramid_near_switch_cycles = rows[0].tot_tele_pyramid_near_switch_cycle / num_matches;
        tot_pyramid_far_switch_cycles = rows[0].tot_tele_pyramid_far_switch_cycle / num_matches;
        tot_pyramid_exchange_cycles = rows[0].tot_tele_pyramid_exchange_cycle / num_matches;
        tot_unprotected_scale_cycles = rows[0].tot_tele_unprotected_scale_cycle / num_matches;
        tot_unprotected_near_switch_cycles = rows[0].tot_tele_unprotected_near_switch_cycle / num_matches;
        tot_unprotected_far_switch_cycles = rows[0].tot_tele_unprotected_far_switch_cycle / num_matches;
        tot_unprotected_exchange_cycles = rows[0].tot_tele_unprotected_exchange_cycle / num_matches;
        tot_portal_scale_cycles = rows[0].tot_tele_portal_scale_cycle / num_matches;
        tot_portal_near_switch_cycles = rows[0].tot_tele_portal_near_switch_cycle / num_matches;
        tot_portal_far_switch_cycles = rows[0].tot_tele_portal_far_switch_cycle / num_matches;
        tot_portal_exchange_cycles = rows[0].tot_tele_portal_exchange_cycle / num_matches;
        tot_floor_scale_cycles = rows[0].tot_tele_floor_scale_cycle / num_matches;
        tot_floor_near_switch_cycles = rows[0].tot_tele_floor_near_switch_cycle / num_matches;
        tot_floor_far_switch_cycles = rows[0].tot_tele_floor_far_switch_cycle / num_matches;
        tot_floor_exchange_cycles = rows[0].tot_tele_floor_exchange_cycle / num_matches;
        max_pyramid_scale_cycles = rows[0].max_tele_pyramid_scale_cycle;
        max_pyramid_near_switch_cycles = rows[0].max_tele_pyramid_near_switch_cycle;
        max_pyramid_far_switch_cycles = rows[0].max_tele_pyramid_far_switch_cycle;
        max_pyramid_exchange_cycles = rows[0].max_tele_pyramid_exchange_cycle;
        max_unprotected_scale_cycles = rows[0].max_tele_unprotected_scale_cycle;
        max_unprotected_near_switch_cycles = rows[0].max_tele_unprotected_near_switch_cycle;
        max_unprotected_far_switch_cycles = rows[0].max_tele_unprotected_far_switch_cycle;
        max_unprotected_exchange_cycles = rows[0].max_tele_unprotected_exchange_cycle;
        max_portal_scale_cycles = rows[0].max_tele_portal_scale_cycle;
        max_portal_near_switch_cycles = rows[0].max_tele_portal_near_switch_cycle;
        max_portal_far_switch_cycles = rows[0].max_tele_portal_far_switch_cycle;
        max_portal_exchange_cycles = rows[0].max_tele_portal_exchange_cycle;
        max_floor_scale_cycles = rows[0].max_tele_floor_scale_cycle;
        max_floor_near_switch_cycles = rows[0].max_tele_floor_near_switch_cycle;
        max_floor_far_switch_cycles = rows[0].max_tele_floor_far_switch_cycle;
        max_floor_exchange_cycles = rows[0].max_tele_floor_exchange_cycle;
      }
    });
    /*var no_auto_sql = "SELECT * FROM matches WHERE team_num='"+ team_num +"'";
    connection.query(no_auto_sql, function(err, rows, fields) {
      for(var x in rows)
      {
        if(rows[x].auto_high_made == 0 && rows[x].auto_high_missed == 0 && rows[x].auto_low_made == 0
          && rows[x].auto_low_missed == 0 && rows[x].baseline_cross == 0 && rows[x].auto_hopper_intake == 0
          && rows[x].auto_gears_scored == 0 && rows[x].auto_gears_missed == 0)
        {
          no_autos++;
        }
      }
    });*/

    var last_team;
    var first_team;
    var get_last_team_sql = "SELECT team_num FROM teams ORDER BY team_num DESC";
    var get_first_team_sql = "SELECT team_num FROM teams";
    connectionLocal.query(get_last_team_sql, function(err, rows, fields) {
        last_team = rows[0].team_num;
    });
    connectionLocal.query(get_first_team_sql, function(err, rows, fields) {
      first_team = rows[0].team_num;
    });

    connectionLocal.query(next_team, function(err, rows, fields) {
      if(team_num == last_team)
        next_team_num = first_team;
      else
        next_team_num = rows[0].team_num;
    });

    connectionLocal.query(previous_team, function(err, rows, fields) {
      if(team_num == first_team)
        previous_team_num = last_team;
      else
        previous_team_num = rows[0].team_num;
    });

    connectionLocal.query(get_graph_data, function(err, rows, fields){
      for(var x in rows)
      {
        pyramid_intake_trend += rows[x].tele_pyramid_intake + ", ";
        unprotected_intake_trend += rows[x].tele_unprotected_intake + ", ";
        portal_intake_trend += rows[x].tele_portal_intake_made + ", ";
        floor_intake_trend += rows[x].tele_floor_intake + ", ";
        total_intake_trend += Number(rows[x].tele_pyramid_intake + rows[x].tele_unprotected_intake + rows[x].tele_portal_intake_made + rows[x].tele_floor_intake) + ", ";
        near_switch_cubes_trend += rows[x].tele_near_switch_made + ", ";
        far_switch_cubes_trend += rows[x].tele_far_switch_made + ", ";
        scale_high_cubes_trend += rows[x].tele_scale_high_made + ", ";
        scale_low_cubes_trend += rows[x].tele_scale_low_made + ", ";
        exchange_cubes_trend += rows[x].tele_exchange_made + ", ";
        cubes_descored_trend += Number(rows[x].tele_scale_high_missed+rows[x].tele_scale_low_missed) + ", ";
        total_cubes_trend += Number(rows[x].tele_near_switch_made + rows[x].tele_far_switch_made + rows[x].tele_scale_high_made + rows[x].tele_scale_low_made + rows[x].tele_exchange_made) + ", ";
        trend_labels += rows[x].match_num + ", ";
        
        if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_made > 0) tot_auto_left_switch_made += rows[x].auto_near_switch_made;
        if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_left_scale_made += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
        if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_made > 0) tot_auto_center_switch_made += rows[x].auto_near_switch_made;
        if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_center_scale_made += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
        if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_made > 0) tot_auto_right_switch_made += rows[x].auto_near_switch_made;
        if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_made + rows[x].auto_scale_low_made > 0) tot_auto_right_scale_made += rows[x].auto_scale_high_made + rows[x].auto_scale_low_made;
        if(rows[x].auto_position === 'Left' && rows[x].auto_near_switch_missed > 0) tot_auto_left_switch_missed += rows[x].auto_near_switch_missed;
        if(rows[x].auto_position === 'Left' && rows[x].auto_scale_high_missec + rows[x].auto_scale_low_missed > 0) tot_auto_left_scale_missed += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
        if(rows[x].auto_position === 'Center' && rows[x].auto_near_switch_missed > 0) tot_auto_center_switch_missed += rows[x].auto_near_switch_missed;
        if(rows[x].auto_position === 'Center' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_center_scale_missed += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
        if(rows[x].auto_position === 'Right' && rows[x].auto_near_switch_missed > 0) tot_auto_right_switch_missed += rows[x].auto_near_switch_missed;
        if(rows[x].auto_position === 'Right' && rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed > 0) tot_auto_right_scale_missed += rows[x].auto_scale_high_missed + rows[x].auto_scale_low_missed;
        auto_made_trend = tot_auto_left_switch_made + ", " + tot_auto_left_scale_made + ", " + tot_auto_center_switch_made + ", " + tot_auto_center_scale_made + ", " + tot_auto_right_switch_made + ", " + tot_auto_right_scale_made;
        auto_missed_trend = tot_auto_left_switch_missed + ", " + tot_auto_left_scale_missed + ", " + tot_auto_center_switch_missed + ", " + tot_auto_center_scale_missed + ", " + tot_auto_right_switch_missed + ", " + tot_auto_right_scale_missed;
      }

      if(skip_render) {
        res.redirect("/");
      }
      else {
        res.render('pages/team', {
          req: req,
          team_num: team_num,
          team_name: team_name,
          previous_team_num: previous_team_num,
          next_team_num: next_team_num,
          num_matches: num_matches,
          tot_auto_cross: tot_auto_cross,
          tot_auto_left: tot_auto_left,
          tot_auto_center: tot_auto_center,
          tot_auto_right: tot_auto_right,
          tot_auto_pyramid_intake: tot_auto_pyramid_intake,
          tot_auto_unprotected_intake: tot_auto_unprotected_intake,
          tot_auto_near_switch_made: tot_auto_near_switch_made,
          tot_auto_near_switch_attempts: tot_auto_near_switch_attempts,
          tot_auto_exchange_made: tot_auto_exchange_made,
          tot_auto_exchange_attempts: tot_auto_exchange_attempts,
          tot_auto_scale_high_made: tot_auto_scale_high_made,
          tot_auto_scale_high_attempts: tot_auto_scale_high_attempts,
          tot_auto_scale_low_made: tot_auto_scale_low_made,
          tot_auto_scale_low_attempts: tot_auto_scale_low_attempts,
          avg_tele_cubes_scored: avg_tele_cubes_scored,
          max_tele_cubes_scored: max_tele_cubes_scored,
          avg_tele_exchange_made: avg_tele_exchange_made,
          avg_tele_exchange_attempts: avg_tele_exchange_attempts,
          avg_tele_near_switch_made: avg_tele_near_switch_made,
          avg_tele_near_switch_attempts: avg_tele_near_switch_attempts,
          avg_tele_far_switch_made: avg_tele_far_switch_made,
          avg_tele_far_switch_attempts: avg_tele_far_switch_attempts,
          avg_tele_scale_high_made: avg_tele_scale_high_made,
          avg_tele_scale_high_attempts: avg_tele_scale_high_attempts,
          avg_tele_scale_high_missed: avg_tele_scale_high_missed,
          avg_tele_scale_low_made: avg_tele_scale_low_made,
          avg_tele_scale_low_attempts: avg_tele_scale_low_attempts,
          avg_tele_scale_low_missed: avg_tele_scale_low_missed,
          avg_tele_knockouts: avg_tele_knockouts,
          avg_tele_cubes_dropped: avg_tele_cubes_dropped,
          avg_tele_intake: avg_tele_intake,
          max_tele_intake: max_tele_intake,
          avg_tele_portal_intake_made: avg_tele_portal_intake_made,
          avg_tele_portal_intake_attempts: avg_tele_portal_intake_attempts,
          avg_tele_pyramid_intake: avg_tele_pyramid_intake,
          avg_tele_unprotected_intake: avg_tele_unprotected_intake,
          avg_tele_floor_intake: avg_tele_floor_intake,
          tot_tele_orderly: tot_tele_orderly,
          max_tele_highest_level: max_tele_highest_level,
          frq_tele_highest_level: frq_tele_highest_level,
          tot_tele_climb: tot_tele_climb,
          tot_tele_climb_attempts: tot_tele_climb_attempts,
          tot_tele_climb_assisted: tot_tele_climb_assisted,
          tot_tele_platform: tot_tele_platform,
          tot_tele_plus_one: tot_tele_plus_one,
          tot_tele_plus_one_attempts: tot_tele_plus_one_attempts,
          tot_tele_plus_two: tot_tele_plus_two,
          tot_tele_plus_two_attempts: tot_tele_plus_two_attempts,
          avg_driver_rating: avg_driver_rating,
          avg_defense_rating: avg_defense_rating,

          pyramid_intake_trend: pyramid_intake_trend,
          unprotected_intake_trend: unprotected_intake_trend,
          portal_intake_trend: portal_intake_trend,
          floor_intake_trend: floor_intake_trend,
          total_intake_trend: total_intake_trend,
          near_switch_cubes_trend: near_switch_cubes_trend,
          far_switch_cubes_trend: far_switch_cubes_trend,
          scale_high_cubes_trend: scale_high_cubes_trend,
          scale_low_cubes_trend: scale_low_cubes_trend,
          exchange_cubes_trend: exchange_cubes_trend,
          cubes_descored_trend: cubes_descored_trend,
          total_cubes_trend: total_cubes_trend,
          pyramid_radar_trend: pyramid_radar_trend,
          portal_radar_trend: portal_radar_trend,
          floor_radar_trend: floor_radar_trend,
          unprotected_radar_trend: unprotected_radar_trend,
          avg_pyramid_scale_cycles: avg_pyramid_scale_cycles,
          avg_pyramid_near_switch_cycles: avg_pyramid_near_switch_cycles,
          avg_pyramid_far_switch_cycles: avg_pyramid_far_switch_cycles,
          avg_pyramid_exchange_cycles: avg_pyramid_exchange_cycles,
          avg_unprotected_scale_cycles: avg_unprotected_scale_cycles,
          avg_unprotected_near_switch_cycles: avg_unprotected_near_switch_cycles,
          avg_unprotected_far_switch_cycles: avg_unprotected_far_switch_cycles,
          avg_unprotected_exchange_cycles: avg_unprotected_exchange_cycles,
          avg_portal_scale_cycles: avg_portal_scale_cycles,
          avg_portal_near_switch_cycles: avg_portal_near_switch_cycles,
          avg_portal_far_switch_cycles: avg_portal_far_switch_cycles,
          avg_portal_exchange_cycles: avg_portal_exchange_cycles,
          avg_floor_scale_cycles: avg_floor_scale_cycles,
          avg_floor_near_switch_cycles: avg_floor_near_switch_cycles,
          avg_floor_far_switch_cycles: avg_floor_far_switch_cycles,
          avg_floor_exchange_cycles: avg_floor_exchange_cycles,
          tot_pyramid_scale_cycles: tot_pyramid_scale_cycles,
          tot_pyramid_near_switch_cycles: tot_pyramid_near_switch_cycles,
          tot_pyramid_far_switch_cycles: tot_pyramid_far_switch_cycles,
          tot_pyramid_exchange_cycles: tot_pyramid_exchange_cycles,
          tot_unprotected_scale_cycles: tot_unprotected_scale_cycles,
          tot_unprotected_near_switch_cycles: tot_unprotected_near_switch_cycles,
          tot_unprotected_far_switch_cycles: tot_unprotected_far_switch_cycles,
          tot_unprotected_exchange_cycles: tot_unprotected_exchange_cycles,
          tot_portal_scale_cycles: tot_portal_scale_cycles,
          tot_portal_near_switch_cycles: tot_portal_near_switch_cycles,
          tot_portal_far_switch_cycles: tot_portal_far_switch_cycles,
          tot_portal_exchange_cycles: tot_portal_exchange_cycles,
          tot_floor_scale_cycles: tot_floor_scale_cycles,
          tot_floor_near_switch_cycles: tot_floor_near_switch_cycles,
          tot_floor_far_switch_cycles: tot_floor_far_switch_cycles,
          tot_floor_exchange_cycles: tot_floor_exchange_cycles,
          max_pyramid_scale_cycles: max_pyramid_scale_cycles,
          max_pyramid_near_switch_cycles: max_pyramid_near_switch_cycles,
          max_pyramid_far_switch_cycles: max_pyramid_far_switch_cycles,
          max_pyramid_exchange_cycles: max_pyramid_exchange_cycles,
          max_unprotected_scale_cycles: max_unprotected_scale_cycles,
          max_unprotected_near_switch_cycles: max_unprotected_near_switch_cycles,
          max_unprotected_far_switch_cycles: max_unprotected_far_switch_cycles,
          max_unprotected_exchange_cycles: max_unprotected_exchange_cycles,
          max_portal_scale_cycles: max_portal_scale_cycles,
          max_portal_near_switch_cycles: max_portal_near_switch_cycles,
          max_portal_far_switch_cycles: max_portal_far_switch_cycles,
          max_portal_exchange_cycles: max_portal_exchange_cycles,
          max_floor_scale_cycles: max_floor_scale_cycles,
          max_floor_near_switch_cycles: max_floor_near_switch_cycles,
          max_floor_far_switch_cycles: max_floor_far_switch_cycles,
          max_floor_exchange_cycles: max_floor_exchange_cycles,
          auto_made_trend: auto_made_trend,
          auto_missed_trend: auto_missed_trend,
          trend_labels: trend_labels
        });
      }
    });
  });

  router.get('/data-entry', function(req, res) {
    var display_entry = "";
    if(most_recent == -1)
      display_entry = '<div class="alert alert-danger" role="alert"><p><b>Oh snap</b>, looks like this is a duplicate entry. Data not queried.</p></div>';
    else if(most_recent != -1 && most_recent != 0)
      display_entry = "<div class=\"alert alert-success\" role=\"alert\"><p>Data for <b>"+ most_recent +"</b> has been <b>successfully</b> entered. <b>" + num_matches + " teams</b> have been entered for <b>match #" + most_recent_match + ".</b></p></div>";


    res.render('pages/data_entry', {
      req: req,
      message: display_entry
    });
  });

  router.post('/parse-data', function(req, res) {
    var team_num = Number(req.body.team_num);
    var match_num = Number(req.body.match_num);

    var auto_position = req.body.auto_position;
    var auto_cross = Number(req.body.auto_cross);
    var auto_pyramid_intake = Number(req.body.auto_pyramid_intake);
    var auto_unprotected_intake = Number(req.body.auto_unprotected_intake);
    var auto_near_switch_made = Number(req.body.auto_near_switch_made);
    var auto_near_switch_missed = Number(req.body.auto_near_switch_missed);
    var auto_scale_high_made = Number(req.body.auto_scale_high_made);
    var auto_scale_high_missed = Number(req.body.auto_scale_high_missed);
    var auto_scale_low_made = 0;
    var auto_scale_low_missed = 0;
    var auto_exchange_made = Number(req.body.auto_exchange_made);
    var auto_exchange_missed = Number(req.body.auto_exchange_missed);
    var tele_floor_intake = Number(req.body.tele_floor_intake);
    var tele_portal_intake_made = Number(req.body.tele_portal_intake_made);
    var tele_portal_intake_missed = Number(req.body.tele_portal_intake_missed);
    var tele_pyramid_intake = Number(req.body.tele_pyramid_intake);
    var tele_unprotected_intake = Number(req.body.tele_unprotected_intake);
    var tele_exchange_made = Number(req.body.tele_exchange_made);
    var tele_exchange_missed = Number(req.body.tele_exchange_missed);
    var tele_scale_high_made = Number(req.body.tele_scale_high_made);
    var tele_scale_high_missed = Number(req.body.tele_scale_high_missed);
    var tele_scale_low_made = Number(req.body.tele_scale_low_made);
    var tele_scale_low_missed = Number(req.body.tele_scale_low_missed);
    var tele_far_switch_made = Number(req.body.tele_far_switch_made);
    var tele_far_switch_missed = Number(req.body.tele_far_switch_missed);
    var tele_near_switch_made = Number(req.body.tele_near_switch_made);
    var tele_near_switch_missed = Number(req.body.tele_near_switch_missed);
    var tele_knockouts = Number(req.body.tele_knockouts);
    var tele_cubes_descored = 0;
    var tele_cubes_dropped = 0;
    var tele_highest_level = Number(req.body.tele_highest_level);
    var tele_orderly = 0;
    var tele_climb = Number(req.body.tele_climb);
    var tele_climb_failed = Number(req.body.tele_climb_failed);
    var tele_plus_one = Number(req.body.tele_plus_one);
    var tele_plus_one_failed = Number(req.body.tele_plus_one_failed);
    var tele_plus_two = Number(req.body.tele_plus_two);
    var tele_plus_two_failed = Number(req.body.tele_plus_two_failed);
    var tele_climb_assisted = Number(req.body.tele_climb_assisted);
    var tele_platform = Number(req.body.tele_platform);
    var avg_tele_pyramid_scale_cycle = Number(req.body.tele_pyramid_scale_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_pyramid_near_switch_cycle = Number(req.body.tele_pyramid_near_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_pyramid_far_switch_cycle = Number(req.body.tele_pyramid_far_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_pyramid_exchange_cycle = Number(req.body.tele_pyramid_exchange_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_unprotected_scale_cycle = Number(req.body.tele_unprotected_scale_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_unprotected_near_switch_cycle = Number(req.body.tele_unprotected_near_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_unprotected_far_switch_cycle = Number(req.body.tele_unprotected_far_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_unprotected_exchange_cycle = Number(req.body.tele_unprotected_exchange_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_portal_scale_cycle = Number(req.body.tele_portal_scale_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_portal_near_switch_cycle = Number(req.body.tele_portal_near_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_portal_far_switch_cycle = Number(req.body.tele_portal_far_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_portal_exchange_cycle = Number(req.body.tele_portal_exchange_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_floor_scale_cycle = Number(req.body.tele_floor_scale_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_floor_near_switch_cycle = Number(req.body.tele_floor_near_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_floor_far_switch_cycle = Number(req.body.tele_floor_far_switch_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var avg_tele_floor_exchange_cycle = Number(req.body.tele_floor_exchange_cycle.split(",").reduce(function(p,c,i){return p+(c-p)/(i+1)},0));
    var tot_tele_pyramid_scale_cycle = Number(req.body.tele_pyramid_scale_cycle.split(",").length);
    if(avg_tele_pyramid_scale_cycle === 0) tot_tele_pyramid_scale_cycle = 0;
    var tot_tele_pyramid_near_switch_cycle = Number(req.body.tele_pyramid_near_switch_cycle.split(",").length);
    if(avg_tele_pyramid_near_switch_cycle === 0) tot_tele_pyramid_near_switch_cycle = 0;
    var tot_tele_pyramid_far_switch_cycle = Number(req.body.tele_pyramid_far_switch_cycle.split(",").length);
    if(avg_tele_pyramid_far_switch_cycle === 0) tot_tele_pyramid_far_switch_cycle = 0;
    var tot_tele_pyramid_exchange_cycle = Number(req.body.tele_pyramid_exchange_cycle.split(",").length);
    if(avg_tele_pyramid_exchange_cycle === 0) tot_tele_pyramid_exchange_cycle = 0;
    var tot_tele_unprotected_scale_cycle = Number(req.body.tele_unprotected_scale_cycle.split(",").length);
    if(avg_tele_unprotected_scale_cycle === 0) tot_tele_unprotected_scale_cycle = 0;
    var tot_tele_unprotected_near_switch_cycle = Number(req.body.tele_unprotected_near_switch_cycle.split(",").length);
    if(avg_tele_unprotected_near_switch_cycle === 0) tot_tele_unprotected_near_switch_cycle = 0;
    var tot_tele_unprotected_far_switch_cycle = Number(req.body.tele_unprotected_far_switch_cycle.split(",").length);
    if(avg_tele_unprotected_far_switch_cycle === 0) tot_tele_unprotected_far_switch_cycle = 0;
    var tot_tele_unprotected_exchange_cycle = Number(req.body.tele_unprotected_exchange_cycle.split(",").length);
    if(avg_tele_unprotected_exchange_cycle === 0) tot_tele_unprotected_exchange_cycle = 0;
    var tot_tele_portal_scale_cycle = Number(req.body.tele_portal_scale_cycle.split(",").length);
    if(avg_tele_portal_scale_cycle === 0) tot_tele_portal_scale_cycle = 0;
    var tot_tele_portal_near_switch_cycle = Number(req.body.tele_portal_near_switch_cycle.split(",").length);
    if(avg_tele_portal_near_switch_cycle === 0) tot_tele_portal_near_switch_cycle = 0;
    var tot_tele_portal_far_switch_cycle = Number(req.body.tele_portal_far_switch_cycle.split(",").length);
    if(avg_tele_portal_far_switch_cycle === 0) tot_tele_portal_far_switch_cycle = 0;
    var tot_tele_portal_exchange_cycle = Number(req.body.tele_portal_exchange_cycle.split(",").length);
    if(avg_tele_portal_exchange_cycle === 0) tot_tele_portal_exchange_cycle = 0;
    var tot_tele_floor_scale_cycle = Number(req.body.tele_floor_scale_cycle.split(",").length);
    if(avg_tele_floor_scale_cycle === 0) tot_tele_floor_scale_cycle = 0;
    var tot_tele_floor_near_switch_cycle = Number(req.body.tele_floor_near_switch_cycle.split(",").length);
    if(avg_tele_floor_near_switch_cycle === 0) tot_tele_floor_near_switch_cycle = 0;
    var tot_tele_floor_far_switch_cycle = Number(req.body.tele_floor_far_switch_cycle.split(",").length);
    if(avg_tele_floor_far_switch_cycle === 0) tot_tele_floor_far_switch_cycle = 0;
    var tot_tele_floor_exchange_cycle = Number(req.body.tele_floor_exchange_cycle.split(",").length);
    if(avg_tele_floor_exchange_cycle === 0) tot_tele_floor_exchange_cycle = 0;
    var driver_rating = Number(req.body.driver_rating);
    var defense_rating = Number(req.body.defense_rating);

    var put_data_sql = "INSERT INTO `matches` (`match_num`, `team_num`, `auto_position`, `auto_cross`, `auto_pyramid_intake`, "
      + "`auto_unprotected_intake`, `auto_near_switch_made`, `auto_near_switch_missed`, `auto_scale_high_made`, `auto_scale_high_missed`, "
      + "`auto_scale_low_made`, `auto_scale_low_missed`, `auto_exchange_made`, `auto_exchange_missed`, `tele_floor_intake`, "
      + "`tele_portal_intake_made`, `tele_portal_intake_missed`, `tele_pyramid_intake`, `tele_unprotected_intake`, "
      + "`tele_exchange_made`, `tele_exchange_missed`, `tele_scale_high_made`, `tele_scale_high_missed`, `tele_scale_low_made`, "
      + "`tele_scale_low_missed`, `tele_near_switch_made`, `tele_near_switch_missed`, `tele_far_switch_made`, `tele_far_switch_missed`, "
      + "`tele_knockouts`, `tele_cubes_descored`, `tele_cubes_dropped`, `tele_highest_level`, `tele_orderly`, `tele_climb`, `tele_climb_failed`, "
      + "`tele_plus_one`, `tele_plus_one_failed`, `tele_plus_two`, `tele_plus_two_failed`, `tele_climb_assisted`, `tele_platform`, "
      + "`avg_tele_pyramid_scale_cycle`, `avg_tele_pyramid_near_switch_cycle`, `avg_tele_pyramid_far_switch_cycle`, `avg_tele_pyramid_exchange_cycle`, "
      + "`avg_tele_unprotected_scale_cycle`, `avg_tele_unprotected_near_switch_cycle`, `avg_tele_unprotected_far_switch_cycle`, `avg_tele_unprotected_exchange_cycle`, "
      + "`avg_tele_portal_scale_cycle`, `avg_tele_portal_near_switch_cycle`, `avg_tele_portal_far_switch_cycle`, `avg_tele_portal_exchange_cycle`, "
      + "`avg_tele_floor_scale_cycle`, `avg_tele_floor_near_switch_cycle`, `avg_tele_floor_far_switch_cycle`, `avg_tele_floor_exchange_cycle`, "
      + "`tot_tele_pyramid_scale_cycle`, `tot_tele_pyramid_near_switch_cycle`, `tot_tele_pyramid_far_switch_cycle`, `tot_tele_pyramid_exchange_cycle`, "
      + "`tot_tele_unprotected_scale_cycle`, `tot_tele_unprotected_near_switch_cycle`, `tot_tele_unprotected_far_switch_cycle`, `tot_tele_unprotected_exchange_cycle`, "
      + "`tot_tele_portal_scale_cycle`, `tot_tele_portal_near_switch_cycle`, `tot_tele_portal_far_switch_cycle`, `tot_tele_portal_exchange_cycle`, "
      + "`tot_tele_floor_scale_cycle`, `tot_tele_floor_near_switch_cycle`, `tot_tele_floor_far_switch_cycle`, `tot_tele_floor_exchange_cycle`, `driver_rating`, `defense_rating`) "
      + "VALUES (" + match_num + ", " + team_num + ", '" + auto_position + "', " + auto_cross + ", " + auto_pyramid_intake + ", " 
      + auto_unprotected_intake + ", " + auto_near_switch_made + ", " + auto_near_switch_missed + ", " + auto_scale_high_made + ", " 
      + auto_scale_high_missed + ", " + auto_scale_low_made + ", " + auto_scale_low_missed + ", " + auto_exchange_made + ", " 
      + auto_exchange_missed + ", " + tele_floor_intake + ", " + tele_portal_intake_made + ", " + tele_portal_intake_missed + ", " 
      + tele_pyramid_intake + ", " + tele_unprotected_intake + ", " + tele_exchange_made + ", " + tele_exchange_missed + ", " 
      + tele_scale_high_made + ", " + tele_scale_high_missed + ", " + tele_scale_low_made + ", " + tele_scale_low_missed + ", " 
      + tele_near_switch_made + ", " + tele_near_switch_missed + ", " + tele_far_switch_made + ", " + tele_far_switch_missed + ", " 
      + tele_knockouts + ", " + tele_cubes_descored + ", " + tele_cubes_dropped + ", " + tele_highest_level + ", " + tele_orderly + ", " + tele_climb + ", " 
      + tele_climb_failed + ", " + tele_plus_one + ", " + tele_plus_one_failed + ", " + tele_plus_two + ", " + tele_plus_two_failed + ", " 
      + tele_climb_assisted + ", " + tele_platform + ", " + avg_tele_pyramid_scale_cycle + ", " + avg_tele_pyramid_near_switch_cycle + ", " 
      + avg_tele_pyramid_far_switch_cycle + ", " + avg_tele_pyramid_exchange_cycle + ", " + avg_tele_unprotected_scale_cycle + ", " 
      + avg_tele_unprotected_near_switch_cycle + ", " + avg_tele_unprotected_far_switch_cycle + ", " + avg_tele_unprotected_exchange_cycle + ", " 
      + avg_tele_portal_scale_cycle + ", " + avg_tele_portal_near_switch_cycle + ", " + avg_tele_portal_far_switch_cycle + ", " 
      + avg_tele_portal_exchange_cycle + ", " + avg_tele_floor_scale_cycle + ", " + avg_tele_floor_near_switch_cycle + ", " 
      + avg_tele_floor_far_switch_cycle + ", " + avg_tele_floor_exchange_cycle + ", " + tot_tele_pyramid_scale_cycle + ", " 
      + tot_tele_pyramid_near_switch_cycle + ", " + tot_tele_pyramid_far_switch_cycle + ", " + tot_tele_pyramid_exchange_cycle + ", " 
      + tot_tele_unprotected_scale_cycle + ", " + tot_tele_unprotected_near_switch_cycle + ", " + tot_tele_unprotected_far_switch_cycle + ", " 
      + tot_tele_unprotected_exchange_cycle + ", " + tot_tele_portal_scale_cycle + ", " + tot_tele_portal_near_switch_cycle + ", " 
      + tot_tele_portal_far_switch_cycle + ", " + tot_tele_portal_exchange_cycle + ", " + tot_tele_floor_scale_cycle + ", " 
      + tot_tele_floor_near_switch_cycle + ", " + tot_tele_floor_far_switch_cycle + ", " + tot_tele_floor_exchange_cycle + ", " + driver_rating + ", " + defense_rating + ")";
    connectionLocal.query("SELECT * FROM matches WHERE match_num=" + match_num, function(err, rows) {
      num_matches = rows.length + 1 || 1;
      connectionLocal.query(put_data_sql, function(err) {
        if(err)
        {
          most_recent = -1;
          most_recent_match = -1;
          updateTeams(team_num);
          console.log(err);
        }
        else
        {
          most_recent = team_num;
          most_recent_match = match_num;
          updateTeams(team_num);
        }
        res.redirect('/data-entry');
      });
    });
  });

  function updateTeams(team_num) {
    var team_sql = "UPDATE teams SET num_matches=(SELECT COUNT(*) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_left=(SELECT COUNT(*) FROM matches WHERE auto_position=\"Left\" AND team_num=" + team_num + "), " +
    "tot_auto_center=(SELECT COUNT(*) FROM matches WHERE auto_position=\"Center\" AND team_num=" + team_num + "), " +
    "tot_auto_right=(SELECT COUNT(*) FROM matches WHERE auto_position=\"Right\" AND team_num=" + team_num + "), " +
    "tot_auto_cross=(SELECT SUM(auto_cross) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_auto_pyramid_intake=(SELECT SUM(auto_pyramid_intake) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_pyramid_intake=(SELECT AVG(auto_pyramid_intake) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_auto_unprotected_intake=(SELECT SUM(auto_unprotected_intake) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_unprotected_intake=(SELECT AVG(auto_unprotected_intake) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_auto_near_switch_made=100*(SELECT SUM(avg_auto_near_switch_made)/(SUM(auto_near_switch_missed)+SUM(auto_near_switch_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_near_switch_made=(SELECT SUM(avg_auto_near_switch_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_near_switch_attempts=(SELECT SUM(auto_near_switch_made)+SUM(auto_near_switch_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_near_switch_made=(SELECT AVG(auto_near_switch_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_near_switch_attempts=(SELECT AVG(auto_near_switch_made+auto_near_switch_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_auto_scale_high_made=100*(SELECT SUM(auto_scale_high_made)/(SUM(auto_scale_high_missed)+SUM(auto_scale_high_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_scale_high_made=(SELECT SUM(auto_scale_high_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_scale_high_attempts=(SELECT SUM(auto_scale_high_made)+SUM(auto_scale_high_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_scale_high_made=(SELECT AVG(auto_scale_high_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_scale_high_attempts=(SELECT AVG(auto_scale_high_made+auto_scale_high_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_auto_scale_low_made=100*(SELECT SUM(auto_scale_low_made)/(SUM(auto_scale_low_missed)+SUM(auto_scale_low_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_scale_low_made=(SELECT SUM(auto_scale_low_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_scale_low_attempts=(SELECT SUM(auto_scale_low_made)+SUM(auto_scale_low_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_scale_low_made=(SELECT AVG(auto_scale_low_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_scale_low_attempts=(SELECT AVG(auto_scale_low_made+auto_scale_low_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_auto_exchange_made=100*(SELECT SUM(auto_exchange_made)/(SUM(auto_exchange_missed)+SUM(auto_exchange_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_exchange_made=(SELECT SUM(auto_exchange_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_exchange_attempts=(SELECT SUM(auto_exchange_made)+SUM(auto_exchange_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_exchange_made=(SELECT AVG(auto_exchange_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_exchange_attempts=(SELECT AVG(auto_exchange_made+auto_exchange_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_tele_intake=(SELECT SUM(tele_floor_intake+tele_pyramid_intake+tele_unprotected_intake+tele_portal_intake_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_intake=(SELECT AVG(tele_floor_intake+tele_pyramid_intake+tele_unprotected_intake+tele_portal_intake_made) FROM matches WHERE team_num=" + team_num + "), " +
    "max_tele_intake=(SELECT (tele_floor_intake+tele_pyramid_intake+tele_unprotected_intake+tele_portal_intake_made) FROM matches WHERE team_num=" + team_num + " ORDER BY (tele_floor_intake+tele_pyramid_intake+tele_unprotected_intake+tele_portal_intake_made) DESC LIMIT 1), " +

    "tot_tele_floor_intake=(SELECT SUM(tele_floor_intake) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_floor_intake=(SELECT AVG(tele_floor_intake) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_tele_pyramid_intake=(SELECT SUM(tele_pyramid_intake) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_pyramid_intake=(SELECT AVG(tele_pyramid_intake) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_tele_unprotected_intake=(SELECT SUM(tele_unprotected_intake) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_unprotected_intake=(SELECT AVG(tele_unprotected_intake) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_portal_intake_made=100*(SELECT SUM(tele_portal_intake_made)/(SUM(tele_portal_intake_missed)+SUM(tele_portal_intake_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_portal_intake_made=(SELECT SUM(tele_portal_intake_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_portal_intake_attempts=(SELECT SUM(tele_portal_intake_made)+SUM(tele_portal_intake_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_portal_intake_made=(SELECT AVG(tele_portal_intake_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_portal_intake_attempts=(SELECT AVG(tele_portal_intake_made+tele_portal_intake_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_near_switch_made=100*(SELECT SUM(tele_near_switch_made)/(SUM(tele_near_switch_missed)+SUM(tele_near_switch_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_near_switch_made=(SELECT SUM(tele_near_switch_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_near_switch_attempts=(SELECT SUM(tele_near_switch_made)+SUM(tele_near_switch_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_near_switch_made=(SELECT AVG(tele_near_switch_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_near_switch_attempts=(SELECT AVG(tele_near_switch_made+tele_near_switch_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_far_switch_made=100*(SELECT SUM(tele_far_switch_made)/(SUM(tele_far_switch_missed)+SUM(tele_far_switch_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_far_switch_made=(SELECT SUM(tele_far_switch_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_far_switch_attempts=(SELECT SUM(tele_far_switch_made)+SUM(tele_far_switch_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_far_switch_made=(SELECT AVG(tele_far_switch_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_far_switch_attempts=(SELECT AVG(tele_far_switch_made+tele_far_switch_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_scale_high_made=100*(SELECT SUM(tele_scale_high_made)/(SUM(tele_scale_high_missed)+SUM(tele_scale_high_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_scale_high_made=(SELECT SUM(tele_scale_high_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_scale_high_attempts=(SELECT SUM(tele_scale_high_made)+SUM(tele_scale_high_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_scale_high_made=(SELECT AVG(tele_scale_high_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_scale_high_attempts=(SELECT AVG(tele_scale_high_made+tele_scale_high_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_scale_high_missed=(SELECT AVG(tele_scale_high_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_scale_low_made=100*(SELECT SUM(tele_scale_low_made)/(SUM(tele_scale_low_missed)+SUM(tele_scale_low_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_scale_low_made=(SELECT SUM(tele_scale_low_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_scale_low_attempts=(SELECT SUM(tele_scale_low_made)+SUM(tele_scale_low_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_scale_low_made=(SELECT AVG(tele_scale_low_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_scale_low_attempts=(SELECT AVG(tele_scale_low_made+tele_scale_low_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_scale_low_missed=(SELECT AVG(tele_scale_low_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_exchange_made=100*(SELECT SUM(tele_exchange_made)/(SUM(tele_exchange_missed)+SUM(tele_exchange_made)) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_exchange_made=(SELECT SUM(tele_exchange_made) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_exchange_attempts=(SELECT SUM(tele_exchange_made)+SUM(tele_exchange_missed) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_exchange_made=(SELECT AVG(tele_exchange_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_exchange_attempts=(SELECT AVG(tele_exchange_made+tele_exchange_missed) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_tele_cubes_scored=(SELECT SUM(tele_near_switch_made+tele_far_switch_made+tele_scale_high_made+tele_scale_low_made+tele_exchange_made) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_cubes_scored=(SELECT AVG(tele_near_switch_made+tele_far_switch_made+tele_scale_high_made+tele_scale_low_made+tele_exchange_made) FROM matches WHERE team_num=" + team_num + "), " +
    "max_tele_cubes_scored=(SELECT (tele_near_switch_made+tele_far_switch_made+tele_scale_high_made+tele_scale_low_made+tele_exchange_made) FROM matches WHERE team_num=" + team_num + " ORDER BY (tele_near_switch_made+tele_far_switch_made+tele_scale_high_made+tele_scale_low_made+tele_exchange_made) DESC LIMIT 1), " +

    "tot_tele_knockouts=(SELECT SUM(tele_knockouts) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_knockouts=(SELECT AVG(tele_knockouts) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_cubes_descored=(SELECT AVG(tele_cubes_descored) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_tele_cubes_dropped=(SELECT SUM(tele_cubes_dropped) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_cubes_dropped=(SELECT AVG(tele_cubes_dropped) FROM matches WHERE team_num=" + team_num + "), " +

    "max_tele_highest_level=(SELECT tele_highest_level FROM matches WHERE team_num=" + team_num + " ORDER BY tele_highest_level DESC LIMIT 1), " +
    "frq_tele_highest_level=(SELECT COUNT(*) FROM matches WHERE tele_highest_level=max_tele_highest_level AND max_tele_highest_level<>0 AND team_num=" + team_num + "), " +

    "tot_tele_orderly=(SELECT SUM(tele_orderly) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_tele_platform=(SELECT SUM(tele_platform) FROM matches WHERE team_num=" + team_num + "), " +
    "perc_tele_climb=100*((SELECT SUM(tele_climb) FROM matches WHERE team_num=" + team_num + ")/(SELECT SUM(tele_climb)+SUM(tele_climb_failed) FROM matches WHERE team_num=" + team_num + ")), " +
    "tot_tele_climb=(SELECT SUM(tele_climb) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_climb_attempts=(SELECT SUM(tele_climb+tele_climb_failed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_plus_one=100*((SELECT SUM(tele_plus_one) FROM matches WHERE team_num=" + team_num + ")/(SELECT SUM(tele_plus_one)+SUM(tele_plus_one_failed) FROM matches WHERE team_num=" + team_num + ")), " +
    "tot_tele_plus_one=(SELECT SUM(tele_plus_one) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_plus_one_attempts=(SELECT SUM(tele_plus_one+tele_plus_one_failed) FROM matches WHERE team_num=" + team_num + "), " +

    "perc_tele_plus_two=100*((SELECT SUM(tele_plus_two) FROM matches WHERE team_num=" + team_num + ")/(SELECT SUM(tele_plus_two)+SUM(tele_plus_two_failed) FROM matches WHERE team_num=" + team_num + ")), " +
    "tot_tele_plus_two=(SELECT SUM(tele_plus_two) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_plus_two_attempts=(SELECT SUM(tele_plus_two+tele_plus_two_failed) FROM matches WHERE team_num=" + team_num + "), " +

    "tot_tele_climb_assisted=(SELECT AVG(tele_climb_assisted) FROM matches WHERE team_num=" + team_num + "), " +

    "avg_tele_pyramid_scale_cycle=(SELECT AVG(avg_tele_pyramid_scale_cycle) FROM matches WHERE tot_tele_pyramid_scale_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_pyramid_near_switch_cycle=(SELECT AVG(avg_tele_pyramid_near_switch_cycle) FROM matches WHERE tot_tele_pyramid_near_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_pyramid_far_switch_cycle=(SELECT AVG(avg_tele_pyramid_far_switch_cycle) FROM matches WHERE tot_tele_pyramid_far_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_pyramid_exchange_cycle=(SELECT AVG(avg_tele_pyramid_exchange_cycle) FROM matches WHERE tot_tele_pyramid_exchange_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_unprotected_scale_cycle=(SELECT AVG(avg_tele_unprotected_scale_cycle) FROM matches WHERE tot_tele_unprotected_scale_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_unprotected_near_switch_cycle=(SELECT AVG(avg_tele_unprotected_near_switch_cycle) FROM matches WHERE tot_tele_unprotected_near_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_unprotected_far_switch_cycle=(SELECT AVG(avg_tele_unprotected_far_switch_cycle) FROM matches WHERE tot_tele_unprotected_far_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_unprotected_exchange_cycle=(SELECT AVG(avg_tele_unprotected_exchange_cycle) FROM matches WHERE tot_tele_unprotected_exchange_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_portal_scale_cycle=(SELECT AVG(avg_tele_portal_scale_cycle) FROM matches WHERE tot_tele_portal_scale_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_portal_near_switch_cycle=(SELECT AVG(avg_tele_portal_near_switch_cycle) FROM matches WHERE tot_tele_portal_near_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_portal_far_switch_cycle=(SELECT AVG(avg_tele_portal_far_switch_cycle) FROM matches WHERE tot_tele_portal_far_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_portal_exchange_cycle=(SELECT AVG(avg_tele_portal_exchange_cycle) FROM matches WHERE tot_tele_portal_exchange_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_floor_scale_cycle=(SELECT AVG(avg_tele_floor_scale_cycle) FROM matches WHERE tot_tele_floor_scale_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_floor_near_switch_cycle=(SELECT AVG(avg_tele_floor_near_switch_cycle) FROM matches WHERE tot_tele_floor_near_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_floor_far_switch_cycle=(SELECT AVG(avg_tele_floor_far_switch_cycle) FROM matches WHERE tot_tele_floor_far_switch_cycle<>0 AND team_num=" + team_num + "), " +
    "avg_tele_floor_exchange_cycle=(SELECT AVG(avg_tele_floor_exchange_cycle) FROM matches WHERE tot_tele_floor_exchange_cycle<>0 AND team_num=" + team_num + "), " +
    
    "tot_tele_pyramid_scale_cycle=(SELECT SUM(tot_tele_pyramid_scale_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_pyramid_near_switch_cycle=(SELECT SUM(tot_tele_pyramid_near_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_pyramid_far_switch_cycle=(SELECT SUM(tot_tele_pyramid_far_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_pyramid_exchange_cycle=(SELECT SUM(tot_tele_pyramid_exchange_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_unprotected_scale_cycle=(SELECT SUM(tot_tele_unprotected_scale_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_unprotected_near_switch_cycle=(SELECT SUM(tot_tele_unprotected_near_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_unprotected_far_switch_cycle=(SELECT SUM(tot_tele_unprotected_far_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_unprotected_exchange_cycle=(SELECT SUM(tot_tele_unprotected_exchange_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_portal_scale_cycle=(SELECT SUM(tot_tele_portal_scale_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_portal_near_switch_cycle=(SELECT SUM(tot_tele_portal_near_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_portal_far_switch_cycle=(SELECT SUM(tot_tele_portal_far_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_portal_exchange_cycle=(SELECT SUM(tot_tele_portal_exchange_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_floor_scale_cycle=(SELECT SUM(tot_tele_floor_scale_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_floor_near_switch_cycle=(SELECT SUM(tot_tele_floor_near_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_floor_far_switch_cycle=(SELECT SUM(tot_tele_floor_far_switch_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_floor_exchange_cycle=(SELECT SUM(tot_tele_floor_exchange_cycle) FROM matches WHERE team_num=" + team_num + "), " +
    
    "max_tele_pyramid_scale_cycle=(SELECT tot_tele_pyramid_scale_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_pyramid_scale_cycle DESC LIMIT 1), " +
    "max_tele_pyramid_near_switch_cycle=(SELECT tot_tele_pyramid_near_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_pyramid_near_switch_cycle DESC LIMIT 1), " +
    "max_tele_pyramid_far_switch_cycle=(SELECT tot_tele_pyramid_far_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_pyramid_far_switch_cycle DESC LIMIT 1), " +
    "max_tele_pyramid_exchange_cycle=(SELECT tot_tele_pyramid_exchange_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_pyramid_exchange_cycle DESC LIMIT 1), " +
    "max_tele_unprotected_scale_cycle=(SELECT tot_tele_unprotected_scale_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_unprotected_scale_cycle DESC LIMIT 1), " +
    "max_tele_unprotected_near_switch_cycle=(SELECT tot_tele_unprotected_near_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_unprotected_near_switch_cycle DESC LIMIT 1), " +
    "max_tele_unprotected_far_switch_cycle=(SELECT tot_tele_unprotected_far_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_unprotected_far_switch_cycle DESC LIMIT 1), " +
    "max_tele_unprotected_exchange_cycle=(SELECT tot_tele_unprotected_exchange_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_unprotected_exchange_cycle DESC LIMIT 1), " +
    "max_tele_portal_scale_cycle=(SELECT tot_tele_portal_scale_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_portal_scale_cycle DESC LIMIT 1), " +
    "max_tele_portal_near_switch_cycle=(SELECT tot_tele_portal_near_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_portal_near_switch_cycle DESC LIMIT 1), " +
    "max_tele_portal_far_switch_cycle=(SELECT tot_tele_portal_far_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_portal_far_switch_cycle DESC LIMIT 1), " +
    "max_tele_portal_exchange_cycle=(SELECT tot_tele_portal_exchange_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_portal_exchange_cycle DESC LIMIT 1), " +
    "max_tele_floor_scale_cycle=(SELECT tot_tele_floor_scale_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_floor_scale_cycle DESC LIMIT 1), " +
    "max_tele_floor_near_switch_cycle=(SELECT tot_tele_floor_near_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_floor_near_switch_cycle DESC LIMIT 1), " +
    "max_tele_floor_far_switch_cycle=(SELECT tot_tele_floor_far_switch_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_floor_far_switch_cycle DESC LIMIT 1), " +
    "max_tele_floor_exchange_cycle=(SELECT tot_tele_floor_exchange_cycle FROM matches WHERE team_num=" + team_num + " ORDER BY tot_tele_floor_exchange_cycle DESC LIMIT 1), " +
    
    "avg_driver_rating=(SELECT AVG(driver_rating) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_defense_rating=(SELECT AVG(defense_rating) FROM matches WHERE team_num=" + team_num + " AND defense_rating<>0), " +
    "alliance_rating=(avg_tele_cubes_scored+avg_tele_intake) " +

    "WHERE team_num=" + team_num;

    connectionLocal.query(team_sql, function(err) {
      if(err) console.log(err);
    });
  }
}

module.exports = REST_ROUTER;
