
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, Coins, AlertTriangle, CheckCircle, Calendar, BrainCircuit, ArrowLeft, ArrowUpRight, Trophy, Target, UserPlus, Plus } from 'lucide-react';
import { Member, Event, Section } from '../types';

interface DashboardProps {
    members: Member[];
    events?: Event[];
    onNavigate?: (section: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ members, events = [], onNavigate }) => {
    // Mock Data
    const unitStats = [
        { name: 'براعم', count: 10 },
        { name: 'أشبال', count: members.filter(m => m.unit.includes('أشبال')).length || 12 },
        { name: 'كشاف', count: members.filter(m => m.unit.includes('الكشاف')).length || 15 },
        { name: 'متقدم', count: members.filter(m => m.unit.includes('المتقدم')).length || 8 },
        { name: 'جوالة', count: members.filter(m => m.unit.includes('الجوالة')).length || 5 },
    ];

    const financeData = [
        { name: 'مداخيل', value: 45000 },
        { name: 'مصاريف', value: 32000 },
    ];
    
    const COLORS = ['#10b981', '#f43f5e'];

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in relative">
            {/* Header Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                        مرحباً، <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">القائد العام</span> 👋
                    </h1>
                    <p className="text-night-300">إليك نظرة شاملة على أداء الفوج لهذا الموسم.</p>
                </div>
                <div className="flex items-center gap-2 bg-night-800/50 px-4 py-2 rounded-full border border-night-700 backdrop-blur-md self-start md:self-auto">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-mono text-emerald-400">النظام متصل</span>
                    <span className="text-night-500">|</span>
                    <span className="text-sm text-night-300">{new Date().toLocaleDateString('ar-DZ')}</span>
                </div>
            </div>

            {/* KPI Cards (Glassmorphism + Gradients) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Members */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-night-900 border border-blue-500/20 rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-900/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/20">
                            <Users size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-500/20">
                            +12% <ArrowUpRight size={12} />
                        </span>
                    </div>
                    <p className="text-night-400 text-sm font-medium">إجمالي الأعضاء</p>
                    <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-blue-100 transition-colors">{members.length > 0 ? members.length : 45}</h3>
                </div>

                {/* Card 2: Finance */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-night-900 border border-emerald-500/20 rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-emerald-900/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-600/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/20">
                            <Coins size={24} />
                        </div>
                        <span className="text-xs font-bold text-white bg-white/10 px-2 py-1 rounded-full">DZD</span>
                    </div>
                    <p className="text-night-400 text-sm font-medium">رصيد الخزينة</p>
                    <h3 className="text-3xl font-bold text-white mt-1 font-mono tracking-tight">13,000</h3>
                </div>

                {/* Card 3: Attendance */}
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-900/40 to-night-900 border border-violet-500/20 rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-violet-900/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-600/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-violet-500/20 rounded-xl text-violet-400 border border-violet-500/20">
                            <Trophy size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-violet-400 bg-violet-900/20 px-2 py-1 rounded-full border border-violet-500/20">
                           ممتاز
                        </span>
                    </div>
                    <p className="text-night-400 text-sm font-medium">نسبة الحضور</p>
                    <h3 className="text-3xl font-bold text-white mt-1">92%</h3>
                </div>

                {/* Card 4: Alerts */}
                <div className="relative overflow-hidden bg-gradient-to-br from-rose-900/40 to-night-900 border border-rose-500/20 rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-rose-900/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-600/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/20">
                            <AlertTriangle size={24} />
                        </div>
                         <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-900/20 px-2 py-1 rounded-full border border-rose-500/20">
                           انتبه
                        </span>
                    </div>
                    <p className="text-night-400 text-sm font-medium">عقوبات نشطة</p>
                    <h3 className="text-3xl font-bold text-white mt-1">2</h3>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Quick Actions Bar - Moved Here */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button onClick={() => onNavigate?.('MEMBERS')} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-night-800/40 border border-white/5 hover:border-blue-500/50 hover:bg-blue-600/10 transition-all group active:scale-95">
                            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-lg shadow-blue-900/20">
                                <UserPlus size={22} />
                            </div>
                            <span className="font-bold text-white text-sm md:text-base">إضافة عضو</span>
                        </button>
                        <button onClick={() => onNavigate?.('FINANCE')} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-night-800/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-600/10 transition-all group active:scale-95">
                            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-lg shadow-emerald-900/20">
                                <Coins size={22} />
                            </div>
                            <span className="font-bold text-white text-sm md:text-base">تسجيل مالية</span>
                        </button>
                        <button onClick={() => onNavigate?.('ACTIVITIES')} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-night-800/40 border border-white/5 hover:border-purple-500/50 hover:bg-purple-600/10 transition-all group active:scale-95">
                            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-lg shadow-purple-900/20">
                                <Calendar size={22} />
                            </div>
                            <span className="font-bold text-white text-sm md:text-base">نشاط جديد</span>
                        </button>
                        <button onClick={() => onNavigate?.('DISCIPLINE')} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-night-800/40 border border-white/5 hover:border-rose-500/50 hover:bg-rose-600/10 transition-all group active:scale-95">
                            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-lg shadow-rose-900/20">
                                <CheckCircle size={22} />
                            </div>
                            <span className="font-bold text-white text-sm md:text-base">تسجيل الحضور</span>
                        </button>
                    </div>

                    {/* Units Chart */}
                    <div className="bg-night-800/40 backdrop-blur-md border border-night-700/50 rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                إحصائيات الوحدات
                            </h3>
                            <button className="text-xs bg-night-700/50 hover:bg-night-700 text-white px-3 py-1 rounded-lg transition-colors">تصدير PDF</button>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={unitStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                                        cursor={{fill: '#334155', opacity: 0.1}}
                                    />
                                    <Bar dataKey="count" fill="url(#colorCount)" radius={[8, 8, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Finance Chart (Area Split) */}
                    <div className="bg-night-800/40 backdrop-blur-md border border-night-700/50 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                             <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                                التوازن المالي
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={financeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {financeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-4 min-w-[200px]">
                             <div className="p-4 rounded-xl bg-emerald-900/10 border border-emerald-500/20">
                                <p className="text-sm text-night-400 mb-1">إجمالي المداخيل</p>
                                <p className="text-2xl font-bold text-emerald-400 font-mono">45,000</p>
                             </div>
                             <div className="p-4 rounded-xl bg-rose-900/10 border border-rose-500/20">
                                <p className="text-sm text-night-400 mb-1">إجمالي المصاريف</p>
                                <p className="text-2xl font-bold text-rose-400 font-mono">32,000</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Events & Strategy */}
                <div className="space-y-8">
                    
                    {/* AI Strategy Card (Featured) */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b1055] to-[#7597de] p-1 shadow-2xl group">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="bg-night-900/90 backdrop-blur-xl h-full w-full rounded-[20px] p-6 relative z-10 flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                        <BrainCircuit className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Scouts AI</h3>
                                </div>
                                <p className="text-night-300 text-sm leading-relaxed mb-6">
                                    المستشار الذكي جاهز لتحليل بيانات الفوج. احصل على تقرير استراتيجي لتطوير الموارد البشرية والمالية.
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => onNavigate?.('STRATEGY')}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                            >
                                توليد التقرير <ArrowLeft size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Events List */}
                    <div className="bg-night-800/40 backdrop-blur-md border border-night-700/50 rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Calendar className="text-primary-500" size={20} />
                                الأنشطة القادمة
                            </h3>
                            <button onClick={() => onNavigate?.('ACTIVITIES')} className="text-xs text-primary-400 hover:text-primary-300 transition-colors">عرض الجدول</button>
                        </div>
                        
                        <div className="space-y-4 relative">
                            {/* Vertical Line */}
                            <div className="absolute top-2 bottom-2 right-[19px] w-0.5 bg-night-700/50 rounded-full"></div>

                            {events.length > 0 ? events.slice(0, 3).map((event, idx) => (
                                <div key={event.id} className="relative flex items-center gap-4 group cursor-pointer hover:bg-night-800/50 p-2 rounded-lg transition-colors">
                                    {/* Timeline Dot */}
                                    <div className={`absolute right-[14px] w-3 h-3 rounded-full border-2 border-night-900 z-10 ${idx === 0 ? 'bg-primary-500 shadow-[0_0_8px_#3b82f6]' : 'bg-night-600'}`}></div>

                                    <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-night-700 mr-6">
                                        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-sm group-hover:text-primary-400 transition-colors">{event.title}</h4>
                                        <p className="text-xs text-night-400 mt-0.5 flex items-center gap-2">
                                            <span>{event.date}</span>
                                            <span className="w-1 h-1 bg-night-600 rounded-full"></span>
                                            <span className={`${event.type === 'CAMP' ? 'text-orange-400' : 'text-blue-400'}`}>{event.type === 'CAMP' ? 'مخيم' : 'نشاط'}</span>
                                        </p>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-night-800 flex items-center justify-center text-night-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        <ArrowLeft size={14} />
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-night-400 text-sm">لا توجد أنشطة مجدولة قريباً</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
