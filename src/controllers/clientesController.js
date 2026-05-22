// Importar as funções do Model
const clientesModel = require('../models/clientesModel');

// ============================================================
// FUNÇÃO: listarTodos (ASSÍNCRONA)
// ROTA: GET /clientes
// ============================================================
async function listarTodos(req, res) {
  try {
    const clientes = await clientesModel.listarTodos();
    res.status(200).json(clientes);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao listar clientes', 
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorId (ASSÍNCRONA)
// ROTA: GET /clientes/:id
// ============================================================
async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    const cliente = await clientesModel.buscarPorId(id);
    
    // CORRIGIDO: Mudado de 'produto' para 'cliente'
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: criar (ASSÍNCRONA)
// ROTA: POST /clientes
// ============================================================
async function criar(req, res) {
  try {
    const { nome, cpf, email, telefone } = req.body;
    
    // Validações dos campos de clientes
    if (!nome || !cpf || !email || !telefone) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    // CORRIGIDO: Removidas as validações antigas de preço e estoque de produtos!
    
    const novoCliente = await clientesModel.criar({ 
      nome, 
      cpf,
      email,
      telefone 
    });
    
    res.status(201).json(novoCliente);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao criar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: atualizar (ASSÍNCRONA)
// ROTA: PUT /clientes/:id
// ============================================================
async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { nome, cpf, email, telefone } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    if (!nome || !cpf || !email || !telefone) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    const clienteAtualizado = await clientesModel.atualizar(id, { 
      nome, 
      cpf,
      email,
      telefone 
    });
    
    if (clienteAtualizado) {
      res.status(200).json(clienteAtualizado);
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao atualizar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: deletar (ASSÍNCRONA)
// ROTA: DELETE /clientes/:id
// ============================================================
async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    const deletado = await clientesModel.deletar(id);
    
    if (deletado) {
      res.status(200).json({ 
        mensagem: `Cliente ${id} removido com sucesso` 
      });
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao deletar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorNome (ASSÍNCRONA)
// ROTA: GET /clientes/buscar/nome/:nome
// ============================================================
async function buscarPorNome(req, res) {
  try {
    const { nome } = req.params;
    const clientes = await clientesModel.buscarPorNome(nome);
    res.status(200).json(clientes);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar clientes por nome', // CORRIGIDO
      erro: erro.message 
    });
  }
}

// Exportar todas as funções
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorNome
};