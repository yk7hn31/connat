const mysql = require("mysql2");
const asyncMysql = require("mysql2/promise");
const fs = require("fs");

const profile = JSON.parse(fs.readFileSync("./profile.json", "utf-8"));

let asyncConnection;
const connection = mysql.createConnection({
  host: "localhost",
  user: profile.mysql.user,
  password: profile.mysql.password,
  database: "melodie",
});

async function asyncConnect() {
  if (!asyncConnection) {
    asyncConnection = await asyncMysql.createConnection({
      host: "localhost",
      user: profile.mysql.user,
      password: profile.mysql.password,
      database: "melodie",
    });

    await asyncConnection.connect();
  }

  return asyncConnection;
}

module.exports = {
  async: connection,
  promise: asyncConnect(),
};