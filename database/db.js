const { Pool } = require('pg')
const { database, password, port } = require('pg/lib/defaults')

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'dados_usuarios',
    password: '12345',
    port: 5432,
});

pool.query('SELECT NOW()', (err,res) => {
    console.log(err,res)
    pool.end
} )

module.exports = pool;