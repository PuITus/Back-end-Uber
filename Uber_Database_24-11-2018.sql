-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 24, 2018 at 07:04 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uber`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountTypes`
--

CREATE TABLE `accountTypes` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `ID` int(11) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `Phone` varchar(200) NOT NULL,
  `Adress` varchar(200) NOT NULL,
  `Note` varchar(200) NOT NULL,
  `Status` int(11) NOT NULL,
  `Latitude` float NOT NULL,
  `Longitude` float NOT NULL,
  `Driver_ID` int(11) NOT NULL DEFAULT '-1',
  `Driver_lat` double NOT NULL,
  `Driver_lng` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`ID`, `Name`, `Phone`, `Adress`, `Note`, `Status`, `Latitude`, `Longitude`, `Driver_ID`, `Driver_lat`, `Driver_lng`) VALUES
(426, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 4, 10.8525, 106.765, 3, 10.8334879, 106.73651399999994),
(427, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 5, 10.8511, 106.772, -1, 0, NULL),
(428, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', 'mua nước mía cho khách', 5, 10.8479, 106.792, -1, 0, NULL),
(429, 'Ngô Minh Phụng', '1237015928', 'KHTN', '', 5, 37.3033, -120.483, -1, 0, NULL),
(430, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 4, 10.8439, 106.794, 3, 10.8334879, 106.73651399999994),
(431, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 4, 10.8618, 106.796, 3, 10.8334879, 106.73651399999994),
(432, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 4, 10.8525, 106.765, 3, 10.8334879, 106.73651399999994),
(433, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 5, 12.9624, 107.988, -1, 0, NULL),
(434, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 4, 10.8525, 106.765, 3, 10.8334879, 106.73651399999994),
(435, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 5, 10.8525, 106.765, -1, 0, NULL),
(436, 'Ngô Minh Phụng', '1237015928', '24/13 Võ Văn Ngân', '', 0, 10.8525, 106.765, -1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userRefreshTokenExt`
--

CREATE TABLE `userRefreshTokenExt` (
  `User_ID` text NOT NULL,
  `rfToken` text NOT NULL,
  `rdt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userRefreshTokenExt`
--

INSERT INTO `userRefreshTokenExt` (`User_ID`, `rfToken`, `rdt`) VALUES
('2', 'GO2vngorA0dBtFKC8yKeo8wqvIRiYxJqUAfWIKmP6HG9xizdtecMAACWmUAtCPAI6tLEMIaOwB7D4f4L', '2018-11-24 01:15:03'),
('3', 'ZuXa2o2yYhrujYg252TiwKxrVdDddMVxzntGen52x6fArUGaoZ3y5wYji4cdeeKIf3CkGAD0ZKggH5A4', '2018-11-24 01:18:05'),
('9', 'wLnXCbM74UHJxaFHhN12uUjK5VUzcPGai2JlsRcsKkkEwBfXlXPT9XL1lHn2jeKt39o8tw1irT47BSOJ', '2018-11-24 01:18:48'),
('1', 'uGo0NC230UzSVwu6WcdqTF9TkHNvybv0PvDNSG3l1hlpjcjYN3a9GZZccm9sdhcDnkI874oN8OzEvl6B', '2018-11-24 01:19:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `Username` text NOT NULL,
  `Name` text NOT NULL,
  `Password` text NOT NULL,
  `AccountType_ID` int(11) NOT NULL,
  `Status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `Username`, `Name`, `Password`, `AccountType_ID`, `Status`) VALUES
(1, 'admin', 'Receiver', '21232f297a57a5a743894a0e4a801fc3', 1, 1),
(2, 'admin2', 'Identifier', '21232f297a57a5a743894a0e4a801fc3', 2, 1),
(3, 'admin3', 'Driver', '21232f297a57a5a743894a0e4a801fc3', 3, 1),
(4, 'abc', 'abc', '900150983cd24fb0d6963f7d28e17f72', 1, 1),
(5, 'abc', 'abc', '900150983cd24fb0d6963f7d28e17f72', 1, 1),
(6, 'abc', 'abc', '900150983cd24fb0d6963f7d28e17f72', 1, 1),
(7, 'abc', 'abc', '900150983cd24fb0d6963f7d28e17f72', 1, 1),
(8, 'abc', 'abc', '900150983cd24fb0d6963f7d28e17f72', 1, 1),
(9, 'admin4', 'Manager', '21232f297a57a5a743894a0e4a801fc3', 4, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountTypes`
--
ALTER TABLE `accountTypes`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accountTypes`
--
ALTER TABLE `accountTypes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=437;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
