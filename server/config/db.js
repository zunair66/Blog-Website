import mysql from 'mysql2/promise'
import 'dotenv/config'
const mysqlPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
})

export default mysqlPool