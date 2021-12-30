const express = require('express');
const bcrypt = require('bcrypt');

const sql = require('../lib/mysql');
const _ = require('../lib/_');

const router = express.Router();

router.get('/signin', (req, res) => {
  !req.session.username ? _.send('card', { res, part: 'signin' }) : res.redirect('/');
});

router.post('/signin', (req, res) => {
  sql.async.query('select password from users where binary username = ?', [req.body.username], (err, [data]) => {
    if (err) throw err;

    if (data) {
      bcrypt.compare(req.body.password, data.password, (err, pwIsCorrect) => {
        if (pwIsCorrect) {
          req.session.username = req.body.username;
          res.send(true);
        } else {
          res.send(false);
        }
      });
    } else {
      res.send(false);
    }
  });
});

router.get('/signup', (req, res) => {
  !req.session.username ? _.send('card', { res, part: 'signup' }) : res.redirect('/');
});

router.post('/signup', (req, res) => {
  sql.async.query('select exists(select * from users where username = ? limit 1)', [req.body.username], (err, [data]) => {
    if (err) throw err;

    if (!Object.values(data)[0]) {
      bcrypt.hash(req.body.password, 10, (err, password) => {
        if (err) throw err;
        sql.async.query('insert into users (username, password) values (?, ?)', [req.body.username, password], (err, data) => {
          if (err) throw err;
          res.send(true);
        });
      });
    } else {
      res.send(false);
    }
  });
});

module.exports = router;