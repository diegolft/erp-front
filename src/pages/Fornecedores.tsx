import React, { useState, useEffect } from 'react';
import './Fornecedores.css';

interface Fornecedor {
  id: number;
  empresa: string;
  fornecedor: string;
  origem: string;
  comprador: string;
}

const API_BASE_URL = 'https://daphne-womanish-tate.ngrok-free.dev/api';

// Função para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

const Fornecedores: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerm, setFilteredTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fornecedorToDelete, setFornecedorToDelete] = useState<Fornecedor | null>(null);
  const [formData, setFormData] = useState({
    empresa: '',
    fornecedor: '',
    origem: 'Nacional',
    comprador: ''
  });

  // Funções da API
  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        setError('Token de autenticação não encontrado');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/fornecedores`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setFornecedores(data);
        } else if (data && typeof data === 'object' && Array.isArray(data.fornecedores)) {
          setFornecedores(data.fornecedores);
        } else {
          setError(`Formato de resposta inválido do servidor`);
        }
      } else if (response.status === 401) {
        setError('Token inválido ou expirado');
      } else {
        const errorText = await response.text();
        setError(`Erro ${response.status}: ${errorText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Erro de conexão: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const createFornecedor = async (fornecedorData: Omit<Fornecedor, 'id'>) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/fornecedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fornecedorData)
      });
      if (response.ok) {
        await fetchFornecedores();
      }
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
    }
  };

  const updateFornecedor = async (id: number, fornecedorData: Partial<Fornecedor>) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fornecedorData)
      });
      if (response.ok) {
        await fetchFornecedores();
      }
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
    }
  };

  const deleteFornecedor = async (id: number) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        await fetchFornecedores();
      }
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error);
    }
  };

  // Carrega os dados ao montar o componente
  useEffect(() => {
    fetchFornecedores();
  }, []);

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      empresa: '',
      fornecedor: '',
      origem: 'Nacional',
      comprador: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      empresa: '',
      fornecedor: '',
      origem: 'Nacional',
      comprador: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      await updateFornecedor(editingId, formData);
    } else {
      await createFornecedor(formData);
    }
    handleCloseModal();
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setIsEditing(true);
    setEditingId(fornecedor.id);
    setFormData({
      empresa: fornecedor.empresa,
      fornecedor: fornecedor.fornecedor,
      origem: fornecedor.origem,
      comprador: fornecedor.comprador
    });
    setIsModalOpen(true);
  };

  const handleDelete = (fornecedor: Fornecedor) => {
    setFornecedorToDelete(fornecedor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (fornecedorToDelete) {
      await deleteFornecedor(fornecedorToDelete.id);
      setIsDeleteModalOpen(false);
      setFornecedorToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setFornecedorToDelete(null);
  };

  // Função para normalizar texto removendo acentos
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar fornecedores baseado no termo de busca
  const filteredFornecedores = fornecedores.filter(fornecedor => {
    const searchTerm = normalizeText(filteredTerm);
    return (
      normalizeText(fornecedor.empresa).includes(searchTerm) ||
      normalizeText(fornecedor.fornecedor).includes(searchTerm) ||
      normalizeText(fornecedor.origem).includes(searchTerm) ||
      normalizeText(fornecedor.comprador).includes(searchTerm) ||
      fornecedor.id.toString().includes(filteredTerm)
    );
  });

  const handleSearch = () => {
    setFilteredTerm(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="fornecedores-container">
      {/* Header Card */}
      <div className="header-card">
        <div className="header-content">
          <div className="header-title">
            <span className="material-symbols-outlined header-icon">
              inventory_2
            </span>
            <h1>Fornecedores</h1>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar por empresa, fornecedor, origem, comprador ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="search-input"
              />
              <button className="search-button" onClick={handleSearch}>
                <span className="material-symbols-outlined">search</span>
                Buscar
              </button>
            </div>
            
            <div className="filter-actions">
              <button className="new-button" onClick={handleOpenModal}>
                <span className="material-symbols-outlined">add</span>
                Novo Fornecedor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <div className="table-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando fornecedores...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Erro: {error}</p>
              <button onClick={fetchFornecedores} className="retry-button">
                Tentar novamente
              </button>
            </div>
          ) : filteredFornecedores.length === 0 ? (
            <div className="empty-container">
              <p>Nenhum fornecedor encontrado.</p>
            </div>
          ) : (
            <table className="fornecedores-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Empresa</th>
                  <th>Fornecedor</th>
                  <th>Origem</th>
                  <th>Comprador</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredFornecedores.map((fornecedor, index) => (
                  <tr key={fornecedor.id} style={{ animationDelay: `${index * 0.1}s` }} className="table-row-animated">
                    <td className="id-cell">{fornecedor.id}</td>
                    <td className="empresa-cell">{fornecedor.empresa}</td>
                    <td className="fornecedor-cell">{fornecedor.fornecedor}</td>
                    <td className="origem-cell">
                      <span className={fornecedor.origem === 'Nacional' ? 'origem-nacional' : 'origem-importado'}>
                        {fornecedor.origem}
                      </span>
                    </td>
                    <td className="comprador-cell">{fornecedor.comprador}</td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-button edit"
                          onClick={() => handleEdit(fornecedor)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => handleDelete(fornecedor)}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fornecedor">Fornecedor</label>
                <input
                  type="text"
                  id="fornecedor"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="origem">Origem</label>
                <select
                  id="origem"
                  name="origem"
                  value={formData.origem}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Nacional">Nacional</option>
                  <option value="Importado">Importado</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="comprador">Comprador</label>
                <input
                  type="text"
                  id="comprador"
                  name="comprador"
                  value={formData.comprador}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && fornecedorToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-icon">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h2>Confirmar Exclusão</h2>
            </div>
            
            <div className="delete-modal-body">
              <p>Tem certeza que deseja excluir o fornecedor:</p>
              <div className="fornecedor-info">
                <strong>{fornecedorToDelete.empresa}</strong>
                <span>{fornecedorToDelete.fornecedor}</span>
              </div>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>
            
            <div className="delete-modal-actions">
              <button type="button" className="btn-cancel" onClick={cancelDelete}>
                Cancelar
              </button>
              <button type="button" className="btn-delete" onClick={confirmDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fornecedores;