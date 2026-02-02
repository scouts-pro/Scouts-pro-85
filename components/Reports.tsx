import React, { useState, useMemo } from 'react';
import { 
    Member, Transaction, Event, UnitName 
} from '../types';
// Fix: Added missing LayoutList import from lucide-react
import { 
    FilePieChart, LayoutDashboard, TrendingUp, BookOpen, Layers, 
    Search, Filter, Download, Printer, ChevronDown, CheckCircle2, 
    AlertTriangle, Info, Clock, DollarSign, Users, Briefcase, 
    ArrowRightLeft, FileText, FileSpreadsheet, History, Star,
    ShieldCheck, Activity, Target, PieChart as PieIcon, BarChart3,
    Zap, Rocket, Eye, Edit, Trash2, X, LayoutList
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line 
} from 'recharts';

interface ReportsProps {
    onAddNotification?: (title: string, message: string, type: 'SUCCESS' | 'WARNING' | 'INFO') => void;
    members: Member[];
    transactions: Transaction[];
    events: Event[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Reports: React.FC<ReportsProps> = ({ onAddNotification, members, transactions, events }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [reportTypeFilter, setReportTypeFilter] = useState('ALL');
    const [selectedYear, setSelectedYear] = useState('2024');

    const TABS = [
        { label: 'نظرة عامة', icon: LayoutDashboard },
        { label: 'التقارير المالية', icon: DollarSign },
        { label: 'التقارير الأدبية', icon: BookOpen },
        { label: 'تقارير الأقسام والأنشطة', icon: Layers }
    ];

    // --- Tab 1: نظرة عامة ---
    const renderOverview = () => (
        <div className="space-y-8 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="bg-gradient-to-r from-night-800 to-night-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="w-24 h-24 bg-primary-600/20 rounded-[2rem] flex items-center justify-center text-primary-500 shadow-inner">
                        <FilePieChart size={48} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">مركز التقارير الموحد</h2>
                        <p className="text-night-400 text-lg font-bold opacity-80 uppercase tracking-widest">إعداد، إدارة، وتصدير التقارير السنوية والأدبية والمالية للفوج.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'عدد التقارير السنوية', value: '02', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'التقارير المالية المنجزة', value: '04', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'التقارير الأدبية المنجزة', value: '03', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'تقارير معلقة', value: '01', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-night-800 border border-white/5 p-8 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all group">
                        <div className={`p-4 ${stat.bg} ${stat.color} w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform`}><stat.icon size={28}/></div>
                        <p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-night-800/40 border border-white/5 p-10 rounded-[3rem] shadow-xl backdrop-blur-md relative overflow-hidden min-h-[400px]">
                    <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3"><TrendingUp size={24} className="text-primary-500"/> حالة التقارير حسب التصنيف</h4>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'مالية', complete: 80, pending: 20 },
                                { name: 'أدبية', complete: 60, pending: 40 },
                                { name: 'أقسام', complete: 90, pending: 10 },
                                { name: 'أنشطة', complete: 70, pending: 30 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none' }} />
                                <Bar dataKey="complete" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} name="منجزة %" />
                                <Bar dataKey="pending" fill="#334155" radius={[6, 6, 0, 0]} barSize={40} name="معلقة %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-night-800/40 border border-white/5 p-10 rounded-[3rem] shadow-xl backdrop-blur-md">
                    <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Clock size={24} className="text-amber-500"/> آخر التقارير المحدثة</h4>
                    <div className="space-y-4">
                        {[
                            { title: 'التقرير المالي لثلاثي 3', date: 'منذ يومين', type: 'مالي' },
                            { title: 'حصيلة نشاط المولد', date: 'منذ أسبوع', type: 'نشاط' },
                            { title: 'جرد العتاد السنوي', date: 'منذ أسبوعين', type: 'قسم' },
                        ].map((rep, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div><p className="text-white font-bold text-sm">{rep.title}</p><p className="text-night-500 text-[10px]">{rep.date}</p></div>
                                <span className="bg-primary-600/10 text-primary-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase">{rep.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Tab 2: التقارير المالية ---
    const renderFinancialReports = () => (
        <div className="space-y-10 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="bg-night-800/40 p-10 rounded-[3rem] border border-white/10 shadow-xl">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-emerald-600/10 text-emerald-400 rounded-[2rem] shadow-inner"><DollarSign size={40}/></div>
                        <div>
                            <h3 className="text-3xl font-black text-white">التقرير المالي السنوي للفوج</h3>
                            <p className="text-night-400 font-bold opacity-80 mt-1">توليد الحصيلة المالية الختامية لكافة الأقسام والأنشطة.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-3"><FileSpreadsheet size={18}/> تصدير EXCEL</button>
                        <button className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-3"><Download size={18}/> تصدير PDF</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-night-800 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                    <h5 className="text-night-500 text-[10px] font-black uppercase mb-4 tracking-widest">إجمالي المداخيل</h5>
                    <div className="flex items-baseline gap-2 mb-6"><span className="text-4xl font-black text-emerald-400">145,000</span><span className="text-xs text-night-500">دج</span></div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold"><span className="text-night-400">اشتراكات</span><span className="text-white">45,000</span></div>
                        <div className="flex justify-between text-xs font-bold"><span className="text-night-400">تأمينات</span><span className="text-white">32,000</span></div>
                        <div className="flex justify-between text-xs font-bold"><span className="text-night-400">إعانات</span><span className="text-white">68,000</span></div>
                    </div>
                </div>
                <div className="bg-night-800 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                    <h5 className="text-night-500 text-[10px] font-black uppercase mb-4 tracking-widest">إجمالي المصاريف</h5>
                    <div className="flex items-baseline gap-2 mb-6"><span className="text-4xl font-black text-rose-400">92,500</span><span className="text-xs text-night-500">دج</span></div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold"><span className="text-night-400">أنشطة</span><span className="text-white">42,000</span></div>
                        <div className="flex justify-between text-xs font-bold"><span className="text-night-400">مخيمات</span><span className="text-white">35,000</span></div>
                        <div className="flex justify-between text-xs font-bold"><span className="text-night-400">عتاد</span><span className="text-white">15,500</span></div>
                    </div>
                </div>
                <div className="bg-night-800 border border-white/5 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-center text-center">
                    <PieIcon size={48} className="mx-auto text-primary-400 mb-4 opacity-20"/>
                    <p className="text-night-400 text-sm font-bold">التوازن المالي العام</p>
                    <h3 className="text-4xl font-black text-white mt-2">+52,500 <small className="text-xs">دج</small></h3>
                </div>
            </div>

            <div className="bg-night-800/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl h-[450px] flex flex-col p-10">
                <h4 className="text-xl font-black text-white mb-10 flex items-center gap-3"><BarChart3 size={24} className="text-emerald-500"/> تحليل الميزانية حسب الأقسام</h4>
                <div className="flex-1 w-full pb-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'المالية', budget: 100, actual: 85 },
                            { name: 'الأنشطة', budget: 100, actual: 120 },
                            { name: 'المشاريع', budget: 100, actual: 45 },
                            { name: 'المخيمات', budget: 100, actual: 95 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none' }} />
                            <Bar dataKey="budget" fill="#334155" radius={[6, 6, 0, 0]} barSize={50} name="الميزانية المخصصة %" />
                            <Bar dataKey="actual" fill="#10b981" radius={[6, 6, 0, 0]} barSize={50} name="الاستهلاك الفعلي %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    // --- Tab 3: التقارير الأدبية ---
    const renderLiteraryReports = () => (
        <div className="space-y-10 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="bg-night-800/40 p-10 rounded-[3rem] border border-white/10 shadow-xl">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-purple-600/10 text-purple-400 rounded-[2rem] shadow-inner"><BookOpen size={40}/></div>
                        <div>
                            <h3 className="text-3xl font-black text-white">التقرير الأدبي السنوي</h3>
                            <p className="text-night-400 font-bold opacity-80 mt-1">عرض الحصيلة التربوية والميدانية ومشاركة الأعضاء.</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-3"><Download size={18}/> استخراج التقرير الأدبي</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-night-800 border border-white/5 p-10 rounded-[3rem] shadow-xl">
                    <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Users size={24} className="text-primary-500"/> مشاركة الوحدات في الأنشطة</h4>
                    <div className="space-y-6">
                        {[
                            { name: 'وحدة الأشبال', rate: 95, icon: Rocket },
                            { name: 'وحدة الكشاف', rate: 82, icon: Target },
                            { name: 'وحدة المتقدم', rate: 75, icon: Zap },
                            { name: 'وحدة الجوالة', rate: 90, icon: Star },
                        ].map((u, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold text-night-300">
                                    <span className="flex items-center gap-2"><u.icon size={16} className="text-primary-500"/> {u.name}</span>
                                    <span>{u.rate}%</span>
                                </div>
                                <div className="w-full bg-night-950 h-2 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-primary-600 h-full shadow-lg" style={{ width: `${u.rate}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-night-800 border border-white/5 p-10 rounded-[3rem] shadow-xl">
                    <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Star size={24} className="text-yellow-500"/> إنجازات الفوج الرئيسية</h4>
                    <div className="space-y-4">
                        {[
                            { title: 'تنظيم المخيم الربيعي الولائي', status: 'ناجح جداً', points: '+500' },
                            { title: 'تحقيق المركز الأول في مسابقة الإبداع', status: 'مكتمل', points: '+300' },
                            { title: 'حملة التشجير السنوية (100 شجرة)', status: 'مكتمل', points: '+200' },
                        ].map((ach, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                                <div><p className="text-white font-bold">{ach.title}</p><p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{ach.status}</p></div>
                                <span className="text-yellow-500 font-mono font-black text-lg">{ach.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Tab 4: تقارير الأقسام والأنشطة ---
    const renderSectionReports = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo'] text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: 'قسم الأنشطة', desc: 'تقرير الأداء مقابل المخطط التربوي.', icon: Activity, color: 'text-blue-400' },
                    { title: 'قسم المشاريع', desc: 'متابعة الإنجازات والتحديات الاستثمارية.', icon: Briefcase, color: 'text-emerald-400' },
                    { title: 'قسم المالية', desc: 'تقرير تدفقات الخزينة والحسابات البنكية.', icon: Coins, color: 'text-amber-400' },
                    { title: 'قسم البرمجة', desc: 'تقييم تنفيذ البرامج الموسمية.', icon: LayoutList, color: 'text-purple-400' },
                    { title: 'قسم العتاد واللباس', desc: 'تقرير حالة المخزون والعهدة.', icon: Box, color: 'text-rose-400' },
                ].map((sec, i) => (
                    <div key={i} className="bg-night-800 border border-white/5 p-10 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-600 group-hover:w-3 transition-all"></div>
                        <div className={`p-4 bg-white/5 ${sec.color} w-fit rounded-2xl mb-6 shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all`}><sec.icon size={32}/></div>
                        <h5 className="text-2xl font-black text-white mb-3">{sec.title}</h5>
                        <p className="text-night-400 text-sm font-bold leading-relaxed mb-10">{sec.desc}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-3 bg-white/5 hover:bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">معاينة كاملة</button>
                            <button className="p-3 bg-white/5 hover:bg-emerald-600 text-white rounded-xl transition-all"><Printer size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">إدارة التقارير والتحليل</h2>
                    <p className="text-night-400 font-bold opacity-80 uppercase tracking-widest text-sm leading-none mt-2">إصدار التقارير الرسمية، التحليل المالي، والحصيلة الأدبية للموسم.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-night-800/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                        <button className="p-3 rounded-xl text-primary-400 hover:bg-white/5 transition-all"><Printer size={20}/></button>
                        <button className="p-3 rounded-xl text-emerald-400 hover:bg-white/5 transition-all"><FileSpreadsheet size={20}/></button>
                    </div>
                </div>
            </div>

            <div className="flex bg-night-800/30 p-1 rounded-[2rem] border border-white/5 mb-10 self-start shadow-inner overflow-x-auto no-scrollbar max-w-full">
                {TABS.map((tab, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveTab(idx)}
                        className={`px-10 py-4 font-black text-sm rounded-[1.8rem] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === idx ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={20}/> {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 pb-20 overflow-y-auto no-scrollbar">
                {activeTab === 0 && renderOverview()}
                {activeTab === 1 && renderFinancialReports()}
                {activeTab === 2 && renderLiteraryReports()}
                {activeTab === 3 && renderSectionReports()}
            </div>
        </div>
    );
};

// Internal Helper for Icon (Box)
const Box = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
    </svg>
);

// Internal Helper for Icon (Coins)
const Coins = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        <path d="M7 6h1v4" />
        <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
);

export default Reports;