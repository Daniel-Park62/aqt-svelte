const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn');

router.get('/', async function (req, res, next) {
  conn = await aqtdb.getConn();

  conn.query({ dateStrings: true, sql: 'select * from vtrxlist order by lvl desc, tdate desc' })
    .then(rows => res.json(rows))
    .catch((e) => { conn.release(); return next(e) });
  conn.release();
});

router.get('/summary', async function (req, res, next) {
  conn = await aqtdb.getConn();
  const result = {
    svccnt: 0, // 서비스 수
    rows: []
  };
  await Promise.all([
    conn.query({ dateStrings: true, sql: 'select lvl, svc_cnt,data_cnt,scnt from tlevel ' })
      .then(rows => result.rows = rows)
      .catch((e) => { conn.release(); return next(e) }),
    conn.query('select count(1) as scnt from tservice')
      .then(row => result.svccnt = row[0].scnt)
      .catch((e) => { conn.release(); return next(e) })
  ]);
  res.json(result);

  conn.release();
});

module.exports = router;
