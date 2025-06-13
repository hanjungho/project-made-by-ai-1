import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Plus, PieChart, BarChart3, TrendingUp, Receipt, Calendar, Filter, Search} from 'lucide-react';
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import {useAppStore} from '../../store/appStore';
// import {useAuthStore} from '../../store/authStore'; // Commented out as it's not used
import {format, startOfMonth, endOfMonth, isWithinInterval, subMonths} from 'date-fns';
import {ko} from 'date-fns/locale';
import ExpenseModal from './ExpenseModal';

const ExpensesPage: React.FC = () => {
    const {expenses, mode} = useAppStore();
    // const {user} = useAuthStore(); // Commented out as it's not used
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
        {category: 'food', label: '식비', color: '#FF6B6B'},
        {category: 'utilities', label: '공과금', color: '#4ECDC4'},
        {category: 'transport', label: '교통비', color: '#45B7D1'},
        {category: 'shopping', label: '쇼핑', color: '#96CEB4'},
        {category: 'entertainment', label: '유흥', color: '#FFEAA7'},
        {category: 'other', label: '기타', color: '#DDA0DD'},
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
    const monthlyData = Array.from({length: 6}, (_, i) => {
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
        {value: 'all', label: '전체'},
        ...categoryData.map(cat => ({value: cat.category, label: cat.label}))
    ];

    // Analytics data
    const analytics = {
        totalAmount,
        avgAmount,
        maxAmount,
        totalCount: filteredExpenses.length,
        categoryBreakdown: categoryData.map(cat => {
            const catExpenses = filteredExpenses.filter(e => e.category === cat.category);
            const amount = catExpenses.reduce((sum, e) => sum + e.amount, 0);
            return {
                category: cat.category,
                label: cat.label,
                amount,
                count: catExpenses.length,
                percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
                color: cat.color,
            };
        }).filter(item => item.amount > 0).sort((a, b) => b.amount - a.amount),
    };

    const handleExpenseClick = (expense) => {
        setSelectedExpense(expense);
        setShowExpenseModal(true);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {mode === 'personal' ? '내 가계부' : '공동 가계부'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {format(currentMonth, 'yyyy년 M월', {locale: ko})} 지출 현황
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <input
                            type="text"
                            placeholder="지출 검색..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Add Expense Button */}
                    <motion.button
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => {
                            setSelectedExpense(null);
                            setShowExpenseModal(true);
                        }}
                    >
                        <Plus className="w-5 h-5"/>
                        <span>지출 추가</span>
                    </motion.button>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    whileHover={{y: -5, transition: {duration: 0.2}}}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">총 지출</h3>
                        <div
                            className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            <Receipt className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.totalAmount)}</p>
                    <p className="text-sm text-gray-500 mt-1">{analytics.totalCount}건의 지출</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    whileHover={{y: -5, transition: {duration: 0.2}}}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">평균 지출</h3>
                        <div
                            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <BarChart3 className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.avgAmount)}</p>
                    <p className="text-sm text-gray-500 mt-1">건당 평균 금액</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    whileHover={{y: -5, transition: {duration: 0.2}}}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">최대 지출</h3>
                        <div
                            className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <TrendingUp className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.maxAmount)}</p>
                    <p className="text-sm text-gray-500 mt-1">가장 큰 단일 지출</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    whileHover={{y: -5, transition: {duration: 0.2}}}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">주요 카테고리</h3>
                        <div
                            className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <PieChart className="w-5 h-5"/>
                        </div>
                    </div>
                    {analytics.categoryBreakdown.length > 0 ? (
                        <>
                            <p className="text-xl font-bold text-gray-900">
                                {analytics.categoryBreakdown[0].label}
                            </p>
                            <div className="flex items-center mt-1">
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500">
                                        {formatCurrency(analytics.categoryBreakdown[0].amount)}
                                    </div>
                                </div>
                                <div className="text-sm font-medium" style={{color: analytics.categoryBreakdown[0].color}}>
                                    {analytics.categoryBreakdown[0].percentage.toFixed(1)}%
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-xl font-bold text-gray-900">데이터 없음</p>
                    )}
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">카테고리별 지출</h3>
                    {chartData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(value), '금액']}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-gray-500">데이터가 없습니다</p>
                        </div>
                    )}
                    <div className="mt-4 space-y-2">
                        {analytics.categoryBreakdown.map((cat) => (
                            <div key={cat.category} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: cat.color}}></div>
                                    <span className="text-sm text-gray-700">{cat.label}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {formatCurrency(cat.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Monthly Trend */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.1}}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">월별 지출 추이</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="month" axisLine={false} tickLine={false}/>
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value / 10000}만`}
                                />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), '금액']}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="#df6d14"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Expenses List */}
            <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.2}}
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">지출 내역</h3>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                            <motion.div
                                key={expense.id}
                                className="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                                whileHover={{x: 5}}
                                onClick={() => handleExpenseClick(expense)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110`}
                                            style={{
                                                backgroundColor: categoryData.find(cat => cat.category === expense.category)?.color + '20'
                                            }}
                                        >
                                            <Receipt
                                                className="w-6 h-6"
                                                style={{
                                                    color: categoryData.find(cat => cat.category === expense.category)?.color || '#df6d14'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 group-hover:text-[#df6d14] transition-colors">{expense.title}</h4>
                                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                                                <span>{categoryData.find(cat => cat.category === expense.category)?.label}</span>
                                                <span>•</span>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3"/>
                                                    <span>{format(new Date(expense.date), 'M월 d일 HH:mm', {locale: ko})}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                                        {expense.memo && (
                                            <p className="text-sm text-gray-500 truncate max-w-32">{expense.memo}</p>
                                        )}
                                        <div className="text-xs text-[#df6d14] mt-1">
                                            전체의 {((expense.amount / analytics.totalAmount) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div
                                className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Receipt className="w-10 h-10 text-gray-400"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">지출 내역이 없습니다</h3>
                            <p className="text-gray-600 mb-6">새로운 지출을 추가해보세요!</p>
                            <motion.button
                                className="px-6 py-3 bg-[#df6d14] text-white rounded-xl font-medium hover:bg-[#df6d14]/90 transition-colors"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
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
