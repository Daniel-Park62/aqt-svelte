const mariadb = require('mariadb');
const config = require('./dbinfo').real;

const pool = mariadb.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: 10,
      bigIntAsNumber: true,
      insertIdAsNumber : true,
      decimalAsNumber : true
}) ;

module.exports = pool ;
