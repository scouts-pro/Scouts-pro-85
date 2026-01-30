
import React, { useState } from 'react';
import { 
    Settings as SettingsIcon, FileText, Globe, Users, Palette, Bell, Database, Shield, Activity, 
    Save, Upload, ChevronDown, CheckCircle2, AlertTriangle, Lock, RefreshCw, Smartphone, 
    Mail, Phone, MapPin, Building, CreditCard, Clock, HardDrive, Download, Trash2, RotateCcw,
    History, ShieldCheck, Zap, Plus
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '../constants';

// --- Reusable High-Quality Dropdown (Enforced Rule) ---
const Dropdown = ({ options, value, onChange, placeholder, icon: Icon, className, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className}`}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all ${disabled ? 'opacity-50' : ''} ${isOpen ? 'border-primary-500 ring-1 ring-primary-500/50' : ''}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-night-400" />}
                    <span className="font-medium truncate">{label || 'اختر...'}</span>
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
                                    className={`p-3 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between transition-colors ${val === value ? 'bg-primary-600/10 text-primary-400 font-bold' : ''}`}
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

// --- Toggle Switch Component ---
const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (val: boolean) => void, label?: string }) => (
    <div className="flex items-center justify-between">
        {label && <span className="text-sm font-bold text-white">{label}</span>}
        <div 
            onClick={() => onChange(!checked)}
            className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-primary-600' : 'bg-night-700'}`}
        >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
    </div>
);

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    // --- State Management ---
    
    // 1. Technical Card State
    const [techCard, setTechCard] = useState({
        groupName: 'الإشراق',
        logo: '', 
        organization: 'الكشافة الإسلامية الجزائرية',
        wilaya: 'البويرة',
        municipality: 'عين الترك',
        accreditationNumber: '123/2024',
        accreditationDate: '2024-01-15',
        groupId: 'DZ-10-256',
        foundingDate: '2015-11-01',
        slogan: 'كشاف الإشراق . تعاون . ود . أخلاق',
        hqType: 'دار شباب',
        specialty: 'مختلط',
        status: 'نشط',
        bankAccount: '00123456789012345678',
        bankName: 'بريد الجزائر',
        lastUpdate: new Date().toISOString().split('T')[0],
        phone1: '0779571205',
        phone2: '0663628154',
        fax: '026832128',
        email: 'ichraq.couts@gmail.com',
        backupEmail: ''
    });

    // 2. General Settings
    const [generalSettings, setGeneralSettings] = useState({
        appName: 'Scouts Pro',
        language: 'ar',
        timezone: 'Africa/Algiers',
        dateFormat: 'DD/MM/YYYY',
        enableBetaFeatures: false
    });

    // 3. Permissions
    const [permissions, setPermissions] = useState({
        defaultRole: 'LEADER',
        allowGuestAccess: false
    });

    // 4. Appearance
    const [appearance, setAppearance] = useState({
        theme: 'DARK',
        primaryColor: 'BLUE',
        density: 'COMFORTABLE'
    });

    // 5. Notifications
    const [notifications, setNotifications] = useState({
        systemAlerts: true,
        financeAlerts: true,
        activityAlerts: true,
        priority: 'HIGH'
    });

    // 6. Backup
    const [backup, setBackup] = useState({
        autoBackup: 'WEEKLY',
        restorePointActive: true
    });

    // 7. Security
    const [security, setSecurity] = useState({
        sessionTimeout: '30m',
        twoFactor: false,
        maxLoginAttempts: '3'
    });

    // --- Tabs Configuration ---
    const TABS = [
        { id: 0, label: 'البطاقة الفنية للفوج', icon: FileText },
        { id: 1, label: 'الإعدادات العامة', icon: Globe },
        { id: 2, label: 'المستخدمين والصلاحيات', icon: Users },
        { id: 3, label: 'المظهر والواجهة', icon: Palette },
        { id: 4, label: 'الإشعارات', icon: Bell },
        { id: 5, label: 'البيانات والنسخ', icon: Database },
        { id: 6, label: 'الأمان', icon: Shield },
        { id: 7, label: 'سجلات النظام', icon: Activity },
    ];

    // --- Handlers ---
    const handleGroupNameChange = (name: string) => {
        setTechCard(prev => ({ ...prev, groupName: name }));
        setGeneralSettings(prev => ({ ...prev, appName: name }));
    };

    // --- Renderers ---

    // Tab 1: Technical Card
    const renderTechnicalCard = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 text-center shadow-lg relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-purple-600"></div>
                    <div className="w-40 h-40 mx-auto bg-night-900 rounded-full border-4 border-white/5 flex items-center justify-center mb-6 relative group-hover:border-primary-500 transition-colors">
                        {techCard.logo ? <img src={techCard.logo} className="w-full h-full rounded-full object-cover"/> : <SettingsIcon size={48} className="text-night-600"/>}
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="text-white" size={24}/>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{techCard.groupName}</h3>
                    <p className="text-primary-400 text-sm font-mono">{techCard.groupId}</p>
                    <div className="mt-6 flex justify-center">
                        <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            {techCard.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg">
                    <h4 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2"><Building size={20} className="text-primary-500"/> البطاقة الفنية للفوج</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">اسم الفوج (اسم التطبيق)</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none" value={techCard.groupName} onChange={e => handleGroupNameChange(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">الرقم التعريفي للفوج (ID)</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-primary-500 outline-none" value={techCard.groupId} onChange={e => setTechCard({...techCard, groupId: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">المنظمة التابعة لها</label>
                            <input type="text" disabled className="w-full bg-night-900/50 border border-white/5 rounded-xl px-4 py-3 text-night-400 cursor-not-allowed" value={techCard.organization} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">المحافظة الولائية</label>
                            <Dropdown options={ALGERIA_WILAYAS} value={techCard.wilaya} onChange={(val: string) => setTechCard({...techCard, wilaya: val})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">البلدية</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none" value={techCard.municipality} onChange={e => setTechCard({...techCard, municipality: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">رقم الاعتماد</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none" value={techCard.accreditationNumber} onChange={e => setTechCard({...techCard, accreditationNumber: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">تاريخ الاعتماد</label>
                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none" value={techCard.accreditationDate} onChange={e => setTechCard({...techCard, accreditationDate: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-night-300 font-bold">شعار الفوج (نص)</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none" value={techCard.slogan} onChange={e => setTechCard({...techCard, slogan: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">طبيعة المقر</label>
                            <Dropdown options={['دار شباب', 'مقر بلدي', 'مقر خاص', 'مدرسة', 'آخر']} value={techCard.hqType} onChange={(val: string) => setTechCard({...techCard, hqType: val})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">التخصص التربوي</label>
                            <Dropdown options={['مختلط', 'ذكور فقط', 'إناث فقط']} value={techCard.specialty} onChange={(val: string) => setTechCard({...techCard, specialty: val})} />
                        </div>
                    </div>
                </div>

                <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg">
                    <h4 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2"><Phone size={20} className="text-emerald-500"/> معلومات الاتصال</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">الهاتف الرئيسي</label>
                            <input type="tel" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-primary-500 outline-none" value={techCard.phone1} onChange={e => setTechCard({...techCard, phone1: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">الهاتف الثانوي</label>
                            <input type="tel" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-primary-500 outline-none" value={techCard.phone2} onChange={e => setTechCard({...techCard, phone2: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">الفاكس</label>
                            <input type="tel" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-primary-500 outline-none" value={techCard.fax} onChange={e => setTechCard({...techCard, fax: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-night-300 font-bold">البريد الإلكتروني الرسمي</label>
                            <input type="email" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-primary-500 outline-none" value={techCard.email} onChange={e => setTechCard({...techCard, email: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-night-300 font-bold">بريد إلكتروني احتياطي</label>
                            <input type="email" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-primary-500 outline-none" value={techCard.backupEmail} onChange={e => setTechCard({...techCard, backupEmail: e.target.value})} placeholder="اختياري..." />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-night-800 to-night-900 p-6 rounded-3xl border border-white/10 shadow-lg">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CreditCard size={20} className="text-yellow-500"/> الحساب البنكي</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-night-400">اسم البنك</label>
                            <input type="text" readOnly className="w-full bg-night-950 border border-white/5 rounded-xl px-3 py-2 text-white mt-1 opacity-70" value={techCard.bankName} />
                        </div>
                        <div>
                            <label className="text-xs text-night-400">رقم الحساب (RIP/CCP)</label>
                            <input type="text" className="w-full bg-night-950 border border-white/5 rounded-xl px-3 py-2 text-white font-mono font-bold mt-1 tracking-wider" value={techCard.bankAccount} onChange={e => setTechCard({...techCard, bankAccount: e.target.value})} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Tab 2: General Settings
    const renderGeneralSettings = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in max-w-3xl mx-auto space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">إعدادات العامة للنظام</h3>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">اسم التطبيق (مرتبط باسم الفوج)</label>
                    <input type="text" disabled className="w-full bg-night-900/50 border border-white/5 rounded-xl px-4 py-3 text-white opacity-70" value={generalSettings.appName} />
                    <p className="text-xs text-night-500">يتم تحديثه تلقائياً عند تغيير اسم الفوج في البطاقة الفنية.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">اللغة الافتراضية</label>
                    <Dropdown options={[{value: 'ar', label: 'العربية'}, {value: 'fr', label: 'الفرنسية'}, {value: 'en', label: 'الإنجليزية'}]} value={generalSettings.language} onChange={(val: string) => setGeneralSettings({...generalSettings, language: val})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">المنطقة الزمنية</label>
                    <Dropdown options={['Africa/Algiers', 'UTC', 'Europe/Paris']} value={generalSettings.timezone} onChange={(val: string) => setGeneralSettings({...generalSettings, timezone: val})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">تنسيق التاريخ</label>
                    <Dropdown options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} value={generalSettings.dateFormat} onChange={(val: string) => setGeneralSettings({...generalSettings, dateFormat: val})} />
                </div>
                <div className="pt-4 border-t border-white/5">
                    <Toggle label="تفعيل الميزات التجريبية (Beta)" checked={generalSettings.enableBetaFeatures} onChange={(val) => setGeneralSettings({...generalSettings, enableBetaFeatures: val})} />
                </div>
            </div>
        </div>
    );

    // Tab 3: Users
    const renderUsers = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6">إدارة المستخدمين والصلاحيات</h3>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">الدور الافتراضي للمستخدم الجديد</label>
                    <Dropdown options={[{value: 'SCOUT', label: 'كشاف'}, {value: 'LEADER', label: 'قائد'}, {value: 'GUEST', label: 'ضيف'}]} value={permissions.defaultRole} onChange={(val: string) => setPermissions({...permissions, defaultRole: val})} />
                </div>
                <div className="pt-4 border-t border-white/5">
                    <Toggle label="السماح بدخول الضيوف (للعرض فقط)" checked={permissions.allowGuestAccess} onChange={(val) => setPermissions({...permissions, allowGuestAccess: val})} />
                </div>
                <div className="bg-night-900/50 rounded-xl p-4 border border-white/5">
                    <h4 className="text-sm font-bold text-white mb-3">الصلاحيات الحالية</h4>
                    <div className="space-y-2 text-xs text-night-400">
                        <div className="flex justify-between p-2 bg-night-950 rounded"><span>Admin</span> <span className="text-emerald-400">تحكم كامل</span></div>
                        <div className="flex justify-between p-2 bg-night-950 rounded"><span>Leader</span> <span className="text-blue-400">إضافة وتعديل (وحدته)</span></div>
                        <div className="flex justify-between p-2 bg-night-950 rounded"><span>Scout</span> <span className="text-night-500">عرض الملف الشخصي فقط</span></div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Tab 4: Appearance
    const renderAppearance = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6">تخصيص المظهر</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">النمط (Theme)</label>
                    <Dropdown options={[{value: 'DARK', label: 'داكن (مستحسن)'}, {value: 'LIGHT', label: 'فاتح'}]} value={appearance.theme} onChange={(val: string) => setAppearance({...appearance, theme: val})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">اللون الأساسي</label>
                    <Dropdown options={[{value: 'BLUE', label: 'أزرق كشفي'}, {value: 'PURPLE', label: 'بنفسجي'}, {value: 'EMERALD', label: 'زمردي'}]} value={appearance.primaryColor} onChange={(val: string) => setAppearance({...appearance, primaryColor: val})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">كثافة الواجهة</label>
                    <Dropdown options={[{value: 'COMFORTABLE', label: 'مريح'}, {value: 'COMPACT', label: 'مكثف'}]} value={appearance.density} onChange={(val: string) => setAppearance({...appearance, density: val})} />
                </div>
            </div>
        </div>
    );

    // Tab 5: Notifications
    const renderNotifications = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in max-w-3xl mx-auto space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">إعدادات الإشعارات</h3>
            <div className="bg-night-900/50 p-4 rounded-2xl border border-white/5 space-y-4">
                <Toggle label="تنبيهات النظام (تحديثات، صيانة)" checked={notifications.systemAlerts} onChange={(val) => setNotifications({...notifications, systemAlerts: val})} />
                <div className="h-px bg-white/5"></div>
                <Toggle label="تنبيهات المالية (نقص الرصيد، اشتراكات)" checked={notifications.financeAlerts} onChange={(val) => setNotifications({...notifications, financeAlerts: val})} />
                <div className="h-px bg-white/5"></div>
                <Toggle label="تنبيهات الأنشطة (اقتراب موعد، تسجيل)" checked={notifications.activityAlerts} onChange={(val) => setNotifications({...notifications, activityAlerts: val})} />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-night-300 font-bold">أولوية الإشعارات الافتراضية</label>
                <Dropdown options={[{value: 'HIGH', label: 'عالية (فوري)'}, {value: 'NORMAL', label: 'عادية'}, {value: 'LOW', label: 'منخفضة (ملخص يومي)'}]} value={notifications.priority} onChange={(val: string) => setNotifications({...notifications, priority: val})} />
            </div>
        </div>
    );

    // Tab 6: Backup (Enhanced for Restore Points)
    const renderBackup = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in max-w-4xl mx-auto space-y-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Database className="text-blue-500"/> النسخ الاحتياطي واستعادة البيانات</h3>
                    <p className="text-sm text-night-400 mt-1">إدارة نقاط استعادة النظام وحماية قاعدة البيانات.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">
                    <Plus size={18} /> إنشاء نقطة استعادة يدوية
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-white">النسخ التلقائي الذكي</h4>
                        <p className="text-xs text-blue-300 mt-1">جدولة دورية لحماية البيانات</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-400 uppercase">{backup.autoBackup}</span>
                        <Toggle checked={backup.restorePointActive} onChange={(val) => setBackup({...backup, restorePointActive: val})} />
                    </div>
                </div>
                
                <div className="bg-night-900/50 border border-white/5 p-6 rounded-2xl">
                    <label className="text-sm text-night-300 font-bold mb-2 block">تكرار الحفظ</label>
                    <Dropdown options={[{value: 'DAILY', label: 'يومياً'}, {value: 'WEEKLY', label: 'أسبوعياً'}, {value: 'MONTHLY', label: 'شهرياً'}]} value={backup.autoBackup} onChange={(val: string) => setBackup({...backup, autoBackup: val})} className="w-full" />
                </div>
            </div>

            {/* --- DISTINCT RESTORE POINTS LIST --- */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-night-300 flex items-center gap-2 px-1"><History size={16} className="text-primary-400"/> سجل نقاط الرجوع المتميزة</h4>
                <div className="grid gap-3">
                    {/* The Newest Restore Point (v2.1) */}
                    <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/10 border border-emerald-500/30 p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-500 transition-all shadow-xl">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24}/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-white text-lg">Scouts Session Active Sync</h5>
                                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-emerald-500/20">نقطة فعالة</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-night-400 font-medium">
                                    <span className="flex items-center gap-1"><Clock size={12}/> 28-10-2024، 10:00</span>
                                    <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500"/> إصدار v2.1</span>
                                    <span className="text-primary-400 font-bold">بواسطة: النظام (تفعيل الحصص)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button className="px-4 py-2 bg-white/5 hover:bg-primary-600 text-white text-xs font-bold rounded-lg transition-all border border-white/5">استعادة</button>
                             <button className="p-2 bg-white/5 hover:bg-emerald-600 text-white rounded-lg transition-all border border-white/5"><Download size={16}/></button>
                        </div>
                    </div>

                    {/* Previous Point (v2.0) */}
                    <div className="bg-night-900/40 border border-white/5 p-4 rounded-xl flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-night-800 rounded-lg flex items-center justify-center text-night-400">
                                <History size={20}/>
                            </div>
                            <div>
                                <h5 className="font-bold text-white text-sm">Scouts Pro Elite Checkpoint</h5>
                                <p className="text-[10px] text-night-500 font-mono">2024-10-27 14:30:00 • v2.0-ELITE</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-bold text-night-400 hover:text-white px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">استعادة</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Tab 7: Security
    const renderSecurity = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in max-w-3xl mx-auto space-y-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Lock className="text-red-500"/> الأمان والحماية</h3>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">مدة الجلسة (قبل تسجيل الخروج التلقائي)</label>
                    <Dropdown options={['15m', '30m', '1h', '4h', 'Never']} value={security.sessionTimeout} onChange={(val: string) => setSecurity({...security, sessionTimeout: val})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-night-300 font-bold">عدد محاولات الدخول الفاشلة المسموح بها</label>
                    <Dropdown options={['3', '5', '10']} value={security.maxLoginAttempts} onChange={(val: string) => setSecurity({...security, maxLoginAttempts: val})} />
                </div>
                <div className="pt-4 border-t border-white/5">
                    <Toggle label="التحقق الثنائي (2FA) - يتطلب بريد إلكتروني" checked={security.twoFactor} onChange={(val) => setSecurity({...security, twoFactor: val})} />
                </div>
            </div>
        </div>
    );

    // Tab 8: Logs
    const renderLogs = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6">سجلات النظام</h3>
            <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full text-right">
                    <thead className="bg-night-900 text-night-300 text-xs">
                        <tr>
                            <th className="p-4">الوقت</th>
                            <th className="p-4">المستخدم</th>
                            <th className="p-4">الإجراء</th>
                            <th className="p-4">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        <tr className="hover:bg-white/5 bg-emerald-600/5">
                            <td className="p-4 font-mono text-emerald-400">28-10-2024، 10:00</td>
                            <td className="p-4 text-white">System</td>
                            <td className="p-4 font-bold">تحديث متميز: تفعيل الحصص الكشفية (v2.1)</td>
                            <td className="p-4 text-emerald-400 flex items-center gap-1 font-bold"><CheckCircle2 size={14}/> مكتمل</td>
                        </tr>
                        <tr className="hover:bg-white/5">
                            <td className="p-4 font-mono text-primary-400">27-10-2024، 14:30</td>
                            <td className="p-4 text-white">System</td>
                            <td className="p-4 font-bold">إنشاء نقطة رجوع متميزة (Elite Checkpoint)</td>
                            <td className="p-4 text-emerald-400 flex items-center gap-1 font-bold"><CheckCircle2 size={14}/> مكتمل</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-8 h-full animate-fade-in flex flex-col">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <SettingsIcon size={32} className="text-night-300"/>
                    الإعدادات والتحكم
                </h2>
                <p className="text-night-400 mt-2">إدارة شاملة للنظام، البطاقة الفنية للفوج، والصلاحيات.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                            activeTab === tab.id 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                            : 'bg-night-800 text-night-400 hover:bg-night-700 hover:text-white'
                        }`}
                    >
                        <tab.icon size={18} /> <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                {activeTab === 0 && renderTechnicalCard()}
                {activeTab === 1 && renderGeneralSettings()}
                {activeTab === 2 && renderUsers()}
                {activeTab === 3 && renderAppearance()}
                {activeTab === 4 && renderNotifications()}
                {activeTab === 5 && renderBackup()}
                {activeTab === 6 && renderSecurity()}
                {activeTab === 7 && renderLogs()}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-night-900/80 backdrop-blur-md border-t border-white/10 flex justify-end gap-4 z-40 ml-20 lg:ml-72 transition-all">
                <button className="px-6 py-2 rounded-xl text-night-400 font-bold hover:bg-white/5 transition-colors">إلغاء التغييرات</button>
                <button className="px-8 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                    <Save size={18} /> حفظ الإعدادات
                </button>
            </div>
        </div>
    );
};

export default Settings;
