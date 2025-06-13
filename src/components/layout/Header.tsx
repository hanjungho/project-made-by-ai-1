import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, CheckSquare, CreditCard, Users, Settings, LogOut, User, ChevronDown, Gamepad2, Bot } from 'lucide-react';
import { FaGoogle, FaComment } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { mode, setMode } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleModeToggle = () => {
    setMode(mode === 'personal' ? 'group' : 'personal');
  };

  const navigationItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: Calendar, label: '캘린더', path: '/calendar' },
    { icon: CheckSquare, label: '할일', path: '/tasks' },
    { icon: CreditCard, label: '가계부', path: '/expenses' },
    ...(mode === 'group' ? [
      { icon: Gamepad2, label: '게임', path: '/games' },
      { icon: Bot, label: 'AI 도우미', path: '/ai-assistant' }
    ] : []),
    { icon: Users, label: '커뮤니티', path: '/community' },
  ];

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return <FaGoogle className="w-4 h-4" />;
      case 'kakao': return <FaComment className="w-4 h-4 text-yellow-500" />;
      case 'naver': return <SiNaver className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                우리.zip
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <motion.button
                key={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Mode Toggle */}
            <motion.button
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                mode === 'personal'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-purple-600 text-white shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleModeToggle}
            >
              {mode === 'personal' ? '개인 모드' : '그룹 모드'}
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {getProviderIcon(user?.provider || '')}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          {getProviderIcon(user?.provider || '')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                          <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      <span>설정</span>
                    </motion.button>
                    <motion.button
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      whileHover={{ x: 4 }}
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>로그아웃</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;