const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn');

router.get('/', function (req, res, next) {
  const cond = req.body.cond ? "where " + req.body.cond : "";
  aqtdb.query({ rowsAsArray: true, sql: "SELECT '' , pkey, appid, svcid,  svckor, svceng, task, manager, svckind FROM tservice a " + cond })
    .then(rows => res.json(rows))
    .catch((e) => { return next(e) });
});

router.post('/', async function (req, res, next) {
  let qstr = 'REPLACE INTO tservice ' +
    ' (pkey, appid, svcid,  svckor, svceng, task, manager, svckind) ' +
    'VALUES (?, ?, ?, ?, ?,?,?,? ) ';
  aqtdb.batch(qstr, req.body.upd)
    .catch(e => { next(new Error(e.message)) });

  if (req.body.ins.length > 0) {
    qstr = 'INSERT INTO tservice ' +
      ' ( appid, svcid,  svckor, svceng, task, manager, svckind) ' +
      'VALUES ( ?, ?, ?, ?,?,?,? ) ';
    aqtdb.batch(qstr, req.body.ins)
      .then(r => res.status(201).send({ message: " 등록되었습니다." }))
      .catch(e => { next(new Error(e.message)) });
  } else {
    res.status(201).send({ message: " 등록되었습니다." });
  }

});

router.delete('/', function (req, res, next) {
  const pkeys = "(" + req.body.pkeys.join(",") + ")";
  console.log(pkeys);
  const qstr = 'delete from tservice where pkey in (?)';
  aqtdb.query(qstr, [req.body.codes])
    .then(r => res.status(201).send(r))
    .catch(e => next(new Error(e.message)));

});

module.exports = router;
