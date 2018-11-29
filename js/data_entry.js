var team = require('./team.js')

function parseData(connectionLocal, req, callback)
{
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

  var most_recent = -1;
  var most_recent_match = -1;
  var num_matches = 0;
  connectionLocal.query("SELECT * FROM matches WHERE match_num=" + match_num, function(err, rows) {
    num_matches = rows.length + 1 || 1;
    connectionLocal.query(put_data_sql, function(err) {
      if(err)
      {
        most_recent = -1;
        most_recent_match = -1;
        team.updateTeams(connectionLocal, team_num);
        console.log(err);
      }
      else
      {
        most_recent = team_num;
        most_recent_match = match_num;
        team.updateTeams(connectionLocal, team_num);
      }
      callback(most_recent, most_recent_match, num_matches);
    });
  });
}

module.exports = {
  parseData: parseData
}