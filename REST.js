//where all the page connections happen and back-end javascript
var mysql = require("mysql");
var fs = require("fs");
var TBA = require('thebluealliance');
var tba = new TBA('FRCScout2018','Software for scouting for 2018 season','1.1.1');
var ensureLogin = require('connect-ensure-login');
var message = "";

function reqAdmin()
{
  return [
    ensureLogin.ensureLoggedIn('/login'),
    function(req, res, next) {
      if(req.user && req.user.admin == 1)
        next();
      else
      {
	       message = 'Higher permissions necessary to access page.';
         res.redirect('/login');
      }
    }
  ]
}

function REST_ROUTER(router, connectionLocal, connectionRemote, passport)
{
    var self = this;
    self.handleRoutes(router, connectionLocal, connectionRemote, passport);
}

REST_ROUTER.prototype.handleRoutes = function(router, connectionLocal, connectionRemote, passport)
{

  // var upload = require("multer")({dest: "public/images"});

  var most_recent = 0;
  var most_recent_match = 0;
  var num_matches = 0;
  var query_bool = 0;
  var query_res = "";

  var tele_gear_rank = [];
  var auto_gear_rank = [];
  var climb_rank = [];

  var variable_map = [];
  variable_map["Auto Gears Scored"] = "tot_auto_gears_scored";
  variable_map["Tele Gears Scored"] = "avg_tele_gears_scored";
  variable_map["Auto High Made"] = "avg_auto_high_made";
  variable_map["Tele High Made"] = "avg_tele_high_made";
  variable_map["Auto Low Made"] = "avg_auto_low_made";
  variable_map["Tele Low Made"] = "avg_tele_low_made";
  variable_map["Climb Percentage"] = "perc_climb";
  variable_map["Mobility Rating"] = "avg_mobility_rating";
  variable_map["Defense Rating"] = "avg_defense_rating";
  variable_map["Auto Contrib kPa"] = "avg_auto_contrib_kpa";
  variable_map["Contrib kPa"] = "avg_contrib_kpa";


  // index page
  router.get('/', ensureLogin.ensureLoggedIn('/login'), function(req, res) {       //PAGE RENDER
    var team_list = "";
    var score_list = "";
    var rating_list = "";
    var notes_query = "";

    var get_teams = "SELECT * FROM teams";
    //TEAM QUERY
    if(process.argv[2] && process.argv[2] === 'local')
    {
      connectionLocal.query(get_teams, function(err,rows,fields) {
        notes_query = "INSERT INTO notes (user, notes) VALUES ('" + req.user.username + "', '";
        for(var x in rows)
        {
          team_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].team_name +"</td></tr>";
  	      updateTeams(rows[x].team_num);
  	      notes_query += rows[x].team_num + "~~";
        }
        notes_query = notes_query.substring(0, notes_query.length - 1) + "');"
        // console.log(notes_query);
      });
      //CONTRIB SCORE QUERY
      var get_contrib_score_rank = "SELECT * FROM teams ORDER BY avg_tele_cubes_scored DESC, avg_tele_intake DESC, team_num ASC";
      connectionLocal.query(get_contrib_score_rank, function(err, rows, fields) {
        for(var x in rows)
        {
          score_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].avg_tele_cubes_scored +"</td><td>"+ rows[x].avg_tele_intake +"</td></tr>";
        }
      });

      connectionLocal.query("SELECT * FROM notes WHERE user='" + req.user.username + "'", function(err, rows) {
        if(!rows.length)
        {
          connectionLocal.query(notes_query, function(err) {
            if(err) console.log(err);
          });
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
    }
    else if(process.argv[2] && process.argv[2] === 'tee')
    {
      connectionLocal.query(get_teams, function(err,rows,fields) {
        notes_query = "INSERT INTO notes (user, notes) VALUES ('" + req.user.username + "', '";
        for(var x in rows)
        {
          team_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].team_name +"</td></tr>";
  	      updateTeams(rows[x].team_num);
  	      notes_query += rows[x].team_num + "~~";
        }
        notes_query = notes_query.substring(0, notes_query.length - 1) + "');"
        // console.log(notes_query);
      });
      //CONTRIB SCORE QUERY
      var get_contrib_score_rank = "SELECT * FROM teams ORDER BY avg_tele_cubes_scored DESC, avg_tele_intake DESC, team_num ASC";
      connectionLocal.query(get_contrib_score_rank, function(err, rows, fields) {
        for(var x in rows)
        {
          score_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].avg_tele_cubes_scored +"</td><td>"+ rows[x].avg_tele_intake +"</td></tr>";
        }
      });

      connectionLocal.query("SELECT * FROM notes WHERE user='" + req.user.username + "'", function(err, rows) {
        if(!rows.length)
        {
          connectionLocal.query(notes_query, function(err) {
            if(err) console.log(err);
          });
        }
      });

      var get_rating_rank = "SELECT * FROM teams ORDER BY alliance_rating DESC, team_num ASC";
      connectionLocal.query(get_rating_rank, function(err, rows) {
        // console.log(rows);
        for(var x in rows)
        {
          rating_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].alliance_rating + "</td></tr>";
        }
      });
      connectionRemote.query(get_teams, function(err,rows,fields) {
        notes_query = "INSERT INTO notes (user, notes) VALUES ('" + req.user.username + "', '";
        for(var x in rows)
        {
          team_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].team_name +"</td></tr>";
          updateTeams(rows[x].team_num);
          notes_query += rows[x].team_num + "~~";
        }
        notes_query = notes_query.substring(0, notes_query.length - 1) + "');"
        // console.log(notes_query);
      });
      //CONTRIB SCORE QUERY
      var get_contrib_score_rank = "SELECT * FROM teams ORDER BY avg_tele_cubes_scored DESC, avg_tele_intake DESC, team_num ASC";
      connectionRemote.query(get_contrib_score_rank, function(err, rows, fields) {
        for(var x in rows)
        {
          score_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].avg_tele_cubes_scored +"</td><td>"+ rows[x].avg_tele_intake +"</td></tr>";
        }
      });

      connectionRemote.query("SELECT * FROM notes WHERE user='" + req.user.username + "'", function(err, rows) {
        if(!rows.length)
        {
          connectionRemote.query(notes_query, function(err) {
            if(err) console.log(err);
          });
        }
      });

      var get_rating_rank = "SELECT * FROM teams ORDER BY alliance_rating DESC, team_num ASC";
      connectionRemote.query(get_rating_rank, function(err, rows) {
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
    }
    else
    {
      connectionRemote.query(get_teams, function(err,rows,fields) {
        notes_query = "INSERT INTO notes (user, notes) VALUES ('" + req.user.username + "', '";
        for(var x in rows)
        {
          team_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].team_name +"</td></tr>";
          updateTeams(rows[x].team_num);
          notes_query += rows[x].team_num + "~~";
        }
        notes_query = notes_query.substring(0, notes_query.length - 1) + "');"
        // console.log(notes_query);
      });
      //CONTRIB SCORE QUERY
      var get_contrib_score_rank = "SELECT * FROM teams ORDER BY avg_tele_cubes_scored DESC, avg_tele_intake DESC, team_num ASC";
      connectionRemote.query(get_contrib_score_rank, function(err, rows, fields) {
        for(var x in rows)
        {
          score_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].avg_tele_cubes_scored +"</td><td>"+ rows[x].avg_tele_intake +"</td></tr>";
        }
      });

      connectionRemote.query("SELECT * FROM notes WHERE user='" + req.user.username + "'", function(err, rows) {
        if(!rows.length)
        {
          connectionRemote.query(notes_query, function(err) {
            if(err) console.log(err);
          });
        }
      });

      var get_rating_rank = "SELECT * FROM teams ORDER BY alliance_rating DESC, team_num ASC";
      connectionRemote.query(get_rating_rank, function(err, rows) {
        // console.log(rows);
        for(var x in rows)
        {
          rating_list += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ rows[x].team_num +"</td><td>"+ rows[x].alliance_rating + "</td></tr>";
        }
      });
      res.render('pages/index', {
        req: req,
        team_list: team_list,
        score_list: score_list,
        rating_list: rating_list
      });
    }
  });

  router.get("/login", function(req, res) {
    res.render("pages/login", { req: req, message: message });
    message = '';
  });

  router.post("/login", function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if(err) { return next(err); }
      if(!user) { return res.render('pages/login', { req: req, message: info.message }); }
      req.logIn(user, function(err) {
      	if(err) { return next(err); }
    	  return res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
  });

  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  router.get("/user", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    console.log(req.user);
    res.redirect("/");
  });

  router.get("/notes", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    var notes = [];
    var notes_ejs = "";
    var query = "SELECT * FROM notes WHERE user='" + req.user.username + "';";
    //console.log(query);
    if(process.argv[2])
    {
      connectionLocal.query(query, function(err, rows) {
        // console.log(rows);
        // console.log(rows.length);
        if(err) console.log(err);
        if(rows.length === 0) res.redirect("/");
        notes = rows[0].notes.split('~');
        //console.log(notes);
        for(var x = 0; x < notes.length; x += 2)
        {
          notes_ejs += "<tr><td>"+ notes[x] +"</td><td>"+ notes[x + 1] +"</td></tr>";
        }
        //console.log(notes_ejs);
        res.render("pages/notes", {
        	req: req,
        	notes: notes_ejs
        });
      });
    }
    else
    {
      connectionRemote.query(query, function(err, rows) {
        // console.log(rows);
        // console.log(rows.length);
        if(err) console.log(err);
        if(rows.length === 0) res.redirect("/");
        notes = rows[0].notes.split('~');
        //console.log(notes);
        for(var x = 0; x < notes.length; x += 2)
        {
          notes_ejs += "<tr><td>"+ notes[x] +"</td><td>"+ notes[x + 1] +"</td></tr>";
        }
        //console.log(notes_ejs);
        res.render("pages/notes", {
          req: req,
          notes: notes_ejs
        });
      });
    }
  });


  router.post("/notes", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    //console.log(req.body);
    var query = "UPDATE notes SET notes='" + req.body.notes + "' WHERE user='" + req.user.username + "'";
    if(process.argv[2] && process.argv[2] === 'local')
    {
      connectionLocal.query(query, function(err) {
        if(err) console.log("update " + err);
        var get_all = "SELECT * FROM notes WHERE user<>'admin'";
        connectionLocal.query(get_all, function(err, rows) {
          var notes, notes_split = [];
          // console.log(rows);
          for(var n in rows[0].notes.split("~"))
          {
            notes_split[n] = "";
          }
          for(var x in rows)
          {
            for(var y in (notes = rows[x].notes.split("~")))
            {
              if(!Number(notes_split[y].substring(0, notes_split[y].length - 2)))
              {
                // notes_split[y] += (notes[y].replace('\n', '') + ", ") || "";
                var foo = "";
                if((foo = notes[y].replace('\n', '')) && !((foo = notes[y].replace('\n', '')) === " "))
                {
                  foo = foo.replace("'", "''");
                  foo = foo.replace('"', '""');
                  // console.log(foo);
                  if(notes_split[y] && !Number(notes_split[y])) notes_split[y] += ", "
                  notes_split[y] += foo;
                }
                // if(Number(notes_split[y].substring(0, notes_split[y].length - 2))) notes_split[y] = notes_split[y].substring(0, notes_split[y].length - 2);
                // if(Number(notes_split[y].substring(2))) notes_split[y] = notes_split[y].substring(2);
              }
            }
            // notes += rows[x].notes;
          }
          // console.log(notes_split[notes_split.length - 1]);
          var csv = notes_split.join('~');
          // console.log(csv);
          var push_query = "UPDATE notes SET notes='" + csv + "' WHERE user='admin'";
          connectionLocal.query(push_query, function(err) {
            if(err) console.log("admin push " + err);
            res.redirect("/notes");
          });
          // notes_split = notes.split("`");
        });
      });
    }
    if(process.argv[2] && process.argv[2] === 'tee')
    {
      connectionLocal.query(query, function(err) {
        if(err) console.log("update " + err);
        var get_all = "SELECT * FROM notes WHERE user<>'admin'";
        connectionLocal.query(get_all, function(err, rows) {
          var notes, notes_split = [];
          // console.log(rows);
          for(var n in rows[0].notes.split("~"))
          {
            notes_split[n] = "";
          }
          for(var x in rows)
          {
            for(var y in (notes = rows[x].notes.split("~")))
            {
              if(!Number(notes_split[y].substring(0, notes_split[y].length - 2)))
              {
                // notes_split[y] += (notes[y].replace('\n', '') + ", ") || "";
                var foo = "";
                if((foo = notes[y].replace('\n', '')) && !((foo = notes[y].replace('\n', '')) === " "))
                {
                  foo = foo.replace("'", "''");
                  foo = foo.replace('"', '""');
                  // console.log(foo);
                  if(notes_split[y] && !Number(notes_split[y])) notes_split[y] += ", "
                  notes_split[y] += foo;
                }
                // if(Number(notes_split[y].substring(0, notes_split[y].length - 2))) notes_split[y] = notes_split[y].substring(0, notes_split[y].length - 2);
                // if(Number(notes_split[y].substring(2))) notes_split[y] = notes_split[y].substring(2);
              }
            }
            // notes += rows[x].notes;
          }
          // console.log(notes_split[notes_split.length - 1]);
          var csv = notes_split.join('~');
          // console.log(csv);
          var push_query = "UPDATE notes SET notes='" + csv + "' WHERE user='admin'";
          connectionLocal.query(push_query, function(err) {
            if(err) console.log("admin push " + err);
          });
          // notes_split = notes.split("`");
        });
      });
      connectionRemote.query(query, function(err) {
        if(err) console.log("update " + err);
        var get_all = "SELECT * FROM notes WHERE user<>'admin'";
        connectionRemote.query(get_all, function(err, rows) {
          var notes, notes_split = [];
          // console.log(rows);
          for(var n in rows[0].notes.split("~"))
          {
            notes_split[n] = "";
          }
          for(var x in rows)
          {
            for(var y in (notes = rows[x].notes.split("~")))
            {
              if(!Number(notes_split[y].substring(0, notes_split[y].length - 2)))
              {
                // notes_split[y] += (notes[y].replace('\n', '') + ", ") || "";
                var foo = "";
                if((foo = notes[y].replace('\n', '')) && !((foo = notes[y].replace('\n', '')) === " "))
                {
                  foo = foo.replace("'", "''");
                  foo = foo.replace('"', '""');
                  // console.log(foo);
                  if(notes_split[y] && !Number(notes_split[y])) notes_split[y] += ", "
                  notes_split[y] += foo;
                }
                // if(Number(notes_split[y].substring(0, notes_split[y].length - 2))) notes_split[y] = notes_split[y].substring(0, notes_split[y].length - 2);
                // if(Number(notes_split[y].substring(2))) notes_split[y] = notes_split[y].substring(2);
              }
            }
            // notes += rows[x].notes;
          }
          // console.log(notes_split[notes_split.length - 1]);
          var csv = notes_split.join('~');
          // console.log(csv);
          var push_query = "UPDATE notes SET notes='" + csv + "' WHERE user='admin'";
          connectionRemote.query(push_query, function(err) {
            if(err) console.log("admin push " + err);
            res.redirect("/notes");
          });
          // notes_split = notes.split("`");
        });
      });
    }
    else
    {
      connectionRemote.query(query, function(err) {
        if(err) console.log("update " + err);
        var get_all = "SELECT * FROM notes WHERE user<>'admin'";
        connectionRemote.query(get_all, function(err, rows) {
          var notes, notes_split = [];
          // console.log(rows);
          for(var n in rows[0].notes.split("~"))
          {
            notes_split[n] = "";
          }
          for(var x in rows)
          {
            for(var y in (notes = rows[x].notes.split("~")))
            {
              if(!Number(notes_split[y].substring(0, notes_split[y].length - 2)))
              {
                // notes_split[y] += (notes[y].replace('\n', '') + ", ") || "";
                var foo = "";
                if((foo = notes[y].replace('\n', '')) && !((foo = notes[y].replace('\n', '')) === " "))
                {
                  foo = foo.replace("'", "''");
                  foo = foo.replace('"', '""');
                  // console.log(foo);
                  if(notes_split[y] && !Number(notes_split[y])) notes_split[y] += ", "
                  notes_split[y] += foo;
                }
                // if(Number(notes_split[y].substring(0, notes_split[y].length - 2))) notes_split[y] = notes_split[y].substring(0, notes_split[y].length - 2);
                // if(Number(notes_split[y].substring(2))) notes_split[y] = notes_split[y].substring(2);
              }
            }
            // notes += rows[x].notes;
          }
          // console.log(notes_split[notes_split.length - 1]);
          var csv = notes_split.join('~');
          // console.log(csv);
          var push_query = "UPDATE notes SET notes='" + csv + "' WHERE user='admin'";
          connectionRemote.query(push_query, function(err) {
            if(err) console.log("admin push " + err);
            res.redirect("/notes");
          });
          // notes_split = notes.split("`");
        });
      });
    }
  });

  router.get("/sql", reqAdmin(), function(req, res) {
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
  router.post("/query", reqAdmin(), function(req, res) {
    var sql = JSON.stringify(req.body.query);
    query_res = "";
    if(process.argv[2] && process.argv[2] === 'local')
    {
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
    }
    if(process.argv[2] && process.argv[2] === 'tee')
    {
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
      });
      connectionRemote.query(sql, function(err, rows, fields) {
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
    }
    else
    {
      connectionRemote.query(sql, function(err, rows, fields) {
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
    }
  });
  router.get("/export", reqAdmin(), function(req, res) {
    var teams_sql = "SELECT * FROM teams";
    var filename = "teams.csv";
    var data = "";
    connection.query(teams_sql, function(err, rows, fields) {
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

  router.get("/pit-entry", reqAdmin(), function(req, res) {
    res.render("pages/pit_entry", { req: req });
  });

  router.post("/pit-parse", reqAdmin(), function(req, res) {
    var team_num = Number(req.body.team_num);
    var drive_type = JSON.stringify(req.body.drive_type);
    var weight = Number(req.body.weight);
    var filename = JSON.stringify(req.body.pic_filename);
    // console.log(req.file);
    // fs.createReadStream(filename).pipe(fs.createWriteStream(__dirname + "/public/images/" + filename));
    var insert_sql = "UPDATE teams SET drive_type=\"" + drive_type + "\", weight=" + weight + " WHERE team_num=" + team_num;
    connection.query(insert_sql, function(err) {
      res.redirect("/pit-entry");
    });
  })

  router.get("/stats-gen", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    res.render("pages/stats_gen", { req: req });
  });

  router.post("/stats_gen", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    var var_name_1 = req.body.var_name_1;
    var var_name_2 = req.body.var_name_2;
    res.redirect("/stats/" + var_name_1 + "," + var_name_2);
  });

  router.get("/stats/:var_name_1,:var_name_2", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    var var_name_1 = req.params.var_name_1;
    var var_name_2 = req.params.var_name_2;
    var rank_list_1 = "";
    var rank_list_2 = "";
    var rank_sql_1 = "SELECT * FROM teams ORDER BY " + variable_map[var_name_1] + " DESC, team_num ASC LIMIT 30";
    var rank_sql_2 = "SELECT * FROM teams ORDER BY " + variable_map[var_name_2] + " DESC, team_num ASC LIMIT 30";
    connection.query(rank_sql_1, function(err, rows) {
      for(var x in rows) {
        rank_list_1 += "<tr title='"+ rows[x].team_name +"' class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ Number(Number(x)+1) +"</td><td>"+ rows[x].team_num +"</td><td>"+ rows[x][variable_map[var_name_1]] +"</td></tr>";
      }
      connection.query(rank_sql_2, function(err, rows) {
        for(var x in rows) {
          rank_list_2 += "<tr title='"+ rows[x].team_name +"' class='clickable-row' data-href='/team/"+ rows[x].team_num +"'><td>"+ Number(Number(x)+1) +"</td><td>"+ rows[x].team_num +"</td><td>"+ rows[x][variable_map[var_name_2]] +"</td></tr>";
        }
        res.render("pages/stats", {
	  req: req,
          var_name_1: var_name_1,
          rank_list_1: rank_list_1,
          var_name_2: var_name_2,
          rank_list_2: rank_list_2
        });
      });
    });
  });

  router.get("/video/:match_number", function(req, res) {
    var match_number = req.params.match_number - 1;


  });

  router.get("/ppt", function(req, res) {
    var ppt_template = require("ppt-template");
    var Presentation = ppt_template.Presentation;

    var myPres = new Presentation();
    myPres.loadFile("C:/Users/Adam/Desktop/in.pptx")
    .then(() => {
      // console.log("Filed loaded");
      // console.log(myPres.getSlideCount());
      var slide1 = myPres.getSlide(1); // Index starts at 1 for some reason
      // console.log("cloned slide");
      slide1.fill([{
        key: "dd",
        value: "Not dd anymore!"
      }]);
      // console.log("returning now");
      var slides = [slide1];
      return myPres.generate(slides);
    }).then((newPres) => {
      // console.log("generated successfully");
      // console.log(newPres);
      newPres.saveAs("C:/Users/Adam/Desktop/out.pptx");
    });
  });

  router.get("/event", reqAdmin(), function(req, res) {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var date_str = "2018-" + month + "-" + day;
    var events = "";
    tba.getEventList(function(err, list_of_teams) {
      for(var x in list_of_teams) {
        var event_date = list_of_teams[x].start_date.split("-");
        // if((Number(event_date[1]) > Number(month)) || (Number(event_date[1]) == Number(month) && Number(event_date[2]) > Number(day))) {
          events += "<option>" + list_of_teams[x].event_code + "-" + list_of_teams[x].name + "</option>\n";
        // }
      }

      res.render("pages/event", {
	      req: req,
        events: events
      });
    });
  });

  router.post("/parse-event", reqAdmin(), function(req, res) {
    var event_code = req.body.event.split("-")[0];
    var teams = [];
    tba.getEventTeams(event_code, 2018, function(err, team_list) {
      var drop_teams_sql = "TRUNCATE teams; TRUNCATE matches; TRUNCATE notes; INSERT INTO notes (user, notes) VALUES ('admin', '');";
      if(process.argv[2] && process.argv[2] === 'local')
      {
        connectionLocal.query(drop_teams_sql, function(err) {
          if(err) {
            console.log(err);
          }

          for(var x in team_list) {
            var team_sql = "INSERT INTO teams (team_num, team_name) VALUES (" + team_list[x].team_number + ", \"" + team_list[x].nickname + "\")";
            connectionLocal.query(team_sql, function(err) {
              if(err)
              console.log(err);
            });
          }
          res.redirect("/");
        });
      }
      if(process.argv[2] && process.argv[2] === 'tee')
      {
        connectionLocal.query(drop_teams_sql, function(err) {
          if(err) {
            console.log(err);
          }

          for(var x in team_list) {
            var team_sql = "INSERT INTO teams (team_num, team_name) VALUES (" + team_list[x].team_number + ", \"" + team_list[x].nickname + "\")";
            connectionLocal.query(team_sql, function(err) {
              if(err)
              console.log(err);
            });
          }
        });
        connectionRemote.query(drop_teams_sql, function(err) {
          if(err) {
            console.log(err);
          }

          for(var x in team_list) {
            var team_sql = "INSERT INTO teams (team_num, team_name) VALUES (" + team_list[x].team_number + ", \"" + team_list[x].nickname + "\")";
            connectionRemote.query(team_sql, function(err) {
              if(err)
              console.log(err);
            });
          }
          res.redirect("/");
        });
      }
      else
      {
        connectionRemote.query(drop_teams_sql, function(err) {
          if(err) {
            console.log(err);
          }

          for(var x in team_list) {
            var team_sql = "INSERT INTO teams (team_num, team_name) VALUES (" + team_list[x].team_number + ", \"" + team_list[x].nickname + "\")";
            connectionRemote.query(team_sql, function(err) {
              if(err)
              console.log(err);
            });
          }
          res.redirect("/");
        });
      }
    });
  });


  router.get("/alliance-gen", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    res.render("pages/alliance_gen", { req: req });
  });

  router.post("/alliance-gen", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    var team_1 = Number(req.body.team_1);
    var team_2 = Number(req.body.team_2);
    var team_3 = Number(req.body.team_3);
    var team_4 = Number(req.body.team_4);
    var team_5 = Number(req.body.team_5);
    var team_6 = Number(req.body.team_6);
    // console.log(team_4 != "");
    // console.log(team_4 != "");
    // console.log(typeof team_6);
    if(team_4 == "")
      res.redirect("/alliance/" + team_1 + "," + team_2 + "," + team_3 + ",0,0,0");
    else if(team_5 == "")
      res.redirect("/alliance/" + team_1 + "," + team_2 + "," + team_3 + "," + team_4 + ",0,0");
    else if(team_6 == "")
      res.redirect("/alliance/" + team_1 + "," + team_2 + "," + team_3 + "," + team_4 + "," + team_5 + ",0");
    else
      res.redirect("/alliance/" + team_1 + "," + team_2 + "," + team_3 + "," + team_4 + "," + team_5 + "," + team_6);
  });

  router.get('/alliance/:team_1,:team_2,:team_3,:team_4,:team_5,:team_6', ensureLogin.ensureLoggedIn('/login'), function(req, res) {
		// console.log(req.params.team_1);
		// console.log(req.params.team_2);
		// console.log(req.params.team_3);

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
    var tot_tele_climb_1 = 0;
    var tot_tele_climb_attempts_1 = 0;
    var tot_tele_climb_assisted_1 = 0;
    var tot_tele_plus_one_1 = 0;
    var tot_tele_plus_one_attempts_1 = 0;
    var tot_tele_plus_two_1 = 0;
    var tot_tele_plus_two_attempts_1 = 0;
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
    var tot_tele_climb_2 = 0;
    var tot_tele_climb_attempts_2 = 0;
    var tot_tele_climb_assisted_2 = 0;
    var tot_tele_plus_one_2 = 0;
    var tot_tele_plus_one_attempts_2 = 0;
    var tot_tele_plus_two_2 = 0;
    var tot_tele_plus_two_attempts_2 = 0;
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
    var tot_tele_climb_3 = 0;
    var tot_tele_climb_attempts_3 = 0;
    var tot_tele_climb_assisted_3 = 0;
    var tot_tele_plus_one_3 = 0;
    var tot_tele_plus_one_attempts_3 = 0;
    var tot_tele_plus_two_3 = 0;
    var tot_tele_plus_two_attempts_3 = 0;
    var avg_driver_rating_3 = 0;
    var avg_defense_rating_3 = 0;

    var team_num_4 = !Number.isNaN(req.params.team_4) ? Number(req.params.team_4) : 0;
    var team_name_4 = "";
    var num_matches_4 = 0;
    var most_recent_match_4 = [];
    var tot_auto_cross_4 = 0;
    var tot_auto_left_4 = 0;
    var tot_auto_center_4 = 0;
    var tot_auto_right_4 = 0;
    var tot_auto_pyramid_intake_4 = 0;
    var tot_auto_unprotected_intake_4 = 0;
    var tot_auto_near_switch_made_4 = 0;
    var tot_auto_near_switch_attempts_4 = 0;
    var tot_auto_exchange_made_4 = 0;
    var tot_auto_exchange_attempts_4 = 0;
    var tot_auto_scale_high_made_4 = 0;
    var tot_auto_scale_high_attempts_4 = 0;
    var tot_auto_scale_low_made_4 = 0;
    var tot_auto_scale_low_attempts_4 = 0;
    var avg_tele_cubes_scored_4 = 0;
    var max_tele_cubes_scored_4 = 0;
    var avg_tele_exchange_made_4 = 0;
    var avg_tele_exchange_attempts_4 = 0;
    var avg_tele_near_switch_made_4 = 0;
    var avg_tele_near_switch_attempts_4 = 0;
    var avg_tele_far_switch_made_4 = 0;
    var avg_tele_far_switch_attempts_4 = 0;
    var avg_tele_scale_high_made_4 = 0;
    var avg_tele_scale_high_attempts_4 = 0;
    var avg_tele_scale_low_made_4 = 0;
    var avg_tele_scale_low_attempts_4 = 0;
    var avg_tele_knockouts_4 = 0;
    var avg_tele_cubes_dropped_4 = 0;
    var avg_tele_intake_4 = 0;
    var max_tele_intake_4 = 0;
    var avg_tele_portal_intake_made_4 = 0;
    var avg_tele_portal_intake_attempts_4 = 0;
    var avg_tele_pyramid_intake_4 = 0;
    var avg_tele_unprotected_intake_4 = 0;
    var avg_tele_floor_intake_4 = 0;
    var tot_tele_orderly_4 = 0;
    var max_tele_highest_level_4 = 0;
    var frq_tele_highest_level_4 = 0;
    var tot_tele_climb_4 = 0;
    var tot_tele_climb_attempts_4 = 0;
    var tot_tele_climb_assisted_4 = 0;
    var tot_tele_plus_one_4 = 0;
    var tot_tele_plus_one_attempts_4 = 0;
    var tot_tele_plus_two_4 = 0;
    var tot_tele_plus_two_attempts_4 = 0;
    var avg_driver_rating_4 = 0;
    var avg_defense_rating_4 = 0;

    var team_num_5 = !Number.isNaN(req.params.team_5) ? Number(req.params.team_5) : 0;
    var team_name_5 = "";
    var num_matches_5 = 0;
    var most_recent_match_5 = [];
    var tot_auto_cross_5 = 0;
    var tot_auto_left_5 = 0;
    var tot_auto_center_5 = 0;
    var tot_auto_right_5 = 0;
    var tot_auto_pyramid_intake_5 = 0;
    var tot_auto_unprotected_intake_5 = 0;
    var tot_auto_near_switch_made_5 = 0;
    var tot_auto_near_switch_attempts_5 = 0;
    var tot_auto_exchange_made_5 = 0;
    var tot_auto_exchange_attempts_5 = 0;
    var tot_auto_scale_high_made_5 = 0;
    var tot_auto_scale_high_attempts_5 = 0;
    var tot_auto_scale_low_made_5 = 0;
    var tot_auto_scale_low_attempts_5 = 0;
    var avg_tele_cubes_scored_5 = 0;
    var max_tele_cubes_scored_5 = 0;
    var avg_tele_exchange_made_5 = 0;
    var avg_tele_exchange_attempts_5 = 0;
    var avg_tele_near_switch_made_5 = 0;
    var avg_tele_near_switch_attempts_5 = 0;
    var avg_tele_far_switch_made_5 = 0;
    var avg_tele_far_switch_attempts_5 = 0;
    var avg_tele_scale_high_made_5 = 0;
    var avg_tele_scale_high_attempts_5 = 0;
    var avg_tele_scale_low_made_5 = 0;
    var avg_tele_scale_low_attempts_5 = 0;
    var avg_tele_knockouts_5 = 0;
    var avg_tele_cubes_dropped_5 = 0;
    var avg_tele_intake_5 = 0;
    var max_tele_intake_5 = 0;
    var avg_tele_portal_intake_made_5 = 0;
    var avg_tele_portal_intake_attempts_5 = 0;
    var avg_tele_pyramid_intake_5 = 0;
    var avg_tele_unprotected_intake_5 = 0;
    var avg_tele_floor_intake_5 = 0;
    var tot_tele_orderly_5 = 0;
    var max_tele_highest_level_5 = 0;
    var frq_tele_highest_level_5 = 0;
    var tot_tele_climb_5 = 0;
    var tot_tele_climb_attempts_5 = 0;
    var tot_tele_climb_assisted_5 = 0;
    var tot_tele_plus_one_5 = 0;
    var tot_tele_plus_one_attempts_5 = 0;
    var tot_tele_plus_two_5 = 0;
    var tot_tele_plus_two_attempts_5 = 0;
    var avg_driver_rating_5 = 0;
    var avg_defense_rating_5 = 0;

    var team_num_6 = !Number.isNaN(req.params.team_6) ? Number(req.params.team_6) : 0;
    var team_name_6 = "";
    var num_matches_6 = 0;
    var most_recent_match_6 = [];
    var tot_auto_cross_6 = 0;
    var tot_auto_left_6 = 0;
    var tot_auto_center_6 = 0;
    var tot_auto_right_6 = 0;
    var tot_auto_pyramid_intake_6 = 0;
    var tot_auto_unprotected_intake_6 = 0;
    var tot_auto_near_switch_made_6 = 0;
    var tot_auto_near_switch_attempts_6 = 0;
    var tot_auto_exchange_made_6 = 0;
    var tot_auto_exchange_attempts_6 = 0;
    var tot_auto_scale_high_made_6 = 0;
    var tot_auto_scale_high_attempts_6 = 0;
    var tot_auto_scale_low_made_6 = 0;
    var tot_auto_scale_low_attempts_6 = 0;
    var avg_tele_cubes_scored_6 = 0;
    var max_tele_cubes_scored_6 = 0;
    var avg_tele_exchange_made_6 = 0;
    var avg_tele_exchange_attempts_6 = 0;
    var avg_tele_near_switch_made_6 = 0;
    var avg_tele_near_switch_attempts_6 = 0;
    var avg_tele_far_switch_made_6 = 0;
    var avg_tele_far_switch_attempts_6 = 0;
    var avg_tele_scale_high_made_6 = 0;
    var avg_tele_scale_high_attempts_6 = 0;
    var avg_tele_scale_low_made_6 = 0;
    var avg_tele_scale_low_attempts_6 = 0;
    var avg_tele_knockouts_6 = 0;
    var avg_tele_cubes_dropped_6 = 0;
    var avg_tele_intake_6 = 0;
    var max_tele_intake_6 = 0;
    var avg_tele_portal_intake_made_6 = 0;
    var avg_tele_portal_intake_attempts_6 = 0;
    var avg_tele_pyramid_intake_6 = 0;
    var avg_tele_unprotected_intake_6 = 0;
    var avg_tele_floor_intake_6 = 0;
    var tot_tele_orderly_6 = 0;
    var max_tele_highest_level_6 = 0;
    var frq_tele_highest_level_6 = 0;
    var tot_tele_climb_6 = 0;
    var tot_tele_climb_attempts_6 = 0;
    var tot_tele_climb_assisted_6 = 0;
    var tot_tele_plus_one_6 = 0;
    var tot_tele_plus_one_attempts_6 = 0;
    var tot_tele_plus_two_6 = 0;
    var tot_tele_plus_two_attempts_6 = 0;
    var avg_driver_rating_6 = 0;
    var avg_defense_rating_6 = 0;


    if(process.argv[2])
    {
  		if(team_num_1 != 0 && team_num_2 != 0 && team_num_3 != 0)
  		{
        // updateContribScores(team_num_1);
  			// updateContribScores(team_num_2);
  			// updateContribScores(team_num_3);
        updateTeams(team_num_1);
  			updateTeams(team_num_2);
  			updateTeams(team_num_3);

  		//if(!isNaN(team_num_1))
  		//{
  			var get_data_1 = "SELECT * FROM teams WHERE team_num='"+ team_num_1 +"'";

  			connectionLocal.query(get_data_1, function(err, rows, fields) {
          // console.log(rows[0] != undefined);
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
          tot_tele_climb_1 = rows[0].tot_tele_climb;
          tot_tele_climb_attempts_1 = rows[0].tot_tele_climb_attempts;
          tot_tele_climb_assisted_1 = rows[0].tot_tele_climb_assisted;
          tot_tele_plus_one_1 = rows[0].tot_tele_plus_one;
          tot_tele_plus_one_attempts_1 = rows[0].tot_tele_plus_one_attempts;
          tot_tele_plus_two_1 = rows[0].tot_tele_plus_two;
          tot_tele_plus_two_attempts_1 = rows[0].tot_tele_plus_two_attempts;
          avg_driver_rating_1 = rows[0].avg_driver_rating;
          avg_defense_rating_1 = rows[0].avg_defense_rating;
  			});

        // var no_auto_sql_1 = "SELECT * FROM matches WHERE team_num='"+ team_num_1 +"'";
        // connection.query(no_auto_sql_1, function(err, rows, fields) {
        //   for(var x in rows)
        //   {
        //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
        //     {
        //       no_autos_1++;
        //     }
        //   }
  			// });
  		//}

  		//if(!isNaN(team_num_2))
  		//{
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
            tot_tele_climb_2 = rows[0].tot_tele_climb;
            tot_tele_climb_attempts_2 = rows[0].tot_tele_climb_attempts;
            tot_tele_climb_assisted_2 = rows[0].tot_tele_climb_assisted;
            tot_tele_plus_one_2 = rows[0].tot_tele_plus_one;
            tot_tele_plus_one_attempts_2 = rows[0].tot_tele_plus_one_attempts;
            tot_tele_plus_two_2 = rows[0].tot_tele_plus_two;
            tot_tele_plus_two_attempts_2 = rows[0].tot_tele_plus_two_attempts;
            avg_driver_rating_2 = rows[0].avg_driver_rating;
            avg_defense_rating_2 = rows[0].avg_defense_rating;
  				}
  			});

        // var no_auto_sql_2 = "SELECT * FROM matches WHERE team_num='"+ team_num_2 +"'";
        // connection.query(no_auto_sql_2, function(err, rows, fields) {
        //   for(var x in rows)
        //   {
        //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
        //     {
        //       no_autos_2++;
        //     }
        //   }
  			// });
  		//}

  			var get_data_3 = "SELECT * FROM teams WHERE team_num='"+ team_num_3 +"'";

  			connectionLocal.query(get_data_3, function(err, rows, fields) {
          // console.log(rows[0] != undefined);
  				if(rows[0] != undefined)
  				{
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
            tot_tele_climb_3 = rows[0].tot_tele_climb;
            tot_tele_climb_attempts_3 = rows[0].tot_tele_climb_attempts;
            tot_tele_climb_assisted_3 = rows[0].tot_tele_climb_assisted;
            tot_tele_plus_one_3 = rows[0].tot_tele_plus_one;
            tot_tele_plus_one_attempts_3 = rows[0].tot_tele_plus_one_attempts;
            tot_tele_plus_two_3 = rows[0].tot_tele_plus_two;
            tot_tele_plus_two_attempts_3 = rows[0].tot_tele_plus_two_attempts;
            avg_driver_rating_3 = rows[0].avg_driver_rating;
            avg_defense_rating_3 = rows[0].avg_defense_rating;
  				}

          // var no_auto_sql_3 = "SELECT * FROM matches WHERE team_num='"+ team_num_3 +"'";
          // connection.query(no_auto_sql_3, function(err, rows, fields) {
          //   for(var x in rows)
          //   {
          //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
          //     {
          //       no_autos_3++;
          //     }
          //   }
          // });
        });
      }

        if(team_num_4 != 0) {
          updateTeams(team_num_4);

          var get_data_4 = "SELECT * FROM teams WHERE team_num='"+ team_num_4 +"'";

    			connectionLocal.query(get_data_4, function(err, rows, fields) {
            // console.log(rows[0] != undefined);
            team_name_4 = rows[0].team_name;
            num_matches_4 = rows[0].num_matches;
            tot_auto_cross_4 = rows[0].tot_auto_cross;
            tot_auto_left_4 = rows[0].tot_auto_left;
            tot_auto_center_4 = rows[0].tot_auto_center;
            tot_auto_right_4 = rows[0].tot_auto_right;
            tot_auto_pyramid_intake_4 = rows[0].tot_auto_pyramid_intake;
            tot_auto_unprotected_intake_4 = rows[0].tot_auto_unprotected_intake;
            tot_auto_near_switch_made_4 = rows[0].tot_auto_near_switch_made;
            tot_auto_near_switch_attempts_4 = rows[0].tot_auto_near_switch_attempts;
            tot_auto_exchange_made_4 = rows[0].tot_auto_exchange_made;
            tot_auto_exchange_attempts_4 = rows[0].tot_auto_exchange_attempts;
            tot_auto_scale_high_made_4 = rows[0].tot_auto_scale_high_made;
            tot_auto_scale_high_attempts_4 = rows[0].tot_auto_scale_high_attempts;
            tot_auto_scale_low_made_4 = rows[0].tot_auto_scale_low_made;
            tot_auto_scale_low_attempts_4 = rows[0].tot_auto_scale_low_attempts;
            avg_tele_cubes_scored_4 = rows[0].avg_tele_cubes_scored;
            max_tele_cubes_scored_4 = rows[0].max_tele_cubes_scored;
            avg_tele_exchange_made_4 = rows[0].avg_tele_exchange_made;
            avg_tele_exchange_attempts_4 = rows[0].avg_tele_exchange_attempts;
            avg_tele_near_switch_made_4 = rows[0].avg_tele_near_switch_made;
            avg_tele_near_switch_attempts_4 = rows[0].avg_tele_near_switch_attempts;
            avg_tele_far_switch_made_4 = rows[0].avg_tele_far_switch_made;
            avg_tele_far_switch_attempts_4 = rows[0].avg_tele_far_switch_attempts;
            avg_tele_scale_high_made_4 = rows[0].avg_tele_scale_high_made;
            avg_tele_scale_high_attempts_4 = rows[0].avg_tele_scale_high_attempts;
            avg_tele_scale_low_made_4 = rows[0].avg_tele_scale_low_made;
            avg_tele_scale_low_attempts_4 = rows[0].avg_tele_scale_low_attempts;
            avg_tele_knockouts_4 = rows[0].avg_tele_knockouts;
            avg_tele_cubes_dropped_4 = rows[0].avg_tele_cubes_dropped;
            avg_tele_intake_4 = rows[0].avg_tele_intake;
            max_tele_intake_4 = rows[0].max_tele_intake;
            avg_tele_portal_intake_made_4 = rows[0].avg_tele_portal_intake_made;
            avg_tele_portal_intake_attempts_4 = rows[0].avg_tele_portal_intake_attempts;
            avg_tele_pyramid_intake_4 = rows[0].avg_tele_pyramid_intake;
            avg_tele_unprotected_intake_4 = rows[0].avg_tele_unprotected_intake;
            avg_tele_floor_intake_4 = rows[0].avg_tele_floor_intake;
            tot_tele_orderly_4 = rows[0].tot_tele_orderly;
            max_tele_highest_level_4 = rows[0].max_tele_highest_level;
            frq_tele_highest_level_4 = rows[0].frq_tele_highest_level;
            tot_tele_climb_4 = rows[0].tot_tele_climb;
            tot_tele_climb_attempts_4 = rows[0].tot_tele_climb_attempts;
            tot_tele_climb_assisted_4 = rows[0].tot_tele_climb_assisted;
            tot_tele_plus_one_4 = rows[0].tot_tele_plus_one;
            tot_tele_plus_one_attempts_4 = rows[0].tot_tele_plus_one_attempts;
            tot_tele_plus_two_4 = rows[0].tot_tele_plus_two;
            tot_tele_plus_two_attempts_4 = rows[0].tot_tele_plus_two_attempts;
            avg_driver_rating_4 = rows[0].avg_driver_rating;
            avg_defense_rating_4 = rows[0].avg_defense_rating;
    			});

          // var no_auto_sql_4 = "SELECT * FROM matches WHERE team_num='"+ team_num_4 +"'";
          // connection.query(no_auto_sql_4, function(err, rows, fields) {
          //   for(var x in rows)
          //   {
          //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
          //     {
          //       no_autos_4++;
          //     }
          //   }
    			// });
        }
        if(team_num_5 != 0) {
          updateTeams(team_num_5);

          var get_data_5 = "SELECT * FROM teams WHERE team_num='"+ team_num_5 +"'";

    			connectionLocal.query(get_data_5, function(err, rows, fields) {
            // console.log(rows[0] != undefined);
            team_name_5 = rows[0].team_name;
            num_matches_5 = rows[0].num_matches;
            tot_auto_cross_5 = rows[0].tot_auto_cross;
            tot_auto_left_5 = rows[0].tot_auto_left;
            tot_auto_center_5 = rows[0].tot_auto_center;
            tot_auto_right_5 = rows[0].tot_auto_right;
            tot_auto_pyramid_intake_5 = rows[0].tot_auto_pyramid_intake;
            tot_auto_unprotected_intake_5 = rows[0].tot_auto_unprotected_intake;
            tot_auto_near_switch_made_5 = rows[0].tot_auto_near_switch_made;
            tot_auto_near_switch_attempts_5 = rows[0].tot_auto_near_switch_attempts;
            tot_auto_exchange_made_5 = rows[0].tot_auto_exchange_made;
            tot_auto_exchange_attempts_5 = rows[0].tot_auto_exchange_attempts;
            tot_auto_scale_high_made_5 = rows[0].tot_auto_scale_high_made;
            tot_auto_scale_high_attempts_5 = rows[0].tot_auto_scale_high_attempts;
            tot_auto_scale_low_made_5 = rows[0].tot_auto_scale_low_made;
            tot_auto_scale_low_attempts_5 = rows[0].tot_auto_scale_low_attempts;
            avg_tele_cubes_scored_5 = rows[0].avg_tele_cubes_scored;
            max_tele_cubes_scored_5 = rows[0].max_tele_cubes_scored;
            avg_tele_exchange_made_5 = rows[0].avg_tele_exchange_made;
            avg_tele_exchange_attempts_5 = rows[0].avg_tele_exchange_attempts;
            avg_tele_near_switch_made_5 = rows[0].avg_tele_near_switch_made;
            avg_tele_near_switch_attempts_5 = rows[0].avg_tele_near_switch_attempts;
            avg_tele_far_switch_made_5 = rows[0].avg_tele_far_switch_made;
            avg_tele_far_switch_attempts_5 = rows[0].avg_tele_far_switch_attempts;
            avg_tele_scale_high_made_5 = rows[0].avg_tele_scale_high_made;
            avg_tele_scale_high_attempts_5 = rows[0].avg_tele_scale_high_attempts;
            avg_tele_scale_low_made_5 = rows[0].avg_tele_scale_low_made;
            avg_tele_scale_low_attempts_5 = rows[0].avg_tele_scale_low_attempts;
            avg_tele_knockouts_5 = rows[0].avg_tele_knockouts;
            avg_tele_cubes_dropped_5 = rows[0].avg_tele_cubes_dropped;
            avg_tele_intake_5 = rows[0].avg_tele_intake;
            max_tele_intake_5 = rows[0].max_tele_intake;
            avg_tele_portal_intake_made_5 = rows[0].avg_tele_portal_intake_made;
            avg_tele_portal_intake_attempts_5 = rows[0].avg_tele_portal_intake_attempts;
            avg_tele_pyramid_intake_5 = rows[0].avg_tele_pyramid_intake;
            avg_tele_unprotected_intake_5 = rows[0].avg_tele_unprotected_intake;
            avg_tele_floor_intake_5 = rows[0].avg_tele_floor_intake;
            tot_tele_orderly_5 = rows[0].tot_tele_orderly;
            max_tele_highest_level_5 = rows[0].max_tele_highest_level;
            frq_tele_highest_level_5 = rows[0].frq_tele_highest_level;
            tot_tele_climb_5 = rows[0].tot_tele_climb;
            tot_tele_climb_attempts_5 = rows[0].tot_tele_climb_attempts;
            tot_tele_climb_assisted_5 = rows[0].tot_tele_climb_assisted;
            tot_tele_plus_one_5 = rows[0].tot_tele_plus_one;
            tot_tele_plus_one_attempts_5 = rows[0].tot_tele_plus_one_attempts;
            tot_tele_plus_two_5 = rows[0].tot_tele_plus_two;
            tot_tele_plus_two_attempts_5 = rows[0].tot_tele_plus_two_attempts;
            avg_driver_rating_5 = rows[0].avg_driver_rating;
            avg_defense_rating_5 = rows[0].avg_defense_rating;
    			});

          // var no_auto_sql_5 = "SELECT * FROM matches WHERE team_num='"+ team_num_5 +"'";
          // connection.query(no_auto_sql_5, function(err, rows, fields) {
          //   for(var x in rows)
          //   {
          //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
          //     {
          //       no_autos_5++;
          //     }
          //   }
    			// });
        }
        if(team_num_6 != 0) {
          updateTeams(team_num_6);

          var get_data_6 = "SELECT * FROM teams WHERE team_num='"+ team_num_6 +"'";

    			connectionLocal.query(get_data_6, function(err, rows, fields) {
            // console.log(rows[0] != undefined);
            team_name_6 = rows[0].team_name;
            num_matches_6 = rows[0].num_matches;
            tot_auto_cross_6 = rows[0].tot_auto_cross;
            tot_auto_left_6 = rows[0].tot_auto_left;
            tot_auto_center_6 = rows[0].tot_auto_center;
            tot_auto_right_6 = rows[0].tot_auto_right;
            tot_auto_pyramid_intake_6 = rows[0].tot_auto_pyramid_intake;
            tot_auto_unprotected_intake_6 = rows[0].tot_auto_unprotected_intake;
            tot_auto_near_switch_made_6 = rows[0].tot_auto_near_switch_made;
            tot_auto_near_switch_attempts_6 = rows[0].tot_auto_near_switch_attempts;
            tot_auto_exchange_made_6 = rows[0].tot_auto_exchange_made;
            tot_auto_exchange_attempts_6 = rows[0].tot_auto_exchange_attempts;
            tot_auto_scale_high_made_6 = rows[0].tot_auto_scale_high_made;
            tot_auto_scale_high_attempts_6 = rows[0].tot_auto_scale_high_attempts;
            tot_auto_scale_low_made_6 = rows[0].tot_auto_scale_low_made;
            tot_auto_scale_low_attempts_6 = rows[0].tot_auto_scale_low_attempts;
            avg_tele_cubes_scored_6 = rows[0].avg_tele_cubes_scored;
            max_tele_cubes_scored_6 = rows[0].max_tele_cubes_scored;
            avg_tele_exchange_made_6 = rows[0].avg_tele_exchange_made;
            avg_tele_exchange_attempts_6 = rows[0].avg_tele_exchange_attempts;
            avg_tele_near_switch_made_6 = rows[0].avg_tele_near_switch_made;
            avg_tele_near_switch_attempts_6 = rows[0].avg_tele_near_switch_attempts;
            avg_tele_far_switch_made_6 = rows[0].avg_tele_far_switch_made;
            avg_tele_far_switch_attempts_6 = rows[0].avg_tele_far_switch_attempts;
            avg_tele_scale_high_made_6 = rows[0].avg_tele_scale_high_made;
            avg_tele_scale_high_attempts_6 = rows[0].avg_tele_scale_high_attempts;
            avg_tele_scale_low_made_6 = rows[0].avg_tele_scale_low_made;
            avg_tele_scale_low_attempts_6 = rows[0].avg_tele_scale_low_attempts;
            avg_tele_knockouts_6 = rows[0].avg_tele_knockouts;
            avg_tele_cubes_dropped_6 = rows[0].avg_tele_cubes_dropped;
            avg_tele_intake_6 = rows[0].avg_tele_intake;
            max_tele_intake_6 = rows[0].max_tele_intake;
            avg_tele_portal_intake_made_6 = rows[0].avg_tele_portal_intake_made;
            avg_tele_portal_intake_attempts_6 = rows[0].avg_tele_portal_intake_attempts;
            avg_tele_pyramid_intake_6 = rows[0].avg_tele_pyramid_intake;
            avg_tele_unprotected_intake_6 = rows[0].avg_tele_unprotected_intake;
            avg_tele_floor_intake_6 = rows[0].avg_tele_floor_intake;
            tot_tele_orderly_6 = rows[0].tot_tele_orderly;
            max_tele_highest_level_6 = rows[0].max_tele_highest_level;
            frq_tele_highest_level_6 = rows[0].frq_tele_highest_level;
            tot_tele_climb_6 = rows[0].tot_tele_climb;
            tot_tele_climb_attempts_6 = rows[0].tot_tele_climb_attempts;
            tot_tele_climb_assisted_6 = rows[0].tot_tele_climb_assisted;
            tot_tele_plus_one_6 = rows[0].tot_tele_plus_one;
            tot_tele_plus_one_attempts_6 = rows[0].tot_tele_plus_one_attempts;
            tot_tele_plus_two_6 = rows[0].tot_tele_plus_two;
            tot_tele_plus_two_attempts_6 = rows[0].tot_tele_plus_two_attempts;
            avg_driver_rating_6 = rows[0].avg_driver_rating;
            avg_defense_rating_6 = rows[0].avg_defense_rating;
    			});

          // var no_auto_sql_6 = "SELECT * FROM matches WHERE team_num='"+ team_num_6 +"'";
          // connection.query(no_auto_sql_6, function(err, rows, fields) {
          //   for(var x in rows)
          //   {
          //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
          //     {
          //       no_autos_6++;
          //     }
          //   }
    			// });
        }

        var dir = __dirname + "\\public\\videos";
        var files = null;

        fs.readdir(dir, function(err, files) {
          files = files.map(function (fileName) {
            return {
              name: fileName,
              time: fs.statSync(dir + '/' + fileName).mtime.getTime()
            };
          })
          .sort(function (a, b) {
            return a.time - b.time; })
          .map(function (v) {
            return v.name; });

          // console.log(files);

          var match_sql_1 = "SELECT match_num FROM matches WHERE team_num=" + team_num_1 + " ORDER BY match_num DESC LIMIT 1";
          connectionLocal.query(match_sql_1, (err, rows) => {
            // most_recent_match_1 = files[rows[0].match_num - 1] || "N/A";
            // console.log(rows[0] == undefined);
            if(rows[0] != undefined) {
              most_recent_match_1[0] = rows[0].match_num;
              most_recent_match_1[1] = files[rows[0].match_num] || "N/A";
            }
            else {
              most_recent_match_1[0] = "N/A";
              most_recent_match_1[1] = "N/A";
            }
          });

          var match_sql_2 = "SELECT match_num FROM matches WHERE team_num=" + team_num_2 + " ORDER BY match_num DESC LIMIT 1";
          connectionLocal.query(match_sql_2, (err, rows) => {
            // most_recent_match_2 = files[rows[0].match_num - 1] || "N/A";
            if(rows[0] != undefined) {
              most_recent_match_2[0] = rows[0].match_num;
              most_recent_match_2[1] = files[rows[0].match_num] || "N/A";
            }
            else {
              most_recent_match_2[0] = "N/A";
              most_recent_match_2[1] = "N/A";
            }
          });

          var match_sql_3 = "SELECT match_num FROM matches WHERE team_num=" + team_num_3 + " ORDER BY match_num DESC LIMIT 1";
          connectionLocal.query(match_sql_3, (err, rows) => {
            if(rows[0] != undefined) {
              most_recent_match_3[0] = rows[0].match_num;
              most_recent_match_3[1] = files[rows[0].match_num] || "N/A";
            }
            else {
              most_recent_match_3[0] = "N/A";
              most_recent_match_3[1] = "N/A";
            }
          });

          var match_sql_4 = "SELECT match_num FROM matches WHERE team_num=" + team_num_4 + " ORDER BY match_num DESC LIMIT 1";
          connectionLocal.query(match_sql_4, (err, rows) => {
            if(rows[0] != undefined) {
              most_recent_match_4[0] = rows[0].match_num;
              most_recent_match_4[1] = files[rows[0].match_num] || "N/A";
            }
            else {
              most_recent_match_4[0] = "N/A";
              most_recent_match_4[1] = "N/A";
            }
          });

          var match_sql_5 = "SELECT match_num FROM matches WHERE team_num=" + team_num_5 + " ORDER BY match_num DESC LIMIT 1";
          connectionLocal.query(match_sql_5, (err, rows) => {
            if(rows[0] != undefined) {
              most_recent_match_5[0] = rows[0].match_num;
              most_recent_match_5[1] = files[rows[0].match_num] || "N/A";
            }
            else {
              most_recent_match_5[0] = "N/A";
              most_recent_match_5[1] = "N/A";
            }
          });

          var match_sql_6 = "SELECT match_num FROM matches WHERE team_num=" + team_num_6 + " ORDER BY match_num DESC LIMIT 1";
          connectionLocal.query(match_sql_6, (err, rows) => {
            if(rows[0] != undefined) {
              most_recent_match_6[0] = rows[0].match_num;
              most_recent_match_6[1] = files[rows[0].match_num] || "N/A";
            }
            else {
              most_recent_match_6[0] = "N/A";
              most_recent_match_6[1] = "N/A";
            }
          });
        });

            // console.log(tot_auto_gears_scored_1);
        setTimeout(() => {
          var ppt_template = require("ppt-template");
          var Presentation = ppt_template.Presentation;

          var myPres = new Presentation();
          myPres.loadFile(__dirname + "/alliances/alliance_interface.pptx")
          .then(() => {
            var mainSlide = myPres.getSlide(1); // Index starts at 1 for some reason
            mainSlide.fill([
              {
                key: "team_num_1",
                value: team_num_2
              },
              {
                key: "match_num_1",
                value: most_recent_match_2[0]
              },
              {
                key: "team_num_2",
                value: team_num_3
              },
              {
                key: "match_num_2",
                value: most_recent_match_3[0]
              },
              {
                key: "team_num_3",
                value: team_num_4
              },
              {
                key: "match_num_3",
                value: most_recent_match_4[0]
              },
              {
                key: "team_num_4",
                value: team_num_5
              },
              {
                key: "match_num_4",
                value: most_recent_match_5[0]
              },
              {
                key: "team_num_5",
                value: team_num_6
              },
              {
                key: "match_num_5",
                value: most_recent_match_6[0]
              },
            ]);
            var sheetSlide = myPres.getSlide(2); // Index starts at 1 for some reason
            sheetSlide.fill([
              {
                key: "team_num_1",
                value: team_num_1
              },
              {
                key: "avg_tele_intake_1",
                value: avg_tele_intake_1
              },
              {
                key: "max_tele_intake_1",
                value: max_tele_intake_1
              },
              {
                key: "avg_tele_cubes_scored_1",
                value: avg_tele_cubes_scored_1
              },
              {
                key: "max_tele_cubes_scored_1",
                value: max_tele_cubes_scored_1
              },
              {
                key: "num_matches_1",
                value: num_matches_1
              },
              {
                key: "tot_auto_cross_1",
                value: tot_auto_cross_1
              },
              {
                key: "tot_auto_scale_high_made_1",
                value: tot_auto_scale_high_made_1
              },
              {
                key: "tot_auto_scale_high_attempts_1",
                value: tot_auto_scale_high_attempts_1
              },
              {
                key: "tot_auto_scale_low_made_1",
                value: tot_auto_scale_low_made_1
              },
              {
                key: "tot_auto_scale_low_attempts_1",
                value: tot_auto_scale_low_attempts_1
              },
              {
                key: "tot_auto_near_switch_made_1",
                value: tot_auto_near_switch_made_1
              },
              {
                key: "tot_auto_near_switch_attempts_1",
                value: tot_auto_near_switch_attempts_1
              },
              {
                key: "tot_auto_exchange_made_1",
                value: tot_auto_exchange_made_1
              },
              {
                key: "tot_auto_exchange_attempts_1",
                value: tot_auto_exchange_attempts_1
              },
              {
                key: "tot_auto_pyramid_intake_1",
                value: tot_auto_pyramid_intake_1
              },
              {
                key: "tot_auto_unprotected_intake_1",
                value: tot_auto_unprotected_intake_1
              },
              {
                key: "tot_auto_left_1",
                value: tot_auto_left_1
              },
              {
                key: "tot_auto_center_1",
                value: tot_auto_center_1
              },
              {
                key: "tot_auto_right_1",
                value: tot_auto_right_1
              },
              {
                key: "avg_tele_exchange_made_1",
                value: avg_tele_exchange_made_1
              },
              {
                key: "avg_tele_exchange_attempts_1",
                value: avg_tele_exchange_attempts_1
              },
              {
                key: "avg_tele_near_switch_made_1",
                value: avg_tele_near_switch_made_1
              },
              {
                key: "avg_tele_near_switch_attempts_1",
                value: avg_tele_near_switch_attempts_1
              },
              {
                key: "avg_tele_far_switch_made_1",
                value: avg_tele_far_switch_made_1
              },
              {
                key: "avg_tele_far_switch_attempts_1",
                value: avg_tele_far_switch_attempts_1
              },
              {
                key: "avg_tele_scale_high_made_1",
                value: avg_tele_scale_high_made_1
              },
              {
                key: "avg_tele_scale_high_attempts_1",
                value: avg_tele_scale_high_attempts_1
              },
              {
                key: "avg_tele_scale_low_made_1",
                value: avg_tele_scale_low_made_1
              },
              {
                key: "avg_tele_scale_low_attempts_1",
                value: avg_tele_scale_low_attempts_1
              },
              {
                key: "avg_tele_portal_intake_made_1",
                value: avg_tele_portal_intake_made_1
              },
              {
                key: "avg_tele_portal_intake_attempts_1",
                value: avg_tele_portal_intake_attempts_1
              },
              {
                key: "avg_tele_pyramid_intake_1",
                value: avg_tele_pyramid_intake_1
              },
              {
                key: "avg_tele_unprotected_intake_1",
                value: avg_tele_unprotected_intake_1
              },
              {
                key: "avg_tele_floor_intake_1",
                value: avg_tele_floor_intake_1
              },
              {
                key: "avg_tele_knockouts_1",
                value: avg_tele_knockouts_1
              },
              {
                key: "avg_tele_cubes_dropped_1",
                value: avg_tele_cubes_dropped_1
              },
              {
                key: "tot_tele_orderly_1",
                value: tot_tele_orderly_1
              },
              {
                key: "max_tele_highest_level_1",
                value: max_tele_highest_level_1
              },
              {
                key: "tot_tele_climb_1",
                value: tot_tele_climb_1
              },
              {
                key: "tot_tele_climb_attempts_1",
                value: tot_tele_climb_attempts_1
              },
              {
                key: "tot_tele_climb_assisted_1",
                value: tot_tele_climb_assisted_1
              },
              {
                key: "tot_tele_plus_one_1",
                value: tot_tele_plus_one_1
              },
              {
                key: "tot_tele_plus_one_attempts_1",
                value: tot_tele_plus_one_attempts_1
              },
              {
                key: "tot_tele_plus_two_1",
                value: tot_tele_plus_two_1
              },
              {
                key: "tot_tele_plus_two_attempts_1",
                value: tot_tele_plus_two_attempts_1
              },
              {
                key: "avg_defense_rating_1",
                value: avg_defense_rating_1
              },
              {
                key: "avg_mobility_rating_1",
                value: avg_driver_rating_1
              },
              {
                key: "team_num_2",
                value: team_num_2
              },
              {
                key: "avg_tele_intake_2",
                value: avg_tele_intake_2
              },
              {
                key: "max_tele_intake_2",
                value: max_tele_intake_2
              },
              {
                key: "avg_tele_cubes_scored_2",
                value: avg_tele_cubes_scored_2
              },
              {
                key: "max_tele_cubes_scored_2",
                value: max_tele_cubes_scored_2
              },
              {
                key: "num_matches_2",
                value: num_matches_2
              },
              {
                key: "tot_auto_cross_2",
                value: tot_auto_cross_2
              },
              {
                key: "tot_auto_scale_high_made_2",
                value: tot_auto_scale_high_made_2
              },
              {
                key: "tot_auto_scale_high_attempts_2",
                value: tot_auto_scale_high_attempts_2
              },
              {
                key: "tot_auto_scale_low_made_2",
                value: tot_auto_scale_low_made_2
              },
              {
                key: "tot_auto_scale_low_attempts_2",
                value: tot_auto_scale_low_attempts_2
              },
              {
                key: "tot_auto_near_switch_made_2",
                value: tot_auto_near_switch_made_2
              },
              {
                key: "tot_auto_near_switch_attempts_2",
                value: tot_auto_near_switch_attempts_2
              },
              {
                key: "tot_auto_exchange_made_2",
                value: tot_auto_exchange_made_2
              },
              {
                key: "tot_auto_exchange_attempts_2",
                value: tot_auto_exchange_attempts_2
              },
              {
                key: "tot_auto_pyramid_intake_2",
                value: tot_auto_pyramid_intake_2
              },
              {
                key: "tot_auto_unprotected_intake_2",
                value: tot_auto_unprotected_intake_2
              },
              {
                key: "tot_auto_left_2",
                value: tot_auto_left_2
              },
              {
                key: "tot_auto_center_2",
                value: tot_auto_center_2
              },
              {
                key: "tot_auto_right_2",
                value: tot_auto_right_2
              },
              {
                key: "avg_tele_exchange_made_2",
                value: avg_tele_exchange_made_2
              },
              {
                key: "avg_tele_exchange_attempts_2",
                value: avg_tele_exchange_attempts_2
              },
              {
                key: "avg_tele_near_switch_made_2",
                value: avg_tele_near_switch_made_2
              },
              {
                key: "avg_tele_near_switch_attempts_2",
                value: avg_tele_near_switch_attempts_2
              },
              {
                key: "avg_tele_far_switch_made_2",
                value: avg_tele_far_switch_made_2
              },
              {
                key: "avg_tele_far_switch_attempts_2",
                value: avg_tele_far_switch_attempts_2
              },
              {
                key: "avg_tele_scale_high_made_2",
                value: avg_tele_scale_high_made_2
              },
              {
                key: "avg_tele_scale_high_attempts_2",
                value: avg_tele_scale_high_attempts_2
              },
              {
                key: "avg_tele_scale_low_made_2",
                value: avg_tele_scale_low_made_2
              },
              {
                key: "avg_tele_scale_low_attempts_2",
                value: avg_tele_scale_low_attempts_2
              },
              {
                key: "avg_tele_portal_intake_made_2",
                value: avg_tele_portal_intake_made_2
              },
              {
                key: "avg_tele_portal_intake_attempts_2",
                value: avg_tele_portal_intake_attempts_2
              },
              {
                key: "avg_tele_pyramid_intake_2",
                value: avg_tele_pyramid_intake_2
              },
              {
                key: "avg_tele_unprotected_intake_2",
                value: avg_tele_unprotected_intake_2
              },
              {
                key: "avg_tele_floor_intake_2",
                value: avg_tele_floor_intake_2
              },
              {
                key: "avg_tele_knockouts_2",
                value: avg_tele_knockouts_2
              },
              {
                key: "avg_tele_cubes_dropped_2",
                value: avg_tele_cubes_dropped_2
              },
              {
                key: "tot_tele_orderly_2",
                value: tot_tele_orderly_2
              },
              {
                key: "max_tele_highest_level_2",
                value: max_tele_highest_level_2
              },
              {
                key: "tot_tele_climb_2",
                value: tot_tele_climb_2
              },
              {
                key: "tot_tele_climb_attempts_2",
                value: tot_tele_climb_attempts_2
              },
              {
                key: "tot_tele_climb_assisted_2",
                value: tot_tele_climb_assisted_2
              },
              {
                key: "tot_tele_plus_one_2",
                value: tot_tele_plus_one_2
              },
              {
                key: "tot_tele_plus_one_attempts_2",
                value: tot_tele_plus_one_attempts_2
              },
              {
                key: "tot_tele_plus_two_2",
                value: tot_tele_plus_two_2
              },
              {
                key: "tot_tele_plus_two_attempts_2",
                value: tot_tele_plus_two_attempts_2
              },
              {
                key: "avg_defense_rating_2",
                value: avg_defense_rating_2
              },
              {
                key: "avg_mobility_rating_2",
                value: avg_driver_rating_2
              },
              {
                key: "team_num_3",
                value: team_num_3
              },
              {
                key: "avg_tele_intake_3",
                value: avg_tele_intake_3
              },
              {
                key: "max_tele_intake_3",
                value: max_tele_intake_3
              },
              {
                key: "avg_tele_cubes_scored_3",
                value: avg_tele_cubes_scored_3
              },
              {
                key: "max_tele_cubes_scored_3",
                value: max_tele_cubes_scored_3
              },
              {
                key: "num_matches_3",
                value: num_matches_3
              },
              {
                key: "tot_auto_cross_3",
                value: tot_auto_cross_3
              },
              {
                key: "tot_auto_scale_high_made_3",
                value: tot_auto_scale_high_made_3
              },
              {
                key: "tot_auto_scale_high_attempts_3",
                value: tot_auto_scale_high_attempts_3
              },
              {
                key: "tot_auto_scale_low_made_3",
                value: tot_auto_scale_low_made_3
              },
              {
                key: "tot_auto_scale_low_attempts_3",
                value: tot_auto_scale_low_attempts_3
              },
              {
                key: "tot_auto_near_switch_made_3",
                value: tot_auto_near_switch_made_3
              },
              {
                key: "tot_auto_near_switch_attempts_3",
                value: tot_auto_near_switch_attempts_3
              },
              {
                key: "tot_auto_exchange_made_3",
                value: tot_auto_exchange_made_3
              },
              {
                key: "tot_auto_exchange_attempts_3",
                value: tot_auto_exchange_attempts_3
              },
              {
                key: "tot_auto_pyramid_intake_3",
                value: tot_auto_pyramid_intake_3
              },
              {
                key: "tot_auto_unprotected_intake_3",
                value: tot_auto_unprotected_intake_3
              },
              {
                key: "tot_auto_left_3",
                value: tot_auto_left_3
              },
              {
                key: "tot_auto_center_3",
                value: tot_auto_center_3
              },
              {
                key: "tot_auto_right_3",
                value: tot_auto_right_3
              },
              {
                key: "avg_tele_exchange_made_3",
                value: avg_tele_exchange_made_3
              },
              {
                key: "avg_tele_exchange_attempts_3",
                value: avg_tele_exchange_attempts_3
              },
              {
                key: "avg_tele_near_switch_made_3",
                value: avg_tele_near_switch_made_3
              },
              {
                key: "avg_tele_near_switch_attempts_3",
                value: avg_tele_near_switch_attempts_3
              },
              {
                key: "avg_tele_far_switch_made_3",
                value: avg_tele_far_switch_made_3
              },
              {
                key: "avg_tele_far_switch_attempts_3",
                value: avg_tele_far_switch_attempts_3
              },
              {
                key: "avg_tele_scale_high_made_3",
                value: avg_tele_scale_high_made_3
              },
              {
                key: "avg_tele_scale_high_attempts_3",
                value: avg_tele_scale_high_attempts_3
              },
              {
                key: "avg_tele_scale_low_made_3",
                value: avg_tele_scale_low_made_3
              },
              {
                key: "avg_tele_scale_low_attempts_3",
                value: avg_tele_scale_low_attempts_3
              },
              {
                key: "avg_tele_portal_intake_made_3",
                value: avg_tele_portal_intake_made_3
              },
              {
                key: "avg_tele_portal_intake_attempts_3",
                value: avg_tele_portal_intake_attempts_3
              },
              {
                key: "avg_tele_pyramid_intake_3",
                value: avg_tele_pyramid_intake_3
              },
              {
                key: "avg_tele_unprotected_intake_3",
                value: avg_tele_unprotected_intake_3
              },
              {
                key: "avg_tele_floor_intake_3",
                value: avg_tele_floor_intake_3
              },
              {
                key: "avg_tele_knockouts_3",
                value: avg_tele_knockouts_3
              },
              {
                key: "avg_tele_cubes_dropped_3",
                value: avg_tele_cubes_dropped_3
              },
              {
                key: "tot_tele_orderly_3",
                value: tot_tele_orderly_3
              },
              {
                key: "max_tele_highest_level_3",
                value: max_tele_highest_level_3
              },
              {
                key: "tot_tele_climb_3",
                value: tot_tele_climb_3
              },
              {
                key: "tot_tele_climb_attempts_3",
                value: tot_tele_climb_attempts_3
              },
              {
                key: "tot_tele_climb_assisted_3",
                value: tot_tele_climb_assisted_3
              },
              {
                key: "tot_tele_plus_one_3",
                value: tot_tele_plus_one_3
              },
              {
                key: "tot_tele_plus_one_attempts_3",
                value: tot_tele_plus_one_attempts_3
              },
              {
                key: "tot_tele_plus_two_3",
                value: tot_tele_plus_two_3
              },
              {
                key: "tot_tele_plus_two_attempts_3",
                value: tot_tele_plus_two_attempts_3
              },
              {
                key: "avg_defense_rating_3",
                value: avg_defense_rating_3
              },
              {
                key: "avg_mobility_rating_3",
                value: avg_driver_rating_3
              },
              {
                key: "team_num_4",
                value: team_num_4
              },
              {
                key: "avg_tele_intake_4",
                value: avg_tele_intake_4
              },
              {
                key: "max_tele_intake_4",
                value: max_tele_intake_4
              },
              {
                key: "avg_tele_cubes_scored_4",
                value: avg_tele_cubes_scored_4
              },
              {
                key: "max_tele_cubes_scored_4",
                value: max_tele_cubes_scored_4
              },
              {
                key: "num_matches_4",
                value: num_matches_4
              },
              {
                key: "tot_auto_cross_4",
                value: tot_auto_cross_4
              },
              {
                key: "tot_auto_scale_high_made_4",
                value: tot_auto_scale_high_made_4
              },
              {
                key: "tot_auto_scale_high_attempts_4",
                value: tot_auto_scale_high_attempts_4
              },
              {
                key: "tot_auto_scale_low_made_4",
                value: tot_auto_scale_low_made_4
              },
              {
                key: "tot_auto_scale_low_attempts_4",
                value: tot_auto_scale_low_attempts_4
              },
              {
                key: "tot_auto_near_switch_made_4",
                value: tot_auto_near_switch_made_4
              },
              {
                key: "tot_auto_near_switch_attempts_4",
                value: tot_auto_near_switch_attempts_4
              },
              {
                key: "tot_auto_exchange_made_4",
                value: tot_auto_exchange_made_4
              },
              {
                key: "tot_auto_exchange_attempts_4",
                value: tot_auto_exchange_attempts_4
              },
              {
                key: "tot_auto_pyramid_intake_4",
                value: tot_auto_pyramid_intake_4
              },
              {
                key: "tot_auto_unprotected_intake_4",
                value: tot_auto_unprotected_intake_4
              },
              {
                key: "tot_auto_left_4",
                value: tot_auto_left_4
              },
              {
                key: "tot_auto_center_4",
                value: tot_auto_center_4
              },
              {
                key: "tot_auto_right_4",
                value: tot_auto_right_4
              },
              {
                key: "avg_tele_exchange_made_4",
                value: avg_tele_exchange_made_4
              },
              {
                key: "avg_tele_exchange_attempts_4",
                value: avg_tele_exchange_attempts_4
              },
              {
                key: "avg_tele_near_switch_made_4",
                value: avg_tele_near_switch_made_4
              },
              {
                key: "avg_tele_near_switch_attempts_4",
                value: avg_tele_near_switch_attempts_4
              },
              {
                key: "avg_tele_far_switch_made_4",
                value: avg_tele_far_switch_made_4
              },
              {
                key: "avg_tele_far_switch_attempts_4",
                value: avg_tele_far_switch_attempts_4
              },
              {
                key: "avg_tele_scale_high_made_4",
                value: avg_tele_scale_high_made_4
              },
              {
                key: "avg_tele_scale_high_attempts_4",
                value: avg_tele_scale_high_attempts_4
              },
              {
                key: "avg_tele_scale_low_made_4",
                value: avg_tele_scale_low_made_4
              },
              {
                key: "avg_tele_scale_low_attempts_4",
                value: avg_tele_scale_low_attempts_4
              },
              {
                key: "avg_tele_portal_intake_made_4",
                value: avg_tele_portal_intake_made_4
              },
              {
                key: "avg_tele_portal_intake_attempts_4",
                value: avg_tele_portal_intake_attempts_4
              },
              {
                key: "avg_tele_pyramid_intake_4",
                value: avg_tele_pyramid_intake_4
              },
              {
                key: "avg_tele_unprotected_intake_4",
                value: avg_tele_unprotected_intake_4
              },
              {
                key: "avg_tele_floor_intake_4",
                value: avg_tele_floor_intake_4
              },
              {
                key: "avg_tele_knockouts_4",
                value: avg_tele_knockouts_4
              },
              {
                key: "avg_tele_cubes_dropped_4",
                value: avg_tele_cubes_dropped_4
              },
              {
                key: "tot_tele_orderly_4",
                value: tot_tele_orderly_4
              },
              {
                key: "max_tele_highest_level_4",
                value: max_tele_highest_level_4
              },
              {
                key: "tot_tele_climb_4",
                value: tot_tele_climb_4
              },
              {
                key: "tot_tele_climb_attempts_4",
                value: tot_tele_climb_attempts_4
              },
              {
                key: "tot_tele_climb_assisted_4",
                value: tot_tele_climb_assisted_4
              },
              {
                key: "tot_tele_plus_one_4",
                value: tot_tele_plus_one_4
              },
              {
                key: "tot_tele_plus_one_attempts_4",
                value: tot_tele_plus_one_attempts_4
              },
              {
                key: "tot_tele_plus_two_4",
                value: tot_tele_plus_two_4
              },
              {
                key: "tot_tele_plus_two_attempts_4",
                value: tot_tele_plus_two_attempts_4
              },
              {
                key: "avg_defense_rating_4",
                value: avg_defense_rating_4
              },
              {
                key: "avg_mobility_rating_4",
                value: avg_driver_rating_4
              },
              {
                key: "team_num_5",
                value: team_num_5
              },
              {
                key: "avg_tele_intake_5",
                value: avg_tele_intake_5
              },
              {
                key: "max_tele_intake_5",
                value: max_tele_intake_5
              },
              {
                key: "avg_tele_cubes_scored_5",
                value: avg_tele_cubes_scored_5
              },
              {
                key: "max_tele_cubes_scored_5",
                value: max_tele_cubes_scored_5
              },
              {
                key: "num_matches_5",
                value: num_matches_5
              },
              {
                key: "tot_auto_cross_5",
                value: tot_auto_cross_5
              },
              {
                key: "tot_auto_scale_high_made_5",
                value: tot_auto_scale_high_made_5
              },
              {
                key: "tot_auto_scale_high_attempts_5",
                value: tot_auto_scale_high_attempts_5
              },
              {
                key: "tot_auto_scale_low_made_5",
                value: tot_auto_scale_low_made_5
              },
              {
                key: "tot_auto_scale_low_attempts_5",
                value: tot_auto_scale_low_attempts_5
              },
              {
                key: "tot_auto_near_switch_made_5",
                value: tot_auto_near_switch_made_5
              },
              {
                key: "tot_auto_near_switch_attempts_5",
                value: tot_auto_near_switch_attempts_5
              },
              {
                key: "tot_auto_exchange_made_5",
                value: tot_auto_exchange_made_5
              },
              {
                key: "tot_auto_exchange_attempts_5",
                value: tot_auto_exchange_attempts_5
              },
              {
                key: "tot_auto_pyramid_intake_5",
                value: tot_auto_pyramid_intake_5
              },
              {
                key: "tot_auto_unprotected_intake_5",
                value: tot_auto_unprotected_intake_5
              },
              {
                key: "tot_auto_left_5",
                value: tot_auto_left_5
              },
              {
                key: "tot_auto_center_5",
                value: tot_auto_center_5
              },
              {
                key: "tot_auto_right_5",
                value: tot_auto_right_5
              },
              {
                key: "avg_tele_exchange_made_5",
                value: avg_tele_exchange_made_5
              },
              {
                key: "avg_tele_exchange_attempts_5",
                value: avg_tele_exchange_attempts_5
              },
              {
                key: "avg_tele_near_switch_made_5",
                value: avg_tele_near_switch_made_5
              },
              {
                key: "avg_tele_near_switch_attempts_5",
                value: avg_tele_near_switch_attempts_5
              },
              {
                key: "avg_tele_far_switch_made_5",
                value: avg_tele_far_switch_made_5
              },
              {
                key: "avg_tele_far_switch_attempts_5",
                value: avg_tele_far_switch_attempts_5
              },
              {
                key: "avg_tele_scale_high_made_5",
                value: avg_tele_scale_high_made_5
              },
              {
                key: "avg_tele_scale_high_attempts_5",
                value: avg_tele_scale_high_attempts_5
              },
              {
                key: "avg_tele_scale_low_made_5",
                value: avg_tele_scale_low_made_5
              },
              {
                key: "avg_tele_scale_low_attempts_5",
                value: avg_tele_scale_low_attempts_5
              },
              {
                key: "avg_tele_portal_intake_made_5",
                value: avg_tele_portal_intake_made_5
              },
              {
                key: "avg_tele_portal_intake_attempts_5",
                value: avg_tele_portal_intake_attempts_5
              },
              {
                key: "avg_tele_pyramid_intake_5",
                value: avg_tele_pyramid_intake_5
              },
              {
                key: "avg_tele_unprotected_intake_5",
                value: avg_tele_unprotected_intake_5
              },
              {
                key: "avg_tele_floor_intake_5",
                value: avg_tele_floor_intake_5
              },
              {
                key: "avg_tele_knockouts_5",
                value: avg_tele_knockouts_5
              },
              {
                key: "avg_tele_cubes_dropped_5",
                value: avg_tele_cubes_dropped_5
              },
              {
                key: "tot_tele_orderly_5",
                value: tot_tele_orderly_5
              },
              {
                key: "max_tele_highest_level_5",
                value: max_tele_highest_level_5
              },
              {
                key: "tot_tele_climb_5",
                value: tot_tele_climb_5
              },
              {
                key: "tot_tele_climb_attempts_5",
                value: tot_tele_climb_attempts_5
              },
              {
                key: "tot_tele_climb_assisted_5",
                value: tot_tele_climb_assisted_5
              },
              {
                key: "tot_tele_plus_one_5",
                value: tot_tele_plus_one_5
              },
              {
                key: "tot_tele_plus_one_attempts_5",
                value: tot_tele_plus_one_attempts_5
              },
              {
                key: "tot_tele_plus_two_5",
                value: tot_tele_plus_two_5
              },
              {
                key: "tot_tele_plus_two_attempts_5",
                value: tot_tele_plus_two_attempts_5
              },
              {
                key: "avg_defense_rating_5",
                value: avg_defense_rating_5
              },
              {
                key: "avg_mobility_rating_5",
                value: avg_driver_rating_5
              },
              {
                key: "team_num_6",
                value: team_num_6
              },
              {
                key: "avg_tele_intake_6",
                value: avg_tele_intake_6
              },
              {
                key: "max_tele_intake_6",
                value: max_tele_intake_6
              },
              {
                key: "avg_tele_cubes_scored_6",
                value: avg_tele_cubes_scored_6
              },
              {
                key: "max_tele_cubes_scored_6",
                value: max_tele_cubes_scored_6
              },
              {
                key: "num_matches_6",
                value: num_matches_6
              },
              {
                key: "tot_auto_cross_6",
                value: tot_auto_cross_6
              },
              {
                key: "tot_auto_scale_high_made_6",
                value: tot_auto_scale_high_made_6
              },
              {
                key: "tot_auto_scale_high_attempts_6",
                value: tot_auto_scale_high_attempts_6
              },
              {
                key: "tot_auto_scale_low_made_6",
                value: tot_auto_scale_low_made_6
              },
              {
                key: "tot_auto_scale_low_attempts_6",
                value: tot_auto_scale_low_attempts_6
              },
              {
                key: "tot_auto_near_switch_made_6",
                value: tot_auto_near_switch_made_6
              },
              {
                key: "tot_auto_near_switch_attempts_6",
                value: tot_auto_near_switch_attempts_6
              },
              {
                key: "tot_auto_exchange_made_6",
                value: tot_auto_exchange_made_6
              },
              {
                key: "tot_auto_exchange_attempts_6",
                value: tot_auto_exchange_attempts_6
              },
              {
                key: "tot_auto_pyramid_intake_6",
                value: tot_auto_pyramid_intake_6
              },
              {
                key: "tot_auto_unprotected_intake_6",
                value: tot_auto_unprotected_intake_6
              },
              {
                key: "tot_auto_left_6",
                value: tot_auto_left_6
              },
              {
                key: "tot_auto_center_6",
                value: tot_auto_center_6
              },
              {
                key: "tot_auto_right_6",
                value: tot_auto_right_6
              },
              {
                key: "avg_tele_exchange_made_6",
                value: avg_tele_exchange_made_6
              },
              {
                key: "avg_tele_exchange_attempts_6",
                value: avg_tele_exchange_attempts_6
              },
              {
                key: "avg_tele_near_switch_made_6",
                value: avg_tele_near_switch_made_6
              },
              {
                key: "avg_tele_near_switch_attempts_6",
                value: avg_tele_near_switch_attempts_6
              },
              {
                key: "avg_tele_far_switch_made_6",
                value: avg_tele_far_switch_made_6
              },
              {
                key: "avg_tele_far_switch_attempts_6",
                value: avg_tele_far_switch_attempts_6
              },
              {
                key: "avg_tele_scale_high_made_6",
                value: avg_tele_scale_high_made_6
              },
              {
                key: "avg_tele_scale_high_attempts_6",
                value: avg_tele_scale_high_attempts_6
              },
              {
                key: "avg_tele_scale_low_made_6",
                value: avg_tele_scale_low_made_6
              },
              {
                key: "avg_tele_scale_low_attempts_6",
                value: avg_tele_scale_low_attempts_6
              },
              {
                key: "avg_tele_portal_intake_made_6",
                value: avg_tele_portal_intake_made_6
              },
              {
                key: "avg_tele_portal_intake_attempts_6",
                value: avg_tele_portal_intake_attempts_6
              },
              {
                key: "avg_tele_pyramid_intake_6",
                value: avg_tele_pyramid_intake_6
              },
              {
                key: "avg_tele_unprotected_intake_6",
                value: avg_tele_unprotected_intake_6
              },
              {
                key: "avg_tele_floor_intake_6",
                value: avg_tele_floor_intake_6
              },
              {
                key: "avg_tele_knockouts_6",
                value: avg_tele_knockouts_6
              },
              {
                key: "avg_tele_cubes_dropped_6",
                value: avg_tele_cubes_dropped_6
              },
              {
                key: "tot_tele_orderly_6",
                value: tot_tele_orderly_6
              },
              {
                key: "max_tele_highest_level_6",
                value: max_tele_highest_level_6
              },
              {
                key: "tot_tele_climb_6",
                value: tot_tele_climb_6
              },
              {
                key: "tot_tele_climb_attempts_6",
                value: tot_tele_climb_attempts_6
              },
              {
                key: "tot_tele_climb_assisted_6",
                value: tot_tele_climb_assisted_6
              },
              {
                key: "tot_tele_plus_one_6",
                value: tot_tele_plus_one_6
              },
              {
                key: "tot_tele_plus_one_attempts_6",
                value: tot_tele_plus_one_attempts_6
              },
              {
                key: "tot_tele_plus_two_6",
                value: tot_tele_plus_two_6
              },
              {
                key: "tot_tele_plus_two_attempts_6",
                value: tot_tele_plus_two_attempts_6
              },
              {
                key: "avg_defense_rating_6",
                value: avg_defense_rating_6
              },
              {
                key: "avg_mobility_rating_6",
                value: avg_driver_rating_6
              }
            ]);
            var video1 = myPres.getSlide(3);
            video1.fill([
              {
                key: "match_link_1",
                value: most_recent_match_2[1]
              }
            ]);
            var video2 = myPres.getSlide(4);
            video2.fill([
              {
                key: "match_link_2",
                value: most_recent_match_3[1]
              }
            ]);
            var video3 = myPres.getSlide(5);
            video3.fill([
              {
                key: "match_link_3",
                value: most_recent_match_4[1]
              }
            ]);
            var video4 = myPres.getSlide(6);
            video4.fill([
              {
                key: "match_link_4",
                value: most_recent_match_5[1]
              }
            ]);
            var video5 = myPres.getSlide(7);
            video5.fill([
              {
                key: "match_link_5",
                value: most_recent_match_6[1]
              }
            ]);
            var slides = [mainSlide, sheetSlide, video1, video2, video3, video4, video5];
            return myPres.generate(slides);
          }).then((newPres) => {
            newPres.saveAs(__dirname + "/alliances/alliance_" + team_num_1 + "_" + team_num_2 + "_" + team_num_3 + "_"
                            + team_num_4 + "_" + team_num_5 + "_" + team_num_6 + ".pptx");

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
              tot_tele_climb_1: tot_tele_climb_1,
              tot_tele_climb_attempts_1: tot_tele_climb_attempts_1,
              tot_tele_climb_assisted_1: tot_tele_climb_assisted_1,
              tot_tele_plus_one_1: tot_tele_plus_one_1,
              tot_tele_plus_one_attempts_1: tot_tele_plus_one_attempts_1,
              tot_tele_plus_two_1: tot_tele_plus_two_1,
              tot_tele_plus_two_attempts_1: tot_tele_plus_two_attempts_1,
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
              tot_tele_climb_2: tot_tele_climb_2,
              tot_tele_climb_attempts_2: tot_tele_climb_attempts_2,
              tot_tele_climb_assisted_2: tot_tele_climb_assisted_2,
              tot_tele_plus_one_2: tot_tele_plus_one_2,
              tot_tele_plus_one_attempts_2: tot_tele_plus_one_attempts_2,
              tot_tele_plus_two_2: tot_tele_plus_two_2,
              tot_tele_plus_two_attempts_2: tot_tele_plus_two_attempts_2,
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
              tot_tele_climb_3: tot_tele_climb_3,
              tot_tele_climb_attempts_3: tot_tele_climb_attempts_3,
              tot_tele_climb_assisted_3: tot_tele_climb_assisted_3,
              tot_tele_plus_one_3: tot_tele_plus_one_3,
              tot_tele_plus_one_attempts_3: tot_tele_plus_one_attempts_3,
              tot_tele_plus_two_3: tot_tele_plus_two_3,
              tot_tele_plus_two_attempts_3: tot_tele_plus_two_attempts_3,
              avg_driver_rating_3: avg_driver_rating_3,
              avg_defense_rating_3: avg_defense_rating_3,
              most_recent_match_3: most_recent_match_3,

              team_num_4: team_num_4,
              team_name_4: team_name_4,
              num_matches_4: num_matches_4,
              tot_auto_cross_4: tot_auto_cross_4,
              tot_auto_left_4: tot_auto_left_4,
              tot_auto_center_4: tot_auto_center_4,
              tot_auto_right_4: tot_auto_right_4,
              tot_auto_pyramid_intake_4: tot_auto_pyramid_intake_4,
              tot_auto_unprotected_intake_4: tot_auto_unprotected_intake_4,
              tot_auto_near_switch_made_4: tot_auto_near_switch_made_4,
              tot_auto_near_switch_attempts_4: tot_auto_near_switch_attempts_4,
              tot_auto_exchange_made_4: tot_auto_exchange_made_4,
              tot_auto_exchange_attempts_4: tot_auto_exchange_attempts_4,
              tot_auto_scale_high_made_4: tot_auto_scale_high_made_4,
              tot_auto_scale_high_attempts_4: tot_auto_scale_high_attempts_4,
              tot_auto_scale_low_made_4: tot_auto_scale_low_made_4,
              tot_auto_scale_low_attempts_4: tot_auto_scale_low_attempts_4,
              avg_tele_cubes_scored_4: avg_tele_cubes_scored_4,
              max_tele_cubes_scored_4: max_tele_cubes_scored_4,
              avg_tele_exchange_made_4: avg_tele_exchange_made_4,
              avg_tele_exchange_attempts_4: avg_tele_exchange_attempts_4,
              avg_tele_near_switch_made_4: avg_tele_near_switch_made_4,
              avg_tele_near_switch_attempts_4: avg_tele_near_switch_attempts_4,
              avg_tele_far_switch_made_4: avg_tele_far_switch_made_4,
              avg_tele_far_switch_attempts_4: avg_tele_far_switch_attempts_4,
              avg_tele_scale_high_made_4: avg_tele_scale_high_made_4,
              avg_tele_scale_high_attempts_4: avg_tele_scale_high_attempts_4,
              avg_tele_scale_low_made_4: avg_tele_scale_low_made_4,
              avg_tele_scale_low_attempts_4: avg_tele_scale_low_attempts_4,
              avg_tele_knockouts_4: avg_tele_knockouts_4,
              avg_tele_cubes_dropped_4: avg_tele_cubes_dropped_4,
              avg_tele_intake_4: avg_tele_intake_4,
              max_tele_intake_4: max_tele_intake_4,
              avg_tele_portal_intake_made_4: avg_tele_portal_intake_made_4,
              avg_tele_portal_intake_attempts_4: avg_tele_portal_intake_attempts_4,
              avg_tele_pyramid_intake_4: avg_tele_pyramid_intake_4,
              avg_tele_unprotected_intake_4: avg_tele_unprotected_intake_4,
              avg_tele_floor_intake_4: avg_tele_floor_intake_4,
              tot_tele_orderly_4: tot_tele_orderly_4,
              max_tele_highest_level_4: max_tele_highest_level_4,
              frq_tele_highest_level_4: frq_tele_highest_level_4,
              tot_tele_climb_4: tot_tele_climb_4,
              tot_tele_climb_attempts_4: tot_tele_climb_attempts_4,
              tot_tele_climb_assisted_4: tot_tele_climb_assisted_4,
              tot_tele_plus_one_4: tot_tele_plus_one_4,
              tot_tele_plus_one_attempts_4: tot_tele_plus_one_attempts_4,
              tot_tele_plus_two_4: tot_tele_plus_two_4,
              tot_tele_plus_two_attempts_4: tot_tele_plus_two_attempts_4,
              avg_driver_rating_4: avg_driver_rating_4,
              avg_defense_rating_4: avg_defense_rating_4,
              most_recent_match_4: most_recent_match_4,

              team_num_5: team_num_5,
              team_name_5: team_name_5,
              num_matches_5: num_matches_5,
              tot_auto_cross_5: tot_auto_cross_5,
              tot_auto_left_5: tot_auto_left_5,
              tot_auto_center_5: tot_auto_center_5,
              tot_auto_right_5: tot_auto_right_5,
              tot_auto_pyramid_intake_5: tot_auto_pyramid_intake_5,
              tot_auto_unprotected_intake_5: tot_auto_unprotected_intake_5,
              tot_auto_near_switch_made_5: tot_auto_near_switch_made_5,
              tot_auto_near_switch_attempts_5: tot_auto_near_switch_attempts_5,
              tot_auto_exchange_made_5: tot_auto_exchange_made_5,
              tot_auto_exchange_attempts_5: tot_auto_exchange_attempts_5,
              tot_auto_scale_high_made_5: tot_auto_scale_high_made_5,
              tot_auto_scale_high_attempts_5: tot_auto_scale_high_attempts_5,
              tot_auto_scale_low_made_5: tot_auto_scale_low_made_5,
              tot_auto_scale_low_attempts_5: tot_auto_scale_low_attempts_5,
              avg_tele_cubes_scored_5: avg_tele_cubes_scored_5,
              max_tele_cubes_scored_5: max_tele_cubes_scored_5,
              avg_tele_exchange_made_5: avg_tele_exchange_made_5,
              avg_tele_exchange_attempts_5: avg_tele_exchange_attempts_5,
              avg_tele_near_switch_made_5: avg_tele_near_switch_made_5,
              avg_tele_near_switch_attempts_5: avg_tele_near_switch_attempts_5,
              avg_tele_far_switch_made_5: avg_tele_far_switch_made_5,
              avg_tele_far_switch_attempts_5: avg_tele_far_switch_attempts_5,
              avg_tele_scale_high_made_5: avg_tele_scale_high_made_5,
              avg_tele_scale_high_attempts_5: avg_tele_scale_high_attempts_5,
              avg_tele_scale_low_made_5: avg_tele_scale_low_made_5,
              avg_tele_scale_low_attempts_5: avg_tele_scale_low_attempts_5,
              avg_tele_knockouts_5: avg_tele_knockouts_5,
              avg_tele_cubes_dropped_5: avg_tele_cubes_dropped_5,
              avg_tele_intake_5: avg_tele_intake_5,
              max_tele_intake_5: max_tele_intake_5,
              avg_tele_portal_intake_made_5: avg_tele_portal_intake_made_5,
              avg_tele_portal_intake_attempts_5: avg_tele_portal_intake_attempts_5,
              avg_tele_pyramid_intake_5: avg_tele_pyramid_intake_5,
              avg_tele_unprotected_intake_5: avg_tele_unprotected_intake_5,
              avg_tele_floor_intake_5: avg_tele_floor_intake_5,
              tot_tele_orderly_5: tot_tele_orderly_5,
              max_tele_highest_level_5: max_tele_highest_level_5,
              frq_tele_highest_level_5: frq_tele_highest_level_5,
              tot_tele_climb_5: tot_tele_climb_5,
              tot_tele_climb_attempts_5: tot_tele_climb_attempts_5,
              tot_tele_climb_assisted_5: tot_tele_climb_assisted_5,
              tot_tele_plus_one_5: tot_tele_plus_one_5,
              tot_tele_plus_one_attempts_5: tot_tele_plus_one_attempts_5,
              tot_tele_plus_two_5: tot_tele_plus_two_5,
              tot_tele_plus_two_attempts_5: tot_tele_plus_two_attempts_5,
              avg_driver_rating_5: avg_driver_rating_5,
              avg_defense_rating_5: avg_defense_rating_5,
              most_recent_match_5: most_recent_match_5,

              team_num_6: team_num_6,
              team_name_6: team_name_6,
              num_matches_6: num_matches_6,
              tot_auto_cross_6: tot_auto_cross_6,
              tot_auto_left_6: tot_auto_left_6,
              tot_auto_center_6: tot_auto_center_6,
              tot_auto_right_6: tot_auto_right_6,
              tot_auto_pyramid_intake_6: tot_auto_pyramid_intake_6,
              tot_auto_unprotected_intake_6: tot_auto_unprotected_intake_6,
              tot_auto_near_switch_made_6: tot_auto_near_switch_made_6,
              tot_auto_near_switch_attempts_6: tot_auto_near_switch_attempts_6,
              tot_auto_exchange_made_6: tot_auto_exchange_made_6,
              tot_auto_exchange_attempts_6: tot_auto_exchange_attempts_6,
              tot_auto_scale_high_made_6: tot_auto_scale_high_made_6,
              tot_auto_scale_high_attempts_6: tot_auto_scale_high_attempts_6,
              tot_auto_scale_low_made_6: tot_auto_scale_low_made_6,
              tot_auto_scale_low_attempts_6: tot_auto_scale_low_attempts_6,
              avg_tele_cubes_scored_6: avg_tele_cubes_scored_6,
              max_tele_cubes_scored_6: max_tele_cubes_scored_6,
              avg_tele_exchange_made_6: avg_tele_exchange_made_6,
              avg_tele_exchange_attempts_6: avg_tele_exchange_attempts_6,
              avg_tele_near_switch_made_6: avg_tele_near_switch_made_6,
              avg_tele_near_switch_attempts_6: avg_tele_near_switch_attempts_6,
              avg_tele_far_switch_made_6: avg_tele_far_switch_made_6,
              avg_tele_far_switch_attempts_6: avg_tele_far_switch_attempts_6,
              avg_tele_scale_high_made_6: avg_tele_scale_high_made_6,
              avg_tele_scale_high_attempts_6: avg_tele_scale_high_attempts_6,
              avg_tele_scale_low_made_6: avg_tele_scale_low_made_6,
              avg_tele_scale_low_attempts_6: avg_tele_scale_low_attempts_6,
              avg_tele_knockouts_6: avg_tele_knockouts_6,
              avg_tele_cubes_dropped_6: avg_tele_cubes_dropped_6,
              avg_tele_intake_6: avg_tele_intake_6,
              max_tele_intake_6: max_tele_intake_6,
              avg_tele_portal_intake_made_6: avg_tele_portal_intake_made_6,
              avg_tele_portal_intake_attempts_6: avg_tele_portal_intake_attempts_6,
              avg_tele_pyramid_intake_6: avg_tele_pyramid_intake_6,
              avg_tele_unprotected_intake_6: avg_tele_unprotected_intake_6,
              avg_tele_floor_intake_6: avg_tele_floor_intake_6,
              tot_tele_orderly_6: tot_tele_orderly_6,
              max_tele_highest_level_6: max_tele_highest_level_6,
              frq_tele_highest_level_6: frq_tele_highest_level_6,
              tot_tele_climb_6: tot_tele_climb_6,
              tot_tele_climb_attempts_6: tot_tele_climb_attempts_6,
              tot_tele_climb_assisted_6: tot_tele_climb_assisted_6,
              tot_tele_plus_one_6: tot_tele_plus_one_6,
              tot_tele_plus_one_attempts_6: tot_tele_plus_one_attempts_6,
              tot_tele_plus_two_6: tot_tele_plus_two_6,
              tot_tele_plus_two_attempts_6: tot_tele_plus_two_attempts_6,
              avg_driver_rating_6: avg_driver_rating_6,
              avg_defense_rating_6: avg_defense_rating_6,
              most_recent_match_6: most_recent_match_6
            });
          });
        }, 2500);
      }
      else
      {
        if(team_num_1 != 0 && team_num_2 != 0 && team_num_3 != 0)
    		{
          // updateContribScores(team_num_1);
    			// updateContribScores(team_num_2);
    			// updateContribScores(team_num_3);
          updateTeams(team_num_1);
    			updateTeams(team_num_2);
    			updateTeams(team_num_3);

    		//if(!isNaN(team_num_1))
    		//{
    			var get_data_1 = "SELECT * FROM teams WHERE team_num='"+ team_num_1 +"'";

    			connectionRemote.query(get_data_1, function(err, rows, fields) {
            // console.log(rows[0] != undefined);
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
            tot_tele_climb_1 = rows[0].tot_tele_climb;
            tot_tele_climb_attempts_1 = rows[0].tot_tele_climb_attempts;
            tot_tele_climb_assisted_1 = rows[0].tot_tele_climb_assisted;
            tot_tele_plus_one_1 = rows[0].tot_tele_plus_one;
            tot_tele_plus_one_attempts_1 = rows[0].tot_tele_plus_one_attempts;
            tot_tele_plus_two_1 = rows[0].tot_tele_plus_two;
            tot_tele_plus_two_attempts_1 = rows[0].tot_tele_plus_two_attempts;
            avg_driver_rating_1 = rows[0].avg_driver_rating;
            avg_defense_rating_1 = rows[0].avg_defense_rating;
    			});

          // var no_auto_sql_1 = "SELECT * FROM matches WHERE team_num='"+ team_num_1 +"'";
          // connection.query(no_auto_sql_1, function(err, rows, fields) {
          //   for(var x in rows)
          //   {
          //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
          //     {
          //       no_autos_1++;
          //     }
          //   }
    			// });
    		//}

    		//if(!isNaN(team_num_2))
    		//{
    			var get_data_2 = "SELECT * FROM teams WHERE team_num='"+ team_num_2 +"'";

    			connectionRemote.query(get_data_2, function(err, rows, fields) {
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
              tot_tele_climb_2 = rows[0].tot_tele_climb;
              tot_tele_climb_attempts_2 = rows[0].tot_tele_climb_attempts;
              tot_tele_climb_assisted_2 = rows[0].tot_tele_climb_assisted;
              tot_tele_plus_one_2 = rows[0].tot_tele_plus_one;
              tot_tele_plus_one_attempts_2 = rows[0].tot_tele_plus_one_attempts;
              tot_tele_plus_two_2 = rows[0].tot_tele_plus_two;
              tot_tele_plus_two_attempts_2 = rows[0].tot_tele_plus_two_attempts;
              avg_driver_rating_2 = rows[0].avg_driver_rating;
              avg_defense_rating_2 = rows[0].avg_defense_rating;
    				}
    			});

          // var no_auto_sql_2 = "SELECT * FROM matches WHERE team_num='"+ team_num_2 +"'";
          // connection.query(no_auto_sql_2, function(err, rows, fields) {
          //   for(var x in rows)
          //   {
          //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
          //     {
          //       no_autos_2++;
          //     }
          //   }
    			// });
    		//}

    			var get_data_3 = "SELECT * FROM teams WHERE team_num='"+ team_num_3 +"'";

    			connectionRemote.query(get_data_3, function(err, rows, fields) {
            // console.log(rows[0] != undefined);
    				if(rows[0] != undefined)
    				{
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
              tot_tele_climb_3 = rows[0].tot_tele_climb;
              tot_tele_climb_attempts_3 = rows[0].tot_tele_climb_attempts;
              tot_tele_climb_assisted_3 = rows[0].tot_tele_climb_assisted;
              tot_tele_plus_one_3 = rows[0].tot_tele_plus_one;
              tot_tele_plus_one_attempts_3 = rows[0].tot_tele_plus_one_attempts;
              tot_tele_plus_two_3 = rows[0].tot_tele_plus_two;
              tot_tele_plus_two_attempts_3 = rows[0].tot_tele_plus_two_attempts;
              avg_driver_rating_3 = rows[0].avg_driver_rating;
              avg_defense_rating_3 = rows[0].avg_defense_rating;
    				}

            // var no_auto_sql_3 = "SELECT * FROM matches WHERE team_num='"+ team_num_3 +"'";
            // connection.query(no_auto_sql_3, function(err, rows, fields) {
            //   for(var x in rows)
            //   {
            //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
            //     {
            //       no_autos_3++;
            //     }
            //   }
            // });
          });
        }

          if(team_num_4 != 0) {
            updateTeams(team_num_4);

            var get_data_4 = "SELECT * FROM teams WHERE team_num='"+ team_num_4 +"'";

      			connectionRemote.query(get_data_4, function(err, rows, fields) {
              // console.log(rows[0] != undefined);
              team_name_4 = rows[0].team_name;
              num_matches_4 = rows[0].num_matches;
              tot_auto_cross_4 = rows[0].tot_auto_cross;
              tot_auto_left_4 = rows[0].tot_auto_left;
              tot_auto_center_4 = rows[0].tot_auto_center;
              tot_auto_right_4 = rows[0].tot_auto_right;
              tot_auto_pyramid_intake_4 = rows[0].tot_auto_pyramid_intake;
              tot_auto_unprotected_intake_4 = rows[0].tot_auto_unprotected_intake;
              tot_auto_near_switch_made_4 = rows[0].tot_auto_near_switch_made;
              tot_auto_near_switch_attempts_4 = rows[0].tot_auto_near_switch_attempts;
              tot_auto_exchange_made_4 = rows[0].tot_auto_exchange_made;
              tot_auto_exchange_attempts_4 = rows[0].tot_auto_exchange_attempts;
              tot_auto_scale_high_made_4 = rows[0].tot_auto_scale_high_made;
              tot_auto_scale_high_attempts_4 = rows[0].tot_auto_scale_high_attempts;
              tot_auto_scale_low_made_4 = rows[0].tot_auto_scale_low_made;
              tot_auto_scale_low_attempts_4 = rows[0].tot_auto_scale_low_attempts;
              avg_tele_cubes_scored_4 = rows[0].avg_tele_cubes_scored;
              max_tele_cubes_scored_4 = rows[0].max_tele_cubes_scored;
              avg_tele_exchange_made_4 = rows[0].avg_tele_exchange_made;
              avg_tele_exchange_attempts_4 = rows[0].avg_tele_exchange_attempts;
              avg_tele_near_switch_made_4 = rows[0].avg_tele_near_switch_made;
              avg_tele_near_switch_attempts_4 = rows[0].avg_tele_near_switch_attempts;
              avg_tele_far_switch_made_4 = rows[0].avg_tele_far_switch_made;
              avg_tele_far_switch_attempts_4 = rows[0].avg_tele_far_switch_attempts;
              avg_tele_scale_high_made_4 = rows[0].avg_tele_scale_high_made;
              avg_tele_scale_high_attempts_4 = rows[0].avg_tele_scale_high_attempts;
              avg_tele_scale_low_made_4 = rows[0].avg_tele_scale_low_made;
              avg_tele_scale_low_attempts_4 = rows[0].avg_tele_scale_low_attempts;
              avg_tele_knockouts_4 = rows[0].avg_tele_knockouts;
              avg_tele_cubes_dropped_4 = rows[0].avg_tele_cubes_dropped;
              avg_tele_intake_4 = rows[0].avg_tele_intake;
              max_tele_intake_4 = rows[0].max_tele_intake;
              avg_tele_portal_intake_made_4 = rows[0].avg_tele_portal_intake_made;
              avg_tele_portal_intake_attempts_4 = rows[0].avg_tele_portal_intake_attempts;
              avg_tele_pyramid_intake_4 = rows[0].avg_tele_pyramid_intake;
              avg_tele_unprotected_intake_4 = rows[0].avg_tele_unprotected_intake;
              avg_tele_floor_intake_4 = rows[0].avg_tele_floor_intake;
              tot_tele_orderly_4 = rows[0].tot_tele_orderly;
              max_tele_highest_level_4 = rows[0].max_tele_highest_level;
              frq_tele_highest_level_4 = rows[0].frq_tele_highest_level;
              tot_tele_climb_4 = rows[0].tot_tele_climb;
              tot_tele_climb_attempts_4 = rows[0].tot_tele_climb_attempts;
              tot_tele_climb_assisted_4 = rows[0].tot_tele_climb_assisted;
              tot_tele_plus_one_4 = rows[0].tot_tele_plus_one;
              tot_tele_plus_one_attempts_4 = rows[0].tot_tele_plus_one_attempts;
              tot_tele_plus_two_4 = rows[0].tot_tele_plus_two;
              tot_tele_plus_two_attempts_4 = rows[0].tot_tele_plus_two_attempts;
              avg_driver_rating_4 = rows[0].avg_driver_rating;
              avg_defense_rating_4 = rows[0].avg_defense_rating;
      			});

            // var no_auto_sql_4 = "SELECT * FROM matches WHERE team_num='"+ team_num_4 +"'";
            // connection.query(no_auto_sql_4, function(err, rows, fields) {
            //   for(var x in rows)
            //   {
            //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
            //     {
            //       no_autos_4++;
            //     }
            //   }
      			// });
          }
          if(team_num_5 != 0) {
            updateTeams(team_num_5);

            var get_data_5 = "SELECT * FROM teams WHERE team_num='"+ team_num_5 +"'";

      			connectionRemote.query(get_data_5, function(err, rows, fields) {
              // console.log(rows[0] != undefined);
              team_name_5 = rows[0].team_name;
              num_matches_5 = rows[0].num_matches;
              tot_auto_cross_5 = rows[0].tot_auto_cross;
              tot_auto_left_5 = rows[0].tot_auto_left;
              tot_auto_center_5 = rows[0].tot_auto_center;
              tot_auto_right_5 = rows[0].tot_auto_right;
              tot_auto_pyramid_intake_5 = rows[0].tot_auto_pyramid_intake;
              tot_auto_unprotected_intake_5 = rows[0].tot_auto_unprotected_intake;
              tot_auto_near_switch_made_5 = rows[0].tot_auto_near_switch_made;
              tot_auto_near_switch_attempts_5 = rows[0].tot_auto_near_switch_attempts;
              tot_auto_exchange_made_5 = rows[0].tot_auto_exchange_made;
              tot_auto_exchange_attempts_5 = rows[0].tot_auto_exchange_attempts;
              tot_auto_scale_high_made_5 = rows[0].tot_auto_scale_high_made;
              tot_auto_scale_high_attempts_5 = rows[0].tot_auto_scale_high_attempts;
              tot_auto_scale_low_made_5 = rows[0].tot_auto_scale_low_made;
              tot_auto_scale_low_attempts_5 = rows[0].tot_auto_scale_low_attempts;
              avg_tele_cubes_scored_5 = rows[0].avg_tele_cubes_scored;
              max_tele_cubes_scored_5 = rows[0].max_tele_cubes_scored;
              avg_tele_exchange_made_5 = rows[0].avg_tele_exchange_made;
              avg_tele_exchange_attempts_5 = rows[0].avg_tele_exchange_attempts;
              avg_tele_near_switch_made_5 = rows[0].avg_tele_near_switch_made;
              avg_tele_near_switch_attempts_5 = rows[0].avg_tele_near_switch_attempts;
              avg_tele_far_switch_made_5 = rows[0].avg_tele_far_switch_made;
              avg_tele_far_switch_attempts_5 = rows[0].avg_tele_far_switch_attempts;
              avg_tele_scale_high_made_5 = rows[0].avg_tele_scale_high_made;
              avg_tele_scale_high_attempts_5 = rows[0].avg_tele_scale_high_attempts;
              avg_tele_scale_low_made_5 = rows[0].avg_tele_scale_low_made;
              avg_tele_scale_low_attempts_5 = rows[0].avg_tele_scale_low_attempts;
              avg_tele_knockouts_5 = rows[0].avg_tele_knockouts;
              avg_tele_cubes_dropped_5 = rows[0].avg_tele_cubes_dropped;
              avg_tele_intake_5 = rows[0].avg_tele_intake;
              max_tele_intake_5 = rows[0].max_tele_intake;
              avg_tele_portal_intake_made_5 = rows[0].avg_tele_portal_intake_made;
              avg_tele_portal_intake_attempts_5 = rows[0].avg_tele_portal_intake_attempts;
              avg_tele_pyramid_intake_5 = rows[0].avg_tele_pyramid_intake;
              avg_tele_unprotected_intake_5 = rows[0].avg_tele_unprotected_intake;
              avg_tele_floor_intake_5 = rows[0].avg_tele_floor_intake;
              tot_tele_orderly_5 = rows[0].tot_tele_orderly;
              max_tele_highest_level_5 = rows[0].max_tele_highest_level;
              frq_tele_highest_level_5 = rows[0].frq_tele_highest_level;
              tot_tele_climb_5 = rows[0].tot_tele_climb;
              tot_tele_climb_attempts_5 = rows[0].tot_tele_climb_attempts;
              tot_tele_climb_assisted_5 = rows[0].tot_tele_climb_assisted;
              tot_tele_plus_one_5 = rows[0].tot_tele_plus_one;
              tot_tele_plus_one_attempts_5 = rows[0].tot_tele_plus_one_attempts;
              tot_tele_plus_two_5 = rows[0].tot_tele_plus_two;
              tot_tele_plus_two_attempts_5 = rows[0].tot_tele_plus_two_attempts;
              avg_driver_rating_5 = rows[0].avg_driver_rating;
              avg_defense_rating_5 = rows[0].avg_defense_rating;
      			});

            // var no_auto_sql_5 = "SELECT * FROM matches WHERE team_num='"+ team_num_5 +"'";
            // connection.query(no_auto_sql_5, function(err, rows, fields) {
            //   for(var x in rows)
            //   {
            //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
            //     {
            //       no_autos_5++;
            //     }
            //   }
      			// });
          }
          if(team_num_6 != 0) {
            updateTeams(team_num_6);

            var get_data_6 = "SELECT * FROM teams WHERE team_num='"+ team_num_6 +"'";

      			connectionRemote.query(get_data_6, function(err, rows, fields) {
              // console.log(rows[0] != undefined);
              team_name_6 = rows[0].team_name;
              num_matches_6 = rows[0].num_matches;
              tot_auto_cross_6 = rows[0].tot_auto_cross;
              tot_auto_left_6 = rows[0].tot_auto_left;
              tot_auto_center_6 = rows[0].tot_auto_center;
              tot_auto_right_6 = rows[0].tot_auto_right;
              tot_auto_pyramid_intake_6 = rows[0].tot_auto_pyramid_intake;
              tot_auto_unprotected_intake_6 = rows[0].tot_auto_unprotected_intake;
              tot_auto_near_switch_made_6 = rows[0].tot_auto_near_switch_made;
              tot_auto_near_switch_attempts_6 = rows[0].tot_auto_near_switch_attempts;
              tot_auto_exchange_made_6 = rows[0].tot_auto_exchange_made;
              tot_auto_exchange_attempts_6 = rows[0].tot_auto_exchange_attempts;
              tot_auto_scale_high_made_6 = rows[0].tot_auto_scale_high_made;
              tot_auto_scale_high_attempts_6 = rows[0].tot_auto_scale_high_attempts;
              tot_auto_scale_low_made_6 = rows[0].tot_auto_scale_low_made;
              tot_auto_scale_low_attempts_6 = rows[0].tot_auto_scale_low_attempts;
              avg_tele_cubes_scored_6 = rows[0].avg_tele_cubes_scored;
              max_tele_cubes_scored_6 = rows[0].max_tele_cubes_scored;
              avg_tele_exchange_made_6 = rows[0].avg_tele_exchange_made;
              avg_tele_exchange_attempts_6 = rows[0].avg_tele_exchange_attempts;
              avg_tele_near_switch_made_6 = rows[0].avg_tele_near_switch_made;
              avg_tele_near_switch_attempts_6 = rows[0].avg_tele_near_switch_attempts;
              avg_tele_far_switch_made_6 = rows[0].avg_tele_far_switch_made;
              avg_tele_far_switch_attempts_6 = rows[0].avg_tele_far_switch_attempts;
              avg_tele_scale_high_made_6 = rows[0].avg_tele_scale_high_made;
              avg_tele_scale_high_attempts_6 = rows[0].avg_tele_scale_high_attempts;
              avg_tele_scale_low_made_6 = rows[0].avg_tele_scale_low_made;
              avg_tele_scale_low_attempts_6 = rows[0].avg_tele_scale_low_attempts;
              avg_tele_knockouts_6 = rows[0].avg_tele_knockouts;
              avg_tele_cubes_dropped_6 = rows[0].avg_tele_cubes_dropped;
              avg_tele_intake_6 = rows[0].avg_tele_intake;
              max_tele_intake_6 = rows[0].max_tele_intake;
              avg_tele_portal_intake_made_6 = rows[0].avg_tele_portal_intake_made;
              avg_tele_portal_intake_attempts_6 = rows[0].avg_tele_portal_intake_attempts;
              avg_tele_pyramid_intake_6 = rows[0].avg_tele_pyramid_intake;
              avg_tele_unprotected_intake_6 = rows[0].avg_tele_unprotected_intake;
              avg_tele_floor_intake_6 = rows[0].avg_tele_floor_intake;
              tot_tele_orderly_6 = rows[0].tot_tele_orderly;
              max_tele_highest_level_6 = rows[0].max_tele_highest_level;
              frq_tele_highest_level_6 = rows[0].frq_tele_highest_level;
              tot_tele_climb_6 = rows[0].tot_tele_climb;
              tot_tele_climb_attempts_6 = rows[0].tot_tele_climb_attempts;
              tot_tele_climb_assisted_6 = rows[0].tot_tele_climb_assisted;
              tot_tele_plus_one_6 = rows[0].tot_tele_plus_one;
              tot_tele_plus_one_attempts_6 = rows[0].tot_tele_plus_one_attempts;
              tot_tele_plus_two_6 = rows[0].tot_tele_plus_two;
              tot_tele_plus_two_attempts_6 = rows[0].tot_tele_plus_two_attempts;
              avg_driver_rating_6 = rows[0].avg_driver_rating;
              avg_defense_rating_6 = rows[0].avg_defense_rating;
      			});

            // var no_auto_sql_6 = "SELECT * FROM matches WHERE team_num='"+ team_num_6 +"'";
            // connection.query(no_auto_sql_6, function(err, rows, fields) {
            //   for(var x in rows)
            //   {
            //     if(rows[x].auto_contrib_kpa == 0 && rows[x].auto_gears_scored == 0 && rows[x].baseline_cross == 0)
            //     {
            //       no_autos_6++;
            //     }
            //   }
      			// });
          }

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
            tot_tele_climb_1: tot_tele_climb_1,
            tot_tele_climb_attempts_1: tot_tele_climb_attempts_1,
            tot_tele_climb_assisted_1: tot_tele_climb_assisted_1,
            tot_tele_plus_one_1: tot_tele_plus_one_1,
            tot_tele_plus_one_attempts_1: tot_tele_plus_one_attempts_1,
            tot_tele_plus_two_1: tot_tele_plus_two_1,
            tot_tele_plus_two_attempts_1: tot_tele_plus_two_attempts_1,
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
            tot_tele_climb_2: tot_tele_climb_2,
            tot_tele_climb_attempts_2: tot_tele_climb_attempts_2,
            tot_tele_climb_assisted_2: tot_tele_climb_assisted_2,
            tot_tele_plus_one_2: tot_tele_plus_one_2,
            tot_tele_plus_one_attempts_2: tot_tele_plus_one_attempts_2,
            tot_tele_plus_two_2: tot_tele_plus_two_2,
            tot_tele_plus_two_attempts_2: tot_tele_plus_two_attempts_2,
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
            tot_tele_climb_3: tot_tele_climb_3,
            tot_tele_climb_attempts_3: tot_tele_climb_attempts_3,
            tot_tele_climb_assisted_3: tot_tele_climb_assisted_3,
            tot_tele_plus_one_3: tot_tele_plus_one_3,
            tot_tele_plus_one_attempts_3: tot_tele_plus_one_attempts_3,
            tot_tele_plus_two_3: tot_tele_plus_two_3,
            tot_tele_plus_two_attempts_3: tot_tele_plus_two_attempts_3,
            avg_driver_rating_3: avg_driver_rating_3,
            avg_defense_rating_3: avg_defense_rating_3,
            most_recent_match_3: most_recent_match_3,

            team_num_4: team_num_4,
            team_name_4: team_name_4,
            num_matches_4: num_matches_4,
            tot_auto_cross_4: tot_auto_cross_4,
            tot_auto_left_4: tot_auto_left_4,
            tot_auto_center_4: tot_auto_center_4,
            tot_auto_right_4: tot_auto_right_4,
            tot_auto_pyramid_intake_4: tot_auto_pyramid_intake_4,
            tot_auto_unprotected_intake_4: tot_auto_unprotected_intake_4,
            tot_auto_near_switch_made_4: tot_auto_near_switch_made_4,
            tot_auto_near_switch_attempts_4: tot_auto_near_switch_attempts_4,
            tot_auto_exchange_made_4: tot_auto_exchange_made_4,
            tot_auto_exchange_attempts_4: tot_auto_exchange_attempts_4,
            tot_auto_scale_high_made_4: tot_auto_scale_high_made_4,
            tot_auto_scale_high_attempts_4: tot_auto_scale_high_attempts_4,
            tot_auto_scale_low_made_4: tot_auto_scale_low_made_4,
            tot_auto_scale_low_attempts_4: tot_auto_scale_low_attempts_4,
            avg_tele_cubes_scored_4: avg_tele_cubes_scored_4,
            max_tele_cubes_scored_4: max_tele_cubes_scored_4,
            avg_tele_exchange_made_4: avg_tele_exchange_made_4,
            avg_tele_exchange_attempts_4: avg_tele_exchange_attempts_4,
            avg_tele_near_switch_made_4: avg_tele_near_switch_made_4,
            avg_tele_near_switch_attempts_4: avg_tele_near_switch_attempts_4,
            avg_tele_far_switch_made_4: avg_tele_far_switch_made_4,
            avg_tele_far_switch_attempts_4: avg_tele_far_switch_attempts_4,
            avg_tele_scale_high_made_4: avg_tele_scale_high_made_4,
            avg_tele_scale_high_attempts_4: avg_tele_scale_high_attempts_4,
            avg_tele_scale_low_made_4: avg_tele_scale_low_made_4,
            avg_tele_scale_low_attempts_4: avg_tele_scale_low_attempts_4,
            avg_tele_knockouts_4: avg_tele_knockouts_4,
            avg_tele_cubes_dropped_4: avg_tele_cubes_dropped_4,
            avg_tele_intake_4: avg_tele_intake_4,
            max_tele_intake_4: max_tele_intake_4,
            avg_tele_portal_intake_made_4: avg_tele_portal_intake_made_4,
            avg_tele_portal_intake_attempts_4: avg_tele_portal_intake_attempts_4,
            avg_tele_pyramid_intake_4: avg_tele_pyramid_intake_4,
            avg_tele_unprotected_intake_4: avg_tele_unprotected_intake_4,
            avg_tele_floor_intake_4: avg_tele_floor_intake_4,
            tot_tele_orderly_4: tot_tele_orderly_4,
            max_tele_highest_level_4: max_tele_highest_level_4,
            frq_tele_highest_level_4: frq_tele_highest_level_4,
            tot_tele_climb_4: tot_tele_climb_4,
            tot_tele_climb_attempts_4: tot_tele_climb_attempts_4,
            tot_tele_climb_assisted_4: tot_tele_climb_assisted_4,
            tot_tele_plus_one_4: tot_tele_plus_one_4,
            tot_tele_plus_one_attempts_4: tot_tele_plus_one_attempts_4,
            tot_tele_plus_two_4: tot_tele_plus_two_4,
            tot_tele_plus_two_attempts_4: tot_tele_plus_two_attempts_4,
            avg_driver_rating_4: avg_driver_rating_4,
            avg_defense_rating_4: avg_defense_rating_4,
            most_recent_match_4: most_recent_match_4,

            team_num_5: team_num_5,
            team_name_5: team_name_5,
            num_matches_5: num_matches_5,
            tot_auto_cross_5: tot_auto_cross_5,
            tot_auto_left_5: tot_auto_left_5,
            tot_auto_center_5: tot_auto_center_5,
            tot_auto_right_5: tot_auto_right_5,
            tot_auto_pyramid_intake_5: tot_auto_pyramid_intake_5,
            tot_auto_unprotected_intake_5: tot_auto_unprotected_intake_5,
            tot_auto_near_switch_made_5: tot_auto_near_switch_made_5,
            tot_auto_near_switch_attempts_5: tot_auto_near_switch_attempts_5,
            tot_auto_exchange_made_5: tot_auto_exchange_made_5,
            tot_auto_exchange_attempts_5: tot_auto_exchange_attempts_5,
            tot_auto_scale_high_made_5: tot_auto_scale_high_made_5,
            tot_auto_scale_high_attempts_5: tot_auto_scale_high_attempts_5,
            tot_auto_scale_low_made_5: tot_auto_scale_low_made_5,
            tot_auto_scale_low_attempts_5: tot_auto_scale_low_attempts_5,
            avg_tele_cubes_scored_5: avg_tele_cubes_scored_5,
            max_tele_cubes_scored_5: max_tele_cubes_scored_5,
            avg_tele_exchange_made_5: avg_tele_exchange_made_5,
            avg_tele_exchange_attempts_5: avg_tele_exchange_attempts_5,
            avg_tele_near_switch_made_5: avg_tele_near_switch_made_5,
            avg_tele_near_switch_attempts_5: avg_tele_near_switch_attempts_5,
            avg_tele_far_switch_made_5: avg_tele_far_switch_made_5,
            avg_tele_far_switch_attempts_5: avg_tele_far_switch_attempts_5,
            avg_tele_scale_high_made_5: avg_tele_scale_high_made_5,
            avg_tele_scale_high_attempts_5: avg_tele_scale_high_attempts_5,
            avg_tele_scale_low_made_5: avg_tele_scale_low_made_5,
            avg_tele_scale_low_attempts_5: avg_tele_scale_low_attempts_5,
            avg_tele_knockouts_5: avg_tele_knockouts_5,
            avg_tele_cubes_dropped_5: avg_tele_cubes_dropped_5,
            avg_tele_intake_5: avg_tele_intake_5,
            max_tele_intake_5: max_tele_intake_5,
            avg_tele_portal_intake_made_5: avg_tele_portal_intake_made_5,
            avg_tele_portal_intake_attempts_5: avg_tele_portal_intake_attempts_5,
            avg_tele_pyramid_intake_5: avg_tele_pyramid_intake_5,
            avg_tele_unprotected_intake_5: avg_tele_unprotected_intake_5,
            avg_tele_floor_intake_5: avg_tele_floor_intake_5,
            tot_tele_orderly_5: tot_tele_orderly_5,
            max_tele_highest_level_5: max_tele_highest_level_5,
            frq_tele_highest_level_5: frq_tele_highest_level_5,
            tot_tele_climb_5: tot_tele_climb_5,
            tot_tele_climb_attempts_5: tot_tele_climb_attempts_5,
            tot_tele_climb_assisted_5: tot_tele_climb_assisted_5,
            tot_tele_plus_one_5: tot_tele_plus_one_5,
            tot_tele_plus_one_attempts_5: tot_tele_plus_one_attempts_5,
            tot_tele_plus_two_5: tot_tele_plus_two_5,
            tot_tele_plus_two_attempts_5: tot_tele_plus_two_attempts_5,
            avg_driver_rating_5: avg_driver_rating_5,
            avg_defense_rating_5: avg_defense_rating_5,
            most_recent_match_5: most_recent_match_5,

            team_num_6: team_num_6,
            team_name_6: team_name_6,
            num_matches_6: num_matches_6,
            tot_auto_cross_6: tot_auto_cross_6,
            tot_auto_left_6: tot_auto_left_6,
            tot_auto_center_6: tot_auto_center_6,
            tot_auto_right_6: tot_auto_right_6,
            tot_auto_pyramid_intake_6: tot_auto_pyramid_intake_6,
            tot_auto_unprotected_intake_6: tot_auto_unprotected_intake_6,
            tot_auto_near_switch_made_6: tot_auto_near_switch_made_6,
            tot_auto_near_switch_attempts_6: tot_auto_near_switch_attempts_6,
            tot_auto_exchange_made_6: tot_auto_exchange_made_6,
            tot_auto_exchange_attempts_6: tot_auto_exchange_attempts_6,
            tot_auto_scale_high_made_6: tot_auto_scale_high_made_6,
            tot_auto_scale_high_attempts_6: tot_auto_scale_high_attempts_6,
            tot_auto_scale_low_made_6: tot_auto_scale_low_made_6,
            tot_auto_scale_low_attempts_6: tot_auto_scale_low_attempts_6,
            avg_tele_cubes_scored_6: avg_tele_cubes_scored_6,
            max_tele_cubes_scored_6: max_tele_cubes_scored_6,
            avg_tele_exchange_made_6: avg_tele_exchange_made_6,
            avg_tele_exchange_attempts_6: avg_tele_exchange_attempts_6,
            avg_tele_near_switch_made_6: avg_tele_near_switch_made_6,
            avg_tele_near_switch_attempts_6: avg_tele_near_switch_attempts_6,
            avg_tele_far_switch_made_6: avg_tele_far_switch_made_6,
            avg_tele_far_switch_attempts_6: avg_tele_far_switch_attempts_6,
            avg_tele_scale_high_made_6: avg_tele_scale_high_made_6,
            avg_tele_scale_high_attempts_6: avg_tele_scale_high_attempts_6,
            avg_tele_scale_low_made_6: avg_tele_scale_low_made_6,
            avg_tele_scale_low_attempts_6: avg_tele_scale_low_attempts_6,
            avg_tele_knockouts_6: avg_tele_knockouts_6,
            avg_tele_cubes_dropped_6: avg_tele_cubes_dropped_6,
            avg_tele_intake_6: avg_tele_intake_6,
            max_tele_intake_6: max_tele_intake_6,
            avg_tele_portal_intake_made_6: avg_tele_portal_intake_made_6,
            avg_tele_portal_intake_attempts_6: avg_tele_portal_intake_attempts_6,
            avg_tele_pyramid_intake_6: avg_tele_pyramid_intake_6,
            avg_tele_unprotected_intake_6: avg_tele_unprotected_intake_6,
            avg_tele_floor_intake_6: avg_tele_floor_intake_6,
            tot_tele_orderly_6: tot_tele_orderly_6,
            max_tele_highest_level_6: max_tele_highest_level_6,
            frq_tele_highest_level_6: frq_tele_highest_level_6,
            tot_tele_climb_6: tot_tele_climb_6,
            tot_tele_climb_attempts_6: tot_tele_climb_attempts_6,
            tot_tele_climb_assisted_6: tot_tele_climb_assisted_6,
            tot_tele_plus_one_6: tot_tele_plus_one_6,
            tot_tele_plus_one_attempts_6: tot_tele_plus_one_attempts_6,
            tot_tele_plus_two_6: tot_tele_plus_two_6,
            tot_tele_plus_two_attempts_6: tot_tele_plus_two_attempts_6,
            avg_driver_rating_6: avg_driver_rating_6,
            avg_defense_rating_6: avg_defense_rating_6,
            most_recent_match_6: most_recent_match_6
          });
        }
      // }
	});

  router.get("/alliance-ppt/:team_1,:team_2,:team_3,:team_4,:team_5,:team_6", ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    var team_num_1 = req.params.team_1;
    var team_num_2 = req.params.team_2;
    var team_num_3 = req.params.team_3;
    var team_num_4 = req.params.team_4;
    var team_num_5 = req.params.team_5;
    var team_num_6 = req.params.team_6;
    res.download(__dirname + "/alliances/alliance_" + team_num_1 + "_" + team_num_2 + "_" + team_num_3 + "_"
                    + team_num_4 + "_" + team_num_5 + "_" + team_num_6 + ".pptx");
  });

  router.get('/match/:match_num', ensureLogin.ensureLoggedIn('/login'), function(req, res) {
    res.render('pages/match', { req: req });
  });

  router.get('/team/:team_num', ensureLogin.ensureLoggedIn('/login'), function(req,res) {
    // stdevGears(req.params.team_num);
    updateRanks();

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
    var avg_tele_scale_low_made = 0;
    var avg_tele_scale_low_attempts = 0;
    var avg_tele_knockouts = 0;
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
    var total_cubes_trend = "";
    var trend_labels = "";

//updateContribScores(team_num);
    updateTeams(team_num);


    var get_data = "SELECT * FROM teams WHERE team_num="+ team_num +"";
    var next_team = "SELECT * FROM teams WHERE team_num > "+ team_num +" ORDER BY team_num LIMIT 1";
    var previous_team = "SELECT * FROM teams WHERE team_num < "+ team_num +" ORDER BY team_num DESC LIMIT 1";
    var get_graph_data = "SELECT * FROM matches WHERE team_num="+ team_num +" ORDER BY match_num";

    if(process.argv[2])
    {
      connectionLocal.query(get_data, function(err, rows, fields) {
        // console.log(rows);
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
        avg_tele_scale_low_made = rows[0].avg_tele_scale_low_made;
        avg_tele_scale_low_attempts = rows[0].avg_tele_scale_low_attempts;
        avg_tele_knockouts = rows[0].avg_tele_knockouts;
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
        tot_tele_climb_assisted = rows[0].tot_tele_climb_assisted;
        tot_tele_plus_one = rows[0].tot_tele_plus_one;
        tot_tele_plus_one_attempts = rows[0].tot_tele_plus_one_attempts;
        tot_tele_plus_two = rows[0].tot_tele_plus_two;
        tot_tele_plus_two_attempts = rows[0].tot_tele_plus_two_attempts;
        avg_driver_rating = rows[0].avg_driver_rating;
        avg_defense_rating = rows[0].avg_defense_rating;

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
        // console.log(rows);
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
          total_cubes_trend += Number(rows[x].tele_near_switch_made + rows[x].tele_far_switch_made + rows[x].tele_scale_high_made + rows[x].tele_scale_low_made + rows[x].tele_exchange_made) + ", ";
          trend_labels += rows[x].match_num + ", ";
        }
        // console.log(total_intake_trend);
        // console.log();

      });

      var dir = __dirname + "\\public\\videos";
      var files = null;

      fs.readdir(dir, function(err, files) {
        if(err) { console.log(err); return; }
        files = files.map(function (fileName) {
          return {
            name: fileName,
            time: fs.statSync(dir + '/' + fileName).mtime.getTime()
          };
        })
        .sort(function (a, b) {
          return Number(Number(a.name.substring(4,8)) - Number(b.name.substring(4,8))); })
        .map(function (v) {
          return v.name; });
        });

        // console.log(files);

        var match_sql = "SELECT match_num FROM matches WHERE team_num = " + team_num;
        connectionLocal.query(match_sql, function(err, rows, fields) {
          for(var x in rows) {
            // console.log(x % 2 === 0);// + ", " + x % 2 === 1 + ", " + x + 1 >= rows.size + ", " + rows.size + ", " + x);
            // console.log(x % 2 === 1);
            // console.log((Number(x) + 1) >= rows.length);
            // console.log(rows.length);
            // console.log(x);
            if(x % 2 === 0) {
              // console.log("first in a row");
              videos += "<div class=\"row\">";
            }
            videos += "<div class=\"col-lg-6\"><video width=\"480\" height=\"360\" controls><source src=\"../videos/" + files[rows[x].match_num] + "\" type=\"video/mp4\"/></video><h4>Match " + rows[x].match_num + "</h4></div>";
            if(x % 2 === 1 || (Number(x) + 1) >= rows.length) {
              // console.log("last in a row");
              videos += "</div>";
            }
          }

          // var tele_gear_ranked = tele_gear_rank[team_num];
          // var auto_gear_ranked = auto_gear_rank[team_num];
          // var climb_ranked = climb_rank[team_num];

          // console.log(videos);
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
            avg_tele_scale_low_made: avg_tele_scale_low_made,
            avg_tele_scale_low_attempts: avg_tele_scale_low_attempts,
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
            total_cubes_trend: total_cubes_trend,
            trend_labels: trend_labels
          });
        });
      });
    }
    else
    {
      connectionRemote.query(get_data, function(err, rows, fields) {
        // console.log(rows);
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
        avg_tele_scale_low_made = rows[0].avg_tele_scale_low_made;
        avg_tele_scale_low_attempts = rows[0].avg_tele_scale_low_attempts;
        avg_tele_knockouts = rows[0].avg_tele_knockouts;
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
        tot_tele_climb_assisted = rows[0].tot_tele_climb_assisted;
        tot_tele_plus_one = rows[0].tot_tele_plus_one;
        tot_tele_plus_one_attempts = rows[0].tot_tele_plus_one_attempts;
        tot_tele_plus_two = rows[0].tot_tele_plus_two;
        tot_tele_plus_two_attempts = rows[0].tot_tele_plus_two_attempts;
        avg_driver_rating = rows[0].avg_driver_rating;
        avg_defense_rating = rows[0].avg_defense_rating;

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
      connectionRemote.query(get_last_team_sql, function(err, rows, fields) {
         last_team = rows[0].team_num;
      });
      connectionRemote.query(get_first_team_sql, function(err, rows, fields) {
        first_team = rows[0].team_num;
      });

      connectionRemote.query(next_team, function(err, rows, fields) {
        if(team_num == last_team)
          next_team_num = first_team;
        else
          next_team_num = rows[0].team_num;
      });

      connectionRemote.query(previous_team, function(err, rows, fields) {
        if(team_num == first_team)
          previous_team_num = last_team;
        else
          previous_team_num = rows[0].team_num;
      });

      connectionRemote.query(get_graph_data, function(err, rows, fields){
        // console.log(rows);
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
          total_cubes_trend += Number(rows[x].tele_near_switch_made + rows[x].tele_far_switch_made + rows[x].tele_scale_high_made + rows[x].tele_scale_low_made + rows[x].tele_exchange_made) + ", ";
          trend_labels += rows[x].match_num + ", ";
        }
        // console.log(total_intake_trend);
        // console.log();

      });

      var dir = __dirname + "\\public\\videos";
      var files = null;

  /*    fs.readdir(dir, function(err, files) {
        if(err) { console.log(err); return; }
        files = files.map(function (fileName) {
          return {
            name: fileName,
            time: fs.statSync(dir + '/' + fileName).mtime.getTime()
          };
        })
        .sort(function (a, b) {
          // return a.time - b.time; })
          // console.log(b.name.substring(4,8));
          // console.log(a.name.substring(4,8));
          return Number(Number(a.name.substring(4,8)) - Number(b.name.substring(4,8))); })
        .map(function (v) {
          return v.name; });*/

        // console.log(files);

        // var match_sql = "SELECT match_num FROM matches WHERE team_num = " + team_num;
        // connection.query(match_sql, function(err, rows, fields) {
          /*for(var x in rows) {
            // console.log(x % 2 === 0);// + ", " + x % 2 === 1 + ", " + x + 1 >= rows.size + ", " + rows.size + ", " + x);
            // console.log(x % 2 === 1);
            // console.log((Number(x) + 1) >= rows.length);
            // console.log(rows.length);
            // console.log(x);
            if(x % 2 === 0) {
              // console.log("first in a row");
              videos += "<div class=\"row\">";
            }
            videos += "<div class=\"col-lg-6\"><video width=\"480\" height=\"360\" controls><source src=\"../videos/" + files[rows[x].match_num] + "\" type=\"video/mp4\"/></video><h4>Match " + rows[x].match_num + "</h4></div>";
            if(x % 2 === 1 || (Number(x) + 1) >= rows.length) {
              // console.log("last in a row");
              videos += "</div>";
            }
          }*/

          // var tele_gear_ranked = tele_gear_rank[team_num];
          // var auto_gear_ranked = auto_gear_rank[team_num];
          // var climb_ranked = climb_rank[team_num];

          // console.log(videos);
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
            avg_tele_scale_low_made: avg_tele_scale_low_made,
            avg_tele_scale_low_attempts: avg_tele_scale_low_attempts,
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
            total_cubes_trend: total_cubes_trend,
            trend_labels: trend_labels
          });
        });
      // });
    }
  });

  router.get('/data-entry', ensureLogin.ensureLoggedIn('/login'), function(req, res) {
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

  router.post('/parse-data', ensureLogin.ensureLoggedIn('/login'), function(req, res) {
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
    var auto_scale_low_made = Number(req.body.auto_scale_low_made);
    var auto_scale_low_missed = Number(req.body.auto_scale_low_missed);
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
    var tele_cubes_dropped = Number(req.body.tele_cubes_dropped);
    var tele_highest_level = Number(req.body.tele_highest_level);
    var tele_orderly = Number(req.body.tele_orderly);
    var tele_climb = Number(req.body.tele_climb);
    var tele_climb_failed = Number(req.body.tele_climb_failed);
    var tele_plus_one = Number(req.body.tele_plus_one);
    var tele_plus_one_failed = Number(req.body.tele_plus_one_failed);
    var tele_plus_two = Number(req.body.tele_plus_two);
    var tele_plus_two_failed = Number(req.body.tele_plus_two_failed);
    var tele_climb_assisted = Number(req.body.tele_climb_assisted);
    var driver_rating = Number(req.body.driver_rating);
    var defense_rating = Number(req.body.defense_rating);

    var matches_sql_v2 = "INSERT INTO `matches` (`match_num`, `team_num`, `auto_position`, `auto_cross`, `auto_pyramid_intake`, "
      + "`auto_unprotected_intake`, `auto_near_switch_made`, `auto_near_switch_missed`, `auto_scale_high_made`, `auto_scale_high_missed`, "
      + "`auto_scale_low_made`, `auto_scale_low_missed`, `auto_exchange_made`, `auto_exchange_missed`, `tele_floor_intake`, "
      + "`tele_portal_intake_made`, `tele_portal_intake_missed`, `tele_pyramid_intake`, `tele_unprotected_intake`, "
      + "`tele_exchange_made`, `tele_exchange_missed`, `tele_scale_high_made`, `tele_scale_high_missed`, `tele_scale_low_made`, "
      + "`tele_scale_low_missed`, `tele_near_switch_made`, `tele_near_switch_missed`, `tele_far_switch_made`, `tele_far_switch_missed`, "
      + "`tele_knockouts`, `tele_cubes_dropped`, `tele_highest_level`, `tele_orderly`, `tele_climb`, `tele_climb_failed`, "
      + "`tele_plus_one`, `tele_plus_one_failed`, `tele_plus_two`, `tele_plus_two_failed`, `tele_climb_assisted`, `driver_rating`, "
      + "`defense_rating`) VALUES (" + match_num + ", " + team_num + ", '" + auto_position + "', " + auto_cross + ", "
      + auto_pyramid_intake + ", " + auto_unprotected_intake + ", " + auto_near_switch_made + ", " + auto_near_switch_missed + ", "
      + auto_scale_high_made + ", " + auto_scale_high_missed + ", " + auto_scale_low_made + ", " + auto_scale_low_missed + ", "
      + auto_exchange_made + ", " + auto_exchange_missed + ", " + tele_floor_intake + ", " + tele_portal_intake_made + ", "
      + tele_portal_intake_missed + ", " + tele_pyramid_intake + ", " + tele_unprotected_intake + ", " + tele_exchange_made + ", "
      + tele_exchange_missed + ", " + tele_scale_high_made + ", " + tele_scale_high_missed + ", " + tele_scale_low_made + ", "
      + tele_scale_low_missed + ", " + tele_near_switch_made + ", " + tele_near_switch_missed + ", " + tele_far_switch_made + ", "
      + tele_far_switch_missed + ", " + tele_knockouts + ", " + tele_cubes_dropped + ", " + tele_highest_level + ", "
      + tele_orderly + ", " + tele_climb + ", " + tele_climb_failed + ", " + tele_plus_one + ", " + tele_plus_one_failed + ", "
      + tele_plus_two + ", " + tele_plus_two_failed + ", " + tele_climb_assisted + ", " + driver_rating + ", " + defense_rating + ")";
      // console.log(matches_sql_v2);
    if(process.argv[2] && process.argv[2] === 'local')
    {
      connectionLocal.query("SELECT * FROM matches WHERE match_num=" + match_num, function(err, rows) {
        num_matches = rows.length + 1 || 1;
        connectionLocal.query(matches_sql_v2, function(err) {
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
    }
    else if(process.argv[2] && process.argv[2] === 'tee')
    {
      connectionLocal.query("SELECT * FROM matches WHERE match_num=" + match_num, function(err, rows) {
        num_matches = rows.length + 1 || 1;
        connectionLocal.query(matches_sql_v2, function(err) {
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
        });
      });
      connectionRemote.query("SELECT * FROM matches WHERE match_num=" + match_num, function(err, rows) {
        num_matches = rows.length + 1 || 1;
        connectionRemote.query(matches_sql_v2, function(err) {
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
    }
    else
    {
      connectionRemote.query("SELECT * FROM matches WHERE match_num=" + match_num, function(err, rows) {
        num_matches = rows.length + 1 || 1;
        connectionRemote.query(matches_sql_v2, function(err) {
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
    }
  });


  function stdevGears(team_num)
  {
    var stdev1 = 0;
    var stdev2 = 0;
    var mean = 0;
    var dev1 = [];
    var dev2 = [];
    var stdev_sql = "SELECT STD(tele_gears_scored) AS \"stdev\" FROM matches WHERE team_num=" + team_num;
    connection.query(stdev_sql, function(err, rows) {
      stdev1 = rows[0].stdev;
    });
    var avg_sql = "SELECT AVG(tele_gears_scored) AS \"avg_gears\" FROM matches WHERE team_num=" + team_num;
    connection.query(avg_sql, function(err, rows) {
      mean = rows[0].avg_gears;
    });
    var matches_sql = "SELECT tele_gears_scored FROM matches WHERE team_num=" + team_num;
    connection.query(matches_sql, function(err, rows) {
      for(var x in rows)
      {
        dev1[x] = Math.abs(mean - rows[x].tele_gears_scored);
        dev2[x] = Math.abs(stdev1 - dev1[x]);
        stdev2 += (dev2[x] * dev2[x]);
        // console.log(dev1[x]);
        // console.log(dev2[x]);
      }
      stdev2 /= rows.length;
      stdev2 = Math.sqrt(stdev2);
      console.log(stdev1);
      console.log(stdev2);
    });
  }

  function updateRanks()
  {
    var tele_gear_sql = "SELECT * FROM teams ORDER BY avg_tele_gears_scored DESC";
    connection.query(tele_gear_sql, function(err, rows) {
      for(var x in rows)
      {
        // console.log(x);
        tele_gear_rank[rows[x].team_num] = Number(x) + 1;
      }
      // console.log(tele_gear_rank[3008]);
    });

    var auto_gear_sql = "SELECT * FROM teams ORDER BY tot_auto_gears_scored DESC";
    connection.query(auto_gear_sql, function(err, rows) {
      for(var x in rows)
      {
        // console.log(x);
        auto_gear_rank[rows[x].team_num] = Number(x) + 1;
      }
      // console.log(tele_gear_rank[118]);
    });

    var climb_sql = "SELECT * FROM teams ORDER BY avg_climb_rating DESC";
    connection.query(climb_sql, function(err, rows) {
      for(var x in rows)
      {
        // console.log(x);
        climb_rank[rows[x].team_num] = Number(x) + 1;
      }
      // console.log(tele_gear_rank[118]);
    });
  }

  function updateTeams(team_num)
  {
    //  console.log("updating data into teams for team: " + team_num);
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
      // "std_auto_high_made=(SELECT STD(auto_high_made) FROM matches WHERE team_num=" + team_num + "), " +
      // "cst_auto_high_made=avg_auto_high_made/std_auto_high_made, " +

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
      // "std_tele_high_made=(SELECT STD(tele_high_made) FROM matches WHERE team_num=" + team_num + "), " +
      // "cst_tele_high_made=avg_tele_high_made/std_tele_high_made, " +

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
//      "std_tele_gears_scored=(SELECT STD(tele_gears_scored) FROM matches WHERE team_num=" + team_num + "), " +
//      "cst_tele_gears_scored=avg_tele_gears_scored/std_tele_gears_scored, " +

      "perc_tele_scale_low_made=100*(SELECT SUM(tele_scale_low_made)/(SUM(tele_scale_low_missed)+SUM(tele_scale_low_made)) FROM matches WHERE team_num=" + team_num + "), " +
      "tot_tele_scale_low_made=(SELECT SUM(tele_scale_low_made) FROM matches WHERE team_num=" + team_num + "), " +
      "tot_tele_scale_low_attempts=(SELECT SUM(tele_scale_low_made)+SUM(tele_scale_low_missed) FROM matches WHERE team_num=" + team_num + "), " +
      "avg_tele_scale_low_made=(SELECT AVG(tele_scale_low_made) FROM matches WHERE team_num=" + team_num + "), " +
      "avg_tele_scale_low_attempts=(SELECT AVG(tele_scale_low_made+tele_scale_low_missed) FROM matches WHERE team_num=" + team_num + "), " +

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

      "tot_tele_cubes_dropped=(SELECT SUM(tele_cubes_dropped) FROM matches WHERE team_num=" + team_num + "), " +
      "avg_tele_cubes_dropped=(SELECT AVG(tele_cubes_dropped) FROM matches WHERE team_num=" + team_num + "), " +

      "max_tele_highest_level=(SELECT tele_highest_level FROM matches WHERE team_num=" + team_num + " ORDER BY tele_highest_level DESC LIMIT 1), " +
      "frq_tele_highest_level=(SELECT COUNT(*) FROM matches WHERE tele_highest_level=max_tele_highest_level AND team_num=" + team_num + "), " +

      "tot_tele_orderly=(SELECT SUM(tele_orderly) FROM matches WHERE team_num=" + team_num + "), " +

      "perc_tele_climb=100*((SELECT SUM(tele_climb) FROM matches WHERE team_num=" + team_num + ")/(SELECT SUM(tele_climb)+SUM(tele_climb_failed) FROM matches WHERE team_num=" + team_num + ")), " +
      "tot_tele_climb=(SELECT SUM(tele_climb) FROM matches WHERE team_num=" + team_num + "), " +
      "tot_tele_climb_attempts=(SELECT SUM(tele_climb+tele_climb_failed)+SUM(tele_climb) FROM matches WHERE team_num=" + team_num + "), " +

      "perc_tele_plus_one=100*((SELECT SUM(tele_plus_one) FROM matches WHERE team_num=" + team_num + ")/(SELECT SUM(tele_plus_one)+SUM(tele_plus_one_failed) FROM matches WHERE team_num=" + team_num + ")), " +
      "tot_tele_plus_one=(SELECT SUM(tele_plus_one) FROM matches WHERE team_num=" + team_num + "), " +
      "tot_tele_plus_one_attempts=(SELECT SUM(tele_plus_one+tele_plus_one_failed) FROM matches WHERE team_num=" + team_num + "), " +

      "perc_tele_plus_two=100*((SELECT SUM(tele_plus_two) FROM matches WHERE team_num=" + team_num + ")/(SELECT SUM(tele_plus_two)+SUM(tele_plus_two_failed) FROM matches WHERE team_num=" + team_num + ")), " +
      "tot_tele_plus_two=(SELECT SUM(tele_plus_two) FROM matches WHERE team_num=" + team_num + "), " +
      "tot_tele_plus_two_attempts=(SELECT SUM(tele_plus_two+tele_plus_two_failed) FROM matches WHERE team_num=" + team_num + "), " +

      "tot_tele_climb_assisted=(SELECT AVG(tele_climb_assisted) FROM matches WHERE team_num=" + team_num + "), " +

      "avg_driver_rating=(SELECT AVG(driver_rating) FROM matches WHERE team_num=" + team_num + "), " +
      "avg_defense_rating=(SELECT AVG(defense_rating) FROM matches WHERE team_num=" + team_num + " AND defense_rating<>0), " +
      "alliance_rating=(avg_tele_cubes_scored+avg_tele_intake) " +

      "WHERE team_num=" + team_num;

      if(process.argv[2] && process.argv[2] === 'local')
      {
        connectionLocal.query(team_sql, function(err) {
          if(err)
            console.log(err);
        });
      }
      else if(process.argv[2] && process.argv[2] === 'tee')
      {
        connectionLocal.query(team_sql, function(err) {
          if(err)
            console.log(err);
        });
        connectionRemote.query(team_sql, function(err) {
          if(err)
            console.log(err);
        });
      }
      else
      {
        connectionRemote.query(team_sql, function(err) {
          if(err)
            console.log(err);
        });
      }
      // var next_sql = "UPDATE teams SET total_auto_crossings=((SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='PC' AND auton_defense_total<>'0') + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='CF' AND auton_defense_total<>'0') + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='M' AND auton_defense_total<>'0')  + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='R' AND auton_defense_total<>'0')  + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='DB' AND auton_defense_total<>'0') + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='SP' AND auton_defense_total<>'0') + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='RW' AND auton_defense_total<>'0') + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='RT' AND auton_defense_total<>'0') + (SELECT COUNT(*) FROM matches WHERE team_num='"+ team_num +"' AND auton_defense_crossed='LB' AND auton_defense_total<>'0')) WHERE team_num='"+ team_num +"'";

      // connection.query(next_sql, function(err) {
      //     console.log(err);
      //
      // });
  }


}


module.exports = REST_ROUTER;
