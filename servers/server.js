const express    = require('express');
const app        = express();
const port = process.env.PORT || 5972;
const cors = require('cors');

app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));

const path = require('path');
const { notFound, errorHandler } = require('./middle/errors');
// const aqtdb = require('./db/dbconn') ;
const dashboard = require('./controllers/dashBoard') ;
const bytcode = require('./controllers/bytcode') ;
const bytask = require('./controllers/bytask') ;
const regapp = require('./controllers/regapp') ;
const trlist = require('./controllers/trlist') ;
const tmaster = require('./controllers/tmaster') ;
const texecjob = require('./controllers/texecjob') ;

app.use(cors());

// console.log(__dirname);
app.use(express.static('public'));
app.get('/', (req, res) => {
   res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

app.use('/dashboard', dashboard) ;
app.use('/bytcode', bytcode) ;
app.use('/bytask', bytask) ;
app.use('/regapp', regapp) ;
app.use('/trlist', trlist) ;
app.use('/tmaster', tmaster) ;
app.use('/texecjob', texecjob) ;

app.listen(port, () => {
   console.log(`Server is up at port ${port}`);
});

app.use(notFound);
app.use(errorHandler);

// (async () => {
//   const conn = await aqtdb.getConn() ;
//   conn.query("select * from tconfig").then( row => console.log(row[0]) )
//   .catch(console.log) 
//   .finally(conn.release);
// })() ;