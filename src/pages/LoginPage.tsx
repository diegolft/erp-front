import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

interface LoginPageProps {
  onLogin?: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (username: string, password: string) => {
    console.log('Login realizado com sucesso!');
    // Redireciona para dashboard
    navigate('/dashboard');
  };

  return <Login onLogin={onLogin || handleLogin} />;
};

export default LoginPage;
