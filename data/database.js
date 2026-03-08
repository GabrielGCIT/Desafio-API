// -----------------------------------------------------------------------------
// data/database.js — Banco de dados em memória
// -----------------------------------------------------------------------------
// Como não temos um banco real aqui, usamos um array simples para armazenar
// os pedidos enquanto o servidor estiver rodando. Quando o servidor reiniciar,
// os dados somem — isso é esperado em um ambiente de demonstração/desafio.
//
// Em produção, esse array seria substituído por chamadas a um banco de dados
// real (PostgreSQL, MongoDB, etc.), mas a lógica das rotas permaneceria
// praticamente a mesma.
// -----------------------------------------------------------------------------

const databasePedidos = [];

module.exports = { databasePedidos };
