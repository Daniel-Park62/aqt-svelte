const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/tsellist',async function(req, res, next) {

  aqtdb.query("	SELECT code, concat(code,' :',  desc1) name, cmpcode from tmaster ")
    .then( rows => res.json(rows) ) 
    .catch((e) => { return next(e) });
  
});

router.get('/',async function(req, res, next) {
  const cond = req.body.cond ? "where " + req.body.cond : "";
  aqtdb.query("	SELECT a.*, 0 as chk from tmaster a " + cond)
    .then( rows => res.json(rows) ) 
    .catch((e) => { return next(e) });
});

router.post('/',async function(req, res, next) {
  console.log(req) ;
  const row = await aqtdb.query("	SELECT count(1) cnt from tmaster where code = ?",[req.body.code]) ;
  if (row[0].cnt > 0 ) {
    return res.status(406).send('** already exists code') ;
  }
  let parms = [
    req.body.code,
    req.body.type,
    req.body.lvl,
    req.body.desc1,
    req.body.cmpCode,
    req.body.tdate,
    req.body.endDate,
    req.body.tdir,
    req.body.tuser,
    req.body.thost,
    req.body.tport,
    req.body.tenv
  ] ;
  const qstr = 'INSERT INTO tmaster ' +
	             ' (code, `type`, lvl, desc1, cmpCode, tdate, endDate, tdir, tuser, thost, tport, tenv) ' +
               'VALUES (?, ?, ?, ?, ?,?,?,?, ?,?,?,? ) ' ;
  const result = await aqtdb.query(qstr, parms) ;
  return res.status(201).send(result)  ;           

});

router.put('/:cd',async function(req, res, next) {

  let parms = [
    req.body.type,
    req.body.lvl,
    req.body.desc1,
    req.body.cmpCode,
    req.body.tdate,
    req.body.endDate,
    req.body.tdir,
    req.body.tuser,
    req.body.thost,
    req.body.tport,
    req.body.tenv,
    req.params.cd,
  ] ;
  const qstr = 'UPDATE tmaster SET ' +
	             ' `type`=?, lvl=?, desc1=?, cmpCode=?, tdate=?, endDate=?, tdir=?, tuser=?, thost=?, tport=?, tenv=? ' +
               ' WHERE CODE = ?';
  aqtdb.query(qstr, parms)
  .then(r => res.status(201).send(`update ${req.params.cd}`) )
  .catch(e => { return next(e) } ) ;           

});

module.exports = router;
