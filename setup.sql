create database connat;

use connat;

create table users (
  id int not null auto_increment,
  username varchar(40) not null unique,
  password varchar(72) not null,
  servers varchar(1000) not null default '[]',
  primary key (id)
);

create table dm (
  id int not null auto_increment,
  part1 varchar(40) not null,
  part2 varchar(40) not null,
  primary key (id)
);

create table servers (
  id int not null auto_increment,
  sid varchar(10) not null unique,
  name varchar(50) not null,
  users varchar(1000) not null default '[]',
  icon varchar(30) not null,
  primary key (id)
);

create table channels (
  id int not null auto_increment,
  server varchar(10) not null,
  name varchar(50) not null,
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