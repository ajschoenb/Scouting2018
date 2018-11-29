function getTeamData(connectionLocal, req, team_num, callback)
{
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

  updateTeams(connectionLocal, team_num);

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

    callback({
      req: req,
      skip_render: skip_render,
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
  });
}

function updateTeams(connectionLocal, team_num) {
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

module.exports = {
  getTeamData: getTeamData,
  updateTeams: updateTeams
}