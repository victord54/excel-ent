CREATE DATABASE IF NOT EXISTS `excel-ent`;
USE `excel-ent`;

-- user table
DROP TABLE IF EXISTS `usr_user`;
CREATE TABLE
    `usr_user` (
        `usr_idtusr`        BIGINT NOT NULL AUTO_INCREMENT,
        `usr_fname`         VARCHAR(255) NOT NULL,
        `usr_lname`         VARCHAR(255) NOT NULL,
        `usr_mail`          VARCHAR(255) NOT NULL,
        `usr_pwd`           varchar(255) NOT NULL,
        `usr_adm`           BOOLEAN NOT NULL DEFAULT FALSE,
        `usr_created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `usr_updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY                 (`usr_idtusr`),
        UNIQUE KEY  `usr_mail_u`    (`usr_mail`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = UTF8MB4;