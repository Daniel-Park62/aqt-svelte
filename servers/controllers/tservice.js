const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/', function(req, res, next) {
  const cond = req.body.cond ? "where " + req.body.cond : "";
  aqtdb.query("	SELECT pkey, svcid, appid, svckor, svceng, svckind, task, manager, cumcnt FROM tservice a " + cond)
    .then( rows => res.json(rows) ) 
    .catch((e) => { return next(e) });
});

router.post('/',async function(req, res, next) {
  console.log(req.body) ;
  return res.status(200).send('testing...') ;
  const row = await aqtdb.query("	SELECT count(1) cnt from tservice where appid = ? and svcid = ? ",[req.body.appid, req.body.svcid]) ;
  if (row[0].cnt > 0 ) {
    return res.status(406).send('** already exists code') ;
  }

  let parms = [
    req.body.svcid,
    req.body.appid,
    req.body.svckor,
    req.body.svceng,
    req.body.svckind,
    req.body.task,
    req.body.manager
  ] ;
  const qstr = 'INSERT INTO tservice ' +
	             ' (svcid, appid, svckor, svceng, svckind, task, manager) ' +
               'VALUES (?, ?, ?, ?, ?,?,? ) ' ;
  aqtdb.query(qstr, parms)
  .then(r => res.status(201).send({message: `${req.body.code}` + " 등록되었습니다."}) )
  .catch(e => { next( new Error(e.message) ) } ) ;           

});

router.put('/',function(req, res, next) {
  let parms = [
    req.body.appid,
    req.body.svckor,
    req.body.svceng,
    req.body.svckind,
    req.body.task,
    req.body.manager,
    req.body.pkey
  ] ;
  const qstr = 'UPDATE tservice SET ' +
	             ' appid=?, svckor=?, svceng=?, svckind=?, task=?, manager=? ' +
               ' WHERE pkey = ?';
  aqtdb.query(qstr, parms)
  .then(r => res.status(201).send({message: `${req.body.code}` + " 수정되었습니다."}) )
  .catch(e => { next( new Error(e.message) ) } ) ;           

});

router.delete('/',function(req, res, next) {
  const pkeys = "(" + req.body.pkeys.join(",") + ")" ;
  console.log(pkeys) ;
  const qstr = 'delete from tservice where pkey in (?)' ; 
  aqtdb.query(qstr, [req.body.codes]) 
  .then(r => res.status(201).send(r))
  .catch(e => next(new Error(e.message))) ;

});

module.exports = router;
