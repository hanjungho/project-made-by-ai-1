import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, CheckSquare, CreditCard, Users, Settings, LogOut, User, ChevronDown, Gamepad2, Bot, BarChart3, ToggleLeft, ToggleRight } from 'lucide-react';
import { FaGoogle, FaComment } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { mode, setMode, currentGroup, joinedGroups, setCurrentGroup } = useAppStore();
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
    setShowUserMenu(false);
  };

  const navigationItems = [
    { icon: BarChart3, label: '대시보드', path: '/dashboard' },
    { icon: Calendar, label: '캘린더', path: '/calendar' },
    { icon: CheckSquare, label: '할일', path: '/tasks' },
    { icon: CreditCard, label: '가계부', path: '/expenses' },
    ...(mode === 'personal' ? [
      { icon: Gamepad2, label: '게임', path: '/games' },
      { icon: Bot, label: 'AI 도우미', path: '/ai-assistant' }
    ] : [
      { icon: Gamepad2, label: '게임', path: '/games' },
      { icon: Bot, label: 'AI 도우미', path: '/ai-assistant' }
    ]),
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
            <img src="/image/Logo.png" alt="우리.zip" className="w-12 h-12" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <motion.button
                key={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-[#df6d14] bg-[#df6d14]/10 shadow-sm'
                    : 'text-gray-600 hover:text-[#df6d14] hover:bg-gray-50'
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
            {/* User Menu */}
            <div className="relative">
              <motion.button
                className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#df6d14] to-[#df6d14]/80 rounded-full flex items-center justify-center">
                  {getProviderIcon(user?.provider || '')}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ml-2 ${showUserMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#df6d14] to-[#df6d14]/80 rounded-full flex items-center justify-center">
                          {getProviderIcon(user?.provider || '')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                          <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {mode === 'personal' ? (
                            <ToggleLeft className="w-5 h-5 text-[#df6d14]" />
                          ) : (
                            <ToggleRight className="w-5 h-5 text-purple-600" />
                          )}
                          <span className="text-sm font-medium text-gray-700">모드 변경</span>
                        </div>
                        <motion.button
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            mode === 'personal'
                              ? 'bg-[#df6d14] text-white'
                              : 'bg-purple-600 text-white'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleModeToggle}
                        >
                          {mode === 'personal' ? '개인 모드' : '그룹 모드'}
                        </motion.button>
                      </div>
                    </div>

                    {/* Group Selector - only show in group mode */}
                    {mode === 'group' && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-xs font-medium text-gray-500 mb-2">현재 그룹</div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {joinedGroups.map((group) => (
                            <motion.button
                              key={group.id}
                              className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors rounded-lg ${
                                currentGroup?.id === group.id ? 'bg-[#df6d14]/10 border border-[#df6d14]/20' : ''
                              }`}
                              whileHover={{ x: 2 }}
                              onClick={() => {
                                setCurrentGroup(group);
                                setShowUserMenu(false);
                              }}
                            >
                              <div className="w-6 h-6 bg-gradient-to-r from-[#df6d14] to-[#df6d14]/80 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-medium">{group.name[0]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{group.name}</div>
                                <div className="text-xs text-gray-500">{group.members.length}명</div>
                              </div>
                              {currentGroup?.id === group.id && (
                                <div className="w-2 h-2 bg-[#df6d14] rounded-full flex-shrink-0"></div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
                          <motion.button
                            className="w-full flex items-center space-x-2 px-3 py-1.5 text-left text-[#df6d14] hover:bg-[#df6d14]/5 transition-colors rounded-lg text-sm"
                            whileHover={{ x: 2 }}
                            onClick={() => {
                              navigate('/groups/create');
                              setShowUserMenu(false);
                            }}
                          >
                            <span>+ 새 그룹 만들기</span>
                          </motion.button>
                          <motion.button
                            className="w-full flex items-center space-x-2 px-3 py-1.5 text-left text-[#df6d14] hover:bg-[#df6d14]/5 transition-colors rounded-lg text-sm"
                            whileHover={{ x: 2 }}
                            onClick={() => {
                              navigate('/groups/join');
                              setShowUserMenu(false);
                            }}
                          >
                            <span>+ 그룹 참여하기</span>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
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