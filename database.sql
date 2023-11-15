CREATE DATABASE IF NOT EXISTS `excelent`;
USE `excelent`;

DROP TABLE IF EXISTS `usr_sht_link_sheet_user`;
DROP TABLE IF EXISTS `sht_sheet`;
DROP TABLE IF EXISTS `usr_user`;

-- user table
CREATE TABLE
    `usr_user` (
        `usr_idtusr`        BIGINT          NOT NULL AUTO_INCREMENT             COMMENT 'User PK',
        `usr_pseudo`         VARCHAR(255)   NOT NULL                            COMMENT 'User pseudo',
        `usr_mail`          VARCHAR(255)    NOT NULL                            COMMENT 'User email',
        `usr_pwd`           varchar(255)    NOT NULL                            COMMENT 'User password',
        `usr_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of user creation',
        `usr_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of user update',
        PRIMARY KEY (`usr_idtusr`),
        CONSTRAINT `usr_mail_u` UNIQUE (`usr_mail`),
        CONSTRAINT `usr_pseudo_u` UNIQUE (`usr_pseudo`)
    ) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = 'User table';

-- sheet table
CREATE TABLE
    `sht_sheet` (
        `sht_idtsht`        BIGINT          NOT NULL AUTO_INCREMENT             COMMENT 'Sheet PK',
        `sht_idtusr`        BIGINT          NOT NULL                            COMMENT 'Creator user FK',
        `sht_name`          VARCHAR(255)    NOT NULL                            COMMENT 'Sheet name',
        `sht_data`          JSON            NOT NULL                            COMMENT 'Sheet data',
        `sht_sharing`       BOOLEAN         NOT NULL DEFAULT FALSE              COMMENT 'Sheet sharing',
        `sht_uuid`          VARCHAR(255)    NOT NULL                            COMMENT 'Sheet uuid',
        `sht_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of sheet creation',
        `sht_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of sheet update',
        PRIMARY KEY (`sht_idsht`),
        CONSTRAINT `sht_idtusr_fk` FOREIGN KEY (`sht_idtusr`) REFERENCES `usr_user` (`usr_idtusr`),
        KEY `sht_idtusr_fk_i` (`sht_idtusr`),
        KEY `sht_name_i` (`sht_name`)
    ) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = 'Sheet table';

-- user sheet shared
CREATE TABLE
    `usr_sht_link_sheet_user` (
        `usl_idtsht`        BIGINT          NOT NULL                            COMMENT 'Sheet FK',
        `usl_idtusr`        BIGINT          NOT NULL                            COMMENT 'User FK',
        `usl_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of link creation',
        `usl_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of link update',
        PRIMARY KEY (`usl_idsht`, `usl_idtusr`),
        CONSTRAINT `usl_idsht_fk` FOREIGN KEY (`usl_idsht`) REFERENCES `sht_sheet` (`sht_idsht`),
        CONSTRAINT `usl_idtusr_fk` FOREIGN KEY (`usl_idtusr`) REFERENCES `usr_user` (`usr_idtusr`),
        KEY `usl_idsht_fk_i` (`usl_idsht`),
        KEY `usl_idtusr_fk_i` (`usl_idtusr`)
    ) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = 'User sheet shared table';
