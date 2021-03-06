use wanli_db;
alter table `user_table` Add column colour int not null default 0 AFTER `sex`;

alter table `user_table` Add column bless int not null default 15 AFTER `colour`;

alter table `user_table` Add column give_away_bless char(128) not null default "[]" AFTER `bless`;

alter table `user_table` Add column lotus int not null default 5 AFTER `bless`;

alter table `user_table` Add column openid char(64) not null default "" AFTER `user_id`;

alter table `user_table` Add column login_count int not null default 0 AFTER `lotus`;

alter table `contracts_table` Add column attention_flag int not null default 0 AFTER `contracts_name`;

CREATE TABLE `feedback_table` (
id INT(11) NOT NULL AUTO_INCREMENT,
uid INT(11),
content VARCHAR(512),
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `contracts_table` (
id INT(11) NOT NULL AUTO_INCREMENT,
uid INT(11),
contracts_uid INT(11),
contracts_name VARCHAR(32),
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;