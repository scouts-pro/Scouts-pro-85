
import React, { useState, useMemo } from 'react';
import { Member, UnitName, Transaction, MemberRole } from '../types';
import { UNITS_LIST, SCOUT_YEARS, ROLES_LIST } from '../constants';
import { 
    ShieldCheck, Users, FileText, ArrowRightLeft, Filter, Printer, 
    ChevronDown, CheckCircle2, AlertCircle, Wallet, ArrowUpDown, 
    Search, User, Landmark, Calendar, Hash, Settings2, X, Save, 
    ChevronUp, ArrowDownWideNarrow, TrendingUp, CreditCard, History, ChevronRight
} from 'lucide-react';

interface InsuranceProps {
  members: Member[];
  transactions: Transaction[];
  onTransferToFinance: (data: { 
      type: 'INSURANCE' | 'SUBSCRIPTION'; 
      amount: number; 
      count: number; 
      destination: string; 
  }) => void;
}

const Dropdown = ({ value, onChange, options, label, className, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => o.value === value);
    const displayLabel = selectedOption ? selectedOption.label : 'اختر...';

    return (
        <div className={`relative ${className || ''} font-['Cairo']`}>
            {label && <span className="text-xs text-night-400 mb-2 block font-bold text-right"> {label} </span>}
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all ${disabled ? 'opacity-50' : ''} ${isOpen ? 'border-primary-500 ring-1 ring-primary-500/50' : ''}`}
            >
                <ChevronDown size={16} className={`text-night-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                <span className="font-bold text-sm truncate">{displayLabel}</span>
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-1 bg-night-800 border border-white/10 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                        {options.map((opt: any) => (
                            <div 
                                key={opt.value} 
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`p-3 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between ${opt.value === value ? 'bg-primary-600/10 text-primary-400 font-bold' : ''}`}
                            >
                                {opt.value === value && <CheckCircle2 size={14} />}
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const Insurance: React.FC<InsuranceProps> = ({ members, transactions, onTransferToFinance }) => {
  const [activeTab, setActiveTab] = useState<'INSURANCE' | 'SUBSCRIPTION' | 'LOGS'>('INSURANCE');
  
  // Settings State
  const [fees, setFees] = useState({ insurance: 400, subscription: 600 });
  const [destinations, setDestinations] = useState({ insurance: 'المحافظة الولائية', subscription: 'خزينة الفوج' });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [statsFilters, setStatsFilters] = useState({ unit: 'ALL', year: SCOUT_YEARS[0], role: 'ALL' });
  const [listFilters, setListFilters] = useState({ unit: 'ALL', role: 'ALL', gender: 'ALL', status: 'ALL', search: '' });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Member | 'paymentStatus'; direction: 'asc' | 'desc' } | null>(null);

  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [transferredIds, setTransferredIds] = useState<Record<string, { insurance: boolean; subscription: boolean }>>({});

  const [paymentStatus, setPaymentStatus] = useState<Record<string, { insurance: boolean; subscription: boolean }>>(() => {
      const status: any = {};
      members.forEach((m, idx) => {
          status[m.id] = { insurance: idx % 4 !== 0, subscription: idx % 3 !== 0 }; 
      });
      return status;
  });

  const [transferModal, setTransferModal] = useState<{ isOpen: boolean; type: 'INSURANCE' | 'SUBSCRIPTION' | null; selectedCount: number }>({ isOpen: false, type: null, selectedCount: 0 });

  const stats = useMemo(() => {
    const statsPopulation = members.filter(m => {
        const unitMatch = statsFilters.unit === 'ALL' || m.unit === statsFilters.unit;
        const roleMatch = statsFilters.role === 'ALL' || m.role === statsFilters.role;
        return unitMatch && roleMatch;
    });
    let paidInsuranceCount = 0;
    let paidSubscriptionCount = 0;
    statsPopulation.forEach(m => {
        if (paymentStatus[m.id]?.insurance) paidInsuranceCount++;
        if (paymentStatus[m.id]?.subscription) paidSubscriptionCount++;
    });
    const transfers = transactions.filter(t => t.category === 'INSURANCE' || t.category === 'SUBSCRIPTION');
    return {
        totalPopulation: statsPopulation.length,
        totalTransferred: transfers.reduce((acc, t) => acc + t.amount, 0),
        paidInsuranceCount,
        paidSubscriptionCount,
    };
  }, [members, paymentStatus, transactions, statsFilters]);

  const filteredListMembers = useMemo(() => {
      let result = members.filter(m => {
          const unitMatch = listFilters.unit === 'ALL' || m.unit === listFilters.unit;
          const roleMatch = listFilters.role === 'ALL' || m.role === listFilters.role;
          const genderMatch = listFilters.gender === 'ALL' || m.gender === listFilters.gender;
          const statusMatch = listFilters.status === 'ALL' || (listFilters.status === 'PAID' ? paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription'] : !paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription']);
          const searchMatch = !listFilters.search || m.fullName.toLowerCase().includes(listFilters.search.toLowerCase());
          return unitMatch && roleMatch && genderMatch && statusMatch && searchMatch;
      });
      
      if (sortConfig) {
          result.sort((a, b) => {
              const aValue = a[sortConfig.key as keyof Member] || '';
              const bValue = b[sortConfig.key as keyof Member] || '';
              if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
              if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
          });
      }
      return result;
  }, [members, listFilters, sortConfig, paymentStatus, activeTab]);

  const handleSort = (key: keyof Member) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleTransfer = (type: 'INSURANCE' | 'SUBSCRIPTION') => {
      const typeKey = type === 'INSURANCE' ? 'insurance' : 'subscription';
      const eligibleToTransfer = filteredListMembers.filter(m => paymentStatus[m.id]?.[typeKey] && !transferredIds[m.id]?.[typeKey]);
      
      const count = eligibleToTransfer.length;
      if (count === 0) { 
          alert('لا يوجد أعضاء جدد مسددين في القائمة الحالية لتحويلهم، أو قد تم تحويلهم مسبقاً.'); 
          return; 
      }
      setTransferModal({ isOpen: true, type, selectedCount: count });
  };

  const confirmTransfer = () => {
      if (!transferModal.type) return;
      const typeKey = transferModal.type === 'INSURANCE' ? 'insurance' : 'subscription';
      const fee = transferModal.type === 'INSURANCE' ? fees.insurance : fees.subscription;
      const amount = transferModal.selectedCount * fee;
      const destination = transferModal.type === 'INSURANCE' ? destinations.insurance : destinations.subscription;
      
      onTransferToFinance({
          type: transferModal.type,
          amount: amount,
          count: transferModal.selectedCount,
          destination: destination
      });

      const newTransferredIds = { ...transferredIds };
      filteredListMembers.forEach(m => {
          if (paymentStatus[m.id]?.[typeKey]) {
              if (!newTransferredIds[m.id]) newTransferredIds[m.id] = { insurance: false, subscription: false };
              newTransferredIds[m.id][typeKey] = true;
          }
      });
      setTransferredIds(newTransferredIds);

      setTransferModal({ isOpen: false, type: null, selectedCount: 0 });
      alert('تم تحويل المبالغ للمالية بنجاح. تم قفل السجلات لمنع التكرار.');
  };

  const currentTabType = activeTab === 'INSURANCE' ? 'insurance' : 'subscription';
  const currentTabFee = activeTab === 'INSURANCE' ? fees.insurance : fees.subscription;
  const untransferredPaidMembers = filteredListMembers.filter(m => paymentStatus[m.id]?.[currentTabType] && !transferredIds[m.id]?.[currentTabType]);
  const currentAmountBeforeTransfer = untransferredPaidMembers.length * currentTabFee;

  return (
    <div className="p-8 space-y-8 animate-fade-in relative font-['Cairo']" dir="rtl">
        
        {/* Settings Button - Top Left (Artistic Styling) */}
        <div className="absolute top-8 left-8 z-10">
            <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-night-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-indigo-600 text-white rounded-2xl border border-white/10 shadow-xl transition-all duration-500 group font-black text-sm hover:scale-105 active:scale-95"
            >
                <Settings2 size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                <span>إعدادات</span>
            </button>
        </div>

        <div className="space-y-6">
             <div className="text-right">
                <h2 className="text-3xl font-black text-white flex items-center gap-3 justify-start tracking-tight">
                    <ShieldCheck className="text-blue-500" size={36} /> إدارة التأمينات والاشتراكات
                </h2>
                <p className="text-night-400 mt-2 font-bold opacity-80">تحصيل الرسوم ومتابعة الوضعية المالية للأعضاء وتحويلها للمالية (مرة واحدة سنوياً لكل عضو).</p>
             </div>
             <div className="bg-night-800/40 p-6 rounded-[2rem] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl backdrop-blur-md">
                <Dropdown label="السنة الكشفية" value={statsFilters.year} onChange={(val: any) => setStatsFilters({...statsFilters, year: val})} options={SCOUT_YEARS.map(y => ({value: y, label: y}))} />
                <Dropdown label="الوحدة" value={statsFilters.unit} onChange={(val: any) => setStatsFilters({...statsFilters, unit: val})} options={[{value: 'ALL', label: 'كل الوحدات'}, ...UNITS_LIST.map(u => ({value: u, label: u}))]} />
                <Dropdown label="الصفة" value={statsFilters.role} onChange={(val: any) => setStatsFilters({...statsFilters, role: val})} options={[{value: 'ALL', label: 'الكل'}, ...ROLES_LIST.map(r => ({value: r, label: r}))]} />
             </div>
        </div>

        {/* Stats Cards - Enhanced Visuals & Cairo Font */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 via-night-800 to-night-900 border border-blue-500/20 p-7 rounded-[2.2rem] shadow-2xl hover:-translate-y-2 transition-all duration-500 text-right group">
                <div className="flex justify-between items-start mb-4"><Users className="text-blue-400 group-hover:scale-110 transition-transform" size={24}/><TrendingUp className="text-blue-500/30" size={20}/></div>
                <p className="text-blue-200/60 text-[10px] font-black uppercase tracking-widest mb-2 font-['Cairo']">إجمالي الأعضاء</p>
                <p className="text-3xl font-black text-white font-['Cairo']">{stats.totalPopulation}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600/20 via-night-800 to-night-900 border border-emerald-500/20 p-7 rounded-[2.2rem] shadow-2xl hover:-translate-y-2 transition-all duration-500 text-right group">
                <div className="flex justify-between items-start mb-4"><ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-transform" size={24}/><CheckCircle2 className="text-emerald-500/30" size={20}/></div>
                <p className="text-emerald-200/60 text-[10px] font-black uppercase tracking-widest mb-2 font-['Cairo']">تم تأمين</p>
                <p className="text-3xl font-black text-emerald-400 font-['Cairo']">{stats.paidInsuranceCount}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600/20 via-night-800 to-night-900 border border-amber-500/20 p-7 rounded-[2.2rem] shadow-2xl hover:-translate-y-2 transition-all duration-500 text-right group">
                <div className="flex justify-between items-start mb-4"><Wallet className="text-amber-400 group-hover:scale-110 transition-transform" size={24}/><div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div></div>
                <p className="text-amber-200/60 text-[10px] font-black uppercase tracking-widest mb-2 font-['Cairo']">اشتراكات محصلة</p>
                <p className="text-3xl font-black text-amber-400 font-['Cairo']">{stats.paidSubscriptionCount}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-600/20 via-night-800 to-night-900 border border-violet-500/20 p-7 rounded-[2.2rem] shadow-2xl hover:-translate-y-2 transition-all duration-500 text-right group">
                <div className="flex justify-between items-start mb-4"><CreditCard className="text-violet-400 group-hover:scale-110 transition-transform" size={24}/><Landmark className="text-violet-500/30" size={20}/></div>
                <p className="text-violet-200/60 text-[10px] font-black uppercase tracking-widest mb-2 font-['Cairo']">إجمالي التحويلات</p>
                <p className="text-3xl font-black text-white font-['Cairo']">{stats.totalTransferred.toLocaleString()}</p>
            </div>
        </div>

        {/* Tab Selection - Piece of Art */}
        <div className="flex bg-night-900/60 p-2 rounded-[2rem] border border-white/5 mb-6 justify-start gap-3 backdrop-blur-xl shadow-inner">
            {['INSURANCE', 'SUBSCRIPTION', 'LOGS'].map(t => (
                <button 
                    key={t} 
                    onClick={() => { setActiveTab(t as any); setConfirmCancelId(null); }} 
                    className={`px-10 py-4 font-black text-xs rounded-[1.5rem] transition-all duration-500 tracking-widest flex items-center gap-2 relative overflow-hidden group ${activeTab === t ? 'bg-primary-600 text-white shadow-2xl shadow-primary-900/40 translate-y-[-2px]' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
                >
                    {activeTab === t && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-30 animate-pulse"></div>}
                    {t === 'INSURANCE' ? <ShieldCheck size={18}/> : t === 'SUBSCRIPTION' ? <Wallet size={18}/> : <History size={18}/>}
                    <span className="relative z-10">{t === 'INSURANCE' ? 'التأمينات' : t === 'SUBSCRIPTION' ? 'الاشتراكات' : 'سجل التحويلات'}</span>
                </button>
            ))}
        </div>

        <div className="bg-night-800/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 min-h-[500px] shadow-2xl relative">
            {activeTab !== 'LOGS' ? (
                <div className="animate-fade-in space-y-6 text-right">
                    
                    {/* Artistic Toolbar */}
                    <div className="flex justify-between items-center bg-night-950/40 p-5 rounded-3xl border border-white/5 shadow-inner">
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-500 font-black text-sm hover:scale-105 ${isFiltersOpen ? 'bg-primary-600 border-primary-500 text-white shadow-lg' : 'bg-night-800 border-white/10 text-night-300 hover:text-white'}`}
                            >
                                <Filter size={18} /> تصفية متقدمة
                            </button>
                            <div className="relative group">
                                <input type="text" placeholder="بحث باسم العضو..." className="bg-night-800 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-white text-sm outline-none text-right font-['Cairo'] w-72 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner group-hover:border-white/20" value={listFilters.search} onChange={(e) => setListFilters({...listFilters, search: e.target.value})} />
                                <Search size={20} className="absolute right-4 top-3 text-night-400 group-focus-within:text-primary-400 transition-colors"/>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleTransfer(activeTab as any)} 
                            className="px-10 py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-2xl font-black shadow-2xl shadow-primary-900/40 transition-all duration-500 flex items-center gap-3 text-sm hover:scale-[1.03] active:scale-95 group"
                        >
                            <ArrowRightLeft size={20} className="group-hover:rotate-180 transition-transform duration-700" /> 
                            <span>التحويل إلى قسم المالية</span>
                        </button>
                    </div>

                    {isFiltersOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-night-900/60 p-8 rounded-3xl border border-white/10 animate-slide-in shadow-2xl">
                            <Dropdown label="الوحدة" value={listFilters.unit} onChange={(v: any) => setListFilters({...listFilters, unit: v})} options={[{value: 'ALL', label: 'كل الوحدات'}, ...UNITS_LIST.map(u => ({value: u, label: u}))]} />
                            <Dropdown label="الصفة" value={listFilters.role} onChange={(v: any) => setListFilters({...listFilters, role: v})} options={[{value: 'ALL', label: 'الكل'}, ...ROLES_LIST.map(r => ({value: r, label: r}))]} />
                            <Dropdown label="الجنس" value={listFilters.gender} onChange={(v: any) => setListFilters({...listFilters, gender: v})} options={[{value: 'ALL', label: 'الكل'}, {value: 'ذكر', label: 'ذكر'}, {value: 'أنثى', label: 'أنثى'}]} />
                            <Dropdown label="حالة الدفع" value={listFilters.status} onChange={(v: any) => setListFilters({...listFilters, status: v})} options={[{value: 'ALL', label: 'الكل'}, {value: 'PAID', label: 'مسدد'}, {value: 'UNPAID', label: 'غير مسدد'}]} />
                        </div>
                    )}

                    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-night-900/20 shadow-inner">
                        <table className="w-full text-right border-collapse">
                            <thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <tr>
                                    <th className="p-5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('fullName')}>
                                        <div className="flex items-center gap-2 justify-start font-['Cairo']">العضو <ArrowUpDown size={12}/></div>
                                    </th>
                                    <th className="p-5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('unit')}>
                                        <div className="flex items-center gap-2 justify-start font-['Cairo']">الوحدة <ArrowUpDown size={12}/></div>
                                    </th>
                                    <th className="p-5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('birthDate')}>
                                        <div className="flex items-center gap-2 justify-start font-['Cairo']">تاريخ الميلاد <ArrowUpDown size={12}/></div>
                                    </th>
                                    <th className="p-5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('insuranceNumber')}>
                                        <div className="flex items-center gap-2 justify-start font-['Cairo']">رقم التأمين <ArrowUpDown size={12}/></div>
                                    </th>
                                    <th className="p-5 font-['Cairo']">الحالة</th>
                                    <th className="p-5 text-center font-['Cairo']">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredListMembers.map(m => {
                                    const typeKey = activeTab === 'INSURANCE' ? 'insurance' : 'subscription';
                                    const isPaid = paymentStatus[m.id]?.[typeKey];
                                    const isTransferred = transferredIds[m.id]?.[typeKey];
                                    const isConfirmingCancel = confirmCancelId === m.id;

                                    return (
                                        <tr key={m.id} className={`hover:bg-white/5 transition-all duration-300 group/row ${isTransferred ? 'opacity-50' : ''}`}>
                                            <td className="p-5 flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={m.image} className="w-11 h-11 rounded-2xl border-2 border-night-700 shadow-xl group-hover/row:scale-105 transition-transform duration-500" />
                                                    {isPaid && <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-night-800 shadow-lg"><CheckCircle2 size={10} className="text-white"/></div>}
                                                </div>
                                                <div><p className="font-black text-white text-base leading-none group-hover/row:text-primary-400 transition-colors">{m.fullName}</p></div>
                                            </td>
                                            <td className="p-5 text-night-300 font-bold">{m.unit}</td>
                                            <td className="p-5 text-night-400 font-['Cairo']">{m.birthDate || '---'}</td>
                                            <td className="p-5 text-night-300 font-black tracking-widest font-['Cairo']">{m.insuranceNumber || '---'}</td>
                                            <td className="p-5">
                                                {isTransferred ? (
                                                    <span className="text-blue-400 text-[10px] font-black bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 flex items-center gap-2 w-fit uppercase shadow-inner">
                                                        <History size={14}/> تم التحويل نهائياً
                                                    </span>
                                                ) : isPaid ? (
                                                    <span className="text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit block uppercase shadow-inner">جاهز للتحويل</span>
                                                ) : (
                                                    <span className="text-red-400 text-[10px] font-black bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 w-fit block uppercase shadow-inner">غير مسدد</span>
                                                )}
                                            </td>
                                            <td className="p-5 text-center">
                                                {!isTransferred && (
                                                    isPaid ? (
                                                        isConfirmingCancel ? (
                                                            <div className="flex items-center justify-center gap-3 animate-fade-in">
                                                                <button 
                                                                    onClick={() => {
                                                                        setPaymentStatus({...paymentStatus, [m.id]: {...paymentStatus[m.id], [typeKey]: false}});
                                                                        setConfirmCancelId(null);
                                                                    }}
                                                                    className="text-[10px] font-black text-red-400 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all shadow-2xl animate-pulse"
                                                                >
                                                                    تأكيد الإلغاء؟
                                                                </button>
                                                                <button onClick={() => setConfirmCancelId(null)} className="p-2 bg-white/5 rounded-full text-night-400 hover:text-white transition-colors"><X size={16}/></button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setConfirmCancelId(m.id)} className="text-[10px] font-black text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-emerald-500/20">
                                                                مسدد (تعديل)
                                                            </button>
                                                        )
                                                    ) : (
                                                        <button 
                                                            onClick={() => setPaymentStatus({...paymentStatus, [m.id]: {...paymentStatus[m.id], [typeKey]: true}})} 
                                                            className="text-xs font-black text-primary-400 px-6 py-2 rounded-xl border border-primary-500/30 hover:bg-primary-600 hover:text-white hover:shadow-glow transition-all duration-500 shadow-sm transform hover:scale-105 active:scale-95"
                                                        >
                                                            تسجيل
                                                        </button>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-12 bg-night-900/60 border-t border-white/10 rounded-b-[3rem] grid grid-cols-1 md:grid-cols-3 items-center gap-12 shadow-inner">
                        <div className="flex flex-col items-center justify-center text-center space-y-3 group">
                            <span className="text-xs text-night-500 font-black uppercase tracking-widest group-hover:text-primary-400 transition-colors">إجمالي الأعضاء في القائمة</span>
                            <div className="flex items-center gap-4 justify-center bg-night-950/40 px-6 py-3 rounded-2xl border border-white/5 shadow-xl">
                                <Users size={22} className="text-primary-500" />
                                <span className="text-3xl font-black text-white font-['Cairo'] tracking-tighter">{filteredListMembers.length}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center space-y-3 group">
                            <span className="text-xs text-emerald-500/70 font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors">جاهز للتحويل (غير مكرر)</span>
                            <div className="flex items-center gap-4 justify-center bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/10 shadow-xl shadow-emerald-950/20">
                                <CheckCircle2 size={22} className="text-emerald-500" />
                                <span className="text-4xl font-black text-emerald-400 font-['Cairo'] tracking-tighter">
                                    {untransferredPaidMembers.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center space-y-3 group">
                            <span className="text-xs text-amber-200/60 font-black uppercase tracking-widest group-hover:text-amber-200 transition-colors">القيمة الإجمالية الصافية</span>
                            <div className="flex items-baseline gap-3 justify-center bg-amber-500/5 px-8 py-4 rounded-[2rem] border border-amber-500/10 shadow-2xl shadow-amber-950/30 ring-2 ring-amber-500/5">
                                <span className="text-4xl font-black text-[#fef3c7] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)] font-['Cairo'] tracking-tighter leading-none">
                                    {currentAmountBeforeTransfer.toLocaleString()}
                                </span>
                                <span className="text-[#fef3c7]/60 font-black text-sm uppercase">دج</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in space-y-6">
                    <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-night-900/40 shadow-inner">
                        <table className="w-full text-right" dir="rtl">
                            <thead className="bg-night-950/80 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <tr>
                                    <th className="p-6">التاريخ والوقت</th>
                                    <th className="p-6">البيان والجهة المستقبلة</th>
                                    <th className="p-6">المبلغ الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {transactions
                                    .filter(t => t.category === 'INSURANCE' || t.category === 'SUBSCRIPTION')
                                    .map(t => (
                                        <tr key={t.id} className="hover:bg-white/5 transition-colors group/log">
                                            <td className="p-6 text-night-400 font-['Cairo'] font-bold group-hover/log:text-white transition-colors">{t.date}</td>
                                            <td className="p-6 text-white font-bold leading-relaxed">{t.description}</td>
                                            <td className="p-6">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-black text-emerald-400 text-2xl font-['Cairo']">{t.amount.toLocaleString()}</span>
                                                    <span className="text-[10px] text-emerald-500/50 font-black">دج</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-10 bg-night-900/50 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center gap-4 shadow-inner">
                        <History size={48} className="text-night-700 animate-pulse" />
                        <p className="text-lg text-night-500 font-black tracking-tight opacity-60">أرشيف التحويلات المالية - نظام الحماية v2.5 مفعل</p>
                    </div>
                </div>
            )}
        </div>

        {/* Settings Modal - Piece of Art */}
        {isSettingsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/95 backdrop-blur-md p-4 animate-fade-in" dir="rtl">
                <div className="bg-night-800 w-full max-w-lg rounded-[3rem] border border-white/10 p-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative font-['Cairo'] text-right overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600"></div>
                    <button onClick={() => setIsSettingsModalOpen(false)} className="absolute top-8 left-8 text-night-400 hover:text-white transition-all p-3 bg-white/5 rounded-full hover:rotate-90 duration-500 shadow-xl border border-white/10"><X size={20}/></button>
                    <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 justify-start"><Settings2 size={32} className="text-primary-500 animate-glow-primary" /> إعدادات القسم المالية</h3>
                    
                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-night-400 uppercase tracking-[0.2em] block pr-1">مبلغ التأمين السنوي</label>
                                <div className="relative group/input">
                                    <input type="number" value={fees.insurance} onChange={e => setFees({...fees, insurance: Number(e.target.value)})} className="w-full bg-night-900 border border-white/10 rounded-2xl p-5 text-white font-black text-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none shadow-inner transition-all group-hover/input:border-white/20" />
                                    <div className="absolute left-5 top-5 text-night-500 font-black text-xs">دج</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-night-400 uppercase tracking-[0.2em] block pr-1">مبلغ الاشتراك السنوي</label>
                                <div className="relative group/input">
                                    <input type="number" value={fees.subscription} onChange={e => setFees({...fees, subscription: Number(e.target.value)})} className="w-full bg-night-900 border border-white/10 rounded-2xl p-5 text-white font-black text-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none shadow-inner transition-all group-hover/input:border-white/20" />
                                    <div className="absolute left-5 top-5 text-night-500 font-black text-xs">دج</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-night-400 uppercase tracking-[0.2em] block pr-1">وجهة التأمينات الافتراضية</label>
                                <div className="flex bg-night-950 p-2 rounded-[1.8rem] border border-white/5 shadow-inner">
                                    <button onClick={() => setDestinations({...destinations, insurance: 'المحافظة الولائية'})} className={`flex-1 py-4 rounded-[1.4rem] text-xs font-black transition-all duration-500 ${destinations.insurance === 'المحافظة الولائية' ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-2xl shadow-primary-900/50 scale-[1.02]' : 'text-night-500 hover:text-white'}`}>المحافظة الولائية</button>
                                    <button onClick={() => setDestinations({...destinations, insurance: 'القيادة العامة'})} className={`flex-1 py-4 rounded-[1.4rem] text-xs font-black transition-all duration-500 ${destinations.insurance === 'القيادة العامة' ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-2xl shadow-primary-900/50 scale-[1.02]' : 'text-night-500 hover:text-white'}`}>القيادة العامة</button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-night-400 uppercase tracking-[0.2em] block pr-1">وجهة الاشتراكات الافتراضية</label>
                                <div className="flex bg-night-950 p-2 rounded-[1.8rem] border border-white/5 shadow-inner">
                                    <button onClick={() => setDestinations({...destinations, subscription: 'خزينة الفوج'})} className={`flex-1 py-4 rounded-[1.4rem] text-xs font-black transition-all duration-500 ${destinations.subscription === 'خزينة الفوج' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-900/50 scale-[1.02]' : 'text-night-500 hover:text-white'}`}>خزينة الفوج</button>
                                    <button onClick={() => setDestinations({...destinations, subscription: 'صندوق الوحدة'})} className={`flex-1 py-4 rounded-[1.4rem] text-xs font-black transition-all duration-500 ${destinations.subscription === 'صندوق الوحدة' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-900/50 scale-[1.02]' : 'text-night-500 hover:text-white'}`}>صندوق الوحدة</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setIsSettingsModalOpen(false)} className="w-full mt-12 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[1.5rem] font-black shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center justify-center gap-4 transition-all duration-500 transform hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-widest group/save"><Save size={20} className="group-hover:scale-125 transition-transform" /> حفظ الإعدادات</button>
                </div>
            </div>
        )}

        {/* Transfer Confirmation Modal - Artistic & RTL Corrected */}
        {transferModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/90 backdrop-blur-xl p-4 animate-fade-in" dir="rtl">
                <div className="bg-night-800 w-full max-w-md rounded-[3.5rem] border border-white/10 p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] text-right font-['Cairo'] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-primary-600 via-indigo-600 to-purple-600"></div>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px]"></div>
                    
                    <h3 className="text-3xl font-black text-white mb-8 text-right tracking-tight drop-shadow-lg">تأكيد التحويل النهائي</h3>
                    
                    <div className="bg-night-900/80 p-8 rounded-[2.5rem] space-y-6 mb-10 border border-white/5 shadow-2xl shadow-inner relative z-10">
                        {/* Fixed RTL Labels & Cairo Values */}
                        <div className="flex flex-row justify-between items-center text-sm font-black border-b border-white/5 pb-4">
                            <span className="text-night-400 order-1 font-['Cairo']">عدد الأعضاء</span>
                            <span className="text-white order-2 font-['Cairo'] text-lg">{transferModal.selectedCount} عضو</span>
                        </div>
                        <div className="flex flex-row justify-between items-center text-sm font-black border-b border-white/5 pb-4">
                            <span className="text-night-400 order-1 font-['Cairo']">وجهة التحويل</span>
                            <span className="text-primary-400 order-2 font-black font-['Cairo'] text-lg">{transferModal.type === 'INSURANCE' ? destinations.insurance : destinations.subscription}</span>
                        </div>
                        <div className="flex flex-row justify-between items-center font-black text-2xl pt-4">
                            <span className="text-primary-400 order-1 font-['Cairo']">المبلغ الإجمالي</span>
                            <div className="flex items-baseline gap-2 order-2">
                                <span className="text-[#fef3c7] font-black font-['Cairo'] text-4xl drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">{(transferModal.selectedCount * (transferModal.type === 'INSURANCE' ? fees.insurance : fees.subscription)).toLocaleString()}</span>
                                <span className="text-amber-200/50 text-xs font-black">دج</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-red-950/20 border border-red-500/20 rounded-2xl mb-10 relative z-10">
                        <p className="text-[11px] text-red-300 font-bold leading-relaxed text-right flex gap-3">
                            <AlertCircle size={32} className="shrink-0 text-red-500" />
                            تحذير: سيتم قفل هذه الأسماء لهذا الموسم فور التأكيد. لن يسمح النظام بإعادة تحويل نفس الأعضاء لتفادي تكرار الموازنة المالية وتضخم السجلات.
                        </p>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <button 
                            onClick={() => setTransferModal({isOpen: false, type: null, selectedCount: 0})} 
                            className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all duration-500 border border-white/5 shadow-lg active:scale-95"
                        >
                            إلغاء العملية
                        </button>
                        <button 
                            onClick={confirmTransfer} 
                            className="flex-1 py-5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-2xl font-black shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all duration-500 transform hover:scale-[1.02] active:scale-95 group/confirm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <CheckCircle2 size={20} className="group-hover/confirm:scale-125 transition-transform" />
                                تأكيد نهائي
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Insurance;
