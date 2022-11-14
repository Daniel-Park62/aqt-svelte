const express = require('express');
const router = express.Router();
const aqtdb = require('../db/dbconn') ;
 
router.get('/', async function(req, res, next) {
  if (!req.query.tcode ) {
    res.send([]);
    return ;
  }

  aqtdb.query({dateStrings:true, sql: "select a.svcid, ifnull(s.svckor,'') svckor, a.tcnt, a.avgt ,a.scnt ,a.fcnt,  s.cumcnt \
                                        FROM  ( \
            select t.tcode, t.uri svcid,  dstip, dstport, count(1) tcnt, round(avg(t.svctime),3) avgt, sum(case when t.sflag = '1' then 1 else 0 end) scnt \
        , sum(case when t.sflag = '2' then 1 else 0 end) fcnt \
        from   Ttcppacket t   \
        WHERE t.tcode = ?   group by t.tcode, t.uri \
      ) a \
      left outer join tservice s on (a.svcid = s.svcid and uf_getapp(dstip,dstport) = s.appid) order by a.svcid "
    }, [ req.query.tcode ])
    .then( rows => res.json(rows) ) 
    .catch((e) => {  return next(e) });
  
  // const rows = await conn.query({dateStrings:true, sql: 'select * from vtrxlist '})  ;
  // const scnt = await conn.query('select count(1) as scnt from tservice') ;
  // res.send({ scnt: scnt[0].scnt, data: rows} ) ;
  
});
 
module.exports = router;
