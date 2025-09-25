import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Pedidos from './Pedidos';
import Fornecedores from './Fornecedores';
import Funcionarios from './Funcionarios';
import Perfil from './Perfil';
import './Dashboard.css';

interface DashboardProps {
  activeScreen?: string;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeScreen = 'pedidos', onLogout }) => {
  const [currentScreen, setCurrentScreen] = useState(activeScreen);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Atualiza a tela ativa baseada na rota atual
    const path = location.pathname.substring(1); // Remove a barra inicial
    setCurrentScreen(path || 'dashboard');
  }, [location.pathname]);

  const handleNavigate = (screen: string) => {
    if (screen === 'logout') {
      if (onLogout) {
        onLogout();
      }
      navigate('/login');
    } else if (screen === 'dashboard') {
      setCurrentScreen('dashboard');
      navigate('/dashboard');
    } else {
      setCurrentScreen(screen);
      navigate(`/${screen}`);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'pedidos':
        return <Pedidos />;
      case 'fornecedores':
        return <Fornecedores />;
      case 'funcionarios':
        return <Funcionarios />;
      case 'perfil':
        return <Perfil />;
      case 'dashboard':
        return (
          <div className="page-container">
            {/* Dashboard principal */}
          </div>
        );
      default:
        return (
          <div className="page-container">
            {/* Conteúdo padrão */}
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <Sidebar onNavigate={handleNavigate} activeScreen={currentScreen} />
      <div className="dashboard-content">
        {renderCurrentScreen()}
      </div>
    </div>
  );
};

export default Dashboard;
