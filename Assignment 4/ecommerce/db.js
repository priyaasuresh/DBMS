const { Pool, Client } = require('pg');


function getdb(usr,paswd)
{

        const pool = new Pool({
        user: usr,
        password:paswd,
        host: "localhost",
        port: "5432",
        database: "dbms_404_407_448"
        }
        )
}
       

module.exports = getdb;
// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     port: "5432",
//     database: "grocery"
// });