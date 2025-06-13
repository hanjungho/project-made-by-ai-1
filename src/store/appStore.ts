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
  joinedGroups: Group[]; // 가입한 그룹들
  setCurrentGroup: (group: Group | null) => void;
  addGroup: (group: Group) => void;
  joinGroup: (group: Group) => void; // 그룹 가입
  leaveGroup: (groupId: string) => void; // 그룹 탈퇴
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

const samplePosts: Post[] = [
  {
    id: '1',
    title: '겨울철 전기 요금 절약 팁 공유해요!',
    content: `안녕하세요! 이번 겨울 전기요금이 너무 많이 나와서 절약 방법을 찾아보다가 효과적인 방법들을 발견해서 공유드립니다.

1. 보일러 온도를 18-20도로 설정하기
2. 창문에 뽁뽁이 붙이기 (단열 효과 짱!)
3. 전자레인지 대신 에어프라이어 사용하기
4. 전기장판 대신 전기담요 사용하기

특히 뽁뽁이는 정말 효과가 좋더라구요. 작년 대비 20% 정도 절약했어요!`,
    category: 'tip',
    userId: 'user1',
    author: { id: 'user1', name: '김우리', email: 'woori@gmail.com', provider: 'google' },
    groupId: 'group1',
    createdAt: new Date(2024, 11, 3),
    updatedAt: new Date(2024, 11, 3),
    likes: 12,
    likedBy: ['user2', 'user3'],
    bookmarkedBy: ['user2'],
    tags: ['절약', '전기요금', '겨울팁'],
    comments: [
      {
        id: 'c1',
        content: '뽁뽁이 팁 정말 좋네요! 당장 해봐야겠어요',
        userId: 'user2',
        author: { id: 'user2', name: '박집사', email: 'jipsa@kakao.com', provider: 'kakao' },
        createdAt: new Date(2024, 11, 3, 14, 30),
        likes: 3,
        likedBy: ['user1', 'user3']
      }
    ]
  },
  {
    id: '2',
    title: '간단한 김치볶음밥 레시피',
    content: `혼자 살면서 자주 해먹는 김치볶음밥 레시피 공유할게요!

재료:
- 밥 1공기
- 김치 1/2컵
- 스팸 1/3캔
- 달걀 1개
- 참기름, 깨

만드는 법:
1. 스팸을 먼저 볶아주세요
2. 김치 넣고 볶다가 밥 넣고 볶기
3. 마지막에 달걀 넣고 스크램블
4. 참기름, 깨 뿌려서 완성!

10분이면 뚝딱 완성되는 든든한 한끼입니다 😋`,
    category: 'recipe',
    userId: 'user2',
    author: { id: 'user2', name: '박집사', email: 'jipsa@kakao.com', provider: 'kakao' },
    createdAt: new Date(2024, 11, 2),
    updatedAt: new Date(2024, 11, 2),
    likes: 8,
    likedBy: ['user1', 'user3'],
    bookmarkedBy: ['user1', 'user3'],
    tags: ['요리', '간단요리', '김치볶음밥'],
    comments: []
  },
  {
    id: '3',
    title: '화장실 청소 꿀팁! (곰팡이 제거)',
    content: `화장실 타일 사이 곰팡이 때문에 고민이셨던 분들 주목!

베이킹소다 + 구연산 + 락스 조합이 정말 효과적이에요.

1. 베이킹소다를 뿌리고 30분 대기
2. 구연산 희석한 물로 닦아내기  
3. 마지막에 락스로 마무리
4. 환기 필수!

일주일에 한 번만 해도 화장실이 완전히 깔끔해져요!`,
    category: 'cleaning',
    userId: 'user3',
    author: { id: 'user3', name: '이하우스', email: 'house@naver.com', provider: 'naver' },
    groupId: 'group1',
    createdAt: new Date(2024, 11, 1),
    updatedAt: new Date(2024, 11, 1),
    likes: 15,
    likedBy: ['user1', 'user2'],
    bookmarkedBy: ['user1', 'user2'],
    tags: ['청소', '화장실', '곰팡이제거'],
    comments: [
      {
        id: 'c2',
        content: '와 정말 효과 있나요? 저희 집 화장실도 곰팡이가...',
        userId: 'user1',
        author: { id: 'user1', name: '김우리', email: 'woori@gmail.com', provider: 'google' },
        createdAt: new Date(2024, 11, 1, 16, 15),
        likes: 1,
        likedBy: ['user3']
      },
      {
        id: 'c3',
        content: '네! 정말 깨끗해져요. 환기만 잘 시켜주세요!',
        userId: 'user3',
        author: { id: 'user3', name: '이하우스', email: 'house@naver.com', provider: 'naver' },
        createdAt: new Date(2024, 11, 1, 16, 30),
        likes: 2,
        likedBy: ['user1', 'user2']
      }
    ]
  },
  {
    id: '4',
    title: '마트 할인 정보 공유합니다',
    content: `이번 주 대형마트 할인 정보 정리했어요!

이마트:
- 삼겹살 1+1 (12/5까지)
- 생수 2L 6개들이 5,900원
- 라면 20개들이 15,000원

홈플러스:
- 닭가슴살 1kg 7,900원
- 화장지 30롤 12,000원

모두 장보기 전에 확인해보세요!`,
    category: 'shopping',
    userId: 'user1',
    author: { id: 'user1', name: '김우리', email: 'woori@gmail.com', provider: 'google' },
    createdAt: new Date(2024, 11, 4),
    updatedAt: new Date(2024, 11, 4),
    likes: 20,
    likedBy: ['user2', 'user3'],
    bookmarkedBy: ['user2', 'user3'],
    tags: ['할인정보', '마트', '장보기'],
    comments: []
  },
  {
    id: '5',
    title: '오늘 하루 어떠셨나요?',
    content: `금요일이네요! 이번 주 정말 빨리 지나간 것 같아요.

다들 한 주 고생 많으셨고, 주말 푹 쉬세요!

저는 내일 친구들이랑 한강 가려고 하는데 날씨가 좋을지 모르겠네요 ㅋㅋ

다들 주말 계획 있으시면 댓글로 공유해주세요! 🎉`,
    category: 'free',
    userId: 'user2',
    author: { id: 'user2', name: '박집사', email: 'jipsa@kakao.com', provider: 'kakao' },
    createdAt: new Date(2024, 11, 5),
    updatedAt: new Date(2024, 11, 5),
    likes: 5,
    likedBy: ['user1'],
    bookmarkedBy: [],
    tags: ['일상', '주말'],
    comments: [
      {
        id: 'c4',
        content: '저는 집에서 넷플릭스 정주행 예정이에요 ㅎㅎ',
        userId: 'user1',
        author: { id: 'user1', name: '김우리', email: 'woori@gmail.com', provider: 'google' },
        createdAt: new Date(2024, 11, 5, 10, 20),
        likes: 1,
        likedBy: ['user2']
      }
    ]
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

const sampleGroup2: Group = {
  id: 'group2',
  name: '회사 동료들',
  description: '사무실 근처 아파트 룸메이트',
  code: 'DEF456',
  members: [
    { id: 'user1', name: '김우리', email: 'woori@gmail.com', provider: 'google' },
    { id: 'user4', name: '최직장', email: 'work@company.com', provider: 'google' },
    { id: 'user5', name: '한동료', email: 'colleague@company.com', provider: 'kakao' }
  ],
  createdBy: 'user4',
  createdAt: new Date(),
  maxMembers: 3
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'group',
      setMode: (mode) => set({ mode }),
      
      currentGroup: sampleGroup,
      groups: [sampleGroup, sampleGroup2],
      joinedGroups: [sampleGroup, sampleGroup2], // 두 그룹 모두 가입된 상태
      setCurrentGroup: (group) => set({ currentGroup: group }),
      addGroup: (group) => set((state) => ({ 
        groups: [...state.groups, group],
        joinedGroups: [...state.joinedGroups, group]
      })),
      joinGroup: (group) => set((state) => ({ 
        joinedGroups: [...state.joinedGroups, group]
      })),
      leaveGroup: (groupId) => set((state) => ({ 
        joinedGroups: state.joinedGroups.filter(g => g.id !== groupId),
        currentGroup: state.currentGroup?.id === groupId ? null : state.currentGroup
      })),
      updateGroup: (id, updates) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
          joinedGroups: state.joinedGroups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
          currentGroup: state.currentGroup?.id === id ? { ...state.currentGroup, ...updates } : state.currentGroup
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
      
      posts: samplePosts,
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