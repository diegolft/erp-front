import React, { useState, useEffect } from 'react';
import './Aliquotas.css';

interface Aliquota {
  id: number;
  ncm: string;
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
  icms: number;
  totalNcm: number;
}

const API_BASE_URL = 'https://daphne-womanish-tate.ngrok-free.dev/api';

// Função para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

const Aliquotas: React.FC = () => {
  const [aliquotas, setAliquotas] = useState<Aliquota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerm, setFilteredTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [aliquotaToDelete, setAliquotaToDelete] = useState<Aliquota | null>(null);
  const [formData, setFormData] = useState({
    ncm: '',
    ii: 0,
    ipi: 0,
    pis: 0,
    cofins: 0,
    icms: 0,
    totalNcm: 0
  });

  // Funções da API
  const fetchAliquotas = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        setError('Token de autenticação não encontrado');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/aliquotas`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAliquotas(data);
        } else if (data && typeof data === 'object' && Array.isArray(data.aliquotas)) {
          setAliquotas(data.aliquotas);
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

  const createAliquota = async (aliquotaData: Omit<Aliquota, 'id'>) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/aliquotas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aliquotaData)
      });
      if (response.ok) {
        await fetchAliquotas();
      }
    } catch (error) {
      console.error('Erro ao criar alíquota:', error);
    }
  };

  const updateAliquota = async (id: number, aliquotaData: Partial<Aliquota>) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/aliquotas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aliquotaData)
      });
      if (response.ok) {
        await fetchAliquotas();
      }
    } catch (error) {
      console.error('Erro ao atualizar alíquota:', error);
    }
  };

  const deleteAliquota = async (id: number) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/aliquotas/${id}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        await fetchAliquotas();
      }
    } catch (error) {
      console.error('Erro ao deletar alíquota:', error);
    }
  };

  // Carrega os dados ao montar o componente
  useEffect(() => {
    fetchAliquotas();
  }, []);

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      ncm: '',
      ii: 0,
      ipi: 0,
      pis: 0,
      cofins: 0,
      icms: 0,
      totalNcm: 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      ncm: '',
      ii: 0,
      ipi: 0,
      pis: 0,
      cofins: 0,
      icms: 0,
      totalNcm: 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'ncm') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Permitir apenas números, ponto e vírgula
      let numericValue = value.replace(/[^0-9.,]/g, '');
      
      // Limitar a 4 casas decimais
      const parts = numericValue.split(/[.,]/);
      if (parts.length === 2 && parts[1].length > 4) {
        numericValue = parts[0] + '.' + parts[1].substring(0, 4);
      }
      
      setFormData(prev => {
        const updated = {
          ...prev,
          [name]: numericValue
        };
        
        // Calcular total NCM automaticamente
        if (name !== 'ncm' && name !== 'totalNcm') {
          const ii = parseFloat(updated.ii.toString().replace(',', '.')) || 0;
          const ipi = parseFloat(updated.ipi.toString().replace(',', '.')) || 0;
          const pis = parseFloat(updated.pis.toString().replace(',', '.')) || 0;
          const cofins = parseFloat(updated.cofins.toString().replace(',', '.')) || 0;
          const icms = parseFloat(updated.icms.toString().replace(',', '.')) || 0;
          
          updated.totalNcm = parseFloat((ii + ipi + pis + cofins + icms).toFixed(4));
        }
        
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converter valores para float antes de enviar (máximo 4 casas decimais)
    const formattedData = {
      ...formData,
      ii: parseFloat(parseFloat(formData.ii.toString().replace(',', '.')).toFixed(4)) || 0,
      ipi: parseFloat(parseFloat(formData.ipi.toString().replace(',', '.')).toFixed(4)) || 0,
      pis: parseFloat(parseFloat(formData.pis.toString().replace(',', '.')).toFixed(4)) || 0,
      cofins: parseFloat(parseFloat(formData.cofins.toString().replace(',', '.')).toFixed(4)) || 0,
      icms: parseFloat(parseFloat(formData.icms.toString().replace(',', '.')).toFixed(4)) || 0,
      totalNcm: parseFloat(parseFloat(formData.totalNcm.toString().replace(',', '.')).toFixed(4)) || 0
    };
    
    if (isEditing && editingId) {
      await updateAliquota(editingId, formattedData);
    } else {
      await createAliquota(formattedData);
    }
    handleCloseModal();
  };

  const handleEdit = (aliquota: Aliquota) => {
    setIsEditing(true);
    setEditingId(aliquota.id);
    setFormData({
      ncm: aliquota.ncm,
      ii: aliquota.ii,
      ipi: aliquota.ipi,
      pis: aliquota.pis,
      cofins: aliquota.cofins,
      icms: aliquota.icms,
      totalNcm: aliquota.totalNcm
    });
    setIsModalOpen(true);
  };

  const handleDelete = (aliquota: Aliquota) => {
    setAliquotaToDelete(aliquota);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (aliquotaToDelete) {
      await deleteAliquota(aliquotaToDelete.id);
      setIsDeleteModalOpen(false);
      setAliquotaToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAliquotaToDelete(null);
  };

  // Função para normalizar texto removendo acentos
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar alíquotas baseado no termo de busca e calcular total NCM dinamicamente
  const filteredAliquotas = aliquotas.map(aliquota => ({
    ...aliquota,
    totalNcm: Number(aliquota.ii) + Number(aliquota.ipi) + Number(aliquota.pis) + Number(aliquota.cofins) + Number(aliquota.icms)
  })).filter(aliquota => {
    const searchTerm = normalizeText(filteredTerm);
    return normalizeText(aliquota.ncm).includes(searchTerm);
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
    <div className="aliquotas-container">
      {/* Header Card */}
      <div className="header-card">
        <div className="header-content">
          <div className="header-title">
            <span className="material-symbols-outlined header-icon">
              account_balance
            </span>
            <h1>Alíquotas</h1>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar por NCM..."
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
                Nova Alíquota
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
              <p>Carregando alíquotas...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Erro: {error}</p>
              <button onClick={fetchAliquotas} className="retry-button">
                Tentar novamente
              </button>
            </div>
          ) : filteredAliquotas.length === 0 ? (
            <div className="empty-container">
              <p>Nenhuma alíquota encontrada.</p>
            </div>
          ) : (
            <table className="aliquotas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NCM</th>
                  <th>II (%)</th>
                  <th>IPI (%)</th>
                  <th>PIS (%)</th>
                  <th>COFINS (%)</th>
                  <th>ICMS (%)</th>
                  <th>Total NCM (%)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAliquotas.map((aliquota, index) => (
                  <tr key={aliquota.id} style={{ animationDelay: `${index * 0.1}s` }} className="table-row-animated">
                    <td className="id-cell">{aliquota.id}</td>
                    <td className="ncm-cell">{aliquota.ncm}</td>
                    <td className="percentage-cell">{Number(aliquota.ii).toFixed(4)}%</td>
                    <td className="percentage-cell">{Number(aliquota.ipi).toFixed(4)}%</td>
                    <td className="percentage-cell">{Number(aliquota.pis).toFixed(4)}%</td>
                    <td className="percentage-cell">{Number(aliquota.cofins).toFixed(4)}%</td>
                    <td className="percentage-cell">{Number(aliquota.icms).toFixed(4)}%</td>
                    <td className="total-cell">{Number(aliquota.totalNcm).toFixed(4)}%</td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-button edit"
                          onClick={() => handleEdit(aliquota)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => handleDelete(aliquota)}
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
              <h2>{isEditing ? 'Editar Alíquota' : 'Nova Alíquota'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="ncm">NCM</label>
                <input
                  type="text"
                  id="ncm"
                  name="ncm"
                  value={formData.ncm}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ii">II (%)</label>
                <input
                  type="text"
                  id="ii"
                  name="ii"
                  value={formData.ii}
                  onChange={handleInputChange}
                  placeholder="0.0000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ipi">IPI (%)</label>
                <input
                  type="text"
                  id="ipi"
                  name="ipi"
                  value={formData.ipi}
                  onChange={handleInputChange}
                  placeholder="0.0000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pis">PIS (%)</label>
                <input
                  type="text"
                  id="pis"
                  name="pis"
                  value={formData.pis}
                  onChange={handleInputChange}
                  placeholder="0.0000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cofins">COFINS (%)</label>
                <input
                  type="text"
                  id="cofins"
                  name="cofins"
                  value={formData.cofins}
                  onChange={handleInputChange}
                  placeholder="0.0000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="icms">ICMS (%)</label>
                <input
                  type="text"
                  id="icms"
                  name="icms"
                  value={formData.icms}
                  onChange={handleInputChange}
                  placeholder="0.0000"
                  required
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
      {isDeleteModalOpen && aliquotaToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-icon">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h2>Confirmar Exclusão</h2>
            </div>
            
            <div className="delete-modal-body">
              <p>Tem certeza que deseja excluir a alíquota:</p>
              <div className="aliquota-info">
                <strong>NCM: {aliquotaToDelete.ncm}</strong>
                <span>Total: {(Number(aliquotaToDelete.ii) + Number(aliquotaToDelete.ipi) + Number(aliquotaToDelete.pis) + Number(aliquotaToDelete.cofins) + Number(aliquotaToDelete.icms)).toFixed(4)}%</span>
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

export default Aliquotas;
