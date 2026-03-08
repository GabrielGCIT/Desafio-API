const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            erro: 'Token de autenticação não fornecido.',
            dica: 'Inclua o header: Authorization: Bearer <seu_token>'
        });
    }

    // o formato esperado é "Bearer <token>" — duas partes separadas por espaço
    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            erro: 'Formato de token inválido.',
            dica: 'Use: Authorization: Bearer <seu_token>'
        });
    }

    const token = partes[1];

    try {
        const dadosDoToken = jwt.verify(token, JWT_SECRET);
        req.usuario = dadosDoToken; // disponível nas rotas via req.usuario
        next();
    } catch (err) {
        // jwt.verify lança erros tipados, isso permite retornar mensagens específicas
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                erro: 'Sessão expirada. Faça login novamente.'
            });
        }

        return res.status(401).json({
            erro: 'Token inválido.',
            dica: 'Use o token retornado pelo POST /auth/login'
        });
    }
}

module.exports = verificarToken;
