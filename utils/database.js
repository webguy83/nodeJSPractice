const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "node_shopping",
    password: "##83Curt83##"
})

module.exports = pool.promise();