import React, { useState, useMemo } from 'react';
import { Event, Member, UnitName, ActivityExpense, ActivityFundingSource, Treasury, BankAccount, EquipmentItem, EquipmentStatus, ApprovalStatus } from '../types';
import { UNITS_LIST } from '../constants';
import { 
    Calendar, MapPin, Users, Plus, 
    ChevronLeft, Clock, Target, ArrowUpRight, Save, X, DollarSign, Briefcase, Tent, Image as ImageIcon,
    Sparkles, Shield, UserCog, Tag, Layers, Info, BadgeDollarSign, Coins, UserPlus, CheckCircle2, AlertCircle, AlertTriangle, UserX, Crown, Search, Printer, Edit, Trash2, Timer,
    LayoutDashboard, TrendingUp, TrendingDown, HandCoins, Receipt, ArrowRightLeft, History, Eye, Download, Box, Shirt, Filter, ShieldCheck, Gavel, RefreshCcw, UserCheck, AlertOctagon,
    Check
} from 'lucide-react';

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

const EXPENSE_TYPES = [
    'نقل', 'تغذية', 'لوازم', 'كراء', 'خدمات', 'طباعة', 'تجهيزات', 'مصاريف أخرى'
];

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

    // --- Finance Tab Logic States ---
    const [showAddFundingModal, setShowAddFundingModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showTransferSurplusModal, setShowTransferSurplusModal] = useState(false);

    const [newFunding, setNewFunding] = useState<Partial<ActivityFundingSource>>({ label: '', amount: 0, date: new Date().toISOString().split('T')[0] });
    const [newExpense, setNewExpense] = useState<Partial<ActivityExpense>>({ day: '1', type: 'تغذية', amount: 0, date: new Date().toISOString().split('T')[0], purpose: '', source: '', notes: '' });
    const [transferSurplus, setTransferSurplus] = useState({ amount: 0, destination: '', managerApproval: false });

    // --- Equipment Tab States ---
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
    const [selectedItemForAction, setSelectedItemForAction] = useState<EquipmentItem | null>(null);
    const [deliveryData, setDeliveryData] = useState({ memberId: '', equipmentId: '', issuer: 'مسؤول العتاد' });
    const [statusUpdateData, setStatusUpdateData] = useState({ status: 'تالف' as EquipmentStatus, fine: 0, notes: '', isExempt: false });

    // Reports Filtering
    const [reportFilter, setReportFilter] = useState({ memberSearch: '', unit: 'ALL', type: 'ALL' });

    // Dynamic Funding Source Options (Dropdown Only)
    const fundingSourceOptions = useMemo(() => [
        { value: 'مساعدات', label: 'مساعدات' },
        { value: 'إعانات', label: 'إعانات' },
        { value: 'مساهمات المنخرطين', label: 'مساهمات المنخرطين' },
        { value: 'مساهمات القادة', label: 'مساهمات القادة' },
        ...treasuries.map(t => ({ value: `خزينة: ${t.name}`, label: `خزينة: ${t.name}` })),
        ...bankAccounts.map(b => ({ value: `بنك: ${b.bankName}`, label: `بنك: ${b.bankName}` }))
    ], [treasuries, bankAccounts]);

    const initialForm: Partial<Event> = {
        title: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop',
        targetUnits: [],
        participants: [],
        leaderIds: [],
        goals: '',
        cost: 0,
        fee: 0,
        manager: '',
        isClosed: false,
        type: 'CAMP',
        activityExpenses: [],
        additionalFunding: [],
        surplusTransfers: []
    };

    const [formData, setFormData] = useState<Partial<Event>>(initialForm);

    const handleOpenDetail = (camp: Event) => {
        setSelectedCamp(camp);
        setViewMode('DETAIL');
        setActiveTab(0);
    };

    const handleSave = () => {
        if (!formData.title || !formData.date) return;
        if (onAddCamp) {
            onAddCamp({ ...formData, id: `camp_${Date.now()}` } as Event);
            setShowAddModal(false);
            setFormData(initialForm);
        }
    };

    const getDaysRemaining = (dateStr: string) => {
        try {
            const today = new Date();
            today.setHours(0,0,0,0);
            const target = new Date(dateStr);
            target.setHours(0,0,0,0);
            const diff = target.getTime() - today.getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        } catch { return 0; }
    };

    const handleDeliverEquipment = () => {
        if (!deliveryData.memberId || !deliveryData.equipmentId || !selectedCamp || !onUpdateEquipment) return;
        const updated = (equipmentList || []).map(item => {
            if (item.id === deliveryData.equipmentId) {
                return {
                    ...item,
                    status: 'مسلم' as EquipmentStatus,
                    assignedTo: deliveryData.memberId,
                    eventId: selectedCamp.id,
                    issuedBy: deliveryData.issuer,
                    assignmentDate: new Date().toISOString().split('T')[0]
                };
            }
            return item;
        });
        onUpdateEquipment(updated);
        setShowDeliveryModal(false);
        if (onAddNotification) onAddNotification('تم التسليم بنجاح', 'تم تسجيل العهدة للعضو وتحديث المخزن المركزي.', 'SUCCESS');
        setDeliveryData({ memberId: '', equipmentId: '', issuer: 'مسؤول العتاد' });
    };

    const handleUpdateStatusConfirm = () => {
        if (!selectedItemForAction || !onUpdateEquipment) return;
        const updated = (equipmentList || []).map(item => {
            if (item.id === selectedItemForAction.id) {
                return {
                    ...item,
                    status: statusUpdateData.status,
                    fineAmount: statusUpdateData.isExempt ? 0 : statusUpdateData.fine,
                    description: statusUpdateData.notes
                };
            }
            return item;
        });
        onUpdateEquipment(updated);
        setShowStatusUpdateModal(false);
        setSelectedItemForAction(null);
        if (onAddNotification) onAddNotification('تم تحديث الحالة', 'تم تسجيل حالة القطعة وتحديث السجل المالي للعهدة.', 'SUCCESS');
    };

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

    // --- TAB 1: نظرة عامة (محمي) ---
    const renderOverviewTab = () => {
        if (!selectedCamp) return null;
        const maxPart = 100;
        const actualScouts = selectedCamp.participants?.length || 0;
        const actualLeaders = selectedCamp.leaderIds?.length || 0;
        const actualPart = actualScouts + actualLeaders;
        const rate = Math.round((actualPart / maxPart) * 100) || 0;
        
        const leaderFee = 500;
        const scoutFee = selectedCamp.fee || 0;
        const totalFees = (actualScouts * scoutFee) + (actualLeaders * leaderFee);

        return (
            <div className="space-y-8 animate-fade-in font-['Cairo'] text-right pb-10" dir="rtl">
                <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 h-[280px] group shadow-[0_30px_100px_rgba(0,0,0,0.7)] bg-night-900 transition-all duration-700">
                    <img src={selectedCamp.coverImage} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[5s] ease-out" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent"></div>
                    <div className="absolute inset-0 p-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="space-y-3 max-w-[70%] animate-slide-in">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-4 py-1 rounded-xl text-[10px] font-black uppercase border animate-pulse bg-blue-600/30 text-blue-300 border-blue-500/30">مخيم قادم</span>
                            </div>
                            <h1 className="text-4xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">{selectedCamp.title}</h1>
                        </div>
                        <div className="relative group/stat">
                            <div className="bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-5 flex items-center gap-5 shadow-[0_40px_80px_rgba(0,0,0,0.5)] transform group-hover/stat:scale-105 transition-all duration-700 ring-1 ring-white/10">
                                <div className="relative w-20 h-20">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1.5" fill="transparent" className="text-white/5" />
                                        <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="5" fill="transparent" strokeDasharray={226.2} strokeDashoffset={226.2 - (226.2 * rate) / 100} className="transition-all duration-[2s] ease-out" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-lg font-black text-white leading-none tracking-tighter">{rate}%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] text-night-400 font-black uppercase tracking-[0.2em]">التقرير اللحظي</p>
                                    <p className="text-white font-black text-2xl tracking-tighter leading-none flex items-baseline gap-1">{actualPart} <span className="text-[10px] text-night-500 font-bold">/ {maxPart}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="relative bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end">
                        <MapPin size={24} className="text-emerald-400 mb-2"/>
                        <p className="text-[10px] text-night-500 font-black uppercase">الميدان</p>
                        <h4 className="text-white font-black text-lg truncate w-full text-right">{selectedCamp.location}</h4>
                    </div>
                    <div className="relative bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end">
                        <Calendar size={24} className="text-blue-400 mb-2"/>
                        <p className="text-[10px] text-night-500 font-black uppercase">الفترة</p>
                        <h4 className="text-white font-black text-lg font-mono">{selectedCamp.date}</h4>
                    </div>
                    <div className="relative bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end">
                        <Coins size={24} className="text-emerald-300 mb-2"/>
                        <p className="text-[10px] text-emerald-500/80 font-black uppercase">إجمالي الإشتراكات</p>
                        <div className="flex items-baseline gap-1 justify-end font-black"><span className="text-emerald-400 text-xl tracking-tighter">{totalFees.toLocaleString()}</span><span className="text-[8px] text-emerald-500/40 font-bold uppercase">DZD</span></div>
                    </div>
                </div>
            </div>
        );
    };

    // --- TAB 3: المالية (محمي) ---
    const renderFinanceTab = () => {
        if (!selectedCamp) return null;
        const scoutFeesTotal = (selectedCamp.participants?.length || 0) * (selectedCamp.fee || 0);
        const leaderFeesTotal = (selectedCamp.leaderIds?.length || 0) * (selectedCamp.leaderFee || 500);
        const additionalFundingTotal = selectedCamp.additionalFunding?.reduce((sum, f) => sum + f.amount, 0) || 0;
        const totalIncome = scoutFeesTotal + leaderFeesTotal + additionalFundingTotal;
        const totalExpenses = selectedCamp.activityExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
        const surplus = totalIncome - totalExpenses;

        return (
            <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-20" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-emerald-600/20 to-night-900 border border-emerald-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 text-emerald-500/10 group-hover:scale-110 transition-transform"><TrendingUp size={80}/></div>
                        <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest mb-2">إجمالي تمويل المخيم</p>
                        <h3 className="text-4xl font-black text-white">{totalIncome.toLocaleString()} <small className="text-xs">دج</small></h3>
                        <div className="flex gap-4 mt-6">
                          <div className="flex flex-col"><span className="text-[9px] text-night-500 font-black">اشتراكات تلقائية</span><span className="text-sm font-bold">{(scoutFeesTotal + leaderFeesTotal).toLocaleString()}</span></div>
                          <div className="flex flex-col border-r border-white/10 pr-4"><span className="text-[9px] text-night-500 font-black">موارد إضافية</span><span className="text-sm font-bold">{additionalFundingTotal.toLocaleString()}</span></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-rose-600/20 to-night-900 border border-rose-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 text-rose-500/10 group-hover:scale-110 transition-transform"><TrendingDown size={80}/></div>
                        <p className="text-rose-500/60 text-[10px] font-black uppercase tracking-widest mb-2">إجمالي مصاريف المخيم</p>
                        <h3 className="text-4xl font-black text-white">{totalExpenses.toLocaleString()} <small className="text-xs">دج</small></h3>
                        <button onClick={() => setShowAddExpenseModal(true)} className="mt-6 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 w-fit relative z-10 font-['Cairo']"><Plus size={14}/> تسجيل مصروف جديد</button>
                    </div>

                    <div className={`bg-gradient-to-br ${surplus >= 0 ? 'from-primary-600/20' : 'from-red-600/20'} to-night-900 border ${surplus >= 0 ? 'border-primary-500/20' : 'border-red-500/20'} p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group`}>
                        <p className={`${surplus >= 0 ? 'text-primary-400' : 'text-red-400'} text-[10px] font-black uppercase tracking-widest mb-2`}>صافي المتبقى</p>
                        <h3 className={`text-4xl font-black ${surplus >= 0 ? 'text-white' : 'text-red-400'}`}>{surplus.toLocaleString()} <small className="text-xs">دج</small></h3>
                        <button 
                            onClick={() => setShowTransferSurplusModal(true)}
                            disabled={surplus <= 0}
                            className="mt-6 px-8 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 text-white rounded-xl text-xs font-black shadow-xl transition-all flex items-center gap-3 w-fit relative z-10 font-['Cairo']"
                        >
                            <ArrowRightLeft size={16}/> تحويل المتبقى للمالية
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xl font-black text-white flex items-center gap-3 font-['Cairo']"><HandCoins className="text-emerald-500" size={24}/> مصادر تمويل المخيم</h4>
                          <button onClick={() => setShowAddFundingModal(true)} className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-500/20 shadow-lg"><Plus size={20}/></button>
                        </div>
                        <div className="bg-night-800/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                            <table className="w-full text-right border-collapse font-['Cairo']">
                                <thead className="bg-night-950 text-night-300 text-[9px] font-black uppercase tracking-widest border-b border-white/5">
                                    <tr><th className="p-5">المصدر</th><th className="p-5">المبلغ</th><th className="p-5">التاريخ</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs font-bold">
                                    <tr className="bg-emerald-500/5"><td className="p-5 text-white">اشتراكات الكشافين (تلقائي)</td><td className="p-5 text-emerald-400">{scoutFeesTotal.toLocaleString()}</td><td className="p-5 text-night-500 font-black">مرتبط بالمشاركين</td></tr>
                                    <tr className="bg-emerald-500/5"><td className="p-5 text-white">اشتراكات القادة (تلقائي)</td><td className="p-5 text-emerald-400">{leaderFeesTotal.toLocaleString()}</td><td className="p-5 text-night-500 font-black">مرتبط بالمشاركين</td></tr>
                                    {selectedCamp.additionalFunding?.map(f => (
                                        <tr key={f.id} className="hover:bg-white/5 transition-colors"><td className="p-5 text-white">{f.label}</td><td className="p-5 text-emerald-400">{f.amount.toLocaleString()}</td><td className="p-5 text-night-400 font-mono">{f.date}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        <h4 className="text-xl font-black text-white flex items-center gap-3 font-['Cairo']"><Receipt className="text-rose-500" size={24}/> مصاريف المخيم</h4>
                        <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl font-['Cairo']">
                            <div className="overflow-x-auto">
                                <table className="w-full text-right border-collapse text-xs font-bold">
                                    <thead className="bg-night-950 text-night-300 text-[9px] font-black uppercase tracking-widest border-b border-white/5">
                                        <tr><th className="p-5">اليوم</th><th className="p-5">نوع المصروف</th><th className="p-5">المبلغ</th><th className="p-5">التاريخ</th><th className="p-5">الغرض</th><th className="p-5">المصدر</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {selectedCamp.activityExpenses?.sort((a,b) => Number(a.day) - Number(b.day)).map(e => (
                                            <tr key={e.id} className="hover:bg-white/5 transition-colors font-['Cairo']">
                                                <td className="p-5 text-white font-black text-lg text-center bg-white/5">يوم {e.day}</td>
                                                <td className="p-5"><span className="bg-rose-900/30 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg font-black">{e.type}</span></td>
                                                <td className="p-5 text-white text-lg font-black">{e.amount.toLocaleString()}</td>
                                                <td className="p-5 text-night-400 font-mono">{e.date}</td>
                                                <td className="p-5 text-night-300">{e.purpose}</td>
                                                <td className="p-5"><span className="text-night-500 text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10">{e.source}</span></td>
                                            </tr>
                                        ))}
                                        {(!selectedCamp.activityExpenses || selectedCamp.activityExpenses.length === 0) && (
                                            <tr><td colSpan={6} className="p-16 text-center text-night-600 font-bold italic opacity-40">لا توجد مصاريف مسجلة لهذا المخيم.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {selectedCamp.activityExpenses && selectedCamp.activityExpenses.length > 0 && (
                            <div className="p-6 bg-night-900/60 rounded-3xl border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 font-['Cairo']">
                                {Array.from(new Set(selectedCamp.activityExpenses.map(e => e.day))).map(day => {
                                    const dayTotal = selectedCamp.activityExpenses?.filter(e => e.day === day).reduce((sum, e) => sum + e.amount, 0);
                                    return (
                                        <div key={day} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-[9px] text-night-500 font-black uppercase">إجمالي يوم {day}</p>
                                            <p className="text-white font-bold">{dayTotal?.toLocaleString()} <small className="text-[10px]">دج</small></p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <Modal isOpen={showAddFundingModal} onClose={() => setShowAddFundingModal(false)} title="إضافة مصدر تمويل للمخيم" maxWidth="max-w-md">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">قائمة مصادر التمويل (Dropdown فقط)</label>
                            <select 
                                className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none font-['Cairo']" 
                                value={newFunding.label} 
                                onChange={e => setNewFunding({...newFunding, label: e.target.value})}
                            >
                                <option value="">اختر المصدر من القائمة...</option>
                                {fundingSourceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">المبلغ المستلم</label>
                            <input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-emerald-400 font-black text-xl font-['Cairo']" value={newFunding.amount || ''} onChange={e => setNewFunding({...newFunding, amount: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">تاريخ الاستلام</label>
                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={newFunding.date} onChange={e => setNewFunding({...newFunding, date: e.target.value})} />
                        </div>
                        <button 
                            onClick={() => {
                                if (!newFunding.label || !newFunding.amount) return;
                                const updatedCamp = { ...selectedCamp, additionalFunding: [...(selectedCamp.additionalFunding || []), { ...newFunding, id: `f_${Date.now()}` } as ActivityFundingSource] };
                                setSelectedCamp(updatedCamp);
                                if (onUpdateCamp) onUpdateCamp(updatedCamp);
                                setShowAddFundingModal(false);
                                setNewFunding({ label: '', amount: 0, date: new Date().toISOString().split('T')[0] });
                            }} 
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl transition-all font-['Cairo']"
                        >تأكيد المورد المالي</button>
                    </div>
                </Modal>

                <Modal isOpen={showAddExpenseModal} onClose={() => setShowAddExpenseModal(false)} title="تسجيل مصروف مخيم" maxWidth="max-w-md">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">اختيار اليوم</label>
                                <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold font-['Cairo']" value={newExpense.day} onChange={e => setNewExpense({...newExpense, day: e.target.value})}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={d} value={d}>اليوم {d}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">نوع المصروف</label>
                                <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold font-['Cairo']" value={newExpense.type} onChange={e => setNewExpense({...newExpense, type: e.target.value as any})}>
                                    {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">المبلغ</label>
                            <input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-rose-400 font-black text-xl font-['Cairo']" value={newExpense.amount || ''} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">الجهة أو الغرض</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold font-['Cairo']" value={newExpense.purpose} onChange={e => setNewExpense({...newExpense, purpose: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">مصدر الصرف (مرشح)</label>
                            <select 
                                className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold font-['Cairo']" 
                                value={newExpense.source} 
                                onChange={e => setNewExpense({...newExpense, source: e.target.value})}
                            >
                                <option value="">اختر المورد الممول...</option>
                                <option value="اشتراكات الكشافين">اشتراكات الكشافين</option>
                                <option value="اشتراكات القادة">اشتراكات القادة</option>
                                {selectedCamp.additionalFunding?.map(f => <option key={f.id} value={f.label}>{f.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">تاريخ الصرف</label>
                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                        </div>
                        <button 
                            onClick={() => {
                                if (!newExpense.amount || !newExpense.purpose || !newExpense.source) return;
                                const updatedCamp = { ...selectedCamp, activityExpenses: [...(selectedCamp.activityExpenses || []), { ...newExpense, id: `e_${Date.now()}` } as ActivityExpense] };
                                setSelectedCamp(updatedCamp);
                                if (onUpdateCamp) onUpdateCamp(updatedCamp);
                                setShowAddExpenseModal(false);
                                setNewExpense({ day: '1', type: 'تغذية', amount: 0, date: new Date().toISOString().split('T')[0], purpose: '', source: '', notes: '' });
                            }} 
                            className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black shadow-xl transition-all font-['Cairo']"
                        >توثيق المصروف اليومي</button>
                    </div>
                </Modal>

                <Modal isOpen={showTransferSurplusModal} onClose={() => setShowTransferSurplusModal(false)} title="تحويل المتبقى بعد المخيم للمالية" maxWidth="max-w-md">
                    <div className="space-y-8">
                        <div className="p-6 bg-primary-600/10 border border-primary-500/20 rounded-3xl text-center font-['Cairo']">
                            <p className="text-xs text-night-400 font-black uppercase mb-1">صافي المتبقى المتاح</p>
                            <p className="text-3xl font-black text-white">{surplus.toLocaleString()} دج</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">المبلغ المراد تحويله</label>
                            <input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-primary-400 font-black text-xl font-['Cairo']" value={transferSurplus.amount || ''} onChange={e => setTransferSurplus({...transferSurplus, amount: Math.min(Number(e.target.value), surplus)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 font-['Cairo'] uppercase tracking-widest mr-2">وجهة التحويل (قسم المالية)</label>
                            <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold font-['Cairo']" value={transferSurplus.destination} onChange={e => setTransferSurplus({...transferSurplus, destination: e.target.value})}>
                                <option value="">اختر الخزينة أو البنك الوجهة...</option>
                                {treasuries.map(t => <option key={t.id} value={`خزينة: ${t.name}`}>{t.name}</option>)}
                                {bankAccounts.map(b => <option key={b.id} value={`بنك: ${b.bankName}`}>{b.bankName}</option>)}
                            </select>
                        </div>
                        <div className="bg-night-950 p-6 rounded-3xl border border-white/5 space-y-4 font-['Cairo']">
                            <p className="text-[10px] text-night-500 font-black uppercase text-center border-b border-white/5 pb-2">موافقة مسؤول المالية (إجباري)</p>
                            <label className="flex items-center gap-3 cursor-pointer justify-center py-2">
                                <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded" checked={transferSurplus.managerApproval} onChange={e => setTransferSurplus({...transferSurplus, managerApproval: e.target.checked})} />
                                <span className="text-sm font-bold text-night-200">مصادقة مسؤول المالية والوسائل</span>
                            </label>
                        </div>
                        <button 
                          disabled={!transferSurplus.amount || !transferSurplus.destination || !transferSurplus.managerApproval}
                          onClick={() => {
                              const updatedCamp = { 
                                  ...selectedCamp, 
                                  surplusTransfers: [...(selectedCamp.surplusTransfers || []), { 
                                      amount: transferSurplus.amount, 
                                      date: new Date().toISOString().split('T')[0], 
                                      destination: transferSurplus.destination, 
                                      status: 'APPROVED' as ApprovalStatus
                                  }] 
                              };
                              setSelectedCamp(updatedCamp);
                              if (onUpdateCamp) onUpdateCamp(updatedCamp);
                              setShowTransferSurplusModal(false);
                              setTransferSurplus({ amount: 0, destination: '', managerApproval: false });
                              if (onAddNotification) onAddNotification('تم التحويل المالي', 'تم إرسال المتبقى المالي إلى قسم المالية بنجاح.', 'SUCCESS');
                          }}
                          className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 text-white rounded-2xl font-black shadow-xl transition-all font-['Cairo']"
                        >تأكيد التحويل للمالية</button>
                    </div>
                </Modal>
            </div>
        );
    };

    // --- TAB 4: العتاد واللباس (الجديد والمطور) ---
    const renderEquipmentTab = () => {
        if (!selectedCamp) return null;
        
        const campItems = (equipmentList || []).filter(item => item.eventId === selectedCamp.id);
        const campMembers = members.filter(m => [...(selectedCamp.participants || []), ...(selectedCamp.leaderIds || [])].includes(m.id));
        
        const stats = {
            total: campItems.length,
            received: campItems.filter(i => i.status === 'مسلم').length,
            damaged: campItems.filter(i => i.status === 'تالف').length,
            lost: campItems.filter(i => i.status === 'مفقود').length,
            fines: campItems.reduce((acc, i) => acc + (i.fineAmount || 0), 0)
        };

        const filteredMembers = campMembers.filter(m => {
            const matchesSearch = m.fullName.toLowerCase().includes(reportFilter.memberSearch.toLowerCase());
            const matchesUnit = reportFilter.unit === 'ALL' || m.unit === reportFilter.unit;
            return matchesSearch && matchesUnit;
        });

        return (
            <div className="space-y-10 animate-fade-in font-['Cairo'] text-right pb-20" dir="rtl">
                {/* Reports Summary */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-night-800/60 p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                    <div className="flex items-center gap-8">
                        <div className="p-5 bg-primary-600/20 text-primary-400 rounded-3xl shadow-inner border border-primary-500/20"><Box size={40}/></div>
                        <div>
                            <h3 className="text-3xl font-black text-white leading-none">إدارة عهدة المخيم المركزية</h3>
                            <p className="text-night-400 font-bold opacity-80 mt-2">نظام متكامل لتتبع تسليم واستلام العتاد ومحاسبة الإتلاف.</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 min-w-[120px]">
                            <p className="text-[10px] text-night-500 font-black uppercase mb-1">عناصر مستلمة</p>
                            <p className="text-2xl font-black text-emerald-400">{stats.received}</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 min-w-[120px]">
                            <p className="text-[10px] text-night-500 font-black uppercase mb-1">تالف / مفقود</p>
                            <p className="text-2xl font-black text-rose-500">{stats.damaged + stats.lost}</p>
                        </div>
                        <button onClick={() => setShowDeliveryModal(true)} className="px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[2rem] font-black flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                            <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" /> <span>تسليم جديد</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-night-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-inner backdrop-blur-md">
                    <div className="relative group">
                        <input type="text" placeholder="بحث باسم العضو..." className="w-full bg-night-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white text-sm outline-none focus:border-primary-500 transition-all shadow-inner font-bold" value={reportFilter.memberSearch} onChange={e => setReportFilter({...reportFilter, memberSearch: e.target.value})} />
                        <Search size={20} className="absolute right-4 top-4 text-night-500 group-focus-within:text-primary-400 transition-colors"/>
                    </div>
                    <select className="bg-night-950 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-bold outline-none cursor-pointer" value={reportFilter.unit} onChange={e => setReportFilter({...reportFilter, unit: e.target.value})}>
                        <option value="ALL">جميع الوحدات</option>
                        {UNITS_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <div className="flex items-center gap-4 bg-night-950 px-6 py-4 rounded-2xl border border-white/10">
                        <Gavel size={20} className="text-amber-500"/>
                        <span className="text-xs font-black text-night-400">إجمالي الغرامات:</span>
                        <span className="text-lg font-black text-amber-400">{stats.fines.toLocaleString()} دج</span>
                    </div>
                    <button className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-black text-xs uppercase tracking-widest"><Printer size={18}/> طباعة تقرير المخيم</button>
                </div>

                {/* Tracking Table */}
                <div className="bg-night-800/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <tr>
                                    <th className="p-8">العضو / الوحدة</th>
                                    <th className="p-8">القطع بذمته</th>
                                    <th className="p-8 text-center">العدد</th>
                                    <th className="p-8">المسؤول عن التسليم</th>
                                    <th className="p-8">حالة الاستلام</th>
                                    <th className="p-8 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-bold">
                                {filteredMembers.map(member => {
                                    const memberItems = campItems.filter(i => i.assignedTo === member.id);
                                    return (
                                        <tr key={member.id} className="hover:bg-white/5 transition-all group/row">
                                            <td className="p-6 flex items-center gap-5">
                                                <img src={member.image} className="w-14 h-14 rounded-2xl border-2 border-night-700 shadow-xl" />
                                                <div>
                                                    <p className="font-black text-white text-lg leading-none mb-1">{member.fullName}</p>
                                                    <p className="text-[10px] text-night-500 font-black uppercase tracking-widest">{member.unit}</p>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {memberItems.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {memberItems.map(item => (
                                                            <div key={item.id} className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">
                                                                {item.category === 'لباس' ? <Shirt size={14} className="text-purple-400"/> : <Box size={14} className="text-orange-400"/>}
                                                                <span className="text-xs text-white">{item.name} <span className="opacity-40 font-mono text-[9px]">[{item.uniqueId}]</span></span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-night-600 italic opacity-40 font-medium tracking-tight">لم يستلم أي عهدة</span>}
                                            </td>
                                            <td className="p-6 text-center"><span className="bg-night-950 px-4 py-1.5 rounded-xl border border-white/5 text-primary-400 font-mono text-lg">{memberItems.length}</span></td>
                                            <td className="p-6 text-night-400 text-xs font-bold">{memberItems[0]?.issuedBy || '---'}</td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-1.5">
                                                    {memberItems.map(item => (
                                                        <div key={item.id} className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border shadow-inner ${
                                                                item.status === 'مسلم' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' :
                                                                item.status === 'تالف' ? 'bg-rose-600/10 text-rose-400 border-rose-500/20' :
                                                                item.status === 'مفقود' ? 'bg-red-600/10 text-red-400 border-red-500/20' :
                                                                'bg-night-900 text-night-500'
                                                            }`}>{item.status === 'مسلم' ? 'مستلم' : item.status}</span>
                                                            {item.fineAmount ? <span className="text-[10px] text-rose-400 font-black animate-pulse">غرامة: {item.fineAmount} دج</span> : null}
                                                        </div>
                                                    ))}
                                                    {memberItems.length === 0 && <span className="text-night-600 italic text-[10px]">---</span>}
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                    {memberItems.length > 0 && (
                                                        <>
                                                            <button onClick={() => { setSelectedItemForAction(memberItems[0]); setShowStatusUpdateModal(true); }} className="p-3 bg-white/5 hover:bg-amber-600 rounded-2xl text-amber-500 hover:text-white transition-all shadow-lg border border-white/5" title="تعديل حالة / تسجيل غرامة"><Edit size={18}/></button>
                                                            <button onClick={() => { if(window.confirm('تأكيد استرجاع القطعة للمخزن المركزي؟')) onUpdateEquipment?.(equipmentList.map(i => i.id === memberItems[0].id ? {...i, status: 'متاح' as EquipmentStatus, assignedTo: undefined, eventId: undefined, fineAmount: 0} : i)) }} className="p-3 bg-white/5 hover:bg-emerald-600 rounded-2xl text-emerald-500 hover:text-white transition-all shadow-lg border border-white/5" title="استرجاع للمخزن المركزي"><RefreshCcw size={18}/></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delivery Modal */}
                <Modal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} title="تسليم عهدة جديدة من المخزن المركزي" maxWidth="max-w-md">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">اختيار العضو المسجل بالمخيم</label>
                            <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-primary-500 transition-all" value={deliveryData.memberId} onChange={e => setDeliveryData({...deliveryData, memberId: e.target.value})}>
                                <option value="">اختر العضو المشارك...</option>
                                {campMembers.map(m => <option key={m.id} value={m.id}>{m.fullName} ({m.unit})</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">القطع المتاحة (المرشحة من المخزن المركزي)</label>
                            <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-primary-500 transition-all" value={deliveryData.equipmentId} onChange={e => setDeliveryData({...deliveryData, equipmentId: e.target.value})}>
                                <option value="">اختر قطعة عتاد/لباس متاحة...</option>
                                {equipmentList.filter(i => i.status === 'متاح').map(i => <option key={i.id} value={i.id}>{i.name} [{i.uniqueId}] - {i.category}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">المسؤول عن التسليم</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-primary-500 outline-none" value={deliveryData.issuer} onChange={e => setDeliveryData({...deliveryData, issuer: e.target.value})} />
                        </div>
                        <div className="p-4 bg-primary-600/10 border border-primary-500/20 rounded-2xl flex items-center gap-4">
                            <Info size={24} className="text-primary-400" />
                            <p className="text-[11px] text-primary-300 leading-relaxed font-bold">سيتم تحديث حالة القطعة فوراً في المخزن المركزي لتصبح "مسلمة" لهذا العضو ومرتبطة بهذا المخيم.</p>
                        </div>
                        <button onClick={handleDeliverEquipment} className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all transform hover:scale-105 active:scale-95">تأكيد عملية التسليم</button>
                    </div>
                </Modal>

                {/* Status Update Modal */}
                <Modal isOpen={showStatusUpdateModal} onClose={() => setShowStatusUpdateModal(false)} title="تحديث حالة العهدة والمحاسبة" maxWidth="max-w-md">
                    <div className="space-y-8">
                        <div className="p-6 bg-night-950 rounded-[2.5rem] border border-white/5 text-center">
                            <p className="text-[10px] text-night-500 font-black uppercase mb-1">تعديل حالة العنصر</p>
                            <h4 className="text-2xl font-black text-white">{selectedItemForAction?.name}</h4>
                            <p className="text-xs text-primary-400 font-mono mt-1">[{selectedItemForAction?.uniqueId}]</p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">الحالة الجديدة للقطعة</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['تالف', 'مفقود'].map(st => (
                                    <button key={st} onClick={() => setStatusUpdateData({...statusUpdateData, status: st as any})} className={`p-5 rounded-2xl font-black border transition-all flex flex-col items-center gap-3 ${statusUpdateData.status === st ? 'bg-rose-600 border-rose-500 text-white shadow-xl shadow-rose-900/40' : 'bg-night-900 border-white/5 text-night-500'}`}>
                                        {st === 'تالف' ? <AlertTriangle size={24}/> : <AlertOctagon size={24}/>}
                                        <span>{st}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">الغرامة المالية المستحقة (DZD)</label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded" checked={statusUpdateData.isExempt} onChange={e => setStatusUpdateData({...statusUpdateData, isExempt: e.target.checked})} />
                                    <span className="text-xs font-black text-emerald-400 font-['Cairo']">إعفاء كلي</span>
                                </label>
                            </div>
                            <input type="number" disabled={statusUpdateData.isExempt} className="w-full bg-night-950 border border-white/10 rounded-2xl p-5 text-white font-black text-3xl focus:border-primary-500 outline-none shadow-inner text-center disabled:opacity-30 transition-all font-mono" placeholder="0" value={statusUpdateData.isExempt ? 0 : statusUpdateData.fine} onChange={e => setStatusUpdateData({...statusUpdateData, fine: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">ملاحظات / مبرر الإعفاء</label>
                            <textarea className="w-full h-24 bg-night-950 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none resize-none font-bold text-sm shadow-inner" placeholder="اكتب تفاصيل الحادثة أو سبب الإعفاء..." value={statusUpdateData.notes} onChange={e => setStatusUpdateData({...statusUpdateData, notes: e.target.value})} />
                        </div>
                        <button onClick={handleUpdateStatusConfirm} className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95">توثيق الحالة نهائياً</button>
                    </div>
                </Modal>
            </div>
        );
    };

    // --- TAB 2: المشاركون (محمي) ---
    const handleAddMemberToCamp = (member: Member) => {
        if (!selectedCamp) return;
        const isLeader = member.role.includes('قائد');
        const type = isLeader ? 'leaderIds' : 'participants';
        const currentList = selectedCamp[type] || [];
        
        if (currentList.includes(member.id)) return;
        const updatedCamp = { ...selectedCamp, [type]: [...currentList, member.id] };
        setSelectedCamp(updatedCamp);
        if (onUpdateCamp) onUpdateCamp(updatedCamp);
        if (onAddNotification) {
            onAddNotification('تمت العملية بنجاح', `تم إضافة ${isLeader ? 'القائد' : 'الكشاف'} ${member.fullName} إلى المخيم بنجاح.`, 'SUCCESS');
        }
    };

    const handleRemoveMemberFromCamp = (memberId: string, isLeader: boolean) => {
        if (!selectedCamp) return;
        const type = isLeader ? 'leaderIds' : 'participants';
        const updatedList = (selectedCamp[type] || []).filter((id: string) => id !== memberId);
        const updatedCamp = { ...selectedCamp, [type]: updatedList };
        setSelectedCamp(updatedCamp);
        if (onUpdateCamp) onUpdateCamp(updatedCamp);
    };

    const renderParticipantsTab = () => {
        if (!selectedCamp) return null;
        const scoutIds = selectedCamp.participants || [];
        const leaderIds = selectedCamp.leaderIds || [];
        const scouts = members.filter(m => scoutIds.includes(m.id));
        const leaders = members.filter(m => leaderIds.includes(m.id));
        
        const scoutCandidates = members
            .filter(m => !m.role.includes('قائد'))
            .filter(m => !scoutIds.includes(m.id))
            .filter(m => selectedCamp.targetUnits.length === 0 || selectedCamp.targetUnits.includes(m.unit as any))
            .filter(m => m.fullName.includes(searchMember));

        const leaderCandidates = members
            .filter(m => m.role.includes('قائد'))
            .filter(m => !leaderIds.includes(m.id))
            .filter(m => m.fullName.includes(searchMember));

        return (
            <div className="space-y-10 animate-fade-in font-['Cairo'] text-right pb-20" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-night-800/60 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-xl group">
                      <div className="p-4 rounded-2xl bg-primary-600/20 text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all"><Users size={32} /></div>
                      <div><p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي المشاركين</p><p className="text-white font-black text-3xl leading-none">{scouts.length + leaders.length}</p></div>
                    </div>
                    <button onClick={() => { setAddParticipantModalTab('LEADERS'); setIsAddParticipantOpen(true); }} className="bg-primary-600 hover:bg-primary-500 text-white rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-105 active:scale-95 group font-black py-6 ring-4 ring-primary-600/20">
                      <UserPlus size={32} className="group-hover:rotate-12 transition-transform" />
                      <span className="text-lg">تسجيل قائد</span>
                    </button>
                    <button onClick={() => { setAddParticipantModalTab('SCOUTS'); setIsAddParticipantOpen(true); }} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-105 active:scale-95 group font-black py-6 ring-4 ring-emerald-600/20">
                      <Plus size={32} className="group-hover:rotate-90 transition-transform" />
                      <span className="text-lg">تسجيل كشاف</span>
                    </button>
                </div>

                <div className="bg-night-800/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="p-8 bg-night-900/40 border-b border-white/5 flex justify-between items-center"><h3 className="text-2xl font-black text-white flex items-center gap-4"><Crown className="text-yellow-500" size={28}/> هيئة القيادة والتأطير</h3><span className="bg-white/5 px-4 py-1 rounded-xl text-xs text-night-400 border border-white/10 font-bold">{leaders.length} قائد</span></div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-right border-collapse text-sm font-bold">
                          <thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                              <tr><th className="p-6">الإسم الكامل</th><th className="p-6">رقم العضوية</th><th className="p-6">الوحدة</th><th className="p-6 text-center">اجراءات</th></tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-sm font-bold">
                              {leaders.map(m => (
                                  <tr key={m.id} className="hover:bg-white/5 transition-all group/row">
                                      <td className="p-5 flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-900 shadow-md" /><p className="font-black text-white">{m.fullName}</p></td>
                                      <td className="p-5 text-night-400 font-mono tracking-widest">{m.membershipNumber}</td>
                                      <td className="p-5 text-night-300">{m.unit}</td>
                                      <td className="p-5 text-center"><button onClick={() => handleRemoveMemberFromCamp(m.id, true)} className="p-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all shadow-xl"><UserX size={20}/></button></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                </div>

                <div className="bg-night-800/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="p-8 bg-night-900/40 border-b border-white/5 flex justify-between items-center"><h3 className="text-2xl font-black text-white flex items-center gap-4"><Users className="text-primary-500" size={28}/> قائمة الكشافين المسجلين</h3><span className="bg-white/5 px-4 py-1 rounded-xl text-xs text-night-400 border border-white/10 font-bold">{scouts.length} كشاف</span></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse text-sm font-bold">
                            <thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <tr><th className="p-6">الإسم الكامل</th><th className="p-6">رقم العضوية</th><th className="p-6">الوحدة</th><th className="p-6 text-center">اجراءات</th></tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-bold">
                                {scouts.map(m => (
                                    <tr key={m.id} className="hover:bg-white/5 transition-all group/row">
                                        <td className="p-5 flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-900 shadow-md" /><p className="font-black text-white">{m.fullName}</p></td>
                                        <td className="p-5 text-night-400 font-mono tracking-widest">{m.membershipNumber}</td>
                                        <td className="p-5 text-night-300">{m.unit}</td>
                                        <td className="p-5 text-center"><button onClick={() => handleRemoveMemberFromCamp(m.id, false)} className="p-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all shadow-xl"><UserX size={20}/></button></td>
                                    </tr>
                                ))}
                                {scouts.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-night-500 font-black italic opacity-40">لا يوجد كشافون مسجلون حالياً</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal isOpen={isAddParticipantOpen} onClose={() => setIsAddParticipantOpen(false)} title={addParticipantModalTab === 'LEADERS' ? "إضافة قائد" : "إضافة كشاف"} maxWidth="max-w-lg" overlayClassName="bg-transparent backdrop-blur-none">
                     <div className="space-y-6 flex flex-col animate-fade-in" dir="rtl">
                          <div className="relative">
                              <input type="text" placeholder="ابحث..." className="w-full bg-night-900 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white text-sm outline-none focus:border-primary-500 font-bold" value={searchMember} onChange={e => setSearchMember(e.target.value)} />
                              <Search size={18} className="absolute right-4 top-4 text-night-400" />
                          </div>
                          <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-3 pr-1">
                               {addParticipantModalTab === 'LEADERS' ? leaderCandidates.map(m => (
                                   <div key={m.id} className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group/cand hover:border-primary-500/40 transition-all shadow-md">
                                       <div className="flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-xl border border-white/10 shadow-lg" /><div className="text-right"><p className="font-bold text-white text-sm">{m.fullName}</p><p className="text-[10px] text-night-500">{m.unit}</p></div></div>
                                       <button onClick={() => handleAddMemberToCamp(m)} className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"><Plus size={18}/></button>
                                   </div>
                               )) : scoutCandidates.map(m => (
                                  <div key={m.id} className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group/cand hover:border-emerald-500/40 transition-all shadow-md">
                                       <div className="flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-xl border border-white/10 shadow-lg" /><div className="text-right"><p className="font-bold text-white text-sm">{m.fullName}</p><p className="text-[10px] text-night-500">{m.unit}</p></div></div>
                                       <button onClick={() => handleAddMemberToCamp(m)} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"><Plus size={18}/></button>
                                  </div>
                               ))}
                          </div>
                     </div>
                </Modal>
            </div>
        );
    };

    if (viewMode === 'DETAIL' && selectedCamp) {
        return (
            <div className="p-8 h-full flex flex-col animate-fade-in relative font-['Cairo'] text-right" dir="rtl">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setViewMode('LIST')} className="p-4 bg-night-800 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all shadow-lg hover:-translate-x-1 group ring-4 ring-primary-600/5">
                            <ChevronLeft size={28} className="group-hover:text-primary-400 rtl:rotate-180" />
                        </button>
                        <div>
                            <span className="text-[10px] text-primary-400 font-black uppercase tracking-[0.3em] mb-1 block font-['Cairo']">تفاصيل الفعالية الكبرى</span>
                            <h2 className="text-4xl font-black text-white tracking-tight font-['Cairo']">{selectedCamp.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex bg-night-800/30 p-1 rounded-2xl border border-white/5 mb-10 self-start shadow-inner">
                    {[{ label: 'نظرة عامة', icon: LayoutDashboard }, { label: 'المشاركون', icon: Users }, { label: 'المالية', icon: TrendingUp }, { label: 'العتاد واللباس', icon: Box }].map((tab, idx) => (
                        <button key={idx} onClick={() => setActiveTab(idx)} className={`px-12 py-4 font-black text-xs rounded-xl transition-all flex items-center gap-2 font-['Cairo'] ${activeTab === idx ? 'bg-primary-600 text-white shadow-xl' : 'text-night-400 hover:text-white hover:bg-white/5'}`}>
                            <tab.icon size={16}/> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 pb-20">
                    {activeTab === 0 && renderOverviewTab()} 
                    {activeTab === 1 && renderParticipantsTab()}
                    {activeTab === 2 && renderFinanceTab()}
                    {activeTab === 3 && renderEquipmentTab()}
                </div>
            </div>
        );
    }

    const renderAddCampModal = () => (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة مخيم / رحلة" footer={
            <div className="flex gap-4 font-['Cairo']"><button onClick={() => setShowAddModal(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button><button onClick={handleSave} className="px-12 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-2xl transition-all flex items-center gap-2 transform hover:scale-105"><Save size={20}/> تأكيد وإنشاء</button></div>
        }>
            <div className="flex bg-night-900/50 border-b border-white/5 p-1 mb-8 overflow-x-auto no-scrollbar">
                {['التخطيط الأساسي', 'الميزانية والتموين', 'وصف الأهداف'].map((t, idx) => (
                    <button key={idx} onClick={() => setFormTab(idx)} className={`px-6 py-4 text-xs font-black transition-all rounded-xl whitespace-nowrap font-['Cairo'] ${formTab === idx ? 'bg-primary-600 text-white shadow-lg' : 'text-night-500 hover:text-white'}`}>{t}</button>
                ))}
            </div>
            <div className="space-y-6 animate-fade-in font-['Cairo']">
                {formTab === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">اسم المخيم</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">تاريخ البدء</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">مكان التخييم</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">رابط صورة الغلاف</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white text-xs" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} /></div>
                    </div>
                )}
                {formTab === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">ميزانية المخيم الكلية</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} /></div>
                        <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">رسوم اشتراك الفرد</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} /></div>
                        <div className="space-y-2 md:col-span-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest mr-2">مدير المخيم</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} /></div>
                    </div>
                )}
            </div>
        </Modal>
    );

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col font-['Cairo'] text-right" dir="rtl">
            {renderAddCampModal()}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tighter leading-none font-['Cairo']">المخيمات والرحلات الكبرى</h2>
                    <p className="text-night-400 text-xl font-bold opacity-80 uppercase tracking-widest font-['Cairo']">إدارة وتخطيط الفعاليات الميدانية وحياة الخلاء.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-[2rem] flex items-center gap-3 font-black shadow-2xl shadow-primary-900/40 transition-all hover:scale-105 active:scale-95 group font-['Cairo']">
                    <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" /> تسجيل مخيم جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {camps.length > 0 ? camps.map(camp => (
                    <div key={camp.id} onClick={() => handleOpenDetail(camp)} className="bg-night-800 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary-500/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-500 cursor-pointer group flex flex-col relative shadow-xl">
                        <div className="h-60 overflow-hidden relative">
                            <img src={camp.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={camp.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent opacity-90"></div>
                            <div className="absolute top-6 left-6 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-[10px] font-black text-white border border-white/10 flex items-center gap-2 shadow-2xl bg-black/60">
                                <Clock size={16} className="text-primary-500"/> <span>{getDaysRemaining(camp.date)} يوم متبقي</span>
                            </div>
                        </div>
                        <div className="p-10 flex-1 flex flex-col font-['Cairo']">
                            <h3 className="text-3xl font-black text-white group-hover:text-primary-400 transition-colors mb-4 line-clamp-1 tracking-tighter">{camp.title}</h3>
                            <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-night-900 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-primary-500 transition-colors">
                                        <Users size={20} className="text-primary-500" />
                                    </div>
                                    <span className="font-black text-white text-2xl tracking-tighter">{camp.participants.length + camp.leaderIds.length}</span>
                                </div>
                                <span className="text-primary-400 text-xs font-black flex items-center gap-2 group-hover:translate-x-[-10px] transition-transform uppercase tracking-[0.2em]">التفاصيل <ArrowUpRight size={24} /></span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 bg-night-800/30 rounded-[4rem] border-4 border-white/5 border-dashed relative overflow-hidden group">
                        <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-white/5 transform group-hover:rotate-12 transition-transform"><Tent size={80} className="text-night-700" /></div>
                        <p className="text-night-500 text-3xl font-black opacity-50 tracking-tighter font-['Cairo']">أرشيف المخيمات فارغ حالياً</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Camps;
