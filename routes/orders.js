const express = require('express');

const router          = express.Router();
const verificarToken  = require('../middleware/auth');
const { databasePedidos } = require('../data/database');

// todas as rotas deste arquivo exigem token válido
router.use(verificarToken);

// valida um item e retorna a mensagem de erro, ou null se estiver ok
function validarItem(item, indice) {
    const prefixo = `Item na posição ${indice}`;

    if (!item.idItem || typeof item.idItem !== 'string' || item.idItem.trim() === '') {
        return `${prefixo}: 'idItem' é obrigatório e deve ser uma string não vazia.`;
    }
    if (item.quantidadeItem === undefined || item.quantidadeItem === null) {
        return `${prefixo}: 'quantidadeItem' é obrigatório.`;
    }
    if (!Number.isInteger(item.quantidadeItem) || item.quantidadeItem < 1) {
        return `${prefixo}: 'quantidadeItem' deve ser um inteiro maior que zero.`;
    }
    if (item.valorItem === undefined || item.valorItem === null) {
        return `${prefixo}: 'valorItem' é obrigatório.`;
    }
    if (typeof item.valorItem !== 'number' || item.valorItem <= 0) {
        return `${prefixo}: 'valorItem' deve ser um número maior que zero.`;
    }

    return null;
}

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: CRUD de pedidos (exige autenticação JWT)
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoEntrada'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: Já existe um pedido com esse ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/', (req, res) => {
    const entrada = req.body;

    if (!entrada.numeroPedido || typeof entrada.numeroPedido !== 'string' || entrada.numeroPedido.trim() === '') {
        return res.status(400).json({
            erro: "Campo 'numeroPedido' é obrigatório e deve ser uma string não vazia."
        });
    }

    if (entrada.valorTotal === undefined || entrada.valorTotal === null) {
        return res.status(400).json({ erro: "Campo 'valorTotal' é obrigatório." });
    }

    if (typeof entrada.valorTotal !== 'number' || entrada.valorTotal <= 0) {
        return res.status(400).json({
            erro: "Campo 'valorTotal' deve ser um número maior que zero."
        });
    }

    if (!Array.isArray(entrada.items) || entrada.items.length === 0) {
        return res.status(400).json({
            erro: "Campo 'items' é obrigatório e deve ter ao menos um item."
        });
    }

    // valida todos os itens de uma vez pra retornar todos os erros juntos
    const errosDeItens = entrada.items
        .map((item, i) => validarItem(item, i))
        .filter(erro => erro !== null);

    if (errosDeItens.length > 0) {
        return res.status(400).json({
            erro: 'Um ou mais itens contêm dados inválidos.',
            detalhes: errosDeItens
        });
    }

    const numeroPedidoNormalizado = entrada.numeroPedido.trim();

    const jaExiste = databasePedidos.find(p => p.orderId === numeroPedidoNormalizado);
    if (jaExiste) {
        return res.status(409).json({
            erro: `Já existe um pedido com o ID '${numeroPedidoNormalizado}'.`
        });
    }

    const pedidoFormatado = {
        orderId:      numeroPedidoNormalizado,
        value:        entrada.valorTotal,
        creationDate: new Date().toISOString(),
        items: entrada.items.map(item => ({
            productId: item.idItem.trim(),
            quantity:  item.quantidadeItem,
            price:     item.valorItem
        }))
    };

    databasePedidos.push(pedidoFormatado);

    console.log(`[PEDIDO] Criado: ${pedidoFormatado.orderId} | R$${pedidoFormatado.value}`);

    res.status(201).json(pedidoFormatado);
});

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/list', (req, res) => {
    console.log(`[LISTAGEM] ${databasePedidos.length} pedido(s) — usuário: ${req.usuario.username}`);
    res.json(databasePedidos);
});

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/:id', (req, res) => {
    const pedido = databasePedidos.find(p => p.orderId === req.params.id);

    if (!pedido) {
        return res.status(404).json({
            erro: `Pedido '${req.params.id}' não encontrado.`,
            dica: 'Use GET /order/list para ver os pedidos disponíveis.'
        });
    }

    res.json(pedido);
});

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Remove um pedido pelo ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       204:
 *         description: Pedido removido com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete('/:id', (req, res) => {
    const index = databasePedidos.findIndex(p => p.orderId === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            erro: `Pedido '${req.params.id}' não encontrado.`,
            dica: 'Use GET /order/list para confirmar os IDs disponíveis.'
        });
    }

    databasePedidos.splice(index, 1);

    console.log(`[DELETADO] ${req.params.id} por ${req.usuario.username}`);

    // 204 No Content — padrão REST para deleção bem-sucedida
    res.status(204).send();
});

module.exports = router;
