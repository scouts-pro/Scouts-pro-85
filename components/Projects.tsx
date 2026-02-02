import React, { useState, useMemo } from 'react';
import { Project, Member } from '../types';
import { 
    Briefcase, DollarSign, BarChart3, Plus, TrendingUp, X, Save, 
    PieChart as PieIcon, List, Info, LayoutDashboard, Clock, Users, 
    ArrowRightLeft, FileText, CheckCircle2, AlertCircle, Filter, 
    Download, ExternalLink, ChevronLeft, Calendar, Tag, Percent,
    Eye, Edit, Trash2, ArrowUpRight, ArrowDownLeft, History,
    ShieldCheck, Coins, RefreshCcw, HandCoins
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface ProjectsProps {
    projects: Project[];
    onAddProject?: (project: Project) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Projects: React.FC<ProjectsProps> = ({ projects, onAddProject }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('ALL');

    // New State for Transfers
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferData, setTransferData] = useState({
        type: 'IN' as 'IN' | 'OUT',
        amount: 0,
        notes: '',
        ref: `TR-${Math.floor(10000 + Math.random() * 90000)}`
    });

    const [transfersHistory, setTransfersHistory] = useState([
        { id: 't1', date: '2024-05-10', type: 'OUT', amount: 15000, label: 'تحويل أرباح جزئي', status: 'APPROVED', ref: 'TR-7721' },
        { id: 't2', date: '2024-05-02', type: 'IN', amount: 45000, label: 'تمويل تشغيلي أولي', status: 'APPROVED', ref: 'TR-6540' },
        { id: 't3', date: '2024-06-01', type: 'OUT', amount: 5000, label: 'إرجاع ميزانية غير مستغلة', status: 'PENDING', ref: 'TR-9902' }
    ]);

    // New Project Form State
    const [newProject, setNewProject] = useState<any>({
        name: '',
        type: 'استثماري',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        budget: 0,
        status: 'جاري'
    });

    const selectedProject = useMemo(() => 
        projects.find(p => p.id === selectedProjectId) || projects[0]
    , [projects, selectedProjectId]);

    const stats = useMemo(() => {
        return {
            total: projects.length,
            active: projects.filter(p => p.status === 'جاري').length,
            completed: projects.filter(p => p.status === 'مكتمل').length,
            stopped: projects.filter(p => p.status === 'قيد التخطيط').length 
        };
    }, [projects]);

    const handleSave = () => {
        if (!newProject.name || !newProject.type || !newProject.startDate || !newProject.budget) {
            alert('يرجى ملء كافة الحقول الإجبارية');
            return;
        }
        
        if (onAddProject) {
            const project: Project = {
                ...newProject,
                id: Date.now().toString(),
                budget: Number(newProject.budget),
                profit: 0,
                managerId: '1' // Defaulting
            };
            onAddProject(project);
            setShowAddModal(false);
            setNewProject({
                name: '', type: 'استثماري', description: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '', budget: 0, status: 'جاري'
            });
        }
    };

    const handleNewTransfer = () => {
        if (transferData.amount <= 0 || !transferData.notes) {
            alert('يرجى إدخال المبلغ والبيان');
            return;
        }
        const newTransfer = {
            id: `t_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: transferData.type,
            amount: Number(transferData.amount),
            label: transferData.notes,
            status: 'PENDING',
            ref: transferData.ref
        };
        setTransfersHistory([newTransfer, ...transfersHistory]);
        setShowTransferModal(false);
        setTransferData({ type: 'IN', amount: 0, notes: '', ref: `TR-${Math.floor(10000 + Math.random() * 90000)}` });
    };

    // --- TAB RENDERS ---

    const renderOverview = () => (
        <div className="space-y-8 animate-fade-in font-['Cairo']" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl shadow-xl">
                    <div className="p-3 bg-primary-600/20 text-primary-400 w-fit rounded-2xl mb-4"><Briefcase size={24}/></div>
                    <p className="text-night-400 text-sm font-bold">عدد المشاريع</p>
                    <h3 className="text-3xl font-black text-white">{stats.total}</h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl shadow-xl">
                    <div className="p-3 bg-emerald-600/20 text-emerald-400 w-fit rounded-2xl mb-4"><Clock size={24}/></div>
                    <p className="text-night-400 text-sm font-bold">المشاريع الجارية</p>
                    <h3 className="text-3xl font-black text-emerald-400">{stats.active}</h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl shadow-xl">
                    <div className="p-3 bg-blue-600/20 text-blue-400 w-fit rounded-2xl mb-4"><CheckCircle2 size={24}/></div>
                    <p className="text-night-400 text-sm font-bold">المشاريع المكتملة</p>
                    <h3 className="text-3xl font-black text-blue-400">{stats.completed}</h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl shadow-xl">
                    <div className="p-3 bg-rose-600/20 text-rose-400 w-fit rounded-2xl mb-4"><AlertCircle size={24}/></div>
                    <p className="text-night-400 text-sm font-bold">المشاريع المتوقفة</p>
                    <h3 className="text-3xl font-black text-rose-400">{stats.stopped}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-night-800/50 border border-white/5 p-8 rounded-[2.5rem] h-80">
                    <h4 className="text-white font-bold mb-6 flex items-center gap-2"><BarChart3 size={20}/> حالات المشاريع</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'جارية', value: stats.active },
                            { name: 'مكتملة', value: stats.completed },
                            { name: 'متوقفة', value: stats.stopped }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-night-800/50 border border-white/5 p-8 rounded-[2.5rem] overflow-hidden">
                    <h4 className="text-white font-bold mb-6 flex items-center gap-2"><Clock size={20}/> آخر المشاريع المضافة</h4>
                    <div className="space-y-4">
                        {projects.slice(-3).reverse().map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-night-900/50 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-500"><Tag size={20}/></div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{p.name}</p>
                                        <p className="text-night-500 text-xs">{p.status}</p>
                                    </div>
                                </div>
                                <span className="text-night-300 font-mono text-xs">{p.budget.toLocaleString()} دج</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProjectList = () => (
        <div className="animate-fade-in space-y-6 font-['Cairo']" dir="rtl">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">قائمة المشاريع الإدارية</h3>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl transition-all"
                >
                    <Plus size={20}/> إضافة مشروع
                </button>
            </div>
            <div className="bg-night-800/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <table className="w-full text-right">
                    <thead className="bg-night-900 text-night-300 text-xs font-black uppercase tracking-widest">
                        <tr>
                            <th className="p-6">اسم المشروع</th>
                            <th className="p-6">النوع</th>
                            <th className="p-6">البداية</th>
                            <th className="p-6">النهاية</th>
                            <th className="p-6">الحالة</th>
                            <th className="p-6">الميزانية</th>
                            <th className="p-6 text-center">التقدم</th>
                            <th className="p-6 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {projects.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6 font-bold text-white">{p.name}</td>
                                <td className="p-6 text-night-400">استثماري</td>
                                <td className="p-6 text-night-400 font-mono">2024-01-01</td>
                                <td className="p-6 text-night-400 font-mono">2024-12-31</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                        p.status === 'جاري' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-night-900 text-night-500'
                                    }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-6 text-white font-mono">{p.budget.toLocaleString()}</td>
                                <td className="p-6">
                                    <div className="w-24 bg-night-900 h-1.5 rounded-full overflow-hidden mx-auto">
                                        <div className="bg-primary-500 h-full" style={{width: '65%'}}></div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => {setSelectedProjectId(p.id); setActiveTab(2);}} className="p-2 bg-white/5 hover:bg-primary-600 rounded-lg transition-all text-white"><Eye size={16}/></button>
                                        <button className="p-2 bg-white/5 hover:bg-indigo-600 rounded-lg transition-all text-white"><Edit size={16}/></button>
                                        <button className="p-2 bg-white/5 hover:bg-rose-600 rounded-lg transition-all text-white"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDetails = () => (
        <div className="animate-fade-in space-y-8 font-['Cairo'] text-right" dir="rtl">
            <div className="bg-night-800 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">{selectedProject?.name}</h2>
                        <div className="flex gap-4 items-center">
                            <span className="bg-primary-600/20 text-primary-400 px-4 py-1 rounded-xl text-xs font-black uppercase">استثماري</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1"><Clock size={16}/> جاري التنفيذ</span>
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-night-500 text-xs font-black uppercase mb-1">نسبة الإنجاز</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-black text-white">65%</span>
                            <div className="w-48 bg-night-900 h-3 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-primary-500 h-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{width: '65%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                        <h5 className="text-primary-400 font-black text-xs uppercase tracking-widest flex items-center gap-2"><Info size={14}/> معلومات عامة</h5>
                        <p className="text-night-300 text-sm leading-relaxed">{selectedProject?.description}</p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-primary-400 font-black text-xs uppercase tracking-widest flex items-center gap-2"><Users size={14}/> الفريق المشرف</h5>
                        <div className="flex -space-x-2 space-x-reverse">
                            <div className="w-10 h-10 rounded-full bg-night-700 border-2 border-night-800 flex items-center justify-center text-xs font-bold text-white">أ م</div>
                            <div className="w-10 h-10 rounded-full bg-primary-600 border-2 border-night-800 flex items-center justify-center text-xs font-bold text-white">ق ع</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-primary-400 font-black text-xs uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> الجدول الزمني</h5>
                        <div className="space-y-1">
                            <p className="text-xs text-night-500">البداية: <span className="text-white font-mono">2024-01-01</span></p>
                            <p className="text-xs text-night-500">النهاية: <span className="text-white font-mono">2024-12-31</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBudget = () => (
        <div className="animate-fade-in space-y-8 font-['Cairo'] text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl">
                    <p className="text-night-500 text-xs font-black uppercase mb-1">الميزانية المخصصة</p>
                    <h3 className="text-2xl font-black text-white">{selectedProject?.budget.toLocaleString()} <small className="text-xs">دج</small></h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl">
                    <p className="text-primary-400 text-xs font-black uppercase mb-1">التمويل المستلم</p>
                    <h3 className="text-2xl font-black text-white">45,000 <small className="text-xs">دج</small></h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl">
                    <p className="text-rose-400 text-xs font-black uppercase mb-1">المصروفات</p>
                    <h3 className="text-2xl font-black text-white">32,500 <small className="text-xs">دج</small></h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-3xl">
                    <p className="text-emerald-400 text-xs font-black uppercase mb-1">الفائض الحالي</p>
                    <h3 className="text-2xl font-black text-emerald-400">12,500 <small className="text-xs">دج</small></h3>
                </div>
            </div>

            <div className="bg-night-800/40 p-10 rounded-[3rem] border border-white/10">
                <h4 className="text-white font-bold mb-8 flex items-center gap-2"><Percent size={20} className="text-primary-500"/> نسبة استهلاك الميزانية</h4>
                <div className="space-y-6">
                    <div className="w-full bg-night-950 h-8 rounded-2xl overflow-hidden p-1 border border-white/5">
                        <div className="bg-gradient-to-l from-primary-600 to-indigo-600 h-full rounded-xl flex items-center justify-center text-[10px] font-black text-white" style={{width: '72%'}}>72% مستهلك</div>
                    </div>
                    <p className="text-xs text-night-500 italic">يتم تحديث هذه البيانات بناءً على التمويلات المستلمة من قسم المالية حصراً.</p>
                </div>
            </div>
        </div>
    );

    const renderTransfers = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-10" dir="rtl">
            {/* Action Header Card */}
            <div className="bg-gradient-to-br from-night-800 to-night-900 border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary-600/20 text-primary-400 rounded-[1.8rem] shadow-inner"><ArrowRightLeft size={32}/></div>
                            <div>
                                <h3 className="text-3xl font-black text-white">إدارة التدفقات المالية المركزية</h3>
                                <p className="text-night-400 font-bold opacity-80 mt-1">تتبع كافة التمويلات المستلمة من المالية والفوائض المحولة لها.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 pt-4">
                            <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl text-center backdrop-blur-md">
                                <span className="block text-night-500 text-[9px] font-black uppercase tracking-widest mb-1">إجمالي التمويلات (IN)</span>
                                <span className="text-emerald-400 font-black text-xl">120,000 دج</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl text-center backdrop-blur-md">
                                <span className="block text-night-500 text-[9px] font-black uppercase tracking-widest mb-1">إجمالي الفوائض (OUT)</span>
                                <span className="text-primary-400 font-black text-xl">45,000 دج</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowTransferModal(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-4 shadow-2xl shadow-primary-900/40 transition-all hover:scale-105 active:scale-95 group ring-4 ring-primary-600/10"
                    >
                        <RefreshCcw size={24} className="group-hover:rotate-180 transition-transform duration-700"/>
                        <span>إجراء تحويل مالي جديد</span>
                    </button>
                </div>
            </div>

            {/* Transfers Log Table */}
            <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-8 bg-night-900/40 border-b border-white/5 flex items-center justify-between">
                    <h5 className="text-2xl font-black text-white flex items-center gap-4"><History size={24} className="text-primary-500"/> أرشيف المعاملات المالية البينية</h5>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-night-400 hover:text-white transition-all"><Download size={20}/></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-night-950 text-night-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="p-8">المعاملة</th>
                                <th className="p-8">التاريخ</th>
                                <th className="p-8">النوع</th>
                                <th className="p-8">المبلغ الإجمالي</th>
                                <th className="p-8">حالة الاعتماد</th>
                                <th className="p-8">رقم القيد</th>
                                <th className="p-8 text-center">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold">
                            {transfersHistory.map(t => (
                                <tr key={t.id} className="hover:bg-white/5 transition-all group/row">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl shadow-inner ${t.type === 'IN' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-primary-600/20 text-primary-400'}`}>
                                                {t.type === 'IN' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                                            </div>
                                            <div>
                                                <p className="text-white font-black">{t.label}</p>
                                                <p className="text-[10px] text-night-500 uppercase tracking-widest">{t.type === 'IN' ? 'تمويل وارد' : 'تحويل صادر'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-night-400 font-mono tracking-tighter">{t.date}</td>
                                    <td className="p-8">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${t.type === 'IN' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' : 'bg-primary-900/20 text-primary-400 border-primary-500/20'}`}>
                                            {t.type === 'IN' ? 'RECEIVE (IN)' : 'TRANSFER (OUT)'}
                                        </span>
                                    </td>
                                    <td className={`p-8 text-xl font-black tracking-tighter ${t.type === 'IN' ? 'text-emerald-400' : 'text-primary-400'}`}>
                                        {t.amount.toLocaleString()} <small className="text-[9px] opacity-60">دج</small>
                                    </td>
                                    <td className="p-8">
                                        <span className={`flex items-center gap-2 text-[10px] font-black ${
                                            t.status === 'APPROVED' ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>
                                            {t.status === 'APPROVED' ? <CheckCircle2 size={14}/> : <Clock size={14} className="animate-pulse"/>}
                                            {t.status === 'APPROVED' ? 'معتمد نهائياً' : 'قيد المراجعة'}
                                        </span>
                                    </td>
                                    <td className="p-8 text-night-600 font-mono text-xs">{t.ref}</td>
                                    <td className="p-8 text-center">
                                        <button className="p-3 bg-night-900 border border-white/5 rounded-2xl text-night-400 hover:text-white hover:border-primary-500 transition-all opacity-0 group-hover/row:opacity-100"><Eye size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transfer Modal - Professional Form */}
            {showTransferModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-night-950/95 backdrop-blur-xl p-4 animate-fade-in" dir="rtl">
                    <div className="bg-night-800 w-full max-w-xl rounded-[3rem] border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col font-['Cairo'] text-right">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/30">
                            <h3 className="text-2xl font-black text-white flex items-center gap-4">تحويل مالي مركز <ArrowRightLeft className="text-primary-500" size={28}/></h3>
                            <button onClick={() => setShowTransferModal(false)} className="p-2 hover:bg-white/5 rounded-full text-night-400"><X size={24}/></button>
                        </div>
                        
                        <div className="p-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex bg-night-950 p-2 rounded-[2rem] border border-white/5 shadow-inner">
                                <button onClick={() => setTransferData({...transferData, type: 'IN'})} className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs transition-all flex items-center justify-center gap-2 ${transferData.type === 'IN' ? 'bg-emerald-600 text-white shadow-xl' : 'text-night-500'}`}><ArrowDownLeft size={16}/> طلب تمويل (IN)</button>
                                <button onClick={() => setTransferData({...transferData, type: 'OUT'})} className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs transition-all flex items-center justify-center gap-2 ${transferData.type === 'OUT' ? 'bg-primary-600 text-white shadow-xl' : 'text-night-500'}`}><ArrowUpRight size={16}/> تحويل للمالية (OUT)</button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-night-400 uppercase tracking-widest block text-center">المبلغ المراد تحويله (DZD)</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        className="w-full bg-night-950 border-2 border-white/5 rounded-[2.5rem] p-10 text-white text-6xl font-black focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-center shadow-inner tracking-tighter" 
                                        placeholder="0.00" 
                                        value={transferData.amount || ''} 
                                        onChange={e => setTransferData({...transferData, amount: Number(e.target.value)})} 
                                    />
                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 text-night-800 pointer-events-none group-focus-within:opacity-0 transition-opacity"><Coins size={56}/></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">بيان التحويل (التفاصيل)</label>
                                <textarea 
                                    className="w-full h-28 bg-night-950 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none resize-none font-bold text-sm shadow-inner" 
                                    placeholder="اكتب غرض التحويل أو التمويل بالتفصيل..."
                                    value={transferData.notes}
                                    onChange={e => setTransferData({...transferData, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex items-center gap-4 bg-night-900/50 p-4 rounded-2xl border border-white/5">
                                <Info className="text-primary-500" size={24}/>
                                <p className="text-[11px] text-night-400 font-bold leading-relaxed">تنبيه: كافة التحويلات البينية تتطلب مصادقة قائد الفوج ومسؤول المالية والوسائل قبل تفعيلها في الأرصدة الحقيقية.</p>
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">
                            <button onClick={() => setShowTransferModal(false)} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button>
                            <button onClick={handleNewTransfer} className="px-12 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 group/save">
                                <Save size={20} className="group-hover:scale-125 transition-transform" /> 
                                <span>اعتماد طلب التحويل</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderReports = () => (
        <div className="animate-fade-in space-y-8 font-['Cairo'] text-right" dir="rtl">
            <div className="flex flex-col md:flex-row gap-4 bg-night-800/50 p-6 rounded-3xl border border-white/5 items-center">
                <div className="flex-1 w-full"><select className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none"><option>كل المشاريع</option></select></div>
                <div className="flex-1 w-full"><select className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none"><option>كل الحالات</option></select></div>
                <button className="bg-primary-600 text-white px-10 py-3 rounded-xl font-black flex items-center gap-2"><Filter size={18}/> تصفية</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="p-8 bg-night-800 border border-white/5 rounded-[2rem] hover:border-primary-500 transition-all group flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-primary-600/10 text-primary-500 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all"><FileText size={32}/></div>
                    <h5 className="text-white font-bold">تقرير تقدم المشروع</h5>
                    <Download size={20} className="text-night-500"/>
                </button>
                <button className="p-8 bg-night-800 border border-white/5 rounded-[2rem] hover:border-emerald-500 transition-all group flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-emerald-600/10 text-emerald-500 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><DollarSign size={32}/></div>
                    <h5 className="text-white font-bold">تقرير الميزانية والمصاريف</h5>
                    <Download size={20} className="text-night-500"/>
                </button>
                <button className="p-8 bg-night-800 border border-white/5 rounded-[2rem] hover:border-purple-500 transition-all group flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-purple-600/10 text-purple-500 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all"><ArrowRightLeft size={32}/></div>
                    <h5 className="text-white font-bold">تقرير التمويل والتحويلات</h5>
                    <Download size={20} className="text-night-500"/>
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2">المشاريع</h2>
                    <p className="text-night-400 font-bold opacity-80">إدارة المبادرات الاستراتيجية والاستثمارات الكشفية.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-[2rem] flex items-center gap-4 font-black shadow-2xl shadow-primary-900/40 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" /> تسجيل مشروع جديد
                </button>
            </div>

            <div className="flex bg-night-800/40 p-2 rounded-[2rem] border border-white/5 mb-10 overflow-x-auto no-scrollbar gap-2 shadow-inner">
                {[
                    {label: 'نظرة عامة', icon: LayoutDashboard},
                    {label: 'قائمة المشاريع', icon: List},
                    {label: 'تفاصيل المشروع', icon: Info},
                    {label: 'ميزانية المشروع', icon: DollarSign},
                    {label: 'التحويلات مع قسم المالية', icon: ArrowRightLeft},
                    {label: 'التقارير', icon: FileText}
                ].map((tab, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveTab(idx)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all whitespace-nowrap ${activeTab === idx ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={18} className={activeTab === idx ? 'animate-pulse' : 'opacity-60'} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                {activeTab === 0 && renderOverview()}
                {activeTab === 1 && renderProjectList()}
                {activeTab === 2 && renderDetails()}
                {activeTab === 3 && renderBudget()}
                {activeTab === 4 && renderTransfers()}
                {activeTab === 5 && renderReports()}
            </div>

            {/* --- ADD MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-night-950/95 backdrop-blur-xl p-4 animate-fade-in" dir="rtl">
                    <div className="bg-night-800 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col font-['Cairo'] text-right">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/30">
                            <h3 className="text-2xl font-black text-white flex items-center gap-4">إضافة مشروع جديد <Briefcase className="text-primary-500" size={28}/></h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full text-night-400"><X size={24}/></button>
                        </div>
                        
                        <div className="p-10 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">اسم المشروع <span className="text-rose-500">*</span></label>
                                    <input type="text" className="w-full bg-night-950 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-bold" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">نوع المشروع <span className="text-rose-500">*</span></label>
                                    <select className="w-full bg-night-950 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-bold" value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value})}>
                                        <option>استثماري</option><option>خدماتي</option><option>تربوي</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">وصف مختصر <span className="text-rose-500">*</span></label>
                                <textarea className="w-full h-24 bg-night-950 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none resize-none" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">تاريخ البداية <span className="text-rose-500">*</span></label>
                                    <input type="date" className="w-full bg-night-950 border border-white/10 rounded-2xl p-4 text-white font-mono" value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">تاريخ النهاية <span className="text-rose-500">*</span></label>
                                    <input type="date" className="w-full bg-night-950 border border-white/10 rounded-2xl p-4 text-white font-mono" value={newProject.endDate} onChange={e => setNewProject({...newProject, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">الميزانية التقديرية (دج) <span className="text-rose-500">*</span></label>
                                <input type="number" className="w-full bg-night-950 border border-white/10 rounded-2xl p-4 text-white font-mono text-2xl font-black focus:border-primary-500 outline-none" value={newProject.budget} onChange={e => setNewProject({...newProject, budget: e.target.value})} />
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">
                            <button onClick={() => setShowAddModal(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button>
                            <button onClick={handleSave} className="px-12 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-2xl flex items-center gap-2"><Save size={20}/> تأكيد وحفظ المشروع</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;