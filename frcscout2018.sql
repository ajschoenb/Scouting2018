-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 22, 2018 at 05:33 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `frcscout2018`
--

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `match_num` int(11) NOT NULL,
  `team_num` int(11) NOT NULL,
  `auto_position` varchar(255) NOT NULL,
  `auto_cross` int(11) NOT NULL,
  `auto_pyramid_intake` int(11) NOT NULL,
  `auto_unprotected_intake` int(11) NOT NULL,
  `auto_near_switch_made` int(11) NOT NULL,
  `auto_near_switch_missed` int(11) NOT NULL,
  `auto_scale_high_made` int(11) NOT NULL,
  `auto_scale_high_missed` int(11) NOT NULL,
  `auto_scale_low_made` int(11) NOT NULL,
  `auto_scale_low_missed` int(11) NOT NULL,
  `auto_exchange_made` int(11) NOT NULL,
  `auto_exchange_missed` int(11) NOT NULL,
  `tele_floor_intake` int(11) NOT NULL,
  `tele_portal_intake_made` int(11) NOT NULL,
  `tele_portal_intake_missed` int(11) NOT NULL,
  `tele_pyramid_intake` int(11) NOT NULL,
  `tele_unprotected_intake` int(11) NOT NULL,
  `tele_exchange_made` int(11) NOT NULL,
  `tele_exchange_missed` int(11) NOT NULL,
  `tele_scale_high_made` int(11) NOT NULL,
  `tele_scale_high_missed` int(11) NOT NULL,
  `tele_scale_low_made` int(11) NOT NULL,
  `tele_scale_low_missed` int(11) NOT NULL,
  `tele_near_switch_made` int(11) NOT NULL,
  `tele_near_switch_missed` int(11) NOT NULL,
  `tele_far_switch_made` int(11) NOT NULL,
  `tele_far_switch_missed` int(11) NOT NULL,
  `tele_knockouts` int(11) NOT NULL,
  `tele_cubes_dropped` int(11) NOT NULL,
  `tele_highest_level` int(11) NOT NULL,
  `tele_orderly` int(11) NOT NULL,
  `tele_climb` int(11) NOT NULL,
  `tele_climb_failed` int(11) NOT NULL,
  `tele_plus_one` int(11) NOT NULL,
  `tele_plus_one_failed` int(11) NOT NULL,
  `tele_plus_two` int(11) NOT NULL,
  `tele_plus_two_failed` int(11) NOT NULL,
  `tele_climb_assisted` int(11) NOT NULL,
  `tele_platform` int(11) NOT NULL,
  `avg_tele_pyramid_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_pyramid_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_pyramid_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_pyramid_exchange_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_exchange_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_exchange_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_exchange_cycle` decimal(11,3) NOT NULL,
  `tot_tele_pyramid_scale_cycle` int(11) NOT NULL,
  `tot_tele_pyramid_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_pyramid_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_pyramid_exchange_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_scale_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_exchange_cycle` int(11) NOT NULL,
  `tot_tele_portal_scale_cycle` int(11) NOT NULL,
  `tot_tele_portal_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_portal_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_portal_exchange_cycle` int(11) NOT NULL,
  `tot_tele_floor_scale_cycle` int(11) NOT NULL,
  `tot_tele_floor_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_floor_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_floor_exchange_cycle` int(11) NOT NULL,
  `driver_rating` int(11) NOT NULL,
  `defense_rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`match_num`, `team_num`, `auto_position`, `auto_cross`, `auto_pyramid_intake`, `auto_unprotected_intake`, `auto_near_switch_made`, `auto_near_switch_missed`, `auto_scale_high_made`, `auto_scale_high_missed`, `auto_scale_low_made`, `auto_scale_low_missed`, `auto_exchange_made`, `auto_exchange_missed`, `tele_floor_intake`, `tele_portal_intake_made`, `tele_portal_intake_missed`, `tele_pyramid_intake`, `tele_unprotected_intake`, `tele_exchange_made`, `tele_exchange_missed`, `tele_scale_high_made`, `tele_scale_high_missed`, `tele_scale_low_made`, `tele_scale_low_missed`, `tele_near_switch_made`, `tele_near_switch_missed`, `tele_far_switch_made`, `tele_far_switch_missed`, `tele_knockouts`, `tele_cubes_dropped`, `tele_highest_level`, `tele_orderly`, `tele_climb`, `tele_climb_failed`, `tele_plus_one`, `tele_plus_one_failed`, `tele_plus_two`, `tele_plus_two_failed`, `tele_climb_assisted`, `tele_platform`, `avg_tele_pyramid_scale_cycle`, `avg_tele_pyramid_near_switch_cycle`, `avg_tele_pyramid_far_switch_cycle`, `avg_tele_pyramid_exchange_cycle`, `avg_tele_unprotected_scale_cycle`, `avg_tele_unprotected_near_switch_cycle`, `avg_tele_unprotected_far_switch_cycle`, `avg_tele_unprotected_exchange_cycle`, `avg_tele_portal_scale_cycle`, `avg_tele_portal_near_switch_cycle`, `avg_tele_portal_far_switch_cycle`, `avg_tele_portal_exchange_cycle`, `avg_tele_floor_scale_cycle`, `avg_tele_floor_near_switch_cycle`, `avg_tele_floor_far_switch_cycle`, `avg_tele_floor_exchange_cycle`, `tot_tele_pyramid_scale_cycle`, `tot_tele_pyramid_near_switch_cycle`, `tot_tele_pyramid_far_switch_cycle`, `tot_tele_pyramid_exchange_cycle`, `tot_tele_unprotected_scale_cycle`, `tot_tele_unprotected_near_switch_cycle`, `tot_tele_unprotected_far_switch_cycle`, `tot_tele_unprotected_exchange_cycle`, `tot_tele_portal_scale_cycle`, `tot_tele_portal_near_switch_cycle`, `tot_tele_portal_far_switch_cycle`, `tot_tele_portal_exchange_cycle`, `tot_tele_floor_scale_cycle`, `tot_tele_floor_near_switch_cycle`, `tot_tele_floor_far_switch_cycle`, `tot_tele_floor_exchange_cycle`, `driver_rating`, `defense_rating`) VALUES
(1, 118, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `user` varchar(255) NOT NULL,
  `notes` varchar(32767) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`user`, `notes`) VALUES
('admin', '');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `team_num` int(11) NOT NULL,
  `team_name` varchar(255) NOT NULL,
  `num_matches` int(11) NOT NULL,
  `tot_auto_left` int(11) NOT NULL,
  `tot_auto_center` int(11) NOT NULL,
  `tot_auto_right` int(11) NOT NULL,
  `tot_auto_cross` int(11) NOT NULL,
  `tot_auto_pyramid_intake` int(11) NOT NULL,
  `avg_auto_pyramid_intake` decimal(11,3) NOT NULL,
  `tot_auto_unprotected_intake` int(11) NOT NULL,
  `avg_auto_unprotected_intake` decimal(11,3) NOT NULL,
  `perc_auto_near_switch_made` decimal(11,3) NOT NULL,
  `avg_auto_near_switch_made` decimal(11,3) NOT NULL,
  `avg_auto_near_switch_attempts` decimal(11,3) NOT NULL,
  `tot_auto_near_switch_made` int(11) NOT NULL,
  `tot_auto_near_switch_attempts` int(11) NOT NULL,
  `perc_auto_scale_high_made` decimal(11,3) NOT NULL,
  `avg_auto_scale_high_made` decimal(11,3) NOT NULL,
  `avg_auto_scale_high_attempts` decimal(11,3) NOT NULL,
  `tot_auto_scale_high_made` int(11) NOT NULL,
  `tot_auto_scale_high_attempts` int(11) NOT NULL,
  `perc_auto_scale_low_made` decimal(11,3) NOT NULL,
  `avg_auto_scale_low_made` decimal(11,3) NOT NULL,
  `avg_auto_scale_low_attempts` decimal(11,3) NOT NULL,
  `tot_auto_scale_low_made` int(11) NOT NULL,
  `tot_auto_scale_low_attempts` int(11) NOT NULL,
  `perc_auto_exchange_made` decimal(11,3) NOT NULL,
  `avg_auto_exchange_made` decimal(11,3) NOT NULL,
  `avg_auto_exchange_attempts` decimal(11,3) NOT NULL,
  `tot_auto_exchange_made` int(11) NOT NULL,
  `tot_auto_exchange_attempts` int(11) NOT NULL,
  `tot_tele_intake` int(11) NOT NULL,
  `avg_tele_intake` decimal(11,3) NOT NULL,
  `max_tele_intake` int(11) NOT NULL,
  `tot_tele_floor_intake` int(11) NOT NULL,
  `avg_tele_floor_intake` decimal(11,3) NOT NULL,
  `perc_tele_portal_intake_made` decimal(11,3) NOT NULL,
  `avg_tele_portal_intake_made` decimal(11,3) NOT NULL,
  `avg_tele_portal_intake_attempts` decimal(11,3) NOT NULL,
  `tot_tele_portal_intake_made` int(11) NOT NULL,
  `tot_tele_portal_intake_attempts` int(11) NOT NULL,
  `tot_tele_pyramid_intake` int(11) NOT NULL,
  `avg_tele_pyramid_intake` decimal(11,3) NOT NULL,
  `tot_tele_unprotected_intake` int(11) NOT NULL,
  `avg_tele_unprotected_intake` decimal(11,3) NOT NULL,
  `perc_tele_near_switch_made` decimal(11,3) NOT NULL,
  `avg_tele_near_switch_made` decimal(11,3) NOT NULL,
  `avg_tele_near_switch_attempts` decimal(11,3) NOT NULL,
  `tot_tele_near_switch_made` int(11) NOT NULL,
  `tot_tele_near_switch_attempts` int(11) NOT NULL,
  `perc_tele_far_switch_made` decimal(11,3) NOT NULL,
  `avg_tele_far_switch_made` decimal(11,3) NOT NULL,
  `avg_tele_far_switch_attempts` decimal(11,3) NOT NULL,
  `tot_tele_far_switch_made` int(11) NOT NULL,
  `tot_tele_far_switch_attempts` int(11) NOT NULL,
  `perc_tele_scale_high_made` decimal(11,3) NOT NULL,
  `avg_tele_scale_high_made` decimal(11,3) NOT NULL,
  `avg_tele_scale_high_attempts` decimal(11,3) NOT NULL,
  `tot_tele_scale_high_made` int(11) NOT NULL,
  `tot_tele_scale_high_attempts` int(11) NOT NULL,
  `perc_tele_scale_low_made` decimal(11,3) NOT NULL,
  `avg_tele_scale_low_made` decimal(11,3) NOT NULL,
  `avg_tele_scale_low_attempts` decimal(11,3) NOT NULL,
  `tot_tele_scale_low_made` int(11) NOT NULL,
  `tot_tele_scale_low_attempts` int(11) NOT NULL,
  `perc_tele_exchange_made` decimal(11,3) NOT NULL,
  `avg_tele_exchange_made` decimal(11,3) NOT NULL,
  `avg_tele_exchange_attempts` decimal(11,3) NOT NULL,
  `tot_tele_exchange_made` int(11) NOT NULL,
  `tot_tele_exchange_attempts` int(11) NOT NULL,
  `tot_tele_cubes_scored` int(11) NOT NULL,
  `avg_tele_cubes_scored` decimal(11,3) NOT NULL,
  `max_tele_cubes_scored` int(11) NOT NULL,
  `tot_tele_knockouts` int(11) NOT NULL,
  `avg_tele_knockouts` decimal(11,3) NOT NULL,
  `tot_tele_cubes_dropped` int(11) NOT NULL,
  `avg_tele_cubes_dropped` decimal(11,3) NOT NULL,
  `max_tele_highest_level` int(11) NOT NULL,
  `frq_tele_highest_level` int(11) NOT NULL,
  `tot_tele_orderly` int(11) NOT NULL,
  `perc_tele_climb` decimal(11,3) NOT NULL,
  `tot_tele_climb` int(11) NOT NULL,
  `tot_tele_climb_attempts` int(11) NOT NULL,
  `perc_tele_plus_one` decimal(11,3) NOT NULL,
  `tot_tele_plus_one` int(11) NOT NULL,
  `tot_tele_plus_one_attempts` int(11) NOT NULL,
  `perc_tele_plus_two` decimal(11,3) NOT NULL,
  `tot_tele_plus_two` int(11) NOT NULL,
  `tot_tele_plus_two_attempts` int(11) NOT NULL,
  `tot_tele_climb_assisted` int(11) NOT NULL,
  `tot_tele_platform` int(11) NOT NULL,
  `avg_tele_pyramid_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_pyramid_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_pyramid_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_pyramid_exchange_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_unprotected_exchange_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_portal_exchange_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_scale_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_near_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_far_switch_cycle` decimal(11,3) NOT NULL,
  `avg_tele_floor_exchange_cycle` decimal(11,3) NOT NULL,
  `tot_tele_pyramid_scale_cycle` int(11) NOT NULL,
  `tot_tele_pyramid_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_pyramid_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_pyramid_exchange_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_scale_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_unprotected_exchange_cycle` int(11) NOT NULL,
  `tot_tele_portal_scale_cycle` int(11) NOT NULL,
  `tot_tele_portal_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_portal_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_portal_exchange_cycle` int(11) NOT NULL,
  `tot_tele_floor_scale_cycle` int(11) NOT NULL,
  `tot_tele_floor_near_switch_cycle` int(11) NOT NULL,
  `tot_tele_floor_far_switch_cycle` int(11) NOT NULL,
  `tot_tele_floor_exchange_cycle` int(11) NOT NULL,
  `max_tele_pyramid_scale_cycle` int(11) NOT NULL,
  `max_tele_pyramid_near_switch_cycle` int(11) NOT NULL,
  `max_tele_pyramid_far_switch_cycle` int(11) NOT NULL,
  `max_tele_pyramid_exchange_cycle` int(11) NOT NULL,
  `max_tele_unprotected_scale_cycle` int(11) NOT NULL,
  `max_tele_unprotected_near_switch_cycle` int(11) NOT NULL,
  `max_tele_unprotected_far_switch_cycle` int(11) NOT NULL,
  `max_tele_unprotected_exchange_cycle` int(11) NOT NULL,
  `max_tele_portal_scale_cycle` int(11) NOT NULL,
  `max_tele_portal_near_switch_cycle` int(11) NOT NULL,
  `max_tele_portal_far_switch_cycle` int(11) NOT NULL,
  `max_tele_portal_exchange_cycle` int(11) NOT NULL,
  `max_tele_floor_scale_cycle` int(11) NOT NULL,
  `max_tele_floor_near_switch_cycle` int(11) NOT NULL,
  `max_tele_floor_far_switch_cycle` int(11) NOT NULL,
  `max_tele_floor_exchange_cycle` int(11) NOT NULL,
  `avg_driver_rating` decimal(11,3) NOT NULL,
  `avg_defense_rating` decimal(11,3) NOT NULL,
  `alliance_rating` decimal(11,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`team_num`, `team_name`, `num_matches`, `tot_auto_left`, `tot_auto_center`, `tot_auto_right`, `tot_auto_cross`, `tot_auto_pyramid_intake`, `avg_auto_pyramid_intake`, `tot_auto_unprotected_intake`, `avg_auto_unprotected_intake`, `perc_auto_near_switch_made`, `avg_auto_near_switch_made`, `avg_auto_near_switch_attempts`, `tot_auto_near_switch_made`, `tot_auto_near_switch_attempts`, `perc_auto_scale_high_made`, `avg_auto_scale_high_made`, `avg_auto_scale_high_attempts`, `tot_auto_scale_high_made`, `tot_auto_scale_high_attempts`, `perc_auto_scale_low_made`, `avg_auto_scale_low_made`, `avg_auto_scale_low_attempts`, `tot_auto_scale_low_made`, `tot_auto_scale_low_attempts`, `perc_auto_exchange_made`, `avg_auto_exchange_made`, `avg_auto_exchange_attempts`, `tot_auto_exchange_made`, `tot_auto_exchange_attempts`, `tot_tele_intake`, `avg_tele_intake`, `max_tele_intake`, `tot_tele_floor_intake`, `avg_tele_floor_intake`, `perc_tele_portal_intake_made`, `avg_tele_portal_intake_made`, `avg_tele_portal_intake_attempts`, `tot_tele_portal_intake_made`, `tot_tele_portal_intake_attempts`, `tot_tele_pyramid_intake`, `avg_tele_pyramid_intake`, `tot_tele_unprotected_intake`, `avg_tele_unprotected_intake`, `perc_tele_near_switch_made`, `avg_tele_near_switch_made`, `avg_tele_near_switch_attempts`, `tot_tele_near_switch_made`, `tot_tele_near_switch_attempts`, `perc_tele_far_switch_made`, `avg_tele_far_switch_made`, `avg_tele_far_switch_attempts`, `tot_tele_far_switch_made`, `tot_tele_far_switch_attempts`, `perc_tele_scale_high_made`, `avg_tele_scale_high_made`, `avg_tele_scale_high_attempts`, `tot_tele_scale_high_made`, `tot_tele_scale_high_attempts`, `perc_tele_scale_low_made`, `avg_tele_scale_low_made`, `avg_tele_scale_low_attempts`, `tot_tele_scale_low_made`, `tot_tele_scale_low_attempts`, `perc_tele_exchange_made`, `avg_tele_exchange_made`, `avg_tele_exchange_attempts`, `tot_tele_exchange_made`, `tot_tele_exchange_attempts`, `tot_tele_cubes_scored`, `avg_tele_cubes_scored`, `max_tele_cubes_scored`, `tot_tele_knockouts`, `avg_tele_knockouts`, `tot_tele_cubes_dropped`, `avg_tele_cubes_dropped`, `max_tele_highest_level`, `frq_tele_highest_level`, `tot_tele_orderly`, `perc_tele_climb`, `tot_tele_climb`, `tot_tele_climb_attempts`, `perc_tele_plus_one`, `tot_tele_plus_one`, `tot_tele_plus_one_attempts`, `perc_tele_plus_two`, `tot_tele_plus_two`, `tot_tele_plus_two_attempts`, `tot_tele_climb_assisted`, `tot_tele_platform`, `avg_tele_pyramid_scale_cycle`, `avg_tele_pyramid_near_switch_cycle`, `avg_tele_pyramid_far_switch_cycle`, `avg_tele_pyramid_exchange_cycle`, `avg_tele_unprotected_scale_cycle`, `avg_tele_unprotected_near_switch_cycle`, `avg_tele_unprotected_far_switch_cycle`, `avg_tele_unprotected_exchange_cycle`, `avg_tele_portal_scale_cycle`, `avg_tele_portal_near_switch_cycle`, `avg_tele_portal_far_switch_cycle`, `avg_tele_portal_exchange_cycle`, `avg_tele_floor_scale_cycle`, `avg_tele_floor_near_switch_cycle`, `avg_tele_floor_far_switch_cycle`, `avg_tele_floor_exchange_cycle`, `tot_tele_pyramid_scale_cycle`, `tot_tele_pyramid_near_switch_cycle`, `tot_tele_pyramid_far_switch_cycle`, `tot_tele_pyramid_exchange_cycle`, `tot_tele_unprotected_scale_cycle`, `tot_tele_unprotected_near_switch_cycle`, `tot_tele_unprotected_far_switch_cycle`, `tot_tele_unprotected_exchange_cycle`, `tot_tele_portal_scale_cycle`, `tot_tele_portal_near_switch_cycle`, `tot_tele_portal_far_switch_cycle`, `tot_tele_portal_exchange_cycle`, `tot_tele_floor_scale_cycle`, `tot_tele_floor_near_switch_cycle`, `tot_tele_floor_far_switch_cycle`, `tot_tele_floor_exchange_cycle`, `max_tele_pyramid_scale_cycle`, `max_tele_pyramid_near_switch_cycle`, `max_tele_pyramid_far_switch_cycle`, `max_tele_pyramid_exchange_cycle`, `max_tele_unprotected_scale_cycle`, `max_tele_unprotected_near_switch_cycle`, `max_tele_unprotected_far_switch_cycle`, `max_tele_unprotected_exchange_cycle`, `max_tele_portal_scale_cycle`, `max_tele_portal_near_switch_cycle`, `max_tele_portal_far_switch_cycle`, `max_tele_portal_exchange_cycle`, `max_tele_floor_scale_cycle`, `max_tele_floor_near_switch_cycle`, `max_tele_floor_far_switch_cycle`, `max_tele_floor_exchange_cycle`, `avg_driver_rating`, `avg_defense_rating`, `alliance_rating`) VALUES
(118, 'Robonauts', 1, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '3.000', '0.000', '0.000'),
(148, 'Robowranglers', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(647, 'Cyberwolves ', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(1255, 'Blarglefish', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(1296, 'Full Metal Jackets', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(1382, 'ETEP Team', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(1477, 'Texas Torque', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(1745, 'The P-51 Mustangs', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(2164, 'The Core', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(2333, 'S.C.R.E.E.C.H.', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(2341, 'Sprockets', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(2723, 'Team Rocket', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(2789, 'TEXPLOSION', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(2805, 'Ghost in the Machine', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(2848, '? ALL SPARKS ?', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3005, 'RoboChargers', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3037, 'GLOBOTS', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3179, 'The A.N.T.', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3282, 'Dallas Robo Tigers', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3355, 'Purple Vipers', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3370, 'Aftershock', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3507, 'Ubotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3593, 'Invictus', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3676, 'Warrior Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(3802, 'RoboPOP', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(4076, 'Texan Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(4192, 'Jaguar Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(4206, 'Robo Vikes', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5057, 'RoboBusters', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5212, 'TAMSformers Robotics ', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5242, '?? RoboCats ??', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5411, 'PowerEagle', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5417, 'Eagle Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5431, 'Titan Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5639, 'Loose Wires', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5682, 'Equus Engineering', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5775, 'CRHS RoboCats', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5889, 'Commandobots', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(5960, 'Mighty ROBO-RANGERS', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6133, 'Haltom Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6171, '? Chain Reaction ?', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6321, '? R-Cubed  Rouse Raider Robotics ?', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6369, 'Mercenary Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6526, 'Cyber Rangers', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6646, 'The Belton New Tech SpaceMakers', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6655, 'Texan Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6671, 'Adamas Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6672, 'Fusion Corps', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6751, 'RoboFlash', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6768, 'Denison Robo-Jackets', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(6901, 'Knights Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7091, 'Atlas Orbis', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7119, 'Sunset RoboBison', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7120, 'ThunderChicas', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7121, 'Keller Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7125, 'Tigerbotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000');
INSERT INTO `teams` (`team_num`, `team_name`, `num_matches`, `tot_auto_left`, `tot_auto_center`, `tot_auto_right`, `tot_auto_cross`, `tot_auto_pyramid_intake`, `avg_auto_pyramid_intake`, `tot_auto_unprotected_intake`, `avg_auto_unprotected_intake`, `perc_auto_near_switch_made`, `avg_auto_near_switch_made`, `avg_auto_near_switch_attempts`, `tot_auto_near_switch_made`, `tot_auto_near_switch_attempts`, `perc_auto_scale_high_made`, `avg_auto_scale_high_made`, `avg_auto_scale_high_attempts`, `tot_auto_scale_high_made`, `tot_auto_scale_high_attempts`, `perc_auto_scale_low_made`, `avg_auto_scale_low_made`, `avg_auto_scale_low_attempts`, `tot_auto_scale_low_made`, `tot_auto_scale_low_attempts`, `perc_auto_exchange_made`, `avg_auto_exchange_made`, `avg_auto_exchange_attempts`, `tot_auto_exchange_made`, `tot_auto_exchange_attempts`, `tot_tele_intake`, `avg_tele_intake`, `max_tele_intake`, `tot_tele_floor_intake`, `avg_tele_floor_intake`, `perc_tele_portal_intake_made`, `avg_tele_portal_intake_made`, `avg_tele_portal_intake_attempts`, `tot_tele_portal_intake_made`, `tot_tele_portal_intake_attempts`, `tot_tele_pyramid_intake`, `avg_tele_pyramid_intake`, `tot_tele_unprotected_intake`, `avg_tele_unprotected_intake`, `perc_tele_near_switch_made`, `avg_tele_near_switch_made`, `avg_tele_near_switch_attempts`, `tot_tele_near_switch_made`, `tot_tele_near_switch_attempts`, `perc_tele_far_switch_made`, `avg_tele_far_switch_made`, `avg_tele_far_switch_attempts`, `tot_tele_far_switch_made`, `tot_tele_far_switch_attempts`, `perc_tele_scale_high_made`, `avg_tele_scale_high_made`, `avg_tele_scale_high_attempts`, `tot_tele_scale_high_made`, `tot_tele_scale_high_attempts`, `perc_tele_scale_low_made`, `avg_tele_scale_low_made`, `avg_tele_scale_low_attempts`, `tot_tele_scale_low_made`, `tot_tele_scale_low_attempts`, `perc_tele_exchange_made`, `avg_tele_exchange_made`, `avg_tele_exchange_attempts`, `tot_tele_exchange_made`, `tot_tele_exchange_attempts`, `tot_tele_cubes_scored`, `avg_tele_cubes_scored`, `max_tele_cubes_scored`, `tot_tele_knockouts`, `avg_tele_knockouts`, `tot_tele_cubes_dropped`, `avg_tele_cubes_dropped`, `max_tele_highest_level`, `frq_tele_highest_level`, `tot_tele_orderly`, `perc_tele_climb`, `tot_tele_climb`, `tot_tele_climb_attempts`, `perc_tele_plus_one`, `tot_tele_plus_one`, `tot_tele_plus_one_attempts`, `perc_tele_plus_two`, `tot_tele_plus_two`, `tot_tele_plus_two_attempts`, `tot_tele_climb_assisted`, `tot_tele_platform`, `avg_tele_pyramid_scale_cycle`, `avg_tele_pyramid_near_switch_cycle`, `avg_tele_pyramid_far_switch_cycle`, `avg_tele_pyramid_exchange_cycle`, `avg_tele_unprotected_scale_cycle`, `avg_tele_unprotected_near_switch_cycle`, `avg_tele_unprotected_far_switch_cycle`, `avg_tele_unprotected_exchange_cycle`, `avg_tele_portal_scale_cycle`, `avg_tele_portal_near_switch_cycle`, `avg_tele_portal_far_switch_cycle`, `avg_tele_portal_exchange_cycle`, `avg_tele_floor_scale_cycle`, `avg_tele_floor_near_switch_cycle`, `avg_tele_floor_far_switch_cycle`, `avg_tele_floor_exchange_cycle`, `tot_tele_pyramid_scale_cycle`, `tot_tele_pyramid_near_switch_cycle`, `tot_tele_pyramid_far_switch_cycle`, `tot_tele_pyramid_exchange_cycle`, `tot_tele_unprotected_scale_cycle`, `tot_tele_unprotected_near_switch_cycle`, `tot_tele_unprotected_far_switch_cycle`, `tot_tele_unprotected_exchange_cycle`, `tot_tele_portal_scale_cycle`, `tot_tele_portal_near_switch_cycle`, `tot_tele_portal_far_switch_cycle`, `tot_tele_portal_exchange_cycle`, `tot_tele_floor_scale_cycle`, `tot_tele_floor_near_switch_cycle`, `tot_tele_floor_far_switch_cycle`, `tot_tele_floor_exchange_cycle`, `max_tele_pyramid_scale_cycle`, `max_tele_pyramid_near_switch_cycle`, `max_tele_pyramid_far_switch_cycle`, `max_tele_pyramid_exchange_cycle`, `max_tele_unprotected_scale_cycle`, `max_tele_unprotected_near_switch_cycle`, `max_tele_unprotected_far_switch_cycle`, `max_tele_unprotected_exchange_cycle`, `max_tele_portal_scale_cycle`, `max_tele_portal_near_switch_cycle`, `max_tele_portal_far_switch_cycle`, `max_tele_portal_exchange_cycle`, `max_tele_floor_scale_cycle`, `max_tele_floor_near_switch_cycle`, `max_tele_floor_far_switch_cycle`, `max_tele_floor_exchange_cycle`, `avg_driver_rating`, `avg_defense_rating`, `alliance_rating`) VALUES
(7179, 'Crossfire', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7303, 'Reach Robotics', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7319, 'GRCTC', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000'),
(7321, 'Aguila Robotica', 0, 0, 0, 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, '0.000', '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, '0.000', '0.000', '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, '0.000', 0, 0, 0, '0.000', 0, 0, '0.000', 0, 0, '0.000', 0, 0, 0, 0, '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0.000', '0.000', '0.000');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `admin`) VALUES
('admin', '0324e09eb7812485bf32a1d41637eced', 1),
('guest', 'e1f055eed056aa7bdb48038a084e3c88', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`match_num`,`team_num`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_num`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
