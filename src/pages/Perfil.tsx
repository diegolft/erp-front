import React, { useState } from 'react';
import './PageLayout.css';

const Perfil: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingField, setEditingField] = useState('');
  
  // Estados para edição de informações
  const [editFormData, setEditFormData] = useState({
    name: 'João Silva',
    username: 'joao.silva',
    email: 'joao.silva@vxcase.com'
  });
  
  // Estados para alteração de senha
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Dados do usuário (simulados - serão obtidos do backend)
  const userData = {
    name: 'João Silva',
    username: 'joao.silva',
    email: 'joao.silva@vxcase.com'
  };

  const handleEditField = (field: string) => {
    setEditingField(field);
    setEditFormData({
      name: userData.name,
      username: userData.username,
      email: userData.email
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para editar campo específico será implementada quando o backend estiver pronto
    console.log(`Editar ${editingField}:`, editFormData[editingField as keyof typeof editFormData]);
    setIsEditModalOpen(false);
    setEditingField('');
  };

  const handlePasswordChange = () => {
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para alterar senha será implementada quando o backend estiver pronto
    console.log('Alterar senha:', passwordFormData);
    setIsPasswordModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'name': return 'Nome Completo';
      case 'username': return 'Usuário';
      case 'email': return 'Email';
      default: return field;
    }
  };

  const getFieldType = (field: string) => {
    switch (field) {
      case 'email': return 'email';
      default: return 'text';
    }
  };

  return (
    <div className="page-container">
      <div className="profile-container">
        {/* Header Card */}
        <div className="header-card">
          <div className="header-content">
            <div className="header-title">
              <span className="material-symbols-outlined header-icon">
                person
              </span>
              <h1>Informações do Perfil</h1>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-fields">
            {/* Nome */}
            <div className="field-row">
              <div className="field-info">
                <label>Nome Completo</label>
                <span className="field-value">{userData.name}</span>
              </div>
              <button className="edit-field-button" onClick={() => handleEditField('name')}>
                <span className="material-symbols-outlined">edit</span>
                Editar
              </button>
            </div>

            {/* Usuário */}
            <div className="field-row">
              <div className="field-info">
                <label>Usuário</label>
                <span className="field-value">@{userData.username}</span>
              </div>
              <button className="edit-field-button" onClick={() => handleEditField('username')}>
                <span className="material-symbols-outlined">edit</span>
                Editar
              </button>
            </div>

            {/* Email */}
            <div className="field-row">
              <div className="field-info">
                <label>Email</label>
                <span className="field-value">{userData.email}</span>
              </div>
              <button className="edit-field-button" onClick={() => handleEditField('email')}>
                <span className="material-symbols-outlined">edit</span>
                Editar
              </button>
            </div>

            {/* Senha */}
            <div className="field-row">
              <div className="field-info">
                <label>Senha</label>
                <span className="field-value">••••••••</span>
              </div>
              <button className="edit-field-button" onClick={handlePasswordChange}>
                <span className="material-symbols-outlined">lock</span>
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Campo */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar {getFieldLabel(editingField)}</h2>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor={editingField}>{getFieldLabel(editingField)}</label>
                <input
                  type={getFieldType(editingField)}
                  id={editingField}
                  name={editingField}
                  value={editFormData[editingField as keyof typeof editFormData]}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Alteração de Senha */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Alterar Senha</h2>
              <button className="modal-close" onClick={() => setIsPasswordModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Senha Atual</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordFormData.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Digite sua nova senha"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordFormData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirme sua nova senha"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Alterar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
