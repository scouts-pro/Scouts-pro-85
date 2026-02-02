import React, { useState, useMemo } from 'react';
import { EquipmentItem, Member, EquipmentStatus, DeliveryType } from '../types';
import { 
    Package, Shirt, AlertTriangle, Search, Plus, Filter, Trash2, CheckCircle2, 
    ArrowRightLeft, Box, LayoutGrid, List, Info, X, ChevronDown, User, 
    PenTool, ScanBarcode, QrCode, MoreVertical, Calendar, 
    ShieldAlert, Check, Warehouse, LayoutDashboard, Share2, Printer, 
    ArrowLeft, ArrowRight, Eye, Ban, AlertOctagon, RefreshCcw, Camera, Settings as SettingsIcon,
    FileText, Activity, AlertCircle, Wrench, Sparkles, Layers, Ruler, Palette, Tag,
    Truck, Clock, FileDown, TrendingUp, BarChart3, PieChart as PieChartIcon, History,
    DollarSign, Shield, Copy
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Legend 
} from 'recharts';

interface EquipmentProps {
    items: EquipmentItem[];
    members?: Member[]; 
    onUpdateEquipment: (items: EquipmentItem[]) => void;
}

// --- CONSTANTS & CONFIG ---
const STATUS_STYLES: Record<string, string> = {
    'متاح': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/10',
    'مسلم': 'bg-blue-500/10 text-blue-400 border-blue-500/20 ring-blue-500/10', 
    'مخصص': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ring-indigo-500/10', 
    'صيانة': 'bg-orange-500/10 text-orange-400 border-orange-500/20 ring-orange-500/10',
    'تالف': 'bg-red-500/10 text-red-400 border-red-500/20 ring-red-500/10',
    'مفقود': 'bg-pink-500/10 text-pink-400 border-pink-500/20 ring-pink-500/10',
    'متلف': 'bg-gray-500/10 text-gray-400 border-gray-500/20 ring-gray-500/10',
};

const UNIFORM_SIZES = [
    { value: 'XS', label: 'XS - صغير جداً' },
    { value: 'S', label: 'S - صغير' },
    { value: 'M', label: 'M - متوسط' },
    { value: 'L', label: 'L - كبير' },
    { value: 'XL', label: 'XL - كبير جداً' },
    { value: 'XXL', label: 'XXL - ضخم' },
    { value: '3XL', label: '3XL - قياس خاص' },
    { value: 'Free', label: 'Free Size - قياس موحد' },
];

const UNIFORM_TYPES = [
    { value: 'Official', label: 'زي رسمي (مراسم)' },
    { value: 'Activity', label: 'زي نشاط (ميداني)' },
    { value: 'Sport', label: 'زي رياضي' },
    { value: 'Accessory', label: 'ملحقات (وشاح/شارة)' },
];

const EQUIPMENT_CATEGORIES = [
    { value: 'Camping', label: 'عتاد التخييم والمبيت' },
    { value: 'Kitchen', label: 'أدوات الطبخ والتغذية' },
    { value: 'Electronics', label: 'إلكترونيات وصوتيات' },
    { value: 'Medical', label: 'عتاد طبي وإسعاف' },
    { value: 'Stationery', label: 'قرطاسية ومكتبية' },
    { value: 'Decoration', label: 'ديكور واحتفالات' },
];

const WAREHOUSE_LOCATIONS = [
    { value: 'المخزن الرئيسي', label: 'المخزن الرئيسي (المقر)' },
    { value: 'مخزن الوحدات', label: 'مخزن الوحدات' },
    { value: 'خزانة القادة', label: 'خزانة القادة' },
    { value: 'مستودع خارجي', label: 'مستودع خارجي' },
];

const TABS = [
    { id: 'WAREHOUSE', label: 'المخزون والأنواع', icon: Warehouse },
    { id: 'INVENTORY', label: 'الجرد والمراقبة', icon: ScanBarcode },
    { id: 'MAINTENANCE', label: 'الصيانة', icon: Wrench },
    { id: 'LOSS_DAMAGE', label: 'التلف والفقدان', icon: AlertTriangle },
    { id: 'REPORTS', label: 'التقارير', icon: FileText },
];

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];

// --- CUSTOM COMPONENTS ---

const Dropdown = ({ options, value, onChange, placeholder, icon: Icon, className, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className}`}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all ${disabled ? 'opacity-50' : ''} ${isOpen ? 'border-primary-500 ring-1 ring-primary-500/50' : ''}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-primary-400" />}
                    <span className={`font-medium truncate ${!value ? 'text-night-400' : 'text-white'}`}>{label || 'اختر...'}</span>
                </div>
                <ChevronDown size={16} className={`text-night-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-2 bg-night-800 border border-white/10 rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in ring-1 ring-black/50">
                        {options.map((opt: any, idx: number) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`p-3.5 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between transition-colors ${val === value ? 'bg-primary-600/10 text-primary-400 font-bold' : ''}`}
                                >
                                    {lbl}
                                    {val === value && <CheckCircle2 size={14} />}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: any; theme: 'purple' | 'orange' | 'emerald' | 'rose' }> = ({ title, value, icon: Icon, theme }) => {
    const configs: any = {
        purple: { text: 'text-purple-400', bg: 'from-purple-500/20 to-blue-600/5', border: 'border-purple-500/20' },
        orange: { text: 'text-orange-400', bg: 'from-orange-500/20 to-red-600/5', border: 'border-orange-500/20' },
        emerald: { text: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-600/5', border: 'border-emerald-500/20' },
        rose: { text: 'text-rose-400', bg: 'from-rose-500/20 to-orange-600/5', border: 'border-rose-500/20' }
    };
    const c = configs[theme];
    
    return (
        <div className={`relative overflow-hidden p-6 rounded-3xl border ${c.border} bg-gradient-to-br ${c.bg} backdrop-blur-xl group hover:-translate-y-1 transition-all duration-300 shadow-lg font-['Cairo']`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${c.text}`}>
                <Icon size={80} />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={`p-3 w-fit rounded-2xl bg-white/5 border border-white/10 mb-4 ${c.text}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-4xl font-black text-white font-mono tracking-tighter">{value}</h3>
                    <p className="text-night-300 text-xs font-bold uppercase tracking-widest mt-1">{title}</p>
                </div>
            </div>
        </div>
    );
};

const TypeCard: React.FC<{ name: string; count: number; available: number; category: 'لباس' | 'عتاد'; onClick: () => void; }> = ({ name, count, available, category, onClick }) => {
    const themeColor = category === 'لباس' ? 'purple' : 'orange';
    const gradient = category === 'لباس' ? 'from-purple-600 to-indigo-600' : 'from-orange-500 to-red-500';
    const percentage = count > 0 ? Math.round((available / count) * 100) : 0;
    
    return (
        <div onClick={onClick} className={`group relative bg-night-800/60 border border-white/5 rounded-[2.5rem] p-1 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 font-['Cairo']`}>
            <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm`}></div>
            <div className="bg-night-900/90 h-full w-full rounded-[2.3rem] p-7 relative overflow-hidden backdrop-blur-md">
                <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${themeColor}-500/10 rounded-full blur-3xl group-hover:bg-${themeColor}-500/20 transition-colors`}></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                            {category === 'لباس' ? <Shirt size={24}/> : <Box size={24}/>}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">{name}</h3>
                            <span className="text-[10px] text-night-400 font-mono tracking-widest uppercase">ID: {Math.floor(Math.random()*1000)}</span>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-3xl font-black text-white">{count}</span>
                            <span className="text-xs text-night-400 mr-2">وحدة</span>
                        </div>
                        <div className="text-left">
                            <span className={`block text-xs font-bold text-${themeColor}-400 mb-1`}>التوفر</span>
                            <span className="text-white font-mono text-sm">{percentage}%</span>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${gradient}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ItemRow: React.FC<{ item: EquipmentItem; member?: Member; onAction: (action: string, item: EquipmentItem) => void; }> = ({ item, member, onAction }) => {
    return (
        <tr className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group font-['Cairo']">
            <td className="p-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-night-900 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-inner group-hover:border-primary-500/50 transition-colors">
                        <QrCode size={20} className="opacity-70"/>
                    </div>
                    <div className="text-right">
                        <p className="font-mono font-bold text-white text-sm tracking-wider">{item.uniqueId}</p>
                        <p className="text-[10px] text-night-400 uppercase font-bold tracking-widest">{item.condition}</p>
                    </div>
                </div>
            </td>
            <td className="p-5">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ring-1 flex w-fit items-center gap-2 ${STATUS_STYLES[item.status] || 'text-white'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'متاح' ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`}></div>
                    {item.status}
                </span>
            </td>
            <td className="p-5">
                {item.assignedTo && member ? (
                    <div className="flex items-center gap-3 bg-white/5 p-2 pr-3 pl-4 rounded-2xl border border-white/5 w-fit">
                        <div className="relative">
                            <img src={member.image} className="w-8 h-8 rounded-full border border-white/10" alt={member.fullName}/>
                            <div className="absolute -bottom-1 -right-1 bg-night-900 rounded-full p-0.5 border border-white/10">
                                <User size={10} className="text-primary-400"/>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-white font-bold">{member.fullName}</p>
                            <p className="text-[10px] text-night-400">{item.deliveryType === 'دائم' ? 'عهدة دائمة' : 'إعارة مؤقتة'}</p>
                        </div>
                    </div>
                ) : (
                    <span className="text-night-400 text-xs flex items-center gap-2 font-bold bg-night-900/50 px-3 py-2 rounded-xl w-fit border border-white/5">
                        <Warehouse size={14}/> {item.location}
                    </span>
                )}
            </td>
            <td className="p-5">
                <div className="flex items-center gap-2">
                    {item.category === 'لباس' && item.size && (
                        <span className="w-8 h-8 flex items-center justify-center bg-night-900 rounded-lg text-xs font-bold text-white border border-white/10 shadow-sm">{item.size}</span>
                    )}
                    {item.color && (
                        <div className="w-8 h-8 rounded-lg border border-white/10 shadow-sm" style={{backgroundColor: item.color}} title="لون القطعة"></div>
                    )}
                    {!item.size && !item.color && <span className="text-night-600 text-xs">-</span>}
                </div>
            </td>
            <td className="p-5 text-center">
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {item.status === 'متاح' && (
                        <button onClick={() => onAction('ASSIGN', item)} className="p-2.5 bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white rounded-xl transition-all hover:scale-110" title="تسليم">
                            <ArrowRightLeft size={18}/>
                        </button>
                    )}
                    {(item.status === 'مسلم' || item.status === 'مخصص') && (
                        <button onClick={() => onAction('RETURN', item)} className="p-2.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all hover:scale-110" title="استرجاع">
                            <RefreshCcw size={18}/>
                        </button>
                    )}
                    <button onClick={() => onAction('REPORT', item)} className="p-2.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all hover:scale-110" title="إبلاغ عن مشكلة">
                        <AlertTriangle size={18}/>
                    </button>
                </div>
            </td>
        </tr>
    );
};

const Equipment: React.FC<EquipmentProps> = ({ items, members = [], onUpdateEquipment }) => {
    const [activeSection, setActiveSection] = useState<'UNIFORMS' | 'EQUIPMENT'>('UNIFORMS');
    const [activeTab, setActiveTab] = useState('WAREHOUSE'); 
    const [viewLevel, setViewLevel] = useState<'TYPES' | 'INSTANCES'>('TYPES');
    const [selectedTypeName, setSelectedTypeName] = useState<string | null>(null);
    
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'ADD_TYPE' | 'ADD_UNITS' | 'ASSIGN' | 'REPORT_ISSUE';
        item?: EquipmentItem;
    }>({ isOpen: false, type: 'ADD_TYPE' });

    const [newTypeData, setNewTypeData] = useState({ 
        name: '', subCategory: '', size: '', color: '#000000', description: '', brand: '', material: '' 
    });
    const [newUnitsData, setNewUnitsData] = useState({ quantity: 1, location: 'المخزن الرئيسي', condition: 'جديد' });
    const [assignData, setAssignData] = useState({ memberId: '', deliveryType: 'دائم' as DeliveryType, returnDate: '' });
    
    const sectionItems = useMemo(() => items.filter(i => 
        activeSection === 'UNIFORMS' ? i.category === 'لباس' : i.category === 'عتاد'
    ), [items, activeSection]);

    const stats = useMemo(() => ({
        total: items.length,
        available: items.filter(i => i.status === 'متاح').length,
        assigned: items.filter(i => i.status === 'مسلم' || i.status === 'مخصص').length,
        maintenance: items.filter(i => i.status === 'صيانة').length,
        damaged: items.filter(i => i.status === 'تالف' || i.status === 'متلف').length,
        lost: items.filter(i => i.status === 'مفقود').length,
    }), [items]);

    const typeGroups = useMemo(() => {
        const groups: Record<string, EquipmentItem[]> = {};
        sectionItems.forEach(item => {
            if (!groups[item.name]) groups[item.name] = [];
            groups[item.name].push(item);
        });
        return groups;
    }, [sectionItems]);

    const currentTypeInstances = useMemo(() => selectedTypeName ? (typeGroups[selectedTypeName] || []) : [], [selectedTypeName, typeGroups]);

    const generateUniqueID = (category: string) => {
        const prefix = category === 'لباس' ? 'UNI' : 'EQ';
        return `${prefix}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
    };

    const handleCreateType = () => {
        if (!newTypeData.name) return;
        const newItem: EquipmentItem = {
            id: Date.now().toString(),
            uniqueId: generateUniqueID(activeSection === 'UNIFORMS' ? 'لباس' : 'عتاد'),
            name: newTypeData.name,
            category: activeSection === 'UNIFORMS' ? 'لباس' : 'عتاد',
            subCategory: newTypeData.subCategory,
            status: 'متاح',
            condition: 'جديد',
            location: 'المخزن الرئيسي',
            size: newTypeData.size,
            color: newTypeData.color,
            description: newTypeData.description,
            purchaseDate: new Date().toISOString().split('T')[0]
        };
        onUpdateEquipment([...items, newItem]);
        setModalConfig({ ...modalConfig, isOpen: false });
        setNewTypeData({ name: '', subCategory: '', size: '', color: '#000000', description: '', brand: '', material: '' });
    };

    const handleAddUnits = () => {
        if (!selectedTypeName || newUnitsData.quantity < 1) return;
        const template = typeGroups[selectedTypeName][0];
        const newItems: EquipmentItem[] = [];
        for (let i = 0; i < newUnitsData.quantity; i++) {
            newItems.push({
                ...template,
                id: `${Date.now()}-${i}`,
                uniqueId: generateUniqueID(template.category),
                status: 'متاح',
                assignedTo: undefined,
                deliveryType: undefined,
                location: newUnitsData.location,
                condition: newUnitsData.condition as any,
                purchaseDate: new Date().toISOString().split('T')[0]
            });
        }
        onUpdateEquipment([...items, ...newItems]);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleAssign = () => {
        if (!modalConfig.item || !assignData.memberId) return;
        const updatedItems = items.map(i => i.id === modalConfig.item?.id ? {
            ...i, status: 'مسلم' as EquipmentStatus, assignedTo: assignData.memberId,
            deliveryType: assignData.deliveryType, assignmentDate: new Date().toISOString().split('T')[0],
            returnDate: assignData.deliveryType === 'مؤقت' ? assignData.returnDate : undefined
        } : i);
        onUpdateEquipment(updatedItems);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleReturn = (item: EquipmentItem) => {
        if (window.confirm(`هل تؤكد استرجاع ${item.name} للمخزن؟`)) {
            const updatedItems = items.map(i => i.id === item.id ? { ...i, status: 'متاح' as EquipmentStatus, assignedTo: undefined, deliveryType: undefined, returnDate: undefined } : i);
            onUpdateEquipment(updatedItems);
        }
    };

    const handleReportIssue = (item: EquipmentItem, status: EquipmentStatus) => {
        const updatedItems = items.map(i => i.id === item.id ? { ...i, status, assignedTo: undefined } : i);
        onUpdateEquipment(updatedItems);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const openActionModal = (action: string, item: EquipmentItem) => {
        if (action === 'ASSIGN') {
            setAssignData({ memberId: '', deliveryType: 'دائم', returnDate: '' });
            setModalConfig({ isOpen: true, type: 'ASSIGN', item });
        } else if (action === 'RETURN') handleReturn(item);
        else if (action === 'REPORT') setModalConfig({ isOpen: true, type: 'REPORT_ISSUE', item });
    };

    const renderInventoryTab = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo']" dir="rtl">
            <div className="bg-gradient-to-r from-night-800 to-night-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex-1 space-y-4 text-right">
                        <h3 className="text-3xl font-black text-white flex items-center gap-3 justify-start"><ScanBarcode className="text-emerald-500" size={32}/> نظام الجرد والتحقق الذكي</h3>
                        <p className="text-night-400 leading-relaxed max-w-2xl font-bold">إدارة جلسات الجرد الدوري لمطابقة المخزون الفعلي مع السجلات الرقمية.</p>
                        <div className="flex gap-4 pt-4 justify-start">
                            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center"><span className="block text-night-500 text-[10px] font-black uppercase mb-1 tracking-widest">آخر جرد ناجح</span><span className="text-white font-bold">01/11/2024</span></div>
                            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center"><span className="block text-night-500 text-[10px] font-black uppercase mb-1 tracking-widest">نسبة دقة البيانات</span><span className="text-emerald-400 font-bold">98.5%</span></div>
                        </div>
                    </div>
                    <button className="px-10 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-900/40 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-3 group">
                        <ScanBarcode size={48} className="group-hover:rotate-12 transition-transform"/>
                        <span>فتح جلسة جرد شاملة</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderLossDamageTab = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo']" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="إجمالي الفواقد" value={stats.lost + stats.damaged} icon={AlertTriangle} theme="rose" />
                <StatCard title="القيمة المالية التقديرية" value="12,500 دج" icon={DollarSign} theme="orange" />
                <StatCard title="بانتظار قرار الإتلاف" value={stats.damaged} icon={Trash2} theme="purple" />
            </div>
            <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 bg-night-900/50 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3"><div className="p-3 bg-rose-500/10 rounded-xl text-rose-500"><AlertTriangle size={24}/></div><h4 className="text-2xl font-black text-white">سجل التلف والفقدان والمحاسبة</h4></div>
                    <button className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"><Plus size={18}/> تقرير حالة جديدة</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-white/5 text-night-300 text-[10px] font-black uppercase tracking-widest">
                            <tr><th className="p-6">العنصر المتضرر</th><th className="p-6">نوع الحالة</th><th className="p-6">تاريخ الحادثة</th><th className="p-6">قرار القيادة</th><th className="p-6 text-center">إجراء</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {items.filter(i => ['تالف', 'مفقود', 'متلف'].includes(i.status)).map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 flex items-center gap-4"><div className="w-10 h-10 bg-night-900 rounded-xl flex items-center justify-center border border-white/5"><Box size={18} className="opacity-50"/></div><div className="text-right"><p className="text-white font-bold">{item.name}</p><p className="text-[10px] text-night-500 font-mono tracking-widest">{item.uniqueId}</p></div></td>
                                    <td className="p-6"><span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${item.status === 'مفقود' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{item.status}</span></td>
                                    <td className="p-6 text-night-400 font-bold font-mono">20/11/2024</td>
                                    <td className="p-6"><span className="text-xs text-night-500 italic">قيد التحقيق الإداري</span></td>
                                    <td className="p-6 text-center"><button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-night-500 hover:text-white"><MoreVertical size={18}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderReportsTab = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo']" dir="rtl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-night-800/40 p-8 rounded-[3rem] border border-white/5 shadow-xl min-h-[450px] flex flex-col">
                    <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3 justify-start">توزع الأصول حسب الحالة التشغيلية <TrendingUp size={20} className="text-primary-400"/></h4>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{ name: 'متاح', value: stats.available }, { name: 'مسلم', value: stats.assigned }, { name: 'صيانة', value: stats.maintenance }, { name: 'تالف', value: stats.damaged }]} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={8} stroke="none">
                                    {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '15px', border: 'none'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSpecialView = () => {
        if (activeTab === 'INVENTORY') return renderInventoryTab();
        if (activeTab === 'LOSS_DAMAGE') return renderLossDamageTab();
        if (activeTab === 'REPORTS') return renderReportsTab();
        if (activeTab === 'MAINTENANCE') {
            const maintenanceItems = items.filter(i => i.status === 'صيانة');
            return (
                <div className="animate-fade-in bg-night-800/40 rounded-[2.5rem] border border-white/5 p-12 text-center min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden font-['Cairo']" dir="rtl">
                    <Wrench size={80} className="mb-6 text-orange-400 opacity-20" />
                    <h3 className="text-3xl font-black text-white mb-2">ورشة الصيانة</h3>
                    <p className="text-night-400 mb-10 max-w-md mx-auto font-bold">إدارة القطع التي تتطلب إصلاحاً.</p>
                    {maintenanceItems.length > 0 ? (
                        <div className="grid gap-4 w-full max-w-2xl">
                            {maintenanceItems.map(item => (
                                <div key={item.id} className="bg-night-900/80 p-5 rounded-2xl flex justify-between items-center border border-white/5 hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-4"><div className="p-3 bg-orange-500/10 rounded-xl text-orange-400"><AlertCircle size={20}/></div><span className="text-white font-bold text-lg">{item.name} <span className="text-night-500 text-sm font-mono">({item.uniqueId})</span></span></div>
                                    <button onClick={() => handleReportIssue(item, 'متاح')} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-bold shadow-lg">إتمام الصيانة</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-night-400 font-bold">لا توجد قطع في الصيانة حالياً</div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-8 h-full flex flex-col font-['Cairo'] relative overflow-y-auto no-scrollbar bg-night-950">
            {/* Elegant Section Title */}
            <div className="mb-10">
                <h2 className="text-3xl font-black text-white flex items-center gap-4 justify-start">
                    <div className="p-3 bg-primary-600/10 text-primary-500 rounded-2xl border border-primary-500/20 shadow-inner">
                        <Package size={32} />
                    </div>
                    <div>
                        <span className="block leading-none">إدارة العتاد واللباس</span>
                        <p className="text-night-400 text-sm font-bold mt-2 opacity-80 uppercase tracking-widest">تتبع المخزون، العهدة الشخصية، وجدولة الصيانة المركزية</p>
                    </div>
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
                <StatCard title="إجمالي القطع" value={stats.total} icon={Package} theme={activeSection === 'UNIFORMS' ? 'purple' : 'orange'} />
                <StatCard title="متوفر بالمخزن" value={stats.available} icon={CheckCircle2} theme="emerald" />
                <StatCard title="قيد الاستخدام" value={stats.assigned} icon={User} theme="purple" />
                <StatCard title="في الصيانة" value={stats.maintenance} icon={Wrench} theme="orange" />
                <StatCard title="تالف / متلف" value={stats.damaged} icon={Ban} theme="rose" />
                <StatCard title="مفقودات" value={stats.lost} icon={AlertOctagon} theme="rose" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-white/5 p-3 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl" dir="rtl">
                <div className="flex bg-night-900 rounded-[1.5rem] p-1.5 border border-white/5 relative">
                    <button onClick={() => { setActiveSection('UNIFORMS'); setViewLevel('TYPES'); }} className={`relative z-10 px-8 py-3 rounded-[1.2rem] font-black text-sm transition-all flex items-center gap-3 ${activeSection === 'UNIFORMS' ? 'text-white' : 'text-night-400'}`}><Shirt size={20}/> اللباس الكشفي</button>
                    <button onClick={() => { setActiveSection('EQUIPMENT'); setViewLevel('TYPES'); }} className={`relative z-10 px-8 py-3 rounded-[1.2rem] font-black text-sm transition-all flex items-center gap-3 ${activeSection === 'EQUIPMENT' ? 'text-white' : 'text-night-400'}`}><Box size={20}/> العتاد والتجهيزات</button>
                    <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[1.2rem] transition-all duration-500 shadow-lg ${activeSection === 'UNIFORMS' ? 'bg-gradient-to-l from-purple-600 to-indigo-600 right-1.5' : 'bg-gradient-to-l from-orange-500 to-red-600 right-[calc(50%+3px)]'}`}></div>
                </div>
                <div className="flex gap-4">
                    {viewLevel === 'INSTANCES' && <button onClick={() => setViewLevel('TYPES')} className="bg-white/10 text-white px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-2 font-bold"><ArrowRight size={20}/> عودة</button>}
                    <button onClick={() => setModalConfig({ isOpen: true, type: viewLevel === 'TYPES' ? 'ADD_TYPE' : 'ADD_UNITS' })} className={`bg-gradient-to-r ${activeSection === 'UNIFORMS' ? 'from-purple-600 to-indigo-600' : 'from-orange-500 to-red-600'} hover:opacity-90 text-white px-8 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 transition-all`}><Plus size={22}/> {viewLevel === 'TYPES' ? 'تعريف نوع جديد' : 'إضافة للمخزون'}</button>
                </div>
            </div>
            <div className="flex justify-center mb-10" dir="rtl">
                <div className="flex bg-night-900/80 p-1.5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setViewLevel('TYPES'); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all duration-300 ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-night-400 hover:text-white'}`}><tab.icon size={18} /> {tab.label}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 pb-20">
                {activeTab === 'WAREHOUSE' ? (
                    viewLevel === 'TYPES' ? (
                        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" dir="rtl">
                            {Object.keys(typeGroups).map(name => {
                                const group = typeGroups[name];
                                const available = group.filter(i => i.status === 'متاح').length;
                                return <TypeCard key={name} name={name} count={group.length} available={available} category={activeSection === 'UNIFORMS' ? 'لباس' : 'عتاد'} onClick={() => { setSelectedTypeName(name); setViewLevel('INSTANCES'); }} />;
                            })}
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-8 font-['Cairo']" dir="rtl">
                            <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <table className="w-full text-right">
                                    <thead className="bg-white/5 text-night-300 text-xs font-black uppercase tracking-widest">
                                        <tr><th className="p-6">التعريف</th><th className="p-6">الحالة</th><th className="p-6">الموقع / العهدة</th><th className="p-6 text-center">إجراء</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {currentTypeInstances.map(item => <ItemRow key={item.id} item={item} member={members?.find(m => m.id === item.assignedTo)} onAction={openActionModal} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : renderSpecialView()}
            </div>
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-['Cairo']" dir="rtl">
                    <div className="bg-night-800 w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col relative overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar">
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-l ${activeSection === 'UNIFORMS' ? 'from-purple-500 to-indigo-500' : 'from-orange-500 to-red-500'}`}></div>
                        {modalConfig.type === 'ADD_TYPE' && (
                            <div className="text-right">
                                <div className="text-center mb-8"><h3 className="text-3xl font-black text-white mb-2">تعريف جديد</h3></div>
                                <div className="space-y-6">
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">اسم النوع</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white outline-none" value={newTypeData.name} onChange={e => setNewTypeData({...newTypeData, name: e.target.value})} /></div>
                                </div>
                                <div className="flex gap-4 mt-10">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black">إلغاء</button>
                                    <button onClick={handleCreateType} className={`flex-1 py-4 text-white rounded-2xl font-black bg-gradient-to-r ${activeSection === 'UNIFORMS' ? 'from-purple-600 to-indigo-600' : 'from-orange-600 to-red-600'}`}>حفظ</button>
                                </div>
                            </div>
                        )}
                        {(modalConfig.type === 'ASSIGN' || modalConfig.type === 'REPORT_ISSUE') && (
                             <div className="text-right">
                                <div className="text-center mb-8"><h3 className="text-2xl font-black text-white mb-2">{modalConfig.type === 'ASSIGN' ? 'تسليم عهدة' : 'تقرير حالة'}</h3><p className="text-primary-400 font-black">{modalConfig.item?.name}</p></div>
                                {modalConfig.type === 'ASSIGN' ? (
                                    <div className="space-y-6">
                                        <Dropdown options={(members || []).map(m => ({value: m.id, label: m.fullName}))} value={assignData.memberId} onChange={(val: any) => setAssignData({...assignData, memberId: val})} placeholder="ابحث عن العضو..." icon={User} label="اختر المستلم" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <button onClick={() => setAssignData({...assignData, deliveryType: 'دائم'})} className={`p-5 rounded-2xl font-black border transition-all ${assignData.deliveryType === 'دائم' ? 'bg-purple-600 text-white' : 'bg-night-900 border-white/10 text-night-400'}`}>تسليم دائم</button>
                                            <button onClick={() => setAssignData({...assignData, deliveryType: 'مؤقت'})} className={`p-5 rounded-2xl font-black border transition-all ${assignData.deliveryType === 'مؤقت' ? 'bg-orange-600 text-white' : 'bg-night-900 border-white/10 text-night-400'}`}>إعارة مؤقتة</button>
                                        </div>
                                        {assignData.deliveryType === 'مؤقت' && (
                                            <div className="space-y-2 animate-fade-in"><label className="text-sm font-bold text-night-300">تاريخ الإرجاع المتوقع</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" value={assignData.returnDate} onChange={e => setAssignData({...assignData, returnDate: e.target.value})} /></div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <button onClick={() => handleReportIssue(modalConfig.item!, 'تالف')} className="w-full p-5 rounded-2xl bg-night-900 border border-white/10 text-white font-black text-right flex justify-between items-center group"><span>تسجيل تلف</span><Wrench size={20}/></button>
                                        <button onClick={() => handleReportIssue(modalConfig.item!, 'مفقود')} className="w-full p-5 rounded-2xl bg-night-900 border border-white/10 text-white font-black text-right flex justify-between items-center group"><span>تسجيل فقدان</span><AlertOctagon size={20}/></button>
                                    </div>
                                )}
                                <div className="flex gap-4 mt-10">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black">إلغاء</button>
                                    {modalConfig.type === 'ASSIGN' && <button onClick={handleAssign} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black">تأكيد العملية</button>}
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equipment;