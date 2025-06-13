import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Globe, Moon, Sun, Monitor, Save, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { mode } = useAppStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    tasks: true,
    events: true,
    expenses: false,
    community: true,
  });
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('ko');

  const tabs = [
    { id: 'profile', label: '프로필', icon: User },
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'privacy', label: '개인정보', icon: Shield },
    { id: 'appearance', label: '모양', icon: Palette },
    { id: 'general', label: '일반', icon: Settings },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">프로필 정보</h3>
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user?.name?.[0]}</span>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">{user?.name}</h4>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.provider} 계정</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              defaultValue={user?.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">알림 설정</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => {
            const labels = {
              tasks: '할일 알림',
              events: '일정 알림',
              expenses: '지출 알림',
              community: '커뮤니티 알림'
            };
            return (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900">{labels[key as keyof typeof labels]}</h4>
                  <p className="text-sm text-gray-600">
                    {key === 'tasks' && '새로운 할일이나 마감일 알림'}
                    {key === 'events' && '일정 시작 전 알림'}
                    {key === 'expenses' && '지출 한도 초과 알림'}
                    {key === 'community' && '새 게시글이나 댓글 알림'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">개인정보 보호</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">프로필 공개</h4>
                <p className="text-sm text-gray-600">다른 사용자가 내 프로필을 볼 수 있습니다</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">활동 기록</h4>
                <p className="text-sm text-gray-600">내 활동을 기록하고 분석에 사용합니다</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-900">계정 삭제</h4>
                <p className="text-sm text-red-600">계정과 모든 데이터를 영구적으로 삭제합니다</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">테마 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'light', label: '라이트', icon: Sun },
            { id: 'dark', label: '다크', icon: Moon },
            { id: 'system', label: '시스템', icon: Monitor }
          ].map((themeOption) => (
            <div
              key={themeOption.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                theme === themeOption.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme(themeOption.id)}
            >
              <div className="flex flex-col items-center space-y-2">
                <themeOption.icon className={`w-8 h-8 ${
                  theme === themeOption.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  theme === themeOption.id ? 'text-primary-900' : 'text-gray-700'
                }`}>
                  {themeOption.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">일반 설정</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">언어</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작 페이지</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="dashboard">대시보드</option>
              <option value="calendar">캘린더</option>
              <option value="tasks">할일</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'general':
        return renderGeneralSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-8 text-white"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">설정</h1>
            <p className="text-primary-100">계정 및 앱 설정을 관리하세요</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {renderContent()}
          
          {/* Save Button */}
          <div className="mt-8">
            <motion.button
              className="flex items-center space-x-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5" />
              <span>변경사항 저장</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
