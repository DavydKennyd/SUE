const pool = require('../database/db');

async function VerificaCredenciais(cpf, senha) {
    try {
        const res = await pool.query(
            'SELECT * FROM pacientes WHERE cpf = $1 AND senha = $2',
            [cpf, senha]
        );

        if (res.rows.length > 0) {
            console.log('Credenciais verificadas com sucesso.');
            return true;  // Quando o usuário for encontrado
        } else {
            console.log('Credenciais inválidas.');
            return false;  // Quando o usuário não for encontrado
        }
    } catch (error) {
        console.error('Erro ao verificar credenciais:', error);
        return false;  // Retornar false em caso de erro
    }
};

module.exports = VerificaCredenciais;
