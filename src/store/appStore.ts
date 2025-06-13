import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppMode, ViewType, Group, Event, Task, Expense, Post, GameResult } from '../types';

interface AppState {
  // Mode Management
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  
  // Group Management
  currentGroup: Group | null;
  groups: Group[];
  setCurrentGroup: (group: Group | null) => void;
  addGroup: (group: Group) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  
  // Calendar
  currentView: ViewType;
  currentDate: Date;
  events: Event[];
  setCurrentView: (view: ViewType) => void;
  setCurrentDate: (date: Date) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Community
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  
  // Games
  gameResults: GameResult[];
  addGameResult: (result: GameResult) => void;
}

// Sample data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: '월세 납부',
    description: '매월 월세 납부일',
    date: new Date(2024, 11, 5),
    startTime: '09:00',
    endTime: '10:00',
    category: 'bill',
    color: 'bg-red-100 text-red-800',
    userId: 'user1',
    repeat: 'monthly'
  },
  {
    id: '2',
    title: '대청소',
    description: '주말 대청소',
    date: new Date(2024, 11, 7),
    startTime: '10:00',
    endTime: '14:00',
    category: 'cleaning',
    color: 'bg-green-100 text-green-800',
    groupId: 'group1',
    userId: 'user1',
    repeat: 'weekly'
  },
  {
    id: '3',
    title: '개인 미팅',
    description: '프로젝트 미팅',
    date: new Date(2024, 11, 10),
    startTime: '15:00',
    endTime: '17:00',
    category: 'personal',
    color: 'bg-blue-100 text-blue-800',
    userId: 'user1',
    repeat: 'none'
  }
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: '설거지',
    description: '저녁 설거지',
    completed: false,
    dueDate: new Date(2024, 11, 5),
    priority: 'high',
    assignedTo: 'user1',
    groupId: 'group1',
    userId: 'user1',
    category: 'group',
    createdAt: new Date()
  },
  {
    id: '2',
    title: '쓰레기 배출',
    description: '재활용 쓰레기 분리배출',
    completed: true,
    dueDate: new Date(2024, 11, 3),
    priority: 'medium',
    assignedTo: 'user2',
    groupId: 'group1',
    userId: 'user2',
    category: 'group',
    createdAt: new Date()
  },
  {
    id: '3',
    title: '개인 운동',
    description: '헬스장 가기',
    completed: false,
    dueDate: new Date(2024, 11, 6),
    priority: 'low',
    userId: 'user1',
    category: 'personal',
    createdAt: new Date()
  }
];

const sampleExpenses: Expense[] = [
  {
    id: '1',
    title: '전기요금',
    amount: 85000,
    category: 'utilities',
    date: new Date(2024, 11, 1),
    memo: '11월 전기요금',
    groupId: 'group1',
    userId: 'user1',
    splitType: 'equal'
  },
  {
    id: '2',
    title: '마트 장보기',
    amount: 45000,
    category: 'food',
    date: new Date(2024, 11, 3),
    memo: '생필품 구매',
    groupId: 'group1',
    userId: 'user2',
    splitType: 'equal'
  },
  {
    id: '3',
    title: '개인 점심',
    amount: 12000,
    category: 'food',
    date: new Date(2024, 11, 4),
    memo: '회사 근처 식당',
    userId: 'user1'
  }
];

const sampleGroup: Group = {
  id: 'group1',
  name: '우리집 하우스메이트',
  description: '강남구 원룸 3명 공동생활',
  code: 'ABC123',
  members: [
    { id: 'user1', name: '김우리', email: 'woori@gmail.com', provider: 'google' },
    { id: 'user2', name: '박집사', email: 'jipsa@kakao.com', provider: 'kakao' },
    { id: 'user3', name: '이하우스', email: 'house@naver.com', provider: 'naver' }
  ],
  createdBy: 'user1',
  createdAt: new Date(),
  maxMembers: 4
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'group',
      setMode: (mode) => set({ mode }),
      
      currentGroup: sampleGroup,
      groups: [sampleGroup],
      setCurrentGroup: (group) => set({ currentGroup: group }),
      addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
      updateGroup: (id, updates) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      
      currentView: 'month',
      currentDate: new Date(),
      events: sampleEvents,
      setCurrentView: (view) => set({ currentView: view }),
      setCurrentDate: (date) => set({ currentDate: date }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
      
      tasks: sampleTasks,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      reorderTasks: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.tasks);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { tasks: result };
        }),
      
      expenses: sampleExpenses,
      addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
      
      posts: [],
      addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePost: (id) => set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
      
      gameResults: [],
      addGameResult: (result) => set((state) => ({ gameResults: [...state.gameResults, result] })),
    }),
    {
      name: 'app-storage',
    }
  )
);