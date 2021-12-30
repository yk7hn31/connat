const express = require('express');

const sql = require('../lib/mysql');
const _ = require('../lib/_');

const router = express.Router();

router.post('/list', (req, res) => {
  _.getServerList(req.session.username, async (err, [data]) => {
    if (err) throw err;

    let serverList = JSON.parse(data.servers);
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

module.exports = router;