
import React, { useState, useMemo } from 'react';
import { 
    Member, Event, Transaction, Project, AttendanceSession, ArchiveDocument, UnitName 
} from '../types';
import { 
    Archive as ArchiveIcon, Layers, Users, FileText, BarChart3, Search, 
    Filter, Download, Eye, X, Calendar, MapPin, CheckCircle2, History, 
    TrendingUp, ShieldCheck, Printer, Briefcase, DollarSign, ArrowUpRight, 
    FileSpreadsheet, PieChart as PieIcon, Activity, Star, Rocket, Target, Zap,
    Receipt, ChevronDown
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area 
} from 'recharts';

// --- Professional Custom Dropdown Component ---
const CustomDropdown = ({ options, value, onChange, placeholder, icon: Icon, className }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selected ? (typeof selected === 'object' ? selected.label : selected) : placeholder;

    return (
        <div className={`relative ${className} font-['Cairo']`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-night-950 border border-white/10 rounded-2xl px-6 py-4 text-white flex items-center justify-between cursor-pointer hover:border-primary-500 transition-all shadow-inner"
            >
                <div className="flex items-center gap-3">
                    {/* Fix: Corrected syntax to render the Icon component and added a null check */}
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

// --- Fixed Modal Component Outside Render ---
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="fixed inset-0 bg-night-950/95 backdrop-blur-xl" onClick={onClose}></div>
            <div className={`bg-night-800 w-full ${maxWidth} rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/40">
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-night-400 transition-all"><X size={24}/></button>
                    <h3 className="text-2xl font-black text-white">{title}</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">{children}</div>
            </div>
        </div>
    );
};

interface ArchiveProps {
    members: Member[];
    events: Event[];
    transactions: Transaction[];
    projects: Project[];
    attendance: AttendanceSession[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Archive: React.FC<ArchiveProps> = ({ members, events, transactions, projects, attendance }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterUnit, setFilterUnit] = useState('ALL');
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

    const TABS = [
        { label: 'قوائم المشاركين', icon: Layers },
        { label: 'الأعضاء المسجلين والناشطين', icon: Users },
        { label: 'المستندات الإدارية والمالية', icon: FileText },
        { label: 'الإحصائيات', icon: BarChart3 },
        { label: 'البحث والاسترجاع', icon: Search }
    ];

    // --- Data Processing for Archive ---
    
    const participantLists = useMemo(() => {
        return events.map(ev => ({
            id: ev.id,
            title: ev.title,
            type: ev.type,
            date: ev.date || ev.startDate || '---',
            unitCount: ev.targetUnits?.length || 0,
            participantCount: (ev.participants?.length || 0) + (ev.leaderIds?.length || 0),
            members: members.filter(m => [...(ev.participants || []), ...(ev.leaderIds || [])].includes(m.id)),
            location: ev.location
        }));
    }, [events, members]);

    const archivedDocuments: ArchiveDocument[] = useMemo(() => [
        { id: 'doc1', name: 'عقد استغلال المقر', type: 'عقد', year: '2024', department: 'الإدارة', date: '2024-01-01' },
        { id: 'doc2', name: 'ميزانية المخيم الربيعي', type: 'ميزانية', year: '2024', department: 'المالية', date: '2024-03-15' },
        { id: 'doc3', name: 'ترخيص رحلة استكشافية', type: 'ترخيص', year: '2024', department: 'الأنشطة', date: '2024-05-10' },
        { id: 'doc4', name: 'فاتورة لوازم التخييم', type: 'فاتورة', year: '2024', department: 'العتاد', date: '2024-05-12' },
    ], []);

    // --- Tab 1: قوائم المشاركين ---
    const renderParticipantLists = () => (
        <div className="space-y-8 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {participantLists.map(list => (
                    <div key={list.id} className="bg-night-800 border border-white/5 rounded-[2.5rem] p-8 hover:border-primary-500/50 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-600"></div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black text-primary-400 border border-white/10 uppercase">{list.type}</span>
                            <span className="text-night-500 text-[10px] font-mono">{list.date}</span>
                        </div>
                        <h4 className="text-2xl font-black text-white mb-2 line-clamp-1">{list.title}</h4>
                        <div className="flex items-center gap-2 text-night-400 text-sm mb-8"><MapPin size={16} className="text-primary-500" /> {list.location}</div>
                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-night-900 flex items-center justify-center text-primary-400 shadow-inner"><Users size={20}/></div>
                                <span className="text-xl font-black text-white tracking-tighter">{list.participantCount} مشارك</span>
                            </div>
                            <button onClick={() => setSelectedEntityId(list.id)} className="p-3 bg-white/5 hover:bg-primary-600 rounded-2xl text-white transition-all"><Eye size={20}/></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={!!selectedEntityId} onClose={() => setSelectedEntityId(null)} title="القائمة الاسمية للمشاركين" maxWidth="max-w-5xl">
                {selectedEntityId && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6 bg-night-950/40 p-4 rounded-2xl border border-white/5">
                             <div>
                                 <h4 className="text-xl font-black text-white">{participantLists.find(l => l.id === selectedEntityId)?.title}</h4>
                                 <p className="text-night-400 text-xs mt-1">تاريخ النشاط: {participantLists.find(l => l.id === selectedEntityId)?.date}</p>
                             </div>
                             <div className="flex gap-2">
                                 <button className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/20"><FileSpreadsheet size={20}/></button>
                                 <button className="p-3 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/20"><Printer size={20}/></button>
                             </div>
                        </div>
                        <table className="w-full text-right">
                            <thead className="bg-night-950 text-night-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="p-6">الاسم الكامل</th>
                                    <th className="p-6">الوحدة</th>
                                    <th className="p-6">تاريخ الميلاد</th>
                                    <th className="p-6">رقم التأمين</th>
                                    <th className="p-6">الحالة المالية</th>
                                    <th className="p-6 text-center">النقاط المكتسبة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-bold">
                                {participantLists.find(l => l.id === selectedEntityId)?.members.map(m => (
                                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5 flex items-center gap-4">
                                            <img src={m.image} className="w-10 h-10 rounded-xl border border-white/5" />
                                            <span className="text-white">{m.fullName}</span>
                                        </td>
                                        <td className="p-5 text-night-400">{m.unit}</td>
                                        <td className="p-5 text-night-400 font-mono text-xs">{m.birthDate}</td>
                                        <td className="p-5 text-night-300 font-mono">{m.insuranceNumber}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] border ${m.subscriptionPaid ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-600/10 text-rose-400 border-rose-500/20'}`}>
                                                {m.subscriptionPaid ? 'مسدد' : 'غير مسدد'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center font-mono text-primary-400">+{m.points || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Modal>
        </div>
    );

    // --- Tab 2: الأعضاء المسجلين والناشطين ---
    const renderActiveMembers = () => (
        <div className="space-y-6 animate-fade-in text-right font-['Cairo']" dir="rtl">
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-night-800/50 p-4 rounded-[2rem] border border-white/5 items-center backdrop-blur-xl">
                <div className="relative flex-1 group">
                    <input type="text" placeholder="بحث باسم العضو أو رقم التعريف..." className="w-full bg-night-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white text-sm outline-none focus:border-primary-500 transition-all font-bold" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <Search className="absolute right-4 top-4 text-night-500 group-focus-within:text-primary-400" size={20} />
                </div>
                <CustomDropdown 
                    options={[{value: 'ALL', label: 'جميع الوحدات'}, ...Object.values(UnitName).map(u => ({value: u, label: u}))]}
                    value={filterUnit}
                    onChange={setFilterUnit}
                    placeholder="تصفية الوحدات..."
                    className="w-full md:w-64"
                />
            </div>

            <div className="bg-night-800/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-night-950 text-night-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="p-8">العضو</th>
                                <th className="p-8">الوحدة / الطليعة</th>
                                <th className="p-8">تاريخ الميلاد</th>
                                <th className="p-8">رقم بطاقة التعريف</th>
                                <th className="p-8">الوظيفة الكشفية</th>
                                <th className="p-8 text-center">نقاط الإنضباط</th>
                                <th className="p-8 text-center">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold">
                            {members
                                .filter(m => filterUnit === 'ALL' || m.unit === filterUnit)
                                .filter(m => m.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(m => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 flex items-center gap-5">
                                        <img src={m.image} className="w-14 h-14 rounded-2xl border-2 border-night-700 shadow-xl" />
                                        <div>
                                            <p className="font-black text-white text-lg leading-none mb-1">{m.fullName}</p>
                                            <p className="text-[10px] text-night-500 font-mono tracking-widest uppercase">ID: {m.membershipNumber}</p>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-right">
                                            <p className="text-white">{m.unit}</p>
                                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest">{m.patrol}</p>
                                        </div>
                                    </td>
                                    <td className="p-6 text-night-400 font-mono text-xs">{m.birthDate}</td>
                                    <td className="p-6 text-night-300 font-mono tracking-widest">0000000000</td>
                                    <td className="p-6">
                                        <span className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-night-300 text-[10px] font-black uppercase">
                                            {m.scoutMission || 'عضو'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center text-emerald-400 font-black text-xl tracking-tighter">{m.points}</td>
                                    <td className="p-6 text-center">
                                        <button className="p-3 bg-white/5 hover:bg-primary-600 rounded-2xl text-white transition-all shadow-lg"><Eye size={20}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // --- Tab 3: المستندات الإدارية والمالية ---
    const renderDocuments = () => (
        <div className="space-y-8 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'العقود والقرارات', count: 12, icon: FileText, color: 'text-blue-400' },
                    { label: 'الفواتير والإيصالات', count: 45, icon: Receipt, color: 'text-emerald-400' },
                    { label: 'الميزانيات السنوية', count: 4, icon: DollarSign, color: 'text-amber-400' },
                    { label: 'التراخيص الرسمية', count: 8, icon: ShieldCheck, color: 'text-purple-400' },
                ].map((cat, i) => (
                    <div key={i} className="bg-night-800 border border-white/5 p-6 rounded-3xl shadow-xl hover:-translate-y-1 transition-all group">
                        <div className={`p-4 bg-white/5 ${cat.color} w-fit rounded-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all`}><cat.icon size={28}/></div>
                        <h5 className="text-xl font-black text-white">{cat.label}</h5>
                        <p className="text-night-500 text-xs font-bold mt-1 uppercase tracking-widest">{cat.count} مستند مؤرشف</p>
                    </div>
                ))}
            </div>

            <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/40">
                    <h4 className="text-2xl font-black text-white flex items-center gap-4"><History size={24} className="text-primary-500"/> أرشيف الوثائق والمستندات</h4>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <input type="text" placeholder="بحث في المستندات..." className="bg-night-950 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white outline-none w-64 focus:border-primary-500 transition-all font-bold" />
                            <Search className="absolute right-3 top-2.5 text-night-500" size={14} />
                        </div>
                        <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-night-400"><Download size={18}/></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-night-950 text-night-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                            <tr><th className="p-6">اسم المستند</th><th className="p-6">النوع</th><th className="p-6">السنة</th><th className="p-6">القسم</th><th className="p-6">التاريخ</th><th className="p-6 text-center">معاينة</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold">
                            {archivedDocuments.map(doc => (
                                <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-white">{doc.name}</td>
                                    <td className="p-6"><span className="bg-white/5 px-3 py-1 rounded-lg text-primary-400 border border-white/10">{doc.type}</span></td>
                                    <td className="p-6 text-night-300 font-mono">{doc.year}</td>
                                    <td className="p-6 text-night-300">{doc.department}</td>
                                    <td className="p-6 text-night-400 font-mono">{doc.date}</td>
                                    <td className="p-6 text-center"><button className="p-3 bg-white/5 hover:bg-primary-600 rounded-2xl text-white transition-all shadow-lg"><Eye size={18}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // --- Tab 4: الإحصائيات ---
    const renderStatistics = () => (
        <div className="space-y-10 animate-fade-in font-['Cairo'] text-right pb-20" dir="rtl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-night-800/40 p-10 rounded-[3rem] border border-white/5 shadow-xl h-[500px] flex flex-col">
                    <h4 className="text-xl font-black text-white mb-10 flex items-center gap-3"><Activity size={24} className="text-primary-500"/> نسب الحضور والغياب التاريخية</h4>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'نشاط 1', presence: 85, absence: 15 },
                                { name: 'نشاط 2', presence: 92, absence: 8 },
                                { name: 'نشاط 3', presence: 78, absence: 22 },
                                { name: 'نشاط 4', presence: 95, absence: 5 },
                                { name: 'نشاط 5', presence: 88, absence: 12 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorAbsence" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={10} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1.5rem', border: 'none' }} />
                                <Area type="monotone" dataKey="presence" stroke="#10b981" fillOpacity={1} fill="url(#colorPresence)" strokeWidth={3} name="نسبة الحضور %" />
                                <Area type="monotone" dataKey="absence" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsence)" strokeWidth={3} name="نسبة الغياب %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-night-800/40 p-10 rounded-[3rem] border border-white/5 shadow-xl h-[500px] flex flex-col">
                    <h4 className="text-xl font-black text-white mb-10 flex items-center gap-3"><Zap size={24} className="text-amber-500"/> مقارنة الأداء: المخطط مقابل المنجز</h4>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'الأنشطة', planned: 24, actual: 20 },
                                { name: 'المخيمات', planned: 4, actual: 4 },
                                { name: 'المشاريع', planned: 6, actual: 3 },
                                { name: 'الدورات', planned: 10, actual: 12 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none' }} />
                                <Bar dataKey="planned" fill="#334155" radius={[6, 6, 0, 0]} barSize={40} name="المستهدف (الخطة)" />
                                <Bar dataKey="actual" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} name="المحقق (المنجز)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-night-800/60 p-10 rounded-[4rem] border border-white/10 shadow-3xl text-center backdrop-blur-2xl">
                <div className="w-24 h-24 bg-primary-600/10 rounded-full flex items-center justify-center text-primary-500 mx-auto mb-6 shadow-inner animate-glow-primary"><Activity size={48}/></div>
                <h3 className="text-3xl font-black text-white mb-4">ملخص الأداء السنوي العام</h3>
                <p className="text-night-400 text-sm max-w-2xl mx-auto font-bold leading-relaxed">بناءً على البيانات المجمعة، حقق الفوج هذا العام نسبة نجاح برامج بلغت 84% مع استقرار مالي بنسبة 92%. تم تسجيل تفوق ملحوظ في وحدة الكشاف والمتقدم.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
                    <div>
                        <p className="text-night-500 text-[10px] font-black uppercase mb-1">المعدل العام</p>
                        <p className="text-2xl font-black text-white">8.5/10</p>
                    </div>
                    <div>
                        <p className="text-night-500 text-[10px] font-black uppercase mb-1">نسبة النمو</p>
                        <p className="text-2xl font-black text-emerald-400">+12%</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSearch = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-20" dir="rtl">
            <div className="bg-night-800/40 p-12 rounded-[3rem] border border-white/5 shadow-xl flex flex-col items-center justify-center text-center">
                <Search size={64} className="text-night-700 mb-6 opacity-20" />
                <h3 className="text-2xl font-black text-white mb-2">محرك البحث الأرشيفي</h3>
                <p className="text-night-400 max-w-md mx-auto font-bold mb-8">ابحث في كافة سجلات الفوج التاريخية، القوائم الإسمية، والمراسلات المؤرشفة.</p>
                <div className="w-full max-w-2xl relative group">
                    <input type="text" placeholder="أدخل كلمات البحث هنا (اسم العضو، تاريخ، عنوان نشاط...)" className="w-full bg-night-950 border border-white/10 rounded-[2rem] p-6 pr-14 text-white font-bold outline-none focus:border-primary-500 transition-all shadow-inner" />
                    <Search className="absolute right-6 top-6 text-night-500" size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">الأرشيف المركزي</h2>
                    <p className="text-night-400 font-bold opacity-80 uppercase tracking-widest text-sm leading-none mt-2">توثيق وحفظ الذاكرة الكشفية للفوج: قوائم، مستندات، وإحصائيات.</p>
                </div>
                <div className="flex bg-night-800/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                    <button className="p-3 rounded-xl text-primary-400 hover:bg-white/5 transition-all"><Printer size={20}/></button>
                    <button className="p-3 rounded-xl text-emerald-400 hover:bg-white/5 transition-all"><FileSpreadsheet size={20}/></button>
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
                {activeTab === 0 && renderParticipantLists()}
                {activeTab === 1 && renderActiveMembers()}
                {activeTab === 2 && renderDocuments()}
                {activeTab === 3 && renderStatistics()}
                {activeTab === 4 && renderSearch()}
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

export default Archive;
