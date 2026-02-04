
import React, { useState, useMemo } from 'react';
import { 
    ProgramActivity, ProgramStatus 
} from '../types';
// Fix: Added missing Tag icon to the lucide-react import
import { 
    LayoutList, LayoutDashboard, Calendar, Search, Filter, Plus, 
    CheckCircle2, AlertTriangle, Clock, X, Save, TrendingUp, 
    FileText, Download, Edit, Trash2, Archive, Users, MapPin, 
    ArrowRightLeft, FileSpreadsheet, Eye, ChevronLeft, ChevronRight,
    PieChart as PieIcon, BarChart3, Info, Briefcase, Zap, Rocket, 
    History, MoreHorizontal, Target, Star, BadgeDollarSign, Printer, ChevronDown, Tag
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend, ComposedChart, Line, Area, AreaChart
} from 'recharts';

interface ProgrammingProps {
    onAddNotification?: (title: string, message: string, type: 'SUCCESS' | 'WARNING' | 'INFO') => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const ACTIVITY_TYPES = ['رحلة', 'مخيم', 'ورشة', 'نشاط داخلي', 'مسابقة', 'أخرى'];

// --- Professional Custom Dropdown Component ---
const CustomDropdown = ({ options, value, onChange, placeholder, icon: Icon, className }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selected ? (typeof selected === 'object' ? selected.label : selected) : placeholder;

    return (
        <div className={`relative ${className} font-['Cairo']`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white flex items-center justify-between cursor-pointer hover:border-primary-500 transition-all shadow-inner"
            >
                <div className="flex items-center gap-3">
                    {/* Fix: Corrected component rendering syntax for passed icon prop */}
                    {Icon && <Icon size={18} className="text-primary-400" />}
                    <span className={`font-bold ${!value ? 'text-night-500' : 'text-white'}`}>{label || placeholder}</span>
                </div>
                <ChevronDown size={16} className={`text-night-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[1000]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-night-800 border border-white/10 rounded-2xl shadow-2xl z-[1001] max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                        {options.map((opt: any, idx: number) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`p-4 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between ${val === value ? 'bg-primary-600/10 text-primary-400 font-black' : ''}`}
                                >
                                    {lbl}
                                    {val === value && <CheckCircle2 size={14} />}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

// Fixed: Moved Modal definition outside of Programming component to prevent focus loss during state updates (typing)
const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-4xl" }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="fixed inset-0 bg-night-950/90 backdrop-blur-md" onClick={onClose}></div>
            <div className={`bg-night-800 w-full ${maxWidth} rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-night-900/40">
                    <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-night-400 transition-all"><X size={20}/></button>
                    <h3 className="text-xl font-black text-white">{title}</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">{children}</div>
                {footer && <div className="p-6 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">{footer}</div>}
            </div>
        </div>
    );
};

const Programming: React.FC<ProgrammingProps> = ({ onAddNotification }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // --- State: Programs Data ---
    const [programs, setPrograms] = useState<ProgramActivity[]>([
        {
            id: 'pr_1',
            name: 'المخيم الربيعي الولائي',
            type: 'مخيم',
            startDate: '2024-03-15',
            endDate: '2024-03-20',
            responsible: 'القائد أحمد',
            expectedParticipants: 80,
            status: 'مخطط',
            progress: 30,
            description: 'مخيم تدريبي شامل لوحدات الكشاف والمتقدم.',
            team: ['القائد عمر', 'القائد خالد'],
            timeline: [{ title: 'تجهيز الموقع', time: 'يوم 1', status: 'مكتمل' }],
            plannedCost: 45000,
            actualCost: 0,
            strengths: ['موقع متميز', 'برنامج غني'],
            challenges: ['التمويل'],
            evaluationNotes: ''
        }
    ]);

    const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProgram, setNewProgram] = useState<Partial<ProgramActivity>>({
        name: '', type: 'نشاط داخلي', status: 'مخطط', progress: 0, 
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        timeline: [], strengths: [], challenges: []
    });

    const selectedProgram = useMemo(() => 
        programs.find(p => p.id === selectedProgramId) || null
    , [programs, selectedProgramId]);

    const stats = useMemo(() => {
        const total = programs.length;
        const completed = programs.filter(p => p.status === 'مكتمل').length;
        const planned = programs.filter(p => p.status === 'مخطط').length;
        const delayed = programs.filter(p => p.status === 'ملغى').length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, planned, delayed, rate };
    }, [programs]);

    const filteredPrograms = useMemo(() => {
        return programs.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.responsible.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [programs, searchQuery, statusFilter]);

    const handleSaveProgram = () => {
        if (!newProgram.name || !newProgram.responsible) return;
        const entry = { ...newProgram, id: `pr_${Date.now()}` } as ProgramActivity;
        setPrograms([entry, ...programs]);
        setShowAddModal(false);
        if (onAddNotification) onAddNotification('تمت الإضافة', 'تم تسجيل النشاط البرمجي بنجاح.', 'SUCCESS');
    };

    // --- Tab 1: نظرة عامة ---
    const renderOverview = () => (
        <div className="space-y-8 animate-fade-in font-['Cairo']" dir="rtl">
            <div className="bg-gradient-to-r from-night-800 to-night-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="w-24 h-24 bg-primary-600/20 rounded-[2rem] flex items-center justify-center text-primary-500 shadow-inner">
                        <Rocket size={48} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">مركز البرمجة الموسمية</h2>
                        <p className="text-night-400 text-lg font-bold opacity-80 uppercase tracking-widest">تخطيط، متابعة وتقييم الأنشطة والبرامج الكشفية الذكي.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'الأنشطة المقترحة', value: stats.total, icon: LayoutList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'الأنشطة المنجزة', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'نسبة التنفيذ الناجح', value: `${stats.rate}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'متأخرة أو ملغاة', value: stats.delayed, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-night-800 border border-white/5 p-8 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all group">
                        <div className={`p-4 ${stat.bg} ${stat.color} w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform`}><stat.icon size={28}/></div>
                        <p className="text-night-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-night-800/40 border border-white/5 p-10 rounded-[3rem] h-[400px] flex flex-col shadow-xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-600/5 rounded-full blur-[100px]"></div>
                    <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3"><BarChart3 size={24} className="text-primary-500"/> مقارنة الأنشطة المخططة والمنجزة</h4>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: 'الموسم الكشفي', planned: stats.total, completed: stats.completed }]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #1e293b' }} />
                                <Bar dataKey="planned" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={50} name="المخطط" />
                                <Bar dataKey="completed" fill="#10b981" radius={[10, 10, 0, 0]} barSize={50} name="المنجز" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-night-800/40 border border-white/5 p-10 rounded-[3rem] shadow-xl overflow-hidden backdrop-blur-md">
                    <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Clock size={24} className="text-amber-500"/> البرامج القادمة حسب الجدول</h4>
                    <div className="space-y-4">
                        {programs.filter(p => p.status === 'مخطط').slice(0, 3).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400 font-bold"><Zap size={20}/></div>
                                    <div><p className="text-white font-bold">{p.name}</p><p className="text-night-500 text-xs">{p.type} • {p.startDate}</p></div>
                                </div>
                                <button onClick={() => { setSelectedProgramId(p.id); setActiveTab(2); }} className="p-2.5 bg-night-900 rounded-xl text-night-400 hover:text-white"><Eye size={18}/></button>
                            </div>
                        ))}
                        {programs.filter(p => p.status === 'مخطط').length === 0 && (
                            <div className="text-center py-20 opacity-20"><Info size={48} className="mx-auto mb-4" /><p className="font-bold">لا توجد برامج مخططة قريباً</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Tab 2: قائمة البرامج والأنشطة ---
    const renderProgramList = () => (
        <div className="space-y-6 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 bg-night-800 p-2 rounded-2xl border border-white/5">
                    <div className="relative">
                        <input type="text" placeholder="بحث في الأنشطة..." className="bg-night-900 border border-white/5 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white outline-none w-64 focus:border-primary-500 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <Search className="absolute right-3 top-3 text-night-400" size={18} />
                    </div>
                    <CustomDropdown 
                        options={[{value:'ALL', label:'كل الحالات'}, {value:'مخطط', label:'مخطط'}, {value:'جاري', label:'جاري'}, {value:'مكتمل', label:'مكتمل'}, {value:'ملغى', label:'ملغى'}]}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="تصفية الحالات..."
                        className="w-48"
                    />
                </div>
                <button onClick={() => setShowAddModal(true)} className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95"><Plus size={20}/> إضافة نشاط جديد</button>
            </div>

            <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-right">
                    <thead className="bg-night-950/80 text-night-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="p-8">اسم النشاط</th>
                            <th className="p-8">النوع</th>
                            <th className="p-8">الفترة</th>
                            <th className="p-8">المسؤول</th>
                            <th className="p-8 text-center">المشاركون</th>
                            <th className="p-8">الحالة</th>
                            <th className="p-8 text-center">التقدم</th>
                            <th className="p-8 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-bold">
                        {filteredPrograms.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6 font-black text-white">{p.name}</td>
                                <td className="p-6"><span className="bg-white/5 px-3 py-1 rounded-lg text-primary-400 border border-white/5 text-[10px]">{p.type}</span></td>
                                <td className="p-6 text-night-400 font-mono text-xs">{p.startDate} <ChevronLeft size={10} className="inline mx-1"/> {p.endDate}</td>
                                <td className="p-6 text-white">{p.responsible}</td>
                                <td className="p-6 text-center text-night-300">{p.expectedParticipants}</td>
                                <td className="p-6">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase ${
                                        p.status === 'مخطط' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' :
                                        p.status === 'جاري' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' :
                                        p.status === 'مكتمل' ? 'bg-purple-600/10 text-purple-400 border-purple-500/20' :
                                        'bg-rose-600/10 text-rose-400 border-rose-500/20'
                                    }`}>{p.status}</span>
                                </td>
                                <td className="p-6">
                                    <div className="w-24 bg-night-950 h-1.5 rounded-full overflow-hidden mx-auto shadow-inner">
                                        <div className="bg-primary-500 h-full" style={{ width: `${p.progress}%` }}></div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => { setSelectedProgramId(p.id); setActiveTab(2); }} className="p-2.5 bg-white/5 hover:bg-primary-600 rounded-xl text-white transition-all"><Eye size={16}/></button>
                                        <button className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-xl text-white transition-all"><Edit size={16}/></button>
                                        <button className="p-2.5 bg-white/5 hover:bg-amber-600 rounded-xl text-white transition-all"><Archive size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- Tab 3: تفاصيل النشاط/البرنامج ---
    const renderProgramDetails = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-20" dir="rtl">
            {selectedProgram ? (
                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 lg:col-span-8 space-y-10">
                        <div className="bg-night-800 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-4xl font-black text-white mb-2">{selectedProgram.name}</h2>
                                    <div className="flex gap-4 items-center">
                                        <span className="bg-primary-600/20 text-primary-400 px-4 py-1.5 rounded-xl text-xs font-black uppercase border border-primary-500/20">{selectedProgram.type}</span>
                                        <span className="text-night-500 font-mono text-sm tracking-widest uppercase">ID: {selectedProgram.id}</span>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-night-500 text-[10px] font-black uppercase mb-1 tracking-widest">نسبة الإنجاز الفعلي</p>
                                    <div className="flex items-center gap-5">
                                        <span className="text-4xl font-black text-white">{selectedProgram.progress}%</span>
                                        <div className="w-48 bg-night-950 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                            <div className="bg-emerald-500 h-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${selectedProgram.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-white/5">
                                <div className="space-y-4">
                                    <h5 className="text-primary-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Info size={14}/> وصف البرنامج</h5>
                                    <p className="text-night-300 text-sm leading-relaxed font-bold">{selectedProgram.description}</p>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="text-primary-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Users size={14}/> الفريق المشرف</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProgram.team.map((t, i) => (
                                            <span key={i} className="bg-white/5 px-4 py-2 rounded-xl text-xs text-white border border-white/5">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="text-primary-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> المواعيد</h5>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3"><Clock size={16} className="text-night-500"/><span className="text-xs text-night-300 font-bold">بداية: {selectedProgram.startDate}</span></div>
                                        <div className="flex items-center gap-3"><Clock size={16} className="text-night-500"/><span className="text-xs text-night-300 font-bold">نهاية: {selectedProgram.endDate}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-night-800/40 border border-white/5 rounded-[3rem] p-10 shadow-xl">
                            <h4 className="text-2xl font-black text-white mb-8 flex items-center gap-4"><Target size={24} className="text-primary-500"/> الجدول الزمني التفصيلي</h4>
                            <div className="space-y-6">
                                {selectedProgram.timeline.map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        <div className="w-16 h-16 bg-night-950 rounded-2xl flex items-center justify-center border border-white/5 text-night-500 group-hover:border-primary-500 transition-all font-mono font-black">{item.time}</div>
                                        <div className="flex-1 bg-white/5 p-6 rounded-[1.8rem] border border-white/5 flex justify-between items-center group-hover:bg-white/10 transition-all">
                                            <span className="text-white font-bold">{item.title}</span>
                                            <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-xl text-[10px] font-black border border-emerald-500/20 uppercase tracking-widest">{item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-10">
                        <div className="bg-gradient-to-br from-indigo-900/20 to-night-950 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                            <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3"><PieIcon size={20} className="text-primary-400"/> مؤشرات النشاط المخططة</h4>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest"><span className="text-night-500">ميزانية تقديرية</span><span className="text-emerald-400">{selectedProgram.plannedCost.toLocaleString()} دج</span></div>
                                    <div className="w-full bg-night-900 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full" style={{width: '100%'}}></div></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest"><span className="text-night-500">حضور متوقع</span><span className="text-blue-400">{selectedProgram.expectedParticipants} عضو</span></div>
                                    <div className="w-full bg-night-900 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full" style={{width: '100%'}}></div></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-night-800/60 border border-white/5 p-10 rounded-[3rem] shadow-xl">
                            <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3"><Zap size={20} className="text-amber-500"/> تحليل نقاط القوة والتحديات</h4>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">نقاط القوة</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProgram.strengths.map((s, i) => <span key={i} className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">{s}</span>)}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">تحديات مرصودة</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProgram.challenges.map((c, i) => <span key={i} className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg text-xs font-bold border border-rose-500/20">{c}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center gap-6">
                    <LayoutDashboard size={64} className="text-night-700 opacity-20" />
                    <p className="text-night-500 text-xl font-black italic opacity-40">يرجى اختيار نشاط من القائمة لعرض تفاصيله</p>
                    <button onClick={() => setActiveTab(1)} className="text-primary-400 font-black text-sm uppercase tracking-[0.2em] border-b border-primary-500/20 pb-1">العودة للقائمة <ChevronLeft className="inline" size={14}/></button>
                </div>
            )}
        </div>
    );

    // --- Tab 4: تقييم ومقارنة ---
    const renderEvaluation = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-20" dir="rtl">
            <div className="bg-night-800/40 border border-white/5 p-10 rounded-[3rem] shadow-xl backdrop-blur-md">
                <h4 className="text-2xl font-black text-white mb-10 flex items-center gap-4"><ArrowRightLeft size={24} className="text-primary-500"/> مقارنة النشاط المخطط بالمنجز</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                            <tr><th className="p-8">البرنامج</th><th className="p-8 text-center">تكلفة مخططة</th><th className="p-8 text-center">تكلفة فعلية</th><th className="p-8 text-center">الانحراف</th><th className="p-8">تقييم الأداء</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold">
                            {programs.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-white">{p.name}</td>
                                    <td className="p-6 text-center text-night-400 font-mono">{p.plannedCost.toLocaleString()}</td>
                                    <td className="p-6 text-center text-white font-mono">{p.actualCost.toLocaleString()}</td>
                                    <td className="p-6 text-center text-rose-400 font-mono">{(p.actualCost - p.plannedCost).toLocaleString()}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase ${p.progress >= 100 ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-600/10 text-amber-400 border-amber-500/20'}`}>
                                                {p.progress >= 100 ? 'مثالي' : 'جيد'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-night-800/40 p-10 rounded-[3rem] border border-white/5 shadow-xl h-[400px]">
                    <h5 className="text-white font-black mb-10 flex items-center gap-3">مؤشر نجاح البرامج <TrendingUp size={18} className="text-emerald-400"/></h5>
                    <div className="flex-1 w-full h-full pb-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{ name: 'مكتمل', value: stats.completed }, { name: 'ملغى', value: stats.delayed }, { name: 'جاري', value: programs.filter(p => p.status === 'جاري').length }]} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={8} stroke="none">
                                    {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-night-800/40 p-10 rounded-[3rem] border border-white/5 shadow-xl flex flex-col justify-center items-center text-center">
                    <div className="w-32 h-32 bg-primary-600/20 rounded-full flex items-center justify-center text-primary-400 border border-primary-500/20 mb-6 shadow-inner"><Star size={48} fill="currentColor" /></div>
                    <h5 className="text-2xl font-black text-white mb-2">التقييم العام للموسم</h5>
                    <p className="text-night-500 font-bold uppercase tracking-[0.2em] text-xs">قوة البرامج والالتزام بالخطة</p>
                    <div className="mt-8 text-5xl font-black text-white tracking-tighter">8.5 <small className="text-xs text-night-500 uppercase tracking-widest">/ 10</small></div>
                </div>
            </div>
        </div>
    );

    // --- Tab 5: تقارير ---
    const renderReports = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-20" dir="rtl">
            <div className="bg-night-800/40 border border-white/5 p-10 rounded-[3rem] shadow-xl">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-primary-600/10 text-primary-400 rounded-3xl shadow-inner border border-white/5"><FilePieChart size={32}/></div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-1">توليد تقارير الأداء الموسمية</h3>
                            <p className="text-night-400 text-xs font-bold uppercase tracking-widest">استخراج البيانات بصيغ رسمية للمحافظة والقيادة العامة.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-3"><FileSpreadsheet size={18}/> تصدير EXCEL</button>
                        <button className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-3"><Download size={18}/> تصدير PDF</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'تقرير الأنشطة والفعاليات', desc: 'كشف شامل بكافة الأنشطة المخططة والمنجزة لهذا العام.', icon: History },
                    { title: 'تقرير نسب النجاح والانجاز', desc: 'تحليل بياني لمؤشرات النجاح وتحقيق الأهداف التربوية.', icon: Zap },
                    { title: 'تقرير الأداء الإداري والمالي', desc: 'مقارنة الميزانيات المرصودة بالتكاليف الحقيقية.', icon: BadgeDollarSign }
                ].map((report, i) => (
                    <div key={i} className="bg-night-800 border border-white/5 p-10 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-600 group-hover:w-3 transition-all"></div>
                        <div className={`p-4 bg-white/5 text-primary-400 w-fit rounded-2xl mb-6 shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all`}><report.icon size={32}/></div>
                        <h5 className="text-xl font-black text-white mb-3">{report.title}</h5>
                        <p className="text-night-400 text-sm font-bold leading-relaxed mb-10">{report.desc}</p>
                        <button className="flex items-center gap-2 text-primary-400 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-[-8px] transition-transform">معاينة وتنزيل <Download size={14}/></button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">البرمجة والتخطيط المركزي</h2>
                    <p className="text-night-400 font-bold opacity-80 uppercase tracking-widest text-sm leading-none mt-2">إدارة الموسم الكشفي: تخطيط، تنفيذ، وتقييم شامل.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-night-800/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                        <button className="p-3 rounded-xl text-primary-400 hover:bg-white/5 transition-all"><Printer size={20}/></button>
                        <button className="p-3 rounded-xl text-emerald-400 hover:bg-white/5 transition-all"><FileSpreadsheet size={20}/></button>
                    </div>
                </div>
            </div>

            <div className="flex bg-night-800/30 p-1 rounded-[2rem] border border-white/5 mb-10 self-start shadow-inner overflow-x-auto no-scrollbar max-w-full">
                {[
                    { label: 'نظرة عامة', icon: LayoutDashboard },
                    { label: 'قائمة البرامج والأنشطة', icon: LayoutList },
                    { label: 'تفاصيل النشاط/البرنامج', icon: Info },
                    { label: 'تقييم ومقارنة', icon: ArrowRightLeft },
                    { label: 'تقارير', icon: FileText }
                ].map((tab, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveTab(idx)}
                        className={`px-10 py-4 font-black text-sm rounded-[1.8rem] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === idx ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={20}/> {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 pb-20">
                {activeTab === 0 && renderOverview()}
                {activeTab === 1 && renderProgramList()}
                {activeTab === 2 && renderProgramDetails()}
                {activeTab === 3 && renderEvaluation()}
                {activeTab === 4 && renderReports()}
            </div>

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة نشاط برمجي جديد" footer={
                <div className="flex gap-4"><button onClick={() => setShowAddModal(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button><button onClick={handleSaveProgram} className="px-12 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-2xl transition-all flex items-center gap-2 transform hover:scale-105"><Save size={20}/> تأكيد التسجيل</button></div>
            }>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">اسم النشاط</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={newProgram.name} onChange={e => setNewProgram({...newProgram, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">نوع النشاط</label>
                            <CustomDropdown 
                                options={ACTIVITY_TYPES}
                                value={newProgram.type}
                                onChange={(v: string) => setNewProgram({...newProgram, type: v})}
                                placeholder="اختر النوع..."
                                icon={Tag}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">تاريخ البدء</label>
                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newProgram.startDate} onChange={e => setNewProgram({...newProgram, startDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">تاريخ الانتهاء</label>
                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newProgram.endDate} onChange={e => setNewProgram({...newProgram, endDate: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">المسؤول عن النشاط</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={newProgram.responsible} onChange={e => setNewProgram({...newProgram, responsible: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">عدد المشاركين المتوقع</label>
                            <input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={newProgram.expectedParticipants} onChange={e => setNewProgram({...newProgram, expectedParticipants: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">وصف النشاط</label>
                        <textarea className="w-full h-32 bg-night-900 border border-white/10 rounded-2xl p-4 text-white resize-none" value={newProgram.description} onChange={e => setNewProgram({...newProgram, description: e.target.value})} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// Internal Helper for Icon (FilePieChart)
const FilePieChart = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 22H8a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v11" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M16 16c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" />
        <path d="M12 12v4h4" />
    </svg>
);

export default Programming;
