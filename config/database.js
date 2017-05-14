const pg = require('pg')
var config = {
  user: 'qfnbndnsqrkpcd', //env var: PGUSER
  database: 'df9qmolv4q7bm2', //env var: PGDATABASE
  password: 'ed3668f8896d8ec4ad10b86a732ce1de6126fdf572d828d0aaecd6d2b24d8711', //env var: PGPASSWORD
  host: 'ec2-54-163-254-76.compute-1.amazonaws.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
module.exports = pool;
