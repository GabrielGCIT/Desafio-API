require('dotenv').config();

const express     = require('express');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes  = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(express.json());

// log básico pra acompanhar as requisições durante o dev
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'API de Pedidos — Documentação'
}));

app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

// 404 — nenhuma rota reconheceu o caminho
app.use((req, res) => {
    res.status(404).json({
        erro: `Rota '${req.method} ${req.originalUrl}' não encontrada.`,
        dica: 'Consulte /api-docs para ver os endpoints disponíveis.'
    });
});

// o 4º parâmetro (err) é obrigatório pro Express reconhecer como handler de erro
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('[ERRO]', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;

// só sobe o servidor quando o arquivo é chamado diretamente, não nos testes
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\nServidor rodando em http://localhost:${PORT}`);
        console.log(`Docs: http://localhost:${PORT}/api-docs\n`);
    });
}

module.exports = app;
