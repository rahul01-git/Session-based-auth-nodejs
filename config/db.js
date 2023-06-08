const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const getConnection = () => {
    const conn = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    })
    console.log('connected to database succesfully');
    return conn
}

module.exports = getConnection