import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Home, Smartphone, Map, History, Users, Settings } from 'lucide-react';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import DashboardPage from './components/Dashboard/DashboardPage';
import SimManagementPage from './components/SIM/SimManagementPage';
import MapPage from './components/Map/MapPage';
import HistoryPage from './components/History/HistoryPage';
import UserManagementPage from './components/Users/UserManagementPage';
import SettingsPage from './components/Settings/SettingsPage';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sims', label: 'SIM Management', icon: Smartphone },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'history', label: 'Location History', icon: History },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'User Management', icon: Users }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'sims':
        return <SimManagementPage />;
      case 'map':
        return <MapPage />;
      case 'history':
        return <HistoryPage />;
      case 'users':
        return user.role === 'admin' ? <UserManagementPage /> : <DashboardPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        menuItems={menuItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;