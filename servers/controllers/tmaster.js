const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/tsellist', function(req, res, next) {

  aqtdb.query("	SELECT code, desc1 name, cmpcode,enddate  from tmaster ")
    .then( rows => res.json(rows) ) 
    .catch((e) => { return next(e) });
  
});

router.get('/torglist', function(req, res, next) {

  aqtdb.query("	SELECT tcode, date_format(o_stime,'%Y/%m/%d') sdate FROM tloaddata GROUP BY tcode ")
    .then( rows => res.json(rows) ) 
    .catch((e) => { return next(e) });
  
});

router.get('/', function(req, res, next) {
  const cond = req.body.cond ? "where " + req.body.cond : "";
  aqtdb.query("	SELECT a.*, 0 as chk from tmaster a " + cond)
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
      aqtdb.query('call sp_summary(?)',[req.body.dstcode]) ;
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
	             ' (code, type, lvl, desc1, cmpCode, tdate, endDate, tdir, tuser, thost, tport, tenv) ' +
               'VALUES (?, ?, ?, ?, ?,?,?,?, ?,?,?,? ) ' ;
  aqtdb.query(qstr, parms)
  .then(r => res.status(201).send({message: `${req.body.code}` + " 등록되었습니다."}) )
  .catch(e => { next( new Error(e.message) ) } ) ;           

});

router.put('/',function(req, res, next) {
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
    req.body.code
  ] ;
  const qstr = 'UPDATE tmaster SET ' +
	             ' `type`=?, lvl=?, desc1=?, cmpCode=?, tdate=?, endDate=?, tdir=?, tuser=?, thost=?, tport=?, tenv=? ' +
               ' WHERE CODE = ?';
  aqtdb.query(qstr, parms)
  .then(r => res.status(201).send({message: `${req.body.code}` + " 수정되었습니다."}) )
  .catch(e => { next( new Error(e.message) ) } ) ;           

});

router.delete('/',function(req, res, next) {
  const codes = "('" + req.body.codes.join("', '") + "')" ;
  console.log(codes) ;
  const qstr = 'delete from tmaster where code in (?)' ; // + codes;
  aqtdb.query(qstr, [req.body.codes]) 
  .then(r => res.status(201).send(r))
  .catch(e => next(new Error(e.message))) ;

});
router.put('/erasetr',function(req, res, next) {
  const codes = "('" + req.body.codes.join("', '") + "')" ;

  const qstr = 'delete from ttcppacket where tcode in (?)' 
  aqtdb.query(qstr, [req.body.codes])
  .then(r => res.status(201).send(r))
  .catch(e => next(new Error(e.message))) ;

});

module.exports = router;
