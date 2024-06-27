const express = require('express');
const pool = require('./database/db');
const app = express();
const path = require('path');
const router = express.Router();
app.use(express.static('src'));
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// Processa os dados do formulário
app.use(bodyParser.urlencoded({ extended: true}));

async function VerificaCredenciais(cpf, senha) {
    try {
        const res = await pool.query('SELECT * FROM pacientes WHERE cpf = $1', [cpf]);

        if (res.rows.length > 0) {
            const user = res.rows[0];
            console.log('Usuário encontrado:', user);

            const match = await bcrypt.compare(senha, user.senha);
            console.log('Resultado da comparação de senha:', match);

            if (match) {
                console.log('Credenciais verificadas com sucesso.');
                return true;
            } else {
                console.log('Senha incorreta.');
                return false;
            }
        } else {
            console.log('Usuário não encontrado.');
            return false;
        }
    } catch (err) {
        console.error('Erro ao verificar as credenciais', err);
        return false;
    }
}

// Rota para a página de login
router.get('/', function(req, res) {
    res.sendFile(__dirname + "/src/index.html");
});

router.post('/login', async (req, res) => {
    const { cpf, senha } = req.body;
    console.log('CPF e senha recebidos e verificados');
    
    const isValid = await VerificaCredenciais(cpf, senha);

    if (isValid) {
        console.log("Login feito com sucesso");
    } else {
        console.log("Os dados fornecidos são inválidos.");
    }
});

app.use('/', router);
app.listen(process.env.port || 3000);

console.log("O servidor está rodando");