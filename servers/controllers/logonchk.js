const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/', async function(req, res, next) {
  if (!req.query.pass ) {
    res.send([]);
    return ;
  }
  aqtdb.query({dateStrings:true, sql: "select if( PASSWORD(?) = pass1, 1,0) chk FROM tconfig "}, [ req.query.pass ])
    .then( rows => res.json(rows[0]) ) 
    .catch((e) => {  return next(e) }) ;
  }) ;
   
module.exports = router;
