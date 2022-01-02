const express = require('express');
const moment = require('moment');

const sql = require('../lib/mysql');
const _ = require('../lib/_');

const router = express.Router();

router.post('/server/list', (req, res) => {
  _.getServerList(req.session.username, async (err, [data]) => {
    if (err) throw err;

    const serverList = JSON.parse(data.servers);
    let response = [];

    if (serverList.length > 0) {
      for (let sid of serverList) {
        const server = ((await (await sql.promise).execute('select name, icon from servers where sid = ? limit 1', [sid]))[0])[0];
  
        response.push({
          sid,
          name: server.name,
          icon: server.icon
        });
      }
    }

    res.send(response);
  });
});

router.post('/dm/list', (req, res) => {
  _.getDMList(req.session.username, async (err, [data]) => {
    if (err) throw err;

    const dmList = JSON.parse(data.dm);
    let response = [];

    if (dmList.length > 0) {
      for (let id of dmList) {
        const dm = ((await (await sql.promise).execute('select users from dm where id = ? limit 1', [id]))[0])[0];
        const userList = JSON.parse(dm.users);
        userList.splice(userList.indexOf(req.session.username), 1);

        response.push({ id, username: userList.toString() });
      }
    }

    res.send(response);
  });
});

router.post('/dm/history', (req, res) => {
  let response = [];
  sql.async.query('select username, message, time from dm_history where dm = ? limit 20', [req.body.id], (err, data) => {
    if (err) throw err;

    data.forEach((message) => {
      response.push({
        username: message.username,
        content: message.message,
        time: _.getDate(message.time)
      });
    });

    res.send(response);
  });
});

router.post('/join', (req, res) => {
  _.getServerList(req.session.username, (err, [data]) => {
    if (err) throw err;
    
    const serverList = JSON.parse(data.servers);

    if (!serverList.includes(req.body.sid)) {
      sql.async.query('select users from servers where sid = ? limit 1', [req.body.sid], (err, [data]) => {
        if (err) throw err;
        
        const userList = JSON.parse(data.users);

        if (!userList.includes(req.session.username)) {
          userList.push(req.session.username);
          serverList.push(req.body.sid);

          sql.async.query('update servers set users = ? where sid = ? limit 1', [JSON.stringify(userList), req.body.sid]);
          sql.async.query('update users set servers = ? where username = ? limit 1', [JSON.stringify(serverList), req.session.username], (err, data) => {
            if (err) throw err;
            res.send(true);
          });
        } else res.send(false);
      });
    } else res.send(false);
  });
});

module.exports = router;