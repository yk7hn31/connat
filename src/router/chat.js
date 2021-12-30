const express = require('express');

const sql = require('../lib/mysql');
const _ = require('../lib/_');

const router = express.Router();

router.post('/list', (req, res) => {
  _.getServerList(req.session.username, async (err, [data]) => {
    if (err) throw err;

    const serverList = JSON.parse(data.servers);
    let response = [];

    if (serverList.length > 0) {
      for (let sid of serverList) {
        const server = ((await (await sql.promise).execute('select name, users from servers where sid = ? limit 1', [sid]))[0])[0];
  
        response.push({
          sid: sid,
          name: server.name,
          users: JSON.stringify(server.users)
        });
      }
    }

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