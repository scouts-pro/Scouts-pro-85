
import React, { useState } from 'react';
import { 
    Settings as SettingsIcon, FileText, Globe, Users, Palette, Bell, Database, Shield, Activity, 
    Save, Upload, ChevronDown, CheckCircle2, AlertTriangle, Lock, RefreshCw, Smartphone, 
    Mail, Phone, MapPin, Building, CreditCard, Clock, HardDrive, Download, Trash2, RotateCcw,
    History, ShieldCheck, Zap, Plus, ArrowLeft, Languages, UserPlus, Eye, ShieldAlert,
    Sun, Moon, Layout, Monitor, MousePointer2, Calendar
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '../constants';

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
                    {Icon && <Icon size={18} className="text-primary-400" />}
                    <span className={`font-medium truncate ${!value ? 'text-night-400' : 'text-white'}`}>{label || 'اختر...'}</span>
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
                                    className={`p-3.5 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between transition-colors ${val === value ? 'bg-primary-600/10 text-primary-400 font-bold' : ''}`}
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

const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (val: boolean) => void, label?: string }) => (
    <div className="flex items-center justify-between p-2">
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

    const [techCard, setTechCard] = useState({
        groupName: 'فوج الإشراق', logo: '', organization: 'الكشافة الإسلامية الجزائرية', wilaya: 'البويرة', municipality: 'عين الترك',
        accreditationNumber: '123/2024', accreditationDate: '2024-01-15', groupId: 'DZ-10-256', groupIdNum: '256', foundingDate: '2015-11-01',
        slogan: 'كشاف الإشراق . تعاون . ود . أخلاق', hqType: 'دار شباب', specialty: 'مختلط', status: 'نشط',
        bankAccount: '00123456789012345678', bankName: 'بريد الجزائر', lastUpdate: new Date().toISOString().split('T')[0],
        phone1: '0779571205', phone2: '0663628154', fax: '026832128', email: 'ichraq.couts@gmail.com', backupEmail: 'admin.ichraq@scouts.dz'
    });

    const [generalSettings, setGeneralSettings] = useState({ appName: 'Scouts Pro', language: 'ar', timezone: 'Africa/Algiers', dateFormat: 'DD/MM/YYYY', enableBetaFeatures: true });
    const [permissions, setPermissions] = useState({ defaultRole: 'LEADER', allowGuestAccess: false, autoApproveMembers: false });
    const [appearance, setAppearance] = useState({ theme: 'DARK', primaryColor: 'BLUE', density: 'COMFORTABLE' });
    const [notifications, setNotifications] = useState({ systemAlerts: true, financeAlerts: true, activityAlerts: true, emailNotifications: true, priority: 'HIGH' });
    const [backup, setBackup] = useState({ autoBackup: 'WEEKLY', restorePointActive: true });
    const [security, setSecurity] = useState({ sessionTimeout: '30m', twoFactor: false, maxLoginAttempts: '3', forcePasswordChange: false });

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

    const renderTechnicalCard = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 text-center shadow-lg relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-purple-600"></div>
                    <div className="w-40 h-40 mx-auto bg-night-900 rounded-full border-4 border-white/5 flex items-center justify-center mb-6 relative group-hover:border-primary-500 transition-colors">
                        {techCard.logo ? <img src={techCard.logo} className="w-full h-full rounded-full object-cover"/> : <SettingsIcon size={48} className="text-night-600"/>}
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Upload className="text-white" size={24}/></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{techCard.groupName}</h3>
                    <p className="text-primary-400 text-sm font-mono">{techCard.groupId}</p>
                    <div className="mt-6 flex justify-center"><span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>{techCard.status}</span></div>
                </div>
                <div className="bg-night-800/60 p-6 rounded-3xl border border-white/10 space-y-4">
                    <h5 className="text-sm font-bold text-night-300 border-b border-white/5 pb-2">معلومات التواصل</h5>
                    <div className="flex items-center gap-3 text-white text-sm"><Phone size={14} className="text-primary-500"/><span dir="ltr">{techCard.phone1}</span></div>
                    <div className="flex items-center gap-3 text-white text-sm"><Mail size={14} className="text-primary-500"/><span>{techCard.email}</span></div>
                </div>
            </div>
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg">
                    <h4 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2"><Building size={20} className="text-primary-500"/> البطاقة الفنية للفوج</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-sm text-night-300 font-bold">اسم الفوج</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500" value={techCard.groupName} onChange={e => setTechCard({...techCard, groupName: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-sm text-night-300 font-bold">الرقم التعريفي</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-primary-500" value={techCard.groupId} onChange={e => setTechCard({...techCard, groupId: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-sm text-night-300 font-bold">المحافظة الولائية</label><Dropdown options={ALGERIA_WILAYAS} value={techCard.wilaya} onChange={(val: string) => setTechCard({...techCard, wilaya: val})} /></div>
                        <div className="space-y-2"><label className="text-sm text-night-300 font-bold">البلدية</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500" value={techCard.municipality} onChange={e => setTechCard({...techCard, municipality: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-sm text-night-300 font-bold">تاريخ التأسيس</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500" value={techCard.foundingDate} onChange={e => setTechCard({...techCard, foundingDate: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-sm text-night-300 font-bold">شعار الفوج</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500" value={techCard.slogan} onChange={e => setTechCard({...techCard, slogan: e.target.value})} /></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGeneralSettings = () => (
        <div className="max-w-4xl mx-auto bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg space-y-8 animate-fade-in">
            <h4 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Globe size={20} className="text-primary-500"/> الإعدادات العامة للنظام</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-sm text-night-300 font-bold">اسم التطبيق</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500" value={generalSettings.appName} onChange={e => setGeneralSettings({...generalSettings, appName: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-sm text-night-300 font-bold">اللغة الافتراضية</label><Dropdown options={[{value:'ar', label:'العربية'}, {value:'fr', label:'الفرنسية'}, {value:'en', label:'الإنجليزية'}]} value={generalSettings.language} onChange={(v:any)=>setGeneralSettings({...generalSettings, language:v})} icon={Languages} /></div>
                <div className="space-y-2"><label className="text-sm text-night-300 font-bold">تنسيق التاريخ</label><Dropdown options={[{value:'DD/MM/YYYY', label:'DD/MM/YYYY'}, {value:'YYYY-MM-DD', label:'YYYY-MM-DD'}]} value={generalSettings.dateFormat} onChange={(v:any)=>setGeneralSettings({...generalSettings, dateFormat:v})} icon={Calendar} /></div>
                <div className="space-y-2"><label className="text-sm text-night-300 font-bold">المنطقة الزمنية</label><Dropdown options={[{value:'Africa/Algiers', label:'GMT+1 (الجزائر)'}]} value={generalSettings.timezone} onChange={(v:any)=>setGeneralSettings({...generalSettings, timezone:v})} icon={Clock} /></div>
            </div>
            <div className="pt-4"><Toggle label="تفعيل الميزات التجريبية (Beta)" checked={generalSettings.enableBetaFeatures} onChange={(v)=>setGeneralSettings({...generalSettings, enableBetaFeatures:v})} /></div>
        </div>
    );

    const renderPermissions = () => (
        <div className="max-w-4xl mx-auto bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg space-y-8 animate-fade-in">
            <h4 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Users size={20} className="text-primary-500"/> المستخدمين والصلاحيات</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-sm text-night-300 font-bold">الرتبة الافتراضية للمسجلين</label><Dropdown options={[{value:'SCOUT', label:'كشاف'}, {value:'LEADER', label:'قائد'}]} value={permissions.defaultRole} onChange={(v:any)=>setPermissions({...permissions, defaultRole:v})} /></div>
            </div>
            <div className="space-y-4">
                <Toggle label="السماح بدخول الضيوف (Guest Access)" checked={permissions.allowGuestAccess} onChange={(v)=>setPermissions({...permissions, allowGuestAccess:v})} />
                <Toggle label="قبول طلبات العضوية تلقائياً" checked={permissions.autoApproveMembers} onChange={(v)=>setPermissions({...permissions, autoApproveMembers:v})} />
            </div>
            <button className="bg-primary-600/10 text-primary-400 border border-primary-500/20 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-600 hover:text-white transition-all"><UserPlus size={18}/> إضافة مستخدم إداري جديد</button>
        </div>
    );

    const renderAppearance = () => (
        <div className="max-w-4xl mx-auto bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg space-y-8 animate-fade-in">
            <h4 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Palette size={20} className="text-primary-500"/> تخصيص المظهر والواجهة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-sm text-night-300 font-bold">نمط الواجهة</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['LIGHT', 'DARK', 'SYSTEM'].map((t) => (
                            <button key={t} onClick={()=>setAppearance({...appearance, theme:t})} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${appearance.theme === t ? 'bg-primary-600/20 border-primary-500 text-primary-400' : 'bg-night-900 border-white/5 text-night-500 hover:border-white/10'}`}>
                                {t === 'LIGHT' ? <Sun size={20}/> : t === 'DARK' ? <Moon size={20}/> : <Monitor size={20}/>}
                                <span className="text-[10px] font-black">{t}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-sm text-night-300 font-bold">كثافة العناصر</label>
                    <Dropdown options={[{value:'COMPACT', label:'مدمج'}, {value:'COMFORTABLE', label:'مريح'}, {value:'SPACIOUS', label:'واسع'}]} value={appearance.density} onChange={(v:any)=>setAppearance({...appearance, density:v})} icon={Layout} />
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="max-w-4xl mx-auto bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg space-y-8 animate-fade-in">
            <h4 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Bell size={20} className="text-primary-500"/> إعدادات التنبيهات</h4>
            <div className="space-y-4">
                <Toggle label="تنبيهات النظام العامة" checked={notifications.systemAlerts} onChange={(v)=>setNotifications({...notifications, systemAlerts:v})} />
                <Toggle label="تنبيهات العمليات المالية" checked={notifications.financeAlerts} onChange={(v)=>setNotifications({...notifications, financeAlerts:v})} />
                <Toggle label="تنبيهات الأنشطة والمخيمات" checked={notifications.activityAlerts} onChange={(v)=>setNotifications({...notifications, activityAlerts:v})} />
                <Toggle label="إرسال نسخ إلى البريد الإلكتروني" checked={notifications.emailNotifications} onChange={(v)=>setNotifications({...notifications, emailNotifications:v})} />
            </div>
            <div className="pt-4"><label className="text-sm text-night-300 font-bold block mb-2">أولوية الإشعارات</label><Dropdown options={[{value:'LOW', label:'منخفضة'}, {value:'MEDIUM', label:'متوسطة'}, {value:'HIGH', label:'عالية'}]} value={notifications.priority} onChange={(v:any)=>setNotifications({...notifications, priority:v})} icon={ShieldAlert} /></div>
        </div>
    );

    const renderBackup = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in max-w-4xl mx-auto space-y-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Database className="text-blue-500"/> النسخ الاحتياطي واستعادة البيانات</h3>
                    <p className="text-sm text-night-400 mt-1">إدارة نقاط الرجوع للنظام لضمان سلامة الأصول والبيانات.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"><Database size={18} /> إنشاء نقطة جديدة</button>
                    <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"><RotateCcw size={18} /> استعادة نقطة سابقة</button>
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-night-300 flex items-center gap-2 px-1"><History size={16} className="text-primary-400"/> سجل نقاط الرجوع المتميزة</h4>
                <div className="grid gap-4">
                    {/* NEW POINT v3.8 */}
                    <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/10 border border-emerald-500/50 p-5 rounded-2xl flex items-center justify-between shadow-2xl animate-glow-primary">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-white shadow-inner"><Zap size={24} className="text-emerald-400"/></div>
                            <div>
                                <div className="flex items-center gap-2"><h5 className="font-bold text-white text-lg font-['Cairo']">UI Refinement & Module Stabilization (v3.8)</h5><span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-emerald-500/30">نقطة حالية</span></div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-night-300 font-medium font-['Cairo']"><span className="flex items-center gap-1"><Clock size={12}/> {new Date().toLocaleDateString('ar-DZ')}</span><span className="flex items-center gap-1"><Zap size={12} className="text-yellow-400"/> إصدار v3.8</span></div>
                            </div>
                        </div>
                        <button className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-lg transition-all"><Download size={18}/></button>
                    </div>

                    {/* v3.7 */}
                    <div className="bg-night-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-lg opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={24}/></div>
                            <div>
                                <div className="flex items-center gap-2"><h5 className="font-bold text-white text-lg font-['Cairo']">Equipment & UI Refinement (v3.7)</h5><span className="bg-night-700/50 text-night-400 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter">نقطة أرشفة</span></div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-night-400 font-medium font-['Cairo']"><span className="flex items-center gap-1"><Clock size={12}/> 27/11/2024</span><span className="flex items-center gap-1"><Zap size={12} className="text-night-500"/> إصدار v3.7</span></div>
                            </div>
                        </div>
                        <button className="p-2.5 bg-white/5 text-night-400 rounded-lg"><Download size={18}/></button>
                    </div>

                    {/* v3.6 */}
                    <div className="bg-night-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-lg opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={24}/></div>
                            <div>
                                <div className="flex items-center gap-2"><h5 className="font-bold text-white text-lg font-['Cairo']">Visual Excellence & Functional Expansion (v3.6)</h5><span className="bg-night-700/50 text-night-400 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter">نقطة أرشفة</span></div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-night-400 font-medium font-['Cairo']"><span className="flex items-center gap-1"><Clock size={12}/> 26/11/2024</span><span className="flex items-center gap-1"><Zap size={12} className="text-night-500"/> إصدار v3.6</span></div>
                            </div>
                        </div>
                        <button className="p-2.5 bg-white/5 text-night-400 rounded-lg"><Download size={18}/></button>
                    </div>

                    {/* v3.5 */}
                    <div className="bg-night-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-lg opacity-40 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={24}/></div>
                            <div>
                                <div className="flex items-center gap-2"><h5 className="font-bold text-white text-lg font-['Cairo']">Equipment UI & Notification System Update (v3.5)</h5><span className="bg-night-700/50 text-night-400 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter">نقطة أرشفة</span></div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-night-400 font-medium font-['Cairo']"><span className="flex items-center gap-1"><Clock size={12}/> 26/11/2024</span><span className="flex items-center gap-1"><Zap size={12} className="text-night-500"/> إصدار v3.5</span></div>
                            </div>
                        </div>
                        <button className="p-2.5 bg-white/5 text-night-400 rounded-lg"><Download size={18}/></button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="max-w-4xl mx-auto bg-night-800/60 p-8 rounded-3xl border border-white/10 shadow-lg space-y-8 animate-fade-in">
            <h4 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Shield size={20} className="text-primary-500"/> الأمان والحماية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-sm text-night-300 font-bold">مهلة انتهاء الجلسة</label><Dropdown options={[{value:'15m', label:'15 دقيقة'}, {value:'30m', label:'30 دقيقة'}, {value:'1h', label:'ساعة واحدة'}]} value={security.sessionTimeout} onChange={(v:any)=>setSecurity({...security, sessionTimeout:v})} /></div>
                <div className="space-y-2"><label className="text-sm text-night-300 font-bold">أقصى محاولات دخول</label><Dropdown options={[{value:'3', label:'3 محاولات'}, {value:'5', label:'5 محاولات'}]} value={security.maxLoginAttempts} onChange={(v:any)=>setSecurity({...security, maxLoginAttempts:v})} /></div>
            </div>
            <div className="space-y-4">
                <Toggle label="تفعيل المصادقة الثنائية (2FA)" checked={security.twoFactor} onChange={(v)=>setSecurity({...security, twoFactor:v})} />
                <Toggle label="إجبار المستخدمين على تغيير كلمة المرور دورياً" checked={security.forcePasswordChange} onChange={(v)=>setSecurity({...security, forcePasswordChange:v})} />
            </div>
            <button className="text-rose-400 text-sm font-bold flex items-center gap-2 hover:text-rose-500 transition-colors"><Trash2 size={16}/> تسجيل الخروج من جميع الأجهزة</button>
        </div>
    );

    const renderLogs = () => (
        <div className="bg-night-800/60 p-8 rounded-3xl border border-white/10 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Activity size={20} className="text-primary-500"/> سجلات النظام التشغيلية</h3>
            <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full text-right">
                    <thead className="bg-night-900 text-night-300 text-xs"><tr><th className="p-4">الوقت</th><th className="p-4">المستخدم</th><th className="p-4">الإجراء</th><th className="p-4">الحالة</th></tr></thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        <tr className="hover:bg-white/5 bg-primary-600/10">
                            <td className="p-4 font-mono text-primary-400">{new Date().toLocaleString('ar-DZ')}</td>
                            <td className="p-4 text-white">System Admin</td>
                            <td className="p-4 font-bold text-primary-400">إنشاء نقطة رجوع جديدة: v3.8 UI Refinement & Module Stabilization</td>
                            <td className="p-4 text-primary-400 flex items-center gap-1 font-bold"><CheckCircle2 size={14}/> مكتمل</td>
                        </tr>
                        <tr className="hover:bg-white/5">
                            <td className="p-4 font-mono text-night-400">28/11/2024, 10:00</td>
                            <td className="p-4 text-white">System Admin</td>
                            <td className="p-4 font-bold text-night-300">إنشاء نقطة رجوع جديدة: v3.7 Equipment & UI Refinement</td>
                            <td className="p-4 text-primary-400 flex items-center gap-1 font-bold"><CheckCircle2 size={14}/> مكتمل</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderActiveTabContent = () => {
        switch(activeTab) {
            case 0: return renderTechnicalCard();
            case 1: return renderGeneralSettings();
            case 2: return renderPermissions();
            case 3: return renderAppearance();
            case 4: return renderNotificationsTab();
            case 5: return renderBackup();
            case 6: return renderSecurity();
            case 7: return renderLogs();
            default: return renderTechnicalCard();
        }
    };

    return (
        <div className="p-8 h-full animate-fade-in flex flex-col font-['Cairo'] text-right" dir="rtl">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3 justify-start"><SettingsIcon size={32} className="text-night-300"/> الإعدادات والتحكم المركزية</h2>
                    <p className="text-night-400 mt-2 font-bold opacity-80 uppercase tracking-widest text-sm">إدارة الفوج، تخصيص النظام، وحماية سلامة البيانات.</p>
                </div>
                <div className="bg-primary-600/10 border border-primary-500/20 px-4 py-2 rounded-xl text-primary-400 text-xs font-black animate-pulse flex items-center gap-2">
                    <ShieldCheck size={14}/> نظام الحماية v3.8 نشط
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {TABS.map((tab) => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id)} 
                        className={`flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40 translate-y-[-2px]' : 'bg-night-800 text-night-400 hover:text-white hover:bg-white/5 border border-white/5'}`}
                    >
                        <tab.icon size={16} /> <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
                {renderActiveTabContent()}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-night-900/80 backdrop-blur-md border-t border-white/10 flex justify-between items-center z-40 ml-20 lg:ml-72 transition-all">
                <div className="flex items-center gap-3 text-night-500 text-xs font-bold">
                    <History size={14}/> آخر تحديث للنظام: {techCard.lastUpdate}
                </div>
                <button className="px-10 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-black shadow-lg flex items-center gap-2 transform active:scale-95 transition-all">
                    <Save size={18} /> حفظ كافة التغييرات
                </button>
            </div>
        </div>
    );
};

export default Settings;
