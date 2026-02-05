
import React, { useState, useMemo, useEffect } from 'react';
import { Event, Member, UnitName, ActivityExpense, ActivityFundingSource, Treasury, BankAccount, EquipmentItem, EquipmentStatus, ApprovalStatus } from '../types';
import { 
    Calendar, MapPin, Users, Plus, ArrowUpRight,
    Clock, Search, X, ChevronLeft, Target, Save, DollarSign, 
    Briefcase, FileText, Shirt, Box, UserCheck, ShieldCheck, CheckCircle2, 
    History, TrendingUp, HandCoins, Info, Tag, Layers, ArrowRightLeft, 
    Trash2, Edit, Building, Receipt, Wallet, BadgeDollarSign, Camera, 
    Sparkles, Shield, UserCog, Megaphone, Wrench, ShieldAlert, Accessibility, 
    LayoutList, LayoutDashboard, Flag, Timer, ChevronDown, UserPlus, Star,
    Zap, Rocket, Heart, Award, Globe, Upload, Hash,
    Image as ImageIcon, UserX, AlertCircle, TrendingDown, Crown,
    Coins, Trash, LayoutGrid, Columns, Maximize2, Eye, Printer, Download,
    Check, AlertTriangle, BarChart3, RefreshCcw, ClipboardCheck, CornerDownLeft, UserCircle2
} from 'lucide-react';
import { UNITS_LIST } from '../constants';

const ACTIVITY_TYPES = [
    'رحلة', 'حملة تحسيسية', 'زيارة حبّية', 'مسير', 
    'رياضة', 'زيارة ميدانية', 'استكشاف', 'ورشات'
];

const WAREHOUSE_LOCATIONS = [
    { value: 'المخزن الرئيسي', label: 'المخزن الرئيسي (المقر)' },
    { value: 'مخزن الوحدات', label: 'مخزن الوحدات' },
    { value: 'خزانة القادة', label: 'خزانة القادة' },
    { value: 'مستودع خارجي', label: 'مستودع خارجي' },
];

const CustomDropdown = ({ options, value, onChange, placeholder, icon: Icon, className }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selected ? (typeof selected === 'object' ? selected.label : selected) : placeholder;

    return (
        <div className={`relative ${className} font-['Cairo'] z-50`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white flex items-center justify-between cursor-pointer hover:border-primary-500 transition-all shadow-inner"
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-primary-400" />}
                    <span className={`font-bold ${!value ? 'text-night-500' : 'text-white'}`}>{label || placeholder}</span>
                </div>
                <ChevronDown size={16} className={`text-night-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[1000]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-night-800 border border-white/10 rounded-2xl shadow-2xl z-[1001] max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                        {options.map((opt: any, idx: number) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`p-4 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between ${val === value ? 'bg-primary-600/10 text-primary-400 font-black' : ''}`}
                                >
                                    {lbl}
                                    {val === value && <CheckCircle2 size={14} />}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
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

interface ActivitiesProps {
  events: Event[];
  members: Member[];
  onUpdateActivity?: (event: Event) => void;
  onAddActivity?: (event: Event) => void;
  onDeleteActivity?: (id: string) => void;
  treasuries?: Treasury[];
  bankAccounts?: BankAccount[];
  type?: string;
  onFinancialTransfer?: any;
  globalTransactions?: any;
  onAddNotification?: any;
  onTransferSurplus?: any;
  equipmentList?: EquipmentItem[];
  onUpdateEquipment?: (items: EquipmentItem[]) => void;
}

const Activities: React.FC<ActivitiesProps> = ({ 
    events = [], 
    members = [], 
    onAddActivity, 
    onUpdateActivity, 
    onDeleteActivity, 
    onAddNotification,
    treasuries = [],
    bankAccounts = [],
    equipmentList = [],
    onUpdateEquipment
}) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'FULL_WIDTH'>('GRID');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailTab, setDetailTab] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formTab, setFormTab] = useState(0);
  
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [addParticipantModalTab, setAddParticipantModalTab] = useState<'LEADERS' | 'SCOUTS'>('SCOUTS');
  const [searchMember, setSearchMember] = useState('');

  // New states for Finance Modals
  const [showAddFundingModal, setShowAddFundingModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showTransferSurplusModal, setShowTransferSurplusModal] = useState(false);

  // New state for Equipment Modal
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState({ memberId: '', equipmentId: '', issuer: 'قائد الفوج' });

  // New state for Return Modal
  const [returnData, setReturnData] = useState({ condition: 'ممتازة', notes: '', location: 'المخزن الرئيسي', responsible: '' });
  const [returnModal, setReturnModal] = useState<{isOpen: boolean; item: EquipmentItem | null}>({
      isOpen: false,
      item: null,
  });

  const [eqSubTab, setEqSubTab] = useState<'CLOTHES' | 'EQUIPMENT'>('CLOTHES');

  const generateActivityId = () => `ACT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const initialForm: any = {
    activityId: generateActivityId(),
    title: '',
    activityType: ACTIVITY_TYPES[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    activityTime: '08:00',
    location: '',
    organizer: 'فوج الإشراق',
    fee: 0,
    leaderFee: 0,
    description: '',
    goals: '',
    slogan: '',
    status: 'قادم',
    maxParticipants: 50,
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop',
    logoImage: '',
    managerId: '',
    targetUnits: [],
    participants: [],
    leaderIds: [], 
    leaderResponsibilities: {}, 
    type: 'ACTIVITY',
    activityExpenses: [],
    additionalFunding: [],
    surplusTransfers: []
  };

  const [formData, setFormData] = useState<any>(initialForm);

  const leaders = useMemo(() => members.filter(m => m.role === 'قائد').map(m => ({value: m.fullName, label: m.fullName})), [members]);

  const handleOpenDetail = (event: Event) => {
    setSelectedEvent(event);
    setView('DETAIL');
    setDetailTab(0);
  };

  const handleAddMemberToActivity = (member: Member) => {
    if (!selectedEvent) return;
    const isLeader = member.role.includes('قائد');
    const type = isLeader ? 'leaderIds' : 'participants';
    const currentList = selectedEvent[type] || [];
    
    if (currentList.includes(member.id)) return;
    const updatedEvent = { ...selectedEvent, [type]: [...currentList, member.id] };
    setSelectedEvent(updatedEvent);
    if (onUpdateActivity) onUpdateActivity(updatedEvent);
    if (onAddNotification) {
        onAddNotification('تمت العملية بنجاح', `تم إضافة ${isLeader ? 'القائد' : 'الكشاف'} ${member.fullName} إلى النشاط بنجاح.`, 'SUCCESS');
    }
  };

  const handleRemoveMemberFromActivity = (memberId: string, isLeader: boolean) => {
    if (!selectedEvent) return;
    const type = isLeader ? 'leaderIds' : 'participants';
    const updatedList = (selectedEvent[type] || []).filter((id: string) => id !== memberId);
    const updatedEvent = { ...selectedEvent, [type]: updatedList };
    setSelectedEvent(updatedEvent);
    if (onUpdateActivity) onUpdateActivity(updatedEvent);
  };

  const handleOpenEdit = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setFormData(event);
    setIsEditing(true);
    setShowAddModal(true);
    setFormTab(0);
  };

  const handleHardDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('تأكيد نهائي وقطعي: سيتم مسح كافة البيانات والسجلات المتعلقة بهذا النشاط. هل أنت متأكد؟');
    if (confirmDelete) {
      if (onDeleteActivity) onDeleteActivity(id);
    }
  };

  const handleSaveActivity = () => {
    if (!formData.title) return;
    if (isEditing) {
      if (onUpdateActivity) onUpdateActivity(formData);
    } else {
      if (onAddActivity) {
        onAddActivity({ ...formData, id: `act_${Date.now()}`, date: formData.startDate } as any);
      }
    }
    setShowAddModal(false);
    setIsEditing(false);
    setFormData({...initialForm, activityId: generateActivityId()});
  };

  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeliverEquipment = () => {
    if (!deliveryData.memberId || !deliveryData.equipmentId || !selectedEvent || !onUpdateEquipment) return;
    const transactionId = `trans_${Date.now()}`;

    const updatedEquipment = equipmentList.map(item => {
        if (item.id === deliveryData.equipmentId) {
            return {
                ...item,
                status: 'مسلم' as EquipmentStatus,
                assignedTo: deliveryData.memberId,
                eventId: selectedEvent.id,
                issuedBy: deliveryData.issuer,
                assignmentDate: new Date().toISOString().split('T')[0],
                activeTransactionId: transactionId
            };
        }
        return item;
    });

    onUpdateEquipment(updatedEquipment);
    setShowDeliveryModal(false);
    if (onAddNotification) onAddNotification('تم التسليم', 'تم تسليم العتاد للعضو وتحديث المخزن المركزي.', 'SUCCESS');
    setDeliveryData({ memberId: '', equipmentId: '', issuer: 'قائد الفوج' });
  };

  const handleReturnItem = (item: EquipmentItem) => {
      setReturnData({ condition: 'ممتازة', notes: '', location: 'المخزن الرئيسي', responsible: '' });
      setReturnModal({
          isOpen: true,
          item: item
      });
  };

  const handleConfirmReturn = () => {
      if(!onUpdateEquipment || !returnModal.item) return;
      const updatedEquipment = equipmentList.map(eq => {
          if(eq.id === returnModal.item?.id) {
              return {
                  ...eq,
                  status: 'متاح' as EquipmentStatus,
                  assignedTo: undefined,
                  eventId: undefined,
                  activeTransactionId: undefined,
                  condition: returnData.condition as any, // Update with new condition
                  description: returnData.notes ? `${eq.description || ''} - ملاحظات الإرجاع: ${returnData.notes}` : eq.description,
                  location: returnData.location,
                  returnResponsible: returnData.responsible
              };
          }
          return eq;
      });
      onUpdateEquipment(updatedEquipment);
      setReturnModal({ isOpen: false, item: null });
      if(onAddNotification) onAddNotification('تم الإرجاع', 'تم تحديث حالة القطعة واسترجاعها للمخزن بنجاح.', 'SUCCESS');
  };

  // --- TAB 1: نظرة عامة ---
  const renderOverviewTab = () => {
      if (!selectedEvent) return null;
      const maxPart = selectedEvent.maxParticipants || 50;
      const actualScouts = selectedEvent.participants?.length || 0;
      const actualLeaders = selectedEvent.leaderIds?.length || 0;
      const actualPart = actualScouts + actualLeaders;
      const rate = Math.round((actualPart / maxPart) * 100) || 0;
      
      const leaderFee = selectedEvent.leaderFee || 0;
      const scoutFee = selectedEvent.fee || 0;
      const totalFees = (actualScouts * scoutFee) + (actualLeaders * leaderFee);

      return (
          <div className="space-y-8 animate-fade-in font-['Cairo'] text-right pb-10" dir="rtl">
              <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 h-[280px] group shadow-[0_30px_100px_rgba(0,0,0,0.7)] bg-night-900 transition-all duration-700">
                  <img src={selectedEvent.coverImage} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[5s] ease-out" alt="Cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent"></div>
                  <div className="absolute inset-0 p-8 flex flex-col md:flex-row justify-between items-end gap-6">
                      <div className="space-y-3 max-w-[70%] animate-slide-in">
                          <div className="flex items-center gap-3 mb-1">
                              <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase border animate-pulse ${
                                  selectedEvent.status === 'قادم' ? 'bg-blue-600/30 text-blue-300 border-blue-500/30' : 
                                  selectedEvent.status === 'جاري' ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/30' :
                                  'bg-night-950/60 text-night-400 border-white/10'
                              }`}>
                                  {selectedEvent.status || 'قادم'}
                              </span>
                          </div>
                          <h1 className="text-4xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">{selectedEvent.title}</h1>
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
                  <div className="bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end">
                      <MapPin size={24} className="text-emerald-400 mb-2"/>
                      <p className="text-[10px] text-night-500 font-black uppercase">الميدان</p>
                      <h4 className="text-white font-black text-lg truncate w-full text-right">{selectedEvent.location}</h4>
                  </div>
                  <div className="bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end">
                      <Calendar size={24} className="text-blue-400 mb-2"/>
                      <p className="text-[10px] text-night-500 font-black uppercase">التاريخ</p>
                      <h4 className="text-white font-black text-lg font-mono">{selectedEvent.startDate || selectedEvent.date}</h4>
                  </div>
                  <div className="bg-night-800/40 p-5 rounded-2xl border border-white/5 flex flex-col items-end">
                      <Coins size={24} className="text-amber-400 mb-2"/>
                      <p className="text-[10px] text-night-500 font-black uppercase">صافي المداخيل</p>
                      <h4 className="text-amber-400 font-black text-lg font-mono">{totalFees.toLocaleString()} دج</h4>
                  </div>
              </div>
          </div>
      );
  };

  // --- TAB 3: المالية ---
  const renderFinanceTab = () => {
      if (!selectedEvent) return null;

      const scoutFeesTotal = (selectedEvent.participants?.length || 0) * (selectedEvent.fee || 0);
      const leaderFeesTotal = (selectedEvent.leaderIds?.length || 0) * (selectedEvent.leaderFee || 0);
      const additionalFundingTotal = selectedEvent.additionalFunding?.reduce((sum, f) => sum + f.amount, 0) || 0;
      const totalIncome = scoutFeesTotal + leaderFeesTotal + additionalFundingTotal;
      const totalExpenses = selectedEvent.activityExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const surplus = totalIncome - totalExpenses;

      return (
          <div className="animate-fade-in space-y-10 font-['Cairo'] text-right pb-20" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-emerald-600/20 to-night-900 border border-emerald-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 text-emerald-500/10 group-hover:scale-110 transition-transform"><TrendingUp size={80}/></div>
                      <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest mb-2">إجمالي المداخيل</p>
                      <h3 className="text-4xl font-black text-white">{totalIncome.toLocaleString()} <small className="text-xs">دج</small></h3>
                      <div className="flex gap-4 mt-6">
                        <div className="flex flex-col"><span className="text-[9px] text-night-500 font-black">اشتراكات تلقائية</span><span className="text-sm font-bold">{(scoutFeesTotal + leaderFeesTotal).toLocaleString()}</span></div>
                        <div className="flex flex-col border-r border-white/10 pr-4"><span className="text-[9px] text-night-500 font-black">موارد إضافية</span><span className="text-sm font-bold">{additionalFundingTotal.toLocaleString()}</span></div>
                      </div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-600/20 to-night-900 border border-rose-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 text-rose-500/10 group-hover:scale-110 transition-transform"><TrendingDown size={80}/></div>
                      <p className="text-rose-500/60 text-[10px] font-black uppercase tracking-widest mb-2">إجمالي المصاريف</p>
                      <h3 className="text-4xl font-black text-white">{totalExpenses.toLocaleString()} <small className="text-xs">دج</small></h3>
                      <button onClick={() => setShowAddExpenseModal(true)} className="mt-6 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 w-fit relative z-10"><Plus size={14}/> تسجيل مصروف جديد</button>
                  </div>
                  <div className={`bg-gradient-to-br ${surplus >= 0 ? 'from-primary-600/20' : 'from-red-600/20'} to-night-900 border ${surplus >= 0 ? 'border-primary-500/20' : 'border-red-500/20'} p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group`}>
                      <p className={`${surplus >= 0 ? 'text-primary-400' : 'text-red-400'} text-[10px] font-black uppercase tracking-widest mb-2`}>صافي الفائض</p>
                      <h3 className={`text-4xl font-black ${surplus >= 0 ? 'text-white' : 'text-red-400'}`}>{surplus.toLocaleString()} <small className="text-xs">دج</small></h3>
                      <button onClick={() => setShowTransferSurplusModal(true)} disabled={surplus <= 0} className="mt-6 px-8 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 text-white rounded-xl text-xs font-black shadow-xl transition-all flex items-center gap-3 w-fit relative z-10"><ArrowRightLeft size={16}/> تحويل الفائض للمالية</button>
                  </div>
              </div>
              <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-12 lg:col-span-5 space-y-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-black text-white flex items-center gap-3"><HandCoins className="text-emerald-500" size={24}/> موارد تمويل النشاط</h4>
                        <button onClick={() => setShowAddFundingModal(true)} className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-500/20 shadow-lg"><Plus size={20}/></button>
                      </div>
                      <div className="bg-night-800/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                          <table className="w-full text-right border-collapse">
                              <thead className="bg-night-950 text-night-300 text-[9px] font-black uppercase tracking-widest border-b border-white/5">
                                  <tr><th className="p-5">المصدر</th><th className="p-5">المبلغ</th><th className="p-5">التاريخ</th></tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 text-xs font-bold">
                                  <tr className="bg-emerald-500/5"><td className="p-5 text-white">اشتراكات الكشافين (تلقائي)</td><td className="p-5 text-emerald-400">{scoutFeesTotal.toLocaleString()}</td><td className="p-5 text-night-500 font-black">مرتبط بالمشاركين</td></tr>
                                  <tr className="bg-emerald-500/5"><td className="p-5 text-white">اشتراكات القادة (تلقائي)</td><td className="p-5 text-emerald-400">{leaderFeesTotal.toLocaleString()}</td><td className="p-5 text-night-500 font-black">مرتبط بالمشاركين</td></tr>
                                  {selectedEvent.additionalFunding?.map(f => (
                                      <tr key={f.id} className="hover:bg-white/5 transition-colors"><td className="p-5 text-white">{f.label}</td><td className="p-5 text-emerald-400">{f.amount.toLocaleString()}</td><td className="p-5 text-night-400 font-mono">{f.date}</td></tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div className="col-span-12 lg:col-span-7 space-y-6">
                      <h4 className="text-xl font-black text-white flex items-center gap-3"><Receipt className="text-rose-500" size={24}/> مصاريف النشاط</h4>
                      <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
                          <div className="overflow-x-auto">
                              <table className="w-full text-right border-collapse text-xs font-bold">
                                  <thead className="bg-night-950 text-night-300 text-[9px] font-black uppercase tracking-widest border-b border-white/5">
                                      <tr><th className="p-5">نوع المصروف</th><th className="p-5">المبلغ</th><th className="p-5">التاريخ</th><th className="p-5">الغرض</th><th className="p-5">المصدر</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/5">
                                      {selectedEvent.activityExpenses?.map(e => (
                                          <tr key={e.id} className="hover:bg-white/5 transition-colors">
                                              <td className="p-5"><span className="bg-rose-900/30 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg font-black">{e.type}</span></td>
                                              <td className="p-5 text-white text-lg font-black">{e.amount.toLocaleString()}</td>
                                              <td className="p-5 text-night-400 font-mono">{e.date}</td>
                                              <td className="p-5 text-night-300">{e.purpose}</td>
                                              <td className="p-5"><span className="text-night-500 text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10">{e.source}</span></td>
                                          </tr>
                                      ))}
                                      {(!selectedEvent.activityExpenses || selectedEvent.activityExpenses.length === 0) && (
                                          <tr><td colSpan={5} className="p-16 text-center text-night-600 font-bold italic opacity-40">لا توجد مصاريف مسجلة لهذا النشاط.</td></tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  // --- TAB 4: العتاد واللباس ---
  const renderEquipmentTab = () => {
      if (!selectedEvent) return null;
      
      const isClothes = eqSubTab === 'CLOTHES';
      const assignedItems = equipmentList.filter(item => item.eventId === selectedEvent.id && item.category === (isClothes ? 'لباس' : 'عتاد'));
      const activityMembers = members.filter(m => [...(selectedEvent.participants || []), ...(selectedEvent.leaderIds || [])].includes(m.id));

      return (
          <div className="space-y-10 animate-fade-in font-['Cairo'] text-right pb-20" dir="rtl">
              <div className="flex justify-between items-center bg-night-800/60 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-6">
                      <div className="p-5 bg-primary-600/20 text-primary-400 rounded-3xl shadow-inner">
                          {isClothes ? <Shirt size={36}/> : <Box size={36}/>}
                      </div>
                      <div>
                          <h3 className="text-3xl font-black text-white leading-none">
                              {isClothes ? 'تتبع اللباس الكشفي' : 'تتبع العتاد والتجهيزات'}
                          </h3>
                          <p className="text-night-400 font-bold mt-2">إدارة تسليم واستلام العهدة الشخصية الخاصة بالنشاط.</p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="flex bg-night-900 p-1.5 rounded-2xl border border-white/5">
                          <button onClick={() => setEqSubTab('CLOTHES')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isClothes ? 'bg-primary-600 text-white shadow-lg' : 'text-night-400 hover:text-white'}`}>اللباس</button>
                          <button onClick={() => setEqSubTab('EQUIPMENT')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${!isClothes ? 'bg-primary-600 text-white shadow-lg' : 'text-night-400 hover:text-white'}`}>العتاد</button>
                      </div>
                      <button onClick={() => setShowDeliveryModal(true)} className="px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[2rem] font-black flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" /> تسليم عنصر جديد
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-night-800 border border-white/5 p-6 rounded-3xl text-center shadow-lg"><p className="text-night-400 text-[10px] font-black uppercase mb-1">إجمالي القطع المسلمة</p><h4 className="text-3xl font-black text-white">{assignedItems.length}</h4></div>
                  <div className="bg-night-800 border border-white/5 p-6 rounded-3xl text-center shadow-lg"><p className="text-rose-400 text-[10px] font-black uppercase mb-1">عناصر تالفة/مفقودة</p><h4 className="text-3xl font-black text-rose-500">{assignedItems.filter(i => ['تالف', 'مفقود'].includes(i.status)).length}</h4></div>
                  <div className="bg-night-800 border border-white/5 p-6 rounded-3xl text-center shadow-lg"><p className="text-emerald-400 text-[10px] font-black uppercase mb-1">نسبة الاسترجاع</p><h4 className="text-3xl font-black text-emerald-400">0%</h4></div>
              </div>

              <div className="bg-night-800/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                  <div className="overflow-x-auto">
                      <table className="w-full text-right border-collapse font-bold">
                          <thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                              <tr><th className="p-8">العضو / الوحدة</th><th className="p-8">اللباس / العتاد المستلم</th><th className="p-8">المسؤول</th><th className="p-8">الحالة</th><th className="p-8 text-center">إجراءات</th></tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-sm">
                              {activityMembers.map(member => {
                                  const memberItems = assignedItems.filter(i => i.assignedTo === member.id);
                                  return (
                                      <tr key={member.id} className="hover:bg-white/5 transition-all">
                                          <td className="p-6">
                                              <div className="flex items-center gap-4">
                                                  <img src={member.image} className="w-12 h-12 rounded-2xl border border-night-700 shadow-md" />
                                                  <div><p className="font-black text-white">{member.fullName}</p><p className="text-[10px] text-night-500">{member.unit}</p></div>
                                              </div>
                                          </td>
                                          <td className="p-6">
                                              {memberItems.length > 0 ? (
                                                  <div className="space-y-2">
                                                      {memberItems.map(item => (
                                                          <div key={item.id} className="flex items-center justify-between gap-2 bg-white/5 p-2 rounded-xl border border-white/5 shadow-sm">
                                                              <div className="flex items-center gap-2">
                                                                  <div className={`p-1.5 rounded-lg ${item.category === 'لباس' ? 'bg-purple-600/20 text-purple-400' : 'bg-orange-600/20 text-orange-400'}`}>
                                                                      {item.category === 'لباس' ? <Shirt size={14}/> : <Box size={14}/>}
                                                                  </div>
                                                                  <span className="text-white text-xs">{item.name} <span className="text-[10px] text-night-500">({item.uniqueId})</span></span>
                                                              </div>
                                                              {item.status === 'مسلم' && (
                                                                  <button 
                                                                    onClick={() => handleReturnItem(item)}
                                                                    className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-all"
                                                                    title="استرجاع للمخزن"
                                                                  >
                                                                      <RefreshCcw size={12}/>
                                                                  </button>
                                                              )}
                                                          </div>
                                                      ))}
                                                  </div>
                                              ) : (
                                                  <span className="text-night-600 text-xs italic opacity-40">لم يستلم أي عنصر</span>
                                              )}
                                          </td>
                                          <td className="p-6 text-night-300">{memberItems[0]?.issuedBy || '---'}</td>
                                          <td className="p-6">
                                              {memberItems.length > 0 ? (
                                                  <div className="space-y-2">
                                                      {memberItems.map(item => (
                                                          <span key={item.id} className={`block px-3 py-1 rounded-lg text-[10px] font-black text-center border ${
                                                              item.status === 'مسلم' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' :
                                                              item.status === 'تالف' ? 'bg-rose-600/10 text-rose-400 border-rose-500/20' :
                                                              item.status === 'مفقود' ? 'bg-red-600/10 text-red-400 border-red-500/20' :
                                                              'bg-night-900 text-night-500'
                                                          }`}>{item.status === 'مسلم' ? 'مستلم' : item.status}</span>
                                                      ))}
                                                  </div>
                                              ) : '---'}
                                          </td>
                                          <td className="p-6 text-center">
                                              {memberItems.length > 0 && (
                                                  <button onClick={() => {/* تفاصيل المعاملة */}} className="p-3 bg-white/5 hover:bg-primary-600 rounded-2xl text-white transition-all shadow-lg"><Eye size={18}/></button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* Delivery Modal */}
              <Modal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} title="تسليم عنصر من المخزن المركزي" maxWidth="max-w-md">
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-xs font-black text-night-400">اختيار العضو</label>
                          <CustomDropdown 
                              options={activityMembers.map(m => ({ value: m.id, label: `${m.fullName} (${m.unit})` }))}
                              value={deliveryData.memberId}
                              onChange={(v: string) => setDeliveryData({...deliveryData, memberId: v})}
                              placeholder="اختر العضو المسجل بالنشاط..."
                              icon={Users}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-black text-night-400">العتاد المتاح (المرشح من المخزن)</label>
                          <CustomDropdown 
                              options={equipmentList.filter(i => i.status === 'متاح' && i.category === (eqSubTab === 'CLOTHES' ? 'لباس' : 'عتاد')).map(i => ({ value: i.id, label: `${i.name} [${i.uniqueId}]` }))}
                              value={deliveryData.equipmentId}
                              onChange={(v: string) => setDeliveryData({...deliveryData, equipmentId: v})}
                              placeholder="اختر قطعة عتاد متاحة..."
                              icon={Box}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-black text-night-400">المسؤول عن التسليم</label>
                          <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={deliveryData.issuer} onChange={e => setDeliveryData({...deliveryData, issuer: e.target.value})} />
                      </div>
                      <div className="p-4 bg-primary-600/10 border border-primary-500/20 rounded-2xl flex items-center gap-3">
                          <Info size={20} className="text-primary-400" />
                          <p className="text-[11px] text-primary-300 leading-relaxed font-bold">سيتم تحديث حالة القطعة في قسم العتاد الرئيسي فوراً كـ "مسلمة" باسم هذا العضو.</p>
                      </div>
                      <button onClick={handleDeliverEquipment} className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all transform hover:scale-105">تأكيد عملية التسليم</button>
                  </div>
              </Modal>

              {/* Return Modal (COMPACT SQUARE DESIGN) */}
              <Modal 
                  isOpen={returnModal.isOpen} 
                  onClose={() => setReturnModal({ ...returnModal, isOpen: false })} 
                  title="" 
                  maxWidth="max-w-md" 
                  className="rounded-[2.5rem]"
              >
                  <div className="space-y-4">
                      {/* Compact Header */}
                      <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
                              <RefreshCcw size={20} className="text-emerald-500" />
                          </div>
                          <div>
                              <h3 className="text-lg font-black text-white leading-none mb-1">
                                  {eqSubTab === 'CLOTHES' ? 'إرجاع اللباس' : 'إرجاع العتاد'}
                              </h3>
                              <p className="text-night-400 text-[10px] font-bold">توثيق الاستلام</p>
                          </div>
                      </div>

                      {/* Compact Item Info */}
                      <div className="bg-night-900/50 p-3 rounded-2xl border border-white/5 flex items-center justify-between shadow-inner">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-night-800 rounded-xl flex items-center justify-center border border-white/5">
                                  {returnModal.item?.category === 'لباس' ? <Shirt size={18} className="text-purple-400"/> : <Box size={18} className="text-orange-400"/>}
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-sm leading-tight">{returnModal.item?.name}</h4>
                                  <p className="text-night-500 font-mono text-[9px] tracking-widest">{returnModal.item?.uniqueId}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="text-[8px] text-night-500 block">المستلم</span>
                              <span className="text-white text-[10px] font-bold">{members.find(m => m.id === returnModal.item?.assignedTo)?.fullName || '---'}</span>
                          </div>
                      </div>

                      {/* Compact Condition Grid */}
                      <div>
                          <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1 justify-end mb-2"><ClipboardCheck size={12}/> حالة الإرجاع</label>
                          <div className="grid grid-cols-4 gap-2">
                              {['ممتازة', 'جيدة', 'صيانة', 'تالفة'].map(cond => (
                                  <button 
                                      key={cond}
                                      onClick={() => setReturnData({...returnData, condition: cond})}
                                      className={`py-2 rounded-lg text-[9px] font-black border transition-all ${
                                          returnData.condition === cond 
                                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-105' 
                                          : 'bg-night-900 text-night-400 border-white/10 hover:bg-white/5'
                                      }`}
                                  >
                                      {cond}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Inputs in Compact Grid */}
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-[9px] font-black text-white uppercase mb-1 block text-right">المخزن</label>
                              <div className="relative">
                                  <select 
                                      className="w-full bg-night-900 border border-white/10 rounded-xl py-2 px-3 text-white text-[10px] font-bold outline-none appearance-none"
                                      value={returnData.location}
                                      onChange={(e) => setReturnData({...returnData, location: e.target.value})}
                                  >
                                      {WAREHOUSE_LOCATIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                  </select>
                                  <CornerDownLeft size={12} className="absolute left-2 top-2.5 text-night-500 pointer-events-none"/>
                              </div>
                          </div>
                          <div>
                              <label className="text-[9px] font-black text-white uppercase mb-1 block text-right">المسؤول</label>
                              <div className="relative">
                                  <select 
                                      className="w-full bg-night-900 border border-white/10 rounded-xl py-2 px-3 text-white text-[10px] font-bold outline-none appearance-none"
                                      value={returnData.responsible}
                                      onChange={(e) => setReturnData({...returnData, responsible: e.target.value})}
                                  >
                                      <option value="">اختر...</option>
                                      {leaders.map((opt:any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                  </select>
                                  <UserCheck size={12} className="absolute left-2 top-2.5 text-night-500 pointer-events-none"/>
                              </div>
                          </div>
                      </div>

                      <div>
                          <textarea 
                              className="w-full h-16 bg-night-900 border border-white/10 rounded-xl p-3 text-white text-[10px] outline-none focus:border-emerald-500 resize-none font-bold" 
                              placeholder="ملاحظات..."
                              value={returnData.notes}
                              onChange={e => setReturnData({...returnData, notes: e.target.value})}
                          />
                      </div>

                      <div className="p-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                          <Info size={14} className="text-emerald-400" />
                          <p className="text-[9px] text-emerald-300 leading-tight font-bold">سيتم تحديث الحالة فوراً.</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                          <button onClick={() => setReturnModal({ ...returnModal, isOpen: false })} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] transition-all">إلغاء</button>
                          <button onClick={handleConfirmReturn} className="flex-[2] py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-black text-[10px] shadow-lg transition-all flex items-center justify-center gap-2">
                              <CheckCircle2 size={14}/> تأكيد
                          </button>
                      </div>
                  </div>
              </Modal>
          </div>
      );
  };

  const renderParticipantsTab = () => {
      if (!selectedEvent) return null;
      const scoutIds = selectedEvent.participants || [];
      const leaderIds = selectedEvent.leaderIds || [];
      const scouts = members.filter(m => scoutIds.includes(m.id));
      const leaders = members.filter(m => leaderIds.includes(m.id));
      const maxPart = selectedEvent.maxParticipants || 50;
      const fillRate = Math.round(((scouts.length + leaders.length) / maxPart) * 100) || 0;
      
      const leaderFeeTotal = leaders.length * (selectedEvent.leaderFee || 0);
      const scoutFeeTotal = scouts.length * (selectedEvent.fee || 0);

      const scoutCandidates = members
          .filter(m => !m.role.includes('قائد'))
          .filter(m => !scoutIds.includes(m.id))
          .filter(m => selectedEvent.targetUnits.length === 0 || selectedEvent.targetUnits.includes(m.unit as any))
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
                  <div className="bg-night-800/60 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-xl group">
                    <div className="p-4 rounded-2xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all"><TrendingUp size={32} /></div>
                    <div><p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">نسبة التعبئة</p><p className="text-white font-black text-3xl leading-none">{fillRate}%</p></div>
                  </div>
                  <div className="bg-night-800/60 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-xl group">
                    <div className="p-4 rounded-2xl bg-amber-600/20 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all"><DollarSign size={32} /></div>
                    <div><p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي الاشتراكات</p><p className="text-white font-black text-2xl leading-none">{(leaderFeeTotal + scoutFeeTotal).toLocaleString()} <span className="text-xs">دج</span></p></div>
                  </div>
                  <button onClick={() => { setAddParticipantModalTab('LEADERS'); setIsAddParticipantOpen(true); }} className="bg-primary-600 hover:bg-primary-500 text-white rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-105 active:scale-95 group font-black py-6 ring-4 ring-primary-600/20">
                    <UserPlus size={32} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-lg">تسجيل قائد</span>
                  </button>
              </div>

              <div className="bg-night-800/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
                  <div className="p-8 bg-night-900/40 border-b border-white/5 flex justify-between items-center"><h3 className="text-2xl font-black text-white flex items-center gap-4"><Crown className="text-yellow-500" size={28}/> هيئة القيادة والتأطير</h3><span className="bg-white/5 px-4 py-1 rounded-xl text-xs text-night-400 border border-white/10 font-bold">{leaders.length} قائد</span></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm font-bold">
                        <thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                            <tr><th className="p-6">الإسم الكامل</th><th className="p-6">رقم العضوية</th><th className="p-6">الوحدة</th><th className="p-6">تاريخ الميلاد</th><th className="p-6 text-center">اجراءات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold">
                            {leaders.map(m => (
                                <tr key={m.id} className="hover:bg-white/5 transition-all group/row">
                                    <td className="p-5 flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-900 shadow-md" /><p className="font-black text-white">{m.fullName}</p></td>
                                    <td className="p-5 text-night-400 font-mono tracking-widest">{m.membershipNumber}</td>
                                    <td className="p-5 text-night-300">{m.unit}</td>
                                    <td className="p-5 text-night-400 font-mono">{m.birthDate}</td>
                                    <td className="p-5 text-center"><button onClick={() => handleRemoveMemberFromActivity(m.id, true)} className="p-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all shadow-xl"><UserX size={20}/></button></td>
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
                                        <td className="p-5 text-center"><button onClick={() => handleRemoveMemberFromActivity(m.id, false)} className="p-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all shadow-xl"><UserX size={20}/></button></td>
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
                                     <button onClick={() => handleAddMemberToActivity(m)} className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"><Plus size={18}/></button>
                                 </div>
                             )) : scoutCandidates.map(m => (
                                <div key={m.id} className="bg-night-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group/cand hover:border-emerald-500/40 transition-all shadow-md">
                                     <div className="flex items-center gap-4"><img src={m.image} className="w-12 h-12 rounded-xl border border-white/10 shadow-lg" /><div className="text-right"><p className="font-bold text-white text-sm">{m.fullName}</p><p className="text-[10px] text-night-500">{m.unit}</p></div></div>
                                     <button onClick={() => handleAddMemberToActivity(m)} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"><Plus size={18}/></button>
                                </div>
                             ))}
                        </div>
                   </div>
              </Modal>
          </div>
      );
  };

  const renderGlobalModal = () => (
    <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={isEditing ? "تعديل النشاط" : "إضافة نشاط جديد"} footer={
            <div className="flex gap-4"><button onClick={() => setShowAddModal(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button><button onClick={handleSaveActivity} className="px-12 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-2xl transition-all flex items-center gap-2 transform hover:scale-105"><Save size={20}/> {isEditing ? 'حفظ التعديلات' : 'تأكيد وإنشاء'}</button></div>
        }>
        <div className="flex bg-night-900/50 border-b border-white/5 p-1 mb-8 overflow-x-auto no-scrollbar">
            {['التخطيط الأساسي', 'الوسائط والهوية', 'الإدارة والقيادة', 'الميزانية والرسوم', 'المحتوى التربوي'].map((t, idx) => (
                <button key={idx} onClick={() => setFormTab(idx)} className={`px-6 py-4 text-xs font-black transition-all rounded-xl whitespace-nowrap ${formTab === idx ? 'bg-primary-600 text-white shadow-lg' : 'text-night-500 hover:text-white'}`}>{t}</button>
            ))}
        </div>
        <div className="space-y-6 animate-fade-in">
            {formTab === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="space-y-2"><label className="text-xs font-black text-night-400">اسم النشاط</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-night-400">رقم النشاط (تلقائي)</label>
                      <div className="w-full bg-night-950 border border-white/5 rounded-2xl p-4 text-primary-400 font-mono font-black shadow-inner">{formData.activityId}</div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">نوع النشاط</label>
                        <CustomDropdown 
                            options={ACTIVITY_TYPES}
                            value={formData.activityType}
                            onChange={(v: string) => setFormData({...formData, activityType: v})}
                            placeholder="اختر النوع..."
                            icon={Tag}
                        />
                    </div>
                    <div className="space-y-2"><label className="text-xs font-black text-night-400">المكان</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-xs font-black text-night-400">تاريخ البدء</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-xs font-black text-night-400">توقيت النشاط</label><input type="time" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={formData.activityTime} onChange={e => setFormData({...formData, activityTime: e.target.value})} /></div>
                </div>
            )}
            {formTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-night-400 flex items-center gap-2"><ImageIcon size={14}/> غلاف النشاط (Cover)</label>
                      <div className="relative group border-2 border-dashed border-white/10 rounded-3xl overflow-hidden h-48 bg-night-950 flex flex-col items-center justify-center">
                        {formData.coverImage ? (
                          <>
                            <img src={formData.coverImage} className="w-full h-full object-cover opacity-60" />
                            <button onClick={() => setFormData({...formData, coverImage: ''})} className="absolute top-4 right-4 p-2 bg-rose-600 text-white rounded-full"><X size={16}/></button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="mx-auto mb-2 text-night-600" size={32}/>
                            <p className="text-[10px] text-night-500 font-bold">اضغط لرفع الغلاف</p>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'coverImage')} />
                          </div>
                        )}
                      </div>
                    </div>
                </div>
            )}
            {formTab === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">مسؤول النشاط (المدير العام)</label>
                        <CustomDropdown 
                            options={members.filter(m => m.role.includes('قائد')).map(m => ({ value: m.id, label: m.fullName }))}
                            value={formData.managerId}
                            onChange={(v: string) => setFormData({...formData, managerId: v})}
                            placeholder="اختر المسؤول..."
                            icon={UserCog}
                        />
                    </div>
                </div>
            )}
            {formTab === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-night-400 flex items-center gap-2"><TrendingDown size={14} className="text-rose-400"/> رسوم اشتراك الكشاف</label>
                      <input type="number" className="w-full bg-night-900 border border-rose-500/20 rounded-2xl p-4 text-rose-400 font-mono font-black" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-night-400 flex items-center gap-2"><TrendingDown size={14} className="text-amber-400"/> رسوم اشتراك القائد</label>
                      <input type="number" className="w-full bg-night-900 border border-amber-500/20 rounded-2xl p-4 text-amber-400 font-mono font-black" value={formData.leaderFee} onChange={e => setFormData({...formData, leaderFee: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2"><label className="text-xs font-black text-night-400">الحد الأقصى للمشاركين (كشافين)</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: Number(e.target.value)})} /></div>
                </div>
            )}
            {formTab === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">الوحدات المستهدفة</label><div className="flex flex-wrap gap-2 pt-2">{UNITS_LIST.map(u => (<button key={u} onClick={() => { const current = formData.targetUnits || []; setFormData({...formData, targetUnits: current.includes(u as any) ? current.filter((x:any) => x !== u) : [...current, u as any]}); }} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formData.targetUnits?.includes(u as any) ? 'bg-primary-600 border-primary-500 text-white shadow-lg' : 'bg-night-900 border-white/5 text-night-500'}`}>{u}</button>))}</div></div>
                    <div className="space-y-2"><label className="text-xs font-black text-night-400">وصف البرنامج (تفصيلي)</label><textarea className="w-full h-32 bg-night-900 border border-white/10 rounded-2xl p-4 text-white resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-xs font-black text-night-400">الهدف التربوي والمسطر</label><textarea className="w-full h-32 bg-night-900 border border-white/10 rounded-2xl p-4 text-white resize-none" value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} /></div>
                </div>
            )}
        </div>
    </Modal>
  );

  if (view === 'LIST') {
      return (
          <div className="p-8 animate-fade-in flex flex-col h-full font-['Cairo'] text-right" dir="rtl">
              {renderGlobalModal()}
              <div className="flex justify-between items-center mb-16">
                  <div>
                      <h2 className="text-4xl font-black text-white mb-3 tracking-tighter leading-none">إدارة الأنشطة والبرامج</h2>
                      <p className="text-night-400 text-xl font-bold opacity-80 uppercase tracking-widest">تخطيط وتنفيذ الفعاليات التربوية والميدانية الذكي.</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="flex bg-night-800/60 p-1.5 rounded-2xl border border-white/5 mr-4 shadow-inner">
                          <button onClick={() => setDisplayMode('GRID')} className={`p-3 rounded-xl transition-all ${displayMode === 'GRID' ? 'bg-primary-600 text-white shadow-lg' : 'text-night-500 hover:text-white'}`} title="عرض شبكة"><LayoutGrid size={20}/></button>
                          <button onClick={() => setDisplayMode('FULL_WIDTH')} className={`p-3 rounded-xl transition-all ${displayMode === 'FULL_WIDTH' ? 'bg-primary-600 text-white shadow-lg' : 'text-night-500 hover:text-white'}`} title="عرض كامل العرض"><LayoutList size={20}/></button>
                      </div>
                      <button onClick={() => { setIsEditing(false); setFormData(initialForm); setShowAddModal(true); setFormTab(0); }} className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-6 rounded-[2.5rem] flex items-center gap-5 font-black shadow-[0_30px_60px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 group relative overflow-hidden ring-4 ring-primary-600/10"><Plus size={36} className="group-hover:rotate-90 transition-transform duration-500" /> <span className="text-lg font-black whitespace-nowrap">إضافة نشاط جديد</span></button>
                  </div>
              </div>
              <div className={`${displayMode === 'FULL_WIDTH' ? 'flex flex-col gap-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
                  {events.filter(e => e.type === 'ACTIVITY').map(event => {
                      const daysLeft = getDaysRemaining(event.startDate || event.date);
                      return (
                        <div key={event.id} onClick={() => handleOpenDetail(event)} className="bg-night-800 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary-500/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-500 cursor-pointer group flex flex-col relative shadow-xl">
                            <div className="h-48 overflow-hidden relative">
                                <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt={event.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent"></div>
                                <div className="absolute top-4 left-4 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black text-white border border-white/10 bg-black/40 shadow-xl flex items-center gap-1"><Hash size={8} className="text-primary-400"/> {event.activityId || '---'}</div>
                                {daysLeft > 0 && (
                                    <div className="absolute top-4 right-4 bg-emerald-600/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black text-white border border-emerald-500/30 shadow-xl flex items-center gap-1.5"><Timer size={10}/> {daysLeft} يوم متبقي</div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-black text-white group-hover:text-primary-400 transition-colors mb-4 line-clamp-1 tracking-tighter">{event.title}</h3>
                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-2"><Users size={16} className="text-primary-500" /><span className="font-black text-white text-lg">{(event.participants?.length || 0) + (event.leaderIds?.length || 0)}</span></div>
                                    <div className="flex gap-1.5">
                                        <button onClick={(e) => handleOpenEdit(e, event)} className="p-2.5 bg-white/5 hover:bg-primary-600 rounded-xl text-night-400 hover:text-white transition-all shadow-lg border border-white/5"><Edit size={16}/></button>
                                        <button onClick={(e) => handleHardDelete(e, event.id)} className="p-2.5 bg-rose-600/10 hover:bg-rose-600 rounded-xl text-rose-500 hover:text-white transition-all shadow-lg border border-rose-500/20 group/del"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                      );
                  })}
              </div>
          </div>
      );
  }

  if (view === 'DETAIL' && selectedEvent) {
      return (
          <div className="p-8 h-full flex flex-col animate-fade-in relative font-['Cairo'] text-right" dir="rtl">
              <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6">
                      <button onClick={() => setView('LIST')} className="p-4 bg-night-800 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all shadow-lg group ring-4 ring-primary-600/5">
                          <ChevronLeft size={28} className="group-hover:text-primary-400 rtl:rotate-180" />
                      </button>
                      <div>
                          <span className="text-[10px] text-primary-400 font-black uppercase tracking-[0.3em] mb-1 block">تفاصيل البرنامج التربوي</span>
                          <h2 className="text-4xl font-black text-white tracking-tight">{selectedEvent.title}</h2>
                      </div>
                  </div>
              </div>
              <div className="flex bg-night-800/30 p-1 rounded-2xl border border-white/5 mb-10 self-start shadow-inner overflow-x-auto no-scrollbar">
                  {[
                    { label: 'نظرة عامة', icon: LayoutDashboard }, 
                    { label: 'المشاركون', icon: Users }, 
                    { label: 'المالية', icon: TrendingUp }, 
                    { label: 'العتاد واللباس', icon: Box },
                    { label: 'تقرير النشاط', icon: FileText },
                    { label: 'التقييم', icon: Star },
                    { label: 'الإحصائيات', icon: BarChart3 }
                  ].map((tab, idx) => (
                      <button key={idx} onClick={() => setDetailTab(idx)} className={`px-10 py-4 font-black text-xs rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${detailTab === idx ? 'bg-primary-600 text-white shadow-xl' : 'text-night-400 hover:text-white hover:bg-white/5'}`}>
                          <tab.icon size={16}/> {tab.label}
                      </button>
                  ))}
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {detailTab === 0 && renderOverviewTab()}
                {detailTab === 1 && renderParticipantsTab()}
                {detailTab === 2 && renderFinanceTab()}
                {detailTab === 3 && renderEquipmentTab()}
                {detailTab === 4 && (
                    <div className="animate-fade-in bg-night-800/40 p-12 rounded-[3rem] border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center">
                        <FileText size={64} className="text-primary-400/20 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2">تقرير النشاط</h3>
                        <p className="text-night-400 font-bold max-w-md">هذا القسم مخصص لإدراج التقارير الأدبية والتربوية المفصلة للنشاط بعد انتهائه.</p>
                    </div>
                )}
                {detailTab === 5 && (
                    <div className="animate-fade-in bg-night-800/40 p-12 rounded-[3rem] border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center">
                        <Star size={64} className="text-yellow-400/20 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2">التقييم</h3>
                        <p className="text-night-400 font-bold max-w-md">تحليل نقاط القوة والضعف وقياس مدى تحقيق الأهداف التربوية المسطرة.</p>
                    </div>
                )}
                {detailTab === 6 && (
                    <div className="animate-fade-in bg-night-800/40 p-12 rounded-[3rem] border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center">
                        <BarChart3 size={64} className="text-emerald-400/20 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2">الإحصائيات</h3>
                        <p className="text-night-400 font-bold max-w-md">تحليل بياني لحضور الوحدات، استهلاك الميزانية، وتوزع المشاركين.</p>
                    </div>
                )}
              </div>
          </div>
      );
  }

  return null;
};

export default Activities;
