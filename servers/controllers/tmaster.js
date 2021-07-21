const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/tsellist',async function(req, res, next) {
  conn = await aqtdb.getConn() ;

  conn.query("	SELECT code, concat(code,' :',  desc1) name, cmpcode from tmaster ")
    .then( rows => res.json(rows) ) 
    .catch((e) => { conn.release() ; return next(e) });
  
  // const rows = await conn.query({dateStrings:true, sql: 'select * from vtrxlist '})  ;
  // const scnt = await conn.query('select count(1) as scnt from tservice') ;
  // res.send({ scnt: scnt[0].scnt, data: rows} ) ;
  conn.release() ;
});

module.exports = router;
