import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Grid, List, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import EventModal from './EventModal';

const CalendarPage: React.FC = () => {
  const { currentDate, setCurrentDate, currentView, setCurrentView, events, mode } = useAppStore();
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date) && 
             (mode === 'personal' ? !event.groupId : event.groupId);
    });
  };

  const viewOptions = [
    { value: 'month', label: '월간', icon: Grid },
    { value: 'week', label: '주간', icon: List },
    { value: 'day', label: '일간', icon: CalendarIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {mode === 'personal' ? '내 캘린더' : '공유 캘린더'}
          </h1>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <h2 className="text-lg font-medium text-gray-700 min-w-[140px] text-center">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {viewOptions.map((option) => (
              <motion.button
                key={option.value}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === option.value
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(option.value as any)}
              >
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Add Event Button */}
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEventModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>일정 추가</span>
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Week Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="p-4 text-center font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
                className={`min-h-[120px] p-2 border-b border-r border-gray-200 cursor-pointer transition-colors ${
                  isCurrentMonth 
                    ? 'bg-white hover:bg-gray-50' 
                    : 'bg-gray-50 text-gray-400'
                } ${isToday ? 'bg-primary-50' : ''}`}
                onClick={() => handleDateClick(day)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-primary-600' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                
                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded truncate ${
                        event.category === 'personal' ? 'bg-primary-100 text-primary-800' :
                        event.category === 'group' ? 'bg-purple-100 text-purple-800' :
                        event.category === 'bill' ? 'bg-red-100 text-red-800' :
                        event.category === 'cleaning' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayEvents.length - 3}개 더
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          selectedDate={selectedDate}
          onClose={() => {
            setShowEventModal(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;