import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

interface LoginPageProps {
  onLogin?: (username: string, password: string) => Promise<boolean>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = async (_username: string, _password: string): Promise<boolean> => {
    console.log('Login realizado com sucesso!');
    // Redireciona para dashboard
    navigate('/dashboard');
    return true;
  };

  return <Login onLogin={onLogin || handleLogin} />;
};

export default LoginPage;
