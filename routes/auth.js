const express = require('express');
const jwt     = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// usuários fixos pra fins de demonstração — em produção viria de um banco com senha em hash
const usuariosDeTeste = [
    { id: 1, username: 'admin',  password: 'admin123',  role: 'admin'  },
    { id: 2, username: 'viewer', password: 'viewer123', role: 'viewer' }
];

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoint de login
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz login e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 token:
 *                   type: string
 *                 expiraEm:
 *                   type: string
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            erro: "Os campos 'username' e 'password' são obrigatórios."
        });
    }

    // busca pelo username e senha juntos pra não vazar qual dos dois está errado
    const usuario = usuariosDeTeste.find(
        u => u.username === username && u.password === password
    );

    if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const payload = {
        id:       usuario.id,
        username: usuario.username,
        role:     usuario.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    console.log(`[AUTH] Login: ${usuario.username} (${usuario.role})`);

    res.json({
        mensagem: `Bem-vindo, ${usuario.username}!`,
        token,
        expiraEm: JWT_EXPIRATION
    });
});

module.exports = router;
