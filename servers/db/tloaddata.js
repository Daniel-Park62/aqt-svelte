const aqtdb = require('./dbconn') ;

const tloaddata = {
 find : async (args) => {
  if (!args.enc) args.enc ='';
  if (!args.psize ) {
    return [] ;
  }
  let etcond = '';
  if (args.rcode) etcond = 'and (rcode = ' + args.rcode + ') ' ;
  if (args.cond) etcond += ' and (' + args.cond + ') ' ;

  aqtdb.query({dateStrings:true, 
               sql: "	SELECT pkey,  tcode, o_stime, stime, rtime, svctime, elapsed, srcip, srcport, dstip, dstport, method,  \
               '' appid, uri, seqno, ackno, rcode, errinfo, sflag, rhead, slen, rlen, \
               cast(sdata AS CHAR(250) " + args.enc + ") sdata , cast(rdata AS CHAR(250) " + args.enc + ") rdata,\
               date_format(cdate,'%Y-%m-%d %T') cdate \
               FROM tloaddata t  where tcode  = ? and t.uri rlike ? " + etcond + " order by o_stime limit ?, ?  "  }
              , [  args.tcode ,args.uri , args.page * args.psize, +(args.psize)  ])
    .then( rows => { return rows } ) 
    .catch((e) => { throw e.sqlMessage });
  },
  findById : async (args) => {
    if (!args.enc) args.enc ='';
  
    aqtdb.query({dateStrings:true, 
      sql: "	SELECT pkey,  tcode, o_stime, stime, rtime, svctime, elapsed, srcip, srcport, dstip, dstport, method,  \
      '' appid, uri, seqno, ackno, rcode, errinfo, sflag, rhead, slen, rlen, \
      cast(sdata AS CHAR " + args.enc + ") sdata , cast(rdata AS CHAR " + args.enc + ") rdata,\
      date_format(cdate,'%Y-%m-%d %T') cdate \
      FROM tloaddata t  where pkey  = ? limit 1"  }
     , [  args.id ])
.then( rows => { return rows } ) 
      .catch((e) => { throw e.sqlMessage });
    },
  }
 
module.exports = tloaddata ;




