var team = require('./team.js')

function loadIndex(connectionLocal, req, callback)
{
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
      team.updateTeams(connectionLocal, rows[x].team_num);
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
    callback({
      req: req,
      team_list: team_list,
      score_list: score_list,
      rating_list: rating_list,
    });
  });
}

function sqlQuery(connectionLocal, req, callback)
{
  var sql = req.body.query;
  var query_res = "";
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
    callback(query_res, query_bool);
  });
}

function exportData(connectionLocal, res, fs)
{
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
}

function getEvents(tba, req, callback)
{
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
    
    callback({
      req: req,
      events: events
    });
  });
}

function loadEvent(connectionLocal, req, callback)
{
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
            callback();
          });
        });
      });
    });
  });
}

module.exports = {
  loadIndex: loadIndex,
  sqlQuery: sqlQuery,
  exportData: exportData,
  getEvents: getEvents,
  loadEvent: loadEvent, 
}