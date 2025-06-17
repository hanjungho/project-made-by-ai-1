import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Group, Task, Event, Expense, User } from '../types';
import toast from 'react-hot-toast';

type AppMode = 'personal' | 'group';

interface AppState {
  mode: AppMode;
  currentGroup: Group | null;
  joinedGroups: Group[];
  tasks: Task[];
  events: Event[];
  expenses: Expense[];
  currentDate: Date;
  currentView: 'year' | 'month' | 'week' | 'day';
  
  // Actions
  setMode: (mode: AppMode) => void;
  setCurrentGroup: (group: Group | null) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  createGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
  joinGroup: (groupCode: string) => void;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  
  // Calendar actions
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: 'year' | 'month' | 'week' | 'day') => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Event actions
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateGroupCode = () => Math.random().toString(36).toUpperCase().substr(2, 6);

// 임시 그룹 데이터
const sampleGroups: Group[] = [
  {
    id: 'group1',
    name: '우리 가족',
    code: 'FAM123',
    createdBy: 'user1',
    createdAt: new Date('2024-01-01'),
    members: [
      { id: 'user1', name: '김아빠', email: 'dad@family.com' },
      { id: 'user2', name: '김엄마', email: 'mom@family.com' },
      { id: 'user3', name: '김딸', email: 'daughter@family.com' },
      { id: 'google_user_123', name: '김우리', email: 'woori@gmail.com' },
    ]
  },
  {
    id: 'group2',
    name: '우리집 하우스메이트',
    code: 'HOUSE2024',
    createdBy: 'google_user_123',
    createdAt: new Date('2024-02-01'),
    members: [
      { id: 'google_user_123', name: '김우리', email: 'woori@gmail.com' },
      { id: 'user4', name: '이룸메', email: 'roommate1@example.com' },
      { id: 'user5', name: '박하우스', email: 'roommate2@example.com' },
    ]
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'personal',
      currentGroup: null,
      joinedGroups: sampleGroups,
      tasks: [],
      events: [],
      expenses: [],
      currentDate: new Date(),
      currentView: 'month',

      setMode: (mode) => {
        set({ mode });
        // 그룹 모드로 변경 시 첫 번째 그룹을 선택
        if (mode === 'group') {
          const { joinedGroups, currentGroup } = get();
          if (joinedGroups.length > 0 && !currentGroup) {
            set({ currentGroup: joinedGroups[0] });
          }
        }
      },

      setCurrentGroup: (group) => set({ currentGroup: group }),

      // Calendar actions
      setCurrentDate: (date) => set({ currentDate: date }),
      setCurrentView: (view) => set({ currentView: view }),

      updateGroup: (groupId, updates) => {
        set((state) => ({
          joinedGroups: state.joinedGroups.map(group =>
            group.id === groupId ? { ...group, ...updates } : group
          ),
          currentGroup: state.currentGroup?.id === groupId 
            ? { ...state.currentGroup, ...updates }
            : state.currentGroup
        }));
      },

      createGroup: (groupData) => {
        const newGroup: Group = {
          ...groupData,
          id: generateId(),
          code: generateGroupCode(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          joinedGroups: [...state.joinedGroups, newGroup],
          currentGroup: newGroup,
          mode: 'group'
        }));
        
        toast.success('그룹이 생성되었습니다!');
      },

      joinGroup: (groupCode) => {
        // 실제로는 서버에서 그룹 코드로 그룹을 찾아옴
        const mockGroup: Group = {
          id: generateId(),
          name: '새로운 그룹',
          code: groupCode,
          createdBy: 'other_user',
          createdAt: new Date(),
          members: [
            { id: 'other_user', name: '그룹장', email: 'leader@group.com' },
            { id: 'current_user', name: '나', email: 'me@example.com' }
          ]
        };
        
        set((state) => ({
          joinedGroups: [...state.joinedGroups, mockGroup],
          currentGroup: mockGroup,
          mode: 'group'
        }));
        
        toast.success('그룹에 참여했습니다!');
      },

      leaveGroup: (groupId) => {
        set((state) => {
          const newJoinedGroups = state.joinedGroups.filter(group => group.id !== groupId);
          return {
            joinedGroups: newJoinedGroups,
            currentGroup: state.currentGroup?.id === groupId 
              ? (newJoinedGroups.length > 0 ? newJoinedGroups[0] : null)
              : state.currentGroup,
            mode: newJoinedGroups.length === 0 ? 'personal' : state.mode
          };
        });
        
        toast.success('그룹에서 탈퇴했습니다.');
      },

      deleteGroup: (groupId) => {
        set((state) => {
          const newJoinedGroups = state.joinedGroups.filter(group => group.id !== groupId);
          return {
            joinedGroups: newJoinedGroups,
            currentGroup: state.currentGroup?.id === groupId 
              ? (newJoinedGroups.length > 0 ? newJoinedGroups[0] : null)
              : state.currentGroup,
            mode: newJoinedGroups.length === 0 ? 'personal' : state.mode
          };
        });
        
        toast.success('그룹이 삭제되었습니다.');
      },

      // Task actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },

      // Event actions
      addEvent: (eventData) => {
        const newEvent: Event = {
          ...eventData,
          id: generateId(),
        };
        
        set((state) => ({
          events: [...state.events, newEvent]
        }));
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map(event =>
            event.id === id ? { ...event, ...updates } : event
          )
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter(event => event.id !== id)
        }));
      },

      // Expense actions
      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: generateId(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          expenses: [...state.expenses, newExpense]
        }));
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map(expense =>
            expense.id === id ? { ...expense, ...updates } : expense
          )
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter(expense => expense.id !== id)
        }));
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        mode: state.mode,
        currentGroup: state.currentGroup,
        joinedGroups: state.joinedGroups,
        tasks: state.tasks,
        events: state.events,
        expenses: state.expenses,
        currentDate: state.currentDate,
        currentView: state.currentView,
      }),
      // Date 객체 직렬화/역직렬화 처리
      serialize: (state) => {
        const serialized = JSON.stringify({
          ...state,
          state: {
            ...state.state,
            currentDate: state.state.currentDate?.toISOString(),
            joinedGroups: state.state.joinedGroups?.map((group: Group) => ({
              ...group,
              createdAt: group.createdAt?.toISOString(),
            })),
            tasks: state.state.tasks?.map((task: Task) => ({
              ...task,
              createdAt: task.createdAt?.toISOString(),
              dueDate: task.dueDate?.toISOString(),
            })),
            events: state.state.events?.map((event: Event) => ({
              ...event,
              date: event.date?.toISOString(),
              endDate: event.endDate?.toISOString(),
            })),
            expenses: state.state.expenses?.map((expense: Expense) => ({
              ...expense,
              createdAt: expense.createdAt?.toISOString(),
              date: expense.date?.toISOString(),
            })),
          },
        });
        return serialized;
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            currentDate: parsed.state.currentDate ? new Date(parsed.state.currentDate) : new Date(),
            joinedGroups: parsed.state.joinedGroups?.map((group: any) => ({
              ...group,
              createdAt: group.createdAt ? new Date(group.createdAt) : new Date(),
            })) || [],
            tasks: parsed.state.tasks?.map((task: any) => ({
              ...task,
              createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            })) || [],
            events: parsed.state.events?.map((event: any) => ({
              ...event,
              date: event.date ? new Date(event.date) : new Date(),
              endDate: event.endDate ? new Date(event.endDate) : undefined,
            })) || [],
            expenses: parsed.state.expenses?.map((expense: any) => ({
              ...expense,
              createdAt: expense.createdAt ? new Date(expense.createdAt) : new Date(),
              date: expense.date ? new Date(expense.date) : new Date(),
            })) || [],
          },
        };
      },
    }
  )
);
