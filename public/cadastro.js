const apiBase = '/clientes'; 
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const refreshButton = document.getElementById('refreshButton');
const productTable = document.getElementById('productTable'); 
const message = document.getElementById('message');
const productForm = document.getElementById('productForm'); 
const clearButton = document.getElementById('clearButton');
const logoutButton = document.getElementById('logoutButton');

function getToken() {
  return localStorage.getItem('jwtToken');
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    message.textContent = '';
  }, 3000);
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

function redirectToLogin() {
  localStorage.removeItem('jwtToken');
  window.location.href = '/';
}

async function fetchJson(url, options = {}) {
  const token = getToken();
  if (!token) {
    redirectToLogin();
    return null;
  }

  const response = await fetch(url, options);
  if (response.status === 401) {
    redirectToLogin();
    return null;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.mensagem || 'Erro na requisição');
  }

  return response.json();
}

// Carregar a lista de clientes
async function loadProducts() {
  const clientes = await fetchJson(apiBase, { headers: getAuthHeaders() });
  if (clientes) {
    renderTable(clientes);
  }
}

// Renderizar a tabela na tela
function renderTable(clientes) {
  productTable.innerHTML = '';

  if (!clientes || clientes.length === 0) {
    productTable.innerHTML = '<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
    return;
  }

  clientes.forEach(cliente => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.email}</td>
      <td>${cliente.telefone}</td>
      <td>
        <button class="edit-button" data-id="${cliente.id}">Editar</button>
        <button class="delete-button" data-id="${cliente.id}">Excluir</button>
      </td>
    `;
    productTable.appendChild(tr);
  });
}

// Preencher o formulário para edição
function fillForm(cliente) {
  document.getElementById('productId').value = cliente.id || '';
  document.getElementById('nome').value = cliente.nome || '';
  document.getElementById('preco').value = cliente.cpf || '';     
  document.getElementById('estoque').value = cliente.email || '';   
  document.getElementById('categoria').value = cliente.telefone || ''; 
}

function clearForm() {
  fillForm({});
}

// Buscar cliente por nome
async function handleSearch() {
  const term = searchInput.value.trim();
  if (!term) {
    await loadProducts();
    return;
  }

  const clientes = await fetchJson(`${apiBase}/buscar/nome/${encodeURIComponent(term)}`, {
    headers: getAuthHeaders()
  });
  if (clientes) {
    renderTable(clientes);
  }
}

// Salvar ou Atualizar cliente
async function handleSave(event) {
  event.preventDefault();

  const id = document.getElementById('productId').value;
  const nome = document.getElementById('nome').value.trim();
  const cpf = document.getElementById('preco').value.trim();     
  const email = document.getElementById('estoque').value.trim();   
  const telefone = document.getElementById('categoria').value.trim(); 

  if (!nome || !cpf || !email || !telefone) {
    showMessage('Preencha todos os campos corretamente.');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiBase}/${id}` : apiBase;

  try {
    await fetchJson(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({ nome, cpf, email, telefone })
    });

    clearForm();
    await loadProducts();
    showMessage(id ? 'Cliente updated com sucesso!' : 'Cliente criado com sucesso!');
  } catch (error) {
    showMessage(error.message);
  }
}

// Capturar cliques nos botões da tabela
async function handleTableClick(event) {
  const target = event.target;
  if (target.matches('.edit-button')) {
    const clienteId = target.dataset.id;
    await loadProduct(clienteId);
  }

  if (target.matches('.delete-button')) {
    const clienteId = target.dataset.id;
    await deleteProduct(clienteId);
  }
}

async function loadProduct(id) {
  const cliente = await fetchJson(`${apiBase}/buscar/id/${id}`, {
    headers: getAuthHeaders()
  });
  if (cliente) {
    fillForm(cliente);
  }
}

async function deleteProduct(id) {
  if (!confirm('Deseja realmente excluir este cliente?')) {
    return;
  }

  try {
    await fetchJson(`${apiBase}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    await loadProducts();
    showMessage('Cliente excluído com sucesso!');
  } catch (error) {
    showMessage(error.message);
  }
}

// Event Listeners
logoutButton.addEventListener('click', redirectToLogin);
searchButton.addEventListener('click', handleSearch);
refreshButton.addEventListener('click', loadProducts);
productForm.addEventListener('submit', handleSave);
clearButton.addEventListener('click', clearForm);
productTable.addEventListener('click', handleTableClick);

// Inicializar a listagem ao abrir a página
loadProducts();