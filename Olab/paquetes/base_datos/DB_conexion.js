require('dotenv').config();

const Pool= require('pg').Pool;
const pool= new  Pool({
    user: 'postgres',
    host: process.env['PSQL_HOST'],
    database: 'olab',
    password: process.env['PSQL_PASS'],
    port: 5432,
    connectionTimeoutMillis : 5000
});

module.exports=pool;