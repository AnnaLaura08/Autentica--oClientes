// Importar o Express para criar o router
const express = require('express');
const router = express.Router();

// Importar as funções do Controller
const clientesController = require('../controllers/clientesController');

// ============================================================
// DEFINIÇÃO DAS ROTAS
// ============================================================

// GET /clientes - Listar todos os clientes
router.get('/', clientesController.listarTodos);

// GET /clientes/nome/:nome - Buscar por nome
router.get('/buscar/nome/:nome', clientesController.buscarPorNome);

// GET /clientes/:id - Buscar cliente específico por ID
router.get('/buscar/id/:id', clientesController.buscarPorId);

// POST /clientes - Criar novo cliente
router.post('/', clientesController.criar);

// PUT /clientes/:id - Atualizar cliente completo
router.put('/:id', clientesController.atualizar);

// DELETE /clientes/:id - Deletar cliente
router.delete('/:id', clientesController.deletar);

// ============================================================
// EXPORTAR O ROUTER
// ============================================================
module.exports = router;
