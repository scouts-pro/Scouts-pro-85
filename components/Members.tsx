
import React, { useState, useMemo, useEffect } from 'react';
import { Member, MemberRole, UnitName, EquipmentItem } from '../types';
import { 
    UNITS_LIST, ROLES_LIST, ALGERIA_WILAYAS, HEALTH_STATUS_OPTIONS, FINANCIAL_STATUS, 
    FAMILY_STATUS_OPTIONS, BIRTH_ORDER_LABELS, SCOUT_MISSIONS_SCOUT, SCOUT_MISSIONS_LEADER,
    RANKS_SMALL_UNITS, RANKS_LARGE_UNITS, EDUCATIONAL_LEVELS, RELATIONSHIPS, BLOOD_TYPES
} from '../constants';
import { 
    Plus, Search, Eye, Edit, Trash2, X, Save, User, Users, GraduationCap, Tent, Activity, UserPlus, 
    ChevronDown, MapPin, Phone, Calendar, Heart, Shield, Award, Star, Filter, LayoutGrid, List, 
    Download, CheckCircle2, AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight, Settings2, MoreHorizontal,
    Camera, Briefcase, DollarSign, BookOpen, PenTool, ShieldCheck, Coins, Info, ArrowRight, Medal, ArrowUp, ArrowDown,
    Receipt, Shirt, Wallet, Box, Globe, Gavel, FileText, Smartphone, Mail, Flag, Clock, Building, Layers, AlertTriangle, Home
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

// --- Custom Dropdown Component ---
const CustomDropdown = ({ options, value, onChange, placeholder, className }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedOption = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className} font-sans`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 bg-night-900 border border-white/10 rounded-xl px-3 pl-10 flex items-center justify-between cursor-pointer hover:border-primary-500/50 transition-colors"
            >
                <span className={`block truncate ${!value ? 'text-night-400' : 'text-white'}`}>{label || 'اختر...'}</span>
                <ChevronDown size={16} className={`text-night-400 transition-transform duration-200 absolute left-3 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-night-800 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                        {options.map((opt: any, idx: number) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const lbl = typeof opt === 'object' ? opt.label : opt;
                            const isSelected = val === value;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`p-3 cursor-pointer text-sm transition-colors flex justify-between items-center ${isSelected ? 'bg-primary-600/10 text-primary-400' : 'text-white hover:bg-white/5'}`}
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

// --- Smart Components ---
const SmartSelect = ({ label, value, onChange, options, placeholder, required = false, noteValue, onNoteChange, className }: any) => {
    const isOther = value && !options.includes(value) && value !== '';
    
    const dropdownOptions = [
        ...options,
        { value: 'OTHER_TRIGGER', label: 'خيارات أخرى (إدخال يدوي)' }
    ];

    const handleSelectChange = (val: string) => {
        if (val === 'OTHER_TRIGGER') {
            onChange(''); 
        } else {
            onChange(val);
        }
    };

    return (
        <div className={`space-y-2 ${className || ''}`}>
            {label && (
                <label className="text-sm font-bold text-night-300 flex items-center gap-1 font-sans">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <CustomDropdown 
                value={isOther ? 'OTHER_TRIGGER' : value}
                onChange={handleSelectChange}
                options={dropdownOptions}
                placeholder={placeholder}
            />

            {(isOther || noteValue !== undefined) && (
                <input 
                    type="text" 
                    placeholder={noteValue !== undefined ? "ملاحظات إضافية (نص حر)" : "يرجى التحديد كتابياً..."}
                    className={`w-full h-12 bg-night-800 border ${isOther ? 'border-amber-500/50' : 'border-white/5'} rounded-xl px-3 text-white focus:border-primary-500 outline-none animate-fade-in mt-2 font-sans`}
                    value={noteValue !== undefined ? noteValue : value}
                    onChange={(e) => noteValue !== undefined ? onNoteChange(e.target.value) : onChange(e.target.value)}
                />
            )}
        </div>
    );
};

// --- Fixed Components Outside Render (Prevents focus loss) ---
const InputWrapper = ({ label, children, required = false }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-night-300 flex items-center gap-1 font-sans">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const TextInput = ({ field, placeholder, type = "text", required = false, value, onChange }: any) => (
    <input 
        type={type}
        required={required}
        className="w-full h-12 bg-night-900 border border-white/10 rounded-xl px-4 text-white focus:border-primary-500 outline-none font-sans"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
    />
);

interface MembersProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  equipmentList?: EquipmentItem[]; 
}

// --- Main Component ---
const Members: React.FC<MembersProps> = ({ members, onAddMember, onUpdateMember, onDeleteMember, equipmentList = [] }) => {
  const [viewMode, setViewMode] = useState<'TABLE' | 'FORM'>('TABLE');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedMemberTab, setSelectedMemberTab] = useState('OVERVIEW'); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
      unit: 'ALL',
      role: 'ALL',
      gender: 'ALL',
      payment: 'ALL', 
      status: 'ALL', 
      ageGroup: 'ALL', 
  });

  const [sortConfig, setSortConfig] = useState<{ key: keyof Member | 'age'; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const initialFormState: Partial<Member> = {
    image: 'https://i.pravatar.cc/300',
    role: MemberRole.SCOUT,
    scoutStatus: 'نشط',
    gender: 'ذكر',
    address: 'الجزائر', 
    financialStatus: 'متوسطة',
    healthStatus: 'جيد',
    unit: '',
    joinDate: new Date().toISOString().split('T')[0],
    subscriptionPaid: false,
    insurancePaid: false,
    disabilityType: '',
    studyStatus: 'يزاول',
    roomCount: 0,
    schoolingChildren: '',
    scoutChildren: '',
    job: '',
    email: '',
    trainingHistory: '',
    participationHistory: '',
    otherActivities: '',
    scoutJob: '',
    rank: '',
    classSection: '',
    graduationYear: '',
    stopYear: '',
    specialty: '',
    membershipNumber: `SN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    insuranceNumber: `INS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
  };
  const [formData, setFormData] = useState<Partial<Member>>(initialFormState);
  const [formTab, setFormTab] = useState(0);

  const FORM_TABS = [
      { id: 0, label: 'الشخصية', icon: User },
      { id: 1, label: 'العائلية', icon: Users },
      { id: 2, label: 'الكشفية', icon: Tent },
      { id: 3, label: 'الدراسية', icon: GraduationCap },
      { id: 4, label: 'الصحية', icon: Activity },
      { id: 5, label: 'الاجتماعية', icon: Heart },
      { id: 6, label: 'المالية', icon: DollarSign },
      { id: 7, label: 'النشاطات', icon: Star },
  ];

  const processedMembers = useMemo(() => {
      let result = [...members];
      if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          result = result.filter(m => 
              m.fullName.toLowerCase().includes(lowerTerm) ||
              (m.fullNameEn && m.fullNameEn.toLowerCase().includes(lowerTerm)) ||
              m.unit.toLowerCase().includes(lowerTerm) ||
              m.membershipNumber.includes(lowerTerm) ||
              (m.phone && m.phone.includes(lowerTerm)) || 
              (m.insuranceNumber && m.insuranceNumber.toLowerCase().includes(lowerTerm))
          );
      }
      if (filters.unit !== 'ALL') result = result.filter(m => m.unit === filters.unit);
      if (filters.role !== 'ALL') result = result.filter(m => m.role === filters.role);
      return result;
  }, [members, searchTerm, filters, sortConfig]);

  const stats = useMemo(() => {
      const dataset = processedMembers; 
      const total = dataset.length;
      const scouts = dataset.filter(m => m.role === MemberRole.SCOUT).length;
      const leaders = dataset.filter(m => m.role === MemberRole.LEADER).length;
      const honorary = dataset.filter(m => m.role === MemberRole.HONORARY).length;
      const males = dataset.filter(m => m.gender === 'ذكر').length;
      const females = dataset.filter(m => m.gender === 'أنثى').length;
      const insurancePaidCount = dataset.filter(m => m.insurancePaid).length;
      const subscriptionPaidCount = dataset.filter(m => m.subscriptionPaid).length;
      const unpaidCount = total - subscriptionPaidCount; 
      return { total, scouts, leaders, honorary, males, females, insurancePaidCount, subscriptionPaidCount, unpaidCount };
  }, [processedMembers]);

  const totalPages = Math.ceil(processedMembers.length / itemsPerPage);
  const currentMembers = processedMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Member | 'age') => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const handleAnalyticsClick = (filterUpdate: Partial<typeof filters>) => {
      setFilters(prev => ({ ...prev, ...filterUpdate }));
      setCurrentPage(1);
  };

  const handleExport = () => { console.log('Exporting...'); };

  const handleInputChange = (field: keyof Member, value: any) => {
    const newData = { ...formData, [field]: value };
    if (field === 'birthDate') newData.age = getAge(value);
    setFormData(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) onUpdateMember(formData as Member);
    else onAddMember({ ...formData, id: Date.now().toString(), isActive: formData.scoutStatus === 'نشط' } as Member);
    setViewMode('TABLE');
  };

  const handleViewMember = (member: Member) => {
      setSelectedMember(member);
      setSelectedMemberTab('OVERVIEW');
  };

  // --- Form Content Renderer ---
  const renderFormContent = () => {
    switch(formTab) {
        case 0: // الشخصية
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <InputWrapper label="الاسم الكامل (بالعربية)" required>
                        <TextInput field="fullName" placeholder="اللقب + الاسم" required value={formData.fullName} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="الاسم الكامل (باللاتينية)">
                        <TextInput field="fullNameEn" placeholder="Full Name in Latin" value={formData.fullNameEn} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="الجنس" required>
                        <CustomDropdown options={['ذكر', 'أنثى']} value={formData.gender} onChange={(v:any) => handleInputChange('gender', v)} />
                    </InputWrapper>
                    <InputWrapper label="تاريخ الميلاد" required>
                        <TextInput field="birthDate" type="date" required value={formData.birthDate} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="مكان الميلاد">
                        <TextInput field="birthPlace" placeholder="مكان الميلاد" value={formData.birthPlace} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="فصيلة الدم">
                        <CustomDropdown options={BLOOD_TYPES} value={formData.bloodType} onChange={(v:any) => handleInputChange('bloodType', v)} />
                    </InputWrapper>
                    <InputWrapper label="الولاية">
                        <CustomDropdown options={ALGERIA_WILAYAS} value={formData.address} onChange={(v:any) => handleInputChange('address', v)} />
                    </InputWrapper>
                    <InputWrapper label="العنوان بالتفصيل">
                        <TextInput field="addressDetail" placeholder="رقم الباب، الشارع..." value={formData.addressDetail} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="رقم الهاتف">
                        <TextInput field="phone" placeholder="0XXXXXXX" type="tel" value={formData.phone} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="البريد الإلكتروني">
                        <TextInput field="email" placeholder="example@mail.com" type="email" value={formData.email} onChange={handleInputChange} />
                    </InputWrapper>
                </div>
            );
        case 1: // العائلية
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <InputWrapper label="اسم الولي">
                        <TextInput field="guardianName" placeholder="الاسم الكامل للولي" value={formData.guardianName} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="صلة القرابة">
                        <CustomDropdown options={RELATIONSHIPS} value={formData.guardianRelation} onChange={(v:any) => handleInputChange('guardianRelation', v)} />
                    </InputWrapper>
                    <InputWrapper label="هاتف الولي">
                        <TextInput field="guardianPhone" placeholder="0XXXXXXX" type="tel" value={formData.guardianPhone} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="وظيفة الولي">
                        <TextInput field="guardianJob" placeholder="وظيفة الولي" value={formData.guardianJob} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="اسم الأم">
                        <TextInput field="motherName" placeholder="الاسم واللقب" value={formData.motherName} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="وظيفة الأم">
                        <TextInput field="motherJob" placeholder="وظيفة الأم" value={formData.motherJob} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="عدد الإخوة">
                        <input type="number" className="w-full h-12 bg-night-900 border border-white/10 rounded-xl px-4 text-white outline-none" value={formData.siblingsCount || 0} onChange={(e)=>handleInputChange('siblingsCount', parseInt(e.target.value))} />
                    </InputWrapper>
                    <InputWrapper label="الترتيب بين الإخوة">
                        <CustomDropdown options={BIRTH_ORDER_LABELS} value={formData.birthOrderLabel} onChange={(v:any) => handleInputChange('birthOrderLabel', v)} />
                    </InputWrapper>
                    <InputWrapper label="الحالة العائلية">
                        <CustomDropdown options={FAMILY_STATUS_OPTIONS} value={formData.familyStatus} onChange={(v:any) => handleInputChange('familyStatus', v)} />
                    </InputWrapper>
                    <div className="flex items-center gap-4 h-12 mt-8">
                        <label className="flex items-center gap-2 cursor-pointer text-white font-bold">
                            <input type="checkbox" className="w-5 h-5 rounded accent-primary-500" checked={formData.isOrphan} onChange={(e)=>handleInputChange('isOrphan', e.target.checked)} />
                            هل العضو يتيم؟
                        </label>
                    </div>
                </div>
            );
        case 2: // الكشفية
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <InputWrapper label="الصفة" required>
                        <CustomDropdown options={ROLES_LIST} value={formData.role} onChange={(v:any) => handleInputChange('role', v)} />
                    </InputWrapper>
                    <InputWrapper label="الوحدة الكشفية">
                        <CustomDropdown options={UNITS_LIST} value={formData.unit} onChange={(v:any) => handleInputChange('unit', v)} />
                    </InputWrapper>
                    <InputWrapper label="المهمة الكشفية">
                        <CustomDropdown 
                            options={formData.role === MemberRole.LEADER ? SCOUT_MISSIONS_LEADER : SCOUT_MISSIONS_SCOUT} 
                            value={formData.scoutMission} 
                            onChange={(v:any) => handleInputChange('scoutMission', v)} 
                        />
                    </InputWrapper>
                    <InputWrapper label="الرتبة">
                        <CustomDropdown 
                            options={(formData.unit?.includes('أشبال') || formData.unit?.includes('زهرات')) ? RANKS_SMALL_UNITS : RANKS_LARGE_UNITS} 
                            value={formData.rank} 
                            onChange={(v:any) => handleInputChange('rank', v)} 
                        />
                    </InputWrapper>
                    <InputWrapper label="رقم العضوية">
                        <TextInput field="membershipNumber" value={formData.membershipNumber} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="رقم التأمين">
                        <TextInput field="insuranceNumber" value={formData.insuranceNumber} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="تاريخ الانخراط">
                        <TextInput field="joinDate" type="date" value={formData.joinDate} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="حالة الانخراط">
                        <CustomDropdown options={['نشط', 'غير نشط', 'معلق']} value={formData.scoutStatus} onChange={(v:any) => handleInputChange('scoutStatus', v)} />
                    </InputWrapper>
                </div>
            );
        case 3: // الدراسية
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <InputWrapper label="المستوى الدراسي">
                        <CustomDropdown options={EDUCATIONAL_LEVELS} value={formData.educationLevel} onChange={(v:any) => handleInputChange('educationLevel', v)} />
                    </InputWrapper>
                    <InputWrapper label="المؤسسة التعليمية">
                        <TextInput field="institution" placeholder="اسم المدرسة/الجامعة" value={formData.institution} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="التخصص">
                        <TextInput field="specialty" placeholder="التخصص الدراسي" value={formData.specialty} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="الحالة الدراسية">
                        <CustomDropdown options={['يزاول', 'متخرج', 'منقطع']} value={formData.studyStatus} onChange={(v:any) => handleInputChange('studyStatus', v)} />
                    </InputWrapper>
                    <InputWrapper label="القسم/السنة">
                        <TextInput field="classSection" placeholder="مثال: سنة ثالثة" value={formData.classSection} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="سنة التخرج/الانقطاع">
                        <TextInput field="graduationYear" placeholder="YYYY" value={formData.graduationYear} onChange={handleInputChange} />
                    </InputWrapper>
                </div>
            );
        case 4: // الصحية
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <InputWrapper label="الحالة الصحية العامة">
                        <CustomDropdown options={HEALTH_STATUS_OPTIONS} value={formData.healthStatus} onChange={(v:any) => handleInputChange('healthStatus', v)} />
                    </InputWrapper>
                    <InputWrapper label="رقم اتصال الطوارئ">
                        <TextInput field="emergencyContact" placeholder="0XXXXXXX" type="tel" value={formData.emergencyContact} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="الأمراض المزمنة">
                        <textarea className="w-full h-24 bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={formData.chronicDiseases || ''} onChange={(e)=>handleInputChange('chronicDiseases', e.target.value)} placeholder="اذكر الأمراض إن وجدت..." />
                    </InputWrapper>
                    <InputWrapper label="الحساسية">
                        <textarea className="w-full h-24 bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={formData.allergies || ''} onChange={(e)=>handleInputChange('allergies', e.target.value)} placeholder="اذكر أنواع الحساسية إن وجدت..." />
                    </InputWrapper>
                    <InputWrapper label="اللقاحات">
                        <TextInput field="vaccines" placeholder="اللقاحات المستلمة" value={formData.vaccines} onChange={handleInputChange} />
                    </InputWrapper>
                    <InputWrapper label="نوع الإعاقة">
                        <TextInput field="disabilityType" placeholder="اترك فارغاً إن لم يوجد" value={formData.disabilityType} onChange={handleInputChange} />
                    </InputWrapper>
                </div>
            );
        case 5: // الاجتماعية
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <InputWrapper label="الوضعية المالية للعائلة">
                        <CustomDropdown options={FINANCIAL_STATUS} value={formData.financialStatus} onChange={(v:any) => handleInputChange('financialStatus', v)} />
                    </InputWrapper>
                    <InputWrapper label="نوع السكن">
                        <CustomDropdown options={['ملكية', 'إيجار', 'وظيفي', 'آخر']} value={formData.housingType} onChange={(v:any) => handleInputChange('housingType', v)} />
                    </InputWrapper>
                    <InputWrapper label="عدد أفراد الأسرة">
                        <input type="number" className="w-full h-12 bg-night-900 border border-white/10 rounded-xl px-4 text-white outline-none" value={formData.familyMembersCount || 0} onChange={(e)=>handleInputChange('familyMembersCount', parseInt(e.target.value))} />
                    </InputWrapper>
                    <InputWrapper label="عدد الغرف">
                        <input type="number" className="w-full h-12 bg-night-900 border border-white/10 rounded-xl px-4 text-white outline-none" value={formData.roomCount || 0} onChange={(e)=>handleInputChange('roomCount', parseInt(e.target.value))} />
                    </InputWrapper>
                    <div className="md:col-span-2">
                        <InputWrapper label="حالات اجتماعية خاصة">
                            <textarea className="w-full h-24 bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={formData.specialSocialCases || ''} onChange={(e)=>handleInputChange('specialSocialCases', e.target.value)} placeholder="مثال: منحة اجتماعية، دعم خاص..." />
                        </InputWrapper>
                    </div>
                </div>
            );
        case 6: // المالية
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-night-900/50 p-6 rounded-2xl border border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-6 h-6 accent-emerald-500 rounded" checked={formData.insurancePaid} onChange={(e)=>handleInputChange('insurancePaid', e.target.checked)} />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold">دفع مستحقات التأمين السنوي</span>
                                    <span className="text-xs text-night-400">تحويل الرسوم للمحافظة الولائية</span>
                                </div>
                            </label>
                            {formData.insurancePaid && <ShieldCheck className="text-emerald-500" size={24}/>}
                        </div>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-6 h-6 accent-emerald-500 rounded" checked={formData.subscriptionPaid} onChange={(e)=>handleInputChange('subscriptionPaid', e.target.checked)} />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold">دفع الاشتراك الشهري/السنوي للفوج</span>
                                    <span className="text-xs text-night-400">المساهمة في صندوق الوحدة</span>
                                </div>
                            </label>
                            {formData.subscriptionPaid && <Wallet className="text-emerald-500" size={24}/>}
                        </div>
                    </div>
                    <InputWrapper label="ملاحظات مالية">
                        <textarea className="w-full h-32 bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none font-sans" value={formData.financialNotes || ''} onChange={(e)=>handleInputChange('financialNotes', e.target.value)} placeholder="أي ملاحظات إضافية بخصوص الرسوم..." />
                    </InputWrapper>
                </div>
            );
        case 7: // النشاطات
            return (
                <div className="space-y-6 animate-fade-in">
                    <InputWrapper label="تاريخ الدورات التدريبية">
                        <textarea className="w-full h-24 bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={formData.trainingHistory || ''} onChange={(e)=>handleInputChange('trainingHistory', e.target.value)} placeholder="الدورات التي شارك فيها العضو..." />
                    </InputWrapper>
                    <InputWrapper label="المشاركات السابقة">
                        <textarea className="w-full h-24 bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={formData.participationHistory || ''} onChange={(e)=>handleInputChange('participationHistory', e.target.value)} placeholder="المخيمات، الرحلات، الأنشطة الكبرى..." />
                    </InputWrapper>
                    <InputWrapper label="نشاطات أخرى وهوايات">
                        <textarea className="w-full h-24 bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={formData.otherActivities || ''} onChange={(e)=>handleInputChange('otherActivities', e.target.value)} placeholder="هوايات، مهارات خاصة..." />
                    </InputWrapper>
                </div>
            );
        default:
            return null;
    }
  };

  // --- DETAIL VIEW MODAL ---
  const renderDetailModal = () => {
      if (!selectedMember) return null;
      
      const assignedEquipment = equipmentList.filter(item => item.assignedTo === selectedMember.id);

      const InfoField = ({ label, value, icon: Icon, colorClass = "text-night-400" }: any) => (
          <div className="flex items-center gap-3 p-3 bg-night-900/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              {Icon && <div className={`p-2 rounded-lg bg-night-900 ${colorClass}`}><Icon size={16}/></div>}
              <div>
                  <span className="text-[10px] text-night-500 block font-bold uppercase tracking-wider">{label}</span>
                  <span className="text-sm text-white font-bold">{value || '-'}</span>
              </div>
          </div>
      );

      const SectionTitle = ({ title, icon: Icon, color = "text-primary-500" }: any) => (
          <h4 className={`text-sm font-black mb-4 flex items-center gap-2 border-b border-white/5 pb-2 uppercase tracking-widest ${color}`}>
              {Icon && <Icon size={18}/>}
              {title}
          </h4>
      );

      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/95 backdrop-blur-xl p-2 md:p-4 animate-fade-in overflow-hidden">
              <div className="bg-night-800 w-full max-w-6xl h-[95vh] rounded-[2.5rem] border border-white/10 shadow-2xl relative font-sans flex flex-col overflow-hidden">
                  
                  {/* النقاط والترتيب في أعلى يسار الصفحة */}
                  <div className="absolute top-6 left-6 z-20 flex gap-3 pointer-events-none">
                      <div className="px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl backdrop-blur-md flex items-center gap-3 shadow-lg">
                          <Award className="text-yellow-500" size={24}/>
                          <div>
                              <span className="text-[10px] text-yellow-500/70 block font-black uppercase">النقاط</span>
                              <span className="text-xl font-black text-white font-mono leading-none">{selectedMember.points || 0}</span>
                          </div>
                      </div>
                      <div className="px-5 py-2 bg-primary-600/10 border border-primary-500/20 rounded-2xl backdrop-blur-md flex items-center gap-3 shadow-lg">
                          <Medal className="text-primary-400" size={24}/>
                          <div>
                              <span className="text-[10px] text-primary-400/70 block font-black uppercase">الترتيب</span>
                              <span className="text-xl font-black text-white leading-none">#{selectedMember.rank || 'مبتدئ'}</span>
                          </div>
                      </div>
                  </div>

                  {/* Close Button */}
                  <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-red-500/20 rounded-full text-white transition-all z-20 border border-white/10 hover:border-red-500/50">
                      <X size={24} />
                  </button>

                  {/* Top Area: Profile Header */}
                  <div className="pt-12 pb-8 flex flex-col items-center border-b border-white/5 bg-night-900/20 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none"></div>
                      
                      <div className="relative group mb-6">
                          <div className={`absolute -inset-1.5 bg-gradient-to-tr ${selectedMember.isActive ? 'from-emerald-500 to-primary-500' : 'from-red-500 to-orange-500'} rounded-[2.5rem] blur-md opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                          <img src={selectedMember.image} className="relative w-40 h-40 rounded-[2.2rem] object-cover border-4 border-night-800 shadow-2xl" alt={selectedMember.fullName} />
                          <div className={`absolute -bottom-2 -right-2 px-4 py-1 rounded-xl border-2 border-night-800 text-[10px] font-black uppercase tracking-widest shadow-lg ${selectedMember.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                              {selectedMember.isActive ? 'نشط' : 'مجمد'}
                          </div>
                      </div>

                      <div className="text-center space-y-1 relative z-10">
                          <h3 className="text-4xl font-black text-white tracking-tight">{selectedMember.fullName}</h3>
                          <p className="text-xl text-night-400 font-mono font-medium tracking-wide opacity-80" dir="ltr">{selectedMember.fullNameEn || selectedMember.fullName}</p>
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                              <span className="bg-primary-600/20 text-primary-400 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-primary-500/20">{selectedMember.role}</span>
                              <span className="bg-white/5 text-night-300 px-4 py-1.5 rounded-xl text-xs font-bold border border-white/5">{selectedMember.unit}</span>
                              <div className="h-4 w-px bg-white/10 mx-1"></div>
                              <span className="text-xs text-night-500 font-mono">رقم العضوية: <b className="text-white">{selectedMember.membershipNumber}</b></span>
                              <span className="text-xs text-night-500 font-mono">رقم التأمين: <b className="text-white">{selectedMember.insuranceNumber}</b></span>
                          </div>
                      </div>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="flex bg-night-900/30 px-6 overflow-x-auto no-scrollbar border-b border-white/5 shrink-0">
                      {[
                          {id: 'OVERVIEW', label: 'الرئيسية', icon: LayoutGrid},
                          {id: 'PERSONAL', label: 'الشخصية', icon: User},
                          {id: 'FAMILY', label: 'العائلية', icon: Users},
                          {id: 'ACADEMIC', label: 'الدراسية', icon: GraduationCap},
                          {id: 'HEALTH', label: 'الصحية', icon: Activity},
                          {id: 'SOCIAL', label: 'الاجتماعية', icon: Heart},
                          {id: 'ACTIVITIES', label: 'النشاطات', icon: Star},
                          {id: 'FINANCE', label: 'المالية', icon: DollarSign},
                          {id: 'EQUIPMENT', label: 'العهدة', icon: Box},
                      ].map((tab) => (
                          <button
                              key={tab.id}
                              onClick={() => setSelectedMemberTab(tab.id)}
                              className={`flex items-center gap-2 px-6 py-5 text-sm font-black whitespace-nowrap transition-all border-b-4 ${selectedMemberTab === tab.id ? 'border-primary-500 text-white bg-primary-500/5' : 'border-transparent text-night-500 hover:text-white hover:bg-white/5'}`}
                          >
                              <tab.icon size={18} className={selectedMemberTab === tab.id ? 'text-primary-400' : ''} />
                              {tab.label}
                          </button>
                      ))}
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-night-900/10">
                      
                      {/* 1. OVERVIEW TAB */}
                      {selectedMemberTab === 'OVERVIEW' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                              <div className="space-y-6">
                                  <div className="bg-night-800/40 p-6 rounded-3xl border border-white/5 shadow-xl">
                                      <SectionTitle title="المعلومات الأساسية" icon={Info} color="text-blue-500"/>
                                      <div className="space-y-3">
                                          <InfoField label="تاريخ الميلاد" value={`${selectedMember.birthDate} (${selectedMember.age} سنة)`} icon={Calendar} colorClass="text-blue-500" />
                                          <InfoField label="مكان الميلاد" value={selectedMember.birthPlace} icon={MapPin} colorClass="text-blue-500" />
                                          <InfoField label="فصيلة الدم" value={selectedMember.bloodType} icon={Heart} colorClass="text-red-500" />
                                          <InfoField label="الجنس" value={selectedMember.gender} icon={User} colorClass="text-blue-500" />
                                      </div>
                                  </div>

                                  <div className="bg-night-800/40 p-6 rounded-3xl border border-white/5 shadow-xl">
                                      <SectionTitle title="معلومات الاتصال" icon={Smartphone} color="text-emerald-500"/>
                                      <div className="space-y-3">
                                          <InfoField label="رقم الهاتف" value={selectedMember.phone} icon={Smartphone} colorClass="text-emerald-500" />
                                          <InfoField label="البريد الإلكتروني" value={selectedMember.email} icon={Mail} colorClass="text-emerald-500" />
                                          <InfoField label="العنوان" value={selectedMember.address} icon={MapPin} colorClass="text-emerald-500" />
                                      </div>
                                  </div>
                              </div>

                              <div className="space-y-6">
                                  <div className="bg-night-800/40 p-6 rounded-3xl border border-white/5 shadow-xl">
                                      <SectionTitle title="المعلومات الكشفية" icon={Tent} color="text-primary-500"/>
                                      <div className="space-y-3">
                                          <InfoField label="الوحدة" value={selectedMember.unit} icon={Shield} colorClass="text-primary-500" />
                                          <InfoField label="الطليعة / السداسية" value={selectedMember.patrol} icon={Flag} colorClass="text-primary-500" />
                                          <InfoField label="المهمة" value={selectedMember.scoutMission} icon={Award} colorClass="text-primary-500" />
                                          <InfoField label="سنة الانخراط" value={selectedMember.joinDate} icon={Clock} colorClass="text-primary-500" />
                                      </div>
                                  </div>
                                  
                                  <div className="bg-night-800/40 p-6 rounded-3xl border border-white/5 shadow-xl">
                                      <SectionTitle title="المعلومات المالية" icon={DollarSign} color="text-yellow-500"/>
                                      <div className="space-y-3">
                                          <InfoField label="التأمين السنوي" value={selectedMember.insurancePaid ? 'تم الدفع' : 'غير مدفوع'} icon={ShieldCheck} colorClass={selectedMember.insurancePaid ? 'text-emerald-500' : 'text-red-500'} />
                                          <InfoField label="الاشتراك السنوي" value={selectedMember.subscriptionPaid ? 'تم الدفع' : 'غير مدفوع'} icon={Receipt} colorClass={selectedMember.subscriptionPaid ? 'text-emerald-500' : 'text-red-500'} />
                                      </div>
                                  </div>
                              </div>

                              <div className="space-y-6">
                                  <div className="bg-night-800/40 p-6 rounded-3xl border border-white/5 shadow-xl">
                                      <SectionTitle title="معلومات انضباطية" icon={Gavel} color="text-red-500"/>
                                      <div className="bg-night-900/50 p-6 rounded-2xl text-center border border-white/5">
                                          <p className="text-xs text-night-500 mb-2 uppercase font-black">نسبة الحضور العامة</p>
                                          <div className="text-4xl font-black text-white font-mono mb-2">92%</div>
                                          <div className="w-full bg-night-800 h-2 rounded-full overflow-hidden">
                                              <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{width: '92%'}}></div>
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3 mt-4">
                                          <div className="p-3 bg-night-900 rounded-xl text-center">
                                              <span className="text-[10px] text-night-500 block uppercase font-bold">عقوبات</span>
                                              <span className="text-lg font-bold text-red-500">0</span>
                                          </div>
                                          <div className="p-3 bg-night-900 rounded-xl text-center">
                                              <span className="text-[10px] text-night-500 block uppercase font-bold">تأخرات</span>
                                              <span className="text-lg font-bold text-yellow-500">2</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* 2. PERSONAL TAB */}
                      {selectedMemberTab === 'PERSONAL' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                              <InfoField label="تاريخ الميلاد" value={selectedMember.birthDate} icon={Calendar} colorClass="text-blue-500" />
                              <InfoField label="مكان الميلاد" value={selectedMember.birthPlace} icon={MapPin} colorClass="text-blue-500" />
                              <InfoField label="العمر" value={`${selectedMember.age} سنة`} icon={User} colorClass="text-blue-500" />
                              <InfoField label="الجنس" value={selectedMember.gender} icon={Users} colorClass="text-blue-500" />
                              <InfoField label="فصيلة الدم" value={selectedMember.bloodType} icon={Heart} colorClass="text-red-500" />
                              <InfoField label="الولاية" value={selectedMember.address} icon={Globe} colorClass="text-emerald-500" />
                              <div className="md:col-span-2 lg:col-span-3">
                                  <InfoField label="العنوان بالتفصيل" value={selectedMember.addressDetail} icon={MapPin} colorClass="text-emerald-500" />
                              </div>
                          </div>
                      )}

                      {/* 3. FAMILY TAB */}
                      {selectedMemberTab === 'FAMILY' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                              <InfoField label="اسم الولي" value={selectedMember.guardianName} icon={User} colorClass="text-primary-500" />
                              <InfoField label="صلة القرابة" value={selectedMember.guardianRelation} icon={Heart} colorClass="text-primary-500" />
                              <InfoField label="هاتف الولي" value={selectedMember.guardianPhone} icon={Smartphone} colorClass="text-primary-500" />
                              <InfoField label="وظيفة الولي" value={selectedMember.guardianJob} icon={Briefcase} colorClass="text-primary-500" />
                              <InfoField label="اسم الأم" value={selectedMember.motherName} icon={User} colorClass="text-pink-500" />
                              <InfoField label="وظيفة الأم" value={selectedMember.motherJob} icon={Briefcase} colorClass="text-pink-500" />
                              <InfoField label="عدد الإخوة" value={selectedMember.siblingsCount} icon={Users} colorClass="text-blue-500" />
                              <InfoField label="الترتيب بين الإخوة" value={selectedMember.birthOrder} icon={Star} colorClass="text-blue-500" />
                              <InfoField label="الحالة العائلية" value={selectedMember.familyStatus} icon={Home} colorClass="text-orange-500" />
                              <InfoField label="يتيم؟" value={selectedMember.isOrphan ? 'نعم' : 'لا'} icon={AlertCircle} colorClass="text-red-500" />
                              <InfoField label="أبناء في الكشافة" value={selectedMember.scoutChildren} icon={Tent} colorClass="text-primary-400" />
                              <InfoField label="أبناء متمدرسون" value={selectedMember.schoolingChildren} icon={GraduationCap} colorClass="text-blue-400" />
                          </div>
                      )}

                      {/* 4. ACADEMIC TAB */}
                      {selectedMemberTab === 'ACADEMIC' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                              <InfoField label="المستوى الدراسي" value={selectedMember.educationLevel} icon={GraduationCap} colorClass="text-blue-500" />
                              <InfoField label="المؤسسة التعليمية" value={selectedMember.institution} icon={Building} colorClass="text-blue-500" />
                              <InfoField label="حالة الدراسة" value={selectedMember.studyStatus} icon={BookOpen} colorClass="text-blue-500" />
                              <InfoField label="التخصص" value={selectedMember.specialty} icon={Award} colorClass="text-blue-500" />
                              <InfoField label="القسم" value={selectedMember.classSection} icon={Layers} colorClass="text-blue-500" />
                              <InfoField label="سنة التخرج" value={selectedMember.graduationYear} icon={Calendar} colorClass="text-blue-500" />
                              <InfoField label="سنة الانقطاع" value={selectedMember.stopYear} icon={X} colorClass="text-red-500" />
                          </div>
                      )}

                      {/* 5. HEALTH TAB */}
                      {selectedMemberTab === 'HEALTH' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                              <InfoField label="الحالة الصحية العامة" value={selectedMember.healthStatus} icon={Activity} colorClass="text-emerald-500" />
                              <InfoField label="الأمراض المزمنة" value={selectedMember.chronicDiseases} icon={Heart} colorClass="text-red-500" />
                              <InfoField label="الحساسية" value={selectedMember.allergies} icon={AlertTriangle} colorClass="text-orange-500" />
                              <InfoField label="اللقاحات" value={selectedMember.vaccines} icon={ShieldCheck} colorClass="text-blue-500" />
                              <InfoField label="رقم اتصال الطوارئ" value={selectedMember.emergencyContact} icon={Phone} colorClass="text-emerald-500" />
                              <InfoField label="نوع الإعاقة (إن وجد)" value={selectedMember.disabilityType} icon={AlertCircle} colorClass="text-red-500" />
                              <div className="md:col-span-2 lg:col-span-3">
                                  <InfoField label="ملاحظات صحية" value={selectedMember.healthNotes} icon={FileText} colorClass="text-night-500" />
                              </div>
                          </div>
                      )}

                      {/* 6. SOCIAL TAB */}
                      {selectedMemberTab === 'SOCIAL' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                              <InfoField label="الوضعية المالية للعائلة" value={selectedMember.financialStatus} icon={Coins} colorClass="text-yellow-500" />
                              <InfoField label="نوع السكن" value={selectedMember.housingType} icon={Home} colorClass="text-blue-500" />
                              <InfoField label="البيئة السكنية" value={selectedMember.livingEnvironment} icon={Globe} colorClass="text-blue-500" />
                              <InfoField label="عدد أفراد الأسرة" value={selectedMember.familyMembersCount} icon={Users} colorClass="text-blue-500" />
                              <InfoField label="عدد الغرف" value={selectedMember.roomCount} icon={Layers} colorClass="text-blue-500" />
                              <InfoField label="الحالات الاجتماعية الخاصة" value={selectedMember.specialSocialCases} icon={Heart} colorClass="text-red-500" />
                              <div className="md:col-span-2 lg:col-span-3">
                                  <InfoField label="ملاحظات اجتماعية" value={selectedMember.socialNotes} icon={FileText} colorClass="text-night-500" />
                              </div>
                          </div>
                      )}

                      {/* 7. ACTIVITIES TAB */}
                      {selectedMemberTab === 'ACTIVITIES' && (
                          <div className="space-y-6 animate-fade-in">
                              <InfoField label="تاريخ الدورات التدريبية" value={selectedMember.trainingHistory} icon={PenTool} colorClass="text-purple-500" />
                              <InfoField label="المشاركات السابقة" value={selectedMember.participationHistory} icon={Flag} colorClass="text-purple-500" />
                              <InfoField label="نشاطات أخرى" value={selectedMember.otherActivities} icon={Star} colorClass="text-purple-500" />
                          </div>
                      )}

                      {/* 8. FINANCE TAB */}
                      {selectedMemberTab === 'FINANCE' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                              <div className={`p-6 rounded-3xl border flex items-center justify-between shadow-xl ${selectedMember.insurancePaid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                  <div className="flex items-center gap-4">
                                      <div className={`p-3 rounded-2xl bg-night-900 ${selectedMember.insurancePaid ? 'text-emerald-500' : 'text-red-500'}`}><ShieldCheck size={28}/></div>
                                      <div>
                                          <h5 className="font-black text-white">التأمين السنوي</h5>
                                          <p className="text-xs text-night-400">تحويل الرسوم للمحافظة الولائية</p>
                                      </div>
                                  </div>
                                  <div className={`text-sm font-black px-4 py-1.5 rounded-xl ${selectedMember.insurancePaid ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                      {selectedMember.insurancePaid ? 'تم الدفع' : 'غير مدفوع'}
                                  </div>
                              </div>
                              <div className={`p-6 rounded-3xl border flex items-center justify-between shadow-xl ${selectedMember.subscriptionPaid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                  <div className="flex items-center gap-4">
                                      <div className={`p-3 rounded-2xl bg-night-900 ${selectedMember.subscriptionPaid ? 'text-emerald-500' : 'text-red-500'}`}><Wallet size={28}/></div>
                                      <div>
                                          <h5 className="font-black text-white">الاشتراك السنوي</h5>
                                          <p className="text-xs text-night-400">اشتراك العضوية في الفوج</p>
                                      </div>
                                  </div>
                                  <div className={`text-sm font-black px-4 py-1.5 rounded-xl ${selectedMember.subscriptionPaid ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                      {selectedMember.subscriptionPaid ? 'تم الدفع' : 'غير مدفوع'}
                                  </div>
                              </div>
                              <div className="md:col-span-2">
                                  <InfoField label="ملاحظات مالية" value={selectedMember.financialNotes} icon={FileText} colorClass="text-yellow-500" />
                              </div>
                          </div>
                      )}

                      {/* 9. EQUIPMENT TAB */}
                      {selectedMemberTab === 'EQUIPMENT' && (
                          <div className="space-y-4 animate-fade-in">
                              {assignedEquipment.length > 0 ? (
                                  assignedEquipment.map(item => (
                                      <div key={item.id} className="bg-night-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                              <div className={`p-2 rounded-lg ${item.category === 'لباس' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                  {item.category === 'لباس' ? <Shirt size={20}/> : <Box size={20}/>}
                                              </div>
                                              <div>
                                                  <p className="text-white font-bold">{item.name}</p>
                                                  <p className="text-xs text-night-400 font-mono">{item.uniqueId}</p>
                                              </div>
                                          </div>
                                          <div className="text-right">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${item.deliveryType === 'دائم' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                  {item.deliveryType === 'دائم' ? 'تسليم دائم' : 'إعارة مؤقتة'}
                                              </span>
                                              {item.returnDate && <p className="text-xs text-red-400 mt-1">إرجاع: {item.returnDate}</p>}
                                          </div>
                                      </div>
                                  ))
                              ) : (
                                  <div className="text-center py-8 text-night-500 bg-night-900/30 rounded-xl border border-white/5 border-dashed">
                                      <Box size={40} className="mx-auto mb-2 opacity-50"/>
                                      <p>لا توجد عهدة مسجلة لهذا العضو</p>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  // Main Render - TABLE VIEW
  if (viewMode === 'TABLE') {
      return (
          <div className="p-4 md:p-8 h-full flex flex-col animate-fade-in font-sans relative">
              {renderDetailModal()}

              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div>
                      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                          <Users size={32} className="text-primary-500" />
                          إدارة الأعضاء
                      </h2>
                      <p className="text-night-400 font-sans">قاعدة بيانات الفوج، التسجيلات، والمتابعة الشخصية.</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handleExport} className="flex-1 md:flex-initial bg-night-800 text-night-300 hover:text-white px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-sans text-sm">
                          <Download size={18} /> تصدير
                      </button>
                      <button 
                          onClick={() => { setFormData(initialFormState); setFormTab(0); setViewMode('FORM'); }}
                          className="flex-1 md:flex-initial bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl shadow-lg shadow-primary-900/40 transition-all flex items-center justify-center gap-2 font-bold font-sans text-sm"
                      >
                          <UserPlus size={20} /> تسجيل جديد
                      </button>
                  </div>
              </div>

              {/* Analytics Bar */}
              <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-primary-500/50 transition-all shadow-lg" onClick={() => handleAnalyticsClick({ role: 'ALL', unit: 'ALL' })}>
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">إجمالي الأعضاء</p>
                          <p className="text-2xl font-bold text-white font-sans">{stats.total}</p>
                      </div>
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-emerald-500/50 transition-all shadow-lg" onClick={() => handleAnalyticsClick({ role: MemberRole.SCOUT })}>
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">الكشافين</p>
                          <p className="text-2xl font-bold text-emerald-400 font-sans">{stats.scouts}</p>
                      </div>
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-blue-500/50 transition-all shadow-lg" onClick={() => handleAnalyticsClick({ role: MemberRole.LEADER })}>
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">القادة</p>
                          <p className="text-2xl font-bold text-blue-400 font-sans">{stats.leaders}</p>
                      </div>
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-purple-500/50 transition-all shadow-lg" onClick={() => handleAnalyticsClick({ role: MemberRole.HONORARY })}>
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">أعضاء شرفيين</p>
                          <p className="text-2xl font-bold text-purple-400 font-sans">{stats.honorary}</p>
                      </div>
                      {/* New Stats Row 2 */}
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-blue-400/50 transition-all shadow-lg">
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">ذكور</p>
                          <p className="text-2xl font-bold text-blue-400 font-sans">{stats.males}</p>
                      </div>
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-pink-400/50 transition-all shadow-lg">
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">إناث</p>
                          <p className="text-2xl font-bold text-pink-400 font-sans">{stats.females}</p>
                      </div>
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-yellow-400/50 transition-all shadow-lg">
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">دفع التأمينات</p>
                          <p className="text-2xl font-bold text-yellow-400 font-sans">{stats.insurancePaidCount}</p>
                      </div>
                      <div className="bg-night-800 p-4 rounded-xl border border-white/5 text-center cursor-pointer hover:border-emerald-400/50 transition-all shadow-lg">
                          <p className="text-xs text-night-400 font-sans font-bold mb-1">دفع الإشتراكات</p>
                          <p className="text-2xl font-bold text-emerald-400 font-sans">{stats.subscriptionPaidCount}</p>
                      </div>
                  </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 bg-night-800/50 p-4 rounded-2xl border border-white/5 font-sans">
                  <div className="flex-1 relative">
                      <input 
                          type="text" 
                          placeholder="بحث بالاسم، الرقم، أو الوحدة..." 
                          className="w-full bg-night-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary-500 outline-none font-sans"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-3 top-3.5 text-night-400" size={18} />
                  </div>
                  
                  <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all font-sans ${showFilters ? 'bg-primary-600 border-primary-500 text-white' : 'bg-night-900 border-white/10 text-night-300 hover:text-white'}`}
                  >
                      <Filter size={18} /> تصفية متقدمة
                  </button>
              </div>

              {/* Members Table */}
              <div className="flex-1 bg-night-800/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col font-sans">
                  <div className="overflow-x-auto">
                      <table className="w-full text-right min-w-[800px]">
                          <thead className="bg-night-900 text-night-300 text-xs uppercase font-bold tracking-wider">
                              <tr>
                                  <th className="p-4 cursor-pointer hover:text-white select-none text-right">الإسم الكامل</th>
                                  <th className="p-4 cursor-pointer hover:text-white select-none text-right">رقم التأمين</th>
                                  <th className="p-4 cursor-pointer hover:text-white select-none text-right">الوحدة / الصفة</th>
                                  <th className="p-4 cursor-pointer hover:text-white select-none text-right">تاريخ الميلاد</th>
                                  <th className="p-4 text-center">الحالة</th>
                                  <th className="p-4 text-center">الإجراءات</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-sm">
                              {currentMembers.map(member => (
                                  <tr key={member.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleViewMember(member)}>
                                      <td className="p-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-full bg-night-700 overflow-hidden border border-white/10 group-hover:border-primary-500/50 transition-colors">
                                                  <img src={member.image} alt={member.fullName} className="w-full h-full object-cover" />
                                              </div>
                                              <div>
                                                  <p className="font-bold text-white font-sans">{member.fullName}</p>
                                                  <p className="text-xs text-night-400 font-sans">{member.membershipNumber || '-'}</p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="p-4 text-night-300 font-sans font-bold">
                                          {member.insuranceNumber}
                                      </td>
                                      <td className="p-4">
                                          <div className="flex flex-col">
                                              <span className="text-white">{member.unit}</span>
                                              <span className="text-xs text-night-400">{member.role} {member.scoutMission ? `• ${member.scoutMission}` : ''}</span>
                                          </div>
                                      </td>
                                      <td className="p-4 text-night-300 font-sans">
                                          {member.birthDate}
                                      </td>
                                      <td className="p-4 text-center">
                                          <span className={`px-2 py-1 rounded-full text-xs font-bold font-sans ${member.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                              {member.isActive ? 'نشط' : 'مجمد'}
                                          </span>
                                      </td>
                                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                          <div className="flex items-center justify-center gap-2">
                                              <button onClick={() => handleViewMember(member)} className="p-2 bg-night-900 rounded-lg text-night-300 hover:text-blue-400 transition-colors" title="معاينة"><Eye size={16}/></button>
                                              <button onClick={() => { setFormData(member); setViewMode('FORM'); }} className="p-2 bg-night-900 rounded-lg text-night-300 hover:text-primary-400 transition-colors" title="تعديل"><Edit size={16}/></button>
                                              <button onClick={() => onDeleteMember(member.id)} className="p-2 bg-night-900 rounded-lg text-night-300 hover:text-red-400 transition-colors" title="حذف"><Trash2 size={16}/></button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  
                  <div className="p-4 border-t border-white/5 flex justify-between items-center bg-night-900/50 mt-auto">
                      <span className="text-xs text-night-400 font-sans">عرض {currentMembers.length} من {processedMembers.length}</span>
                      <div className="flex gap-2">
                          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg bg-night-800 disabled:opacity-50 hover:bg-white/5"><ChevronRight size={16}/></button>
                          <span className="px-4 py-2 bg-night-800 rounded-lg text-sm font-bold text-white font-sans">{currentPage} / {totalPages}</span>
                          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg bg-night-800 disabled:opacity-50 hover:bg-white/5"><ChevronLeft size={16}/></button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  if (viewMode === 'FORM') {
      return (
      <div className="p-4 md:p-8 h-full flex flex-col animate-fade-in max-w-5xl mx-auto w-full font-sans">
          <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setViewMode('TABLE')} className="p-3 bg-night-800 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white">
                  <ArrowRight size={20} className="rtl:rotate-180" />
              </button>
              <div>
                  <h2 className="text-3xl font-bold text-white">{formData.id ? 'تعديل بيانات عضو' : 'تسجيل عضو جديد'}</h2>
                  <p className="text-night-400">يرجى ملء كافة البيانات الضرورية بدقة.</p>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-night-800/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex overflow-x-auto border-b border-white/5 no-scrollbar bg-night-900/30">
                  {FORM_TABS.map((tab) => (
                      <button
                          key={tab.id}
                          type="button"
                          onClick={() => setFormTab(tab.id)}
                          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 font-sans ${formTab === tab.id ? 'border-primary-500 text-primary-400 bg-primary-500/5' : 'border-transparent text-night-400 hover:text-white hover:bg-white/5'}`}
                      >
                          <tab.icon size={18} /> {tab.label}
                      </button>
                  ))}
              </div>

              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  {renderFormContent()}
              </div>

              <div className="p-6 border-t border-white/10 bg-night-900/80 backdrop-blur-md flex justify-end gap-4">
                  <button type="button" onClick={() => setViewMode('TABLE')} className="px-8 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 font-bold transition-colors font-sans">إلغاء</button>
                  <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 font-bold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-105 flex items-center gap-2 font-sans">
                      <Save size={20} /> حفظ البيانات
                  </button>
              </div>
          </form>
      </div>
      );
  }

  return null;
};

export default Members;
