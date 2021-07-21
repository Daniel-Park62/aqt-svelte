const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/', async function(req, res, next) {
  conn = await aqtdb.getConn() ;

  conn.query({ rowsAsArray: true , sql: "select appid,appnm,manager from tapplication "
    })
    .then( rows => res.json(rows) ) 
    .catch((e) => { conn.release() ; return next(e) });
  
  conn.release() ;
});

router.get('/host/:appid', async function(req, res, next) {
  conn = await aqtdb.getConn() ;

  conn.query({ rowsAsArray: true , sql: "select appid,thost,tport from tapphosts where appid = ? "
    },[req.params.appid ])
    .then( rows => res.json(rows) ) 
    .catch((e) => {conn.release() ; return next(e) });
  
  conn.release() ;
});

module.exports = router;
