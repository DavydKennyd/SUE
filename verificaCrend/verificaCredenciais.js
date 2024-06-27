


const pool = require('../database/db');

async function VerificaCredenciais( cpf, senha) {
    try {
        const res = await pool.query(
            'SELECT * FROM pacientes WHERE cpf = $1 AND senha = $2',
            [cpf, senha]
        );

        if (res.rows.lenght > 0){
            console.log('Credenciais verificadas com sucesso.');
            return true;  ///Quando o usuario for encontrado
        } else{
            console.log('credenciais invalidas.');
            return false; ///Quando o usuario não for encontrado
        }
    }







}