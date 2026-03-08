const express = require('express');

const app = express();
app.use(express.json());

let databasePedidos = [];

app.post('/order', (req, res) => {
    const entrada = req.body;

    if (!entrada.numeroPedido) {
        return res.status(400).json({ erro: "Campo 'numeroPedido' é obrigatório." });
    }
    if (entrada["valor Total"] === undefined || entrada["valor Total"] === null) {
        return res.status(400).json({ erro: "Campo 'valor Total' é obrigatório." });
    }
    if (!entrada.items || !Array.isArray(entrada.items) || entrada.items.length === 0) {
        return res.status(400).json({ erro: "Campo 'items' é obrigatório e deve conter ao menos um item." });
    }

    const jaExiste = databasePedidos.find(p => p.orderId === entrada.numeroPedido);
    if (jaExiste) {
        return res.status(409).json({ erro: `Pedido '${entrada.numeroPedido}' já existe.` });
    }

    const pedidoFormatado = {
        orderId: entrada.numeroPedido,
        value: entrada["valor Total"],
        creationDate: new Date().toISOString(),
        items: entrada.items.map(item => ({
            productId: item.idItem,
            quantity: item.quantidadeltem,
            price: item.valorltem
        }))
    };

    databasePedidos.push(pedidoFormatado);
    console.log(`[CRIADO] Pedido ${pedidoFormatado.orderId} salvo com sucesso.`);

    res.status(201).json(pedidoFormatado);
});

app.get('/order/list', (req, res) => {
    res.json(databasePedidos);
});

app.get('/order/:id', (req, res) => {
    const idProcurado = req.params.id;

    const pedido = databasePedidos.find(p => p.orderId === idProcurado);

    if (pedido) {
        console.log(`[BUSCA] Pedido ${idProcurado} encontrado.`);
        res.json(pedido);
    } else {
        console.log(`[ERRO] Pedido ${idProcurado} não encontrado.`);
        res.status(404).json({ erro: "Pedido não encontrado." });
    }
});

app.delete('/order/:id', (req, res) => {
    const idParaDeletar = req.params.id;

    const index = databasePedidos.findIndex(p => p.orderId === idParaDeletar);

    if (index !== -1) {
        databasePedidos.splice(index, 1);
        console.log(`[DELETADO] Pedido ${idParaDeletar} removido.`);
        res.status(204).send();
    } else {
        res.status(404).json({ erro: "Pedido não encontrado para exclusão." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`- POST   http://localhost:${PORT}/order`);
    console.log(`- GET    http://localhost:${PORT}/order/list`);
    console.log(`- GET    http://localhost:${PORT}/order/:id`);
    console.log(`- DELETE http://localhost:${PORT}/order/:id`);
});
