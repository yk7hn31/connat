const fs = require("fs");
const moment = require('moment');

const sql = require('./mysql');

module.exports = {
  html: {
    replace: (string, replace) => {
      for (let i = 0; i < replace.length; i++) {
        let regex = "\\$\\{" + (i + 1).toString() + "\\}";
        string = string.replace(new RegExp(regex, "g"), replace[i]);
      }

      return string;
    },
    part: function (file, arr) {
      let part = fs.readFileSync(`./html/part/${file}.html`, "utf-8");
      return arr ? this.replace(part, arr) : part;
    }
  },
  getChannelList: (un, callback) => sql.async.query('select channels from users where username = ? limit 1', [un], callback),
  getDate: () => moment().format('MMM DD, hh:mm A'),
  send: function (file, option) {
    let base = fs.readFileSync(`./html/${file}.html`, "utf-8");
    let result = base;

    if (option.part) {
      let part = "";

      if (option.repl) {
        if (option.repl.base) base = this.html.replace(base, option.repl.base);
        if (option.repl.part)
          part = this.html.part(option.part, option.repl.part);
      } else {
        part = this.html.part(option.part);
      }

      result = base.replace("${c}", part);
    } else {
      if (option.repl) {
        if (option.repl.base) base = this.html.replace(base, option.repl.base);
      }

      result = base;
    }

    option.res.send(result);
  }
};