import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { authService } from './services/mockBackend';

// Seed initial data if empty for demo purposes
const seedData = () => {
    if(!localStorage.getItem('app_users')) {
        authService.register('Demo User', 'demo@example.com', 'password');
    }
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return isRegistering ? (
    <Register onNavigateLogin={() => setIsRegistering(false)} />
  ) : (
    <Login onNavigateRegister={() => setIsRegistering(true)} />
  );
};

const App: React.FC = () => {
  // Run seeder once
  React.useEffect(() => {
    seedData();
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;