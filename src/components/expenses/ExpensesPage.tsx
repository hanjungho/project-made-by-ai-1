import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PieChart, BarChart3, TrendingUp, Receipt, Calendar, Filter, Search } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import ExpenseModal from './ExpenseModal';

const ExpensesPage: React.FC = () => {
  const { expenses, mode } = useAppStore();
  const { user } = useAuthStore();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [currentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredExpenses = expenses.filter(expense => {
    const isModeMatch = mode === 'personal' ? !expense.groupId : expense.groupId;
    const isCurrentMonth = isWithinInterval(new Date(expense.date), {
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.memo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return isModeMatch && isCurrentMonth && matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
  const maxAmount = Math.max(...filteredExpenses.map(e => e.amount), 0);

  const categoryData = [
    { category: 'food', label: '식비', color: '#FF6B6B' },
    { category: 'utilities', label: '공과금', color: '#4ECDC4' },
    { category: 'transport', label: '교통비', color: '#45B7D1' },
    { category: 'shopping', label: '쇼핑', color: '#96CEB4' },
    { category: 'entertainment', label: '유흥', color: '#FFEAA7' },
    { category: 'other', label: '기타', color: '#DDA0DD' },
  ];

  const chartData = categoryData.map(cat => {
    const amount = filteredExpenses
      .filter(expense => expense.category === cat.category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: cat.label,
      value: amount,
      color: cat.color,
    };
  }).filter(item => item.value > 0);

  // Monthly trend data (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(currentMonth, 5 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const isModeMatch = mode === 'personal' ? !expense.groupId : expense.groupId;
      return expenseDate >= monthStart && expenseDate <= monthEnd && isModeMatch;
    });
    return {
      month: format(monthDate, 'M월'),
      amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const categories = [
    { value: 'all', label: '전체' },
    ...categoryData.map(cat => ({ value: cat.category, label: cat.label }))
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'personal' ? '내 가계부' : '공동 가계부'}
          </h1>
          <p className="text-gray-600 mt-1">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })} 지출 현황
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="지출 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Add Expense Button */}
          <motion.button
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExpenseModal(true)}
          >
            <Plus className="w-5 h-5" />
            <span>지출 추가</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-green-500 text-sm font-medium">이번 달</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(totalAmount)}</div>
          <div className="text-sm text-gray-600">총 지출</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-blue-500 text-sm font-medium">{filteredExpenses.length}건</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(avgAmount)}</div>
          <div className="text-sm text-gray-600">평균 지출</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-red-500 text-sm font-medium">최고액</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(maxAmount)}</div>
          <div className="text-sm text-gray-600">최대 지출</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-purple-500 text-sm font-medium">예산 대비</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">73%</div>
          <div className="text-sm text-gray-600">사용률</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">카테고리별 지출</h3>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>데이터가 없습니다</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">월별 지출 추이</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₩${(value / 10000).toFixed(0)}만`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">최근 지출 내역</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredExpenses.slice(0, 10).map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedExpense(expense);
                setShowExpenseModal(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{
                    backgroundColor: categoryData.find(cat => cat.category === expense.category)?.color + '20'
                  }}>
                    <Receipt className="w-6 h-6" style={{
                      color: categoryData.find(cat => cat.category === expense.category)?.color || '#666'
                    }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{expense.title}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{categoryData.find(cat => cat.category === expense.category)?.label}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(expense.date), 'M월 d일', { locale: ko })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                  {expense.memo && (
                    <p className="text-sm text-gray-500 truncate max-w-32">{expense.memo}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredExpenses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">지출 내역이 없습니다</h3>
              <p className="text-gray-600 mb-6">새로운 지출을 추가해보세요!</p>
              <motion.button
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExpenseModal(true)}
              >
                첫 지출 추가하기
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => {
            setShowExpenseModal(false);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
};

export default ExpensesPage;