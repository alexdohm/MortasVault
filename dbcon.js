const { Pool } = require('pg')

const pool = new Pool({
  user: 'wbmvatjqqcwsda',
  host: 'ec2-184-73-197-211.compute-1.amazonaws.com',
  database: 'd2u16s9avedds1',
  password: '41ca8c6a098d4be9cbbabcf620915603e07c7e428a727e833c67fc02ddf55a18',
  port: 5432,
})
 module.exports = pool;
