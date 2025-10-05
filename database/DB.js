const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()

const DB = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.PASS,
})

module.exports = DB