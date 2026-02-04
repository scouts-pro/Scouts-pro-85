
import React, { useState, useMemo } from 'react';
import { Member, Badge, PointRecord, RankLevel, UnitName, Patrol, AttendanceSession, Sanction, AttendanceSettings } from '../types';
import { UNITS_LIST } from '../constants';
// Add Tag to the lucide-react imports
import { 
    Medal, Trophy, Star, History, Target, Crown, ChevronDown, Filter, 
    AlertCircle, CheckCircle2, Award, Plus, Edit, Trash2, X, Save, 
    TrendingUp, ShieldCheck, Zap, Info, ChevronRight, ChevronLeft,
    Check, Settings2, BarChart3, Users, Flag, Activity, Tent, Gavel,
    ArrowRightLeft, RefreshCcw, LayoutGrid, List, Sliders, Settings, Rocket,
    Search, Heart, Globe, BookOpen, Shield, Flame, Compass, Map, Coffee,
    UserCheck, UserX, Clock, MinusCircle, LayoutList, Tag
} from 'lucide-react';

interface RankingProps {
  members: Member[];
  badges: Badge[];
  pointsHistory: PointRecord[];
  rankLevels: RankLevel[];
  patrols: Patrol[];
  attendance?: AttendanceSession[];
  sanctions?: Sanction[];
  attendanceSettings?: AttendanceSettings;
}

// --- Icons Library for Badges ---
const BADGE_ICONS = [
    { id: 'medal', icon: Medal, label: 'ميدالية' }, 
    { id: 'award', icon: Award, label: 'وسام' }, 
    { id: 'trophy', icon: Trophy, label: 'كأس' },
    { id: 'star', icon: Star, label: 'نجمة' }, 
    { id: 'zap', icon: Zap, label: 'برق' }, 
    { id: 'target', icon: Target, label: 'هدف' },
    { id: 'rocket', icon: Rocket, label: 'صاروخ' }, 
    { id: 'heart', icon: Heart, label: 'قلب' }, 
    { id: 'globe', icon: Globe, label: 'عالمي' },
    { id: 'book', icon: BookOpen, label: 'كتاب' }, 
    { id: 'shield', icon: Shield, label: 'درع' }, 
    { id: 'tent', icon: Tent, label: 'خيمة' },
    { id: 'flame', icon: Flame, label: 'شعلة' }, 
    { id: 'compass', icon: Compass, label: 'بوصلة' }, 
    { id: 'map', icon: Map, label: 'خريطة' },
    { id: 'coffee', icon: Coffee, label: 'خدمة' }, 
    { id: 'flag', icon: Flag, label: 'راية' }, 
    { id: 'activity', icon: Activity, label: 'نشاط' }
];

// --- Professional Modal Component ---
const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-2xl" }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-night-950/95 backdrop-blur-xl p-4 animate-fade-in font-['Cairo']" dir="rtl">
            <div className={`bg-night-800 w-full ${maxWidth} rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-night-900/40">
                    <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-night-400 hover:text-white transition-all"><X size={20}/></button>
                    <h3 className="text-xl font-black text-white">{title}</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">{children}</div>
                {footer && <div className="p-6 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">{footer}</div>}
            </div>
        </div>
    );
};

// --- Artistic Custom Dropdown (Z-index Fix) ---
const Dropdown = ({ options, value, onChange, placeholder, icon: Icon, className, disabled, label }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const displayLabel = selected ? (typeof selected === 'object' ? selected.label : selected) : placeholder;

    return (
        <div className={`relative ${className} z-[12000]`}>
            {label && <label className="block text-[10px] font-black text-night-400 uppercase tracking-widest mb-2 mr-2">{label}</label>}
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-night-900 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all shadow-inner ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isOpen ? 'ring-1 ring-primary-500 border-primary-500' : ''}`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-primary-400" />}
                    <span className="text-xs font-bold truncate">{displayLabel}</span>
                </div>
                <ChevronDown size={14} className={`text-night-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[12001]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-2 bg-night-800 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[12002] max-h-60 overflow-y-auto custom-scrollbar animate-fade-in ring-1 ring-black/50">
                        {options.map((opt: any, idx: number) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`p-4 hover:bg-white/5 cursor-pointer text-xs text-white border-b border-white/5 last:border-0 flex items-center justify-between transition-colors ${val === value ? 'bg-primary-600/10 text-primary-400 font-black' : ''}`}
                                >
                                    {lbl}
                                    {val === value && <Check size={12} />}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const Ranking: React.FC<RankingProps> = ({ members, badges: initialBadges, patrols, attendance = [], sanctions = [], attendanceSettings }) => {
    const [activeTab, setActiveTab] = useState(0);
    
    // --- Filters ---
    const [filters, setFilters] = useState({
        unit: 'ALL',
        patrol: 'ALL',
        level: 'ALL',
        minPoints: 0,
        maxPoints: 10000
    });

    // --- Settings Modal State (Discipline Ownership transferred to Discipline Section) ---
    const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
    const [criteria, setCriteria] = useState([
        { id: '2', name: 'المشاركة في الأنشطة', points: 20, isActive: true },
        { id: '3', name: 'المخيمات الكبرى', points: 50, isActive: true },
        { id: '4', name: 'الأوسمة والشارات', points: 100, isActive: true },
        { id: '6', name: 'التفوق العلمي', points: 30, isActive: true },
    ]);

    // --- Badges Logic ---
    const [badges, setBadges] = useState<Badge[]>(initialBadges);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [badgeSearch, setBadgeSearch] = useState('');
    const [editingBadge, setEditingBadge] = useState<any>({
        name: '', description: '', pointsValue: 100, category: 'شارة كفاية', level: 'مبتدئ', iconId: 'award'
    });

    // --- Progress Ladder (سلم التقدم) ---
    const PROGRESS_LEVELS = [
        { id: 'lvl1', name: 'مبتدئ', minPoints: 0, color: '#94a3b8', icon: Zap },
        { id: 'lvl2', name: 'متقدم', minPoints: 500, color: '#3b82f6', icon: Activity },
        { id: 'lvl3', name: 'نشيط', minPoints: 1500, color: '#10b981', icon: Star },
        { id: 'lvl4', name: 'قائد متميز', minPoints: 3000, color: '#f59e0b', icon: Target },
        { id: 'lvl5', name: 'نخبة الفوج', minPoints: 5000, color: '#ef4444', icon: Crown }
    ];

    const getMemberLevel = (pts: number) => {
        return PROGRESS_LEVELS.slice().reverse().find(l => pts >= l.minPoints) || PROGRESS_LEVELS[0];
    };

    // --- LOGIC: الربط المحكم مع قسم الانضباط (Attendance & Sanctions) ---
    const calculateMemberPoints = (member: Member) => {
        let total = member.points || 0;

        // 1. حساب نقاط الحضور والغياب من سجلات الانضباط
        attendance.forEach(session => {
            const record = session.records.find(r => r.memberId === member.id);
            if (record) {
                if (record.status === 'حاضر') total += (attendanceSettings?.presentPoints || 10);
                if (record.status === 'متأخر') total += (attendanceSettings?.latePoints || 5);
                if (record.status === 'غائب') total += (attendanceSettings?.absentPoints || -10);
                if (record.status === 'غياب مبرر') total += (attendanceSettings?.unjustifiedPoints || -15);
            }
        });

        // 2. خصم نقاط العقوبات من سجلات الانضباط
        const memberSanctions = sanctions.filter(s => s.memberId === member.id && s.status === 'مفعّلة');
        total -= (memberSanctions.length * 50); // خصم 50 نقطة لكل عقوبة مفعلة بشكل افتراضي

        return total;
    };

    const filteredMembers = useMemo(() => {
        return [...members]
            .map(m => ({ ...m, dynamicPoints: calculateMemberPoints(m) }))
            .filter(m => {
                const matchesUnit = filters.unit === 'ALL' || m.unit === filters.unit;
                const matchesPatrol = filters.patrol === 'ALL' || m.patrol === filters.patrol;
                const matchesPoints = m.dynamicPoints >= filters.minPoints && m.dynamicPoints <= filters.maxPoints;
                const currentLvl = getMemberLevel(m.dynamicPoints);
                const matchesLevel = filters.level === 'ALL' || currentLvl.name === filters.level;
                return matchesUnit && matchesPatrol && matchesPoints && matchesLevel;
            })
            .sort((a, b) => b.dynamicPoints - a.dynamicPoints);
    }, [members, filters, attendance, sanctions]);

    const topThree = useMemo(() => filteredMembers.slice(0, 3), [filteredMembers]);

    // --- TAB 1: الترتيب العام ---
    const renderGeneralRanking = () => (
        <div className="space-y-10 animate-fade-in font-['Cairo']" dir="rtl">
            {/* Podium Section */}
            <div className="flex flex-col md:flex-row justify-center items-end gap-0 pt-16 pb-6 h-[400px]">
                {/* 2nd Place */}
                {topThree[1] && (
                    <div className="flex flex-col items-center group relative">
                        <div className="w-24 h-24 rounded-[2rem] border-4 border-slate-400 shadow-[0_0_20px_rgba(148,163,184,0.3)] overflow-hidden mb-4 transform group-hover:scale-110 transition-all z-10">
                            <img src={topThree[1].image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="bg-night-800/80 backdrop-blur-md border border-slate-400/30 w-36 h-36 rounded-t-3xl flex flex-col items-center justify-end p-6 shadow-xl relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
                            <span className="text-4xl font-black text-slate-400 mb-1">2</span>
                            <p className="text-[10px] font-black text-white text-center truncate w-full">{topThree[1].fullName}</p>
                            <span className="text-[9px] text-slate-400 font-mono mt-1">{topThree[1].dynamicPoints} PTS</span>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <div className="flex flex-col items-center z-10 group -mt-10 px-4">
                        <div className="mb-2 animate-bounce"><Crown size={48} className="text-yellow-500" fill="currentColor" /></div>
                        <div className="w-32 h-32 rounded-[2.5rem] border-4 border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)] overflow-hidden mb-4 transform group-hover:scale-110 transition-all z-20">
                            <img src={topThree[0].image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="bg-night-800 border-2 border-yellow-500/50 w-48 h-56 rounded-t-[2.5rem] flex flex-col items-center justify-end p-8 shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                            <span className="text-6xl font-black text-yellow-500 mb-2">1</span>
                            <p className="text-xs font-black text-white text-center truncate w-full">{topThree[0].fullName}</p>
                            <span className="text-xs text-yellow-400 font-mono mt-1">{topThree[0].dynamicPoints} PTS</span>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <div className="flex flex-col items-center group relative">
                        <div className="w-20 h-20 rounded-[1.8rem] border-4 border-orange-700 shadow-[0_0_20px_rgba(194,65,12,0.3)] overflow-hidden mb-4 transform group-hover:scale-110 transition-all z-10">
                            <img src={topThree[2].image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="bg-night-800/80 backdrop-blur-md border border-orange-700/30 w-32 h-28 rounded-t-3xl flex flex-col items-center justify-end p-5 shadow-xl relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-orange-700"></div>
                            <span className="text-3xl font-black text-orange-700 mb-1">3</span>
                            <p className="text-[10px] font-black text-white text-center truncate w-full">{topThree[2].fullName}</p>
                            <span className="text-[9px] text-orange-700 font-mono mt-1">{topThree[2].dynamicPoints} PTS</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Aesthetic Filters (Beautiful Dropdowns FIXED: Overflow-visible for dropdowns) */}
            <div className="bg-night-800/60 p-6 rounded-[2.5rem] border border-white/5 shadow-xl backdrop-blur-md grid grid-cols-1 md:grid-cols-5 gap-4 overflow-visible">
                <Dropdown 
                    label="تصفية بالوحدة"
                    icon={Tent} 
                    value={filters.unit} 
                    onChange={(v:any) => setFilters({...filters, unit: v})} 
                    options={[{value: 'ALL', label: 'كل الوحدات'}, ...UNITS_LIST.map(u => ({value: u, label: u}))]} 
                />
                <Dropdown 
                    label="تصفية بالطليعة"
                    icon={Flag} 
                    value={filters.patrol} 
                    onChange={(v:any) => setFilters({...filters, patrol: v})} 
                    options={[{value: 'ALL', label: 'كل الطلائع'}, ...patrols.map(p => ({value: p.name, label: p.name}))]} 
                />
                <Dropdown 
                    label="تصفية بالمستوى"
                    icon={Target} 
                    value={filters.level} 
                    onChange={(v:any) => setFilters({...filters, level: v})} 
                    options={[{value: 'ALL', label: 'كل المستويات'}, ...PROGRESS_LEVELS.map(l => ({value: l.name, label: l.name}))]} 
                />
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-night-400 uppercase mr-2 tracking-widest">نطاق النقاط</label>
                    <div className="flex items-center gap-2 bg-night-950 rounded-xl px-3 py-1.5 border border-white/5 shadow-inner h-[42px]">
                        <input type="number" className="w-full bg-transparent text-white text-[10px] outline-none text-center font-mono" placeholder="من" value={filters.minPoints} onChange={e=>setFilters({...filters, minPoints:Number(e.target.value)})} />
                        <ArrowRightLeft size={10} className="text-night-600 shrink-0"/>
                        <input type="number" className="w-full bg-transparent text-white text-[10px] outline-none text-center font-mono" placeholder="إلى" value={filters.maxPoints} onChange={e=>setFilters({...filters, maxPoints:Number(e.target.value)})} />
                    </div>
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={() => setFilters({unit:'ALL', patrol:'ALL', level:'ALL', minPoints:0, maxPoints:10000})} 
                        className="w-full h-[42px] bg-white/5 hover:bg-white/10 text-night-300 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 border border-white/5"
                    >
                        <RefreshCcw size={14}/> إعادة تعيين
                    </button>
                </div>
            </div>

            {/* List Table (Fixed: overflow-visible to prevent dropdown clipping) */}
            <div className="bg-night-800/40 border border-white/5 rounded-[3rem] shadow-2xl backdrop-blur-sm overflow-visible">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="p-8 text-center w-20">#</th>
                            <th className="p-8">العضو المسجل</th>
                            <th className="p-8">الوحدة / الطليعة</th>
                            <th className="p-8">المستوى الحالي</th>
                            <th className="p-8 text-center">الرتبة</th>
                            <th className="p-8 text-center">مجموع النقاط</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredMembers.map((m, idx) => {
                            const level = getMemberLevel(m.dynamicPoints);
                            return (
                                <tr key={m.id} className="hover:bg-white/5 transition-all group">
                                    <td className="p-6 text-center font-mono text-night-500 text-lg font-black">{idx + 1}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-700 shadow-md group-hover:border-primary-500 transition-all duration-500" alt="" />
                                            <div>
                                                <p className="font-black text-white text-lg leading-none mb-1">{m.fullName}</p>
                                                <p className="text-[10px] text-night-500 font-black uppercase tracking-widest">ID: {m.membershipNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-right">
                                            <p className="text-white font-bold">{m.unit}</p>
                                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest">{m.patrol}</p>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 shadow-sm" style={{ backgroundColor: `${level.color}20`, color: level.color }}>
                                                <level.icon size={14} />
                                            </div>
                                            <span className="text-sm font-black text-white">{level.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="px-3 py-1 rounded-lg text-[10px] font-black border uppercase" style={{ backgroundColor: `${level.color}10`, borderColor: `${level.color}30`, color: level.color }}>
                                            {m.rank || 'كشاف'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-2xl font-black text-white tracking-tighter font-mono">{m.dynamicPoints.toLocaleString()}</span>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredMembers.length === 0 && (
                            <tr><td colSpan={6} className="p-20 text-center text-night-600 font-bold italic opacity-30">لا توجد نتائج مطابقة للتصفية</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- TAB 2: الشارات (Enhanced Edit Page) ---
    const renderBadges = () => (
        <div className="space-y-10 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="bg-gradient-to-r from-night-800 to-night-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-yellow-500/20 text-yellow-500 rounded-[1.8rem] shadow-inner border border-yellow-500/20"><Award size={40}/></div>
                    <div>
                        <h3 className="text-3xl font-black text-white leading-none">إدارة الشارات الكشفية</h3>
                        <p className="text-night-400 mt-2 font-bold opacity-80 uppercase tracking-widest text-sm">أوسمة الاستحقاق وشارات الكفاية والريادة.</p>
                    </div>
                </div>
                <button 
                    onClick={() => { 
                        setEditingBadge({ name: '', description: '', pointsValue: 100, category: 'شارة كفاية', level: 'مبتدئ', iconId: 'award' }); 
                        setShowBadgeModal(true); 
                    }}
                    className="px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[2rem] font-black shadow-2xl shadow-primary-900/40 transition-all flex items-center gap-3 active:scale-95"
                >
                    <Plus size={24}/> تعريف شارة جديدة
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {badges.map(badge => {
                    const IconComp = BADGE_ICONS.find(i => i.id === (badge as any).iconId)?.icon || Award;
                    return (
                        <div key={badge.id} className="bg-night-800/60 border border-white/5 p-8 rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col items-center text-center">
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-yellow-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-24 h-24 bg-night-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                <IconComp size={48} className="text-yellow-500 drop-shadow-glow" />
                            </div>
                            <h4 className="text-xl font-black text-white mb-2">{badge.name}</h4>
                            <div className="flex gap-2 mb-4">
                                <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] font-black text-night-400 border border-white/5 uppercase">{(badge as any).category || 'كفاية'}</span>
                                <span className="bg-primary-600/10 px-2 py-0.5 rounded text-[8px] font-black text-primary-400 border border-primary-500/20 uppercase">{(badge as any).level || 'مبتدئ'}</span>
                            </div>
                            <p className="text-night-400 text-sm font-bold leading-relaxed mb-6 line-clamp-2">{badge.description || 'وصف الشارة ومتطلبات نيلها الكشفية.'}</p>
                            <div className="w-full pt-6 border-t border-white/5 flex justify-between items-center">
                                <div className="flex flex-col items-start">
                                    <span className="text-[8px] text-night-500 font-black uppercase tracking-widest">قيمة النقاط</span>
                                    <span className="text-emerald-400 font-black font-mono text-lg">+{badge.pointsValue}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => { setEditingBadge(badge); setShowBadgeModal(true); }}
                                        className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-xl text-white transition-all shadow-lg"
                                    >
                                        <Edit size={16}/>
                                    </button>
                                    <button className="p-2.5 bg-white/5 hover:bg-rose-600 rounded-xl text-white transition-all shadow-lg"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- IMPROVED BADGE EDIT MODAL WITH ICON PICKER --- */}
            <Modal isOpen={showBadgeModal} onClose={() => setShowBadgeModal(false)} title="تحرير بيانات الشارة التفصيلي" maxWidth="max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column: Form */}
                    <div className="space-y-6 text-right">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">اسم الشارة</label>
                            <input 
                                type="text" 
                                className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-primary-500 outline-none" 
                                value={editingBadge?.name} 
                                onChange={e => setEditingBadge({...editingBadge, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Dropdown 
                                label="تصنيف الشارة"
                                options={['شارة كفاية', 'شارة ريادة', 'وسام استحقاق', 'وسام شرفي']} 
                                value={editingBadge?.category} 
                                onChange={(v: any) => setEditingBadge({...editingBadge, category: v})}
                                icon={Tag}
                            />
                            <Dropdown 
                                label="المستوى المستهدف"
                                options={PROGRESS_LEVELS.map(l => l.name)} 
                                value={editingBadge?.level} 
                                onChange={(v: any) => setEditingBadge({...editingBadge, level: v})}
                                icon={Target}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">قيمة النقاط الممنوحة</label>
                            <input 
                                type="number" 
                                className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-emerald-400 font-black text-xl font-mono focus:border-primary-500 outline-none" 
                                value={editingBadge?.pointsValue} 
                                onChange={e => setEditingBadge({...editingBadge, pointsValue: Number(e.target.value)})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">وصف ومتطلبات الشارة</label>
                            <textarea 
                                className="w-full h-32 bg-night-900 border border-white/10 rounded-2xl p-4 text-white text-sm leading-relaxed resize-none focus:border-primary-500 outline-none font-bold" 
                                value={editingBadge?.description} 
                                onChange={e => setEditingBadge({...editingBadge, description: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Right Column: Icon Picker & Preview */}
                    <div className="space-y-6">
                        <label className="text-xs font-black text-night-400 uppercase tracking-widest text-center block">منتقي الأيقونات الكشفي</label>
                        <div className="bg-night-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-inner">
                            <div className="grid grid-cols-4 gap-3 max-h-[280px] overflow-y-auto custom-scrollbar p-2">
                                {BADGE_ICONS.map(item => (
                                    <button 
                                        key={item.id}
                                        onClick={() => setEditingBadge({...editingBadge, iconId: item.id})}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all border ${
                                            editingBadge.iconId === item.id 
                                            ? 'bg-primary-600 border-primary-400 text-white shadow-lg scale-105' 
                                            : 'bg-night-900 border-white/5 text-night-500 hover:bg-white/5 hover:text-night-300'
                                        }`}
                                        title={item.label}
                                    >
                                        <item.icon size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-primary-600/5 border border-primary-500/10 rounded-[2rem] flex flex-col items-center gap-4 text-center">
                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest">معاينة الشارة</p>
                            <div className="w-20 h-20 bg-night-900 rounded-full flex items-center justify-center shadow-2xl border border-primary-500/20">
                                {React.createElement(BADGE_ICONS.find(i => i.id === editingBadge.iconId)?.icon || Award, {
                                    size: 36,
                                    className: "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                                })}
                            </div>
                            <h5 className="font-black text-white">{editingBadge.name || 'اسم الشارة'}</h5>
                        </div>

                        <button 
                            onClick={() => setShowBadgeModal(false)} 
                            className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Save size={20}/> حفظ بيانات الشارة
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );

    // --- TAB 3: سلم التقدم (Redesigned) ---
    const renderProgressLadder = () => (
        <div className="space-y-10 animate-fade-in font-['Cairo'] text-right pb-10" dir="rtl">
            <div className="bg-night-800/60 p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-4"><TrendingUp className="text-primary-500" size={28}/> هيكلية سلم التقدم الكشفي</h3>
                        <p className="text-night-400 mt-1 font-bold opacity-80 uppercase tracking-widest text-xs">مستويات التطور والنمو الشخصي للفتية والشباب.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-night-900 -translate-y-1/2 hidden md:block"></div>
                    
                    {PROGRESS_LEVELS.map((level, idx) => (
                        <div key={level.id} className="relative flex flex-col items-center gap-4 group z-10">
                            <div className="w-16 h-16 bg-night-900 rounded-2xl border-4 flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ borderColor: level.color }}>
                                <level.icon size={24} style={{ color: level.color }} />
                            </div>
                            <div className="bg-night-900/60 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-xl w-full text-center group-hover:border-primary-500/30 transition-all">
                                <h4 className="text-sm font-black text-white mb-1">{level.name}</h4>
                                <div className="flex flex-col items-center">
                                    <p className="text-[8px] text-night-500 font-black uppercase tracking-widest mb-1">الحد الأدنى</p>
                                    <p className="text-lg font-black font-mono tracking-tighter" style={{ color: level.color }}>{level.minPoints}</p>
                                </div>
                            </div>
                            <div className="absolute top-[-20px] text-white/5 text-4xl font-black font-mono pointer-events-none group-hover:text-white/10 transition-all">{idx + 1}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-night-800/40 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <h4 className="text-lg font-black text-white mb-8 flex items-center gap-3"><Sliders size={20} className="text-primary-500"/> معايير الترقي الحالية</h4>
                    <div className="space-y-4">
                        {/* عرض معايير الانضباط كقراءة فقط هنا لأنها تدار من قسم الانضباط */}
                        <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                 <span className="text-sm font-bold text-white">الالتزام والانضباط (تلقائي)</span>
                             </div>
                             <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">تدار من الانضباط</span>
                        </div>
                        {criteria.map((crit) => (
                            <div key={crit.id} className="bg-night-950/50 p-4 rounded-xl border border-white/5 flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${crit.isActive ? 'bg-primary-500' : 'bg-night-700'}`}></div>
                                    <span className="text-sm font-bold text-white">{crit.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-black font-mono ${crit.points >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {crit.points >= 0 ? '+' : ''}{crit.points} PTS
                                    </span>
                                    <button onClick={() => setIsGlobalSettingsOpen(true)} className="p-1.5 hover:bg-white/5 rounded-lg text-night-600 hover:text-primary-400 transition-all opacity-0 group-hover:opacity-100"><Edit size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-night-800/40 p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col justify-center items-center text-center group">
                    <div className="w-24 h-24 bg-primary-600/10 rounded-full flex items-center justify-center text-primary-500 mb-6 shadow-inner animate-pulse">
                        <Rocket size={40}/>
                    </div>
                    <h4 className="text-xl font-black text-white mb-2">الربط البرمجي الموحد</h4>
                    <p className="text-night-400 text-xs max-w-xs font-bold leading-relaxed">يعتمد الترتيب العام على الربط اللحظي مع قسم الانضباط. أي تسجيل حضور أو غيبة أو عقوبة يؤثر فوراً على الترتيب هنا لضمان الشفافية المطلقة.</p>
                    <div className="mt-8">
                        <span className="px-5 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 flex items-center gap-2 shadow-inner"><ShieldCheck size={14}/> مزامنة الانضباط: مفعلة</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- GLOBAL SETTINGS MODAL (Discipline fields removed to prevent contradiction) ---
    const renderGlobalSettingsModal = () => (
        <Modal 
            isOpen={isGlobalSettingsOpen} 
            onClose={() => setIsGlobalSettingsOpen(false)} 
            title="إعدادات الترتيب والمعايير العامة"
            maxWidth="max-w-3xl"
            footer={
                <button 
                    onClick={() => setIsGlobalSettingsOpen(false)} 
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-black shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                    <Save size={18} /> حفظ كافة الإعدادات
                </button>
            }
        >
            <div className="space-y-8 text-right font-['Cairo']">
                <div className="bg-primary-600/5 p-6 rounded-3xl border border-primary-500/20 flex items-center gap-4">
                    <div className="p-3 bg-primary-600/20 text-primary-400 rounded-2xl"><Settings size={24}/></div>
                    <div>
                        <h4 className="text-lg font-black text-white">إدارة معايير احتساب النقاط</h4>
                        <p className="text-night-400 text-xs font-bold">تحكم في المعايير الإضافية. (ملاحظة: نقاط الحضور والعقوبات يتم ضبطها من قسم الانضباط فقط).</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h5 className="text-sm font-black text-white uppercase tracking-widest">المعايير المبرمجة</h5>
                        <button 
                            onClick={() => setCriteria([...criteria, { id: Date.now().toString(), name: 'معيار جديد', points: 0, isActive: true }])}
                            className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"
                            title="إضافة معيار"
                        >
                            <Plus size={18}/>
                        </button>
                    </div>
                    
                    <div className="grid gap-3">
                        {criteria.map((crit, idx) => (
                            <div key={crit.id} className="bg-night-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4 animate-slide-in shadow-inner">
                                <div className="w-8 h-8 rounded-lg bg-night-800 flex items-center justify-center text-xs font-mono text-night-500">{idx + 1}</div>
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        className="bg-transparent border-none text-white font-bold text-sm w-full focus:ring-0" 
                                        value={crit.name}
                                        onChange={(e) => {
                                            const newC = [...criteria];
                                            newC[idx].name = e.target.value;
                                            setCriteria(newC);
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-3 w-32">
                                    <input 
                                        type="number" 
                                        className={`bg-night-950 border border-white/10 rounded-lg p-2 text-center text-xs font-black w-full outline-none focus:border-primary-500 ${crit.points >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                                        value={crit.points}
                                        onChange={(e) => {
                                            const newC = [...criteria];
                                            newC[idx].points = Number(e.target.value);
                                            setCriteria(newC);
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            const newC = [...criteria];
                                            newC[idx].isActive = !newC[idx].isActive;
                                            setCriteria(newC);
                                        }}
                                        className={`p-2 rounded-xl transition-all ${crit.isActive ? 'bg-emerald-600/20 text-emerald-400' : 'bg-night-700 text-night-500'}`}
                                    >
                                        <CheckCircle2 size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => setCriteria(criteria.filter(c => c.id !== crit.id))}
                                        className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in font-['Cairo'] text-right" dir="rtl">
            {/* Header */}
            <div className="mb-12 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-primary-600/10 text-primary-500 rounded-2xl border border-primary-500/20 shadow-inner">
                        <Medal size={36} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tight">الترتيب والشارات</h2>
                        <p className="text-night-400 text-sm font-bold mt-2 opacity-80 uppercase tracking-widest leading-none">نظام الاستحقاق والتقييم الكشفي المركزي الموحد</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setIsGlobalSettingsOpen(true)}
                    className="group flex items-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-gradient-to-r hover:from-primary-600 hover:to-indigo-600 border border-white/10 hover:border-white/20 rounded-[1.5rem] text-white font-black transition-all duration-500 shadow-2xl backdrop-blur-md active:scale-95"
                >
                    <Settings2 size={20} className="group-hover:rotate-180 transition-transform duration-700 text-primary-400 group-hover:text-white" />
                    <span className="text-xs uppercase tracking-widest">إعدادات عامة شاملة</span>
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex bg-night-800/40 p-2 rounded-[2.2rem] border border-white/10 mb-12 self-start backdrop-blur-xl shadow-2xl ring-1 ring-white/5 overflow-x-auto no-scrollbar max-w-full">
                {[
                    { label: 'الترتيب العام', icon: Trophy },
                    { label: 'الشارات الكشفية', icon: Award },
                    { label: 'سلم التقدم', icon: Target },
                    { label: 'سجل النقاط', icon: History }
                ].map((tab, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveTab(idx)}
                        className={`px-10 py-5 font-black text-sm rounded-[1.8rem] transition-all duration-500 flex items-center gap-3 whitespace-nowrap relative group ${activeTab === idx ? 'bg-primary-600 text-white shadow-2xl shadow-primary-900/40 translate-y-[-2px]' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={20} className={`${activeTab === idx ? 'animate-pulse' : 'opacity-60'}`} />
                        <span>{tab.label}</span>
                        {activeTab === idx && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 pb-20">
                {activeTab === 0 && renderGeneralRanking()}
                {activeTab === 1 && renderBadges()}
                {activeTab === 2 && renderProgressLadder()}
                {activeTab === 3 && (
                    <div className="animate-fade-in bg-night-800/40 rounded-[3rem] border border-white/5 p-20 flex flex-col items-center justify-center text-center opacity-40 grayscale">
                        <History size={80} className="text-night-600 mb-6" />
                        <p className="text-2xl font-black italic">بانتظار تدفق سجلات النقاط من الأقسام الملحقة...</p>
                    </div>
                )}
            </div>

            {renderGlobalSettingsModal()}
        </div>
    );
};

export default Ranking;
