const express = require('express');
const router = express.Router();
const path = require('path');
const aqtdb = require('../db/dbconn') ;
const fs = require('fs');

router.post('/', async function(req, res, next) {

  let senc = '' ;
  await aqtdb.query("select tenv from tmaster where code = ? limit 1",[req.body.tcode])
  .then(rows => {
    if ( rows[0]?.tenv == 'euc-kr') senc = ' charset euckr' ;
  }) ;

  const tfile = 't' + Date.now().toString().substr(-6) + '.csv' ;
//  const tfilenm =  (process.env.AQTLOG ?? '.' ) + '/' + tfile ;
// const tfilenm =  path.join(__dirname, "../") + tfile ;
  const tfilenm =  "f:/MARIADB/data/" + tfile ;


  let etcond = '';
  if (req.body.rcode) etcond = 'and (rcode = ' + req.body.rcode + ') ' ;
  if (req.body.cond) etcond += ' and (' + req.body.cond + ') ' ;
    // console.log("enc:", senc);
  const str_qry = " SELECT A.uri 서비스,s.svckor `서비스명`, \
        A.sdata 송신데이터,A.svctime 소요시간, B.svctime 원_소요시간, \
        CAST( SUBSTR(A.rdata,1,100) AS CHAR " + senc + " ) 수신,   \
        CAST( SUBSTR(B.rdata,1,100) AS CHAR " + senc + " ) 원수신  \
        FROM ttcppacket A JOIN tloaddata B ON (A.cmpid = B.pkey)  \
        LEFT JOIN tservice s ON (A.appid = s.appid AND A.uri = s.svcid ) \
        WHERE a.tcode = ? and a.appid rlike ? " + etcond +
        " INTO OUTFILE ? \
          FIELDS TERMINATED BY '\\t' OPTIONALLY ENCLOSED BY '\"' \
          LINES TERMINATED BY '\\n'  " ;
//      console.log(str_qry, etcond,  tfilenm ) ;
  const fff = __dirname + '/' + tfile ;
 
  aqtdb.query({dateStrings:true, 
               sql: str_qry  }, [ req.body.tcode,req.body.apps,  tfilenm ])
    .then( rows => {   fs.copyFileSync(tfilenm, fff) ;
        fs.unlink(tfilenm, err => console.log(err));
         
        // res.setHeader('Content-Disposition', `attachment; filename=${tfile}`) ;
        res.download(fff) ;
        // console.log( fff,  tfile) ;
        setTimeout( () => fs.unlinkSync(fff), 5000) ;
      } )
//       res.download(  __dirname + '/abcd.txt',  (err) => console.error('xxx ',err) ) } ) 
    .catch((e) => { console.error(e) ; return next(e) });
  
  // const rows = await conn.query({dateStrings:true, sql: 'select * from vtrxlist '})  ;
  // const scnt = await conn.query('select count(1) as scnt from tservice') ;
  // res.send({ scnt: scnt[0].scnt, data: rows} ) ;

});


module.exports = router;
