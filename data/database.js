// -----------------------------------------------------------------------------
// data/database.js — Banco de dados em memória
// -----------------------------------------------------------------------------
// Como não tenho um banco real aqui, uso um array simples para armazenar
// os pedidos enquanto o servidor estiver rodando. Quando o servidor reiniciar,
// os dados somem.
//
// Em produção, esse array seria substituído por chamadas a um banco de dados
// real (PostgreSQL, MongoDB, etc.), mas a lógica das rotas permaneceria
// praticamente a mesma.
// -----------------------------------------------------------------------------

const databasePedidos = [];

module.exports = { databasePedidos };
