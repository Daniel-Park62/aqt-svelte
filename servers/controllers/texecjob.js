const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/', function(req, res, next) {
  const cond = req.body.cond ? "where " + req.body.cond : "";
  aqtdb.query("	SELECT a.*, 0 as chk from texecjob a " + cond)
    .then( rows => res.json(rows) ) 
    .catch((e) => { return next(e) });
});

router.post('/copyTr', function(req, res, next) {
  let parms = [
    req.body.srccode,
    req.body.dstcode,
    (req.body.uri > '' ? "uri rlike '" + req.body.uri + "' and "  : '')  + req.body.cond,
    req.body.cnt
  ] ;
  // console.log(parms) ;
  const qstr = 'call sp_loaddata2(?,?,?,?) ' ;
  aqtdb.query(qstr, parms) 
    .then(r => {
      // console.log("ok:",r[0]) ;
      res.status(201).send(r[0] );
    })
    .catch( e => {
      console.error("error:",e) ;
      next(e);
    }) 
    ;           

});

router.post('/',async function(req, res, next) {
  const row = await aqtdb.query("	SELECT count(1) cnt from tmaster where code = ?",[req.body.code]) ;
  if (row[0].cnt > 0 ) {
    return res.status(406).send('** already exists code') ;
  }

  const qstr = 'INSERT INTO texecjob ' +
	             ' (jobkind, tcode, tdesc, tnum, dbskip, etc, in_file, reqstartDt, exectype, resultstat, reqnum, repnum) ' +
               'VALUES (?, ?, ?, ?, ?,?,?,?, ?,?,?,? ) ' ;
  aqtdb.query(qstr, [
    req.body.jobkind, req.body.tcode, req.body.tdesc, req.body.tnum, 
    req.body.dbskip, req.body.etc, req.body.in_file, req.body.reqstartDt,
    req.body.exectype, req.body.resultstat, req.body.reqnum, req.body.repnum
  ])
  .then(r => res.status(201).send({message: " 등록되었습니다."}) )
  .catch(e => { next( new Error(e.message) ) } ) ;           

});

router.put('/',function(req, res, next) {
  const qstr = 'UPDATE texecjob SET ' +
	             ' tcode=?, tdesc=?, tnum=?, dbskip=?, etc=?, in_file=?, reqstartDt=?, exectype=?, resultstat=?, reqnum=?, repnum=? ' +
               ' WHERE pkey = ?';
  aqtdb.query(qstr, [
    req.body.tcode, req.body.tdesc, req.body.tnum, 
    req.body.dbskip, req.body.etc, req.body.in_file, req.body.reqstartDt,
    req.body.exectype, req.body.resultstat, req.body.reqnum, req.body.repnum,
    req.body.pkey
  ])
  .then(r => res.status(201).send({message: `${req.body.code}` + " 수정되었습니다."}) )
  .catch(e => { next( new Error(e.message) ) } ) ;           

});

router.delete('/',function(req, res, next) {

  const qstr = 'delete from texecjob where pkey in (?)' ; 
  aqtdb.query(qstr, [req.body.codes]) 
  .then(r => res.status(201).send(r))
  .catch(e => next(new Error(e.message))) ;

});

module.exports = router;
