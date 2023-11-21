CREATE DATABASE IF NOT EXISTS `excelent`;
USE `excelent`;

DROP TABLE IF EXISTS `sht_link_sht_col`;
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
        `sht_idtusr_aut`    BIGINT          NOT NULL                            COMMENT 'Creator user FK',
        `sht_name`          VARCHAR(255)    NOT NULL                            COMMENT 'Sheet name',
        `sht_sharing`       BOOLEAN         NOT NULL DEFAULT FALSE              COMMENT 'Sheet sharing',
        `sht_uuid`          VARCHAR(255)    NOT NULL                            COMMENT 'Sheet uuid',
        `sht_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of sheet creation',
        `sht_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of sheet update',
        PRIMARY KEY (`sht_idtsht`),
        CONSTRAINT `sht_usr_aut_fk` FOREIGN KEY (`sht_idtusr_aut`) REFERENCES `usr_user` (`usr_idtusr`),
        CONSTRAINT `sht_uuid_u` UNIQUE (`sht_uuid`),
        KEY `sht_usr_aut_fk_i` (`sht_idtusr_aut`),
        KEY `sht_name_i` (`sht_name`)
    ) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = 'Sheet table';

-- user sheet shared
CREATE TABLE
    `sht_link_sht_usr` (
        `lsu_idtsht`        BIGINT          NOT NULL                            COMMENT 'Sheet FK',
        `lsu_idtusr_aut`    BIGINT          NOT NULL                            COMMENT 'User FK',
        `lsu_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of link creation',
        `lsu_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of link update',
        PRIMARY KEY (`lsu_idtsht`, `lsu_idtusr_aut`),
        CONSTRAINT `lsu_sht_fk` FOREIGN KEY (`lsu_idtsht`) REFERENCES `sht_sheet` (`sht_idtsht`),
        CONSTRAINT `lsu_usr_aut_fk` FOREIGN KEY (`lsu_idtusr_aut`) REFERENCES `usr_user` (`usr_idtusr`),
        KEY `lsu_sht_fk_i` (`lsu_idtsht`),
        KEY `lsu_usr_aut_fk_i` (`lsu_idtusr_aut`)
    ) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = 'User sheet shared table';

CREATE TABLE
    `sht_link_sht_col` (
        `lsc_idtsht`        BIGINT          NOT NULL                            COMMENT 'PK Sheet FK',
        `lsc_idtcol`        VARCHAR(10)     NOT NULL                            COMMENT 'PK Column',
        `lsc_val`           VARCHAR(255)    NOT NULL                            COMMENT 'Column value',
        `lsc_stl`           VARCHAR(255)    NOT NULL                            COMMENT 'Column style',
        `lsc_created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of column creation',
        `lsc_updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'Date of column update',
        PRIMARY KEY (`lsc_idtsht`, `lsc_idtcol`),
        CONSTRAINT `lsc_idtsht_fk` FOREIGN KEY (`lsc_idtsht`) REFERENCES `sht_sheet` (`sht_idtsht`),
        KEY `lsc_idtsht_fk_i` (`lsc_idtsht`)
    )
