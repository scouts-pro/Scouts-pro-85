
import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Event, Project } from '../types';
import { Coins, TrendingUp, TrendingDown, FileText, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, ShieldCheck, X, Save, Printer, ChevronDown, PieChart as PieChartIcon, BarChart3, Download, Calendar, Filter, ArrowRightLeft, Briefcase, Tent, Activity, ChevronUp, Target, Landmark, BellRing, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface FinanceProps {
  transactions: Transaction[];
  insuranceTotal: number;
  onAddTransaction?: (t: Transaction) => void;
  // New props for reference-based logic
  events?: Event[];
  projects?: Project[];
}

// --- Custom Dropdown ---
const Dropdown = ({ options, value, onChange, placeholder, icon: Icon, className }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className}`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer text-white focus:border-primary-500 transition-all hover:border-primary-500/50"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {Icon && <Icon size={16} className="text-primary-500 shrink-0" />}
                    <span className="truncate">{label}</span>
                </div>
                <ChevronDown size={16} className={`text-night-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-1 bg-night-800 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                        {options.map((opt: any, idx: number) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`p-3 hover:bg-white/5 cursor-pointer text-sm text-white flex items-center justify-between ${val === value ? 'bg-primary-600/10 text-primary-400' : ''}`}
                                >
                                    {lbl}
                                    {val === value && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const Finance: React.FC<FinanceProps> = ({ transactions, insuranceTotal, onAddTransaction, events = [], projects = [] }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REPORTS' | 'TRANSFERS'>('OVERVIEW');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  
  // Notification State for New Income/Transfers
  const [showIncomeNotification, setShowIncomeNotification] = useState(true);

  // Collapsible State for Transfer Form
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(true);

  // Bank Transfer Modal
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankTransferAmount, setBankTransferAmount] = useState(0);

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'OTHER' as any
  });

  // --- Reports State ---
  const [reportFilter, setReportFilter] = useState({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      type: 'ALL'
  });

  // --- Transfers State ---
  const [transferForm, setTransferForm] = useState({
      amount: 0,
      destinationType: 'ACTIVITY', // ACTIVITY, CAMP, PROJECT, DEPARTMENT
      destinationId: '',
      description: '', // Will hold the ID for activities/camps/projects
      date: new Date().toISOString().split('T')[0]
  });

  // Dynamic Data for Dropdowns based on Props
  const dynamicOptions = useMemo(() => {
      const activities = events.filter(e => e.type === 'ACTIVITY').map(e => ({ value: e.id, label: e.title }));
      const camps = events.filter(e => e.type === 'CAMP').map(e => ({ value: e.id, label: e.title }));
      const projectOpts = projects.map(p => ({ value: p.id, label: p.name }));
      
      const departments = [
          { value: 'dept_media', label: 'قسم الإعلام والاتصال' },
          { value: 'dept_training', label: 'قسم التدريب والبرامج' },
          { value: 'dept_logistics', label: 'لجنة الخدمات واللوجستيك' },
          { value: 'unit_kashaf', label: 'ميزانية وحدة الكشاف' },
      ];

      return {
          ACTIVITIES: activities,
          CAMPS: camps,
          PROJECTS: projectOpts,
          DEPARTMENTS: departments
      };
  }, [events, projects]);

  // Logic to get the correct options based on type
  const destinationOptions = useMemo(() => {
      switch (transferForm.destinationType) {
          case 'ACTIVITY': return dynamicOptions.ACTIVITIES;
          case 'CAMP': return dynamicOptions.CAMPS;
          case 'PROJECT': return dynamicOptions.PROJECTS;
          case 'DEPARTMENT': return dynamicOptions.DEPARTMENTS;
          default: return [];
      }
  }, [transferForm.destinationType, dynamicOptions]);

  // Local Transfer Log (Visual Only for this session)
  const [transferLog, setTransferLog] = useState([
      { id: 'tr1', date: '2024-10-05', amount: 5000, destination: 'مخيم الخريف (تموين)', type: 'CAMP', status: 'COMPLETED' },
      { id: 'tr2', date: '2024-10-12', amount: 12000, destination: 'مشروع نادي الروبوتيك', type: 'PROJECT', status: 'COMPLETED' },
  ]);

  const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  const data = [
    { name: 'مداخيل', value: income, color: '#10b981' },
    { name: 'مصاريف', value: expense, color: '#f43f5e' },
  ];

  // Effect to show notification when transactions change (new income)
  useEffect(() => {
      setShowIncomeNotification(true);
  }, [transactions.length]);

  const handleOpenModal = (type: 'INCOME' | 'EXPENSE') => {
      setModalType(type);
      setNewTransaction({
          amount: 0,
          description: '',
          date: new Date().toISOString().split('T')[0],
          category: type === 'INCOME' ? 'ACTIVITY' : 'EQUIPMENT'
      });
      setShowModal(true);
  };

  const handleSave = () => {
      if (!newTransaction.amount || !newTransaction.description || !onAddTransaction) return;
      
      const transaction: Transaction = {
          id: Date.now().toString(),
          type: modalType,
          category: newTransaction.category as any,
          amount: Number(newTransaction.amount),
          date: newTransaction.date || '',
          description: newTransaction.description || ''
      };

      onAddTransaction(transaction);
      setShowModal(false);
  };

  const handleTransferSubmit = () => {
      if (!transferForm.amount || !transferForm.description) return; // description holds the ID
      
      // Find the label for the description
      const selectedOption = destinationOptions.find(opt => opt.value === transferForm.description);
      const destinationName = selectedOption ? selectedOption.label : 'وجهة غير معروفة';

      const newTransfer = {
          id: `tr_${Date.now()}`,
          date: transferForm.date,
          amount: Number(transferForm.amount),
          destination: destinationName, 
          type: transferForm.destinationType,
          status: 'COMPLETED'
      };

      setTransferLog([newTransfer, ...transferLog]);
      
      // Register as an expense in the main system linked to the entity
      if (onAddTransaction) {
          onAddTransaction({
              id: `tr_exp_${Date.now()}`,
              type: 'EXPENSE',
              category: transferForm.destinationType as any, // 'ACTIVITY', 'CAMP', 'PROJECT' match Transaction categories
              amount: Number(transferForm.amount),
              date: transferForm.date,
              description: `تحويل داخلي: ${destinationName}`,
              relatedEntityId: transferForm.description // CRITICAL: This links the money to the destination
          });
      }

      setTransferForm({ ...transferForm, amount: 0, description: '' });
      alert('تم تنفيذ التحويل بنجاح وتسجيله.');
  };

  // Bank Transfer
  const handleBankTransfer = () => {
      if (!bankTransferAmount || bankTransferAmount > balance) {
          alert('يرجى التحقق من المبلغ');
          return;
      }
      
      if (onAddTransaction) {
          onAddTransaction({
              id: `tr_bank_${Date.now()}`,
              type: 'EXPENSE',
              category: 'OTHER',
              amount: bankTransferAmount,
              date: new Date().toISOString().split('T')[0],
              description: 'إيداع في الحساب البنكي (خزينة الفوج)'
          });
      }
      setShowBankModal(false);
      setBankTransferAmount(0);
      alert('تم تسجيل الإيداع البنكي بنجاح');
  };

  // --- Export Functionality ---
  const handleExport = () => {
      const headers = ['المعرف', 'التاريخ', 'النوع', 'الفئة', 'المبلغ', 'الوصف'];
      const rows = transactions.map(t => [
          t.id,
          t.date,
          t.type === 'INCOME' ? 'مداخيل' : 'مصاريف',
          t.category,
          t.amount,
          `"${t.description}"`
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
          + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "finance_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- Sub-Renderers ---

  const renderOverview = () => {
      // Logic to detect latest income for notification
      const latestTx = transactions[transactions.length - 1];
      const isLatestIncome = latestTx && latestTx.type === 'INCOME';
      
      return (
      <div className="space-y-8 animate-fade-in">
          
          {/* --- DISTINCT NOTIFICATION BANNER (Requested Feature) --- */}
          {showIncomeNotification && isLatestIncome && (
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-bounce-subtle">
                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 flex justify-between items-center">
                      <div className="flex items-start gap-4">
                          <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/50">
                              <BellRing size={28} className="animate-wiggle" />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                  تم استلام تحديث مالي جديد! <Sparkles size={16} className="text-yellow-400"/>
                              </h3>
                              <p className="text-emerald-100 text-sm opacity-90">
                                  تم تسجيل عملية إيراد / تحويل فائض مالي إلى الخزينة بنجاح.
                              </p>
                              <div className="mt-3 flex items-center gap-4">
                                  <div className="bg-black/20 px-3 py-1 rounded-lg text-xs text-emerald-200 font-mono border border-emerald-500/20">
                                      {latestTx.date}
                                  </div>
                                  <div className="text-white font-bold text-lg">
                                      {latestTx.description}
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-3">
                          <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-xl border border-white/20">
                              <span className="block text-xs text-emerald-200 uppercase font-bold tracking-wider">المبلغ المستلم</span>
                              <span className="text-3xl font-bold text-white font-mono tracking-tight">+{latestTx.amount.toLocaleString()} دج</span>
                          </div>
                          <button 
                              onClick={() => setShowIncomeNotification(false)}
                              className="text-emerald-300 hover:text-white text-xs underline transition-colors"
                          >
                              تجاهل الإشعار
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Balance Card */}
            <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl group min-h-[220px] flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-[#064e3b] to-black z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
                <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent rotate-45 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-10"></div>
                
                <div className="relative z-20 flex justify-between items-start">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <Wallet className="text-emerald-300" size={32} />
                    </div>
                    <CreditCard className="text-white/20" size={48} />
                </div>
                
                <div className="relative z-20">
                    <p className="text-emerald-200/80 mb-1 font-medium tracking-wider">الرصيد الحالي</p>
                    <h3 className="text-5xl font-bold text-white font-mono tracking-tight tabular-nums" dir="ltr">{balance.toLocaleString()} <span className="text-2xl text-emerald-400/80">DZD</span></h3>
                </div>
            </div>

            {/* Bank Treasury Card - NEW */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-night-900 border border-yellow-500/20 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-600/20 transition-all"></div>
                 <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400 border border-yellow-500/20">
                        <Landmark size={24} />
                    </div>
                    <button 
                        onClick={() => setShowBankModal(true)}
                        className="text-xs font-bold text-yellow-400 bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors flex items-center gap-1"
                    >
                        <ArrowUpRight size={14} /> إيداع
                    </button>
                 </div>
                 <div className="relative z-10">
                    <p className="text-yellow-200/80 mb-1 font-medium tracking-wider">خزينة الفوج (البنك)</p>
                    <h3 className="text-3xl font-bold text-white font-mono tracking-tight tabular-nums">-- <span className="text-lg text-yellow-400/80">DZD</span></h3>
                    <p className="text-xs text-night-400 mt-2">رصيد الحساب البنكي (يتم تحديثه يدوياً)</p>
                 </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-night-800/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-xl">
                <div className="h-40 w-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} innerRadius={45} outerRadius={65} paddingAngle={8} dataKey="value" stroke="none">
                                {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-night-500">
                        <Coins size={24} />
                    </div>
                </div>
                <div className="flex flex-col gap-4 text-sm flex-1 mr-4">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                        <div>
                            <p className="text-night-400 text-xs">مداخيل</p>
                            <p className="text-white font-bold font-mono">{income.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e]"></div>
                         <div>
                            <p className="text-night-400 text-xs">مصاريف</p>
                            <p className="text-white font-bold font-mono">{expense.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pass-through Information */}
            <div className="bg-night-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-2 bg-blue-500 h-full"></div>
                 <div className="flex justify-between items-center mb-6">
                    <div>
                         <h3 className="text-xl font-bold text-white flex items-center gap-2"><ShieldCheck className="text-blue-500"/> مدفوعات التأمينات (خارج الخزينة)</h3>
                         <p className="text-sm text-night-400">هذه المبالغ تم استلامها وتحويلها للمحافظة.</p>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        {transactions.filter(t => t.category === 'INSURANCE' && t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0).toLocaleString()} DZD
                    </p>
                 </div>
                 <div className="space-y-3">
                     {transactions.filter(t => t.category === 'INSURANCE').slice(0, 3).map(t => (
                         <div key={t.id} className="flex justify-between items-center p-3 bg-night-900/50 rounded-xl border border-white/5">
                             <span className="text-night-300 text-sm">{t.description}</span>
                             <span className="text-white font-mono">{t.amount.toLocaleString()}</span>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-night-800/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">سجل المعاملات النشطة</h3>
                    <div className="flex gap-2">
                        <button onClick={handleExport} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-night-300 hover:text-white transition-colors" title="تصدير CSV">
                            <FileText size={18} />
                        </button>
                        <button onClick={() => window.print()} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-night-300 hover:text-white transition-colors" title="طباعة">
                            <Printer size={18} />
                        </button>
                    </div>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {transactions.map(t => (
                        <div key={t.id} className="group flex justify-between items-center p-4 bg-night-900/50 border border-white/5 rounded-2xl hover:border-primary-500/30 hover:bg-night-900/80 transition-all duration-300">
                             <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-xl ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} group-hover:scale-110 transition-transform`}>
                                     {t.type === 'INCOME' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                 </div>
                                 <div>
                                     <p className="text-white font-bold mb-0.5">{t.description}</p>
                                     <p className="text-xs text-night-400 font-mono">{t.date} • <span className={`px-1.5 py-0.5 rounded ${t.category === 'SUBSCRIPTION' ? 'bg-emerald-900 text-emerald-300' : ''}`}>{t.category}</span></p>
                                 </div>
                             </div>
                             <span className={`font-mono font-bold text-lg ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                 {t.type === 'INCOME' ? '+' : '-'} {t.amount}
                             </span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
      </div>
      );
  };

  const renderReports = () => (
      <div className="animate-fade-in space-y-8">
          {/* Header & Filter Controls - Refactored Layout */}
          <div className="bg-night-800/60 p-6 rounded-3xl border border-white/10">
              <div className="flex flex-col gap-6">
                  {/* Row 1: Title */}
                  <div className="border-b border-white/5 pb-4">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <BarChart3 className="text-purple-500" />
                          التقارير المالية
                      </h3>
                      <p className="text-night-400 text-sm mt-1">توليد تقارير مفصلة عن الوضع المالي، الميزانية، والتدفقات النقدية.</p>
                  </div>
                  
                  {/* Row 2: Controls */}
                  <div className="flex flex-wrap items-end gap-4 w-full">
                      <div className="space-y-2 flex-1 min-w-[200px]">
                          <label className="text-xs font-bold text-night-400 block">من تاريخ</label>
                          <div className="relative">
                              <input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" value={reportFilter.startDate} onChange={e => setReportFilter({...reportFilter, startDate: e.target.value})} />
                          </div>
                      </div>
                      <div className="space-y-2 flex-1 min-w-[200px]">
                          <label className="text-xs font-bold text-night-400 block">إلى تاريخ</label>
                          <div className="relative">
                              <input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" value={reportFilter.endDate} onChange={e => setReportFilter({...reportFilter, endDate: e.target.value})} />
                          </div>
                      </div>
                      <div className="space-y-2 flex-1 min-w-[200px]">
                          <label className="text-xs font-bold text-night-400 block">نوع التقرير</label>
                          <Dropdown 
                              options={[
                                  {value: 'ALL', label: 'تقرير شامل'},
                                  {value: 'INCOME', label: 'تقرير المداخيل'},
                                  {value: 'EXPENSE', label: 'تقرير المصاريف'},
                                  {value: 'BUDGET', label: 'الميزانية التقديرية'}
                              ]}
                              value={reportFilter.type}
                              onChange={(val: any) => setReportFilter({...reportFilter, type: val})}
                              className="w-full"
                          />
                      </div>
                      <button className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition-all transform active:scale-95 flex items-center justify-center gap-2 h-[50px]">
                          <FileText size={18} />
                          توليد التقرير
                      </button>
                  </div>
              </div>
          </div>

          {/* Report Preview Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Report Stats */}
              <div className="lg:col-span-2 space-y-6">
                  {/* Monthly Trend Chart */}
                  <div className="bg-night-800/60 p-6 rounded-3xl border border-white/5 shadow-lg h-80">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500"/> الاتجاه المالي (شهري)</h4>
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                              {month: 'Jan', income: 12000, expense: 8000},
                              {month: 'Feb', income: 15000, expense: 10000},
                              {month: 'Mar', income: 8000, expense: 12000},
                              {month: 'Apr', income: 20000, expense: 5000},
                          ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                              <XAxis dataKey="month" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                              <Legend />
                              <Bar dataKey="income" name="مداخيل" fill="#10b981" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="expense" name="مصاريف" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>

                  {/* Detailed Table Preview */}
                  <div className="bg-night-800/60 rounded-3xl border border-white/5 overflow-hidden">
                      <div className="p-4 bg-night-900/50 border-b border-white/5 flex justify-between items-center">
                          <h4 className="text-white font-bold">تفاصيل العمليات (معاينة)</h4>
                          <span className="text-xs text-night-400">آخر 5 عمليات</span>
                      </div>
                      <table className="w-full text-right">
                          <thead className="bg-night-900 text-night-300 text-xs">
                              <tr>
                                  <th className="p-4">التاريخ</th>
                                  <th className="p-4">البيان</th>
                                  <th className="p-4">الفئة</th>
                                  <th className="p-4 text-left">المبلغ</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-sm">
                              {transactions.slice(0, 5).map(t => (
                                  <tr key={t.id} className="hover:bg-white/5">
                                      <td className="p-4 font-mono text-night-400">{t.date}</td>
                                      <td className="p-4 text-white">{t.description}</td>
                                      <td className="p-4 text-night-300">{t.category}</td>
                                      <td className={`p-4 text-left font-bold font-mono ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                                          {t.amount.toLocaleString()}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* Actions & Summary */}
              <div className="space-y-6">
                  <div className="bg-night-800/60 p-6 rounded-3xl border border-white/5">
                      <h4 className="text-white font-bold mb-4">ملخص الفترة</h4>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                              <span className="text-emerald-200 text-sm">إجمالي المداخيل</span>
                              <span className="text-emerald-400 font-bold font-mono">45,000 دج</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                              <span className="text-red-200 text-sm">إجمالي المصاريف</span>
                              <span className="text-red-400 font-bold font-mono">12,500 دج</span>
                          </div>
                          <div className="border-t border-white/10 pt-4 mt-2">
                              <div className="flex justify-between items-center">
                                  <span className="text-white font-bold">الصافي</span>
                                  <span className="text-blue-400 font-bold font-mono text-xl">32,500 دج</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-night-800/60 p-6 rounded-3xl border border-white/5">
                      <h4 className="text-white font-bold mb-4">خيارات التصدير</h4>
                      <div className="space-y-3">
                          <button className="w-full py-3 bg-night-900 border border-white/10 hover:border-primary-500 hover:text-primary-400 text-night-300 rounded-xl flex items-center justify-center gap-2 transition-all">
                              <FileText size={18}/> تصدير PDF
                          </button>
                          <button onClick={handleExport} className="w-full py-3 bg-night-900 border border-white/10 hover:border-emerald-500 hover:text-emerald-400 text-night-300 rounded-xl flex items-center justify-center gap-2 transition-all">
                              <Download size={18}/> تصدير Excel (CSV)
                          </button>
                          <button onClick={() => window.print()} className="w-full py-3 bg-night-900 border border-white/10 hover:border-white/30 hover:text-white text-night-300 rounded-xl flex items-center justify-center gap-2 transition-all">
                              <Printer size={18}/> طباعة مباشرة
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderTransfers = () => (
      <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Transfer Form - Updated to be Collapsible and Smart */}
          <div className="lg:col-span-4 space-y-6">
              <div className="bg-night-800/60 border border-white/10 rounded-3xl shadow-lg overflow-hidden transition-all duration-300">
                  {/* Collapsible Header */}
                  <div 
                    onClick={() => setIsTransferFormOpen(!isTransferFormOpen)}
                    className="p-6 flex justify-between items-center cursor-pointer bg-night-900/30 hover:bg-white/5 transition-colors"
                  >
                      <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary-600/20 text-primary-500 rounded-xl">
                              <ArrowRightLeft size={24}/>
                          </div>
                          <h3 className="text-xl font-bold text-white">تحويل مالي داخلي</h3>
                      </div>
                      {isTransferFormOpen ? <ChevronUp size={20} className="text-night-400"/> : <ChevronDown size={20} className="text-night-400"/>}
                  </div>
                  
                  {/* Collapsible Content */}
                  {isTransferFormOpen && (
                      <div className="p-8 pt-2 space-y-4 border-t border-white/5 animate-fade-in">
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-night-300">المبلغ المراد تحويله</label>
                              <div className="relative">
                                  <input 
                                      type="number" 
                                      className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-primary-500 outline-none pl-12"
                                      value={transferForm.amount}
                                      onChange={e => setTransferForm({...transferForm, amount: Number(e.target.value)})}
                                  />
                                  <span className="absolute left-4 top-3.5 text-night-500 font-bold text-sm">DZD</span>
                              </div>
                          </div>

                          <div className="space-y-2">
                              <label className="text-sm font-bold text-night-300">نوع الوجهة</label>
                              <Dropdown 
                                  options={[
                                      {value: 'ACTIVITY', label: 'نشاط'},
                                      {value: 'CAMP', label: 'مخيم'},
                                      {value: 'PROJECT', label: 'مشروع'},
                                      {value: 'DEPARTMENT', label: 'قسم / وحدة'}
                                  ]}
                                  value={transferForm.destinationType}
                                  onChange={(val: any) => {
                                      setTransferForm({...transferForm, destinationType: val, description: ''}); // Reset desc when type changes
                                  }}
                                  icon={ArrowUpRight}
                              />
                          </div>

                          <div className="space-y-2">
                              <label className="text-sm font-bold text-night-300">اسم الوجهة / التفاصيل</label>
                              {/* SMART DROPDOWN FOR DESTINATION DETAILS (Uses Real IDs) */}
                              <Dropdown 
                                  options={destinationOptions}
                                  value={transferForm.description}
                                  onChange={(val: any) => setTransferForm({...transferForm, description: val})}
                                  placeholder="اختر الوجهة..."
                                  icon={Target}
                              />
                          </div>

                          <div className="space-y-2">
                              <label className="text-sm font-bold text-night-300">تاريخ التحويل</label>
                              <input 
                                  type="date" 
                                  className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                  value={transferForm.date}
                                  onChange={e => setTransferForm({...transferForm, date: e.target.value})}
                              />
                          </div>

                          <button 
                              onClick={handleTransferSubmit}
                              className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary-900/40 mt-4 transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                              <Save size={20} /> تنفيذ التحويل
                          </button>
                      </div>
                  )}
              </div>

              {/* Info Card */}
              <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                  <div className="flex items-start gap-3">
                      <ShieldCheck className="text-blue-400 shrink-0" size={24}/>
                      <div>
                          <h4 className="text-blue-300 font-bold mb-1">تعليمات التحويل</h4>
                          <p className="text-xs text-blue-200/70 leading-relaxed">
                              يتم خصم المبلغ مباشرة من الخزينة المركزية وتسجيله كمصروف مرتبط بمرجع الوجهة. سيظهر المبلغ تلقائياً في مصادر تمويل النشاط/المخيم.
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Transfer Log */}
          <div className="lg:col-span-8">
              <div className="bg-night-800/60 rounded-3xl border border-white/10 overflow-hidden shadow-lg h-full flex flex-col">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">سجل التحويلات الداخلية</h3>
                      <button className="text-night-400 hover:text-white transition-colors"><Filter size={20}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                      <div className="space-y-4">
                          {transferLog.map(tr => (
                              <div key={tr.id} className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:border-primary-500/30 transition-colors group">
                                  <div className="flex items-center gap-4">
                                      <div className={`p-3 rounded-xl ${
                                          tr.type === 'CAMP' ? 'bg-orange-500/10 text-orange-500' : 
                                          tr.type === 'PROJECT' ? 'bg-purple-500/10 text-purple-500' :
                                          tr.type === 'ACTIVITY' ? 'bg-blue-500/10 text-blue-500' :
                                          'bg-emerald-500/10 text-emerald-500'
                                      }`}>
                                          {tr.type === 'CAMP' ? <Tent size={20}/> : 
                                           tr.type === 'PROJECT' ? <Briefcase size={20}/> :
                                           tr.type === 'ACTIVITY' ? <Activity size={20}/> :
                                           <Wallet size={20}/>}
                                      </div>
                                      <div>
                                          <h4 className="text-white font-bold">{tr.destination}</h4>
                                          <p className="text-xs text-night-400 font-mono mt-1">{tr.date} • {tr.id}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-white font-bold font-mono text-lg">{tr.amount.toLocaleString()} دج</p>
                                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">مكتمل</span>
                                  </div>
                              </div>
                          ))}
                          {transferLog.length === 0 && (
                              <div className="text-center py-12 text-night-500">
                                  <ArrowRightLeft size={48} className="mx-auto mb-4 opacity-20"/>
                                  <p>لا توجد تحويلات مسجلة بعد</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="p-8 space-y-8 animate-fade-in relative flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-white">المالية (الخزينة المركزية)</h2>
            <p className="text-night-400 mt-2">إدارة التدفقات المالية، التقارير، والتحويلات الداخلية.</p>
        </div>
        
        {/* Global Actions (Visible only on Overview) */}
        {activeTab === 'OVERVIEW' && (
            <div className="flex gap-3">
                <button onClick={() => handleOpenModal('INCOME')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-900/40 transition-all hover:scale-105">
                    <ArrowDownLeft size={20} /> إيراد خارجي
                </button>
                <button onClick={() => handleOpenModal('EXPENSE')} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center gap-2 font-bold transition-all">
                    <ArrowUpRight size={20} className="text-red-400" /> تسجيل مصروف
                </button>
            </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('OVERVIEW')} 
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'OVERVIEW' ? 'border-primary-500 text-primary-400 bg-primary-500/5' : 'border-transparent text-night-400 hover:text-white'}`}
          >
              <Wallet size={18}/> نظرة عامة
          </button>
          <button 
            onClick={() => setActiveTab('TRANSFERS')} 
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'TRANSFERS' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-night-400 hover:text-white'}`}
          >
              <ArrowRightLeft size={18}/> التحويلات
          </button>
          <button 
            onClick={() => setActiveTab('REPORTS')} 
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'REPORTS' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-night-400 hover:text-white'}`}
          >
              <FileText size={18}/> التقارير
          </button>
      </div>

      {/* Content Area */}
      <div className="flex-1">
          {activeTab === 'OVERVIEW' && renderOverview()}
          {activeTab === 'TRANSFERS' && renderTransfers()}
          {activeTab === 'REPORTS' && renderReports()}
      </div>

      {/* Transaction Modal (Global for Overview) */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/90 backdrop-blur-md p-4 animate-fade-in">
              <div className="bg-night-800 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {modalType === 'INCOME' ? <ArrowDownLeft className="text-emerald-500"/> : <ArrowUpRight className="text-red-500"/>}
                          {modalType === 'INCOME' ? 'تسجيل إيراد جديد' : 'تسجيل مصروف جديد'}
                      </h3>
                      <button onClick={() => setShowModal(false)} className="text-night-400 hover:text-white"><X size={24}/></button>
                  </div>
                  
                  <div className="space-y-4">
                      {/* REPLACED BUTTONS WITH DROPDOWN */}
                      <div className="space-y-2">
                          <label className="text-sm text-night-400">نوع العملية</label>
                          <Dropdown 
                              options={[{value: 'INCOME', label: 'إيراد (مداخيل)'}, {value: 'EXPENSE', label: 'مصروف (نفقات)'}]}
                              value={modalType}
                              onChange={setModalType}
                          />
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm text-night-400">المبلغ (دج)</label>
                          <input type="number" autoFocus className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none text-xl font-mono font-bold" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: Number(e.target.value)})} />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm text-night-400">الوصف</label>
                          <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} placeholder="مثال: تبرع، شراء عتاد..." />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm text-night-400">الفئة</label>
                          <Dropdown 
                              options={[
                                  {value: 'ACTIVITY', label: 'نشاط'},
                                  {value: 'EQUIPMENT', label: 'عتاد'},
                                  {value: 'PROJECT', label: 'مشروع'},
                                  {value: 'CAMP', label: 'مخيم'},
                                  {value: 'OTHER', label: 'أخرى'},
                              ]}
                              value={newTransaction.category}
                              onChange={(val: any) => setNewTransaction({...newTransaction, category: val})}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm text-night-400">التاريخ</label>
                          <input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} />
                      </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                      <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">إلغاء</button>
                      <button onClick={handleSave} className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2 ${modalType === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}>
                          <Save size={18}/> حفظ العملية
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Bank Transfer Modal */}
      {showBankModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/90 backdrop-blur-md p-4 animate-fade-in">
              <div className="bg-night-800 w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6">
                  <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Landmark size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white">إيداع في الحساب البنكي</h3>
                      <p className="text-night-400 text-sm mt-1">ترحيل السيولة من الصندوق إلى البنك</p>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-night-300">المبلغ المراد إيداعه</label>
                          <input 
                              type="number" 
                              autoFocus
                              className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xl font-bold text-center focus:border-yellow-500 outline-none"
                              value={bankTransferAmount}
                              onChange={e => setBankTransferAmount(Number(e.target.value))}
                          />
                      </div>
                      <div className="bg-night-900/50 p-3 rounded-lg text-xs text-night-400 text-center border border-white/5">
                          سيتم تسجيل هذا المبلغ كمصروف من الخزينة وتحديث رصيد البنك.
                      </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                      <button onClick={() => setShowBankModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">إلغاء</button>
                      <button onClick={handleBankTransfer} className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold shadow-lg transition-colors">تأكيد الإيداع</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Finance;
