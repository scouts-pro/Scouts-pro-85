
import React, { useState, useMemo, useEffect } from 'react';
import { Event, Member, UnitName, ActivityExpense, ActivityFundingSource, Treasury, BankAccount, EquipmentItem, EquipmentStatus, ApprovalStatus } from '../types';
import { UNITS_LIST } from '../constants';
import { 
    Calendar, MapPin, Users, Plus, Hash,
    ChevronLeft, ChevronRight, Clock, Target, ArrowUpRight, Save, X, DollarSign, Briefcase, Tent, Image as ImageIcon,
    Sparkles, Shield, UserCog, Tag, Layers, Info, BadgeDollarSign, Coins, UserPlus, CheckCircle2, AlertCircle, AlertTriangle, UserX, Crown, Search, Printer, Edit, Trash2, Timer,
    LayoutDashboard, TrendingUp, TrendingDown, HandCoins, Receipt, ArrowRightLeft, History, Eye, Download, Box, Shirt, Filter, ShieldCheck, Gavel, RefreshCcw, UserCheck, AlertOctagon,
    Check, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ListFilter, MonitorPlay, Package, UserCircle2, Archive as ArchiveIcon, RotateCcw, Ban, ShieldX, FileText, Star, BarChart3,
    CalendarDays, ClipboardCheck
} from 'lucide-react';

const EXPENSE_TYPES = [
    'نقل', 'تغذية', 'لوازم', 'كراء', 'خدمات', 'طباعة', 'تجهيزات', 'مصاريف أخرى'
];

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-4xl", className = "", overlayClassName = "bg-night-950/98 backdrop-blur-2xl" }: any) => {
    if (!isOpen) return null;
    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in font-['Cairo'] text-right ${overlayClassName}`} dir="rtl">
            <div className={`bg-night-800 w-full ${maxWidth} rounded-[3rem] border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col max-h-[95vh] ${className}`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-night-900/40">
                    <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-night-400 hover:text-white transition-all"><X size={20}/></button>
                    <h3 className="text-xl font-black text-white">{title}</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-night-900/10">{children}</div>
                {footer && <div className="p-6 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">{footer}</div>}
            </div>
        </div>
    );
};

const CustomDropdown = ({ options, value, onChange, placeholder, icon: Icon, label, searchable = true, disabled = false }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    
    const filteredOptions = useMemo(() => {
        if (!searchable || !search) return options;
        return options.filter((o: any) => {
            const lbl = typeof o === 'object' ? o.label : o;
            return lbl.toString().toLowerCase().includes(search.toLowerCase());
        });
    }, [options, search, searchable]);

    const selected = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value)) || { label: placeholder };
    
    // Fix: Extracted safe label string to prevent React Error #31
    const safeDisplayLabel = typeof selected === 'object' ? (selected.label || placeholder || 'اختر...') : selected;

    return (
        <div className="relative font-['Cairo'] space-y-2 w-full">
            {label && <label className="text-[10px] font-black text-night-400 uppercase tracking-widest mr-2">{label}</label>}
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-3 bg-night-950 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white cursor-pointer hover:border-primary-500 transition-all shadow-inner ${isOpen ? 'ring-2 ring-primary-500/20 border-primary-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-primary-400" />}
                    <span className="font-bold truncate">{safeDisplayLabel}</span>
                </div>
                <ChevronDown size={14} className={`text-night-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-100" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 w-full mt-2 bg-night-800 border border-white/10 rounded-2xl shadow-2xl z-[101] py-2 animate-fade-in overflow-hidden backdrop-blur-xl ring-1 ring-black/50">
                        {searchable && (
                            <div className="p-2 border-b border-white/5">
                                <input 
                                    type="text" 
                                    className="w-full bg-night-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500"
                                    placeholder="بحث سريع..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredOptions.map((opt: any, idx: number) => {
                                const val = typeof opt === 'object' ? opt.value : opt;
                                const lbl = typeof opt === 'object' ? opt.label : opt;
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => { onChange(val); setIsOpen(false); setSearch(''); }}
                                        className={`px-5 py-3 text-sm text-right cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between ${value === val ? 'text-primary-400 bg-primary-600/10 font-black' : 'text-night-300'}`}
                                    >
                                        {value === val && <Check size={14} className="text-primary-500" />}
                                        <span>{lbl}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

interface CampsProps {
    camps: Event[];
    members: Member[];
    onUpdateCamp?: (camp: Event) => void;
    onAddCamp?: (camp: Event) => void;
    onFinancialTransfer?: any;
    globalTransactions?: any;
    onAddNotification?: any;
    onTransferSurplus?: any;
    treasuries?: Treasury[];
    bankAccounts?: BankAccount[];
    equipmentList?: EquipmentItem[];
    onUpdateEquipment?: (items: EquipmentItem[]) => void;
}

const Camps: React.FC<CampsProps> = ({ 
    camps, members, onAddCamp, onUpdateCamp, onAddNotification,
    treasuries = [], bankAccounts = [], equipmentList = [], onUpdateEquipment
}) => {
    const [selectedCamp, setSelectedCamp] = useState<Event | null>(null);
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
    const [activeTab, setActiveTab] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formTab, setFormTab] = useState(0);

    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
    const [addParticipantModalTab, setAddParticipantModalTab] = useState<'LEADERS' | 'SCOUTS'>('SCOUTS');
    const [searchMember, setSearchMember] = useState('');

    const [eqSubTab, setEqSubTab] = useState<'CLOTHES' | 'EQUIPMENT'>('CLOTHES');

    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showMemberDetailModal, setShowMemberDetailModal] = useState(false);
    const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<Member | null>(null);
    const [selectedItemForAction, setSelectedItemForAction] = useState<EquipmentItem | null>(null);
    
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const leadersList = useMemo(() => members.filter(m => m.role.includes('قائد')).map(m => ({ value: m.fullName, label: m.fullName })), [members]);

    const [showAddFundingModal, setShowAddFundingModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showTransferSurplusModal, setShowTransferSurplusModal] = useState(false);

    const [deliveryData, setDeliveryData] = useState({ 
        memberId: '', equipmentId: '', uniqueIdInput: '', issuer: 'مسؤول العتاد', condition: 'ممتازة',
        deliveryDay: new Date().getDate().toString(),
        deliveryMonth: (new Date().getMonth() + 1).toString(),
        deliveryYear: new Date().getFullYear().toString(),
        expectedReturnDay: new Date(Date.now() + 7 * 86400000).getDate().toString(),
        expectedReturnMonth: (new Date(Date.now() + 7 * 86400000).getMonth() + 1).toString(),
        expectedReturnYear: new Date(Date.now() + 7 * 86400000).getFullYear().toString(),
        notes: ''
    });

    // New state for Return Modal
    const [returnModal, setReturnModal] = useState<{isOpen: boolean; item: EquipmentItem | null; condition: string; notes: string}>({
        isOpen: false,
        item: null,
        condition: 'ممتازة',
        notes: ''
    });

    const foundItemByUniqueId = useMemo(() => {
        if (!deliveryData.uniqueIdInput) return null;
        return (equipmentList || []).find(i => i.uniqueId === deliveryData.uniqueIdInput);
    }, [deliveryData.uniqueIdInput, equipmentList]);

    const [statusUpdateData, setStatusUpdateData] = useState({ status: 'متاح' as EquipmentStatus, fine: 0, notes: '', isExempt: false });

    const [isFilterCollapsibleOpen, setIsFilterCollapsibleOpen] = useState(false);
    const [eqFilters, setEqFilters] = useState({ search: '', unit: 'ALL', status: 'ALL' });

    const handleOpenDetail = (camp: Event) => {
        setSelectedCamp(camp);
        setViewMode('DETAIL');
        setActiveTab(0);
    };

    const initialForm: Partial<Event> = { title: '', date: new Date().toISOString().split('T')[0], location: '', goals: '', cost: 0, fee: 0, manager: '', isClosed: false, type: 'CAMP', activityExpenses: [], additionalFunding: [], surplusTransfers: [] };
    const [formData, setFormData] = useState<Partial<Event>>(initialForm);

    const handleSave = () => {
        if (!formData.title || !formData.date) return;
        if (onAddCamp) {
            onAddCamp({ ...formData, id: `camp_${Date.now()}` } as Event);
            setShowAddModal(false);
            setFormData(initialForm);
        }
    };

    const handleDeliverEquipment = () => {
        const itemToDeliver = foundItemByUniqueId || (equipmentList || []).find(i => i.id === deliveryData.equipmentId);
        if (!deliveryData.memberId || !itemToDeliver || !selectedCamp || !onUpdateEquipment) return;
        const returnDateStr = `${deliveryData.expectedReturnYear}-${deliveryData.expectedReturnMonth.padStart(2, '0')}-${deliveryData.expectedReturnDay.padStart(2, '0')}`;
        const deliveryDateStr = `${deliveryData.deliveryYear}-${deliveryData.deliveryMonth.padStart(2, '0')}-${deliveryData.deliveryDay.padStart(2, '0')}`;
        const transactionId = `trans_camp_${Date.now()}`;

        const updated = (equipmentList || []).map(item => {
            if (item.id === itemToDeliver.id) {
                return { 
                    ...item, 
                    status: 'مسلم' as EquipmentStatus, 
                    assignedTo: deliveryData.memberId, 
                    eventId: selectedCamp.id, 
                    issuedBy: deliveryData.issuer, 
                    assignmentDate: deliveryDateStr, 
                    returnDate: returnDateStr, 
                    condition: deliveryData.condition as any, 
                    description: deliveryData.notes,
                    activeTransactionId: transactionId
                };
            }
            return item;
        });
        onUpdateEquipment(updated);
        setShowDeliveryModal(false);
        if (onAddNotification) onAddNotification('تم التسليم بنجاح', 'تم تسجيل العهدة للعضو.', 'SUCCESS');
    };

    const confirmStatusUpdate = () => {
        if (!selectedItemForAction || !onUpdateEquipment) return;
        const updated = (equipmentList || []).map(item => {
            if (item.id === selectedItemForAction.id) {
                const isReturning = statusUpdateData.status === 'متاح';
                return { ...item, status: statusUpdateData.status, fineAmount: statusUpdateData.isExempt ? 0 : statusUpdateData.fine, description: statusUpdateData.notes, assignedTo: isReturning ? undefined : item.assignedTo, eventId: isReturning ? undefined : item.eventId, issuedBy: isReturning ? undefined : item.issuedBy, activeTransactionId: isReturning ? undefined : item.activeTransactionId };
            }
            return item;
        });
        onUpdateEquipment(updated);
        setShowStatusUpdateModal(false);
        setShowReturnModal(false);
        setSelectedItemForAction(null);
        if (onAddNotification) onAddNotification('تم التحديث', 'تم توثيق الحالة.', 'SUCCESS');
    };

    const handleReturnItem = (item: EquipmentItem) => {
        setReturnModal({
            isOpen: true,
            item: item,
            condition: item.condition || 'ممتازة',
            notes: ''
        });
    };

    const handleConfirmReturn = () => {
        if(!onUpdateEquipment || !returnModal.item) return;
        const updatedEquipment = (equipmentList || []).map(eq => {
            if(eq.id === returnModal.item?.id) {
                return {
                    ...eq,
                    status: 'متاح' as EquipmentStatus,
                    assignedTo: undefined,
                    eventId: undefined,
                    activeTransactionId: undefined,
                    condition: returnModal.condition as any, // Update with new condition
                    description: returnModal.notes ? `${eq.description || ''} - ملاحظات الإرجاع: ${returnModal.notes}` : eq.description
                };
            }
            return eq;
        });
        onUpdateEquipment(updatedEquipment);
        setReturnModal({ isOpen: false, item: null, condition: 'ممتازة', notes: '' });
        if(onAddNotification) onAddNotification('تم الإرجاع', 'تم تحديث حالة القطعة واسترجاعها للمخزن بنجاح.', 'SUCCESS');
    };

    const handleAddMemberToCamp = (member: Member) => {
        if (!selectedCamp) return;
        const isLeader = member.role.includes('قائد');
        const type = isLeader ? 'leaderIds' : 'participants';
        const currentList = selectedCamp[type] || [];
        if (currentList.includes(member.id)) return;
        const updatedCamp = { ...selectedCamp, [type]: [...currentList, member.id] };
        setSelectedCamp(updatedCamp);
        if (onUpdateCamp) onUpdateCamp(updatedCamp);
    };

    const handleRemoveMemberFromCamp = (memberId: string, isLeader: boolean) => {
        if (!selectedCamp) return;
        const type = isLeader ? 'leaderIds' : 'participants';
        const updatedList = (selectedCamp[type] || []).filter((id: string) => id !== memberId);
        const updatedCamp = { ...selectedCamp, [type]: updatedList };
        setSelectedCamp(updatedCamp);
        if (onUpdateCamp) onUpdateCamp(updatedCamp);
    };

    const renderOverviewTab = () => {
        if (!selectedCamp) return null;
        const actualPart = (selectedCamp.participants?.length || 0) + (selectedCamp.leaderIds?.length || 0);
        const totalFees = ((selectedCamp.participants?.length || 0) * (selectedCamp.fee || 0)) + ((selectedCamp.leaderIds?.length || 0) * (selectedCamp.leaderFee || 500));
        return (
            <div className="space-y-8 animate-fade-in font-['Cairo'] text-right pb-10" dir="rtl">
                <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 h-[280px] group shadow-2xl bg-night-900"><img src={selectedCamp.coverImage} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[5s]" alt="Cover" /><div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent"></div><div className="absolute inset-0 p-8 flex flex-col md:flex-row justify-between items-end gap-6"><div className="space-y-3 max-w-[70%]"><span className="px-4 py-1 rounded-xl text-[10px] font-black uppercase border bg-blue-600/30 text-blue-300 border-blue-500/30">مخيم قادم</span><h1 className="text-4xl font-black text-white leading-tight drop-shadow-2xl">{selectedCamp.title}</h1></div><div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 flex items-center gap-5 shadow-2xl"><div className="text-right"><p className="text-[8px] text-night-400 font-black uppercase tracking-[0.2em]">المشاركين حالياً</p><p className="text-white font-black text-2xl tracking-tighter leading-none flex items-baseline gap-1">{actualPart}</p></div></div></div></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"><div className="bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end text-right"><MapPin size={24} className="text-emerald-400 mb-2"/><p className="text-[10px] text-night-500 font-black uppercase">الميدان</p><h4 className="text-white font-black text-lg truncate w-full text-right">{selectedCamp.location}</h4></div><div className="bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end text-right"><Calendar size={24} className="text-blue-400 mb-2"/><p className="text-[10px] text-night-500 font-black uppercase">الفترة</p><h4 className="text-white font-black text-lg font-mono">{selectedCamp.date}</h4></div><div className="bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end text-right"><Coins size={24} className="text-emerald-300 mb-2"/><p className="text-[10px] text-emerald-500/80 font-black uppercase">إجمالي الإشتراكات</p><div className="flex items-baseline gap-1 justify-end font-black"><span className="text-emerald-400 text-xl tracking-tighter">{totalFees.toLocaleString()}</span><span className="text-[8px] text-emerald-500/40 font-bold uppercase">DZD</span></div></div></div>
            </div>
        );
    };

    const renderEquipmentTab = () => {
        if (!selectedCamp) return null;
        const isClothes = eqSubTab === 'CLOTHES';
        const campItems = (equipmentList || []).filter(item => item.eventId === selectedCamp.id && item.category === (isClothes ? 'لباس' : 'عتاد'));
        const campMembers = members.filter(m => [...(selectedCamp.participants || []), ...(selectedCamp.leaderIds || [])].includes(m.id));
        const filteredMembers = campMembers.filter(m => {
            const matchesSearch = m.fullName.toLowerCase().includes(eqFilters.search.toLowerCase());
            const matchesUnit = eqFilters.unit === 'ALL' || m.unit === eqFilters.unit;
            return matchesSearch && matchesUnit;
        });
        const totalItemsCount = campItems.length;
        const totalFines = campItems.reduce((acc, i) => acc + (i.fineAmount || 0), 0);
        return (
            <div className="space-y-10 animate-fade-in font-['Cairo'] text-right pb-20" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><div className="bg-night-800/40 border border-white/5 p-6 rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center group hover:border-primary-500/30 transition-all"><div className="p-3 bg-primary-600/20 text-primary-400 rounded-2xl mb-3 shadow-inner"><Box size={24}/></div><span className="text-[10px] text-night-500 font-black uppercase tracking-widest mb-1">إجمالي القطع المخصصة</span><p className="text-3xl font-black text-white">{campItems.length}</p></div><div className="bg-night-800/40 border border-white/5 p-6 rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center group hover:border-emerald-500/30 transition-all"><div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl mb-3 shadow-inner"><UserCheck size={24}/></div><span className="text-[10px] text-night-500 font-black uppercase tracking-widest mb-1">الأعضاء المستلمون</span><p className="text-3xl font-black text-white">{new Set(campItems.map(i => i.assignedTo)).size}</p></div><div className="bg-night-800/40 border border-white/5 p-6 rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center group hover:border-amber-500/30 transition-all"><div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl mb-3 shadow-inner"><History size={24}/></div><span className="text-[10px] text-night-500 font-black uppercase tracking-widest mb-1">بانتظار الإرجاع</span><p className="text-3xl font-black text-white">{campItems.filter(i => i.status === 'مسلم').length}</p></div><div className="bg-night-800/40 border border-white/5 p-6 rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center group hover:border-rose-500/30 transition-all"><div className="p-3 bg-rose-600/20 text-rose-400 rounded-2xl mb-3 shadow-inner"><AlertTriangle size={24}/></div><span className="text-[10px] text-night-500 font-black uppercase tracking-widest mb-1">حالات التلف/الفقدان</span><p className="text-3xl font-black text-white">{campItems.filter(i => ['تالف', 'مفقود'].includes(i.status)).length}</p></div></div>
                <div className="flex justify-between items-center bg-night-900/30 p-4 rounded-[2.5rem] border border-white/5"><h3 className="text-4xl font-black text-white leading-none tracking-tight flex items-center gap-5"><div className="p-4 bg-primary-600/10 text-primary-500 rounded-[2rem] border border-primary-500/20 shadow-inner">{isClothes ? <Shirt size={36}/> : <Box size={36}/>}</div>{isClothes ? 'إدارة عهدة اللباس' : 'إدارة عهدة العتاد'}</h3><div className="flex items-center gap-6"><div className="flex bg-night-900 p-1.5 rounded-2xl border border-white/5"><button onClick={() => setEqSubTab('CLOTHES')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isClothes ? 'bg-primary-600 text-white shadow-lg' : 'text-night-400 hover:text-white'}`}>اللباس</button><button onClick={() => setEqSubTab('EQUIPMENT')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${!isClothes ? 'bg-primary-600 text-white shadow-lg' : 'text-night-400 hover:text-white'}`}>العتاد</button></div><button onClick={() => setShowDeliveryModal(true)} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black shadow-2xl transition-all h-[60px] whitespace-nowrap"><Plus size={24}/> إضافة عهدة جديدة</button></div></div>
                <div className="bg-night-800 border border-white/10 rounded-[3rem] overflow-hidden shadow-3xl backdrop-blur-2xl"><div className="p-8 border-b border-white/10 flex flex-col lg:flex-row items-center gap-4"><div className="relative flex-1 w-full group"><input type="text" placeholder={`البحث في قوائم ${isClothes ? 'اللباس' : 'العتاد'}...`} className="w-full bg-night-900 border border-white/10 rounded-2xl py-4 pr-16 pl-40 text-white text-base font-bold outline-none focus:border-primary-500 transition-all shadow-inner" value={eqFilters.search} onChange={e => setEqFilters({...eqFilters, search: e.target.value})} /><Search className="absolute right-6 top-1/2 -translate-y-1/2 text-night-500" size={22} /><div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2"><div className="h-8 w-px bg-white/10 mx-2"></div><button onClick={() => setIsFilterCollapsibleOpen(!isFilterCollapsibleOpen)} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-xs transition-all border ${isFilterCollapsibleOpen ? 'bg-primary-600 border-primary-500 text-white' : 'bg-night-950 border-white/5 text-night-400 hover:text-white'}`}><Filter size={14} /><span>تصفية</span></button></div></div></div>
                {isFilterCollapsibleOpen && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 pt-0 animate-slide-in bg-night-900/20"><CustomDropdown label="الوحدة الكشفية" options={[{value: 'ALL', label: 'كل الوحدات'}, ...UNITS_LIST.map(u => ({value: u, label: u}))]} value={eqFilters.unit} onChange={(v: any) => setEqFilters({...eqFilters, unit: v})} icon={Layers} placeholder="اختر الوحدة" /><CustomDropdown label="حالة العهدة" options={[{value: 'ALL', label: 'الكل'}, {value: 'PAID', label: 'مسلمة'}, {value: 'UNPAID', label: 'بانتظار التسليم'}]} value={eqFilters.status} onChange={(v: any) => setEqFilters({...eqFilters, status: v})} icon={ShieldCheck} placeholder="حسب الحالة" /></div>)}
                <div className="overflow-x-auto"><table className="w-full text-right border-collapse min-w-[1200px]"><thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5"><tr><th className="p-8">الإسم الكامل</th><th className="p-8">رقم القطعة</th><th className="p-8">القطعة</th><th className="p-8 text-center">العدد</th><th className="p-8">تاريخ التسليم</th><th className="p-8">الحالة</th><th className="p-8">المسؤول</th><th className="p-8 text-center">الاجراءات</th></tr></thead><tbody className="divide-y divide-white/5 text-sm font-bold">{filteredMembers.map(member => { const memberItems = campItems.filter(i => i.assignedTo === member.id); return memberItems.length > 0 ? memberItems.map((item, idx) => (<tr key={item.id} className="hover:bg-primary-500/5 transition-all group/row">{idx === 0 ? (<td className="p-6" rowSpan={memberItems.length}><div className="flex items-center gap-5 cursor-pointer" onClick={() => { setSelectedMemberForDetail(member); setShowMemberDetailModal(true); }}><div className="relative"><img src={member.image} className="w-12 h-12 rounded-2xl border-2 border-night-700 shadow-xl" /><div className="absolute -bottom-1 -right-1 bg-night-900 rounded-full p-1 border border-white/10 shadow-lg"><UserCircle2 size={12} className="text-primary-400"/></div></div><div className="text-right"><p className="font-black text-white text-base leading-none mb-1 group-hover/row:text-primary-400 transition-colors">{member.fullName}</p><p className="text-[9px] text-night-500 font-black uppercase tracking-widest leading-tight">ID: {member.membershipNumber}</p></div></div></td>) : null}<td className="p-6 font-mono text-primary-400 text-xs tracking-widest">{item.uniqueId}</td><td className="p-6 text-white text-right">{item.name}</td><td className="p-6 text-center text-night-300">1</td><td className="p-6 text-night-400 font-mono text-xs">{item.assignmentDate || '---'}</td><td className="p-6 text-right"><span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border shadow-inner inline-flex items-center gap-2 ${item.status === 'مسلم' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : item.status === 'تالف' ? 'bg-amber-600/10 text-amber-400 border-amber-500/20' : 'bg-rose-600/10 text-rose-400 border-rose-500/20'}`}>{item.status}</span></td><td className="p-6 text-night-400 font-bold text-right">{item.issuedBy || '---'}</td><td className="p-6 text-center"><div className="flex justify-center gap-3"><button onClick={() => { setSelectedItemForAction(item); setShowMemberDetailModal(true); }} className="p-3 bg-white/5 hover:bg-primary-600 rounded-xl text-night-300 hover:text-white transition-all shadow-xl border border-white/5"><Eye size={18}/></button><button onClick={() => { setSelectedItemForAction(item); setStatusUpdateData({status: 'تالف', fine: 500, notes: '', isExempt: false}); setShowStatusUpdateModal(true); }} className="p-3 bg-white/5 hover:bg-rose-600 rounded-xl text-night-300 hover:text-white transition-all shadow-xl border border-white/5"><AlertTriangle size={18}/></button>
                {item.status === 'مسلم' && (
                    <button 
                    onClick={() => handleReturnItem(item)}
                    className="p-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl transition-all shadow-xl border border-white/5"
                    title="استرجاع للمخزن"
                    >
                        <RefreshCcw size={18}/>
                    </button>
                )}
                </div></td></tr>)) : (<tr key={member.id} className="hover:bg-primary-500/5 transition-all group/row"><td className="p-6"><div className="flex items-center gap-5 cursor-pointer"><div className="relative"><img src={member.image} className="w-12 h-12 rounded-2xl border-2 border-night-700 shadow-xl opacity-40 grayscale" /></div><div className="text-right"><p className="font-black text-night-400 text-base leading-none mb-1">{member.fullName}</p></div></div></td><td colSpan={7} className="p-6 text-center text-night-600 font-black italic opacity-30">لم يستلم عهدة بعد</td></tr>); })}</tbody></table></div></div>
            
                {/* Return Modal (New) */}
                <Modal isOpen={returnModal.isOpen} onClose={() => setReturnModal({ ...returnModal, isOpen: false })} title="إرجاع العتاد إلى المخزن" maxWidth="max-w-md">
                    <div className="space-y-6">
                        <div className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-primary-400"><Box size={24} /></div>
                            <div>
                                <h4 className="text-white font-black">{returnModal.item?.name}</h4>
                                <p className="text-xs text-night-400 font-mono">{returnModal.item?.uniqueId}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">حالة القطعة عند الإرجاع</label>
                            <CustomDropdown 
                                options={['ممتازة', 'جيدة', 'تحتاج صيانة', 'تالفة'].map(s => ({ value: s, label: s }))}
                                value={returnModal.condition}
                                onChange={(v: string) => setReturnModal({ ...returnModal, condition: v })}
                                placeholder="اختر الحالة..."
                                icon={ClipboardCheck}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">ملاحظات الإرجاع</label>
                            <textarea 
                                className="w-full h-24 bg-night-900 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-primary-500 resize-none font-bold"
                                placeholder="أي ملاحظات إضافية حول حالة القطعة..."
                                value={returnModal.notes}
                                onChange={e => setReturnModal({ ...returnModal, notes: e.target.value })}
                            />
                        </div>

                        <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                            <Info size={20} className="text-emerald-400" />
                            <p className="text-[11px] text-emerald-300 leading-relaxed font-bold">سيتم تحديث حالة القطعة إلى "متاح" في المخزن الرئيسي مع تسجيل الحالة الجديدة.</p>
                        </div>

                        <button onClick={handleConfirmReturn} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl transition-all transform hover:scale-105">تأكيد الإرجاع للمخزن</button>
                    </div>
                </Modal>
            </div>
        );
    };

    const renderParticipantsTab = () => {
        if (!selectedCamp) return null;
        const scoutIds = selectedCamp.participants || [];
        const leaderIds = selectedCamp.leaderIds || [];
        const scouts = members.filter(m => scoutIds.includes(m.id));
        const leaders = members.filter(m => leaderIds.includes(m.id));
        const maxPart = selectedCamp.maxParticipants || 50;
        const fillRate = Math.round(((scouts.length + leaders.length) / maxPart) * 100) || 0;
        const leaderFeeTotal = leaders.length * (selectedCamp.leaderFee || 500);
        const scoutFeeTotal = scouts.length * (selectedCamp.fee || 0);
        const scoutCandidates = members.filter(m => !m.role.includes('قائد')).filter(m => !scoutIds.includes(m.id)).filter(m => !selectedCamp.targetUnits || selectedCamp.targetUnits.length === 0 || selectedCamp.targetUnits.includes(m.unit as any)).filter(m => m.fullName.includes(searchMember));
        const leaderCandidates = members.filter(m => m.role.includes('قائد')).filter(m => !leaderIds.includes(m.id)).filter(m => m.fullName.includes(searchMember));
        return (
            <div className="space-y-10 animate-fade-in font-['Cairo'] text-right pb-20" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><div className="bg-night-800/60 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-xl group"><div className="p-4 rounded-2xl bg-primary-600/20 text-primary-400 transition-all"><Users size={32} /></div><div><p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي المشاركين</p><p className="text-white font-black text-3xl leading-none">{scouts.length + leaders.length}</p></div></div><div className="bg-night-800/60 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-xl group"><div className="p-4 rounded-2xl bg-emerald-600/20 text-emerald-400 transition-all"><TrendingUp size={32} /></div><div><p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">نسبة التعبئة</p><p className="text-white font-black text-3xl leading-none">{fillRate}%</p></div></div><div className="bg-night-800/60 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-xl group"><div className="p-4 rounded-2xl bg-amber-600/20 text-amber-400 transition-all"><DollarSign size={32} /></div><div><p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي الاشتراكات</p><p className="text-white font-black text-2xl leading-none">{(leaderFeeTotal + scoutFeeTotal).toLocaleString()} <span className="text-xs">دج</span></p></div></div><button onClick={() => { setAddParticipantModalTab('LEADERS'); setIsAddParticipantOpen(true); }} className="bg-primary-600 hover:bg-primary-500 text-white rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all font-black py-6 ring-4 ring-primary-600/20"><UserPlus size={32} /><span className="text-lg">تسجيل قائد</span></button></div>
                <div className="bg-night-800/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl"><div className="p-8 bg-night-900/40 border-b border-white/5 flex justify-between items-center"><h3 className="text-2xl font-black text-white flex items-center gap-4"><Crown className="text-yellow-500" size={28}/> هيئة القيادة</h3><span className="bg-white/5 px-4 py-1 rounded-xl text-xs text-night-400 border border-white/10 font-bold">{leaders.length} قائد</span></div><div className="overflow-x-auto"><table className="w-full text-right border-collapse text-sm font-bold"><thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5"><tr><th className="p-6">الإسم الكامل</th><th className="p-6">رقم العضوية</th><th className="p-6">الوحدة</th><th className="p-6">تاريخ الميلاد</th><th className="p-6 text-center">اجراءات</th></tr></thead><tbody className="divide-y divide-white/5 text-sm font-bold">{leaders.map(m => (<tr key={m.id} className="hover:bg-white/5 transition-all group/row"><td className="p-5 flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-900 shadow-md" /><p className="font-black text-white">{m.fullName}</p></td><td className="p-5 text-night-400 font-mono tracking-widest">{m.membershipNumber}</td><td className="p-5 text-night-300">{m.unit}</td><td className="p-5 text-night-400 font-mono">{m.birthDate}</td><td className="p-5 text-center"><button onClick={() => handleRemoveMemberFromCamp(m.id, true)} className="p-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all shadow-xl"><UserX size={20}/></button></td></tr>))}</tbody></table></div></div>
                <div className="bg-night-800/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl"><div className="p-8 bg-night-900/40 border-b border-white/5 flex justify-between items-center"><h3 className="text-2xl font-black text-white flex items-center gap-4"><Users className="text-primary-500" size={28}/> قائمة الكشافين</h3><span className="bg-white/5 px-4 py-1 rounded-xl text-xs text-night-400 border border-white/10 font-bold">{scouts.length} كشاف</span></div><div className="overflow-x-auto"><table className="w-full text-right border-collapse text-sm font-bold"><thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5"><tr><th className="p-6">الإسم الكامل</th><th className="p-6">رقم العضوية</th><th className="p-6">الوحدة</th><th className="p-6 text-center">اجراءات</th></tr></thead><tbody className="divide-y divide-white/5 text-sm font-bold">{scouts.map(m => (    <tr key={m.id} className="hover:bg-white/5 transition-all group/row"><td className="p-5 flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-900 shadow-md" /><p className="font-black text-white">{m.fullName}</p></td><td className="p-5 text-night-400 font-mono tracking-widest">{m.membershipNumber}</td><td className="p-5 text-night-300">{m.unit}</td><td className="p-5 text-center"><button onClick={() => handleRemoveMemberFromCamp(m.id, false)} className="p-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all shadow-xl"><UserX size={20}/></button></td></tr>))}</tbody></table></div></div>
                <Modal isOpen={isAddParticipantOpen} onClose={() => setIsAddParticipantOpen(false)} title={addParticipantModalTab === 'LEADERS' ? "إضافة قائد" : "إضافة كشاف"} maxWidth="max-w-lg" overlayClassName="bg-transparent backdrop-blur-none"><div className="space-y-6 flex flex-col animate-fade-in" dir="rtl"><div className="relative"><input type="text" placeholder="ابحث..." className="w-full bg-night-900 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white text-sm outline-none font-bold" value={searchMember} onChange={e => setSearchMember(e.target.value)} /><Search size={18} className="absolute right-4 top-4 text-night-400" /></div><div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-3 pr-1">{addParticipantModalTab === 'LEADERS' ? leaderCandidates.map(m => (<div key={m.id} className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center transition-all shadow-md"><div className="flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-xl border border-white/10" /><div className="text-right"><p className="font-bold text-white text-sm">{m.fullName}</p></div></div><button onClick={() => handleAddMemberToCamp(m)} className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg transition-all"><Plus size={18}/></button></div>)) : scoutCandidates.map(m => (<div key={m.id} className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center transition-all shadow-md"><div className="flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-xl border border-white/10" /><div className="text-right"><p className="font-bold text-white text-sm">{m.fullName}</p></div></div><button onClick={() => handleAddMemberToCamp(m)} className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg transition-all"><Plus size={18}/></button></div>))}</div></div></Modal>
            </div>
        );
    };

    const renderFinanceTab = () => {
        if (!selectedCamp) return null;
        const scoutFeesTotal = (selectedCamp.participants?.length || 0) * (selectedCamp.fee || 0);
        const leaderFeesTotal = (selectedCamp.leaderIds?.length || 0) * (selectedCamp.leaderFee || 500);
        const additionalFundingTotal = selectedCamp.additionalFunding?.reduce((sum, f) => sum + f.amount, 0) || 0;
        const totalIncome = scoutFeesTotal + leaderFeesTotal + additionalFundingTotal;
        const totalExpenses = selectedCamp.activityExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
        const surplus = totalIncome - totalExpenses;
        return (
            <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-20" dir="rtl"><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="bg-gradient-to-br from-emerald-600/20 to-night-900 border border-emerald-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"><p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest mb-2">إجمالي المداخيل</p><h3 className="text-4xl font-black text-white">{totalIncome.toLocaleString()} دج</h3></div><div className="bg-gradient-to-br from-rose-600/20 to-night-900 border border-rose-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"><p className="text-rose-500/60 text-[10px] font-black uppercase tracking-widest mb-2">إجمالي المصاريف</p><h3 className="text-4xl font-black text-white">{totalExpenses.toLocaleString()} دج</h3></div><div className={`bg-gradient-to-br ${surplus >= 0 ? 'from-primary-600/20' : 'from-red-600/20'} to-night-900 border ${surplus >= 0 ? 'border-primary-500/20' : 'border-red-500/20'} p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group`}><p className={`${surplus >= 0 ? 'text-primary-400' : 'text-red-400'} text-[10px] font-black uppercase tracking-widest mb-2`}>صافي الفائض</p><h3 className={`text-4xl font-black ${surplus >= 0 ? 'text-white' : 'text-red-400'}`}>{surplus.toLocaleString()} دج</h3></div></div></div>
        );
    };

    if (viewMode === 'DETAIL' && selectedCamp) {
        return (
            <div className="p-8 h-full flex flex-col animate-fade-in relative font-['Cairo'] text-right" dir="rtl">
                <div className="flex items-center justify-between mb-10"><div className="flex items-center gap-6"><button onClick={() => setViewMode('LIST')} className="p-4 bg-night-800 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all shadow-lg group ring-4 ring-primary-600/5"><ChevronLeft size={28} className="rtl:rotate-180" /></button><div><span className="text-[10px] text-primary-400 font-black uppercase tracking-[0.3em] mb-1 block">تفاصيل الفعالية الكبرى</span><h2 className="text-4xl font-black text-white tracking-tight">{selectedCamp.title}</h2></div></div></div>
                <div className="flex bg-night-800/30 p-1 rounded-2xl border border-white/5 mb-10 self-start shadow-inner overflow-x-auto no-scrollbar">{[{ label: 'نظرة عامة', icon: LayoutDashboard }, { label: 'المشاركون', icon: Users }, { label: 'المالية', icon: TrendingUp }, { label: 'العتاد واللباس', icon: Box }, { label: 'تقرير المخيم', icon: FileText }, { label: 'التقييم', icon: Star }, { label: 'الإحصائيات', icon: BarChart3 }].map((tab, idx) => (<button key={idx} onClick={() => setActiveTab(idx)} className={`px-12 py-4 font-black text-xs rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === idx ? 'bg-primary-600 text-white shadow-xl' : 'text-night-400 hover:text-white hover:bg-white/5'}`}><tab.icon size={16}/> {tab.label} </button>))}</div>
                <div className="flex-1 overflow-y-auto no-scrollbar">{activeTab === 0 && renderOverviewTab()} {activeTab === 1 && renderParticipantsTab()} {activeTab === 2 && renderFinanceTab()} {activeTab === 3 && renderEquipmentTab()} {activeTab === 4 && (<div className="animate-fade-in bg-night-800/40 p-12 rounded-[3rem] border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center"><FileText size={64} className="text-primary-400/20 mb-6" /><h3 className="text-2xl font-black text-white mb-2">تقرير المخيم</h3><p className="text-night-400 font-bold max-w-md">هذا القسم مخصص لإدراج التقارير الأدبية والتربوية المفصلة للمخيم بعد انتهائه.</p></div>)} {activeTab === 5 && (<div className="animate-fade-in bg-night-800/40 p-12 rounded-[3rem] border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center"><Star size={64} className="text-yellow-400/20 mb-6" /><h3 className="text-2xl font-black text-white mb-2">التقييم</h3><p className="text-night-400 font-bold max-w-md">تحليل نقاط القوة والضعف وقياس مدى تحقيق الأهداف التربوية المسطرة للمخيم.</p></div>)} {activeTab === 6 && (<div className="animate-fade-in bg-night-800/40 p-12 rounded-[3rem] border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center"><BarChart3 size={64} className="text-emerald-400/20 mb-6" /><h3 className="text-2xl font-black text-white mb-2">الإحصائيات</h3><p className="text-night-400 font-bold max-w-md">تحليل بياني لحضور الوحدات، استهلاك الميزانية، وتوزع المشاركين في المخيم.</p></div>)}</div>
            </div>
        );
    }

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col font-['Cairo'] text-right" dir="rtl">
            <div className="flex justify-between items-center mb-12"><div><h2 className="text-4xl font-black text-white mb-3 tracking-tighter leading-none">المخيمات والرحلات الكبرى</h2><p className="text-night-400 text-xl font-bold opacity-80 uppercase tracking-widest">إدارة وتخطيط الفعاليات الميدانية وحياة الخلاء.</p></div><button onClick={() => setShowAddModal(true)} className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-[2rem] flex items-center gap-3 font-black shadow-2xl transition-all active:scale-95 group"><Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" /> تسجيل مخيم جديد</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">{camps.length > 0 ? camps.map(camp => (<div key={camp.id} onClick={() => handleOpenDetail(camp)} className="bg-night-800 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary-500/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-500 cursor-pointer group flex flex-col relative shadow-xl"><div className="h-60 overflow-hidden relative"><img src={camp.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={camp.title} /><div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent opacity-90"></div></div><div className="p-10 flex-1 flex flex-col font-['Cairo']"><h3 className="text-3xl font-black text-white group-hover:text-primary-400 transition-colors mb-4 line-clamp-1 tracking-tighter">{camp.title}</h3></div></div>)) : (<div className="col-span-full flex flex-col items-center justify-center py-40 bg-night-800/30 rounded-[4rem] border-4 border-white/5 border-dashed relative overflow-hidden group"><div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-white/5 transform group-hover:rotate-12 transition-transform"><Tent size={80} className="text-night-700" /></div><p className="text-night-500 text-3xl font-black opacity-50 tracking-tighter">أرشيف المخيمات فارغ حالياً</p></div>)}</div>
        </div>
    );
};

export default Camps;
