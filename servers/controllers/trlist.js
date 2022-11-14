const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.post('/', async function(req, res, next) {
  if (!req.body.psize ) {
    res.send([]);
    return ;
  }

  let etcond = '';
  if (req.body.rcode) etcond = 'and (rcode = ' + req.body.rcode + ') ' ;
  if (req.body.cond) etcond += 'and (' + req.body.cond + ') ' ;
  // console.log(req.body);
  aqtdb.query({dateStrings:true, 
               sql: "	SELECT pkey, cmpid id, tcode tid, o_stime, stime `송신시간`, rtime, elapsed `소요시간`, method, uri, sflag, rcode status, \
                  rhead `수신헤더`, rlen `수신크기`,  date_format(cdate,'%Y-%m-%d %T') cdate \
                  FROM ttcppacket t  where tcode like ? and uri rlike ? " + etcond + " order by o_stime limit ?, ? "
    }, [ req.body.tcode, req.body.uri  , req.body.page * req.body.psize, +(req.body.psize)  ])
    .then( rows => { return res.json(rows) } ) 
    .catch((e) => { return next(e) });
  
  // const rows = await conn.query({dateStrings:true, sql: 'select * from vtrxlist '})  ;
  // const scnt = await conn.query('select count(1) as scnt from tservice') ;
  // res.send({ scnt: scnt[0].scnt, data: rows} ) ;

});

router.get('/:id', async function(req, res, next) {
  // console.log(req.params)
  let etcond = '';

  aqtdb.query({dateStrings:true, 
               sql: "	SELECT pkey, cmpid, tcode, o_stime, stime, rtime, svctime, elapsed, srcip, srcport, dstip, dstport, method,  \
               uri, seqno, ackno, rcode, sflag, rhead, slen, rlen, cast(sdata AS CHAR) sdata , cast(rdata AS CHAR) rdata, date_format(cdate,'%Y-%m-%d %T') cdate \
               FROM ttcppacket t  where pkey  = ? "  }
              , [ req.params.id])
    .then( rows => { return res.json(rows) } ) 
    .catch((e) => { console.error(e); return next(e) });
  
  // const rows = await conn.query({dateStrings:true, sql: 'select * from vtrxlist '})  ;
  // const scnt = await conn.query('select count(1) as scnt from tservice') ;
  // res.send({ scnt: scnt[0].scnt, data: rows} ) ;
});

router.get('/next/:id', async function(req, res, next) {

  let etcond = '';
  try {
    
    const rows = await aqtdb.query({dateStrings:true, 
               sql: "	SELECT t.pkey, cmpid, t.tcode, t.o_stime, stime, rtime, svctime, elapsed, srcip, srcport, dstip, dstport, method,  \
               uri, seqno, ackno, rcode, sflag, rhead, slen, rlen, cast(sdata AS CHAR) sdata , cast(rdata AS CHAR) rdata, date_format(cdate,'%Y-%m-%d %T') cdate \
               FROM ttcppacket t ,(SELECT pkey, O_STIME, TCODE FROM ttcppacket where pkey = ?) c  \
               where t.tcode = c.tcode and t.pkey  != c.pkey  and t.o_stime > c.o_stime order by t.o_stime limit 1"  }
              , [  req.params.id ]) ;
    if (rows.length > 0 ) {
      return res.json(rows) ;
    } else {
      const error = new Error('다음 데이터가 없습니다.');
      res.status(404) ;
      return next(error) ;
    }
  } catch (e) {
    console.error(e); 
    return next(e)
  }
  
  // const rows = await conn.query({dateStrings:true, sql: 'select * from vtrxlist '})  ;
  // const scnt = await conn.query('select count(1) as scnt from tservice') ;
  // res.send({ scnt: scnt[0].scnt, data: rows} ) ;
});

router.get('/prev/:id', async function(req, res, next) {
  let etcond = '';
  try {
    
    const rows = await aqtdb.query({dateStrings:true, 
               sql: "	SELECT t.pkey, cmpid, t.tcode, t.o_stime, stime, rtime, svctime, elapsed, srcip, srcport, dstip, dstport, method,  \
               uri, seqno, ackno, rcode, sflag, rhead, slen, rlen, cast(sdata AS CHAR) sdata , cast(rdata AS CHAR) rdata, date_format(cdate,'%Y-%m-%d %T') cdate \
               FROM ttcppacket t ,(SELECT pkey, O_STIME, TCODE FROM ttcppacket where pkey = ?) c  \
               where t.tcode = c.tcode and t.pkey  != c.pkey  and t.o_stime < c.o_stime order by t.o_stime desc limit 1"  }
              , [  req.params.id ]) ;
    if (rows.length > 0 ) {
      res.json(rows) ;
    } else {
      const error = new Error('이전 데이터가 없습니다.');
      res.status(404) ;
      return next(error) ;
    }
  } catch (e) {
    console.error(e); 
    return next(e)
  }
  
});

router.get('/orig/:id', async function(req, res, next) {

  let etcond = '';

  aqtdb.query({dateStrings:true, 
               sql: "	SELECT pkey, cmpid, tcode, o_stime, stime, rtime, svctime, elapsed, srcip, srcport, dstip, dstport, method,  \
               uri, seqno, ackno, rcode, sflag, rhead, slen, rlen, cast(sdata AS CHAR) sdata , cast(rdata AS CHAR) rdata, date_format(cdate,'%Y-%m-%d %T') cdate \
               FROM tloaddata t  where pkey  = ? limit 1"  }
              , [  req.params.id ])
    .then( rows => { return res.json(rows)} ) 
    .catch((e) => { console.error(e); return next(e) });
  
  // const rows = await conn.query({dateStrings:true, sql: 'select * from vtrxlist '})  ;
  // const scnt = await conn.query('select count(1) as scnt from tservice') ;
  // res.send({ scnt: scnt[0].scnt, data: rows} ) ;
});

module.exports = router;
