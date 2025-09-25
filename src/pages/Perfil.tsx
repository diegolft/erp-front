import React from 'react';
import './PageLayout.css';

const Perfil: React.FC = () => {
  return (
    <div className="page-container">
      <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="material-symbols-outlined avatar-icon">person</span>
              </div>
              <div className="profile-info">
                <h2>João Silva</h2>
                <p className="profile-role">Administrador do Sistema</p>
                <p className="profile-email">joao.silva@vxcase.com</p>
              </div>
            </div>
            
            <div className="profile-sections">
              <div className="profile-section">
                <h3>Informações Pessoais</h3>
                <div className="profile-grid">
                  <div className="profile-field">
                    <label>Nome Completo</label>
                    <input type="text" value="João Silva" readOnly />
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <input type="email" value="joao.silva@vxcase.com" readOnly />
                  </div>
                  <div className="profile-field">
                    <label>Telefone</label>
                    <input type="tel" value="(11) 99999-9999" />
                  </div>
                  <div className="profile-field">
                    <label>Cargo</label>
                    <input type="text" value="Administrador" readOnly />
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Configurações de Segurança</h3>
                <div className="profile-grid">
                  <div className="profile-field">
                    <label>Senha Atual</label>
                    <input type="password" placeholder="Digite sua senha atual" />
                  </div>
                  <div className="profile-field">
                    <label>Nova Senha</label>
                    <input type="password" placeholder="Digite sua nova senha" />
                  </div>
                  <div className="profile-field">
                    <label>Confirmar Nova Senha</label>
                    <input type="password" placeholder="Confirme sua nova senha" />
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Preferências</h3>
                <div className="profile-grid">
                  <div className="profile-field">
                    <label>Idioma</label>
                    <select>
                      <option value="pt">Português (Brasil)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div className="profile-field">
                    <label>Fuso Horário</label>
                    <select>
                      <option value="america/sao_paulo">São Paulo (GMT-3)</option>
                      <option value="america/new_york">Nova York (GMT-5)</option>
                      <option value="europe/london">Londres (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="btn-primary">Salvar Alterações</button>
              <button className="btn-secondary">Cancelar</button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Perfil;
