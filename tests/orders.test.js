const request = require('supertest');
const app     = require('../index');
const { databasePedidos } = require('../data/database');

let token;

const pedidoTeste = {
    numeroPedido: 'pedido-teste-001',
    valorTotal: 150.00,
    items: [
        { idItem: 'produto-x', quantidadeItem: 2, valorItem: 75.00 }
    ]
};

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123' });

    token = res.body.token;
});

afterAll(() => {
    // limpa os pedidos criados nos testes
    databasePedidos.splice(0, databasePedidos.length);
});

describe('POST /order', () => {
    it('cria pedido com sucesso', async () => {
        const res = await request(app)
            .post('/order')
            .set('Authorization', `Bearer ${token}`)
            .send(pedidoTeste);

        expect(res.status).toBe(201);
        expect(res.body.orderId).toBe('pedido-teste-001');
        expect(res.body).toHaveProperty('creationDate');
    });

    it('não permite pedido duplicado', async () => {
        const res = await request(app)
            .post('/order')
            .set('Authorization', `Bearer ${token}`)
            .send(pedidoTeste);

        expect(res.status).toBe(409);
    });

    it('retorna 400 se faltar numeroPedido', async () => {
        const res = await request(app)
            .post('/order')
            .set('Authorization', `Bearer ${token}`)
            .send({ valorTotal: 100, items: [{ idItem: 'x', quantidadeItem: 1, valorItem: 100 }] });

        expect(res.status).toBe(400);
    });

    it('retorna 401 sem token', async () => {
        const res = await request(app)
            .post('/order')
            .send(pedidoTeste);

        expect(res.status).toBe(401);
    });
});

describe('GET /order/list', () => {
    it('retorna array de pedidos', async () => {
        const res = await request(app)
            .get('/order/list')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('retorna 401 sem token', async () => {
        const res = await request(app).get('/order/list');
        expect(res.status).toBe(401);
    });
});

describe('GET /order/:id', () => {
    it('retorna o pedido pelo id', async () => {
        const res = await request(app)
            .get('/order/pedido-teste-001')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.orderId).toBe('pedido-teste-001');
    });

    it('retorna 404 se o pedido não existir', async () => {
        const res = await request(app)
            .get('/order/nao-existe')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});

describe('DELETE /order/:id', () => {
    it('remove o pedido com sucesso', async () => {
        const res = await request(app)
            .delete('/order/pedido-teste-001')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(204);
    });

    it('retorna 404 ao tentar deletar pedido inexistente', async () => {
        const res = await request(app)
            .delete('/order/nao-existe')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});
