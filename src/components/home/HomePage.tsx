import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckSquare, CreditCard, Users, Gamepad2, Bot, ArrowRight, Star, ChevronDown, Menu, X, BarChart3 } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Hero section refs and animations
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.8]);
  const logoScale = useTransform(heroProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  // Feature sections
  const features = [
    {
      title: "대시보드",
      subtitle: "한눈에 보는 현황",
      description: "개인과 그룹의 모든 활동을 분석하고 시각화합니다. 할일 완료율, 지출 패턴, 일정 현황을 한 곳에서 확인하세요.",
      icon: BarChart3,
      color: "from-primary-500 to-primary-600",
      image: "/image/Logo.png",
      path: "/dashboard"
    },
    {
      title: "스마트 캘린더",
      subtitle: "일정을 더 스마트하게",
      description: "개인과 그룹 일정을 하나의 캘린더에서 관리하세요. 월간, 주간, 일간 뷰로 일정을 효율적으로 계획할 수 있습니다.",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      image: "/image/Logo.png",
      path: "/calendar"
    },
    {
      title: "할일 관리",
      subtitle: "효율적인 작업 분배",
      description: "집안일을 공평하게 분배하고, 진행 상황을 실시간으로 추적하세요. 우선순위 설정과 마감일 알림으로 놓치는 일이 없습니다.",
      icon: CheckSquare,
      color: "from-green-500 to-emerald-500",
      image: "/image/Logo.png",
      path: "/tasks"
    },
    {
      title: "스마트 가계부",
      subtitle: "지출을 투명하게",
      description: "공동 지출을 자동으로 분할하고, 카테고리별 분석을 제공합니다. 월별 지출 패턴과 절약 팁도 확인할 수 있어요.",
      icon: CreditCard,
      color: "from-purple-500 to-pink-500",
      image: "/image/Logo.png",
      path: "/expenses"
    },
    {
      title: "미니게임",
      subtitle: "재미있는 당번 정하기",
      description: "룰렛, 가위바위보, 주사위 등 8가지 다양한 게임으로 당번을 공정하게 정하세요. 게임 결과는 자동으로 기록됩니다.",
      icon: Gamepad2,
      color: "from-orange-500 to-red-500",
      image: "/image/Logo.png",
      path: "/games"
    },
    {
      title: "AI 도우미",
      subtitle: "똑똑한 생활 조언",
      description: "AI가 여러분의 생활 패턴을 분석하여 맞춤형 조언을 제공합니다. 효율적인 일정 관리와 절약 팁을 받아보세요.",
      icon: Bot,
      color: "from-indigo-500 to-purple-500",
      image: "/image/Logo.png",
      path: "/ai-assistant"
    },
    {
      title: "커뮤니티",
      subtitle: "정보 공유와 소통",
      description: "생활팁, 레시피, 청소법 등을 공유하고 다른 사용자들과 소통하세요. 카테고리별로 정리된 유용한 정보들을 만나보세요.",
      icon: Users,
      color: "from-pink-500 to-rose-500",
      image: "/image/Logo.png",
      path: "/community"
    }
  ];

  // Intersection observer for section detection
  useEffect(() => {
    const sections = document.querySelectorAll('.section-observer');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-section') || '0');
            setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Section navigation
  const scrollToSection = (index: number) => {
    const section = document.querySelector(`[data-section="${index}"]`);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigationItems = [
    { icon: BarChart3, label: '대시보드', path: '/dashboard' },
    { icon: Calendar, label: '캘린더', path: '/calendar' },
    { icon: CheckSquare, label: '할일', path: '/tasks' },
    { icon: CreditCard, label: '가계부', path: '/expenses' },
    { icon: Gamepad2, label: '게임', path: '/games' },
    { icon: Bot, label: 'AI 도우미', path: '/ai-assistant' },
    { icon: Users, label: '커뮤니티', path: '/community' },
  ];

  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      {/* Fixed Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/dashboard')}
            >
              <img src="/image/Logo.png" alt="우리.zip" className="w-12 h-12" />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(index + 1)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center space-x-4">
              {/* Menu button */}
              <motion.button
                className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(true)}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 origin-left"
          style={{ scaleX }}
        />
      </motion.header>

      {/* Fullscreen Menu */}
      {showMenu && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.5 }}
          className="fixed inset-0 z-50 bg-white lg:bg-white/95 lg:backdrop-blur-xl"
        >
          <div className="flex flex-col h-full">
            {/* Menu header */}
            <div className="flex justify-end p-6">
              <motion.button
                className="p-2 text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(false)}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Menu content */}
            <div className="flex-1 flex items-center justify-center">
              <nav className="text-center space-y-8">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    className="block text-4xl lg:text-6xl font-light text-gray-600 hover:text-primary-600 transition-colors"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 20 }}
                    onClick={() => {
                      scrollToSection(index + 1);
                      setShowMenu(false);
                    }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>
        </motion.div>
      )}

      {/* Side Navigation Indicator */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-4">
        {[
          { index: 0, label: '홈' },
          { index: 1, label: '대시보드' },
          { index: 2, label: '캘린더' },
          { index: 3, label: '할일' },
          { index: 4, label: '가계부' },
          { index: 5, label: '게임' },
          { index: 6, label: 'AI' },
          { index: 7, label: '커뮤니티' },
          { index: 8, label: '시작하기' }
        ].map((section) => (
          <motion.div
            key={section.index}
            className="flex items-center justify-end group cursor-pointer"
            whileHover={{ x: -10 }}
            onClick={() => scrollToSection(section.index)}
          >
            <motion.div
              className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mr-3"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {section.label}
            </motion.div>
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all flex-shrink-0 ${
                activeSection === section.index
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="section-observer min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
        data-section="0"
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-30"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>

        <motion.div 
          className="text-center z-10 px-6 max-w-6xl mx-auto"
          style={{ scale: heroScale }}
        >
          <motion.div
            style={{ scale: logoScale }}
            className="mb-8"
          >
            <img src="/image/Logo.png" alt="우리.zip" className="w-48 h-48 mx-auto mb-8 drop-shadow-2xl" />
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            개인과 그룹 생활을 하나로 묶어주는 스마트 라이프 플랫폼
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              className="group bg-primary-500 hover:bg-primary-600 text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              시작하기
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              className="border-2 border-primary-500 text-primary-600 px-12 py-4 rounded-full text-lg font-medium hover:bg-primary-50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              더 알아보기
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16"
          >
            <ChevronDown className="w-6 h-6 mx-auto text-gray-400 animate-bounce" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <FeatureSection
          key={index}
          feature={feature}
          index={index + 1}
          isEven={index % 2 === 0}
        />
      ))}

      {/* CTA Section */}
      <section className="section-observer min-h-screen flex items-center justify-center relative bg-gray-50" data-section="8">
        <div className="text-center z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-light mb-8 text-gray-900">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              더 나은 공동생활을 위한 새로운 경험을 만나보세요
            </p>
            
            <motion.button
              className="bg-primary-500 hover:bg-primary-600 text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              무료로 시작하기
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            <img src="/image/Logo.png" alt="우리.zip" className="w-12 h-12" />
          </div>
          <p className="text-gray-500">&copy; 2024 우리.zip. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Section Component
const FeatureSection: React.FC<{
  feature: any;
  index: number;
  isEven: boolean;
}> = ({ feature, index, isEven }) => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      className="section-observer min-h-screen flex items-center justify-center py-20"
      data-section={index.toString()}
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
          isEven ? '' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Text Content */}
          <motion.div
            className={isEven ? '' : 'lg:col-start-2'}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-8`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-sm font-medium text-primary-600 mb-4 uppercase tracking-wider">
              {feature.subtitle}
            </h3>
            <h2 className="text-4xl md:text-6xl font-light mb-8 text-gray-900">
              {feature.title}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {feature.description}
            </p>

            <motion.button
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              whileHover={{ x: 10 }}
              onClick={() => navigate(feature.path)}
            >
              <span>자세히 보기</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            className={isEven ? 'lg:col-start-2' : ''}
            style={{ y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-3xl" />
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full max-w-lg mx-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HomePage;
