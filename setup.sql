create database melodie;

use melodie;

create table users (
  id int not null auto_increment,
  username varchar(40) not null unique,
  password varchar(72) not null,
  channels varchar(550) not null default '',
  primary key (id)
);

create table channels (
  id int not null auto_increment,
  cid varchar(10) not null unique,
  users tinytext not null,
  private boolean not null,
  primary key (id)
);

create table history (
  id int not null auto_increment,
  cid varchar(10) not null,
  username varchar(40) not null,
  message text not null,
  time timestamp not null default current_timestamp,
  primary key (id)
);