CREATE DATABASE IF NOT EXISTS `excel-ent`;
USE `excel-ent`;

-- user table
DROP TABLE IF EXISTS `usr_user`;
CREATE TABLE
    `usr_user` (
        `usr_idtusr`        BIGINT          NOT NULL AUTO_INCREMENT             COMMENT 'User PK',
        `usr_fname`         VARCHAR(255)    NOT NULL                            COMMENT 'User first name',
        `usr_lname`         VARCHAR(255)    NOT NULL                            COMMENT 'User last name',
        `usr_mail`          VARCHAR(255)    NOT NULL                            COMMENT 'User email',
        `usr_pwd`           varchar(255)    NOT NULL                            COMMENT 'User password',
        `usr_adm`           BOOLEAN         NOT NULL DEFAULT FALSE              COMMENT 'User admin status',
        `usr_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of user creation',
        `usr_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of user update',
        PRIMARY KEY (`usr_idtusr`),
        CONSTRAINT `usr_mail_u` UNIQUE (`usr_mail`)
    ) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = 'User table';

-- sheet table
DROP TABLE IF EXISTS `sht_sheet`;
CREATE TABLE
    `sht_sheet` (
        `sht_idsht`         BIGINT          NOT NULL AUTO_INCREMENT             COMMENT 'Sheet PK',
        `sht_idtusr`        BIGINT          NOT NULL                            COMMENT 'Creator user FK',
        `sht_name`          VARCHAR(255)    NOT NULL                            COMMENT 'Sheet name',
        `sht_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of sheet creation',
        `sht_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of sheet update',
        PRIMARY KEY (`sht_idsht`),
        CONSTRAINT `sht_idtusr_fk` FOREIGN KEY (`sht_idtusr`) REFERENCES `usr_user` (`usr_idtusr`),
        KEY `sht_idtusr_fk_i` (`sht_idtusr`),
        KEY `sht_name_i` (`sht_name`)
    ) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = 'Sheet table';