const session = require("express-session");
const MySQLSession = require("express-mysql-session");
const fs = require("fs");

const profile = JSON.parse(fs.readFileSync("./profile.json", "utf-8"));
const MySQLStore = MySQLSession(session);

module.exports = () => {
  return session({
    secret: profile.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "strict",
      maxAge: 31536000000
    },
    store: new MySQLStore({
      host: "localhost",
      user: profile.mysql.user,
      password: profile.mysql.password,
      database: "connat"
    }),
  });
};