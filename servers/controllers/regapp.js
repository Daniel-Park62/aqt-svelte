const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/', async function(req, res, next) {

  aqtdb.query({ rowsAsArray: true , sql: "select appid,appnm,manager from tapplication "
    })
    .then( rows => res.json(rows) ) 
    .catch((e) => {  return next(e) });
  
});

router.post('/', async function(req, res, next) {

  aqtdb.query({ rowsAsArray: true , sql: "select appid,appnm,manager from tapplication "
    })
    .then( rows => res.json(rows) ) 
    .catch((e) => {  return next(e) });
  
});

router.get('/host/:appid', async function(req, res, next) {
  aqtdb.query({ rowsAsArray: true , sql: "select appid,thost,tport from tapphosts where appid = ? "
    },[req.params.appid ])
    .then( rows => res.json(rows) ) 
    .catch((e) => { return next(e) });
  
});

module.exports = router;
