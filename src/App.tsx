import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './App.css';

const API_BASE_URL = 'https://daphne-womanish-tate.ngrok-free.dev/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica se há um token ao inicializar (sem verificação no servidor por enquanto)
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log('Tentando login com:', { usuario: username, senha: password });
      console.log('URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          usuario: username,
          senha: password
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        
        // Assumindo que o backend retorna { token: "jwt-token" }
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          setIsAuthenticated(true);
          return true;
        } else {
          console.error('Token não encontrado na resposta');
          return false;
        }
      } else {
        const errorText = await response.text();
        console.error('Erro no login:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/pedidos" 
            element={
              isAuthenticated ? 
              <Dashboard activeScreen="pedidos" onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/fornecedores" 
            element={
              isAuthenticated ? 
              <Dashboard activeScreen="fornecedores" onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/funcionarios" 
            element={
              isAuthenticated ? 
              <Dashboard activeScreen="funcionarios" onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/perfil" 
            element={
              isAuthenticated ? 
              <Dashboard activeScreen="perfil" onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard activeScreen="dashboard" onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
