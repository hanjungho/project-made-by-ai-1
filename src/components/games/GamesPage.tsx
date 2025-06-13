import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, RotateCcw, Scissors, Bot as Slot, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GamesPage: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'roulette',
      title: '3D 룰렛',
      description: '당번을 정하는 재밌는 룰렛 게임',
      icon: RotateCcw,
      color: 'bg-gradient-to-br from-red-500 to-pink-500',
      path: '/games/roulette',
    },
    {
      id: 'rps',
      title: '가위바위보 토너먼트',
      description: '모든 멤버가 참여하는 토너먼트',
      icon: Scissors,
      color: 'bg-gradient-to-br from-blue-500 to-purple-500',
      path: '/games/rps',
    },
    {
      id: 'slot',
      title: '슬롯머신',
      description: '집안일과 혜택을 뽑는 슬롯게임',
      icon: Slot,
      color: 'bg-gradient-to-br from-green-500 to-teal-500',
      path: '/games/slot',
    },
    {
      id: 'quiz',
      title: '하우스메이트 퀴즈',
      description: '집안일 관련 퀴즈 게임',
      icon: HelpCircle,
      color: 'bg-gradient-to-br from-orange-500 to-yellow-500',
      path: '/games/quiz',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
      >
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">미니게임</h1>
        <p className="text-purple-100 text-lg">
          재밌는 게임으로 당번을 정하고 함께 즐겨보세요!
        </p>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${game.color} rounded-2xl p-8 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(game.path)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <game.icon className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75">PLAY NOW</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
            <p className="text-white text-opacity-90 text-lg">{game.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
                <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="text-sm font-medium">게임 시작 →</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">게임 규칙</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                <RotateCcw className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">3D 룰렛</h4>
                <p className="text-sm text-gray-600">
                  룰렛을 돌려서 당번을 정하는 게임입니다. 3초간 회전 후 결과가 나타납니다.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Scissors className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">가위바위보 토너먼트</h4>
                <p className="text-sm text-gray-600">
                  모든 멤버가 참여하여 토너먼트 방식으로 진행되는 가위바위보 게임입니다.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <Slot className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">슬롯머신</h4>
                <p className="text-sm text-gray-600">
                  4개의 릴이 각각 다른 속도로 회전하며 집안일이나 혜택을 배정합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                <HelpCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">하우스메이트 퀴즈</h4>
                <p className="text-sm text-gray-600">
                  집안일과 생활 관련 퀴즈를 풀어보는 게임입니다. 순위에 따라 보상이 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Games */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">최근 게임 결과</h2>
        <div className="space-y-3">
          {[
            { game: '3D 룰렛', winner: '김우리', task: '설거지', time: '1시간 전' },
            { game: '가위바위보', winner: '박집사', task: '청소', time: '3시간 전' },
            { game: '슬롯머신', winner: '이하우스', task: '쓰레기 배출', time: '1일 전' },
          ].map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{result.winner.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {result.game} - {result.winner}
                  </div>
                  <div className="text-xs text-gray-600">{result.task}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{result.time}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GamesPage;