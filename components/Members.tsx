import React, { useState, useMemo, useEffect } from 'react';
import { Member, MemberRole, UnitName, EquipmentItem, MemberActivity } from '../types';
import { 
    UNITS_LIST, ROLES_LIST, ALGERIA_WILAYAS, HEALTH_STATUS_OPTIONS, FINANCIAL_STATUS, 
    FAMILY_STATUS_OPTIONS, BIRTH_ORDER_LABELS, SCOUT_MISSIONS_SCOUT, SCOUT_MISSIONS_LEADER,
    RANKS_SMALL_UNITS, RANKS_LARGE_UNITS, EDUCATIONAL_LEVELS, RELATIONSHIPS, BLOOD_TYPES,
    SCOUT_YEARS, YES_NO
} from '../constants';
import { 
    Plus, Search, Eye, Edit, Trash2, X, Save, User, Users, GraduationCap, Tent, Activity, UserPlus, 
    ChevronDown, MapPin, Phone, Calendar, Heart, Shield, Award, Star, Filter, LayoutGrid, List, 
    Download, CheckCircle2, AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight, Settings2, MoreHorizontal,
    Camera, Briefcase, DollarSign, BookOpen, PenTool, ShieldCheck, Coins, Info, ArrowRight, Medal, ArrowUp, ArrowDown,
    Receipt, Shirt, Wallet, Box, Globe, Gavel, FileText, Smartphone, Mail, Flag, Clock, Building, Layers, AlertTriangle, Home,
    Barcode, Scan, Upload, Venus, Mars, Percent, Crown, BriefcaseIcon, GraduationCapIcon, HeartPulse, UserCircle2, QrCode,
    CreditCard, Globe2, Book, History, Link, BadgeDollarSign, Hash, Trophy, Fingerprint, Map, LayoutDashboard, Printer, Lock
} from 'lucide-react';

// --- Helper Functions ---
const getAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// --- Modern Square Barcode Component (Updated to Modern/Tech Style) ---
const ModernSquareBarcode = ({ code, size = "md" }: { code: string, size?: "sm" | "md" }) => (
    <div className={`${size === 'sm' ? 'w-16 h-16 p-2' : 'w-20 h-20 p-2.5'} bg-white rounded-2xl border-2 border-night-950 shadow-2xl flex flex-col items-center justify-center group hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500 to-transparent"></div>
        <div className="grid grid-cols-5 gap-0.5 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity z-10">
            {[...Array(25)].map((_, i) => (
                <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? 'bg-night-950' : 'bg-transparent'}`} />
            ))}
        </div>
        <div className="absolute inset-0 border-[3px] border-night-950/10 rounded-2xl pointer-events-none"></div>
        <span className={`${size === 'sm' ? 'text-[4px]' : 'text-[6px]'} font-mono font-black text-night-950 mt-1 uppercase tracking-tighter truncate w-full text-center relative z-10`}>{code}</span>
    </div>
);

// --- Mandatory Custom Dropdown Component ---
const CustomDropdown = ({ options, value, onChange, placeholder, className, disabled = false, icon: Icon }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const extendedOptions = useMemo(() => {
        const base = Array.isArray(options) ? options : [];
        if (placeholder === 'اختر الصفة...' && !base.includes('عميد')) {
            return ['كشاف', 'قائد', 'عميد', 'منخرط', 'عضو شرفي'];
        }
        return base;
    }, [options, placeholder]);

    const selectedOption = extendedOptions.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className} font-sans`}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full h-12 bg-night-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-all shadow-inner ${disabled ? 'opacity-50' : ''} ${isOpen ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}`}
            >
                <div className="flex items-center gap-3 truncate">
                    {Icon && <Icon size={16} className="text-primary-400 shrink-0" />}
                    <span className={`block truncate ${!value ? 'text-night-500' : 'text-white font-bold'}`}>{label || 'اختر...'}</span>
                </div>
                <ChevronDown size={14} className={`text-night-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[1000]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-night-800 border border-white/10 rounded-xl shadow-2xl z-[1001] max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                        {extendedOptions.map((opt: any, idx: number) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            const isSelected = val === value;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`p-3.5 cursor-pointer text-sm transition-colors flex justify-between items-center ${isSelected ? 'bg-primary-600/10 text-primary-400 font-black' : 'text-white hover:bg-white/5'}`}
                                >
                                    {lbl}
                                    {isSelected && <CheckCircle2 size={14} />}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

// --- Form Input Components ---
const InputWrapper = ({ label, children, required = false }: any) => (
    <div className="space-y-1.5 text-right">
        <label className="text-[10px] font-black text-night-400 flex items-center gap-1 font-sans uppercase tracking-[0.1em] mr-2">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {children}
    </div>
);

const TextInput = ({ field, placeholder, type = "text", required = false, value, onChange, multiline = false, icon: Icon }: any) => {
    const baseClass = "w-full bg-night-900 border border-white/10 rounded-xl px-4 text-white focus:border-primary-500 outline-none font-sans font-bold shadow-inner transition-all";
    
    return (
        <div className="relative group">
            {multiline ? (
                <textarea 
                    className={`${baseClass} py-3 min-h-[100px] resize-none`}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(field, e.target.value)}
                />
            ) : (
                <div className="relative">
                    <input 
                        type={type}
                        required={required}
                        className={`${baseClass} h-12 ${Icon ? 'pr-12' : ''}`}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={(e) => onChange(field, e.target.value)}
                    />
                    {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-night-500 group-focus-within:text-primary-400 transition-colors" size={18} />}
                </div>
            )}
        </div>
    );
};

interface MembersProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

const Members: React.FC<MembersProps> = ({ members, onAddMember, onUpdateMember, onDeleteMember }) => {
  const [viewMode, setViewMode] = useState<'TABLE' | 'FORM'>('TABLE');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberDetailTab, setMemberDetailTab] = useState('OVERVIEW');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listFilters, setListFilters] = useState({ unit: 'ALL', role: 'ALL', gender: 'ALL', status: 'ALL' });

  const initialFormState: Partial<Member> = {
    scoutYear: SCOUT_YEARS[0], role: 'كشاف', scoutStatus: 'نشط', membershipNumber: 'SIA-001-B',
    fullName: '', fullNameEn: '', gender: 'ذكر', birthDate: '', birthPlace: '', bloodType: '',
    phone: '', email: '', nationalId: '', passportNumber: '', nationality: 'الجزائرية',
    hasSecondNationality: false, secondNationality: '', address: 'الجزائر', addressDetail: '',
    guardianName: '', guardianRelation: 'أب', guardianPhone: '', guardianJob: '',
    motherName: '', motherJob: '', siblingsCount: 0, birthOrder: 1, familyStatus: 'أعزب',
    financialStatus: 'متوسطة', isOrphan: false,
    studyStatus: 'يزاول', educationLevel: 'ابتدائي', institution: '', classSection: '', specialty: '', educationEndDate: '',
    unit: '', patrol: '', scoutMission: 'عضو', rank: 'مبتدئ', joinDate: new Date().toISOString().split('T')[0],
    insuranceNumber: '', insurancePaid: false, subscriptionPaid: false, points: 0, externalActivities: []
  };

  const [formData, setFormData] = useState<Partial<Member>>(initialFormState);
  const [formTab, setFormTab] = useState(0);

  const FORM_TABS = [
      { id: 0, label: 'الشخصية', icon: User },
      { id: 1, label: 'العائلية', icon: Users },
      { id: 2, label: 'الاجتماعية', icon: Home },
      { id: 3, label: 'الكشفية', icon: Tent },
      { id: 4, label: 'الدراسية', icon: GraduationCap },
      { id: 5, label: 'الصحية', icon: HeartPulse },
      { id: 6, label: 'المالية', icon: DollarSign },
      { id: 7, label: 'النشاطات', icon: Star },
  ];

  const processedMembers = useMemo(() => {
      return members.filter(m => {
          const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || m.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesUnit = listFilters.unit === 'ALL' || m.unit === listFilters.unit;
          const matchesRole = listFilters.role === 'ALL' || m.role === listFilters.role;
          const matchesStatus = listFilters.status === 'ALL' || m.scoutStatus === listFilters.status;
          return matchesSearch && matchesUnit && matchesRole && matchesStatus;
      }).sort((a, b) => (b.points || 0) - (a.points || 0));
  }, [members, searchTerm, listFilters]);

  const stats = useMemo(() => ({
      total: members.length,
      scouts: members.filter(m => m.role === 'كشاف').length,
      leaders: members.filter(m => m.role === 'قائد').length,
      deans: members.filter(m => m.role === 'عميد').length,
      males: members.filter(m => m.gender === 'ذكر').length,
      females: members.filter(m => m.gender === 'أنثى').length,
      insured: members.filter(m => m.insurancePaid).length,
      subscribed: members.filter(m => m.subscriptionPaid).length,
  }), [members]);

  const handleInputChange = (field: keyof Member, value: any) => {
    const newData = { ...formData, [field]: value };
    if (field === 'birthDate') newData.age = getAge(value);
    setFormData(newData);
  };

  const handleAddExternalActivity = () => {
      const newAct: MemberActivity = { id: Date.now().toString(), type: 'دورة', name: '', date: '', location: '' };
      handleInputChange('externalActivities', [...(formData.externalActivities || []), newAct]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) onUpdateMember(formData as Member);
    else onAddMember({ ...formData, id: Date.now().toString(), isActive: formData.scoutStatus === 'نشط' } as Member);
    setViewMode('TABLE');
  };

  // --- UI Components ---
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, glowClass }: any) => (
      <div className={`relative overflow-hidden p-6 rounded-2xl bg-night-800 border border-white/5 shadow-xl flex flex-row-reverse items-center justify-between group transition-all duration-300 hover:shadow-2xl hover:border-white/10`}>
          <div className={`p-3.5 rounded-xl ${bgClass} ${colorClass} shadow-inner group-hover:scale-110 transition-transform ${glowClass}`}>
              <Icon size={24} />
          </div>
          <div className="text-right space-y-0.5">
              <h3 className="text-3xl font-black text-white font-mono tracking-tighter leading-none">{value}</h3>
              <p className="text-night-500 text-[9px] font-black uppercase tracking-[0.1em]">{title}</p>
          </div>
          <div className={`absolute -bottom-1 -left-1 w-8 h-8 ${bgClass} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity`}></div>
      </div>
  );

  const renderFormHeader = () => (
    <div className="relative bg-night-900/40 p-10 rounded-t-[3rem] border-b border-white/5 overflow-visible animate-fade-in z-[100]">
        <div className="absolute top-6 left-10 z-10">
            <ModernSquareBarcode code={formData.membershipNumber || 'SIA-001-B'} />
        </div>
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('memberImageInput')?.click()}>
                <div className="absolute -inset-3 bg-gradient-to-tr from-primary-600 via-indigo-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative w-40 h-40 rounded-[2.5rem] bg-night-950 border-4 border-white/10 overflow-hidden shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-500">
                    {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover" />
                    ) : (
                        <Camera size={48} className="text-night-700" />
                    )}
                    <div className="absolute inset-0 bg-night-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Upload className="text-white" size={24} />
                    </div>
                </div>
                <input id="memberImageInput" type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => handleInputChange('image', reader.result as string);
                        reader.readAsDataURL(file);
                    }
                }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-4xl relative z-[101]">
                <InputWrapper label="السنة الكشفية">
                    <CustomDropdown options={SCOUT_YEARS} value={formData.scoutYear} onChange={(v:any)=>handleInputChange('scoutYear',v)} icon={Calendar} />
                </InputWrapper>
                <InputWrapper label="الصفة">
                    <CustomDropdown options={['كشاف', 'قائد', 'عميد', 'منخرط', 'عضو شرفي']} placeholder="اختر الصفة..." value={formData.role} onChange={(v:any)=>handleInputChange('role',v)} icon={Medal} />
                </InputWrapper>
                <InputWrapper label="رقم العضوية (تلقائي)">
                    <div className="w-full h-12 bg-night-950 border border-white/5 rounded-xl px-4 flex items-center justify-center text-primary-400 font-mono font-black tracking-widest shadow-inner">
                        {formData.membershipNumber}
                    </div>
                </InputWrapper>
                <InputWrapper label="الحالة">
                    <CustomDropdown options={['نشط', 'غير نشط', 'معلق']} value={formData.scoutStatus} onChange={(v:any)=>handleInputChange('scoutStatus',v)} icon={Activity} />
                </InputWrapper>
            </div>
        </div>
    </div>
  );

  if (viewMode === 'TABLE') {
      return (
          <div className="p-8 h-full flex flex-col animate-fade-in font-sans relative">
              <div className="flex flex-row justify-between items-center mb-10">
                  <div className="text-right">
                      <h2 className="text-4xl font-black text-white flex items-center gap-4 justify-start">
                          <div className="p-3 bg-primary-600/10 text-primary-500 rounded-2xl border border-primary-500/20 shadow-inner">
                            <Users size={32} />
                          </div>
                          إدارة الأعضاء
                      </h2>
                      <p className="text-night-500 font-bold uppercase tracking-widest text-[10px] mt-1 pr-1">النظام الموحد للتحكم في قاعدة بيانات الفوج.</p>
                  </div>
                  <div className="flex gap-3">
                      <button className="relative group overflow-hidden bg-night-800 text-night-100 px-8 py-3 rounded-xl border border-white/10 transition-all shadow-xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:border-blue-500/50">
                          <Download size={18} className="text-blue-400" /> <span>تصدير السجلات</span>
                      </button>
                      <button 
                          onClick={() => { setFormData(initialFormState); setFormTab(0); setViewMode('FORM'); }}
                          className="relative group overflow-hidden bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 text-white px-10 py-3 rounded-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 font-black text-sm uppercase tracking-widest ring-4 ring-primary-600/10"
                      >
                          <UserPlus size={20} className="relative z-10" /> <span className="relative z-10">تسجيل عضو جديد</span>
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
                  <StatCard title="إجمالي الفوج" value={stats.total} icon={Users} colorClass="text-blue-400" bgClass="bg-blue-600/10" glowClass="shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                  <StatCard title="عدد الكشافين" value={stats.scouts} icon={UserCircle2} colorClass="text-emerald-400" bgClass="bg-emerald-600/10" glowClass="shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                  <StatCard title="عدد القادة" value={stats.leaders} icon={Crown} colorClass="text-amber-400" bgClass="bg-amber-600/10" glowClass="shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                  <StatCard title="عدد العمداء" value={stats.deans} icon={Medal} colorClass="text-purple-400" bgClass="bg-purple-600/10" glowClass="shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
                  <StatCard title="ذكور" value={stats.males} icon={Mars} colorClass="text-sky-400" bgClass="bg-sky-600/10" glowClass="shadow-[0_0_15px_rgba(56,189,248,0.3)]" />
                  <StatCard title="إناث" value={stats.females} icon={Venus} colorClass="text-pink-400" bgClass="bg-pink-600/10" glowClass="shadow-[0_0_15px_rgba(244,114,182,0.3)]" />
                  <StatCard title="تم تأمين" value={stats.insured} icon={ShieldCheck} colorClass="text-indigo-400" bgClass="bg-indigo-600/10" glowClass="shadow-[0_0_15px_rgba(129,140,248,0.3)]" />
                  <StatCard title="تم إشتراك" value={stats.subscribed} icon={Wallet} colorClass="text-orange-400" bgClass="bg-orange-600/10" glowClass="shadow-[0_0_15px_rgba(251,146,60,0.3)]" />
              </div>

              {/* Advanced Filter Collapsible */}
              <div className="mb-6 space-y-4">
                  <div className="flex gap-4 bg-night-800/60 p-4 rounded-2xl border border-white/5 shadow-inner">
                      <div className="flex-1 relative group">
                          <input 
                              type="text" 
                              placeholder="بحث ذكي..." 
                              className="w-full bg-night-900 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-white font-bold focus:border-primary-500 outline-none transition-all shadow-inner"
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                          />
                          <Search className="absolute left-4 top-3.5 text-night-500" size={18} />
                      </div>
                      <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`px-6 py-3 rounded-xl border font-black text-xs transition-all flex items-center gap-3 ${isFilterOpen ? 'bg-primary-600 border-primary-500 text-white shadow-lg' : 'bg-night-900 border-white/10 text-night-400 hover:text-white'}`}
                      >
                          <Filter size={16} /> تصفية متقدمة <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                      </button>
                  </div>

                  {isFilterOpen && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-night-800/40 p-6 rounded-2xl border border-white/5 animate-slide-in shadow-2xl overflow-visible">
                          <InputWrapper label="الوحدة"><CustomDropdown options={[{value:'ALL',label:'الكل'}, ...UNITS_LIST.map(u=>({value:u,label:u}))]} value={listFilters.unit} onChange={(v:any)=>setListFilters({...listFilters, unit:v})} icon={Tent} /></InputWrapper>
                          <InputWrapper label="الصفة"><CustomDropdown options={[{value:'ALL',label:'الكل'}, ...ROLES_LIST.map(r=>({value:r,label:r}))]} value={listFilters.role} onChange={(v:any)=>setListFilters({...listFilters, role:v})} icon={Medal} /></InputWrapper>
                          <InputWrapper label="الجنس"><CustomDropdown options={[{value:'ALL',label:'الكل'},{value:'ذكر',label:'ذكر'},{value:'أنثى',label:'أنثى'}]} value={listFilters.gender} onChange={(v:any)=>setListFilters({...listFilters, gender:v})} icon={Mars} /></InputWrapper>
                          <InputWrapper label="الحالة"><CustomDropdown options={[{value:'ALL',label:'الكل'},{value:'نشط',label:'نشط'},{value:'غير نشط',label:'غير نشط'}]} value={listFilters.status} onChange={(v:any)=>setListFilters({...listFilters, status:v})} icon={Activity} /></InputWrapper>
                      </div>
                  )}
              </div>

              <div className="flex-1 bg-night-800/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col">
                  <div className="overflow-x-auto flex-1">
                      <table className="w-full text-right border-collapse">
                          <thead className="bg-night-950/80 text-night-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                              <tr>
                                  <th className="p-5 text-center w-16">الترتيب</th>
                                  <th className="p-5">الإسم الكامل</th>
                                  <th className="p-5">الوحدة</th>
                                  <th className="p-5">تاريخ الميلاد</th>
                                  <th className="p-5">رقم التأمين</th>
                                  <th className="p-5">الحالة</th>
                                  <th className="p-5 text-center">الاجراءات</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-sm font-bold">
                              {processedMembers.map((member, index) => (
                                  <tr key={member.id} className="hover:bg-primary-500/5 transition-all group/row cursor-pointer" onClick={() => { setSelectedMember(member); setMemberDetailTab('OVERVIEW'); setShowDetailModal(true); }}>
                                      <td className="p-4 text-center">
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-[10px] font-black ${index < 3 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-white/5 text-night-500 border border-white/5'}`}>
                                              {index + 1}
                                          </div>
                                      </td>
                                      <td className="p-4 whitespace-nowrap">
                                          <div className="flex items-center gap-4">
                                              <img src={member.image || 'https://i.pravatar.cc/100'} className="w-10 h-10 rounded-xl border border-night-700 shadow-md group-hover/row:scale-105 transition-transform" />
                                              <div><p className="text-white font-black group-hover/row:text-primary-400 transition-colors">{member.fullName}</p><p className="text-[9px] text-night-500 font-mono tracking-widest uppercase">{member.membershipNumber}</p></div>
                                          </div>
                                      </td>
                                      <td className="p-4 whitespace-nowrap"><p className="text-white text-xs">{member.unit}</p><p className="text-[9px] text-night-500 font-black uppercase mt-0.5">{member.role}</p></td>
                                      <td className="p-4 whitespace-nowrap font-mono text-xs text-night-300">{member.birthDate}</td>
                                      <td className="p-4 whitespace-nowrap font-mono text-xs text-night-400">{member.insuranceNumber || '---'}</td>
                                      <td className="p-4 whitespace-nowrap">
                                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase inline-flex items-center gap-1.5 ${member.scoutStatus === 'نشط' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-600/10 text-rose-400 border-rose-500/20'}`}>
                                              <div className={`w-1 h-1 rounded-full ${member.scoutStatus === 'نشط' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></div>{member.scoutStatus}
                                          </span>
                                      </td>
                                      <td className="p-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                                          <div className="flex items-center justify-center gap-2">
                                              <button onClick={() => { setSelectedMember(member); setShowDetailModal(true); }} className="p-2 bg-white/5 hover:bg-primary-600 rounded-lg text-night-400 hover:text-white transition-all shadow-xl"><Eye size={16}/></button>
                                              <button onClick={() => { setFormData(member); setViewMode('FORM'); }} className="p-2 bg-white/5 hover:bg-indigo-600 rounded-lg text-night-400 hover:text-white transition-all shadow-xl"><Edit size={16}/></button>
                                              <button onClick={() => onDeleteMember(member.id)} className="p-2 bg-white/5 hover:bg-rose-600 rounded-lg text-night-400 hover:text-white transition-all shadow-xl"><Trash2 size={16}/></button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  
                  {/* Table Footer with Statistics */}
                  <div className="p-6 bg-night-950/80 border-t border-white/5 flex flex-row-reverse justify-between items-center text-xs font-black">
                      <div className="flex gap-6 items-center">
                          <div className="flex items-center gap-2">
                              <span className="text-night-500 uppercase tracking-widest">إجمالي المسجلين في القائمة:</span>
                              <span className="text-primary-400 text-lg font-mono">{processedMembers.length}</span>
                          </div>
                          <div className="h-6 w-px bg-white/10"></div>
                          <div className="flex items-center gap-2">
                              <span className="text-night-500 uppercase tracking-widest">تم التأمين:</span>
                              <span className="text-emerald-400 text-lg font-mono">{processedMembers.filter(m=>m.insurancePaid).length}</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 bg-primary-600/5 px-4 py-2 rounded-xl border border-primary-500/10">
                          <History size={16} className="text-primary-400 animate-pulse" />
                          <div className="text-right">
                              <p className="text-white">تفاصيل آخر مهمة تفاصيل:</p>
                              <p className="text-night-500 text-[10px] uppercase font-bold italic">تحديث قاعدة البيانات المركزية لعام {new Date().getFullYear()}</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Enhanced Member File Modal (Instagram Style Design - Updated as per Request) */}
              {showDetailModal && selectedMember && (
                  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-fade-in font-sans" dir="rtl">
                      <div className="fixed inset-0 bg-night-950/60" onClick={() => setShowDetailModal(false)}></div>
                      <div className="bg-night-900 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col h-[650px] group/modal">
                          
                          {/* Top Artistic Elements (Shallow Header) */}
                          <div className="absolute top-0 left-0 w-full h-[180px] bg-gradient-to-b from-primary-600/20 via-night-900 to-night-900 pointer-events-none"></div>
                          
                          <div className="relative z-20 px-8 pt-8 flex justify-between items-start pointer-events-none">
                              {/* Top Right: Modern Barcode */}
                              <div className="pointer-events-auto">
                                  <ModernSquareBarcode code={selectedMember.membershipNumber} size="sm" />
                              </div>

                              {/* Top Left: Compact Action */}
                              <button onClick={() => setShowDetailModal(false)} className="pointer-events-auto p-3 hover:bg-white/5 rounded-2xl text-night-400 hover:text-white transition-all"><X size={24}/></button>
                          </div>

                          {/* Instagram Style Profile Header (Compacted) */}
                          <div className="relative z-20 flex items-start gap-8 px-10 -mt-6 pointer-events-none">
                              <div className="relative pointer-events-auto">
                                  <div className="absolute -inset-2 bg-gradient-to-tr from-primary-600 via-indigo-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-20"></div>
                                  <div className="relative w-32 h-32 rounded-[2.5rem] bg-night-950 border-4 border-night-800 overflow-hidden shadow-2xl flex items-center justify-center">
                                      <img src={selectedMember.image} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-xl ring-2 ring-night-900">{selectedMember.scoutStatus}</div>
                              </div>

                              <div className="flex-1 pt-2 pointer-events-auto text-right">
                                  <div className="flex flex-col mb-4">
                                      <h3 className="text-3xl font-black text-white leading-tight">{selectedMember.fullName}</h3>
                                      <h4 className="text-sm font-bold text-night-400 opacity-60 tracking-wider uppercase font-mono">{selectedMember.fullNameEn || selectedMember.fullName}</h4>
                                  </div>
                                  
                                  <div className="flex gap-4">
                                      <div className="text-center bg-white/5 border border-white/5 px-4 py-2 rounded-2xl min-w-[80px] backdrop-blur-sm">
                                          <p className="text-[10px] font-black text-primary-400 uppercase leading-none mb-1">{selectedMember.unit}</p>
                                          <p className="text-[8px] text-night-500 font-bold uppercase tracking-widest">الوحدة</p>
                                      </div>
                                      <div className="text-center bg-white/5 border border-white/5 px-4 py-2 rounded-2xl min-w-[80px] backdrop-blur-sm">
                                          <p className="text-[10px] font-black text-white uppercase leading-none mb-1">{selectedMember.rank}</p>
                                          <p className="text-[8px] text-night-500 font-bold uppercase tracking-widest">الرتبة</p>
                                      </div>
                                      <div className="text-center bg-white/5 border border-white/5 px-4 py-2 rounded-2xl min-w-[80px] backdrop-blur-sm">
                                          <p className="text-lg font-black text-amber-400 leading-none mb-0.5 font-mono tracking-tighter">{selectedMember.points}</p>
                                          <p className="text-[8px] text-night-500 font-bold uppercase tracking-widest leading-none">PTS</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Simplified Content Area (Instagram Layout) */}
                          <div className="relative z-20 flex-1 flex flex-col mt-8 overflow-hidden bg-night-950/20 backdrop-blur-xl border-t border-white/5">
                              <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 p-2 justify-center gap-1">
                                  {[
                                      { id: 'OVERVIEW', label: 'نظرة عامة', icon: LayoutDashboard },
                                      { id: 'DETAILS', label: 'الملف الكامل', icon: Fingerprint },
                                      { id: 'DOCS', label: 'الوثائق', icon: FileText }
                                  ].map(tab => (
                                      <button 
                                          key={tab.id}
                                          onClick={() => setMemberDetailTab(tab.id)}
                                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${memberDetailTab === tab.id ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40' : 'text-night-500 hover:text-white hover:bg-white/5'}`}
                                      >
                                          <tab.icon size={14}/> {tab.label}
                                      </button>
                                  ))}
                              </div>

                              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                  {memberDetailTab === 'OVERVIEW' && (
                                      <div className="space-y-6 animate-fade-in">
                                          {/* Section 1: Basic Info Grid */}
                                          <div className="grid grid-cols-2 gap-4">
                                              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 space-y-4 group/box transition-all hover:border-primary-500/30">
                                                  <h5 className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2"><Smartphone size={12}/> قنوات الاتصال</h5>
                                                  <div className="space-y-2">
                                                      <p className="text-white font-mono text-sm font-black">{selectedMember.phone || '0XXXXXXX'}</p>
                                                      <p className="text-night-300 text-[10px] font-bold truncate">{selectedMember.address}</p>
                                                  </div>
                                              </div>
                                              
                                              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 space-y-4 group/box transition-all hover:border-amber-500/30">
                                                  <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> الوضعية المالية</h5>
                                                  <div className="grid grid-cols-2 gap-2">
                                                      <div className={`p-2 rounded-xl text-center border ${selectedMember.insurancePaid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                          <p className="text-[8px] font-black uppercase leading-none mb-1">تأمين</p>
                                                          <p className="text-[10px] font-black">{selectedMember.insurancePaid ? 'OK' : 'X'}</p>
                                                      </div>
                                                      <div className={`p-2 rounded-xl text-center border ${selectedMember.subscriptionPaid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                          <p className="text-[8px] font-black uppercase leading-none mb-1">اشتراك</p>
                                                          <p className="text-[10px] font-black">{selectedMember.subscriptionPaid ? 'OK' : 'X'}</p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Section 2: Scouting & Discipline Highlights */}
                                          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group/box transition-all hover:border-primary-500/30">
                                              <div className="absolute top-0 right-0 w-1 h-full bg-primary-600 opacity-20"></div>
                                              <h5 className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2 mb-6"><Trophy size={14}/> الأداء والانضباط</h5>
                                              <div className="grid grid-cols-3 gap-6 text-center">
                                                  <div>
                                                      <p className="text-2xl font-black text-white font-mono tracking-tighter">95%</p>
                                                      <p className="text-[8px] text-night-500 font-black uppercase tracking-widest mt-1">الحضور العام</p>
                                                  </div>
                                                  <div className="border-r border-l border-white/5">
                                                      <p className="text-2xl font-black text-rose-500 font-mono tracking-tighter">00</p>
                                                      <p className="text-[8px] text-night-500 font-black uppercase tracking-widest mt-1">العقوبات</p>
                                                  </div>
                                                  <div>
                                                      <p className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">{(selectedMember.earnedBadges || []).length}</p>
                                                      <p className="text-[8px] text-night-500 font-black uppercase tracking-widest mt-1">الشارات</p>
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                               <div className="p-4 bg-night-900/40 rounded-2xl border border-white/5 flex items-center justify-between">
                                                   <span className="text-[10px] font-black text-night-500 uppercase">المهمة الكشفية</span>
                                                   <span className="text-[10px] font-black text-white">{selectedMember.scoutMission || 'عضو'}</span>
                                               </div>
                                               <div className="p-4 bg-night-900/40 rounded-2xl border border-white/5 flex items-center justify-between">
                                                   <span className="text-[10px] font-black text-night-500 uppercase">الطليعة</span>
                                                   <span className="text-[10px] font-black text-white">{selectedMember.patrol || 'بدون'}</span>
                                               </div>
                                          </div>
                                      </div>
                                  )}
                                  
                                  {/* Placeholder for other tabs (Detailed as before but kept compact) */}
                                  {memberDetailTab === 'DETAILS' && (
                                      <div className="animate-fade-in grid grid-cols-2 gap-4">
                                          {[
                                              { l: 'تاريخ الميلاد', v: selectedMember.birthDate },
                                              { l: 'فصيلة الدم', v: selectedMember.bloodType },
                                              { l: 'الجنسية', v: selectedMember.nationality },
                                              { l: 'تاريخ الانضمام', v: selectedMember.joinDate },
                                              { l: 'المستوى الدراسي', v: selectedMember.educationLevel },
                                              { l: 'الحالة الصحية', v: selectedMember.healthStatus }
                                          ].map((it, i) => (
                                              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                  <label className="text-[8px] font-black text-night-500 uppercase block mb-1">{it.l}</label>
                                                  <p className="text-xs font-bold text-white">{it.v}</p>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          </div>

                          {/* Instagram Style Bottom Actions (Compacted) */}
                          <div className="relative z-30 p-6 border-t border-white/5 bg-night-900 flex justify-between items-center">
                              <button onClick={() => setShowDetailModal(false)} className="px-6 py-3 bg-white/5 text-white rounded-2xl hover:bg-white/10 font-black text-[10px] uppercase tracking-widest transition-all">إغلاق</button>
                              <div className="flex gap-2">
                                  <button className="p-3 bg-white/5 hover:bg-indigo-600 rounded-xl text-white shadow-lg transition-all border border-white/5"><Printer size={16}/></button>
                                  <button className="px-8 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group/edit"><Edit size={14} className="group-edit:rotate-12 transition-transform" /> تحرير الملف</button>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  if (viewMode === 'FORM') {
      return (
      <div className="p-8 h-full flex flex-col animate-fade-in max-w-5xl mx-auto w-full font-sans pb-20 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-6 mb-8 text-right" dir="rtl">
              <button onClick={() => setViewMode('TABLE')} className="p-3 bg-night-800 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white shadow-xl group">
                  <ChevronRight size={24} className="group-hover:text-primary-400" />
              </button>
              <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">{formData.id ? 'تحرير بيانات العضو' : 'إستمارة تسجيل عضو جديد'}</h2>
                  <p className="text-night-500 font-bold uppercase tracking-widest text-[10px] mt-1 opacity-80">يرجى ملء كافة الحقول لضمان تكامل الملف الإداري الرقمي.</p>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-night-800/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
              {renderFormHeader()}

              <div className="flex overflow-x-auto border-b border-white/5 no-scrollbar bg-night-900/30 px-4 relative z-0" dir="rtl">
                  {FORM_TABS.map((tab) => (
                      <button
                          key={tab.id}
                          type="button"
                          onClick={() => setFormTab(tab.id)}
                          className={`flex items-center gap-2.5 px-6 py-4 text-[11px] font-black whitespace-nowrap transition-all border-b-2 uppercase tracking-widest ${formTab === tab.id ? 'border-primary-500 text-white bg-primary-500/5' : 'border-transparent text-night-500 hover:text-white'}`}
                      >
                          <tab.icon size={16} className={formTab === tab.id ? 'text-primary-400' : ''} /> {tab.label}
                      </button>
                  ))}
              </div>

              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar relative z-0" dir="rtl">
                  {formTab === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-fade-in">
                        <InputWrapper label="الاسم الكامل (بالعربية)" required>
                            <TextInput field="fullName" placeholder="اللقب والاسم" required value={formData.fullName} onChange={handleInputChange} icon={User} />
                        </InputWrapper>
                        <InputWrapper label="الاسم الكامل (باللاتينية)">
                            <TextInput field="fullNameEn" placeholder="Full Name (Latin)" value={formData.fullNameEn} onChange={handleInputChange} icon={Globe} />
                        </InputWrapper>
                        <InputWrapper label="الجنس" required>
                            <CustomDropdown options={['ذكر', 'أنثى']} value={formData.gender} onChange={(v:any) => handleInputChange('gender', v)} icon={Mars} />
                        </InputWrapper>
                        <InputWrapper label="تاريخ الميلاد" required>
                            <TextInput field="birthDate" type="date" required value={formData.birthDate} onChange={handleInputChange} icon={Calendar} />
                        </InputWrapper>
                        <InputWrapper label="مكان الميلاد">
                            <TextInput field="birthPlace" placeholder="بلدية الميلاد" value={formData.birthPlace} onChange={handleInputChange} icon={MapPin} />
                        </InputWrapper>
                        <InputWrapper label="فصيلة الدم">
                            <CustomDropdown options={BLOOD_TYPES} value={formData.bloodType} onChange={(v:any) => handleInputChange('bloodType', v)} icon={HeartPulse} />
                        </InputWrapper>
                        <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2">
                            <h5 className="text-xs font-black text-primary-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Smartphone size={14}/> معلومات الاتصال والهوية</h5>
                        </div>
                        <InputWrapper label="الهاتف الشخصي">
                            <TextInput field="phone" placeholder="0XXXXXXX" type="tel" value={formData.phone} onChange={handleInputChange} icon={Phone} />
                        </InputWrapper>
                        <InputWrapper label="البريد الإلكتروني">
                            <TextInput field="email" placeholder="example@mail.com" type="email" value={formData.email} onChange={handleInputChange} icon={Mail} />
                        </InputWrapper>
                        <InputWrapper label="رقم بطاقة التعريف الوطنية">
                            <TextInput field="nationalId" placeholder="الرقم التعريفي الوطني" value={formData.nationalId} onChange={handleInputChange} icon={ShieldCheck} />
                        </InputWrapper>
                        <InputWrapper label="رقم جواز السفر">
                            <TextInput field="passportNumber" placeholder="رقم الجواز" value={formData.passportNumber} onChange={handleInputChange} icon={Globe2} />
                        </InputWrapper>
                        <InputWrapper label="الجنسية الأصلية">
                            <CustomDropdown options={['الجزائرية', 'أخرى']} value={formData.nationality} onChange={(v:any) => handleInputChange('nationality', v)} icon={Flag} />
                        </InputWrapper>
                        <InputWrapper label="هل لديه جنسية ثانية؟">
                            <CustomDropdown options={[{value:false, label:'لا'}, {value:true, label:'نعم'}]} value={formData.hasSecondNationality} onChange={(v:any) => handleInputChange('hasSecondNationality', v)} icon={Layers} />
                        </InputWrapper>
                        {formData.hasSecondNationality && (
                            <InputWrapper label="الجنسية الثانية">
                                <TextInput field="secondNationality" placeholder="ادخل الجنسية الثانية" value={formData.secondNationality} onChange={handleInputChange} icon={Globe2} />
                            </InputWrapper>
                        )}
                        <InputWrapper label="الولاية">
                            <CustomDropdown options={ALGERIA_WILAYAS} value={formData.address} onChange={(v:any) => handleInputChange('address', v)} icon={MapPin} />
                        </InputWrapper>
                        <InputWrapper label="العنوان السكني بالتفصيل">
                            <TextInput field="addressDetail" placeholder="الشارع، الحي، البلدية..." value={formData.addressDetail} onChange={handleInputChange} icon={Home} />
                        </InputWrapper>
                      </div>
                  )}

                  {formTab === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-fade-in">
                        <InputWrapper label="اسم الولي الكامل">
                            <TextInput field="guardianName" placeholder="الاسم واللقب" value={formData.guardianName} onChange={handleInputChange} icon={UserCircle2} />
                        </InputWrapper>
                        <InputWrapper label="صلة القرابة">
                            <CustomDropdown options={RELATIONSHIPS} value={formData.guardianRelation} onChange={(v:any) => handleInputChange('guardianRelation', v)} icon={Link} />
                        </InputWrapper>
                        <InputWrapper label="هاتف الولي">
                            <TextInput field="guardianPhone" placeholder="0XXXXXXX" type="tel" value={formData.guardianPhone} onChange={handleInputChange} icon={Phone} />
                        </InputWrapper>
                        <InputWrapper label="مهنة الولي">
                            <TextInput field="guardianJob" placeholder="الوظيفة الحالية" value={formData.guardianJob} onChange={handleInputChange} icon={Briefcase} />
                        </InputWrapper>
                        <InputWrapper label="اسم الأم الكامل">
                            <TextInput field="motherName" placeholder="الاسم واللقب" value={formData.motherName} onChange={handleInputChange} icon={User} />
                        </InputWrapper>
                        <InputWrapper label="مهنة الأم">
                            <TextInput field="motherJob" placeholder="الوظيفة أو ماكثة بالبيت" value={formData.motherJob} onChange={handleInputChange} icon={Briefcase} />
                        </InputWrapper>
                        <InputWrapper label="عدد الإخوة">
                            <TextInput field="siblingsCount" type="number" value={formData.siblingsCount} onChange={handleInputChange} icon={Users} />
                        </InputWrapper>
                        <InputWrapper label="الترتيب في العائلة">
                            <CustomDropdown options={BIRTH_ORDER_LABELS} value={formData.birthOrderLabel} onChange={(v:any) => handleInputChange('birthOrderLabel', v)} icon={Layers} />
                        </InputWrapper>
                        <InputWrapper label="الوضعية العائلية">
                            <CustomDropdown options={FAMILY_STATUS_OPTIONS} value={formData.familyStatus} onChange={(v:any) => handleInputChange('familyStatus', v)} icon={Users} />
                        </InputWrapper>
                        <div className="flex items-center gap-4 h-12 mt-6">
                            <label className="flex items-center gap-3 cursor-pointer text-white font-black group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg accent-primary-500 shadow-inner" checked={formData.isOrphan} onChange={(e)=>handleInputChange('isOrphan', e.target.checked)} />
                                <span className="text-xs uppercase tracking-widest group-hover:text-primary-400 transition-colors">هل العضو يتيم؟</span>
                            </label>
                        </div>
                      </div>
                  )}

                  {formTab === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-fade-in">
                          <InputWrapper label="الحالة المادية للعائلة">
                              <CustomDropdown options={FINANCIAL_STATUS} value={formData.financialStatus} onChange={(v:any) => handleInputChange('financialStatus', v)} icon={BadgeDollarSign} />
                          </InputWrapper>
                          <InputWrapper label="طبيعة السكن">
                              <CustomDropdown options={['ملكية', 'كراء', 'وظيفي', 'آخر']} value={formData.housingType} onChange={(v:any) => handleInputChange('housingType', v)} icon={Home} />
                          </InputWrapper>
                          <InputWrapper label="عدد الغرف">
                              <TextInput field="roomCount" type="number" value={formData.roomCount} onChange={handleInputChange} icon={Box} />
                          </InputWrapper>
                          <InputWrapper label="عدد القاطنين بالمنزل">
                              <TextInput field="familyMembersCount" type="number" value={formData.familyMembersCount} onChange={handleInputChange} icon={Users} />
                          </InputWrapper>
                          <InputWrapper label="حالات اجتماعية خاصة">
                              <TextInput field="specialSocialCases" placeholder="عوز، إعاقة، حالة طبية..." value={formData.specialSocialCases} onChange={handleInputChange} multiline />
                          </InputWrapper>
                          <InputWrapper label="الهوايات والاهتمامات">
                              <TextInput field="hobbies" placeholder="رسم، رياضة، تقنية..." value={formData.hobbies} onChange={handleInputChange} multiline />
                          </InputWrapper>
                      </div>
                  )}

                  {formTab === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-fade-in">
                        <InputWrapper label="الوحدة الكشفية">
                            <CustomDropdown options={UNITS_LIST} value={formData.unit} onChange={(v:any) => handleInputChange('unit', v)} icon={Tent} />
                        </InputWrapper>
                        <InputWrapper label="الطليعة / السداسية">
                            <TextInput field="patrol" placeholder="اسم الطليعة" value={formData.patrol} onChange={handleInputChange} icon={Flag} />
                        </InputWrapper>
                        <InputWrapper label="المهمة الكشفية">
                            <TextInput field="scoutMission" placeholder="عريف، نائب، أمين..." value={formData.scoutMission} onChange={handleInputChange} icon={Shield} />
                        </InputWrapper>
                        <InputWrapper label="الرتبة الحالية">
                            <CustomDropdown options={[...RANKS_SMALL_UNITS, ...RANKS_LARGE_UNITS]} value={formData.rank} onChange={(v:any) => handleInputChange('rank', v)} icon={Medal} />
                        </InputWrapper>
                        <InputWrapper label="تاريخ الانضمام">
                            <TextInput field="joinDate" type="date" value={formData.joinDate} onChange={handleInputChange} icon={Clock} />
                        </InputWrapper>
                        <InputWrapper label="رقم التأمين">
                            <TextInput field="insuranceNumber" placeholder="INS-XXXX" value={formData.insuranceNumber} onChange={handleInputChange} icon={Hash} />
                        </InputWrapper>
                      </div>
                  )}

                  {formTab === 4 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-fade-in">
                        <InputWrapper label="الوضعية الدراسية">
                            <CustomDropdown options={['يزاول', 'متوقف', 'متخرج']} value={formData.studyStatus} onChange={(v:any) => handleInputChange('studyStatus', v)} icon={Activity} />
                        </InputWrapper>
                        <InputWrapper label="المستوى التعليمي">
                            <CustomDropdown options={EDUCATIONAL_LEVELS} value={formData.educationLevel} onChange={(v:any) => handleInputChange('educationLevel', v)} icon={GraduationCap} />
                        </InputWrapper>
                        <InputWrapper label="المؤسسة التعليمية">
                            <TextInput field="institution" placeholder="اسم المدرسة أو الجامعة" value={formData.institution} onChange={handleInputChange} icon={Building} />
                        </InputWrapper>
                        <InputWrapper label="القسم">
                            <TextInput field="classSection" placeholder="مثال: السنة الثالثة" value={formData.classSection} onChange={handleInputChange} icon={Layers} />
                        </InputWrapper>
                        <InputWrapper label="التخصص الدراسي">
                            <TextInput field="specialty" placeholder="مثال: علوم دقيقة، لغات..." value={formData.specialty} onChange={handleInputChange} icon={Book} />
                        </InputWrapper>
                        <InputWrapper label="تاريخ التوقف / التخرج">
                            <TextInput field="educationEndDate" type="date" value={formData.educationEndDate} onChange={handleInputChange} icon={Calendar} />
                        </InputWrapper>
                      </div>
                  )}

                  {formTab === 5 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-fade-in">
                        <InputWrapper label="الحالة الصحية العامة">
                            <CustomDropdown options={HEALTH_STATUS_OPTIONS} value={formData.healthStatus} onChange={(v:any) => handleInputChange('healthStatus', v)} icon={HeartPulse} />
                        </InputWrapper>
                        <InputWrapper label="الأمراض المزمنة">
                            <TextInput field="chronicDiseases" placeholder="اذكرها إن وجدت" value={formData.chronicDiseases} onChange={handleInputChange} multiline />
                        </InputWrapper>
                        <InputWrapper label="الحساسية">
                            <TextInput field="allergies" placeholder="أدوية، مأكولات..." value={formData.allergies} onChange={handleInputChange} />
                        </InputWrapper>
                        <InputWrapper label="اللقاحات المستوفاة">
                            <TextInput field="vaccines" placeholder="اذكر اللقاحات الأساسية" value={formData.vaccines} onChange={handleInputChange} />
                        </InputWrapper>
                        <InputWrapper label="هاتف الطوارئ">
                            <TextInput field="emergencyContact" placeholder="0XXXXXXX" type="tel" value={formData.emergencyContact} onChange={handleInputChange} icon={Phone} />
                        </InputWrapper>
                        <InputWrapper label="ملاحظات طبية إضافية">
                            <TextInput field="healthNotes" placeholder="تعليمات خاصة للقادة..." value={formData.healthNotes} onChange={handleInputChange} multiline />
                        </InputWrapper>
                      </div>
                  )}

                  {formTab === 6 && (
                      <div className="space-y-8 animate-fade-in">
                        <div className="bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-5 shadow-inner">
                            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl shadow-lg"><Info size={28}/></div>
                            <div className="text-right">
                                <h5 className="text-white font-black text-lg">تذكير بالرسوم السنوية المعتمدة</h5>
                                <p className="text-[11px] text-emerald-300/80 font-bold uppercase tracking-widest mt-1">مبلغ التأمين: 400 دج • اشتراك الفوج: 600 دج</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${formData.insurancePaid ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-night-900 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${formData.insurancePaid ? 'bg-emerald-500 text-white' : 'bg-night-800 text-night-500'} transition-all shadow-lg`}><ShieldCheck size={24}/></div>
                                    <div><p className="text-white font-black">رسوم التأمين السنوي</p><p className="text-[10px] text-night-500 font-bold">400 دج</p></div>
                                </div>
                                <button type="button" onClick={() => handleInputChange('insurancePaid', !formData.insurancePaid)} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.insurancePaid ? 'bg-emerald-600 text-white' : 'bg-white/5 text-night-400 hover:text-white'}`}>{formData.insurancePaid ? 'تم الدفع' : 'تسجيل دفع'}</button>
                            </div>
                            <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${formData.subscriptionPaid ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-night-900 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${formData.subscriptionPaid ? 'bg-emerald-500 text-white' : 'bg-night-800 text-night-500'} transition-all shadow-lg`}><CreditCard size={24}/></div>
                                    <div><p className="text-white font-black">اشتراك الفوج السنوي</p><p className="text-[10px] text-night-500 font-bold">600 دج</p></div>
                                </div>
                                <button type="button" onClick={() => handleInputChange('subscriptionPaid', !formData.subscriptionPaid)} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.subscriptionPaid ? 'bg-emerald-600 text-white' : 'bg-white/5 text-night-400 hover:text-white'}`}>{formData.subscriptionPaid ? 'تم الدفع' : 'تسجيل دفع'}</button>
                            </div>
                        </div>
                        <InputWrapper label="ملاحظات مالية">
                            <TextInput field="financialNotes" placeholder="اتفاقيات خاصة، تخفيضات..." value={formData.financialNotes} onChange={handleInputChange} multiline />
                        </InputWrapper>
                      </div>
                  )}

                  {formTab === 7 && (
                      <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center bg-night-900/60 p-6 rounded-2xl border border-white/5">
                            <div className="text-right">
                                <h5 className="text-white font-black text-lg">سجل النشاطات والدورات الخارجية</h5>
                                <p className="text-[10px] text-night-500 font-bold uppercase tracking-widest mt-1">توثيق التكوينات والتمثيل الوطني والدولي للعضو.</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleAddExternalActivity}
                                className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Plus size={18}/> إضافة مشاركة/دورة
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.externalActivities?.map((act, idx) => (
                                <div key={act.id} className="bg-night-900 border border-white/10 rounded-2xl p-6 shadow-inner animate-slide-in relative group">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const acts = [...(formData.externalActivities || [])];
                                            acts.splice(idx, 1);
                                            handleInputChange('externalActivities', acts);
                                        }}
                                        className="absolute top-4 left-4 p-2 bg-rose-600/10 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><Trash2 size={14}/></button>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <InputWrapper label="نوع المشاركة">
                                            <CustomDropdown options={['دورة', 'تكوين', 'مشاركة وطنية', 'مشاركة دولية', 'أخرى']} value={act.type} onChange={(v:any) => {
                                                const acts = [...(formData.externalActivities || [])];
                                                acts[idx].type = v;
                                                handleInputChange('externalActivities', acts);
                                            }} />
                                        </InputWrapper>
                                        <InputWrapper label="مسمى النشاط">
                                            <input type="text" className="w-full h-12 bg-night-950 border border-white/5 rounded-xl px-4 text-white font-bold text-sm outline-none focus:border-primary-500" value={act.name} onChange={e => {
                                                const acts = [...(formData.externalActivities || [])];
                                                acts[idx].name = e.target.value;
                                                handleInputChange('externalActivities', acts);
                                            }} />
                                        </InputWrapper>
                                        <InputWrapper label="التاريخ">
                                            <input type="date" className="w-full h-12 bg-night-950 border border-white/5 rounded-xl px-4 text-white font-mono text-sm outline-none" value={act.date} onChange={e => {
                                                const acts = [...(formData.externalActivities || [])];
                                                acts[idx].date = e.target.value;
                                                handleInputChange('externalActivities', acts);
                                            }} />
                                        </InputWrapper>
                                        <InputWrapper label="المكان">
                                            <input type="text" className="w-full h-12 bg-night-950 border border-white/5 rounded-xl px-4 text-white font-bold text-sm outline-none focus:border-primary-500" value={act.location} onChange={e => {
                                                const acts = [...(formData.externalActivities || [])];
                                                acts[idx].location = e.target.value;
                                                handleInputChange('externalActivities', acts);
                                            }} />
                                        </InputWrapper>
                                    </div>
                                </div>
                            ))}
                            {(!formData.externalActivities || formData.externalActivities.length === 0) && (
                                <div className="p-16 text-center bg-white/5 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center gap-4">
                                    <History size={48} className="text-night-700 opacity-20" />
                                    <p className="text-night-500 text-sm font-bold italic">لا توجد نشاطات خارجية مسجلة حالياً</p>
                                </div>
                            )}
                        </div>
                      </div>
                  )}
              </div>

              <div className="p-8 border-t border-white/10 bg-night-900/60 backdrop-blur-md flex justify-end gap-4 relative z-0" dir="rtl">
                  <button type="button" onClick={() => setViewMode('TABLE')} className="px-8 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 font-black transition-all shadow-xl uppercase tracking-widest text-xs">إلغاء العملية</button>
                  <button type="submit" className="px-12 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 font-black shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs group">
                      <Save size={18} className="group-hover:scale-125 transition-transform" /> حفظ بيانات العضو
                  </button>
              </div>
          </form>
      </div>
      );
  }

  return null;
};

export default Members;