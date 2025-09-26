import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeScreen }) => {
  const menuItems = [
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: 'shopping_cart'
    },
    {
      id: 'fornecedores',
      label: 'Fornecedores',
      icon: 'inventory_2'
    },
    {
      id: 'funcionarios',
      label: 'Funcionários',
      icon: 'people'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button 
          className="logo-button"
          onClick={() => onNavigate('dashboard')}
        >
          <img 
            src="/logo white vxcase.png" 
            alt="VX CASE Logo" 
            className="sidebar-logo"
          />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-button ${activeScreen === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="material-symbols-outlined sidebar-icon">
              {item.icon}
            </span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-button footer-button" onClick={() => onNavigate('perfil')}>
          <span className="material-symbols-outlined sidebar-icon">
            person
          </span>
          <span className="sidebar-label">Perfil</span>
        </button>
        
        <button className="sidebar-button footer-button" onClick={() => onNavigate('logout')}>
          <span className="material-symbols-outlined sidebar-icon">
            logout
          </span>
          <span className="sidebar-label">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
