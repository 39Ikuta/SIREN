import React from 'react';
import { LogOut, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ isCollapsed, onToggleCollapse, menuItems, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white h-[80px] w-full flex items-center border-b border-gray-800">
      {/* Logo/Brand Section */}
      <div className="flex items-center px-6 min-w-[220px]">
        <img src="/siren-logo.svg" alt="siren logo" className="h-8 w-8 object-cover rounded shadow border border-gray-700 mr-2" />
        <div>
          <h1 className="text-lg font-bold leading-tight">SIREN</h1>
          <p className="text-[10px] leading-tight text-gray-400">Smart Integrated Response and Emergency Network</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex items-center h-full">
        <ul className="flex space-x-2 h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center px-4 h-[80px] border-b-2 transition-colors font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Actions */}
      <div className="flex items-center space-x-4 px-6 min-w-[220px] justify-end">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-orange-400" />
          <span className="text-sm text-orange-300 font-medium">{user?.role}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;