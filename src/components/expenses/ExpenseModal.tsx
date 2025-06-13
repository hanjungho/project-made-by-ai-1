import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calculator, Tag, Calendar, FileText, Users, Camera } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { Expense } from '../../types';
import toast from 'react-hot-toast';

interface ExpenseModalProps {
  expense: Expense | null;
  onClose: () => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ expense, onClose }) => {
  const { addExpense, updateExpense, deleteExpense, mode, currentGroup } = useAppStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: expense?.title || '',
    amount: expense?.amount || 0,
    category: expense?.category || 'food',
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    memo: expense?.memo || '',
    receipt: expense?.receipt || '',
    splitType: expense?.splitType || 'equal',
    splitData: expense?.splitData || {},
  });

  const categories = [
    { value: 'food', label: '식비', color: '#FF6B6B' },
    { value: 'utilities', label: '공과금', color: '#4ECDC4' },
    { value: 'transport', label: '교통비', color: '#45B7D1' },
    { value: 'shopping', label: '쇼핑', color: '#96CEB4' },
    { value: 'entertainment', label: '유흥', color: '#FFEAA7' },
    { value: 'other', label: '기타', color: '#DDA0DD' },
  ];

  const splitTypes = [
    { value: 'equal', label: '균등 분할' },
    { value: 'custom', label: '커스텀 분할' },
    { value: 'specific', label: '특정 인원' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('올바른 금액을 입력해주세요.');
      return;
    }

    if (!user) return;

    const expenseData: Expense = {
      id: expense?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title,
      amount: formData.amount,
      category: formData.category as any,
      date: new Date(formData.date),
      memo: formData.memo || undefined,
      receipt: formData.receipt || undefined,
      groupId: mode === 'group' && currentGroup ? currentGroup.id : undefined,
      userId: user.id,
      splitType: formData.splitType as any,
      splitData: formData.splitData,
    };

    if (expense) {
      updateExpense(expense.id, expenseData);
      toast.success('지출이 수정되었습니다.');
    } else {
      addExpense(expenseData);
      toast.success('지출이 추가되었습니다.');
    }

    onClose();
  };

  const handleDelete = () => {
    if (expense && window.confirm('정말로 이 지출을 삭제하시겠습니까?')) {
      deleteExpense(expense.id);
      toast.success('지출이 삭제되었습니다.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {expense ? '지출 수정' : '새 지출 추가'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="지출 내용을 입력하세요"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calculator className="w-4 h-4" />
              <span>금액 *</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold"
              placeholder="0"
              min="0"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              <span>카테고리</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.value}
                  type="button"
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.category === category.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, category: category.value })}
                >
                  <div 
                    className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: category.color + '33' }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                  <span className="text-sm font-medium">{category.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>날짜</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Memo */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>메모</span>
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="추가 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* Receipt */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-4 h-4" />
              <span>영수증</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setFormData({ ...formData, receipt: e.target?.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.receipt && (
              <div className="mt-2">
                <img
                  src={formData.receipt}
                  alt="Receipt"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Split Options (Group Mode Only) */}
          {mode === 'group' && currentGroup && (
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4" />
                <span>정산 방식</span>
              </label>
              <select
                value={formData.splitType}
                onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {splitTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            {expense && (
              <motion.button
                type="button"
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
              >
                삭제
              </motion.button>
            )}
            <motion.button
              type="button"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              취소
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {expense ? '수정' : '추가'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExpenseModal;