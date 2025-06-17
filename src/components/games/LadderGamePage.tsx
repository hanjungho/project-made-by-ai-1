import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Play, RotateCcw, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GameSetupModal from './GameSetupModal';

interface LadderLine {
  from: number;
  to: number;
  y: number;
}

const LadderGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(true);
  const [players, setPlayers] = useState<string[]>([]);
  const [penalty, setPenalty] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [result, setResult] = useState<{ player: string; penalty: string } | null>(null);
  const [ladderLines, setLadderLines] = useState<LadderLine[]>([]);
  const [animationPath, setAnimationPath] = useState<{x: number, y: number}[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const generateLadder = (numPlayers: number) => {
    const lines: LadderLine[] = [];
    const numLevels = Math.max(8, numPlayers * 2);
    
    for (let level = 1; level < numLevels; level++) {
      const y = (level / numLevels) * 100;
      
      // 각 레벨에서 랜덤하게 연결선 생성
      const connections = new Set<number>();
      const maxConnections = Math.floor((numPlayers - 1) / 2); // 최대 연결 수 제한
      const numConnections = Math.floor(Math.random() * maxConnections) + 1;
      
      let attempts = 0;
      for (let i = 0; i < numConnections && attempts < numPlayers * 2; i++) {
        let from = Math.floor(Math.random() * (numPlayers - 1));
        attempts++;
        
        // 이미 연결된 라인과 겹치지 않도록 체크
        while ((connections.has(from) || connections.has(from + 1)) && attempts < numPlayers * 2) {
          from = Math.floor(Math.random() * (numPlayers - 1));
          attempts++;
        }
        
        // 유효한 연결을 찾았다면 추가
        if (!connections.has(from) && !connections.has(from + 1)) {
          connections.add(from);
          connections.add(from + 1);
          
          lines.push({
            from,
            to: from + 1,
            y
          });
        }
      }
    }
    
    return lines;
  };

  const calculatePath = (startIndex: number, lines: LadderLine[], numPlayers: number) => {
    const path: {x: number, y: number}[] = [];
    let currentIndex = startIndex;
    const numLevels = Math.max(8, numPlayers * 2);
    const stepSize = 100 / numLevels;
    
    path.push({ x: (currentIndex / (numPlayers - 1)) * 100, y: 0 });
    
    for (let level = 1; level < numLevels; level++) {
      const y = level * stepSize;
      
      // 현재 레벨에서 연결선 확인 (더 정확한 범위로 체크)
      const connectionAtLevel = lines.find(line => 
        Math.abs(line.y - y) < stepSize * 0.6 && 
        (line.from === currentIndex || line.to === currentIndex)
      );
      
      if (connectionAtLevel) {
        // 연결선이 있으면 이동
        const newIndex = connectionAtLevel.from === currentIndex 
          ? connectionAtLevel.to 
          : connectionAtLevel.from;
        
        // 가로로 이동하는 패스 추가
        path.push({ x: (currentIndex / (numPlayers - 1)) * 100, y });
        path.push({ x: (newIndex / (numPlayers - 1)) * 100, y });
        currentIndex = newIndex;
      } else {
        // 연결선이 없으면 직진
        path.push({ x: (currentIndex / (numPlayers - 1)) * 100, y });
      }
    }
    
    // 최종 위치
    path.push({ x: (currentIndex / (numPlayers - 1)) * 100, y: 100 });
    return { path, finalIndex: currentIndex };
  };

  const handleGameSetup = (playerNames: string[], penaltyText: string) => {
    setPlayers(playerNames);
    setPenalty(penaltyText);
    setShowSetup(false);
    setLadderLines(generateLadder(playerNames.length));
  };

  const playGame = (playerIndex: number) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setSelectedPlayer(playerIndex);
    setShowAnimation(true);
    
    const { path, finalIndex } = calculatePath(playerIndex, ladderLines, players.length);
    setAnimationPath(path);
    
    // 결과 결정: 짝수 인덱스는 통과, 홀수 인덱스는 벌칙
    const isPass = finalIndex % 2 === 0;
    
    // 애니메이션 후 결과 표시
    setTimeout(() => {
      setResult({
        player: players[playerIndex],
        penalty: isPass ? "통과" : penalty
      });
      setIsPlaying(false);
      setShowAnimation(false);
    }, path.length * 200 + 1000);
  };

  const resetGame = () => {
    setSelectedPlayer(null);
    setResult(null);
    setAnimationPath([]);
    setShowAnimation(false);
    setLadderLines(generateLadder(players.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/games')}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">사다리타기</h1>
              <p className="text-gray-600">사다리를 타고 내려가서 운명을 결정하세요!</p>
            </div>
          </div>
          {!showSetup && !result && (
            <button
              onClick={resetGame}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>새 사다리</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Game Setup Modal */}
        <GameSetupModal
          isOpen={showSetup}
          onClose={() => navigate('/games')}
          onStart={handleGameSetup}
          gameTitle="사다리타기"
          minPlayers={2}
          maxPlayers={8}
        />

        {/* Game Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Trophy className="w-10 h-10 text-yellow-600" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">결과 발표!</h2>
                <p className="text-xl text-gray-600 mb-2">
                  <span className="font-bold text-blue-600">{result.player}</span>님은
                </p>
                <p className={`text-2xl font-bold mb-6 ${
                  result.penalty === "통과" ? "text-green-600" : "text-red-600"
                }`}>
                  {result.penalty === "통과" ? "통과!" : `"${result.penalty}"`}
                </p>
                <p className="text-gray-500 mb-6">
                  {result.penalty === "통과" ? "축하합니다!" : "을 담당하게 되었습니다!"}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setResult(null);
                      resetGame();
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    다시 하기
                  </button>
                  <button
                    onClick={() => navigate('/games')}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    게임 종료
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        {!showSetup && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">참여자를 선택하세요</h2>
              <p className="text-gray-600">선택한 참여자의 경로를 따라 결과가 정해집니다</p>
            </div>

            {/* Player Selection */}
            <div className="flex justify-center space-x-4 mb-8">
              {players.map((player, index) => (
                <motion.button
                  key={index}
                  onClick={() => playGame(index)}
                  disabled={isPlaying}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedPlayer === index
                      ? 'bg-blue-600 text-white'
                      : isPlaying
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {player}
                </motion.button>
              ))}
            </div>

            {/* Ladder Visualization */}
            <div className="relative w-full h-96 bg-gray-50 rounded-xl overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0"
              >
                {/* Vertical Lines */}
                {players.map((_, index) => (
                  <line
                    key={`vertical-${index}`}
                    x1={`${(index / (players.length - 1)) * 100}%`}
                    y1="5%"
                    x2={`${(index / (players.length - 1)) * 100}%`}
                    y2="95%"
                    stroke="#6b7280"
                    strokeWidth="0.3"
                  />
                ))}

                {/* Horizontal Connecting Lines */}
                {ladderLines.map((line, index) => (
                  <line
                    key={`horizontal-${index}`}
                    x1={`${(line.from / (players.length - 1)) * 100}%`}
                    y1={`${line.y}%`}
                    x2={`${(line.to / (players.length - 1)) * 100}%`}
                    y2={`${line.y}%`}
                    stroke="#3b82f6"
                    strokeWidth="0.4"
                  />
                ))}

                {/* Animation Path */}
                {showAnimation && animationPath.length > 1 && (
                  <motion.polyline
                    points={animationPath.map(point => `${point.x},${point.y}`).join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="0.8"
                    strokeDasharray="1 1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: animationPath.length * 0.2, ease: "linear" }}
                  />
                )}

                {/* Animated Ball */}
                {showAnimation && animationPath.length > 0 && (
                  <motion.circle
                    r="1"
                    fill="#ef4444"
                    initial={{ 
                      cx: animationPath[0].x, 
                      cy: animationPath[0].y 
                    }}
                    animate={{
                      cx: animationPath.map(p => p.x),
                      cy: animationPath.map(p => p.y)
                    }}
                    transition={{
                      duration: animationPath.length * 0.2,
                      ease: "linear",
                      times: animationPath.map((_, i) => i / (animationPath.length - 1))
                    }}
                  />
                )}
              </svg>

              {/* Player Names at Top */}
              <div className="absolute top-2 left-0 right-0 flex justify-between px-4">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded"
                    style={{ 
                      marginLeft: index === 0 ? '0' : '-20px',
                      marginRight: index === players.length - 1 ? '0' : '-20px'
                    }}
                  >
                    {player}
                  </div>
                ))}
              </div>

              {/* Results at Bottom */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
                {players.map((_, index) => (
                  <div
                    key={index}
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      index % 2 === 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                    style={{ 
                      marginLeft: index === 0 ? '0' : '-16px',
                      marginRight: index === players.length - 1 ? '0' : '-16px'
                    }}
                  >
                    {index % 2 === 0 ? '통과' : '벌칙'}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">게임 방법</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 위에서 참여자를 선택하세요</li>
                <li>• 빨간 공이 사다리를 따라 내려갑니다</li>
                <li>• 연결된 가로줄을 만나면 반대편으로 이동합니다</li>
                <li>• 최종 도착지의 번호에 해당하는 사람이 벌칙을 받습니다</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LadderGamePage;
