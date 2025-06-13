import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';

const RoulettePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentGroup } = useAppStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const tasks = [
    '설거지', '청소', '쓰레기 배출', '화장실 청소', 
    '빨래', '요리', '정리정돈', '장보기'
  ];

  const members = currentGroup?.members || [
    { id: '1', name: '김우리', email: 'woori@example.com', provider: 'google' as const },
    { id: '2', name: '박집사', email: 'jipsa@example.com', provider: 'kakao' as const },
    { id: '3', name: '이하우스', email: 'house@example.com', provider: 'naver' as const },
  ];

  const options = [...members.map(m => m.name), ...tasks];

  const spinRoulette = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 5; // 5-10 spins
    const finalRotation = rotation + spins * 360;
    const selectedIndex = Math.floor(Math.random() * options.length);
    const degreePerOption = 360 / options.length;
    const finalDegree = finalRotation + (selectedIndex * degreePerOption);

    setRotation(finalDegree);

    setTimeout(() => {
      setResult(options[selectedIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const resetRoulette = () => {
    setResult(null);
    setRotation(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/games')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800">3D 룰렛</h1>
        </div>
        <motion.button
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetRoulette}
          disabled={isSpinning}
        >
          <RotateCcw className="w-4 h-4" />
          <span>초기화</span>
        </motion.button>
      </div>

      {/* Roulette Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
      >
        <div className="flex flex-col items-center space-y-8">
          {/* Roulette Wheel */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500"></div>
            </div>
            
            <motion.div
              className="w-80 h-80 rounded-full relative overflow-hidden shadow-2xl"
              style={{
                background: `conic-gradient(${options.map((_, index) => {
                  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98FB98'];
                  return `${colors[index % colors.length]} ${(index * 360 / options.length)}deg ${((index + 1) * 360 / options.length)}deg`;
                }).join(', ')})`,
              }}
              animate={{
                rotate: rotation,
              }}
              transition={{
                duration: isSpinning ? 3 : 0,
                ease: isSpinning ? "easeOut" : "linear",
              }}
            >
              {/* Roulette Sections */}
              {options.map((option, index) => {
                const angle = (360 / options.length) * index;
                const textAngle = angle + (360 / options.length) / 2;
                return (
                  <div
                    key={index}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transformOrigin: 'center',
                      transform: `rotate(${textAngle}deg)`,
                    }}
                  >
                    <div
                      className="text-white font-bold text-sm transform -rotate-90"
                      style={{
                        marginTop: '-120px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {option}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/*  Spin Button */}
          <motion.button
            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              isSpinning
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
            }`}
            whileHover={!isSpinning ? { scale: 1.05 } : {}}
            whileTap={!isSpinning ? { scale: 0.95 } : {}}
            onClick={spinRoulette}
            disabled={isSpinning}
          >
            <Play className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? '돌리는 중...' : '룰렛 돌리기'}</span>
          </motion.button>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white"
            >
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">결과 발표!</h2>
              <p className="text-3xl font-bold">{result}</p>
              {members.some(m => m.name === result) && (
                <p className="text-yellow-100 mt-2">당번이 정해졌습니다!</p>
              )}
              {tasks.includes(result) && (
                <p className="text-yellow-100 mt-2">오늘의 할일이 정해졌습니다!</p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Options List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">룰렛 옵션</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98FB98'][index % 8],
                }}
              />
              <span className="text-sm font-medium text-gray-700">{option}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-blue-50 rounded-xl p-6 border border-blue-200"
      >
        <h3 className="text-lg font-semibold text-blue-800 mb-3">게임 방법</h3>
        <div className="space-y-2 text-blue-700">
          <p>• 룰렛 돌리기 버튼을 클릭하여 게임을 시작하세요</p>
          <p>• 룰렛이 3초간 회전한 후 결과가 나타납니다</p>
          <p>• 멤버 이름이 나오면 당번, 할일이 나오면 오늘의 미션입니다</p>
          <p>• 초기화 버튼으로 다시 시작할 수 있습니다</p>
        </div>
      </motion.div>
    </div>
  );
};

export default RoulettePage;