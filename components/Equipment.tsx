
import React, { useState, useMemo } from 'react';
import { EquipmentItem, Member, EquipmentStatus, DeliveryType, Event, EquipmentLog } from '../types';
import { 
    Package, Shirt, AlertTriangle, Search, Plus, Filter, Trash2, CheckCircle2, 
    ArrowRightLeft, Box, LayoutGrid, List, Info, X, ChevronDown, User, 
    PenTool, ScanBarcode, QrCode, MoreVertical, Calendar, 
    ShieldAlert, Check, Warehouse, LayoutDashboard, Share2, Printer, 
    ArrowLeft, ArrowRight, Eye, Ban, AlertOctagon, RefreshCcw, Camera, Settings as SettingsIcon,
    FileText, Activity, AlertCircle, Wrench, Sparkles, Layers, Ruler, Palette, Tag,
    Truck, Clock, FileDown, TrendingUp, BarChart3, PieChart as PieChartIcon, History,
    DollarSign, Shield, Copy, Upload, Edit, ClipboardCheck, CornerDownLeft, Siren, Timer,
    ScrollText, CheckSquare, ArrowUpDown, ChevronUp, Coins, Gavel, FileSpreadsheet,
    MessageSquare, ChevronRight, Scale, Calculator, UserCheck, Gem
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Legend 
} from 'recharts';
import QRCode from "react-qr-code";

interface EquipmentProps {
    items: EquipmentItem[];
    members?: Member[]; 
    events?: Event[];
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
    'متوسطة': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 ring-yellow-500/10',
    'رديئة': 'bg-rose-800/10 text-rose-600 border-rose-800/20 ring-rose-800/10',
    'مقبولة': 'bg-teal-500/10 text-teal-400 border-teal-500/20 ring-teal-500/10',
};

const LOG_ROW_STYLES: Record<string, string> = {
    'تسليم': 'bg-blue-900/10 hover:bg-blue-900/20 border-l-4 border-l-blue-500',
    'إرجاع': 'bg-emerald-900/10 hover:bg-emerald-900/20 border-l-4 border-l-emerald-500',
    'تالف': 'bg-red-900/10 hover:bg-red-900/20 border-l-4 border-l-red-500',
    'صيانة': 'bg-orange-900/10 hover:bg-orange-900/20 border-l-4 border-l-orange-500',
    'مفقود': 'bg-pink-900/10 hover:bg-pink-900/20 border-l-4 border-l-pink-500',
    'إضافة': 'bg-gray-900/10 hover:bg-gray-900/20 border-l-4 border-l-gray-500',
};

const MEASUREMENT_TYPES = [
    { value: 'SIZE', label: 'مقاس قياسي (XS, S, M, L...)' },
    { value: 'NUMBER', label: 'الارقام (مقاس بالحذاء، قياس رقمي)' },
    { value: 'LENGTH', label: 'الطول (سم/متر)' },
    { value: 'WEIGHT', label: 'الوزن (غرام/كغ)' },
    { value: 'CAPACITY', label: 'السعات (لتر/مل)' },
    { value: 'FREE', label: 'قياس موحد (Free Size)' },
];

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

const ITEM_CONDITIONS = [
    'جديد', 'ممتازة', 'جيدة', 'مقبولة', 'متوسطة', 'رديئة', 'تحتاج صيانة', 'تالف'
];

const SUBCATEGORY_SUGGESTIONS = [
    'خيام', 'معدات طبخ', 'أثاث', 'إلكترونيات', 'أدوات يدوية', 'حبال', 'إضاءة', 
    'حقائب', 'أعلام ورايات', 'لوازم طبية', 'أدوات مكتبية', 'أخرى'
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
    { id: 'LOGS', label: 'سجل العمليات', icon: History },
];

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];

// --- CUSTOM COMPONENTS ---

const Dropdown = ({ options, value, onChange, placeholder, icon: Icon, className, disabled, label }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const displayLabel = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className} z-50`}>
            {label && <label className="text-xs text-primary-200/80 font-bold block uppercase tracking-wider mb-2">{label}</label>}
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all ${disabled ? 'opacity-50' : ''} ${isOpen ? 'border-primary-500 ring-1 ring-primary-500/50' : ''}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-primary-400" />}
                    <span className={`font-medium truncate ${!value ? 'text-night-400' : 'text-white'}`}>{displayLabel || 'اختر...'}</span>
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

const TypeCard: React.FC<{ name: string; count: number; available: number; category: 'لباس' | 'عتاد'; onClick: () => void; onDelete: () => void; }> = ({ name, count, available, category, onClick, onDelete }) => {
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
                    <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 bg-white/5 hover:bg-rose-600 rounded-xl text-night-400 hover:text-white transition-all shadow-lg"><Trash2 size={16}/></button>
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

const ItemRow: React.FC<{ item: EquipmentItem; member?: Member; event?: Event; onAction: (action: string, item: EquipmentItem) => void; onClick: () => void; }> = ({ item, member, event, onAction, onClick }) => {
    const isPriorityHigh = item.returnPriority === 'عالية/حرجة';
    const isPriorityMedium = item.returnPriority === 'متوسطة';
    
    // Determine displayed size/measurement
    let displaySize = item.size;
    if (item.measurementType && item.measurementValue) {
        if(item.measurementType === 'LENGTH') displaySize = `${item.measurementValue} cm`;
        else if(item.measurementType === 'WEIGHT') displaySize = `${item.measurementValue} kg`;
        else if(item.measurementType === 'CAPACITY') displaySize = `${item.measurementValue} L`;
        else if(item.measurementType === 'NUMBER') displaySize = `#${item.measurementValue}`;
    }

    return (
        <tr onClick={onClick} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group font-['Cairo'] relative cursor-pointer">
            <td className="p-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-night-900 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-inner group-hover:border-primary-500/50 transition-colors overflow-hidden relative">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} className="w-full h-full object-cover"/>
                        ) : (
                            <div className="p-1 bg-white w-full h-full flex items-center justify-center">
                                <QRCode 
                                    value={item.uniqueId}
                                    size={40}
                                    level="L"
                                    fgColor="#0f172a"
                                    bgColor="#FFFFFF"
                                />
                            </div>
                        )}
                        {isPriorityHigh && <div className="absolute inset-0 border-2 border-rose-500 rounded-2xl animate-pulse"></div>}
                        {isPriorityMedium && <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl"></div>}
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            <p className="font-mono font-bold text-white text-sm tracking-wider">{item.uniqueId}</p>
                            {/* PRIORITY BADGE */}
                            {isPriorityHigh && <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg shadow-rose-900/50 flex items-center gap-1"><Siren size={10}/> عاجل</span>}
                            {isPriorityMedium && <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black px-2 py-0.5 rounded">متوسط</span>}
                        </div>
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
                            {event ? (
                                <p className="text-[10px] text-primary-400 font-bold truncate max-w-[120px]">{event.title}</p>
                            ) : (
                                <p className="text-[10px] text-night-400">{item.deliveryType === 'دائم' ? 'عهدة دائمة' : 'إعارة مؤقتة'}</p>
                            )}
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
                    {displaySize && (
                        <span className="w-auto px-2 h-8 flex items-center justify-center bg-night-900 rounded-lg text-xs font-bold text-white border border-white/10 shadow-sm">{displaySize}</span>
                    )}
                    {item.color && (
                        <div className="w-8 h-8 rounded-lg border border-white/10 shadow-sm" style={{backgroundColor: item.color}} title="لون القطعة"></div>
                    )}
                    {item.price && <span className="text-emerald-400 font-mono text-xs font-bold">{item.price} دج</span>}
                    {!displaySize && !item.color && !item.price && <span className="text-night-600 text-xs">-</span>}
                </div>
            </td>
            <td className="p-5 text-center">
                <div className="flex items-center justify-center gap-2 opacity-100 transition-all duration-300">
                    {item.status === 'متاح' && (
                        <button onClick={(e) => { e.stopPropagation(); onAction('ASSIGN', item); }} className="p-2.5 bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white rounded-xl transition-all hover:scale-110 shadow-lg" title="تسليم">
                            <ArrowRightLeft size={18}/>
                        </button>
                    )}
                    {(item.status === 'مسلم' || item.status === 'مخصص') && (
                        <button onClick={(e) => { e.stopPropagation(); onAction('RETURN', item); }} className="p-2.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all hover:scale-110 shadow-lg" title="استرجاع">
                            <RefreshCcw size={18}/>
                        </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onAction('EDIT', item); }} className="p-2.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all hover:scale-110 shadow-lg" title="تعديل">
                        <Edit size={18}/>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onAction('REPORT', item); }} className="p-2.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all hover:scale-110 shadow-lg" title="إبلاغ عن مشكلة">
                        <AlertTriangle size={18}/>
                    </button>
                </div>
            </td>
        </tr>
    );
};

const Equipment: React.FC<EquipmentProps> = ({ items, members = [], events = [], onUpdateEquipment }) => {
    const [activeSection, setActiveSection] = useState<'UNIFORMS' | 'EQUIPMENT'>('UNIFORMS');
    const [activeTab, setActiveTab] = useState('WAREHOUSE'); 
    const [viewLevel, setViewLevel] = useState<'TYPES' | 'INSTANCES'>('TYPES');
    const [selectedTypeName, setSelectedTypeName] = useState<string | null>(null);
    const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([
        {id: 'log1', transactionId: 'trans_1', itemId: 'eq-1', itemName: 'زي كشفي رسمي', category: 'لباس', action: 'تسليم', date: '2024-11-22', time: '14:30', memberName: 'كشاف 1', condition: 'جديد', eventTitle: 'نشاط الجمعة', assignmentResponsible: 'القائد محمد', returnResponsible: ''},
    ]);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [viewItemModal, setViewItemModal] = useState<{isOpen: boolean; item: EquipmentItem | null}>({isOpen: false, item: null});
    
    // --- Filters & Sort States ---
    const [isWarehouseFilterOpen, setIsWarehouseFilterOpen] = useState(false);
    const [warehouseFilters, setWarehouseFilters] = useState({ category: 'ALL', status: 'ALL' });
    const [warehouseSort, setWarehouseSort] = useState<{key: string, direction: 'asc' | 'desc'}>({ key: 'name', direction: 'asc' });

    // --- Instance Filters (New) ---
    const [isInstanceFilterOpen, setIsInstanceFilterOpen] = useState(false);
    const [instanceFilters, setInstanceFilters] = useState({ status: 'ALL', location: 'ALL' });
    const [instanceSort, setInstanceSort] = useState<{key: string, direction: 'asc' | 'desc'}>({ key: 'id', direction: 'asc' });

    const [isLossFilterOpen, setIsLossFilterOpen] = useState(false);
    const [lossFilters, setLossFilters] = useState({ type: 'ALL', responsible: '' });
    const [lossSort, setLossSort] = useState<{key: string, direction: 'asc' | 'desc'}>({ key: 'date', direction: 'desc' });

    // --- Modal Config ---
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'ADD_TYPE' | 'ADD_UNITS' | 'ASSIGN' | 'RETURN' | 'REPORT_ISSUE' | 'EDIT_ITEM' | 'REPORT_CASE' | 'LOG_DETAILS' | 'FINE_DECISION';
        item?: EquipmentItem;
        log?: EquipmentLog;
    }>({ isOpen: false, type: 'ADD_TYPE' });

    // --- New Report Issue Tab State ---
    const [reportIssueTab, setReportIssueTab] = useState<'MAINTENANCE' | null>(null);

    // Enhanced State for New Type
    const [newTypeData, setNewTypeData] = useState({ 
        name: '', subCategory: '', size: '', color: '#000000', description: '', 
        brand: '', supplier: '', price: 0, material: '', imageUrl: '', returnPriority: 'عادية',
        measurementType: 'SIZE', measurementValue: ''
    });
    
    const [newUnitsData, setNewUnitsData] = useState({ quantity: 1, location: 'المخزن الرئيسي', condition: 'جديد', purchaseDate: new Date().toISOString().split('T')[0] });
    
    // Assign State
    const [assignData, setAssignData] = useState({ 
        memberId: '', deliveryType: 'دائم' as DeliveryType, returnDate: '', eventId: '', linkToEvent: false,
        issuer: '', condition: 'ممتازة', size: '', volume: '', returnPriority: 'عادية'
    });

    // Return State
    const [returnData, setReturnData] = useState({ condition: 'ممتازة', notes: '', location: 'المخزن الرئيسي', responsible: '' });

    // Case Report State (Loss/Damage)
    const [caseReport, setCaseReport] = useState({ type: 'تالف', itemId: '', date: new Date().toISOString().split('T')[0], responsible: '', description: '', decision: 'قيد التحقيق' });
    
    // Fine/Decision State
    const [fineData, setFineData] = useState({ decision: 'PENDING' as 'PENDING' | 'FINE' | 'EXEMPT' | 'RETRIEVED', amount: 0, treasury: 'خزينة الفوج' });

    // Maintenance State
    const [maintenanceData, setMaintenanceData] = useState({ type: '', description: '' });

    const leaders = useMemo(() => members.filter(m => m.role === 'قائد').map(m => ({value: m.fullName, label: m.fullName})), [members]);

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
        totalValue: items.reduce((sum, i) => sum + (i.price || 0), 0)
    }), [items]);

    const typeGroups = useMemo(() => {
        const groups: Record<string, EquipmentItem[]> = {};
        // Filtering
        const filtered = sectionItems.filter(item => {
            if (warehouseFilters.category !== 'ALL' && item.subCategory !== warehouseFilters.category) return false; 
            if (warehouseFilters.status !== 'ALL' && item.status !== warehouseFilters.status) return false;
            return true;
        });

        // Sorting
        const sorted = [...filtered].sort((a, b) => {
            if (warehouseSort.key === 'name') {
                return warehouseSort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            return 0;
        });

        sorted.forEach(item => {
            if (!groups[item.name]) groups[item.name] = [];
            groups[item.name].push(item);
        });
        return groups;
    }, [sectionItems, warehouseFilters, warehouseSort]);

    const currentTypeInstances = useMemo(() => {
        if (!selectedTypeName) return [];
        let instances = typeGroups[selectedTypeName] || [];
        
        // Instance Filtering
        instances = instances.filter(item => {
            if (instanceFilters.status !== 'ALL' && item.status !== instanceFilters.status) return false;
            if (instanceFilters.location !== 'ALL' && item.location !== instanceFilters.location) return false;
            return true;
        });

        // Instance Sorting
        return instances.sort((a, b) => {
            if (instanceSort.key === 'id') return instanceSort.direction === 'asc' ? a.uniqueId.localeCompare(b.uniqueId) : b.uniqueId.localeCompare(a.uniqueId);
            // Add more sort keys as needed
            return 0;
        });
    }, [selectedTypeName, typeGroups, instanceFilters, instanceSort]);

    const generateUniqueID = (category: string) => {
        const prefix = category === 'لباس' ? 'UNI' : 'EQ';
        return `${prefix}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
    };

    // --- Actions ---

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
            size: newTypeData.measurementType === 'SIZE' ? newTypeData.measurementValue : undefined,
            measurementType: newTypeData.measurementType,
            measurementValue: newTypeData.measurementValue,
            color: newTypeData.color,
            description: newTypeData.description,
            brand: newTypeData.brand,
            supplier: newTypeData.supplier,
            price: newTypeData.price,
            imageUrl: newTypeData.imageUrl,
            returnPriority: newTypeData.returnPriority as any,
            purchaseDate: new Date().toISOString().split('T')[0]
        };
        onUpdateEquipment([...items, newItem]);
        setEquipmentLogs(prev => [{
            id: `log_${Date.now()}`, itemId: newItem.id, itemName: newItem.name, category: newItem.category, action: 'إضافة', 
            date: new Date().toISOString().split('T')[0], 
            time: new Date().toLocaleTimeString('ar-DZ', {hour: '2-digit', minute:'2-digit'}),
            condition: 'جديد', transactionId: `trans_add_${Date.now()}`
        }, ...prev]);
        setModalConfig({ ...modalConfig, isOpen: false });
        setNewTypeData({ 
            name: '', subCategory: '', size: '', color: '#000000', description: '', 
            brand: '', supplier: '', price: 0, material: '', imageUrl: '', returnPriority: 'عادية',
            measurementType: 'SIZE', measurementValue: ''
        });
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
                purchaseDate: newUnitsData.purchaseDate
            });
        }
        onUpdateEquipment([...items, ...newItems]);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleAssign = () => {
        if (!modalConfig.item || !assignData.memberId) return;
        const member = members.find(m => m.id === assignData.memberId);
        const event = assignData.linkToEvent ? events.find(e => e.id === assignData.eventId) : undefined;
        const transactionId = `trans_${Date.now()}`;

        const updatedItems = items.map(i => i.id === modalConfig.item?.id ? {
            ...i, 
            status: 'مسلم' as EquipmentStatus, 
            assignedTo: assignData.memberId,
            deliveryType: assignData.deliveryType, 
            assignmentDate: new Date().toISOString().split('T')[0],
            returnDate: assignData.deliveryType === 'مؤقت' ? assignData.returnDate : undefined,
            eventId: assignData.linkToEvent ? assignData.eventId : undefined,
            issuedBy: assignData.issuer,
            condition: assignData.condition as any,
            assignmentCondition: assignData.condition, // Store condition at assignment
            returnPriority: assignData.returnPriority as any,
            activeTransactionId: transactionId,
            size: assignData.size || i.size
        } : i);
        
        setEquipmentLogs(prev => [{
            id: `log_${Date.now()}`,
            transactionId: transactionId,
            itemId: modalConfig.item!.id,
            itemName: modalConfig.item!.name,
            category: modalConfig.item!.category,
            action: 'تسليم',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('ar-DZ', {hour: '2-digit', minute:'2-digit'}),
            memberId: assignData.memberId,
            memberName: member?.fullName,
            eventId: assignData.eventId,
            eventTitle: event?.title,
            condition: assignData.condition,
            assignmentResponsible: assignData.issuer // Log responsible
        }, ...prev]);

        onUpdateEquipment(updatedItems);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleReturnClick = (item: EquipmentItem) => {
        setReturnData({ condition: 'ممتازة', notes: '', location: 'المخزن الرئيسي', responsible: '' });
        setModalConfig({ isOpen: true, type: 'RETURN', item });
    };

    const executeReturn = () => {
        if (!modalConfig.item) return;
        const member = members.find(m => m.id === modalConfig.item!.assignedTo);
        const event = events.find(e => e.id === modalConfig.item!.eventId);
        const transactionId = modalConfig.item.activeTransactionId;

        const updatedItems = items.map(i => i.id === modalConfig.item!.id ? { 
            ...i, 
            status: 'متاح' as EquipmentStatus, 
            assignedTo: undefined, 
            deliveryType: undefined, 
            returnDate: undefined,
            eventId: undefined,
            activeTransactionId: undefined, // Clear active transaction
            condition: returnData.condition === 'ممتازة' ? i.condition : returnData.condition as any,
            location: returnData.location,
            returnResponsible: returnData.responsible, // Update last return responsible
            assignmentCondition: undefined // Clear assignment snapshot
        } : i);

        setEquipmentLogs(prev => [{
            id: `log_ret_${Date.now()}`,
            transactionId: transactionId, // Link to assignment transaction
            itemId: modalConfig.item!.id,
            itemName: modalConfig.item!.name,
            category: modalConfig.item!.category,
            action: 'إرجاع',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('ar-DZ', {hour: '2-digit', minute:'2-digit'}),
            memberId: member?.id,
            memberName: member?.fullName,
            eventId: event?.id,
            eventTitle: event?.title,
            condition: returnData.condition,
            notes: returnData.notes,
            returnResponsible: returnData.responsible // Log return responsible
        }, ...prev]);

        onUpdateEquipment(updatedItems);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleReportIssue = (item: EquipmentItem, status: EquipmentStatus) => {
        const transactionId = item.activeTransactionId;
        const updatedItems = items.map(i => i.id === item.id ? { 
            ...i, 
            status, 
            assignedTo: undefined, 
            activeTransactionId: undefined,
            maintenanceType: status === 'صيانة' ? maintenanceData.type : undefined,
            maintenanceDesc: status === 'صيانة' ? maintenanceData.description : undefined
        } : i);
        setEquipmentLogs(prev => [{
            id: `log_iss_${Date.now()}`, 
            transactionId: transactionId,
            itemId: item.id, 
            itemName: item.name, 
            category: item.category, 
            action: status === 'صيانة' ? 'صيانة' : 'إتلاف', 
            date: new Date().toISOString().split('T')[0], 
            time: new Date().toLocaleTimeString('ar-DZ', {hour: '2-digit', minute:'2-digit'}),
            condition: status,
            notes: status === 'صيانة' ? `${maintenanceData.type}: ${maintenanceData.description}` : undefined
        }, ...prev]);
        onUpdateEquipment(updatedItems);
        setModalConfig({ ...modalConfig, isOpen: false });
        setMaintenanceData({type:'', description:''});
    };

    const handleConfirmFineDecision = () => {
        if(!modalConfig.item) return;
        
        let newStatus: EquipmentStatus = modalConfig.item.status as EquipmentStatus;
        let newFineAmount = modalConfig.item.fineAmount;
        let newFineDecision = fineData.decision;
        let logAction: 'إتلاف' | 'إرجاع' = 'إتلاف';
        let logNotes = '';

        if (fineData.decision === 'RETRIEVED') {
            newStatus = 'متاح';
            newFineAmount = 0;
            logAction = 'إرجاع'; // Or a specific 'RECOVERED' status if logs support it, sticking to defined log types for now or general 'إرجاع'
            logNotes = 'تم استرجاع القطعة من حالة التلف/الفقدان';
        } else {
            newFineAmount = fineData.decision === 'FINE' ? fineData.amount : 0;
        }

        const updatedItems = items.map(i => i.id === modalConfig.item!.id ? {
            ...i,
            status: newStatus,
            fineDecision: newFineDecision,
            fineAmount: newFineAmount,
            fineTreasury: fineData.decision === 'FINE' ? fineData.treasury : undefined
        } : i);

        setEquipmentLogs(prev => [{
            id: `log_fine_${Date.now()}`,
            itemId: modalConfig.item!.id,
            itemName: modalConfig.item!.name,
            category: modalConfig.item!.category,
            action: logAction,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('ar-DZ', {hour: '2-digit', minute:'2-digit'}),
            condition: newStatus,
            notes: logNotes || `قرار إداري: ${fineData.decision === 'FINE' ? `غرامة ${fineData.amount}` : 'إعفاء'}`
        }, ...prev]);

        onUpdateEquipment(updatedItems);
        setModalConfig({...modalConfig, isOpen: false});
        setFineData({ decision: 'PENDING', amount: 0, treasury: 'خزينة الفوج' });
    };

    const handleDeleteType = (typeName: string) => {
        if(window.confirm('هل أنت متأكد من حذف هذا النوع وكل الوحدات المرتبطة به؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            const updatedItems = items.filter(i => i.name !== typeName);
            onUpdateEquipment(updatedItems);
        }
    };

    const handleEditItem = () => {
        if (!modalConfig.item) return;
        const updatedItems = items.map(i => i.id === modalConfig.item?.id ? { ...i, ...modalConfig.item } : i);
        onUpdateEquipment(updatedItems);
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleSaveCaseReport = () => {
        if (!caseReport.itemId) return;
        const item = items.find(i => i.id === caseReport.itemId);
        if (item) {
            const transactionId = item.activeTransactionId;
            const updatedItems = items.map(i => i.id === item.id ? { ...i, status: caseReport.type as EquipmentStatus, assignedTo: undefined, activeTransactionId: undefined } : i);
            setEquipmentLogs(prev => [{
                id: `log_case_${Date.now()}`, 
                transactionId: transactionId,
                itemId: item.id, 
                itemName: item.name, 
                category: item.category, 
                action: 'إتلاف', // Generalizing for loss/damage
                date: caseReport.date, 
                time: new Date().toLocaleTimeString('ar-DZ', {hour: '2-digit', minute:'2-digit'}),
                condition: caseReport.type,
                notes: `المسؤول: ${caseReport.responsible}. التفاصيل: ${caseReport.description}`
            }, ...prev]);
            onUpdateEquipment(updatedItems);
        }
        setModalConfig({ ...modalConfig, isOpen: false });
        setCaseReport({ type: 'تالف', itemId: '', date: new Date().toISOString().split('T')[0], responsible: '', description: '', decision: 'قيد التحقيق' });
    };

    const openActionModal = (action: string, item: EquipmentItem) => {
        if (action === 'ASSIGN') {
            setAssignData({ 
                memberId: '', deliveryType: 'دائم', returnDate: '', eventId: '', linkToEvent: false,
                issuer: '', condition: item.condition, size: item.size || '', volume: '', returnPriority: item.returnPriority || 'عادية'
            });
            setModalConfig({ isOpen: true, type: 'ASSIGN', item });
        } else if (action === 'RETURN') {
            handleReturnClick(item);
        } else if (action === 'REPORT') {
            setReportIssueTab(null);
            setModalConfig({ isOpen: true, type: 'REPORT_ISSUE', item });
        }
        else if (action === 'EDIT') setModalConfig({ isOpen: true, type: 'EDIT_ITEM', item });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewTypeData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleItemClick = (item: EquipmentItem) => {
        setViewItemModal({ isOpen: true, item: item });
    };

    // --- Renderers ---

    const renderInventoryTab = () => (
        <div className="animate-fade-in space-y-8 font-['Cairo']" dir="rtl">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-night-800 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center shadow-lg">
                    <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-2xl mb-3"><CheckSquare size={24}/></div>
                    <span className="text-[10px] text-night-500 font-black uppercase tracking-widest">مطابق للسجل</span>
                    <h3 className="text-2xl font-black text-white">{stats.available + stats.assigned}</h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center shadow-lg">
                    <div className="p-3 bg-rose-600/10 text-rose-400 rounded-2xl mb-3"><AlertTriangle size={24}/></div>
                    <span className="text-[10px] text-night-500 font-black uppercase tracking-widest">عجز / مفقود</span>
                    <h3 className="text-2xl font-black text-white">{stats.lost}</h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center shadow-lg">
                    <div className="p-3 bg-blue-600/10 text-blue-400 rounded-2xl mb-3"><ScanBarcode size={24}/></div>
                    <span className="text-[10px] text-night-500 font-black uppercase tracking-widest">جلسات الجرد</span>
                    <h3 className="text-2xl font-black text-white">4</h3>
                </div>
                <div className="bg-night-800 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center shadow-lg">
                    <div className="p-3 bg-amber-600/10 text-amber-400 rounded-2xl mb-3"><Clock size={24}/></div>
                    <span className="text-[10px] text-night-500 font-black uppercase tracking-widest">آخر تحديث</span>
                    <h3 className="text-sm font-black text-white mt-1">24/11/2024</h3>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="space-y-4">
                <button onClick={() => setIsWarehouseFilterOpen(!isWarehouseFilterOpen)} className="flex items-center gap-2 text-night-400 text-xs font-bold hover:text-white transition-colors">
                    <Filter size={14}/> تصفية متقدمة للقائمة {isWarehouseFilterOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                {isWarehouseFilterOpen && (
                    <div className="bg-night-800/50 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in">
                        <Dropdown options={[{value:'ALL', label:'الكل'}, {value:'متاح', label:'متاح'}, {value:'مسلم', label:'مسلم'}, {value:'صيانة', label:'صيانة'}]} value={warehouseFilters.status} onChange={(v:any)=>setWarehouseFilters({...warehouseFilters, status:v})} placeholder="حسب الحالة" icon={Activity} label="حالة العنصر" />
                        <Dropdown options={[{value:'ALL', label:'الكل'}, ...Array.from(new Set(sectionItems.map(i=>i.subCategory))).filter(Boolean).map(c=>({value:c, label:c}))]} value={warehouseFilters.category} onChange={(v:any)=>setWarehouseFilters({...warehouseFilters, category:v})} placeholder="حسب التصنيف" icon={Layers} label="التصنيف الفرعي" />
                    </div>
                )}
            </div>

            {/* Warehouse Content */}
            <div className="bg-gradient-to-r from-night-800 to-night-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex-1 space-y-4 text-right">
                        <h3 className="text-3xl font-black text-white flex items-center gap-3 justify-start"><ScanBarcode className="text-emerald-500" size={32}/> نظام الجرد والتحقق الذكي</h3>
                        <p className="text-night-400 leading-relaxed max-w-2xl font-bold">إدارة جلسات الجرد الدوري لمطابقة المخزون الفعلي مع السجلات الرقمية.</p>
                    </div>
                    <button className="px-10 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-900/40 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-3 group">
                        <ScanBarcode size={48} className="group-hover:rotate-12 transition-transform"/>
                        <span>فتح جلسة جرد شاملة</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderLossDamageTab = () => {
        const lostItems = items.filter(i => {
            const typeMatch = lossFilters.type === 'ALL' || i.status === lossFilters.type;
            const statusMatch = ['تالف', 'مفقود', 'متلف'].includes(i.status);
            return statusMatch && typeMatch;
        }).sort((a, b) => {
            if(lossSort.key === 'date') return lossSort.direction === 'asc' ? 1 : -1; // Mock date sort
            return 0;
        });

        // Calculate Total Fines
        const totalFines = items.filter(i => ['تالف', 'مفقود', 'متلف'].includes(i.status)).reduce((acc, i) => acc + (i.fineAmount || 0), 0);

        return (
            <div className="animate-fade-in space-y-10 font-['Cairo']" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="إجمالي الفواقد" value={stats.lost + stats.damaged} icon={AlertTriangle} theme="rose" />
                    <StatCard title="إجمالي الغرامات" value={`${totalFines.toLocaleString()} دج`} icon={DollarSign} theme="orange" />
                    <StatCard title="إجمالي التالف" value={stats.damaged} icon={Trash2} theme="purple" />
                </div>

                <div className="space-y-4">
                    <button onClick={() => setIsLossFilterOpen(!isLossFilterOpen)} className="flex items-center gap-2 text-night-400 text-xs font-bold hover:text-white transition-colors">
                        <Filter size={14}/> تصفية الحالات <ChevronDown size={14} className={`transition-transform ${isLossFilterOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    {isLossFilterOpen && (
                        <div className="bg-night-800/50 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in">
                            <Dropdown options={[{value:'ALL', label:'الكل'}, {value:'تالف', label:'تالف'}, {value:'مفقود', label:'مفقود'}]} value={lossFilters.type} onChange={(v:any)=>setLossFilters({...lossFilters, type:v})} placeholder="نوع الحالة" icon={AlertOctagon} label="نوع الضرر" />
                        </div>
                    )}
                </div>

                <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-8 bg-night-900/50 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3"><div className="p-3 bg-rose-500/10 rounded-xl text-rose-500"><AlertTriangle size={24}/></div><h4 className="text-2xl font-black text-white">سجل التلف والفقدان والمحاسبة</h4></div>
                        <button onClick={() => setModalConfig({isOpen: true, type: 'REPORT_CASE'})} className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg flex items-center gap-2 transform hover:scale-105 active:scale-95"><Plus size={18}/> تقرير حالة جديدة</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-white/5 text-night-300 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="p-6 cursor-pointer" onClick={() => setLossSort({key: 'name', direction: lossSort.direction === 'asc' ? 'desc' : 'asc'})}> <div className="flex items-center gap-2">العنصر المتضرر <ArrowUpDown size={12}/></div></th>
                                    <th className="p-6">نوع الحالة</th>
                                    <th className="p-6 cursor-pointer" onClick={() => setLossSort({key: 'date', direction: lossSort.direction === 'asc' ? 'desc' : 'asc'})}> <div className="flex items-center gap-2">تاريخ الحادثة <ArrowUpDown size={12}/></div></th>
                                    <th className="p-6">القرار الإداري</th>
                                    <th className="p-6 text-center">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {lostItems.map(item => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 flex items-center gap-4"><div className="w-10 h-10 bg-night-900 rounded-xl flex items-center justify-center border border-white/5"><Box size={18} className="opacity-50"/></div><div className="text-right"><p className="text-white font-bold">{item.name}</p><p className="text-[10px] text-night-500 font-mono tracking-widest">{item.uniqueId}</p></div></td>
                                        <td className="p-6"><span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${item.status === 'مفقود' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{item.status}</span></td>
                                        <td className="p-6 text-night-400 font-bold">
                                            <div className="flex flex-col">
                                                <span>20/11/2024</span>
                                                <span className="text-[10px] opacity-70">10:30</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {item.fineDecision ? 
                                                <span className={`text-xs font-bold ${
                                                    item.fineDecision === 'FINE' ? 'text-emerald-400' : 
                                                    item.fineDecision === 'RETRIEVED' ? 'text-blue-400' :
                                                    'text-blue-400'
                                                }`}>{
                                                    item.fineDecision === 'FINE' ? `غرامة: ${item.fineAmount} دج` : 
                                                    item.fineDecision === 'RETRIEVED' ? 'تم استرجاعها' :
                                                    'إعفاء إداري'
                                                }</span> :
                                                <span className="text-xs text-night-500 italic">قيد التحقيق الإداري</span>
                                            }
                                        </td>
                                        <td className="p-6 text-center">
                                            <button 
                                                onClick={() => setModalConfig({isOpen: true, type: 'FINE_DECISION', item})}
                                                className="p-2 bg-white/5 hover:bg-primary-600 rounded-lg transition-colors text-night-400 hover:text-white"
                                                title="تفاصيل وقرار"
                                            >
                                                <Gavel size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-white/5">
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">
                                        <div className="flex justify-between items-center px-4 text-xs font-bold text-night-400">
                                            <span>إجمالي الحالات: {lostItems.length}</span>
                                            <span>مجموع الغرامات المقررة: {lostItems.reduce((acc, i) => acc + (i.fineAmount || 0), 0).toLocaleString()} دج</span>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

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
                <div className="bg-night-800/40 p-8 rounded-[3rem] border border-white/5 shadow-xl flex flex-col">
                    <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3 justify-start">تحليل المخزون وقيمة الأصول <DollarSign size={20} className="text-emerald-400"/></h4>
                    <div className="space-y-6 flex-1">
                        <div className="bg-night-900/50 p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                            <div><p className="text-xs text-night-500 font-black uppercase mb-1">القيمة الإجمالية للعتاد</p><h3 className="text-2xl font-black text-white">{stats.totalValue.toLocaleString()} دج</h3></div>
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><TrendingUp size={24}/></div>
                        </div>
                        <div className="bg-night-900/50 p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                            <div><p className="text-xs text-night-500 font-black uppercase mb-1">نسبة التلف السنوي</p><h3 className="text-2xl font-black text-rose-400">2.5%</h3></div>
                            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400"><AlertCircle size={24}/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLogsTab = () => {
        // Only show "Assignment" type transactions in the main list to group by cycle
        const assignmentLogs = equipmentLogs.filter(log => 
            (activeSection === 'UNIFORMS' ? log.category === 'لباس' : log.category === 'عتاد') && 
            log.action === 'تسليم'
        );

        return (
            <div className="animate-fade-in space-y-8 font-['Cairo']" dir="rtl">
                <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="p-8 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h4 className="text-2xl font-black text-white flex items-center gap-4"><History size={24} className="text-primary-500"/> سجل العمليات التفصيلي (دورات العهدة)</h4>
                            <p className="text-xs text-night-400 font-bold mt-1 opacity-80 uppercase tracking-widest">
                                {activeSection === 'UNIFORMS' ? 'خاص بقسم اللباس الكشفي' : 'خاص بقسم العتاد والتجهيزات'}
                            </p>
                        </div>
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-night-300 transition-all flex items-center gap-2"><Filter size={16}/> تصفية</button>
                    </div>
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                            <tr><th className="p-6">تاريخ التسليم</th><th className="p-6">العنصر</th><th className="p-6">المستفيد / النشاط</th><th className="p-6">الحالة الحالية للعهدة</th><th className="p-6 text-center">التفاصيل</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold">
                            {assignmentLogs.map(log => {
                                // Find latest log for this transaction
                                const relatedLogs = equipmentLogs.filter(l => l.transactionId === log.transactionId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                const latestStatus = relatedLogs[0]?.action || log.action;
                                const item = items.find(i => i.id === log.itemId);

                                return (
                                    <tr key={log.id} onClick={() => { setModalConfig({isOpen: true, type: 'LOG_DETAILS', log: log}); setSelectedTransactionId(log.transactionId || null); }} className={`hover:bg-white/5 transition-colors cursor-pointer border-l-4 ${LOG_ROW_STYLES[latestStatus] ? LOG_ROW_STYLES[latestStatus].split(' ')[2] : 'border-transparent'}`}>
                                        <td className="p-6 text-night-400 font-mono text-xs">
                                            <div className="flex flex-col">
                                                <span>{log.date}</span>
                                                <span className="text-[10px] opacity-70">{log.time || '00:00'}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-white">{log.itemName}</div>
                                            <div className="text-[10px] text-night-500 font-mono mt-0.5 tracking-wider">{item?.uniqueId}</div>
                                        </td>
                                        <td className="p-6">
                                            {log.memberName && <div className="text-white text-xs">{log.memberName}</div>}
                                            {log.eventTitle && <div className="text-primary-400 text-[10px] mt-1 flex items-center gap-1"><Activity size={10}/> {log.eventTitle}</div>}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${
                                                latestStatus === 'تسليم' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' :
                                                latestStatus === 'إرجاع' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' :
                                                latestStatus === 'تالف' || latestStatus === 'إتلاف' ? 'bg-red-600/10 text-red-400 border-red-500/20' :
                                                'bg-white/5 text-night-400 border-white/10'
                                            }`}>
                                                {latestStatus === 'تسليم' ? 'قيد الاستخدام' : latestStatus}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center"><button className="p-2 hover:bg-white/10 rounded-full"><ScrollText size={16} className="text-night-400"/></button></td>
                                    </tr>
                                );
                            })}
                            {assignmentLogs.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-night-600 font-bold italic opacity-40">لا توجد سجلات عمليات لهذا القسم</td></tr>}
                        </tbody>
                    </table>
                    <div className="p-6 border-t border-white/5 bg-night-950/30 flex gap-6 text-[10px] font-bold text-night-400 justify-center">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500"></div> تسليم (عهدة نشطة)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500"></div> إرجاع (مكتملة)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500"></div> صيانة</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500/20 border border-red-500"></div> تلف / فقدان</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderMaintenanceTab = () => (
        <div className="animate-fade-in space-y-10 font-['Cairo']" dir="rtl">
             <div className="bg-night-800 border border-white/5 p-12 rounded-[2rem] text-center shadow-lg">
                <div className="w-24 h-24 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wrench size={48} className="text-orange-500 opacity-50"/>
                </div>
                <h3 className="text-2xl font-black text-white">قسم الصيانة</h3>
                <p className="text-night-400 mt-2 font-bold opacity-60">قائمة العناصر التي تحتاج إلى صيانة وجدول الإصلاحات.</p>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
                     {items.filter(i => i.status === 'صيانة').map(item => (
                         <div key={item.id} className="bg-night-900/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 font-bold"><Wrench size={20}/></div>
                                <div>
                                    <h4 className="text-white font-bold">{item.name}</h4>
                                    <p className="text-xs text-night-500 font-mono">{item.uniqueId}</p>
                                </div>
                             </div>
                             {item.maintenanceType && (
                                 <div className="bg-white/5 p-3 rounded-xl">
                                     <p className="text-[10px] text-orange-400 font-black uppercase mb-1">نوع الصيانة</p>
                                     <p className="text-xs text-white font-bold">{item.maintenanceType}</p>
                                     {item.maintenanceDesc && <p className="text-[10px] text-night-400 mt-1">{item.maintenanceDesc}</p>}
                                 </div>
                             )}
                             <button 
                                onClick={() => handleReportIssue(item, 'متاح')}
                                className="w-full mt-auto p-3 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all font-bold text-xs flex items-center justify-center gap-2" title="تم الإصلاح"
                             >
                                 <Check size={16}/> تسجيل كجاهز
                             </button>
                         </div>
                     ))}
                     {items.filter(i => i.status === 'صيانة').length === 0 && (
                         <div className="col-span-full py-10 text-night-600 font-bold italic">لا توجد عناصر قيد الصيانة حالياً</div>
                     )}
                </div>
             </div>
        </div>
    );

    const renderSpecialView = () => {
        switch (activeTab) {
            case 'INVENTORY': return renderInventoryTab();
            case 'MAINTENANCE': return renderMaintenanceTab();
            case 'LOSS_DAMAGE': return renderLossDamageTab();
            case 'REPORTS': return renderReportsTab();
            case 'LOGS': return renderLogsTab();
            default: return null;
        }
    };

    return (
        <div className="p-8 h-full flex flex-col font-['Cairo'] relative overflow-y-auto no-scrollbar bg-night-950">
            {/* Notification Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/10 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-xl text-primary-400"><Info size={20}/></div>
                    <div>
                        <h4 className="text-sm font-black text-white">تنبيه النظام</h4>
                        <p className="text-xs text-night-300 mt-0.5">في نهاية السنة الكشفية الجارية يتم إعداد تقرير وجرد شامل، ولا يتم احتساب اللباس والعتاد التالف أو التلف في السنة الجديدة.</p>
                    </div>
                </div>
            </div>

            {/* Elegant Section Title & Stock Value */}
            <div className="flex justify-between items-end mb-10">
                <div>
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
                {/* IMPROVED ESTIMATED VALUE STAT - OPTIMIZED DESIGN */}
                <div className="relative overflow-hidden bg-gradient-to-l from-emerald-900 via-emerald-800 to-teal-900 border border-emerald-700/50 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.15)] group hover:scale-[1.01] transition-transform duration-500 flex items-center justify-between">
                    {/* Texture/Glow effects */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px]"></div>

                    {/* Icon Left */}
                    <div className="relative z-10 p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500 order-last">
                        <Gem size={32} className="text-emerald-400 drop-shadow-md" />
                    </div>

                    {/* Text Right */}
                    <div className="relative z-10 text-right">
                        <span className="text-[11px] text-emerald-200/80 font-black uppercase tracking-widest block mb-1">القيمة التقديرية للمخزون</span>
                        <div className="flex items-baseline gap-2 justify-end">
                            <span className="text-3xl font-black text-white font-mono tracking-tighter drop-shadow-lg">{stats.totalValue.toLocaleString()}</span>
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-wide">دج</span>
                        </div>
                    </div>
                </div>
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
                <div className="flex bg-night-900/80 p-1.5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setViewLevel('TYPES'); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-night-400 hover:text-white'}`}><tab.icon size={18} /> {tab.label}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 pb-20">
                {activeTab === 'WAREHOUSE' ? (
                    viewLevel === 'TYPES' ? (
                        <>
                            {/* Advanced Filter for Warehouse */}
                            <div className="mb-6 space-y-4 font-['Cairo']" dir="rtl">
                                <button onClick={() => setIsWarehouseFilterOpen(!isWarehouseFilterOpen)} className="flex items-center gap-2 text-night-400 text-xs font-bold hover:text-white transition-colors">
                                    <Filter size={14}/> تصفية متقدمة للقائمة {isWarehouseFilterOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                </button>
                                {isWarehouseFilterOpen && (
                                    <div className="bg-night-800/50 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in">
                                        <Dropdown options={[{value:'ALL', label:'الكل'}, {value:'متاح', label:'متاح'}, {value:'مسلم', label:'مسلم'}, {value:'مسلم', label:'مسلم'}]} value={warehouseFilters.status} onChange={(v:any)=>setWarehouseFilters({...warehouseFilters, status:v})} placeholder="حسب الحالة" icon={Activity} label="حالة العنصر" />
                                        <Dropdown options={[{value:'ALL', label:'الكل'}, ...Array.from(new Set(sectionItems.map(i=>i.subCategory))).filter(Boolean).map(c=>({value:c, label:c}))]} value={warehouseFilters.category} onChange={(v:any)=>setWarehouseFilters({...warehouseFilters, category:v})} placeholder="حسب التصنيف" icon={Layers} label="التصنيف الفرعي" />
                                    </div>
                                )}
                            </div>

                            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" dir="rtl">
                                {Object.keys(typeGroups).map(name => {
                                    const group = typeGroups[name];
                                    const available = group.filter(i => i.status === 'متاح').length;
                                    return <TypeCard key={name} name={name} count={group.length} available={available} category={activeSection === 'UNIFORMS' ? 'لباس' : 'عتاد'} onClick={() => { setSelectedTypeName(name); setViewLevel('INSTANCES'); }} onDelete={() => handleDeleteType(name)} />;
                                })}
                            </div>
                            
                            {/* Footer */}
                            <div className="mt-8 p-6 bg-night-900/50 border-t border-white/5 flex justify-between items-center text-night-400 font-['Cairo'] text-xs font-bold">
                                <span>إجمالي الأنواع: {Object.keys(typeGroups).length}</span>
                                <span>القيمة التقديرية: {stats.totalValue.toLocaleString()} دج</span>
                            </div>
                        </>
                    ) : (
                        <div className="animate-fade-in space-y-8 font-['Cairo']" dir="rtl">
                            
                            {/* Collapsible Filter for Instances */}
                            <div className="mb-4">
                                <button onClick={() => setIsInstanceFilterOpen(!isInstanceFilterOpen)} className="flex items-center gap-2 text-night-400 text-xs font-bold hover:text-white transition-colors mb-4">
                                    <Filter size={14}/> تصفية متقدمة للقائمة {isInstanceFilterOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                </button>
                                {isInstanceFilterOpen && (
                                    <div className="bg-night-800/50 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in mb-6">
                                        <Dropdown options={[{value:'ALL', label:'الكل'}, {value:'متاح', label:'متاح'}, {value:'مسلم', label:'مسلم'}, {value:'صيانة', label:'صيانة'}]} value={instanceFilters.status} onChange={(v:any)=>setInstanceFilters({...instanceFilters, status:v})} placeholder="الحالة" icon={Activity} label="حالة العنصر" />
                                        <Dropdown options={[{value:'ALL', label:'الكل'}, ...WAREHOUSE_LOCATIONS]} value={instanceFilters.location} onChange={(v:any)=>setInstanceFilters({...instanceFilters, location:v})} placeholder="الموقع" icon={Warehouse} label="الموقع / التخزين" />
                                    </div>
                                )}
                            </div>

                            <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <table className="w-full text-right">
                                    <thead className="bg-white/5 text-night-300 text-xs font-black uppercase tracking-widest">
                                        <tr>
                                            <th className="p-6 cursor-pointer" onClick={() => setInstanceSort({key: 'id', direction: instanceSort.direction === 'asc' ? 'desc' : 'asc'})}><div className="flex items-center gap-2">التعريف <ArrowUpDown size={12}/></div></th>
                                            <th className="p-6 cursor-pointer" onClick={() => setInstanceSort({key: 'status', direction: instanceSort.direction === 'asc' ? 'desc' : 'asc'})}><div className="flex items-center gap-2">الحالة <ArrowUpDown size={12}/></div></th>
                                            <th className="p-6 cursor-pointer" onClick={() => setInstanceSort({key: 'location', direction: instanceSort.direction === 'asc' ? 'desc' : 'asc'})}><div className="flex items-center gap-2">الموقع / العهدة <ArrowUpDown size={12}/></div></th>
                                            <th className="p-6">التفاصيل</th>
                                            <th className="p-6 text-center">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {currentTypeInstances.map(item => {
                                            const linkedEvent = item.eventId ? events.find(e => e.id === item.eventId) : undefined;
                                            return <ItemRow key={item.id} item={item} member={members?.find(m => m.id === item.assignedTo)} event={linkedEvent} onAction={openActionModal} onClick={() => handleItemClick(item)} />;
                                        })}
                                    </tbody>
                                    <tfoot className="bg-white/5">
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-xs font-bold text-night-400">عدد العناصر في هذا النوع: {currentTypeInstances.length}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )
                ) : renderSpecialView()}
            </div>
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-['Cairo']" dir="rtl">
                    <div className={`bg-night-800 w-full rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col relative overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar ${modalConfig.type === 'LOG_DETAILS' || modalConfig.type === 'FINE_DECISION' ? 'max-w-4xl' : 'max-w-2xl'}`}>
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-l ${activeSection === 'UNIFORMS' ? 'from-purple-500 to-indigo-500' : 'from-orange-500 to-red-500'}`}></div>
                        
                        {/* --- ADD NEW TYPE MODAL (UPDATED) --- */}
                        {modalConfig.type === 'ADD_TYPE' && (
                            <div className="text-right space-y-6">
                                <div className="text-center mb-4"><h3 className="text-3xl font-black text-white mb-2">تعريف نوع جديد</h3><p className="text-night-400 text-xs font-bold">إضافة صنف جديد للمخزن الرقمي</p></div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">اسم النوع <span className="text-rose-500">*</span></label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-500" value={newTypeData.name} onChange={e => setNewTypeData({...newTypeData, name: e.target.value})} placeholder="مثال: خيمة 8 أشخاص" /></div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-night-300">التصنيف الفرعي</label>
                                        <input list="subcategories" type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-500" value={newTypeData.subCategory} onChange={e => setNewTypeData({...newTypeData, subCategory: e.target.value})} placeholder="اختر أو اكتب تصنيفاً..." />
                                        <datalist id="subcategories">
                                            {SUBCATEGORY_SUGGESTIONS.map((sc, i) => <option key={i} value={sc} />)}
                                        </datalist>
                                    </div>
                                </div>

                                {/* Smart Measurement Section */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-night-300">نوع القياس</label>
                                        <Dropdown 
                                            options={MEASUREMENT_TYPES}
                                            value={newTypeData.measurementType}
                                            onChange={(v: string) => setNewTypeData({...newTypeData, measurementType: v, measurementValue: ''})}
                                            placeholder="اختر نوع القياس"
                                            className="z-[60]"
                                            icon={Ruler}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-night-300">القيمة / المقاس</label>
                                        {newTypeData.measurementType === 'SIZE' ? (
                                            <Dropdown options={UNIFORM_SIZES} value={newTypeData.measurementValue} onChange={(v: string) => setNewTypeData({...newTypeData, measurementValue: v})} placeholder="اختر المقاس..." className="z-[59]" />
                                        ) : newTypeData.measurementType === 'FREE' ? (
                                            <input type="text" disabled className="w-full bg-night-900/50 border border-white/5 rounded-2xl p-4 text-night-500 italic" value="قياس موحد (Free Size)" />
                                        ) : (
                                            <div className="relative">
                                                <input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-500" value={newTypeData.measurementValue} onChange={e => setNewTypeData({...newTypeData, measurementValue: e.target.value})} placeholder="أدخل القيمة الرقمية..." />
                                                <span className="absolute left-4 top-4 text-night-500 text-xs font-black">
                                                    {newTypeData.measurementType === 'LENGTH' ? 'CM' : newTypeData.measurementType === 'WEIGHT' ? 'KG' : newTypeData.measurementType === 'CAPACITY' ? 'L' : ''}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">الماركة / Brand</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-500" value={newTypeData.brand} onChange={e => setNewTypeData({...newTypeData, brand: e.target.value})} /></div>
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">المورد</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-500" value={newTypeData.supplier} onChange={e => setNewTypeData({...newTypeData, supplier: e.target.value})} /></div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">سعر الشراء (للوحدة)</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-emerald-400 font-mono font-black outline-none focus:border-primary-500" value={newTypeData.price} onChange={e => setNewTypeData({...newTypeData, price: Number(e.target.value)})} /></div>
                                    <div className="space-y-2 col-span-2"><label className="text-sm font-bold text-night-300">اللون</label><input type="color" className="w-full h-14 bg-night-900 border border-white/10 rounded-2xl p-1 cursor-pointer" value={newTypeData.color} onChange={e => setNewTypeData({...newTypeData, color: e.target.value})} /></div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-night-300">أولوية الإرجاع والحساسية</label>
                                    <Dropdown 
                                        options={['عادية', 'متوسطة', 'عالية/حرجة'].map(s => ({value: s, label: s}))}
                                        value={newTypeData.returnPriority}
                                        onChange={(v: string) => setNewTypeData({...newTypeData, returnPriority: v})}
                                        placeholder="درجة الأهمية"
                                        className="z-[50]"
                                        icon={Siren}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-night-300">صورة العنصر</label>
                                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl bg-night-900 cursor-pointer hover:border-primary-500 transition-colors group">
                                        {newTypeData.imageUrl ? <img src={newTypeData.imageUrl} className="h-full object-contain" /> : <div className="text-center text-night-500 group-hover:text-primary-400"><Camera className="mx-auto mb-1"/><span className="text-xs">اضغط لرفع صورة</span></div>}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black transition-all hover:bg-white/10">إلغاء</button>
                                    <button onClick={handleCreateType} className={`flex-1 py-4 text-white rounded-2xl font-black shadow-xl transition-all bg-gradient-to-r ${activeSection === 'UNIFORMS' ? 'from-purple-600 to-indigo-600' : 'from-orange-600 to-red-600'}`}>حفظ النوع</button>
                                </div>
                            </div>
                        )}

                        {/* --- ASSIGN MODAL (UPDATED) --- */}
                        {modalConfig.type === 'ASSIGN' && (
                             <div className="text-right space-y-6">
                                <div className="text-center mb-6"><h3 className="text-2xl font-black text-white mb-1">تسليم عهدة</h3><p className="text-primary-400 font-black text-sm">{modalConfig.item?.name} <span className="text-night-500 font-mono">({modalConfig.item?.uniqueId})</span></p></div>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-night-900/50 rounded-2xl border border-white/5">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-sm font-black text-white group-hover:text-primary-400 transition-colors">ربط بنشاط أو مخيم؟</span>
                                            <input type="checkbox" className="w-5 h-5 rounded-md accent-primary-600" checked={assignData.linkToEvent} onChange={e => setAssignData({...assignData, linkToEvent: e.target.checked})} />
                                        </label>
                                    </div>

                                    {assignData.linkToEvent && (
                                        <div className="animate-fade-in space-y-2">
                                            <Dropdown 
                                                options={events.map(e => ({ value: e.id, label: e.title }))}
                                                value={assignData.eventId}
                                                onChange={(v: string) => setAssignData({...assignData, eventId: v})}
                                                placeholder="اختر النشاط / المخيم..."
                                                icon={Activity}
                                                label="النشاط المرتبط"
                                                className="z-[60]"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Dropdown options={(members || []).map(m => ({value: m.id, label: m.fullName}))} value={assignData.memberId} onChange={(val: any) => setAssignData({...assignData, memberId: val})} placeholder="ابحث عن العضو..." icon={User} label="اختر المستلم" className="z-[50]" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-night-300">المسؤول عن التسليم</label>
                                            <Dropdown options={leaders} value={assignData.issuer} onChange={(v: string) => setAssignData({...assignData, issuer: v})} placeholder="اختر القائد..." className="z-[48]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-night-300">حالة العهدة</label>
                                            <Dropdown options={ITEM_CONDITIONS.map(s => ({value: s, label: s}))} value={assignData.condition} onChange={(v: string) => setAssignData({...assignData, condition: v})} className="z-[45]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-night-300">القياس / الحجم</label>
                                            <input type="text" placeholder="مثال: L أو 50 لتر" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white" value={assignData.size} onChange={e => setAssignData({...assignData, size: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-night-300">أولوية الإرجاع</label>
                                            <Dropdown options={['عادية', 'متوسطة', 'عالية/حرجة'].map(s => ({value: s, label: s}))} value={assignData.returnPriority} onChange={(v: string) => setAssignData({...assignData, returnPriority: v})} className="z-[40]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setAssignData({...assignData, deliveryType: 'دائم'})} className={`p-4 rounded-2xl font-black border transition-all ${assignData.deliveryType === 'دائم' ? 'bg-purple-600 text-white shadow-lg' : 'bg-night-900 border-white/10 text-night-400'}`}>تسليم دائم</button>
                                        <button onClick={() => setAssignData({...assignData, deliveryType: 'مؤقت'})} className={`p-4 rounded-2xl font-black border transition-all ${assignData.deliveryType === 'مؤقت' ? 'bg-orange-600 text-white shadow-lg' : 'bg-night-900 border-white/10 text-night-400'}`}>إعارة مؤقتة</button>
                                    </div>

                                    {assignData.deliveryType === 'مؤقت' && (
                                        <div className="space-y-2 animate-fade-in"><label className="text-sm font-bold text-night-300">تاريخ الإرجاع المتوقع</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500" value={assignData.returnDate} onChange={e => setAssignData({...assignData, returnDate: e.target.value})} /></div>
                                    )}
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black transition-all hover:bg-white/10">إلغاء</button>
                                    <button onClick={handleAssign} className="flex-1 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all">تأكيد التسليم</button>
                                </div>
                             </div>
                        )}

                        {/* --- RETURN MODAL (UPDATED WITH RESPONSIBLE & FIXES & DYNAMIC TITLE) --- */}
                        {modalConfig.type === 'RETURN' && (
                            <div className="text-right space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-lg">
                                        <RefreshCcw size={40} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">
                                        {activeSection === 'UNIFORMS' ? 'إرجاع اللباس' : 'إرجاع العتاد'}
                                    </h3>
                                    <p className="text-night-400 font-bold mt-1 text-sm">توثيق عملية استلام القطعة وفحص حالتها</p>
                                </div>

                                <div className="bg-night-900/50 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                                    <div className="flex items-start gap-4 mb-4 pb-4 border-b border-white/5">
                                        <div className="w-16 h-16 bg-night-800 rounded-2xl flex items-center justify-center border border-white/5">
                                            {modalConfig.item?.category === 'لباس' ? <Shirt size={24} className="text-purple-400"/> : <Box size={24} className="text-orange-400"/>}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-lg">{modalConfig.item?.name}</h4>
                                            <p className="text-night-500 font-mono text-xs tracking-widest">{modalConfig.item?.uniqueId}</p>
                                            <div className="mt-2 flex items-center gap-2 text-xs text-night-400 font-bold">
                                                <User size={12}/>
                                                <span>المستلم الحالي: {members.find(m => m.id === modalConfig.item?.assignedTo)?.fullName || 'غير معروف'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Updated Grid Layout with Responsible for Delivery in Middle */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-night-800 p-3 rounded-xl border border-white/5">
                                            <span className="text-[10px] text-night-500 block mb-1">تاريخ التسليم</span>
                                            <span className="text-white font-mono text-sm">{modalConfig.item?.assignmentDate || '---'}</span>
                                        </div>
                                        <div className="bg-night-800 p-3 rounded-xl border border-white/5">
                                            <span className="text-[10px] text-night-500 block mb-1">المسؤول عن التسليم</span>
                                            <span className="text-white font-bold text-sm">{modalConfig.item?.issuedBy || '---'}</span>
                                        </div>
                                        <div className="bg-night-800 p-3 rounded-xl border border-white/5">
                                            <span className="text-[10px] text-night-500 block mb-1">الحالة عند التسليم</span>
                                            <span className="text-amber-400 font-black text-sm">{modalConfig.item?.assignmentCondition || 'غير مسجل'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2"><ClipboardCheck size={14}/> حالة القطعة عند الإرجاع</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {/* Updated 'متوسط' to 'متوسطة' */}
                                            {['ممتازة', 'جيدة', 'مقبولة', 'متوسطة', 'رديئة', 'تحتاج صيانة', 'تالفة'].map(cond => (
                                                <button 
                                                    key={cond}
                                                    onClick={() => setReturnData({...returnData, condition: cond})}
                                                    className={`py-3 rounded-xl text-[10px] font-black border transition-all ${
                                                        returnData.condition === cond 
                                                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg scale-105' 
                                                        : 'bg-night-900 text-night-400 border-white/10 hover:bg-white/5'
                                                    }`}
                                                >
                                                    {cond}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2"><CornerDownLeft size={14}/> وجهة التخزين</label>
                                            <Dropdown 
                                                options={WAREHOUSE_LOCATIONS} 
                                                value={returnData.location} 
                                                onChange={(v: string) => setReturnData({...returnData, location: v})} 
                                                className="z-[50]" 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2"><UserCheck size={14}/> المسؤول عن الإرجاع</label>
                                            <Dropdown 
                                                options={leaders}
                                                value={returnData.responsible}
                                                onChange={(v: string) => setReturnData({...returnData, responsible: v})}
                                                placeholder="من استلم القطعة؟"
                                                className="z-[49]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-night-400 uppercase tracking-widest">ملاحظات إضافية</label>
                                        <textarea 
                                            className="w-full h-24 bg-night-900 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500 transition-all resize-none" 
                                            placeholder="أي ملاحظات حول عملية الإرجاع..."
                                            value={returnData.notes}
                                            onChange={e => setReturnData({...returnData, notes: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button>
                                    <button onClick={executeReturn} className="flex-[2] py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                                        <CheckCircle2 size={20}/> تأكيد الإرجاع للمخزن
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- REPORT ISSUE MODAL (Refactored) --- */}
                        {modalConfig.type === 'REPORT_ISSUE' && (
                            <div className="text-right space-y-6">
                                <div className="text-center mb-6"><h3 className="text-2xl font-black text-rose-500 mb-1">إبلاغ عن حالة</h3><p className="text-white font-bold">{modalConfig.item?.name}</p></div>
                                
                                <div className="space-y-4">
                                    {/* Option 1: Maintenance */}
                                    <div className="bg-night-900 border border-white/10 rounded-2xl overflow-hidden transition-all">
                                        <button 
                                            onClick={() => setReportIssueTab(reportIssueTab === 'MAINTENANCE' ? null : 'MAINTENANCE')}
                                            className="w-full p-5 flex justify-between items-center text-orange-400 font-black hover:bg-white/5 transition-all"
                                        >
                                            <span>تحويل للصيانة</span>
                                            <div className="flex items-center gap-2">
                                                <Wrench size={20}/>
                                                <ChevronDown size={16} className={`transition-transform ${reportIssueTab === 'MAINTENANCE' ? 'rotate-180' : ''}`}/>
                                            </div>
                                        </button>
                                        
                                        {reportIssueTab === 'MAINTENANCE' && (
                                            <div className="p-5 pt-0 space-y-4 animate-fade-in border-t border-white/5">
                                                <Dropdown 
                                                    options={['خياطة', 'تنظيف عميق', 'إصلاح ميكانيكي', 'دهن وطلاء', 'أخرى']} 
                                                    value={maintenanceData.type}
                                                    onChange={(v:string) => setMaintenanceData({...maintenanceData, type: v})}
                                                    placeholder="اختر نوع الصيانة المطلوبة..."
                                                    className="z-[60]"
                                                />
                                                <textarea 
                                                    className="w-full h-20 bg-night-800 border border-white/10 rounded-xl p-3 text-white text-xs resize-none focus:border-primary-500 outline-none"
                                                    placeholder="وصف تفصيلي للمشكلة..."
                                                    value={maintenanceData.description}
                                                    onChange={e => setMaintenanceData({...maintenanceData, description: e.target.value})}
                                                />
                                                <button onClick={() => handleReportIssue(modalConfig.item!, 'صيانة')} className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black shadow-lg transition-all">تأكيد التحويل للصيانة</button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Option 2: Register Damage (Opens Report Case Modal directly) */}
                                    <button 
                                        onClick={() => {
                                            setModalConfig({ ...modalConfig, isOpen: false }); 
                                            setTimeout(() => {
                                                setCaseReport(prev => ({...prev, itemId: modalConfig.item!.id, type: 'تالف'}));
                                                setModalConfig({ isOpen: true, type: 'REPORT_CASE', item: modalConfig.item });
                                            }, 100);
                                        }} 
                                        className="w-full p-5 rounded-2xl bg-night-900 border border-white/10 text-red-400 font-black text-right flex justify-between items-center group hover:border-red-500 transition-all"
                                    >
                                        <span>تسجيل تلف</span><Ban size={20}/>
                                    </button>

                                    {/* Option 3: Register Loss (Opens Report Case Modal directly) */}
                                    <button 
                                        onClick={() => {
                                            setModalConfig({ ...modalConfig, isOpen: false });
                                            setTimeout(() => {
                                                setCaseReport(prev => ({...prev, itemId: modalConfig.item!.id, type: 'مفقود'}));
                                                setModalConfig({ isOpen: true, type: 'REPORT_CASE', item: modalConfig.item });
                                            }, 100);
                                        }} 
                                        className="w-full p-5 rounded-2xl bg-night-900 border border-white/10 text-pink-400 font-black text-right flex justify-between items-center group hover:border-pink-500 transition-all"
                                    >
                                        <span>تسجيل فقدان</span><AlertOctagon size={20}/>
                                    </button>
                                </div>
                                <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="w-full py-4 bg-white/5 text-white rounded-2xl font-black mt-4 hover:bg-white/10">إلغاء</button>
                            </div>
                        )}

                        {/* --- FINE DECISION MODAL (New with Retrieved Option) --- */}
                        {modalConfig.type === 'FINE_DECISION' && (
                            <div className="text-right space-y-8 animate-fade-in font-['Cairo']">
                                <div className="border-b border-white/10 pb-6 mb-6 text-center">
                                    <div className="w-16 h-16 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500"><Gavel size={32}/></div>
                                    <h3 className="text-2xl font-black text-white">قرار الإدارة (غرامة / إعفاء / استرجاع)</h3>
                                    <p className="text-night-400 text-xs font-bold mt-2">{modalConfig.item?.name} - {modalConfig.item?.uniqueId}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4 p-2 bg-night-900 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar">
                                        <button 
                                            onClick={() => setFineData({...fineData, decision: 'FINE'})}
                                            className={`flex-1 py-4 px-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${fineData.decision === 'FINE' ? 'bg-rose-600 text-white shadow-lg' : 'text-night-400 hover:text-white'}`}
                                        >
                                            فرض غرامة
                                        </button>
                                        <button 
                                            onClick={() => setFineData({...fineData, decision: 'EXEMPT'})}
                                            className={`flex-1 py-4 px-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${fineData.decision === 'EXEMPT' ? 'bg-blue-600 text-white shadow-lg' : 'text-night-400 hover:text-white'}`}
                                        >
                                            إعفاء إداري
                                        </button>
                                        <button 
                                            onClick={() => setFineData({...fineData, decision: 'RETRIEVED'})}
                                            className={`flex-1 py-4 px-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${fineData.decision === 'RETRIEVED' ? 'bg-emerald-600 text-white shadow-lg' : 'text-night-400 hover:text-white'}`}
                                        >
                                            تم إسترجاعها
                                        </button>
                                    </div>

                                    {fineData.decision === 'FINE' && (
                                        <div className="space-y-4 animate-slide-in">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-night-400 uppercase tracking-widest">مبلغ الغرامة (دج)</label>
                                                <div className="relative">
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono text-xl font-black focus:border-rose-500 outline-none text-center"
                                                        value={fineData.amount}
                                                        onChange={e => setFineData({...fineData, amount: Number(e.target.value)})}
                                                    />
                                                    <Coins className="absolute right-4 top-1/2 -translate-y-1/2 text-night-500" size={20}/>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-night-400 uppercase tracking-widest">الخزينة المستهدفة للتحويل</label>
                                                <Dropdown 
                                                    options={['خزينة الفوج', 'صندوق الوحدة', 'الحساب البنكي']} 
                                                    value={fineData.treasury} 
                                                    onChange={(v:string) => setFineData({...fineData, treasury: v})} 
                                                    placeholder="اختر الوجهة..."
                                                    className="z-[60]"
                                                />
                                            </div>
                                            <div className="p-4 bg-rose-900/20 border border-rose-500/20 rounded-2xl flex items-center gap-3">
                                                <Info size={20} className="text-rose-400 shrink-0"/>
                                                <p className="text-[10px] text-rose-300 font-bold leading-relaxed">سيتم تسجيل الغرامة على العضو المسؤول، وتوجيه المبلغ افتراضياً إلى قسم المالية كإيراد (غرامات).</p>
                                            </div>
                                        </div>
                                    )}

                                    {fineData.decision === 'RETRIEVED' && (
                                        <div className="space-y-4 animate-slide-in">
                                            <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                                                <CheckCircle2 size={24} className="text-emerald-400 shrink-0"/>
                                                <p className="text-[11px] text-emerald-300 font-bold leading-relaxed">سيتم إعادة القطعة إلى حالة "متاح" في المخزن، وإلغاء أي إجراءات تأديبية أو مالية متعلقة بفقدانها.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button>
                                    <button onClick={handleConfirmFineDecision} className="flex-[2] py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all">تأكيد القرار</button>
                                </div>
                            </div>
                        )}

                        {/* --- NEW CASE REPORT MODAL (LOSS & DAMAGE) --- */}
                        {modalConfig.type === 'REPORT_CASE' && (
                            <div className="text-right space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20 shadow-lg">
                                        <AlertTriangle size={40} className="text-rose-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white">تقرير حالة (تلف / فقدان)</h3>
                                    <p className="text-night-400 font-bold mt-1 text-xs">توثيق حالة استثنائية للعتاد لاتخاذ الإجراءات اللازمة</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-night-400">تحديد العنصر المتضرر</label>
                                        <Dropdown 
                                            options={items.filter(i => i.status !== 'تالف' && i.status !== 'مفقود').map(i => ({ value: i.id, label: `${i.name} [${i.uniqueId}]` }))}
                                            value={caseReport.itemId}
                                            onChange={(v: string) => setCaseReport({...caseReport, itemId: v})}
                                            placeholder="اختر العنصر..."
                                            className="z-[60]"
                                            icon={Search}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-night-400">نوع الحالة</label>
                                            <Dropdown 
                                                options={['تالف', 'مفقود', 'متلف']}
                                                value={caseReport.type}
                                                onChange={(v: string) => setCaseReport({...caseReport, type: v})}
                                                className="z-[55]"
                                                icon={AlertOctagon}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-night-400">تاريخ الحادثة</label>
                                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" value={caseReport.date} onChange={e => setCaseReport({...caseReport, date: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-night-400">المتسبب / المسؤول</label>
                                        <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-night-600" placeholder="اسم العضو أو القائد المسؤول" value={caseReport.responsible} onChange={e => setCaseReport({...caseReport, responsible: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-night-400">تفاصيل الحادثة</label>
                                        <textarea className="w-full h-24 bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white resize-none" placeholder="شرح وافي لما حدث..." value={caseReport.description} onChange={e => setCaseReport({...caseReport, description: e.target.value})} />
                                    </div>
                                    <div className="p-4 bg-rose-900/20 border border-rose-500/20 rounded-xl flex items-center gap-3">
                                        <Info size={20} className="text-rose-400" />
                                        <p className="text-[10px] text-rose-300 font-bold">سيتم تغيير حالة العنصر فوراً في السجلات، ولا يمكن التراجع عن هذا الإجراء إلا بقرار إداري.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button>
                                    <button onClick={handleSaveCaseReport} className="flex-[2] py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black shadow-xl transition-all">توثيق الحالة</button>
                                </div>
                            </div>
                        )}

                        {/* --- LOG DETAILS MODAL (UPDATED) --- */}
                        {modalConfig.type === 'LOG_DETAILS' && selectedTransactionId && (
                            <div className="text-right space-y-8 animate-fade-in">
                                <div className="border-b border-white/10 pb-6 mb-6">
                                    <h3 className="text-2xl font-black text-white flex items-center gap-3"><History className="text-primary-500"/> تفاصيل دورة العهدة</h3>
                                    <p className="text-night-400 text-xs font-bold mt-2">السجل الكامل للعمليات المرتبطة بعملية التسليم رقم: <span className="font-mono text-primary-400">{selectedTransactionId}</span></p>
                                </div>

                                <div className="space-y-6 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                                    {equipmentLogs.filter(l => l.transactionId === selectedTransactionId).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((log, idx) => (
                                        <div key={log.id} className="relative pr-16 animate-slide-in" style={{animationDelay: `${idx * 100}ms`}}>
                                            <div className={`absolute right-4 top-2 w-4 h-4 rounded-full border-2 border-night-800 ${
                                                log.action === 'تسليم' ? 'bg-blue-500' :
                                                log.action === 'إرجاع' ? 'bg-emerald-500' :
                                                log.action === 'صيانة' ? 'bg-orange-500' : 'bg-red-500'
                                            }`}></div>
                                            <div className="bg-night-900/50 border border-white/5 rounded-2xl p-5 hover:bg-night-900 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${
                                                        log.action === 'تسليم' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' :
                                                        log.action === 'إرجاع' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' :
                                                        'bg-red-600/20 text-red-400 border-red-500/30'
                                                    }`}>{log.action}</span>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-night-500 font-mono text-xs">{log.date}</span>
                                                        <span className="text-[10px] text-night-600 font-mono">{log.time || '---'}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                    <div><span className="text-night-500 block mb-1">الحالة:</span> <span className="text-white font-bold">{log.condition}</span></div>
                                                    <div><span className="text-night-500 block mb-1">المستفيد:</span> <span className="text-white font-bold">{log.memberName || '---'}</span></div>
                                                </div>
                                                
                                                {/* NEW: Responsibility Info in Logs */}
                                                <div className="mt-3 pt-3 border-t border-white/5 text-[10px] grid grid-cols-2 gap-2">
                                                    {log.assignmentResponsible && (
                                                        <div><span className="text-night-500">المسؤول عن التسليم: </span><span className="text-primary-400 font-bold">{log.assignmentResponsible}</span></div>
                                                    )}
                                                    {log.returnResponsible && (
                                                        <div><span className="text-night-500">المسؤول عن الإرجاع: </span><span className="text-emerald-400 font-bold">{log.returnResponsible}</span></div>
                                                    )}
                                                </div>

                                                {log.eventTitle && (
                                                    <div className="mt-2 text-[11px] flex items-center gap-2">
                                                        <span className="text-night-500 font-bold">مرتبط بـ:</span>
                                                        <span className="text-primary-400 font-bold bg-primary-600/10 px-2 py-0.5 rounded border border-primary-500/20">{log.eventTitle}</span>
                                                    </div>
                                                )}
                                                {log.notes && (
                                                    <div className="mt-2 text-[11px] text-night-400 italic">
                                                        "{log.notes}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-end">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold">إغلاق</button>
                                </div>
                            </div>
                        )}

                        {/* --- EDIT ITEM MODAL --- */}
                        {modalConfig.type === 'EDIT_ITEM' && (
                            <div className="text-right space-y-6">
                                <div className="text-center mb-6"><h3 className="text-2xl font-black text-indigo-400 mb-1">تعديل بيانات القطعة</h3><p className="text-white font-bold">{modalConfig.item?.uniqueId}</p></div>
                                <div className="space-y-4">
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">اسم القطعة</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={modalConfig.item?.name} onChange={e => setModalConfig({...modalConfig, item: {...modalConfig.item!, name: e.target.value}})} /></div>
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">الحالة</label><Dropdown options={['متاح', 'مسلم', 'صيانة', 'تالف'].map(s => ({value: s, label: s}))} value={modalConfig.item?.status} onChange={(v: any) => setModalConfig({...modalConfig, item: {...modalConfig.item!, status: v}})} className="z-[50]" /></div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black">إلغاء</button>
                                    <button onClick={handleEditItem} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl">حفظ التعديلات</button>
                                </div>
                            </div>
                        )}

                        {/* --- ADD UNITS MODAL --- */}
                        {modalConfig.type === 'ADD_UNITS' && (
                            <div className="text-right space-y-6">
                                <div className="text-center mb-6"><h3 className="text-2xl font-black text-white mb-2">إضافة وحدات للمخزون</h3><p className="text-primary-400 font-black">{selectedTypeName}</p></div>
                                <div className="space-y-4">
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">الكمية</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-black text-xl text-center" value={newUnitsData.quantity} onChange={e => setNewUnitsData({...newUnitsData, quantity: Number(e.target.value)})} /></div>
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">موقع التخزين</label><Dropdown options={WAREHOUSE_LOCATIONS} value={newUnitsData.location} onChange={(v: string) => setNewUnitsData({...newUnitsData, location: v})} className="z-[50]" /></div>
                                    <div className="space-y-2"><label className="text-sm font-bold text-night-300">تاريخ الشراء</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newUnitsData.purchaseDate} onChange={e => setNewUnitsData({...newUnitsData, purchaseDate: e.target.value})} /></div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black">إلغاء</button>
                                    <button onClick={handleAddUnits} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl">تأكيد الإضافة</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- NEW ITEM DETAILS MODAL --- */}
            {viewItemModal.isOpen && viewItemModal.item && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-['Cairo']" dir="rtl">
                    <div className="bg-night-800 w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative">
                        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${activeSection === 'UNIFORMS' ? 'from-purple-600 to-indigo-600' : 'from-orange-500 to-red-500'}`}></div>
                        <button onClick={() => setViewItemModal({isOpen: false, item: null})} className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all z-10"><X size={20}/></button>
                        
                        <div className="relative pt-16 px-8 pb-8 text-center">
                            <div className="w-24 h-24 mx-auto bg-night-900 rounded-3xl border-4 border-night-800 shadow-xl flex items-center justify-center overflow-hidden mb-4 relative z-10">
                                {viewItemModal.item.imageUrl ? (
                                    <img src={viewItemModal.item.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-white/50">{viewItemModal.item.category === 'لباس' ? <Shirt size={40}/> : <Box size={40}/>}</div>
                                )}
                            </div>
                            
                            <h3 className="text-2xl font-black text-white mb-1">{viewItemModal.item.name}</h3>
                            <span className="bg-white/5 px-3 py-1 rounded-lg text-night-400 font-mono text-xs tracking-widest border border-white/5">{viewItemModal.item.uniqueId}</span>

                            <div className="mt-8 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-night-900/50 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-night-500 font-black uppercase mb-1">الحالة</p>
                                        <p className="text-white font-bold text-sm">{viewItemModal.item.condition}</p>
                                    </div>
                                    <div className="bg-night-900/50 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-night-500 font-black uppercase mb-1">الموقع</p>
                                        <p className="text-white font-bold text-sm truncate">{viewItemModal.item.location}</p>
                                    </div>
                                </div>
                                {viewItemModal.item.assignedTo && (
                                    <div className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div className="text-right">
                                            <p className="text-[10px] text-night-500 font-black uppercase mb-1">المستلم الحالي</p>
                                            <p className="text-white font-bold text-sm">{members.find(m => m.id === viewItemModal.item?.assignedTo)?.fullName || 'غير معروف'}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-primary-600/10 rounded-full flex items-center justify-center text-primary-400"><UserCheck size={20}/></div>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-night-900/50 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-night-500 font-black uppercase mb-1">تاريخ الشراء</p>
                                        <p className="text-white font-mono text-xs">{viewItemModal.item.purchaseDate || '---'}</p>
                                    </div>
                                    <div className="bg-night-900/50 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-night-500 font-black uppercase mb-1">السعر</p>
                                        <p className="text-emerald-400 font-mono text-sm font-black">{viewItemModal.item.price} دج</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equipment;
