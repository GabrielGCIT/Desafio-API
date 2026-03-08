const request = require('supertest');
const app     = require('../index');

describe('POST /auth/login', () => {
    it('retorna token com credenciais válidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'admin', password: 'admin123' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.mensagem).toBe('Bem-vindo, admin!');
    });

    it('retorna 401 com senha errada', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'admin', password: 'errada' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('erro');
    });

    it('retorna 400 se faltar campos', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'admin' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('erro');
    });
});
