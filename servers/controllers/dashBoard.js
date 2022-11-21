const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn');
// BigInt.prototype.toJSON = function() { return this.toString(); }

router.get('/', async function (req, res, next) {
  // conn = await aqtdb.getConn();
  aqtdb.query({ dateStrings: true, sql: 'select * from vtrxlist order by lvl desc, tdate desc' })
    .then(rows => res.json(rows) )
    .catch((e) => {  return next(e) });
});

router.get('/summary', async function (req, res, next) {

  const result = {
    svccnt: 0, // 서비스 수
    rows: []
  } ;
  try {
    result.rows = await aqtdb.query({ dateStrings: true, sql: 'select lvl, svc_cnt,data_cnt,scnt from tlevel ' }) ;
    let row = await aqtdb.query('select count(1) as scnt from tservice') ;
    result.svccnt =  row[0].scnt ;
    res.json(result) ;
  } catch (e) {
    return next(e) ;
  }
  
});

module.exports = router;
