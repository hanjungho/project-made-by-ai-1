import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Repeat, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { Event } from '../../types';
import toast from 'react-hot-toast';

interface EventModalProps {
  selectedDate: Date | null;
  onClose: () => void;
  event?: Event;
}

const EventModal: React.FC<EventModalProps> = ({ selectedDate, onClose, event }) => {
  const { addEvent, updateEvent, mode, currentGroup } = useAppStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || selectedDate || new Date(),
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '10:00',
    category: event?.category || 'personal',
    repeat: event?.repeat || 'none',
  });

  const categories = [
    { value: 'personal', label: '개인', color: 'bg-blue-100 text-blue-800' },
    { value: 'group', label: '그룹', color: 'bg-purple-100 text-purple-800' },
    { value: 'bill', label: '납부', color: 'bg-red-100 text-red-800' },
    { value: 'cleaning', label: '청소', color: 'bg-green-100 text-green-800' },
    { value: 'other', label: '기타', color: 'bg-gray-100 text-gray-800' },
  ];

  const repeatOptions = [
    { value: 'none', label: '반복 없음' },
    { value: 'daily', label: '매일' },
    { value: 'weekly', label: '매주' },
    { value: 'monthly', label: '매월' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!user) return;

    const eventData: Event = {
      id: event?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      category: formData.category as any,
      color: categories.find(c => c.value === formData.category)?.color || '',
      groupId: mode === 'group' && currentGroup ? currentGroup.id : undefined,
      userId: user.id,
      repeat: formData.repeat as any,
    };

    if (event) {
      updateEvent(event.id, eventData);
      toast.success('일정이 수정되었습니다.');
    } else {
      addEvent(eventData);
      toast.success('일정이 추가되었습니다.');
    }

    onClose();
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
            {event ? '일정 수정' : '새 일정 추가'}
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
              placeholder="일정 제목을 입력하세요"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="일정 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>날짜</span>
            </label>
            <input
              type="date"
              value={format(new Date(formData.date), 'yyyy-MM-dd')}
              onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>시작 시간</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료 시간
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
                  <div className={`text-xs px-2 py-1 rounded ${category.color} mb-1`}>
                    {category.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Repeat */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Repeat className="w-4 h-4" />
              <span>반복</span>
            </label>
            <select
              value={formData.repeat}
              onChange={(e) => setFormData({ ...formData, repeat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {repeatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {event ? '수정' : '추가'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventModal;