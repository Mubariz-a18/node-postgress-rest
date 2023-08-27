const { Pool } = require('pg');
const dotenv = require('dotenv')
dotenv.config()


// Configure the PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'students',
    password: process.env.PASSWORD,
    port: 5432, // Default PostgreSQL port
  }); 

  module.exports = pool