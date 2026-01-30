
import React, { useState, useMemo } from 'react';
import { Member, UnitName, Transaction, MemberRole } from '../types';
import { UNITS_LIST, SCOUT_YEARS, ROLES_LIST } from '../constants';
import { ShieldCheck, Users, FileText, ArrowRightLeft, Filter, Printer, ChevronDown, CheckCircle2, AlertCircle, Wallet, ArrowUpDown, ChevronUp, Search, User, Landmark } from 'lucide-react';

interface InsuranceProps {
  members: Member[];
  transactions: Transaction[]; // For history reference
  onTransferToFinance: (data: { 
      type: 'INSURANCE' | 'SUBSCRIPTION'; 
      amount: number; 
      count: number; 
      destination: string; 
      memberIds: string[];
  }) => void;
}

// --- Custom Dropdown Component ---
const Dropdown = ({ value, onChange, options, label, className }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => o.value === value);
    const displayLabel = selectedOption ? selectedOption.label : 'اختر...';

    return (
        <div className={`relative ${className || ''}`}>
            {label && <span className="text-xs text-night-400 mb-1 block font-bold">{label}</span>}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all ${isOpen ? 'border-primary-500 ring-1 ring-primary-500/50' : ''}`}
            >
                <span className="font-bold text-sm truncate">{displayLabel}</span>
                <ChevronDown size={16} className={`text-night-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-1 bg-night-800 border border-white/10 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                        {options.map((opt: any) => (
                            <div 
                                key={opt.value} 
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`p-3 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between ${opt.value === value ? 'bg-primary-600/10 text-primary-400' : ''}`}
                            >
                                {opt.label}
                                {opt.value === value && <CheckCircle2 size={14} />}
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
  
  // --- Stats Filters (Top of Page) ---
  const [statsFilters, setStatsFilters] = useState({
      unit: 'ALL',
      year: SCOUT_YEARS[0],
      role: 'ALL' // New: Filter stats by Role
  });

  // --- List Filters (Advanced Collapsible) ---
  const [showListFilters, setShowListFilters] = useState(false);
  const [listFilters, setListFilters] = useState({
      unit: 'ALL',
      role: 'ALL',
      patrol: 'ALL',
      search: ''
  });

  // --- Sorting State ---
  const [sortConfig, setSortConfig] = useState<{ key: keyof Member | 'paymentStatus'; direction: 'asc' | 'desc' } | null>(null);

  // Settings (Could be dynamic in a real app)
  const INSURANCE_FEE = 400; // DZD sent to Wilaya
  const SUBSCRIPTION_FEE = 600; // DZD kept in group

  // Mock Payment Status State
  const [paymentStatus, setPaymentStatus] = useState<Record<string, { insurance: boolean; subscription: boolean }>>(() => {
      const status: any = {};
      members.forEach((m, idx) => {
          status[m.id] = { 
              insurance: idx % 3 !== 0, 
              subscription: idx % 2 !== 0 
          }; 
      });
      return status;
  });

  // Transfer Modal State
  const [transferModal, setTransferModal] = useState<{
      isOpen: boolean;
      type: 'INSURANCE' | 'SUBSCRIPTION' | null;
      selectedMembers: string[];
  }>({ isOpen: false, type: null, selectedMembers: [] });

  const [externalDestination, setExternalDestination] = useState('المحافظة الولائية');

  // --- 1. Statistics Calculation (Based on Top Filters) ---
  const stats = useMemo(() => {
    // Filter the population for stats
    const statsPopulation = members.filter(m => {
        const unitMatch = statsFilters.unit === 'ALL' || m.unit === statsFilters.unit;
        const roleMatch = statsFilters.role === 'ALL' || m.role === statsFilters.role;
        // In real app, check m.scoutYear === statsFilters.year
        return unitMatch && roleMatch;
    });

    let totalInsuranceCollected = 0;
    let totalSubscriptionCollected = 0;
    let paidInsuranceCount = 0;
    let paidSubscriptionCount = 0;

    const insuranceTransfers = transactions.filter(t => t.category === 'INSURANCE' && t.type === 'EXPENSE');
    const subscriptionTransfers = transactions.filter(t => t.category === 'SUBSCRIPTION' && t.type === 'INCOME');

    const totalTransferredInsurance = insuranceTransfers.reduce((acc, t) => acc + t.amount, 0);
    const totalTransferredSubscription = subscriptionTransfers.reduce((acc, t) => acc + t.amount, 0);

    statsPopulation.forEach(m => {
        if (paymentStatus[m.id]?.insurance) { totalInsuranceCollected += INSURANCE_FEE; paidInsuranceCount++; }
        if (paymentStatus[m.id]?.subscription) { totalSubscriptionCollected += SUBSCRIPTION_FEE; paidSubscriptionCount++; }
    });

    return {
        totalPopulation: statsPopulation.length,
        totalInsuranceCollected,
        totalSubscriptionCollected,
        totalTransferredInsurance,
        totalTransferredSubscription,
        paidInsuranceCount,
        paidSubscriptionCount,
    };
  }, [members, paymentStatus, transactions, statsFilters]);

  // --- 2. List Filtering & Sorting Logic ---
  const filteredListMembers = useMemo(() => {
      let result = members.filter(m => {
          const unitMatch = listFilters.unit === 'ALL' || m.unit === listFilters.unit;
          const roleMatch = listFilters.role === 'ALL' || m.role === listFilters.role;
          const patrolMatch = listFilters.patrol === 'ALL' || m.patrol === listFilters.patrol;
          const searchMatch = !listFilters.search || 
              m.fullName.toLowerCase().includes(listFilters.search.toLowerCase()) || 
              m.membershipNumber.includes(listFilters.search);
          
          return unitMatch && roleMatch && patrolMatch && searchMatch;
      });

      if (sortConfig) {
          result.sort((a, b) => {
              if (sortConfig.key === 'paymentStatus') {
                  const type = activeTab === 'INSURANCE' ? 'insurance' : 'subscription';
                  const aPaid = paymentStatus[a.id]?.[type] ? 1 : 0;
                  const bPaid = paymentStatus[b.id]?.[type] ? 1 : 0;
                  return sortConfig.direction === 'asc' ? aPaid - bPaid : bPaid - aPaid;
              }
              
              const aValue = a[sortConfig.key] || '';
              const bValue = b[sortConfig.key] || '';
              
              if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
              if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
          });
      }

      return result;
  }, [members, listFilters, sortConfig, activeTab, paymentStatus]);

  // --- Handlers ---
  const handleSort = (key: keyof Member | 'paymentStatus') => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const handleSelectForTransfer = (type: 'INSURANCE' | 'SUBSCRIPTION') => {
      const eligibleMembers = filteredListMembers
        .filter(m => type === 'INSURANCE' ? paymentStatus[m.id]?.insurance : paymentStatus[m.id]?.subscription)
        .map(m => m.id);

      if (eligibleMembers.length === 0) {
          alert('لا يوجد أعضاء مؤهلين للتحويل في القائمة الحالية.');
          return;
      }

      setTransferModal({ isOpen: true, type, selectedMembers: eligibleMembers });
  };

  const confirmTransfer = () => {
      if (!transferModal.type) return;

      const count = transferModal.selectedMembers.length;
      const amount = count * (transferModal.type === 'INSURANCE' ? INSURANCE_FEE : SUBSCRIPTION_FEE);

      onTransferToFinance({
          type: transferModal.type,
          amount: amount,
          count: count,
          destination: transferModal.type === 'INSURANCE' ? externalDestination : 'خزينة الفوج',
          memberIds: transferModal.selectedMembers
      });

      setTransferModal({ isOpen: false, type: null, selectedMembers: [] });
      alert('تم تحويل المبالغ إلى قسم المالية وتوثيق العملية بنجاح.');
  };

  const togglePayment = (id: string, type: 'insurance' | 'subscription') => {
      setPaymentStatus(prev => ({
          ...prev,
          [id]: { ...prev[id], [type]: !prev[id]?.[type] }
      }));
  };

  const SortableHeader = ({ label, sortKey }: { label: string, sortKey: keyof Member | 'paymentStatus' }) => (
      <th 
        className="p-4 cursor-pointer hover:text-white transition-colors select-none group"
        onClick={() => handleSort(sortKey)}
      >
          <div className="flex items-center gap-1">
              {label} 
              <div className="flex flex-col">
                  <ChevronUp size={10} className={`-mb-1 ${sortConfig?.key === sortKey && sortConfig.direction === 'asc' ? 'text-primary-500' : 'text-night-600 group-hover:text-night-400'}`} />
                  <ChevronDown size={10} className={`${sortConfig?.key === sortKey && sortConfig.direction === 'desc' ? 'text-primary-500' : 'text-night-600 group-hover:text-night-400'}`} />
              </div>
          </div>
      </th>
  );

  return (
    <div className="p-8 space-y-8 animate-fade-in relative">
        
        {/* Header & Stats Filters Container */}
        <div className="space-y-6">
             <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="text-blue-500" size={32} />
                    إدارة التأمينات والاشتراكات
                </h2>
                <p className="text-night-400 mt-2">تحصيل الرسوم ومتابعة الوضعية المالية للأعضاء</p>
             </div>
             
             {/* Stats Filters - Updated to FULL WIDTH and Custom Dropdown */}
             <div className="bg-night-800/50 p-4 rounded-2xl border border-white/5 w-full">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Dropdown 
                        label="السنة الكشفية"
                        value={statsFilters.year}
                        onChange={(val: any) => setStatsFilters({...statsFilters, year: val})}
                        options={SCOUT_YEARS.map(y => ({value: y, label: y}))}
                        className="w-full"
                    />
                    <Dropdown 
                        label="تصفية الإحصائيات (وحدة)"
                        value={statsFilters.unit}
                        onChange={(val: any) => setStatsFilters({...statsFilters, unit: val})}
                        options={[{value: 'ALL', label: 'كل الوحدات'}, ...UNITS_LIST.map(u => ({value: u, label: u}))]}
                        className="w-full"
                    />
                    <Dropdown 
                        label="تصفية الإحصائيات (صفة)"
                        value={statsFilters.role}
                        onChange={(val: any) => setStatsFilters({...statsFilters, role: val})}
                        options={[{value: 'ALL', label: 'الكل'}, ...ROLES_LIST.map(r => ({value: r, label: r}))]}
                        className="w-full"
                    />
                 </div>
             </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-night-800/60 p-6 rounded-2xl border border-white/5 shadow-lg">
                <p className="text-night-400 text-sm font-bold mb-2 flex items-center gap-2"><Users size={16}/> إجمالي الأعضاء</p>
                <p className="text-3xl font-bold text-white font-mono">{stats.totalPopulation}</p>
            </div>
            <div className="bg-night-800/60 p-6 rounded-2xl border border-blue-500/20 shadow-lg">
                <p className="text-blue-300 text-sm font-bold mb-2 flex items-center gap-2"><ShieldCheck size={16}/> تم تأمينهم</p>
                <div className="flex justify-between items-end">
                    <p className="text-3xl font-bold text-blue-400 font-mono">{stats.paidInsuranceCount}</p>
                    <p className="text-xs text-night-400 mb-1">{stats.totalPopulation > 0 ? Math.round((stats.paidInsuranceCount/stats.totalPopulation)*100) : 0}%</p>
                </div>
                <div className="w-full bg-night-900 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{width: `${stats.totalPopulation > 0 ? (stats.paidInsuranceCount/stats.totalPopulation)*100 : 0}%`}}></div>
                </div>
            </div>
            <div className="bg-night-800/60 p-6 rounded-2xl border border-emerald-500/20 shadow-lg">
                <p className="text-emerald-300 text-sm font-bold mb-2 flex items-center gap-2"><Wallet size={16}/> اشتراكات محصلة</p>
                <div className="flex justify-between items-end">
                    <p className="text-3xl font-bold text-emerald-400 font-mono">{stats.paidSubscriptionCount}</p>
                    <p className="text-xs text-night-400 mb-1">{stats.totalPopulation > 0 ? Math.round((stats.paidSubscriptionCount/stats.totalPopulation)*100) : 0}%</p>
                </div>
                <div className="w-full bg-night-900 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{width: `${stats.totalPopulation > 0 ? (stats.paidSubscriptionCount/stats.totalPopulation)*100 : 0}%`}}></div>
                </div>
            </div>
            
            {/* Elegant Transfer Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-900/30 to-night-800 p-6 rounded-2xl border border-violet-500/30 shadow-lg group">
                <div className="absolute top-0 right-0 w-1 h-full bg-violet-500"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-violet-500/10 rounded-full blur-xl group-hover:bg-violet-500/20 transition-colors"></div>
                
                <p className="text-violet-300 text-sm font-bold mb-2 flex items-center gap-2 relative z-10"><ArrowRightLeft size={16}/> إجمالي التحويلات</p>
                <p className="text-3xl font-bold text-white font-mono relative z-10">{(stats.totalTransferredInsurance + stats.totalTransferredSubscription).toLocaleString()} <span className="text-xs text-violet-400">DA</span></p>
                <div className="mt-3 flex items-center gap-1 text-xs text-night-400 relative z-10">
                    <Landmark size={12} />
                    <span>تم تحويلها للمالية / المحافظة</span>
                </div>
            </div>
        </div>

        {/* Main Tabs */}
        <div className="flex border-b border-white/10 mb-6">
            <button onClick={() => setActiveTab('INSURANCE')} className={`px-8 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'INSURANCE' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-night-400 hover:text-white'}`}>
                <ShieldCheck size={18} /> التأمينات السنوية
            </button>
            <button onClick={() => setActiveTab('SUBSCRIPTION')} className={`px-8 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'SUBSCRIPTION' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-night-400 hover:text-white'}`}>
                <Wallet size={18} /> الاشتراكات السنوية
            </button>
            <button onClick={() => setActiveTab('LOGS')} className={`px-8 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'LOGS' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-night-400 hover:text-white'}`}>
                <FileText size={18} /> سجل التحويلات
            </button>
        </div>

        {/* Content Area */}
        <div className="bg-night-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 min-h-[500px]">
            
            {(activeTab === 'INSURANCE' || activeTab === 'SUBSCRIPTION') && (
                <div className="animate-fade-in space-y-4">
                    {/* List Actions & Filter Toggle */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-night-900/30 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowListFilters(!showListFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showListFilters ? 'bg-primary-600 border-primary-500 text-white' : 'bg-night-800 border-white/10 text-night-300 hover:text-white'}`}
                            >
                                <Filter size={18} /> تصفية القائمة
                                {showListFilters ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                            </button>
                            <div className="h-8 w-px bg-white/10 mx-2"></div>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="بحث سريع..." 
                                    className="bg-night-800 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-white text-sm focus:border-primary-500 outline-none w-64"
                                    value={listFilters.search}
                                    onChange={(e) => setListFilters({...listFilters, search: e.target.value})}
                                />
                                <Search size={16} className="absolute right-3 top-2.5 text-night-400"/>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleSelectForTransfer(activeTab)}
                            className={`px-6 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${activeTab === 'INSURANCE' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'}`}
                        >
                            <ArrowRightLeft size={18} />
                            تحويل {activeTab === 'INSURANCE' ? 'التأمينات' : 'الاشتراكات'} للمالية
                        </button>
                    </div>

                    {/* Advanced List Filters (Collapsible) with Dropdown */}
                    {showListFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-night-900/30 p-6 rounded-2xl border border-white/5 animate-fade-in">
                            <Dropdown 
                                label="الوحدة"
                                value={listFilters.unit}
                                onChange={(val: any) => setListFilters({...listFilters, unit: val})}
                                options={[{value: 'ALL', label: 'الكل'}, ...UNITS_LIST.map(u => ({value: u, label: u}))]}
                            />
                            <Dropdown 
                                label="الصفة"
                                value={listFilters.role}
                                onChange={(val: any) => setListFilters({...listFilters, role: val})}
                                options={[{value: 'ALL', label: 'الكل'}, ...ROLES_LIST.map(r => ({value: r, label: r}))]}
                            />
                            <Dropdown 
                                label="الطليعة"
                                value={listFilters.patrol}
                                onChange={(val: any) => setListFilters({...listFilters, patrol: val})}
                                options={[
                                    {value: 'ALL', label: 'الكل'}, 
                                    // Dynamically get patrols from current members
                                    ...Array.from(new Set(members.map(m => m.patrol))).filter(Boolean).map(p => ({value: p, label: p}))
                                ]}
                            />
                        </div>
                    )}

                    {/* Main Table */}
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-night-900/20">
                        <table className="w-full text-right">
                            <thead className="bg-night-900 text-night-300 text-xs uppercase font-bold">
                                <tr>
                                    <SortableHeader label="العضو" sortKey="fullName" />
                                    <SortableHeader label="الوحدة" sortKey="unit" />
                                    <SortableHeader label="تاريخ الميلاد" sortKey="birthDate" />
                                    <SortableHeader label="رقم التأمين" sortKey="insuranceNumber" />
                                    <SortableHeader label="حالة الدفع" sortKey="paymentStatus" />
                                    <th className="p-4 text-center">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredListMembers.map(m => (
                                    <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={m.image} className="w-9 h-9 rounded-full border border-white/10" />
                                            <div>
                                                <p className="font-bold text-white text-sm">{m.fullName}</p>
                                                <p className="text-xs text-night-400">{m.role}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-night-300">
                                            <span className="bg-white/5 px-2 py-1 rounded text-xs">{m.unit}</span>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-night-300">{m.birthDate}</td>
                                        <td className="p-4 text-sm font-mono text-night-300">{m.insuranceNumber || '-'}</td>
                                        <td className="p-4">
                                            {paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription'] ? (
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${activeTab === 'INSURANCE' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                                                    <CheckCircle2 size={12} /> مدفوع
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                                                    <AlertCircle size={12} /> غير مدفوع
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => togglePayment(m.id, activeTab === 'INSURANCE' ? 'insurance' : 'subscription')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border opacity-0 group-hover:opacity-100 ${
                                                    paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription']
                                                    ? 'border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' 
                                                    : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                                }`}
                                            >
                                                {paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription'] ? 'إلغاء' : 'تسجيل'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredListMembers.length === 0 && (
                                    <tr><td colSpan={6} className="p-8 text-center text-night-500">لا توجد نتائج مطابقة</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Counter with Total Amount */}
                    <div className="flex justify-between items-center bg-night-900 p-4 rounded-xl border border-white/5 text-sm">
                        <div className="flex items-center gap-6">
                            <span className="text-night-400">العدد في القائمة: <b className="text-white">{filteredListMembers.length}</b></span>
                            <div className="h-4 w-px bg-white/10"></div>
                            {/* NEW: Total Amount Section */}
                            <div className="flex items-center gap-2">
                                <span className="text-night-400 font-bold">
                                    {activeTab === 'INSURANCE' ? 'المبلغ الإجمالي للتأمينات:' : 'المبلغ الإجمالي للاشتراكات:'}
                                </span>
                                <span className="text-2xl font-bold text-yellow-400 font-mono tracking-wide">
                                    {/* Calculate Amount: Count of Paid * Fee */}
                                    {(filteredListMembers.filter(m => paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription']).length * (activeTab === 'INSURANCE' ? INSURANCE_FEE : SUBSCRIPTION_FEE)).toLocaleString()} 
                                    <span className="text-sm text-yellow-500/70 mr-1">دج</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                <span className="text-night-300">مدفوع: </span>
                                <b className="text-emerald-400">
                                    {filteredListMembers.filter(m => paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription']).length}
                                </b>
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                <span className="text-night-300">غير مدفوع: </span>
                                <b className="text-red-400">
                                    {filteredListMembers.filter(m => !paymentStatus[m.id]?.[activeTab === 'INSURANCE' ? 'insurance' : 'subscription']).length}
                                </b>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: LOGS */}
            {activeTab === 'LOGS' && (
                <div className="animate-fade-in space-y-6">
                    <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                        <h3 className="text-lg font-bold text-white mb-1">سجل التحويلات المالية</h3>
                        <p className="text-sm text-purple-300">سجل تاريخي يوثق جميع عمليات نقل الأموال من قسم التأمينات إلى المالية.</p>
                    </div>
                    
                    <div className="overflow-hidden rounded-xl border border-white/5">
                        <table className="w-full text-right">
                            <thead className="bg-night-900 text-night-300">
                                <tr>
                                    <th className="p-4">التاريخ</th>
                                    <th className="p-4">نوع التحويل</th>
                                    <th className="p-4">المبلغ</th>
                                    <th className="p-4">الوجهة</th>
                                    <th className="p-4 text-center">طباعة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions
                                    .filter(t => t.category === 'INSURANCE' || t.category === 'SUBSCRIPTION')
                                    .map(t => (
                                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-night-300 text-sm">{t.date}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.category === 'INSURANCE' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                {t.category === 'INSURANCE' ? 'تأمينات' : 'اشتراكات'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-white">{t.amount.toLocaleString()} دج</td>
                                        <td className="p-4 text-sm text-night-300 flex items-center gap-2">
                                            <ArrowRightLeft size={14} className="text-night-500"/>
                                            {t.description.split('->')[1] || 'غير محدد'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="text-night-400 hover:text-white transition-colors">
                                                <Printer size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.filter(t => t.category === 'INSURANCE' || t.category === 'SUBSCRIPTION').length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-night-500">لا توجد تحويلات مسجلة بعد</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>

        {/* Transfer Confirmation Modal */}
        {transferModal.isOpen && (
            <div className="fixed inset-y-0 left-0 right-20 z-50 flex items-center justify-center p-4 bg-night-900/90 backdrop-blur-sm animate-fade-in">
                <div className="bg-night-800 w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">تأكيد تحويل الأموال</h3>
                    
                    <div className="bg-night-900/50 p-4 rounded-xl border border-white/5 mb-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-night-400">نوع العملية:</span>
                            <span className="text-white font-bold">{transferModal.type === 'INSURANCE' ? 'تحويل تأمينات' : 'تحويل اشتراكات'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-night-400">عدد الأعضاء:</span>
                            <span className="text-white font-bold">{transferModal.selectedMembers.length}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <span className="text-primary-400 font-bold">المبلغ الإجمالي:</span>
                            <span className="text-2xl font-bold text-white font-mono">
                                {(transferModal.selectedMembers.length * (transferModal.type === 'INSURANCE' ? INSURANCE_FEE : SUBSCRIPTION_FEE)).toLocaleString()} دج
                            </span>
                        </div>
                    </div>

                    {transferModal.type === 'INSURANCE' && (
                        <div className="mb-6">
                            <label className="block text-sm text-night-400 mb-2">جهة التحويل الخارجية (قابلة للتعديل)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={externalDestination} 
                                    onChange={(e) => setExternalDestination(e.target.value)}
                                    className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white pl-10 focus:border-primary-500 outline-none"
                                />
                                <ArrowRightLeft className="absolute left-3 top-3.5 text-night-400" size={18} />
                            </div>
                            <p className="text-xs text-night-500 mt-2">سيتم تسجيل هذا المبلغ كمصروف نهائي في المالية.</p>
                        </div>
                    )}

                    {transferModal.type === 'SUBSCRIPTION' && (
                        <div className="mb-6 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3">
                            <Wallet className="text-emerald-500" />
                            <p className="text-xs text-emerald-300">سيتم إضافة هذا المبلغ إلى رصيد الخزينة في قسم المالية.</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button onClick={() => setTransferModal({isOpen: false, type: null, selectedMembers: []})} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">إلغاء</button>
                        <button onClick={confirmTransfer} className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg transition-all">تأكيد التحويل</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Insurance;
