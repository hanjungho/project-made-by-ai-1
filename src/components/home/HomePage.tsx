import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, CreditCard, Users, Gamepad2, Bot, Plus, TrendingUp, Clock, Target } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { mode, currentGroup, tasks, expenses, events } = useAppStore();
  const navigate = useNavigate();

  console.log('HomePage rendered:', { user, mode, currentGroup, tasks: tasks.length, expenses: expenses.length, events: events.length });

  const personalFeatures = [
    {
      icon: Calendar,
      title: '내 캘린더',
      description: '개인 일정 관리',
      color: 'from-blue-500 to-blue-600',
      path: '/calendar',
      count: events.filter(e => !e.groupId).length,
    },
    {
      icon: CheckSquare,
      title: '할 일 목록',
      description: '개인 할 일 관리',
      color: 'from-green-500 to-green-600',
      path: '/tasks',
      count: tasks.filter(t => !t.groupId && !t.completed).length,
    },
    {
      icon: CreditCard,
      title: '가계부',
      description: '개인 지출 관리',
      color: 'from-purple-500 to-purple-600',
      path: '/expenses',
      count: expenses.filter(e => !e.groupId).length,
    },
    {
      icon: Users,
      title: '커뮤니티',
      description: '정보 공유하기',
      color: 'from-orange-500 to-orange-600',
      path: '/community',
      count: 0,
    },
  ];

  const groupFeatures = [
    {
      icon: Calendar,
      title: '공유 캘린더',
      description: '모든 그룹원 일정',
      color: 'from-blue-500 to-blue-600',
      path: '/calendar',
      count: events.filter(e => e.groupId).length,
    },
    {
      icon: CheckSquare,
      title: '공용 할일',
      description: '집안일 분담 관리',
      color: 'from-green-500 to-green-600',
      path: '/tasks',
      count: tasks.filter(t => t.groupId && !t.completed).length,
    },
    {
      icon: CreditCard,
      title: '공동 가계부',
      description: '공과금 및 정산',
      color: 'from-purple-500 to-purple-600',
      path: '/expenses',
      count: expenses.filter(e => e.groupId).length,
    },
    {
      icon: Gamepad2,
      title: '미니게임',
      description: '재밌는 게임들',
      color: 'from-pink-500 to-pink-600',
      path: '/games',
      count: 4,
    },
    {
      icon: Bot,
      title: 'AI 도우미',
      description: '똑똑한 판단 도움',
      color: 'from-indigo-500 to-indigo-600',
      path: '/ai-assistant',
      count: 0,
    },
    {
      icon: Users,
      title: '커뮤니티',
      description: '정보 공유하기',
      color: 'from-orange-500 to-orange-600',
      path: '/community',
      count: 0,
    },
  ];

  const features = mode === 'personal' ? personalFeatures : groupFeatures;

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed && (mode === 'personal' ? !t.groupId : t.groupId)).length;
  const totalTasks = tasks.filter(t => mode === 'personal' ? !t.groupId : t.groupId).length;
  const monthlyExpenses = expenses
    .filter(e => mode === 'personal' ? !e.groupId : e.groupId)
    .reduce((sum, e) => sum + e.amount, 0);
  const upcomingEvents = events
    .filter(e => mode === 'personal' ? !e.groupId : e.groupId)
    .filter(e => new Date(e.date) >= new Date()).length;

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                안녕하세요, {user?.name}님!
              </h1>
              <p className="text-blue-100 text-lg lg:text-xl">
                {mode === 'personal' 
                  ? '오늘도 알찬 하루 보내세요!'
                  : currentGroup 
                    ? `${currentGroup.name}에서 함께 생활을 관리해보세요!`
                    : '그룹을 만들거나 참여해서 함께 생활을 관리해보세요!'
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{completedTasks}</div>
              <div className="text-sm text-gray-500">/ {totalTasks}</div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-700">완료된 할일</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ₩{monthlyExpenses.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">이번 달 지출</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{upcomingEvents}</div>
          <div className="text-sm text-gray-500">다가오는 일정</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-green-500 text-sm font-medium">+12%</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">85%</div>
          <div className="text-sm text-gray-500">목표 달성률</div>
        </motion.div>
      </div>

      {/* Group Info */}
      {mode === 'group' && currentGroup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">현재 그룹</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">참여 코드:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-mono font-medium">
                {currentGroup.code}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex -space-x-3">
              {currentGroup.members.slice(0, 5).map((member, index) => (
                <div
                  key={member.id}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-4 border-white shadow-lg"
                  style={{ zIndex: 5 - index }}
                >
                  {member.name.charAt(0)}
                </div>
              ))}
              {currentGroup.members.length > 5 && (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium border-4 border-white shadow-lg">
                  +{currentGroup.members.length - 5}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentGroup.name}</h3>
              <p className="text-gray-600">{currentGroup.members.length}명의 멤버</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(feature.path)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              {feature.count > 0 && (
                <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {feature.count}
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Group Management CTA */}
      {mode === 'group' && !currentGroup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-white text-center"
        >
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">그룹에 참여하세요</h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            함께 생활할 그룹을 만들거나 참여 코드로 기존 그룹에 참여하세요.
            더 체계적이고 재밌는 공동생활이 시작됩니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/groups/create')}
            >
              <Plus className="w-5 h-5" />
              <span>그룹 만들기</span>
            </motion.button>
            <motion.button
              className="flex items-center space-x-2 px-8 py-4 bg-white bg-opacity-20 text-white rounded-2xl font-bold hover:bg-opacity-30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/groups/join')}
            >
              <Users className="w-5 h-5" />
              <span>그룹 참여하기</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;