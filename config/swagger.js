const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Pedidos',
            version: '1.0.0',
            description: 'API REST para gerenciamento de pedidos. Faça login em POST /auth/login, copie o token e use o botão Authorize para autenticar.'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Erro: {
                    type: 'object',
                    properties: {
                        erro: { type: 'string' },
                        dica: { type: 'string' }
                    }
                },
                ItemEntrada: {
                    type: 'object',
                    required: ['idItem', 'quantidadeItem', 'valorItem'],
                    properties: {
                        idItem:          { type: 'string',  example: 'produto-abc' },
                        quantidadeItem:  { type: 'integer', minimum: 1, example: 2 },
                        valorItem:       { type: 'number',  minimum: 0.01, example: 75.00 }
                    }
                },
                PedidoEntrada: {
                    type: 'object',
                    required: ['numeroPedido', 'valorTotal', 'items'],
                    properties: {
                        numeroPedido: { type: 'string', example: 'v10089015vdb-01' },
                        valorTotal:   { type: 'number', minimum: 0.01, example: 150.00 },
                        items: {
                            type: 'array',
                            minItems: 1,
                            items: { '$ref': '#/components/schemas/ItemEntrada' }
                        }
                    }
                },
                ItemPedido: {
                    type: 'object',
                    properties: {
                        productId: { type: 'string',  example: 'produto-abc' },
                        quantity:  { type: 'integer', example: 2 },
                        price:     { type: 'number',  example: 75.00 }
                    }
                },
                Pedido: {
                    type: 'object',
                    properties: {
                        orderId:      { type: 'string', example: 'v10089015vdb-01' },
                        value:        { type: 'number', example: 150.00 },
                        creationDate: { type: 'string', format: 'date-time' },
                        items: {
                            type: 'array',
                            items: { '$ref': '#/components/schemas/ItemPedido' }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
