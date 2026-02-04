
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FinanceOperation, Treasury, BankAccount, Event, Project, FinanceOpType, ApprovalStatus, Section } from '../types';
import { 
    Wallet, Landmark, FileText, Plus, ArrowRightLeft, TrendingUp, TrendingDown, 
    Search, Building, CheckCircle2, X, Save, AlertTriangle, 
    Printer, Calendar, ChevronDown, PieChart as PieChartIcon, ArrowUpRight, 
    ExternalLink, Briefcase, Tent, ShieldCheck, Coins, MoreHorizontal, Filter,
    Stamp, Eye, Receipt, ArrowDownCircle, History, Sparkles, LayoutPanelTop, 
    Clock, UserCheck, Layers, FileSpreadsheet, FilePieChart, ArrowUpDown,
    Cpu, Wifi, CreditCard, Sparkle, Edit, Trash2, ShieldAlert, BadgeDollarSign,
    Target, LineChart, FileOutput, MousePointerClick, LayoutGrid, List,
    Activity, Info, Tag, ToggleRight, Link, Paperclip, Hash, ChevronRight, ChevronLeft,
    MonitorPlay, Image as ImageIcon, Bell, BellRing, Zap, Shield, Copy, Upload, Camera,
    MapPin, BarChart3, HardDrive, HandCoins, ShieldX, Hourglass, Share2, Download
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Legend, ComposedChart, Line, Area, AreaChart
} from 'recharts';
import { UNITS_LIST } from '../constants';

interface FinanceProps {
  transactions: any[]; 
  insuranceTotal: number;
  onAddTransaction?: (t: any) => void;
  events?: Event[];
  projects?: Project[];
}

// --- Aesthetic Constants ---
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const CATEGORY_OPTIONS = [
    { value: 'SUBSCRIPTION', label: 'اشتراكات سنوية', icon: Receipt },
    { value: 'INSURANCE', label: 'تأمينات', icon: ShieldCheck },
    { value: 'ACTIVITY', label: 'أنشطة تربوية', icon: LayoutPanelTop },
    { value: 'CAMP', label: 'مخيمات ورحلات', icon: Tent },
    { value: 'AID', label: 'تبرعات ومساعدات', icon: HandCoins },
    { value: 'OTHER', label: 'أخرى', icon: MoreHorizontal },
];

const FILTER_OPTIONS = [
    { value: 'ALL', label: 'جميع الحسابات' },
    { value: 'MAIN', label: 'الرئيسية فقط' },
    { value: 'SUB', label: 'الفرعية فقط' },
];

const BANK_SOURCE_OPTIONS = [
    { value: 'MUNICIPALITY', label: 'ميزانية البلدية' },
    { value: 'WILAYA', label: 'منحة الولاية' },
    { value: 'DJS', label: 'مديرية الشباب والرياضة' },
    { value: 'STATE_AID', label: 'إعانات الدولة الاستثنائية' },
    { value: 'PROJECT_FUND', label: 'تمويل مشاريع استثمارية' },
    { value: 'OTHER', label: 'مصادر بنكية أخرى' },
];

const SIGNATORY_OPTIONS = [
    { value: 'FINANCE_MANAGER', label: 'مسؤول المالية والوسائل' },
    { value: 'GROUP_LEADER', label: 'قائد الفوج' },
    { value: 'DELEGATE', label: 'مفوض بالتوقيع' },
];

// --- Professional UI Components ---

const NotificationPopup = ({ msg, type, onClose }: any) => (
    <div className={`fixed bottom-10 left-10 z-[300] p-6 rounded-[2rem] border shadow-2xl animate-slide-in flex items-center gap-4 backdrop-blur-2xl font-['Cairo'] ${type === 'SUCCESS' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100' : 'bg-rose-900/90 border-rose-500/50 text-rose-100'}`}>
        <div className={`p-3 rounded-2xl ${type === 'SUCCESS' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
            {type === 'SUCCESS' ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
        </div>
        <div>
            <h4 className="font-black text-sm">{type === 'SUCCESS' ? 'عملية ناجحة' : 'تنبيه النظام'}</h4>
            <p className="text-xs font-bold opacity-80 mt-1">{msg}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18}/></button>
    </div>
);

const ApprovalBadge = ({ status }: { status: ApprovalStatus }) => {
    const configs = {
        PENDING: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: 'قيد المراجعة', icon: Clock },
        APPROVED: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20', label: 'معتمد نهائياً', icon: UserCheck },
        REJECTED: { color: 'text-rose-400 bg-rose-400/10 border-rose-500/20', label: 'مرفوض', icon: X }
    };
    const { color, label, icon: Icon } = configs[status];
    return (
        <span className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase flex items-center gap-2 ${color} font-['Cairo'] whitespace-nowrap`}>
            <Icon size={14}/> {label}
        </span>
    );
};

const Modal = ({ isOpen, onClose, title, icon: Icon, children, footer, maxWidth = "max-w-2xl" }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-night-950/95 backdrop-blur-xl p-4 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className={`bg-night-800 w-full ${maxWidth} rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[95vh]`}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600"></div>
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/30">
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-night-400 hover:text-white transition-all">
                        <X size={24}/>
                    </button>
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-white">{title}</h3>
                        <div className="p-3 bg-primary-600/20 text-primary-400 rounded-2xl shadow-inner border border-primary-500/20">
                            {Icon && <Icon size={24} />}
                        </div>
                    </div>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-night-900/10 font-['Cairo']">
                    {children}
                </div>
                {footer && (
                    <div className="p-8 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

const DropdownUI = ({ value, onChange, options, icon: Icon, label }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value)) || { label: 'اختر...' };
    
    // Fix: Extracted display text to a variable to prevent React Error #31
    const displayText = typeof selected === 'object' ? (selected.label || 'اختر...') : selected;

    return (
        <div className="relative font-['Cairo'] w-full text-right" dir="rtl">
            {label && <label className="block text-xs font-black text-night-400 uppercase tracking-widest mb-2 mr-2">{label}</label>}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full bg-night-950 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-bold cursor-pointer flex items-center justify-between transition-all hover:border-primary-500 shadow-inner"
            >
                <ChevronDown size={16} className={`text-night-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-primary-500" />}
                    <span>{displayText}</span>
                </div>
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[210]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 w-full mt-2 bg-night-800 border border-white/10 rounded-2xl shadow-2xl z-[220] py-2 animate-fade-in overflow-hidden backdrop-blur-xl ring-1 ring-black/50">
                        {options.map((opt: any) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <div 
                                    key={val} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`px-5 py-3 text-sm text-right cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between ${value === val ? 'text-primary-400 bg-primary-600/10 font-black' : 'text-night-300'}`}
                                >
                                    {value === val && <CheckCircle2 size={14} className="text-primary-500" />}
                                    <span>{lbl}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const Finance: React.FC<FinanceProps> = ({ events = [], projects = [] }) => {
    const [activeTab, setActiveTab] = useState<'TREASURY' | 'BANK' | 'TRANSFERS' | 'REPORTS'>('TREASURY');
    const [filterValue, setFilterValue] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<any>(null);

    // Modals
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isAddTreasuryModalOpen, setIsAddTreasuryModalOpen] = useState(false);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [isInternalFundingModalOpen, setIsInternalFundingModalOpen] = useState(false);
    const [viewingEntity, setViewingEntity] = useState<any>(null);

    // Form States
    const [newOp, setNewOp] = useState<any>({
        type: 'INCOME', date: new Date().toISOString().split('T')[0], amount: 0, notes: '', category: 'AID', 
        destination: 'الحساب البنكي', payerName: '', refNumber: '', responsible: 'مسؤول المالية والوسائل', attachment: '', source: 'MUNICIPALITY'
    });

    const [internalFunding, setInternalFunding] = useState<any>({
        amount: 0, date: new Date().toISOString().split('T')[0], targetType: 'ACTIVITY', targetId: '', responsible: 'مسؤول المالية والوسائل', notes: ''
    });

    const [newTreasury, setNewTreasury] = useState<any>({ 
        name: '', manager: 'مسؤول المالية', balance: 0, type: 'OPERATIONAL', maxLimit: 50000, image: '', openingDate: new Date().toISOString().split('T')[0]
    });

    const [newAccount, setNewAccount] = useState<any>({
        bankName: '', accountNumber: '', currency: 'DZD', manager: 'قائد الفوج', balance: 0, branchName: '', iban: '', image: ''
    });

    // Data Management
    const [treasuries, setTreasuries] = useState<Treasury[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [operations, setOperations] = useState<FinanceOperation[]>([]);
    const [incomingQueue, setIncomingQueue] = useState<any[]>([]);

    const [selectedTreasuryId, setSelectedTreasuryId] = useState<string>('');
    const [selectedBankId, setSelectedBankId] = useState<string>('');

    const filteredTreasuries = useMemo(() => {
        let result = treasuries.filter(t => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.manager.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filterValue === 'MAIN') result = result.filter(t => t.isMain);
        if (filterValue === 'SUB') result = result.filter(t => !t.isMain);
        return result;
    }, [treasuries, searchQuery, filterValue]);

    const filteredBankAccounts = useMemo(() => {
        return bankAccounts.filter(b => 
            b.bankName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            b.manager.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [bankAccounts, searchQuery]);

    const notify = (msg: string, type: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleAddOperation = (dest: 'CASH' | 'BANK') => {
        if (newOp.amount <= 0) { notify('يرجى إدخال مبلغ صحيح', 'ERROR'); return; }
        const op: FinanceOperation = {
            ...newOp, id: `op_${Date.now()}`, 
            treasuryId: dest === 'CASH' ? selectedTreasuryId : undefined,
            bankAccountId: dest === 'BANK' ? selectedBankId : undefined, 
            approvalStatus: 'APPROVED',
            transferNumber: newOp.refNumber || `BNK-${Math.floor(Math.random()*90000) + 10000}`
        };
        setOperations([op, ...operations]);
        if (dest === 'CASH') {
            setTreasuries(treasuries.map(t => t.id === selectedTreasuryId ? { ...t, balance: t.balance + (op.type === 'INCOME' ? op.amount : -op.amount) } : t));
            setIsCashModalOpen(false);
        } else {
            setBankAccounts(bankAccounts.map(b => b.id === selectedBankId ? { ...b, balance: b.balance + (op.type === 'DEPOSIT' || op.type === 'INCOME' ? op.amount : -op.amount) } : b));
            setIsBankModalOpen(false);
        }
        notify('تم توثيق العملية بنجاح وتحديث الرصيد.');
        setNewOp({ type: 'INCOME', date: new Date().toISOString().split('T')[0], amount: 0, notes: '', category: 'AID', destination: 'الحساب البنكي', payerName: '', refNumber: '', responsible: 'مسؤول المالية والوسائل', attachment: '', source: 'MUNICIPALITY' });
    };

    const handleAddInternalFunding = () => {
        if (internalFunding.amount <= 0 || !internalFunding.targetId) {
            notify('يرجى إدخال المبلغ واختيار الوجهة', 'ERROR');
            return;
        }
        
        const targetName = internalFunding.targetType === 'PROJECT' 
            ? projects.find(p => p.id === internalFunding.targetId)?.name 
            : events.find(e => e.id === internalFunding.targetId)?.title;

        const op: FinanceOperation = {
            id: `op_fund_${Date.now()}`,
            type: 'TRANSFER',
            date: internalFunding.date,
            amount: internalFunding.amount,
            responsible: internalFunding.responsible,
            notes: `تمويل داخلي: ${targetName} - ${internalFunding.notes}`,
            category: internalFunding.targetType as any,
            approvalStatus: 'APPROVED',
            destination: targetName || '',
            treasuryId: selectedTreasuryId,
            transferNumber: `FND-${Math.floor(Math.random()*90000) + 10000}`
        };

        setOperations([op, ...operations]);
        setTreasuries(treasuries.map(t => t.id === selectedTreasuryId ? { ...t, balance: t.balance - op.amount } : t));
        setIsInternalFundingModalOpen(false);
        notify('تم تنفيذ التمويل الداخلي بنجاح.');
        setInternalFunding({ amount: 0, date: new Date().toISOString().split('T')[0], targetType: 'ACTIVITY', targetId: '', responsible: 'مسؤول المالية والوسائل', notes: '' });
    };

    const initiateHardDelete = (id: string) => {
        if (window.confirm('تنبيه: سيتم حذف هذا الكيان نهائياً من قاعدة البيانات. هل أنت متأكد؟')) {
            setTreasuries(prev => prev.filter(t => t.id !== id));
            setBankAccounts(prev => prev.filter(b => b.id !== id));
            notify('تم حذف الكيان بنجاح.');
        }
    };

    const handleAcceptIncoming = (id: string) => {
        const item = incomingQueue.find(q => q.id === id);
        if (!item) return;
        const op: FinanceOperation = {
            id: `op_inc_${Date.now()}`, type: 'INCOME', date: new Date().toISOString().split('T')[0], amount: item.amount, responsible: 'بوابة الاستقبال المالي',
            notes: `استلام ${item.type === 'SUBSCRIPTION' ? 'اشتراكات' : 'تأمينات'} لعدد ${item.count} عضو`,
            category: item.type === 'SUBSCRIPTION' ? 'SUBSCRIPTION' : 'INSURANCE', 
            approvalStatus: 'APPROVED', destination: item.type === 'INSURANCE' ? 'الحساب البنكي' : 'خزينة الفوج',
            bankAccountId: item.type === 'INSURANCE' ? selectedBankId : undefined,
            treasuryId: item.type === 'SUBSCRIPTION' ? selectedTreasuryId : undefined
        };
        setOperations([op, ...operations]);
        if (item.type === 'INSURANCE') {
            setBankAccounts(bankAccounts.map(b => b.id === selectedBankId ? { ...b, balance: b.balance + item.amount } : b));
        } else {
            setTreasuries(treasuries.map(t => t.id === selectedTreasuryId ? { ...t, balance: t.balance + item.amount } : t));
        }
        setIncomingQueue(incomingQueue.filter(q => q.id !== id));
        notify(`تم استقبال مبلغ ${item.amount.toLocaleString()} دج بنجاح.`);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'TREASURY' | 'BANK') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (type === 'TREASURY') setNewTreasury((prev: any) => ({ ...prev, image: base64 }));
                else setNewAccount((prev: any) => ({ ...prev, image: base64 }));
            };
            reader.readAsDataURL(file);
        }
    };

    const renderHeaderTitle = () => {
        const titles = { TREASURY: 'خزينة الفوج والسيولة النقدية', BANK: 'الحسابات البنكية والأصول الاستراتيجية', TRANSFERS: 'تمويل الأنشطة والمشاريع الاستراتيجية', REPORTS: 'مركز التقارير والتحليل الاستراتيجي' };
        const icons = { TREASURY: Wallet, BANK: Landmark, TRANSFERS: ArrowRightLeft, REPORTS: LineChart };
        const Icon = icons[activeTab];
        return (
            <div className="px-12 pt-10 pb-6 text-right animate-fade-in font-['Cairo']" dir="rtl">
                <div className="flex items-center gap-5 mb-2">
                    <div className="p-3.5 bg-primary-600/10 text-primary-500 rounded-2xl border border-primary-500/20 shadow-inner"><Icon size={28} /></div>
                    <div><h2 className="text-3xl font-black text-white tracking-tight leading-none">{titles[activeTab]}</h2><p className="text-night-400 text-sm font-bold mt-1.5 opacity-80 uppercase tracking-[0.2em]">Strategic Finance Core . v2.6</p></div>
                </div>
            </div>
        );
    };

    const renderTabs = () => (
        <div className="flex justify-center mb-10 animate-fade-in font-['Cairo']">
            <div className="flex bg-night-800/40 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl ring-1 ring-white/5">
                {[
                    { id: 'TREASURY', label: 'خزينة الفوج', icon: Wallet },
                    { id: 'BANK', label: 'الحسابات البنكية', icon: Landmark },
                    { id: 'TRANSFERS', label: 'تمويل الأنشطة', icon: ArrowRightLeft },
                    { id: 'REPORTS', label: 'التقارير المالية', icon: LineChart },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-sm transition-all duration-500 whitespace-nowrap relative group ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-2xl shadow-primary-900/40 translate-y-[-4px]' : 'text-night-400 hover:text-white hover:bg-white/5'}`}>
                        <tab.icon size={20} className={`${activeTab === tab.id ? 'animate-pulse' : 'opacity-60'}`} /> {tab.label}
                        {activeTab === tab.id && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderCreditCard = (data: Treasury | BankAccount, isBank = false) => {
        const isSelected = isBank ? selectedBankId === data.id : selectedTreasuryId === data.id;
        return (
            <div onClick={() => isBank ? setSelectedBankId(data.id) : setSelectedTreasuryId(data.id)} className={`relative p-10 rounded-[3.5rem] border-2 h-72 flex flex-col justify-between transition-all duration-700 cursor-pointer group overflow-hidden font-['Cairo'] ${isSelected ? 'bg-gradient-to-br from-[#D4AF37] via-[#9E7E38] to-[#5C4033] border-[#FFD700]/30 shadow-[0_20px_50px_rgba(158,126,56,0.5)] scale-[1.03] z-10' : 'bg-white/5 backdrop-blur-md border-white/5 hover:border-white/20 hover:bg-white/10 shadow-xl'}`} dir="rtl">
                <div className="absolute top-8 left-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 z-20">
                    <button onClick={(e) => { e.stopPropagation(); setViewingEntity(data); }} className="p-3 bg-white/10 hover:bg-primary-600 rounded-xl text-white backdrop-blur-md transition-all border border-white/5 shadow-lg"><Eye size={16}/></button>
                    <button className="p-3 bg-white/10 hover:bg-indigo-600 rounded-xl text-white backdrop-blur-md transition-all border border-white/5 shadow-lg"><Edit size={16}/></button>
                    <button onClick={(e) => {e.stopPropagation(); initiateHardDelete(data.id)}} className="p-3 bg-rose-600/20 hover:bg-rose-600 rounded-xl text-rose-400 hover:text-white backdrop-blur-md transition-all border border-rose-500/20 shadow-lg"><Trash2 size={16}/></button>
                </div>
                <div className="relative z-10 flex justify-between items-start flex-row-reverse">
                    <div className="space-y-1 text-right">
                        <h3 className={`text-3xl font-black ${isSelected ? 'text-white drop-shadow-md' : 'text-night-100'} leading-tight`}>{isBank ? (data as BankAccount).bankName : (data as Treasury).name}</h3>
                        <div className="flex flex-col"><span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isSelected ? 'text-white/60' : 'text-night-500'}`}>الجهة المسؤولة</span><span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-night-300'}`}>{data.manager}</span></div>
                    </div>
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center backdrop-blur-2xl border border-white/10 ${isSelected ? 'bg-white/20 text-white shadow-inner' : 'bg-primary-600/10 text-primary-500'}`}>
                        {data.image ? <img src={data.image} className="w-10 h-10 object-contain rounded-lg" /> : (isBank ? <Landmark size={32} /> : <Wallet size={32} />)}
                    </div>
                </div>
                <div className="relative z-10 flex items-end justify-between flex-row-reverse">
                    <div className="text-right">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white/50' : 'text-night-500'}`}>الرصيد المتوفر</p>
                        <div className="flex items-baseline gap-2 flex-row-reverse font-['Cairo']"><span className={`text-5xl font-black tracking-tighter ${isSelected ? 'text-white' : 'text-emerald-400'}`}>{data.balance.toLocaleString()}</span><span className={`text-xs font-black uppercase ${isSelected ? 'text-white/60' : 'text-night-400'}`}>DZD</span></div>
                    </div>
                    <Wifi className={`${isSelected ? 'text-white/40' : 'text-night-700'}`} size={24}/>
                </div>
            </div>
        );
    };

    const StatCard = ({ title, value, icon: Icon, theme }: any) => {
        const configs: any = { emerald: 'from-emerald-600/20 to-teal-600/5 border-emerald-500/20 text-emerald-400', purple: 'from-purple-600/20 to-indigo-600/5 border-purple-500/20 text-purple-400', amber: 'from-amber-600/20 to-yellow-600/5 border-amber-500/20 text-amber-400', blue: 'from-blue-600/20 to-cyan-600/5 border-blue-500/20 text-blue-400' };
        return (
            <div className={`relative overflow-hidden p-8 rounded-[2.5rem] border bg-gradient-to-br backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${configs[theme]} font-['Cairo']`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Icon size={80} /></div>
                <div className="relative z-10 space-y-4 text-right"><div className="p-3 w-fit rounded-2xl bg-white/5 border border-white/10 shadow-inner"><Icon size={24} /></div><div><h3 className="text-4xl font-black text-white tracking-tighter leading-none">{typeof value === 'number' ? value.toLocaleString() : value}</h3><p className="text-night-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{title}</p></div></div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col font-['Cairo'] relative overflow-y-auto no-scrollbar select-none bg-night-950">
            {renderHeaderTitle()}
            <div className="px-12 pb-20">
                {renderTabs()}
                {activeTab !== 'REPORTS' && (
                    <div className="flex flex-col md:flex-row items-center mb-8 bg-night-800/50 p-4 rounded-3xl border border-white/5 backdrop-blur-xl shadow-inner gap-6 relative z-20 font-['Cairo']" dir="rtl">
                        <div className="relative group"><input type="text" placeholder="البحث السريع..." className="bg-night-900 border border-white/10 rounded-xl pl-10 pr-6 py-3 text-white text-xs font-bold outline-none focus:border-primary-500 transition-all w-72 text-right shadow-inner font-['Cairo']" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /><Search className="absolute left-3 top-3.5 text-night-400" size={16}/></div>
                        <DropdownUI options={FILTER_OPTIONS} value={filterValue} onChange={setFilterValue} icon={Filter} />
                        <div className="mr-auto flex gap-4">
                            {activeTab === 'TREASURY' && (<button onClick={() => setIsAddTreasuryModalOpen(true)} className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs shadow-2xl shadow-primary-900/40 transition-all transform hover:scale-105 active:scale-95 group relative overflow-hidden"><Plus size={20} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" /><span className="relative z-10 whitespace-nowrap">إضافة خزينة جديدة</span></button>)}
                            {activeTab === 'BANK' && (<button onClick={() => setIsBankModalOpen(true)} className="relative group overflow-hidden px-10 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white rounded-[1.8rem] font-black text-xs shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4 border border-emerald-400/30"><div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform"><Building size={18} className="text-white" /></div><span className="relative z-10 whitespace-nowrap tracking-wide">عملية بنكية جديدة</span><Sparkles size={14} className="text-emerald-200 animate-pulse" /></button>)}
                            {activeTab === 'TRANSFERS' && (<button onClick={() => setIsInternalFundingModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-purple-900/40 transition-all transform hover:scale-105 group/add whitespace-nowrap"><Plus size={18} className="group-hover/add:scale-110 transition-transform duration-500" /><span>تمويل داخلي</span></button>)}
                        </div>
                    </div>
                )}
                <div className="flex-1 relative z-0">
                    {activeTab === 'TREASURY' && (
                        <div className="space-y-16 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <StatCard title="إجمالي السيولة" value={treasuries.reduce((a,b)=>a+b.balance,0)} icon={Coins} theme="emerald" />
                                <StatCard title="مداخيل النشاطات" value={operations.filter(o => o.type === 'INCOME' && o.category === 'ACTIVITY').reduce((a,b)=>a+b.amount,0)} icon={Zap} theme="purple" />
                                <StatCard title="اشتراكات سنوية" value={operations.filter(o => o.type === 'INCOME' && o.category === 'SUBSCRIPTION').reduce((a,b)=>a+b.amount,0)} icon={Receipt} theme="amber" />
                                <StatCard title="تبرعات وهبات" value={operations.filter(o => o.type === 'INCOME' && o.category === 'AID').reduce((a,b)=>a+b.amount,0)} icon={HandCoins} theme="blue" />
                            </div>
                            {incomingQueue.length > 0 && (
                                <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-night-900 border border-emerald-500/20 p-6 rounded-[2.5rem] mb-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6" dir="rtl">
                                    <div className="flex items-center gap-6"><div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl shadow-inner animate-pulse"><HandCoins size={32}/></div><div className="text-right"><h3 className="text-xl font-black text-white tracking-tighter">بوابة الاستلام المالي الذكية</h3><p className="text-night-400 text-[10px] font-bold uppercase mt-1 tracking-widest">تحويلات التأمينات والاشتراكات بانتظار الاعتماد النهائي: {incomingQueue.length}</p></div></div>
                                    <div className="flex flex-wrap gap-4 justify-center">{incomingQueue.map(item => (<button key={item.id} onClick={() => handleAcceptIncoming(item.id)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] shadow-xl transition-all flex items-center gap-3 transform hover:scale-105 active:scale-95 border border-emerald-400/20 font-['Cairo']"><CheckCircle2 size={16}/> استلام {item.type === 'INSURANCE' ? 'تأمينات' : 'اشتراكات'} ({item.amount.toLocaleString()} دج) </button>))}</div>
                                </div>
                            )}
                            {filteredTreasuries.length > 0 ? (<div className="grid gap-10 grid-cols-1 md:grid-cols-2">{filteredTreasuries.map(tr => renderCreditCard(tr))}</div>) : (<div className="p-20 text-center bg-white/5 rounded-[4rem] border border-white/5 border-dashed"><Wallet size={80} className="mx-auto mb-6 text-night-700 opacity-20" /><p className="text-night-500 text-xl font-black italic">لا توجد خزائن مسجلة حالياً</p></div>)}
                            <div className="bg-night-800/40 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-3xl backdrop-blur-xl font-['Cairo']" dir="rtl">
                                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/40">
                                    <div className="flex items-center gap-5"><div className="p-4 bg-primary-600/10 text-primary-400 rounded-2xl border border-primary-500/20 shadow-inner"><History size={28}/></div><h3 className="text-2xl font-black text-white tracking-tighter">سجل تدفقات الخزينة الاحترافي</h3></div>
                                    <button onClick={() => setIsCashModalOpen(true)} className="px-10 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white rounded-2xl font-black text-xs shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 group"><Plus size={20} className="group-hover:scale-125 transition-transform" /><span>معاملة نقدية جديدة</span></button>
                                </div>
                                <div className="overflow-x-auto"><table className="w-full text-right border-collapse"><thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-[0.2em]"><tr><th className="p-8">النوع</th><th className="p-8">التاريخ</th><th className="p-8">المبلغ</th><th className="p-8">البيان</th><th className="p-8">الرقم المرجعي</th><th className="p-8 text-center">الإجراء</th></tr></thead><tbody className="divide-y divide-white/5 text-sm font-bold">{operations.filter(op => op.treasuryId === selectedTreasuryId).map(op => (<tr key={op.id} className="hover:bg-white/5 transition-all group font-['Cairo']"><td className="p-8 flex items-center gap-4"><div className={`p-3 rounded-xl ${op.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{op.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}</div><span className="font-black text-white">{op.type === 'INCOME' ? 'إيراد' : 'مصروف'}</span></td><td className="p-8 text-night-300">{op.date}</td><td className={`p-8 font-black text-2xl tracking-tighter ${op.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>{op.amount.toLocaleString()} دج</td><td className="p-8 text-white max-w-xs truncate">{op.notes}</td><td className="p-8 text-night-500 text-xs">{op.transferNumber || 'TR-0000'}</td><td className="p-8 text-center"><button onClick={() => {setSelectedVoucher(op); setIsVoucherModalOpen(true)}} className="p-2.5 bg-white/5 hover:bg-primary-600 rounded-xl text-white transition-all shadow-lg"><Printer size={18}/></button></td></tr>))}{operations.filter(op => op.treasuryId === selectedTreasuryId).length === 0 && (<tr><td colSpan={6} className="p-20 text-center text-night-600 font-bold opacity-40">لا توجد عمليات لهذه الخزينة</td></tr>)}</tbody></table></div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'BANK' && (
                        <div className="space-y-16 animate-fade-in font-['Cairo']">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8"><StatCard title="رصيد البنوك" value={bankAccounts.reduce((a,b)=>a+b.balance,0)} icon={Landmark} theme="blue" /><StatCard title="منح البلدية" value={operations.filter(o => o.source === 'MUNICIPALITY').reduce((a,b)=>a+b.amount,0)} icon={Building} theme="purple" /><StatCard title="منح الولاية" value={operations.filter(o => o.source === 'WILAYA').reduce((a,b)=>a+b.amount,0)} icon={MapPin} theme="amber" /><StatCard title="إعانات DJS" value={operations.filter(o => o.source === 'DJS').reduce((a,b)=>a+b.amount,0)} icon={Activity} theme="emerald" /></div>
                            {filteredBankAccounts.length > 0 ? (<div className="grid gap-10 grid-cols-1 md:grid-cols-2">{filteredBankAccounts.map(bank => renderCreditCard(bank, true))}</div>) : (<div className="p-20 text-center bg-white/5 rounded-[4rem] border border-white/5 border-dashed"><Landmark size={80} className="mx-auto mb-6 text-night-700 opacity-20" /><p className="text-night-500 text-xl font-black italic">لا توجد حسابات بنكية موثقة</p></div>)}
                            <div className="bg-night-800/40 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-3xl backdrop-blur-xl font-['Cairo']" dir="rtl"><div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/40"><div className="flex items-center gap-5"><div className="p-4 bg-emerald-600/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-inner"><Landmark size={28}/></div><h3 className="text-2xl font-black text-white tracking-tighter">كشف العمليات البنكية الموثقة</h3></div><button onClick={() => setIsBankModalOpen(true)} className="relative group overflow-hidden px-10 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white rounded-[1.8rem] font-black text-xs shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4 border border-emerald-400/30"><div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform"><Building size={18} className="text-white" /></div><span className="relative z-10 whitespace-nowrap tracking-wide">عملية بنكية جديدة</span><Sparkles size={14} className="text-emerald-200 animate-pulse" /></button></div><div className="overflow-x-auto"><table className="w-full text-right border-collapse"><thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-[0.2em]"><tr><th className="p-8">النوع</th><th className="p-8">التاريخ</th><th className="p-8">المبلغ</th><th className="p-8">البيان والجهة</th><th className="p-8">رقم القيد</th><th className="p-8 text-center">إجراء</th></tr></thead><tbody className="divide-y divide-white/5 text-sm font-bold">{operations.filter(op => op.bankAccountId === selectedBankId).map(op => (<tr key={op.id} className="hover:bg-white/5 transition-all font-['Cairo']"><td className="p-8 flex items-center gap-4"><div className={`p-3 rounded-xl ${op.type === 'DEPOSIT' || op.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{op.type === 'DEPOSIT' || op.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}</div><span className="font-black text-white">{op.type === 'DEPOSIT' || op.type === 'INCOME' ? 'إيداع' : 'سحب'}</span></td><td className="p-8 text-night-300">{op.date}</td><td className={`p-8 font-black text-2xl tracking-tighter ${op.type === 'DEPOSIT' || op.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>{op.amount.toLocaleString()} دج</td><td className="p-8 text-white">{op.notes}</td><td className="p-8 text-night-500 text-xs">{op.transferNumber || 'BNK-0000'}</td><td className="p-8 text-center"><button onClick={() => {setSelectedVoucher(op); setIsVoucherModalOpen(true)}} className="p-2.5 bg-white/5 hover:bg-emerald-600 rounded-xl text-white transition-all shadow-lg"><Printer size={18}/></button></td></tr>))}{operations.filter(op => op.bankAccountId === selectedBankId).length === 0 && (<tr><td colSpan={6} className="p-20 text-center text-night-600 font-bold opacity-40">لا توجد عمليات مسجلة لهذا الحساب</td></tr>)}</tbody></table></div></div>
                        </div>
                    )}
                    {activeTab === 'TRANSFERS' && (
                        <div className="space-y-12 animate-fade-in font-['Cairo'] text-right" dir="rtl"><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><button onClick={() => {setInternalFunding({...internalFunding, targetType: 'ACTIVITY'}); setIsInternalFundingModalOpen(true)}} className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 via-primary-600/10 to-night-900 border border-primary-500/20 shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative"><div className="p-5 bg-primary-600/20 text-primary-400 w-fit rounded-2xl mb-6 shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all"><Tent size={36}/></div><h4 className="text-2xl font-black text-white">تمويل الأنشطة والمخيمات</h4><p className="text-night-400 text-sm mt-2 font-bold opacity-80">صرف ميزانية تشغيلية لفعالية قادمة أو مخيم تدريبي.</p><div className="mt-8 flex items-center gap-2 text-primary-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-[-8px] transition-transform font-['Cairo']">إجراء تحويل مالي <ArrowRightLeft size={16}/></div></button><button className="p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-night-900 border border-emerald-500/20 shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative"><div className="p-5 bg-emerald-600/20 text-emerald-400 w-fit rounded-2xl mb-6 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all"><ArrowDownCircle size={36}/></div><h4 className="text-2xl font-black text-white">استقبال الفائض المالي</h4><p className="text-night-400 text-sm mt-2 font-bold opacity-80">استعادة المبالغ المتبقية من الأنشطة المغلقة والمشاريع.</p><div className="mt-8 flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-[-8px] transition-transform font-['Cairo']">تسوية العهدة <HandCoins size={16}/></div></button><button onClick={() => {setInternalFunding({...internalFunding, targetType: 'PROJECT'}); setIsInternalFundingModalOpen(true)}} className="p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-600/20 via-fuchsia-600/10 to-night-900 border border-purple-500/20 shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative"><div className="p-5 bg-purple-600/20 text-purple-400 w-fit rounded-2xl mb-6 shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all"><Briefcase size={36}/></div><h4 className="text-2xl font-black text-white">تمويل مشاريع الفوج</h4><p className="text-night-400 text-sm mt-2 font-bold opacity-80">تحويل استثماري لدعم المبادرات الاستراتيجية والمدرة للدخل.</p><div className="mt-8 flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-[-8px] transition-transform font-['Cairo']">بدء الاستثمار <TrendingUp size={16}/></div></button></div><div className="bg-night-800/40 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-xl"><div className="p-8 bg-night-900/40 border-b border-white/5 flex items-center gap-4"><History className="text-primary-500" size={24}/> <h3 className="text-2xl font-black text-white tracking-tighter">سجل التحويلات والتمويل الداخلي</h3></div><div className="overflow-x-auto"><table className="w-full text-right border-collapse"><thead className="bg-night-950 text-night-500 text-[10px] font-black uppercase tracking-widest"><tr><th className="p-6">النوع</th><th className="p-6">التاريخ</th><th className="p-6">المبلغ</th><th className="p-6">الوجهة والبيان</th><th className="p-6">رقم القيد</th></tr></thead><tbody className="divide-y divide-white/5 text-sm font-bold font-['Cairo']">{operations.filter(op => op.type === 'TRANSFER').map(op => (<tr key={op.id} className="hover:bg-white/5 font-['Cairo']"><td className="p-6"><span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-xl border border-purple-500/20 font-black">تمويل داخلي</span></td><td className="p-6 text-night-300">{op.date}</td><td className="p-6 text-rose-400">{op.amount.toLocaleString()} دج</td><td className="p-6 text-white">{op.notes}</td><td className="p-6 text-night-500 text-xs">{op.transferNumber}</td></tr>))}{operations.filter(op => op.type === 'TRANSFER').length === 0 && (<tr><td colSpan={5} className="p-20 text-center text-night-600 font-black italic opacity-40">لا توجد سجلات تمويل داخلي حالياً</td></tr>)}</tbody></table></div></div></div>
                    )}
                    {activeTab === 'REPORTS' && (
                        <div className="space-y-12 animate-fade-in relative pb-20 font-['Cairo']" dir="rtl"><div className="bg-night-800/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl relative overflow-hidden group"><div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div><div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10"><div className="flex items-center gap-8 text-right"><div className="p-8 bg-primary-600/10 text-primary-400 rounded-[2.5rem] shadow-inner border border-white/5 animate-glow-primary"><FilePieChart size={52}/></div><div className="space-y-2"><h3 className="text-5xl font-black text-white tracking-tighter">مركز التحليل الاستراتيجي</h3><p className="text-xs text-night-400 font-black uppercase tracking-[0.4em] italic opacity-60">Strategic Analytics & AI Financial Monitoring</p></div></div><div className="flex gap-4"><button className="px-10 py-5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-[2rem] font-black shadow-2xl flex items-center gap-4 group/ai border border-white/10 font-['Cairo']"><Sparkle size={24} className="group-hover/ai:rotate-12 transition-transform duration-700" /> تحليل الأداء بالذكاء الاصطناعي</button><button className="px-6 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black border border-white/10 shadow-xl transition-all"><Share2 size={20}/></button></div></div></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-12"><div className="bg-night-800/60 p-10 rounded-[4rem] border border-white/10 shadow-xl h-[550px] flex flex-col backdrop-blur-md relative overflow-hidden"><div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-600/5 rounded-full blur-[100px]"></div><div className="flex justify-between items-center mb-10 relative z-10"><h4 className="text-2xl font-black text-white flex items-center gap-3"><BarChart3 size={24} className="text-primary-500"/> توزع التدفقات النقدية</h4><DropdownUI options={['شهري', 'سنوي']} value="شهري" onChange={()=>{}} icon={Calendar} /></div><div className="flex-1 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{name:'يناير',v:0,b:0},{name:'فبراير',v:0,b:0},{name:'مارس',v:0,b:0},{name:'أبريل',v:0,b:0}]}><defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2}/><XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} style={{fontFamily:'Cairo'}}/><YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} style={{fontFamily:'Cairo'}}/><Tooltip contentStyle={{backgroundColor:'#0f172a',borderRadius:'1.5rem',border:'1px solid #1e293b', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)', fontFamily:'Cairo'}}/><Area type="monotone" dataKey="v" stroke="#3b82f6" fillOpacity={1} fill="url(#colorV)" strokeWidth={4}/></AreaChart></ResponsiveContainer></div></div><div className="bg-night-800/60 p-10 rounded-[4rem] border border-white/10 shadow-xl h-[550px] flex flex-col backdrop-blur-md"><h4 className="text-2xl font-black text-white mb-10 flex items-center gap-3 text-right justify-start"><PieChartIcon size={24} className="text-emerald-500"/> الهيكل النسبي لمصادر الدخل</h4><div className="flex-1 w-full text-center py-20 text-night-600 font-bold opacity-30 italic">بانتظار تدفق البيانات الحقيقية...</div></div></div></div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} title="تحرير عملية بنكية استراتيجية" icon={Landmark} maxWidth="max-w-4xl" footer={<button onClick={() => handleAddOperation('BANK')} className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 group/save font-['Cairo']"><Save size={20} className="group-hover/save:scale-110 transition-transform" /> <span className="whitespace-nowrap">توثيق وايداع العملية</span></button>}>
                <div className="space-y-8 text-right font-['Cairo'] animate-fade-in pb-4"><div className="flex bg-night-950 p-2 rounded-3xl border border-white/5 shadow-inner"><button onClick={() => setNewOp({...newOp, type: 'DEPOSIT'})} className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${newOp.type === 'DEPOSIT' || newOp.type === 'INCOME' ? 'bg-emerald-600 text-white shadow-lg' : 'text-night-500 hover:text-white'}`}><TrendingUp size={18}/> إيداع بنكي (+)</button><button onClick={() => setNewOp({...newOp, type: 'WITHDRAWAL'})} className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${newOp.type === 'WITHDRAWAL' ? 'bg-rose-600 text-white shadow-lg' : 'text-night-500 hover:text-white'}`}><TrendingDown size={18}/> سحب / مصروف (-)</button></div><div className="space-y-3"><label className="text-[10px] font-black text-night-400 uppercase tracking-[0.3em] mr-4 block text-center">المبلغ المالي المعتمد (DZD)</label><div className="relative group/amount"><div className="absolute inset-0 bg-emerald-500/5 blur-[50px] rounded-full opacity-0 group-focus-within/amount:opacity-100 transition-opacity"></div><input type="number" className="w-full bg-night-950 border-2 border-white/5 rounded-[2.5rem] p-10 text-white text-6xl font-black focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-center shadow-inner tracking-tighter font-['Cairo'] relative z-10" placeholder="0.00" value={newOp.amount || ''} onChange={e => setNewOp({...newOp, amount: Number(e.target.value)})} /><div className="absolute left-10 top-1/2 -translate-y-1/2 text-night-700 pointer-events-none group-focus-within/amount:opacity-0 transition-opacity z-20"><CreditCard size={56}/></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-night-900/50 p-8 rounded-[3rem] border border-white/5 shadow-inner"><div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest mr-2">تاريخ العملية</label><div className="relative"><input type="date" className="w-full bg-night-950 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary-500 transition-all font-['Cairo']" value={newOp.date} onChange={e => setNewOp({...newOp, date: e.target.value})} /><Calendar className="absolute left-4 top-4 text-night-600" size={18} /></div></div><DropdownUI label="مصدر / وجهة التمويل" value={newOp.source} onChange={(v:any) => setNewOp({...newOp, source: v})} options={BANK_SOURCE_OPTIONS} icon={Building} /><div className="space-y-2"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest mr-2">رقم الشيك / السند (اختياري)</label><div className="relative"><input type="text" placeholder="رقم الشيك المرجعي" className="w-full bg-night-950 border border-white/10 rounded-xl p-4 text-white focus:border-primary-500 outline-none font-bold shadow-inner font-['Cairo']" /><Receipt className="absolute left-4 top-4 text-night-600" size={18} /></div></div></div><div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest mr-2">رقم القيد البنكي</label><div className="relative"><input type="text" placeholder="BNK-XXXX-XXXX" className="w-full bg-night-950 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none font-black font-mono shadow-inner tracking-widest" value={newOp.refNumber} onChange={e => setNewOp({...newOp, refNumber: e.target.value})} /><Hash className="absolute left-4 top-4 text-emerald-600" size={18} /></div></div><DropdownUI label="الموقع / الآمر بالعملية" value={newOp.responsible} onChange={(v:any) => setNewOp({...newOp, responsible: v})} options={SIGNATORY_OPTIONS} icon={UserCheck} /></div></div><div className="space-y-3"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest mr-2">بيان تفصيلي عن العملية</label><textarea className="w-full h-32 bg-night-900 border border-white/10 rounded-[2rem] p-6 text-white focus:border-primary-500 outline-none resize-none font-bold text-sm shadow-inner leading-relaxed font-['Cairo']" placeholder="اذكر تفاصيل إضافية..." value={newOp.notes} onChange={e => setNewOp({...newOp, notes: e.target.value})} /></div></div>
            </Modal>

            {notification && <NotificationPopup msg={notification.msg} type={notification.type} onClose={() => setNotification(null)} />}
        </div>
    );
};

const FilePieChart = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 22H8a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v11" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 16c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" /><path d="M12 12v4h4" /></svg>
);

export default Finance;
