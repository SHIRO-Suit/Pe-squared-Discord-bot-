const mysql = require('mysql');
var IsChiant = false;
module.exports.IsChiant = IsChiant;
const con = mysql.createConnection(process.env.JAWSDB_MARIA_URL+"?multipleStatements=true");
module.exports.con = con;
