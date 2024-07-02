const express = require('express');
const pool = require('./database/db');
const app = express();
const path = require('path');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');

app.use(express.static('src'));
app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'muitosecreto',
    resave: false,
    saveUninitialized: true,
}));

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
                return { isValid: true, userId: user.id }; // Retorna userId ao invés de true
            } else {
                console.log('Senha incorreta.');
                return { isValid: false };
            }
        } else {
            console.log('Usuário não encontrado.');
            return { isValid: false };
        }
    } catch (err) {
        console.error('Erro ao verificar as credenciais', err);
        return { isValid: false };
    }
}

// Rota para a página de login
router.get('/', function(req, res) {
    res.sendFile(__dirname + "/src/index.html");
});

router.post('/login', async (req, res) => {
    const { cpf, senha } = req.body;
    console.log('CPF e senha recebidos e verificados');
    
    const result = await VerificaCredenciais(cpf, senha);

    if (result.isValid) {
        req.session.userId = result.userId; // Armazena o userId na sessão
        console.log("Login feito com sucesso");
        res.redirect('/profile');
    } else {
        console.log("Os dados fornecidos são inválidos.");
        res.redirect('/');
    }
});

// Middleware de autenticação
function checkAuth(req, res, next) {
    if (!req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
}

// Rota de perfil
router.get('/profile', checkAuth, async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM pacientes WHERE id = $1', [req.session.userId]);
        const user = result.rows[0];

        fs.readFile(path.join(__dirname, 'views', 'profile.html'), 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo HTML', err);
                res.status(500).send('Erro no servidor');
                return;
            }
            // Substitui os placeholders pelos dados reais
            const updatedData = data.replace('<%= exam.paciente %>', user.nome)
                                    .replace('<%= exam.exam_type %>', user.tipo_exame)
                                    .replace('<%= exam.data_entrada %>', user.data_entrada)
                                    .replace('<%= exam.temp_estimado %>', user.tempo_estimado)
                                    .replace('<%= exam.duration %>', user.duracao)
                                    .replace('<%= exam.appointment_time %>', user.prioridade)
                                    
            res.send(updatedData);
        });
    } finally {
        client.release();
    }
});

app.use('/', router);
app.listen(process.env.port || 3000);

console.log("O servidor está rodando");
