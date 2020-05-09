/*
 Navicat Premium Data Transfer

 Source Server         : kww
 Source Server Type    : MySQL
 Source Server Version : 50729
 Source Host           : 49.235.158.130:3306
 Source Schema         : test_tools

 Target Server Type    : MySQL
 Target Server Version : 50729
 File Encoding         : 65001

 Date: 26/04/2020 09:46:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE test_tools;
use test_tools;
-- ----------------------------
-- Table structure for REDIS_INFO
-- ----------------------------
DROP TABLE IF EXISTS `REDIS_INFO`;
CREATE TABLE `REDIS_INFO`  (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `TASK_ID` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `INFO_DATE` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `USED_MEMORY_RSS` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `USED_MEMORY_PEAK` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `MEMORY_PERC` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `USED_CPU_SYS` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `USED_CPU_USER` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `CONNECTED_CLIENTS` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `BLOCKED_CLIENTS` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `CMDSTAT_PING` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `CMDSTAT_GET` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `CMDSTAT_SET` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `KEYSPACE_HITS` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `KEYSPACE_MISSES` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `KEYSPACE_HITS_PERC` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `TOTAL_NET_INPUT_BYTES` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `TOTAL_NET_OUTPUT_BYTES` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `DATA_JSON` json NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for REDIS_TEST
-- ----------------------------
DROP TABLE IF EXISTS `REDIS_TEST`;
CREATE TABLE `REDIS_TEST`  (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `TASK_ID` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TEST_TYPE` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `SET` float(255, 2) NULL DEFAULT 0.00,
  `GET` float(255, 2) NULL DEFAULT 0.00,
  `INCR` float(255, 2) NULL DEFAULT 0.00,
  `LPUSH` float(255, 2) NULL DEFAULT 0.00,
  `RPUSH` float(255, 2) NULL DEFAULT 0.00,
  `LPOP` float(255, 2) NULL DEFAULT 0.00,
  `RPOP` float(255, 2) NULL DEFAULT 0.00,
  `SADD` float(255, 2) NULL DEFAULT 0.00,
  `HSET` float(255, 2) NULL DEFAULT 0.00,
  `SPOP` float(255, 2) NULL DEFAULT 0.00,
  `LRANGE_100` float(255, 2) NULL DEFAULT 0.00,
  `LRANGE_300` float(255, 2) NULL DEFAULT 0.00,
  `LRANGE_500` float(255, 2) NULL DEFAULT 0.00,
  `LRANGE_600` float(255, 2) NULL DEFAULT 0.00,
  `MSET` float(255, 2) NULL DEFAULT 0.00,
  `DATA_JSON` json NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for TEST_TASK
-- ----------------------------
DROP TABLE IF EXISTS `TEST_TASK`;
CREATE TABLE `TEST_TASK`  (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `TASK_ID` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TASK_SERVICE` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `TASK_DATE` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `DATA_JSON` json NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
