
import React, { useState, useMemo } from 'react';
import { EquipmentItem, Member, EquipmentStatus, DeliveryType } from '../types';
import { 
    Package, Shirt, AlertTriangle, Search, Plus, Filter, Trash2, CheckCircle2, 
    ArrowRightLeft, Box, LayoutGrid, List, Info, X, ChevronDown, User, 
    PenTool, ScanBarcode, QrCode, MoreVertical, Calendar, 
    ShieldAlert, Check, Warehouse, LayoutDashboard, Share2, Printer, 
    ArrowLeft, Eye, Ban, AlertOctagon, RefreshCcw, Camera, Settings,
    FileText, Activity, AlertCircle, Wrench, Sparkles, Layers, Ruler, Palette, Tag,
    Truck, Clock
} from 'lucide-react';

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

// --- CUSTOM COMPONENTS ---

// 1. Elegant Dropdown
const Dropdown = ({ options, value, onChange, placeholder, icon: Icon, className, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className}`}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-night-900/50 border border-white/10 rounded-2xl px-4 py-4 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all shadow-inner backdrop-blur-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isOpen ? 'border-primary-500 ring-1 ring-primary-500/50' : ''}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-primary-400" />}
                    <span className={`font-medium truncate ${!value ? 'text-night-400' : 'text-white'}`}>{label || 'اختر...'}</span>
                </div>
                <ChevronDown size={16} className={`text-night-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
                                    {val === value && <CheckCircle2 size={16} />}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

// 2. Stat Card
interface StatCardProps {
    title: string;
    value: number;
    icon: any;
    theme: 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, theme }) => {
    const colorClass = theme === 'purple' ? 'text-purple-400' : 'text-orange-400';
    const bgClass = theme === 'purple' ? 'from-purple-500/20 to-blue-600/5' : 'from-orange-500/20 to-red-600/5';
    const borderClass = theme === 'purple' ? 'border-purple-500/20' : 'border-orange-500/20';
    
    return (
        <div className={`relative overflow-hidden p-6 rounded-3xl border ${borderClass} bg-gradient-to-br ${bgClass} backdrop-blur-xl group hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
                <Icon size={80} />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={`p-3 w-fit rounded-2xl bg-white/5 border border-white/10 mb-4 ${colorClass}`}>
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

// 3. Type Card
interface TypeCardProps {
    name: string;
    count: number;
    available: number;
    category: 'لباس' | 'عتاد';
    onClick: () => void;
}

const TypeCard: React.FC<TypeCardProps> = ({ name, count, available, category, onClick }) => {
    const themeColor = category === 'لباس' ? 'purple' : 'orange';
    const gradient = category === 'لباس' ? 'from-purple-600 to-indigo-600' : 'from-orange-500 to-red-500';
    const percentage = count > 0 ? Math.round((available / count) * 100) : 0;
    
    return (
        <div 
            onClick={onClick}
            className={`group relative bg-night-800/60 border border-white/5 rounded-[2.5rem] p-1 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-${themeColor}-900/20 hover:-translate-y-2`}
        >
            {/* Gradient Border Effect */}
            <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm`}></div>
            
            <div className="bg-night-900/90 h-full w-full rounded-[2.3rem] p-7 relative overflow-hidden backdrop-blur-md">
                {/* Background Decoration */}
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
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${gradient}`} 
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. Item Row
interface ItemRowProps {
    item: EquipmentItem;
    member?: Member;
    onAction: (action: string, item: EquipmentItem) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, member, onAction }) => {
    return (
        <tr className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
            <td className="p-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-night-900 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-inner group-hover:border-primary-500/50 transition-colors">
                        <QrCode size={20} className="opacity-70"/>
                    </div>
                    <div>
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
                        <div>
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
    // --- STATE ---
    const [activeSection, setActiveSection] = useState<'UNIFORMS' | 'EQUIPMENT'>('UNIFORMS');
    const [activeTab, setActiveTab] = useState('WAREHOUSE'); 
    const [viewLevel, setViewLevel] = useState<'TYPES' | 'INSTANCES'>('TYPES');
    const [selectedTypeName, setSelectedTypeName] = useState<string | null>(null);
    const [inventoryMode, setInventoryMode] = useState(false);
    
    // Modals
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'ADD_TYPE' | 'ADD_UNITS' | 'ASSIGN' | 'REPORT_ISSUE' | 'SCANNER';
        item?: EquipmentItem;
    }>({ isOpen: false, type: 'ADD_TYPE' });

    // Forms
    const [newTypeData, setNewTypeData] = useState({ 
        name: '', subCategory: '', size: '', color: '#000000', description: '',
        brand: '', material: '' // Visual fields that will be merged into description
    });
    const [newUnitsData, setNewUnitsData] = useState({ quantity: 1, location: 'المخزن الرئيسي', condition: 'جديد' });
    const [assignData, setAssignData] = useState({ memberId: '', deliveryType: 'دائم' as DeliveryType, returnDate: '' });
    
    // --- DERIVED DATA ---
    const sectionItems = useMemo(() => items.filter(i => 
        activeSection === 'UNIFORMS' ? i.category === 'لباس' : i.category === 'عتاد'
    ), [items, activeSection]);

    // Stats
    const stats = useMemo(() => {
        return {
            total: items.length,
            available: items.filter(i => i.status === 'متاح').length,
            assigned: items.filter(i => i.status === 'مسلم' || i.status === 'مخصص').length,
            maintenance: items.filter(i => i.status === 'صيانة').length,
            damaged: items.filter(i => i.status === 'تالف' || i.status === 'متلف').length,
            lost: items.filter(i => i.status === 'مفقود').length,
        };
    }, [items]);

    // Group items
    const typeGroups = useMemo(() => {
        const groups: Record<string, EquipmentItem[]> = {};
        sectionItems.forEach(item => {
            if (!groups[item.name]) groups[item.name] = [];
            groups[item.name].push(item);
        });
        return groups;
    }, [sectionItems]);

    const currentTypeInstances = useMemo(() => 
        selectedTypeName ? (typeGroups[selectedTypeName] || []) : []
    , [selectedTypeName, typeGroups]);

    // --- ACTIONS ---
    const generateUniqueID = (category: string) => {
        const prefix = category === 'لباس' ? 'UNI' : 'EQ';
        return `${prefix}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
    };

    const handleCreateType = () => {
        if (!newTypeData.name) return;
        
        // Combine detailed fields into description for storage/compatibility
        let finalDesc = newTypeData.description;
        if(newTypeData.brand) finalDesc += ` | الماركة: ${newTypeData.brand}`;
        if(newTypeData.material) finalDesc += ` | المادة: ${newTypeData.material}`;

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
            description: finalDesc,
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
        const updatedItems = items.map(i => {
            if (i.id === modalConfig.item?.id) {
                return {
                    ...i,
                    status: 'مسلم' as EquipmentStatus, 
                    assignedTo: assignData.memberId,
                    deliveryType: assignData.deliveryType,
                    assignmentDate: new Date().toISOString().split('T')[0],
                    returnDate: assignData.deliveryType === 'مؤقت' ? assignData.returnDate : undefined
                };
            }
            return i;
        });
        onUpdateEquipment(updatedItems);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleReturn = (item: EquipmentItem) => {
        if (window.confirm(`هل تؤكد استرجاع ${item.name} (${item.uniqueId}) للمخزن؟`)) {
            const updatedItems = items.map(i => i.id === item.id ? { 
                ...i, status: 'متاح' as EquipmentStatus, assignedTo: undefined, deliveryType: undefined, returnDate: undefined
            } : i);
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
        } else if (action === 'RETURN') {
            handleReturn(item);
        } else if (action === 'REPORT') {
            setModalConfig({ isOpen: true, type: 'REPORT_ISSUE', item });
        }
    };

    // --- RENDERERS ---

    const renderDashboard = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
            <StatCard title="إجمالي القطع" value={stats.total} icon={Package} theme={activeSection === 'UNIFORMS' ? 'purple' : 'orange'} />
            <StatCard title="متوفر بالمخزن" value={stats.available} icon={CheckCircle2} theme={activeSection === 'UNIFORMS' ? 'purple' : 'orange'} />
            <StatCard title="قيد الاستخدام" value={stats.assigned} icon={User} theme={activeSection === 'UNIFORMS' ? 'purple' : 'orange'} />
            <StatCard title="في الصيانة" value={stats.maintenance} icon={Wrench} theme={activeSection === 'UNIFORMS' ? 'purple' : 'orange'} />
            <StatCard title="تالف / متلف" value={stats.damaged} icon={Ban} theme={activeSection === 'UNIFORMS' ? 'purple' : 'orange'} />
            <StatCard title="مفقودات" value={stats.lost} icon={AlertOctagon} theme={activeSection === 'UNIFORMS' ? 'purple' : 'orange'} />
        </div>
    );

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-white/5 p-3 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
            {/* Section Switcher (Pill Style) */}
            <div className="flex bg-night-900 rounded-[1.5rem] p-1.5 border border-white/5 relative">
                <button 
                    onClick={() => { setActiveSection('UNIFORMS'); setViewLevel('TYPES'); }}
                    className={`relative z-10 px-8 py-3 rounded-[1.2rem] font-bold text-sm transition-all flex items-center gap-3 ${activeSection === 'UNIFORMS' ? 'text-white' : 'text-night-400 hover:text-white'}`}
                >
                    <Shirt size={20}/> اللباس الكشفي
                </button>
                <button 
                    onClick={() => { setActiveSection('EQUIPMENT'); setViewLevel('TYPES'); }}
                    className={`relative z-10 px-8 py-3 rounded-[1.2rem] font-bold text-sm transition-all flex items-center gap-3 ${activeSection === 'EQUIPMENT' ? 'text-white' : 'text-night-400 hover:text-white'}`}
                >
                    <Box size={20}/> العتاد والتجهيزات
                </button>
                
                {/* Sliding Background Pill */}
                <div 
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[1.2rem] transition-all duration-500 ease-out shadow-lg ${activeSection === 'UNIFORMS' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 left-1.5' : 'bg-gradient-to-r from-orange-500 to-red-600 left-[calc(50%+3px)]'}`}
                ></div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 pr-2">
                {viewLevel === 'INSTANCES' && (
                    <button onClick={() => setViewLevel('TYPES')} className="bg-white/10 text-white px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2 font-bold backdrop-blur-md">
                        <ArrowLeft size={20} className="rtl:rotate-180"/> عودة
                    </button>
                )}
                
                {viewLevel === 'TYPES' ? (
                    <button onClick={() => setModalConfig({ isOpen: true, type: 'ADD_TYPE' })} className={`bg-gradient-to-r ${activeSection === 'UNIFORMS' ? 'from-purple-600 to-indigo-600' : 'from-orange-500 to-red-600'} hover:opacity-90 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-black/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95`}>
                        <Plus size={22}/> تعريف نوع جديد
                    </button>
                ) : (
                    <button onClick={() => setModalConfig({ isOpen: true, type: 'ADD_UNITS' })} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-black/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                        <Plus size={22}/> إضافة للمخزون
                    </button>
                )}
            </div>
        </div>
    );

    // VIEW: TYPES GRID
    const renderTypesGrid = () => (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Object.keys(typeGroups).map(name => {
                    const group = typeGroups[name];
                    const available = group.filter(i => i.status === 'متاح').length;
                    return (
                        <TypeCard 
                            key={name}
                            name={name}
                            count={group.length}
                            available={available}
                            category={activeSection === 'UNIFORMS' ? 'لباس' : 'عتاد'}
                            onClick={() => { setSelectedTypeName(name); setViewLevel('INSTANCES'); }}
                        />
                    );
                })}
                
                {/* Add New Placeholder - Styled Elegantly */}
                <button 
                    onClick={() => setModalConfig({ isOpen: true, type: 'ADD_TYPE' })}
                    className="border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-night-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all min-h-[260px] group gap-4"
                >
                    <div className="w-20 h-20 bg-night-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                        <Plus size={40} className="opacity-50 group-hover:opacity-100"/>
                    </div>
                    <span className="font-bold text-lg tracking-wide">تعريف نوع جديد</span>
                </button>
            </div>
        </div>
    );

    // VIEW: INSTANCES LIST
    const renderInstancesList = () => (
        <div className="animate-fade-in space-y-8">
            {/* Context Header */}
            <div className="bg-night-800/60 p-8 rounded-[2.5rem] border border-white/10 flex justify-between items-center shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l ${activeSection === 'UNIFORMS' ? 'from-purple-900/20' : 'from-orange-900/20'} to-transparent`}></div>
                <div className="relative z-10">
                    <h3 className="text-4xl font-black text-white mb-2">{selectedTypeName}</h3>
                    <div className="flex gap-4 text-sm text-night-300 font-bold items-center">
                        <span className="bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/5"><Box size={16}/> إجمالي: {currentTypeInstances.length}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-emerald-500/20"><CheckCircle2 size={16}/> متاح: {currentTypeInstances.filter(i => i.status === 'متاح').length}</span>
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button className="p-4 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20" title="طباعة الكل"><Printer size={24}/></button>
                </div>
            </div>

            {/* The List */}
            <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full text-right">
                    <thead className="bg-white/5 text-night-300 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-6">التعريف</th>
                            <th className="p-6">الحالة</th>
                            <th className="p-6">الموقع / العهدة</th>
                            <th className="p-6">المواصفات</th>
                            <th className="p-6 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {currentTypeInstances.map(item => (
                            <ItemRow 
                                key={item.id} 
                                item={item} 
                                member={members.find(m => m.id === item.assignedTo)}
                                onAction={openActionModal}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // TAB SWITCHER - Floating Design
    const renderTabs = () => (
        <div className="flex justify-center mb-10">
            <div className="flex bg-night-900/80 p-1.5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setViewLevel('TYPES'); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                            activeTab === tab.id 
                            ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                            : 'text-night-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? (activeSection === 'UNIFORMS' ? 'text-purple-400' : 'text-orange-400') : ''} /> 
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );

    // SPECIAL VIEWS (Simplified for visual consistency)
    const renderSpecialView = () => {
        const titleClass = activeSection === 'UNIFORMS' ? 'text-purple-400' : 'text-orange-400';
        
        if (activeTab === 'MAINTENANCE') {
            const maintenanceItems = items.filter(i => i.status === 'صيانة');
            return (
                <div className="animate-fade-in bg-night-800/40 rounded-[2.5rem] border border-white/5 p-12 text-center min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${activeSection === 'UNIFORMS' ? 'purple' : 'orange'}-500 to-transparent opacity-50`}></div>
                    <Wrench size={80} className={`mb-6 ${titleClass} opacity-20`} />
                    <h3 className="text-3xl font-black text-white mb-2">سجل الصيانة</h3>
                    <p className="text-night-400 mb-10 max-w-md mx-auto">إدارة القطع التي تتطلب إصلاحاً أو تنظيفاً. يمكن تحديث حالتها مباشرة من هنا.</p>
                    {maintenanceItems.length > 0 ? (
                        <div className="grid gap-4 w-full max-w-2xl">
                            {maintenanceItems.map(item => (
                                <div key={item.id} className="bg-night-900/80 p-5 rounded-2xl flex justify-between items-center border border-white/5 hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400"><AlertCircle size={20}/></div>
                                        <span className="text-white font-bold text-lg">{item.name} <span className="text-night-500 text-sm font-mono">({item.uniqueId})</span></span>
                                    </div>
                                    <button onClick={() => handleReportIssue(item, 'متاح')} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-bold shadow-lg transition-all transform group-hover:scale-105">إتمام الصيانة</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-night-400">
                            <CheckCircle2 size={40} className="mx-auto mb-2 text-emerald-500 opacity-50"/>
                            لا توجد قطع في الصيانة حالياً
                        </div>
                    )}
                </div>
            );
        }
        // ... (Other tabs follow similar simplified logic with improved UI)
        return (
            <div className="animate-fade-in bg-night-800/40 rounded-[2.5rem] border border-white/5 p-12 text-center min-h-[500px] flex flex-col items-center justify-center">
               <Layers size={80} className="mb-6 text-night-700" />
               <h3 className="text-2xl font-bold text-white mb-2">هذا القسم قيد التطوير البصري</h3>
               <p className="text-night-400">سيتم تفعيل هذه الواجهة قريباً بتصميم متناسق.</p>
            </div>
        );
    };

    return (
        <div className="p-8 h-full flex flex-col font-sans relative overflow-y-auto custom-scrollbar bg-night-900 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            {/* Background Atmosphere */}
            <div className={`fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-gradient-to-b ${activeSection === 'UNIFORMS' ? 'from-purple-900/40' : 'from-orange-900/40'} to-transparent -z-10 transition-colors duration-1000`}></div>
            
            {renderDashboard()}
            {renderHeader()}
            {renderTabs()}
            
            <div className="flex-1 pb-20">
                {activeTab === 'WAREHOUSE' ? (
                    viewLevel === 'TYPES' ? renderTypesGrid() : renderInstancesList()
                ) : (
                    renderSpecialView()
                )}
            </div>

            {/* --- MODALS (Enhanced Dark Glass) --- */}
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                    <div className={`bg-night-800 w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col relative overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar`}>
                        {/* Modal Header Glow */}
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${activeSection === 'UNIFORMS' ? 'from-purple-500 to-indigo-500' : 'from-orange-500 to-red-500'}`}></div>
                        
                        {/* Generic Modal Content based on Type */}
                        {modalConfig.type === 'ADD_TYPE' && (
                            <>
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-black text-white mb-2">تعريف {activeSection === 'UNIFORMS' ? 'لباس' : 'عتاد'} جديد</h3>
                                    <p className="text-night-400">يرجى إدخال التفاصيل الدقيقة للتصنيف.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    {/* 1. Basic Info */}
                                    <div className="bg-night-900/30 p-6 rounded-3xl border border-white/5 space-y-4">
                                        <h4 className="text-sm font-bold text-night-300 uppercase tracking-widest border-b border-white/5 pb-2 mb-2 flex items-center gap-2"><Tag size={16}/> المعلومات الأساسية</h4>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-night-300">اسم النوع (المنتج)</label>
                                            <input type="text" className="w-full bg-night-900/50 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-bold transition-all" placeholder="مثال: قميص كشفي، خيمة هرمية..." value={newTypeData.name} onChange={e => setNewTypeData({...newTypeData, name: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-night-300">التصنيف الفرعي</label>
                                                <Dropdown 
                                                    options={activeSection === 'UNIFORMS' ? UNIFORM_TYPES : EQUIPMENT_CATEGORIES} 
                                                    value={newTypeData.subCategory} 
                                                    onChange={(val: any) => setNewTypeData({...newTypeData, subCategory: val})}
                                                    placeholder="اختر التصنيف..."
                                                    icon={Layers}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-night-300">الماركة / الشركة (اختياري)</label>
                                                <input type="text" className="w-full bg-night-900/50 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none" placeholder="مثال: Quechua" value={newTypeData.brand} onChange={e => setNewTypeData({...newTypeData, brand: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Specs */}
                                    <div className="bg-night-900/30 p-6 rounded-3xl border border-white/5 space-y-4">
                                        <h4 className="text-sm font-bold text-night-300 uppercase tracking-widest border-b border-white/5 pb-2 mb-2 flex items-center gap-2"><Ruler size={16}/> المواصفات والمقاييس</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {activeSection === 'UNIFORMS' && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-night-300">المقاس (Size)</label>
                                                    <Dropdown 
                                                        options={UNIFORM_SIZES} 
                                                        value={newTypeData.size} 
                                                        onChange={(val: any) => setNewTypeData({...newTypeData, size: val})}
                                                        placeholder="اختر المقاس..."
                                                        icon={Ruler}
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-night-300">اللون المميز</label>
                                                <div className="flex gap-2 items-center bg-night-900/50 border border-white/10 rounded-2xl p-2">
                                                    <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none" value={newTypeData.color} onChange={e => setNewTypeData({...newTypeData, color: e.target.value})} />
                                                    <span className="text-sm text-night-400 font-mono">{newTypeData.color}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-bold text-night-300">خامة الصنع / المادة</label>
                                                <input type="text" className="w-full bg-night-900/50 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none" placeholder="مثال: قطن 100%، بوليستر، حديد..." value={newTypeData.material} onChange={e => setNewTypeData({...newTypeData, material: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Notes */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-night-300">وصف إضافي / ملاحظات</label>
                                        <textarea className="w-full bg-night-900/50 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none h-24 resize-none" value={newTypeData.description} onChange={e => setNewTypeData({...newTypeData, description: e.target.value})} />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-colors">إلغاء</button>
                                    <button onClick={handleCreateType} className={`flex-1 py-4 text-white rounded-2xl font-bold shadow-lg transition-all hover:scale-105 bg-gradient-to-r ${activeSection === 'UNIFORMS' ? 'from-purple-600 to-indigo-600' : 'from-orange-600 to-red-600'}`}>حفظ البطاقة</button>
                                </div>
                            </>
                        )}

                        {/* Reuse existing logic for other modals but wrapped in this new container style */}
                        {modalConfig.type === 'ADD_UNITS' && (
                             <>
                                <h3 className="text-xl font-black text-white mb-2 text-center">إضافة وحدات</h3>
                                <p className="text-center text-primary-400 mb-8 font-bold">{selectedTypeName}</p>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-night-300">الكمية</label>
                                        <input type="number" min="1" className="w-full bg-night-900/50 border border-white/10 rounded-2xl p-4 text-white text-center text-2xl font-mono font-bold focus:border-emerald-500 outline-none" value={newUnitsData.quantity} onChange={e => setNewUnitsData({...newUnitsData, quantity: Number(e.target.value)})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-night-300">مكان التخزين</label>
                                        <Dropdown 
                                            options={WAREHOUSE_LOCATIONS}
                                            value={newUnitsData.location}
                                            onChange={(val: any) => setNewUnitsData({...newUnitsData, location: val})}
                                            icon={Warehouse}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-colors">إلغاء</button>
                                    <button onClick={handleAddUnits} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg transition-all hover:scale-105">تأكيد الإضافة</button>
                                </div>
                             </>
                        )}

                        {/* Assign and Report modals logic remains same, just styling updated implicitly by container */}
                        {(modalConfig.type === 'ASSIGN' || modalConfig.type === 'REPORT_ISSUE') && (
                             <>
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-black text-white mb-2">{modalConfig.type === 'ASSIGN' ? 'تسليم عهدة' : 'تقرير حالة'}</h3>
                                    <p className="text-night-400">{modalConfig.item?.name}</p>
                                </div>
                                {modalConfig.type === 'ASSIGN' ? (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-night-300">اختر العضو</label>
                                            <Dropdown 
                                                options={members.map(m => ({value: m.id, label: m.fullName}))} 
                                                value={assignData.memberId}
                                                onChange={(val: any) => setAssignData({...assignData, memberId: val})}
                                                placeholder="ابحث عن العضو..."
                                                icon={User}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button onClick={() => setAssignData({...assignData, deliveryType: 'دائم'})} className={`p-4 rounded-2xl font-bold border transition-all ${assignData.deliveryType === 'دائم' ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-night-900 border-white/10 text-night-400'}`}>تخصيص دائم</button>
                                            <button onClick={() => setAssignData({...assignData, deliveryType: 'مؤقت'})} className={`p-4 rounded-2xl font-bold border transition-all ${assignData.deliveryType === 'مؤقت' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-night-900 border-white/10 text-night-400'}`}>إعارة مؤقتة</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <button onClick={() => handleReportIssue(modalConfig.item!, 'تالف')} className="w-full p-4 rounded-2xl bg-night-900 border border-white/10 hover:border-red-500/50 hover:bg-red-900/20 text-white font-bold transition-all text-right flex justify-between"><span>تسجيل تلف</span><Wrench size={18}/></button>
                                        <button onClick={() => handleReportIssue(modalConfig.item!, 'مفقود')} className="w-full p-4 rounded-2xl bg-night-900 border border-white/10 hover:border-pink-500/50 hover:bg-pink-900/20 text-white font-bold transition-all text-right flex justify-between"><span>تسجيل فقدان</span><AlertOctagon size={18}/></button>
                                        <button onClick={() => handleReportIssue(modalConfig.item!, 'متلف')} className="w-full p-4 rounded-2xl bg-night-900 border border-white/10 hover:border-gray-500/50 hover:bg-gray-800 text-white font-bold transition-all text-right flex justify-between"><span>إتلاف نهائي</span><Trash2 size={18}/></button>
                                    </div>
                                )}
                                <div className="mt-8">
                                    {modalConfig.type === 'ASSIGN' ? (
                                        <div className="flex gap-4">
                                            <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 rounded-2xl text-white font-bold">إلغاء</button>
                                            <button onClick={handleAssign} className="flex-1 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-lg">تأكيد</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold">إلغاء</button>
                                    )}
                                </div>
                             </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equipment;
