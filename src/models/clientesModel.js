// Importar o pool de conexões do PostgreSQL
const pool = require('../config/database');

// ============================================================
// FUNÇÃO: listarTodos
// DESCRIÇÃO: Retorna todos os clientes do banco
// RETORNO: Promise com array de clientes
// ============================================================
async function listarTodos() {
  // CORRIGIDO: Alterado de 'produtos' para 'clientes'
  const result = await pool.query(
    'SELECT * FROM clientes ORDER BY id'
  );
  
  // Os dados ficam em result.rows
  return result.rows;
}

// ============================================================
// FUNÇÃO: buscarPorId
// DESCRIÇÃO: Busca um cliente específico por ID
// PARÂMETRO: id (número)
// RETORNO: Promise com o cliente ou undefined
// ============================================================
async function buscarPorId(id) {
  // CORRIGIDO: Alterado de 'produtos' para 'clientes'
  const result = await pool.query(
    'SELECT * FROM clientes WHERE id = $1',
    [id]
  );
  
  // Retorna o primeiro resultado (ou undefined se não achar)
  return result.rows[0];
}

// ============================================================
// FUNÇÃO: criar
// DESCRIÇÃO: Insere um novo cliente no banco
// PARÂMETRO: dados (objeto)
// RETORNO: Promise com o cliente criado (incluindo o ID)
// ============================================================
async function criar(dados) {
  const { nome, cpf, email, telefone } = dados;
  
  const sql = `
    INSERT INTO clientes (nome, cpf, email, telefone)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  // Executar a query com os valores
  const result = await pool.query(
    sql,
    [nome, cpf, email, telefone]
  );
  
  // O cliente inserido com o ID gerado pelo banco
  return result.rows[0];
}

// ============================================================
// FUNÇÃO: atualizar
// DESCRIÇÃO: Atualiza todos os dados de um cliente
// PARÂMETROS: id, dados
// RETORNO: Promise com cliente atualizado ou null
// ============================================================
async function atualizar(id, dados) {
  const { nome, cpf, email, telefone } = dados;
  
  const sql = `
    UPDATE clientes
    SET nome = $1, cpf = $2, email = $3, telefone = $4
    WHERE id = $5
    RETURNING *
  `;
  
  const result = await pool.query(
    sql,
    [nome, cpf, email, telefone, id]
  );
  
  // Se não atualizou nenhuma linha, retorna null
  return result.rows[0] || null;
}

// ============================================================
// FUNÇÃO: deletar
// DESCRIÇÃO: Remove um cliente do banco
// PARÂMETRO: id (número)
// RETORNO: Promise com true/false
// ============================================================
async function deletar(id) {
  const result = await pool.query(
    'DELETE FROM clientes WHERE id = $1',
    [id]
  );
  
  // rowCount indica quantas linhas foram afetadas
  return result.rowCount > 0;
}

// ============================================================
// FUNÇÃO: buscarPorNome
// DESCRIÇÃO: Filtra clientes por nome usando busca parcial
// PARÂMETRO: nome (string)
// RETORNO: Promise com array de clientes
// ============================================================
async function buscarPorNome(nome) {
  // CORRIGIDO: Alterado de 'produtos' para 'clientes'
  const sql = 'SELECT * FROM clientes WHERE nome ILIKE $1';
  
  const result = await pool.query(
    sql,
    [`%${nome}%`] // % = wildcard (qualquer texto antes ou depois)
  );
  
  return result.rows;
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// ============================================================
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorNome
};