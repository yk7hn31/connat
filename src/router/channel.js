const express = require('express');

const sql = require('../lib/mysql');
const _ = require('../lib/_');

const router = express.Router();

router.post('/list', (req, res) => {
  _.getChannelList(req.session.un, async (err, data) => {
    if (err) throw err;

    let channelList = [];

    if (data[0].channels) {
      for (let cid of data[0].channels.trim().split(' ')) {
        const channel = ((await (await sql.promise).execute('select users, private from channels where cid = ? limit 1', [cid]))[0])[0];

        channelList.push({
          id: channel.cid,
          userList: channel.users.trim().split(' '),
          isPrivate: channel.private
        });
      }
    }

    res.send(channelList);
  });
})