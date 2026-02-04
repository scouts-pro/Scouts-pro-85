
import React, { useState } from 'react';
import { 
    Correspondence, MissionOrder, Announcement, Meeting 
} from '../types';
import { 
    FileText, ArrowRightLeft, Briefcase, Megaphone, Users, Plus, X, Save, 
    Search, Filter, Download, ChevronLeft, Calendar, Clock, MapPin, 
    ShieldCheck, Info, History, Printer, LayoutDashboard, Tag, User, 
    Hash, Globe, Flag, FileSpreadsheet, Newspaper, Bell, Edit, Trash2,
    CheckCircle2, Eye
} from 'lucide-react';

interface AdministrationProps {
    onAddNotification?: (title: string, message: string, type: 'SUCCESS' | 'WARNING' | 'INFO') => void;
}

// Fixed: Moved Modal definition outside of Administration component to prevent focus loss during state updates (typing)
const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-4xl" }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in font-['Cairo'] text-right" dir="rtl">
            <div className="fixed inset-0 bg-night-950/90 backdrop-blur-md" onClick={onClose}></div>
            <div className={`bg-night-800 w-full ${maxWidth} rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-night-900/40">
                    <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-night-400 transition-all"><X size={20}/></button>
                    <h3 className="text-xl font-black text-white">{title}</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">{children}</div>
                {footer && <div className="p-6 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">{footer}</div>}
            </div>
        </div>
    );
};

const Administration: React.FC<AdministrationProps> = ({ onAddNotification }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Tab 1: الصادر والوارد ---
    const [correspondenceList, setCorrespondenceList] = useState<Correspondence[]>([]);
    const [showCorrModal, setShowCorrModal] = useState(false);
    const [newCorr, setNewCorr] = useState<Partial<Correspondence>>({ type: 'صادر', date: new Date().toISOString().split('T')[0] });

    // --- Tab 2: أمر بمهمة ---
    const [missionOrders, setMissionOrders] = useState<MissionOrder[]>([]);
    const [showMissionModal, setShowMissionModal] = useState(false);
    const [newMission, setNewMission] = useState<Partial<MissionOrder>>({
        orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    // --- Tab 3: قسم الإعلام ---
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [showAnnounceModal, setShowAnnounceModal] = useState(false);
    const [newAnnounce, setNewAnnounce] = useState<Partial<Announcement>>({ 
        type: 'تعليمات داخلية', 
        date: new Date().toISOString().split('T')[0] 
    });

    // --- Tab 4: الاجتماعات ---
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
        type: 'اجتماعات قيادية',
        date: new Date().toISOString().split('T')[0],
        time: '18:00'
    });

    const TABS = [
        { label: 'الصادر والوارد', icon: ArrowRightLeft },
        { label: 'أمر بمهمة', icon: Briefcase },
        { label: 'قسم الإعلام', icon: Megaphone },
        { label: 'الاجتماعات', icon: Users }
    ];

    // --- Handlers ---
    const handleSaveCorrespondence = () => {
        if (!newCorr.refNumber || !newCorr.subject) return;
        const entry = { ...newCorr, id: `corr_${Date.now()}` } as Correspondence;
        setCorrespondenceList([entry, ...correspondenceList]);
        setShowCorrModal(false);
        if (onAddNotification) onAddNotification('تم التسجيل', 'تم إضافة المراسلة بنجاح إلى سجل الصادر والوارد.', 'SUCCESS');
        setNewCorr({ type: 'صادر', date: new Date().toISOString().split('T')[0] });
    };

    const handleSaveMission = () => {
        if (!newMission.mission || !newMission.responsibleLeader) return;
        const entry = { ...newMission, id: `mis_${Date.now()}` } as MissionOrder;
        setMissionOrders([entry, ...missionOrders]);
        setShowMissionModal(false);
        if (onAddNotification) onAddNotification('تم الحفظ', 'تم إصدار أمر المهمة بنجاح وتوثيقه إدارياً.', 'SUCCESS');
        setNewMission({ orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] });
    };

    const handleSaveAnnouncement = () => {
        if (!newAnnounce.title || !newAnnounce.content) return;
        const entry = { ...newAnnounce, id: `ann_${Date.now()}` } as Announcement;
        setAnnouncements([entry, ...announcements]);
        setShowAnnounceModal(false);
        if (onAddNotification) onAddNotification('تم النشر', 'تم نشر الإعلان بنجاح في قسم الإعلام.', 'SUCCESS');
        setNewAnnounce({ type: 'تعليمات داخلية', date: new Date().toISOString().split('T')[0] });
    };

    const handleSaveMeeting = () => {
        if (!newMeeting.location || !newMeeting.topics) return;
        const entry = { ...newMeeting, id: `mtg_${Date.now()}`, attendees: [] } as Meeting;
        setMeetings([entry, ...meetings]);
        setShowMeetingModal(false);
        if (onAddNotification) onAddNotification('تم الجدولة', 'تم تسجيل محضر الاجتماع بنجاح.', 'SUCCESS');
        setNewMeeting({ type: 'اجتماعات قيادية', date: new Date().toISOString().split('T')[0], time: '18:00' });
    };

    // --- Tab Renders ---

    const renderCorrespondence = () => (
        <div className="space-y-6 animate-fade-in" dir="rtl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 bg-night-800 p-2 rounded-2xl border border-white/5">
                    <div className="relative group">
                        <input type="text" placeholder="بحث في المراسلات..." className="bg-night-900 border border-white/5 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white outline-none w-64 focus:border-primary-500 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <Search className="absolute right-3 top-3 text-night-400" size={18} />
                    </div>
                    <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-night-400"><Filter size={18}/></button>
                </div>
                <button onClick={() => setShowCorrModal(true)} className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95"><Plus size={20}/> إضافة مراسلة</button>
            </div>

            <div className="bg-night-800/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <table className="w-full text-right">
                    <thead className="bg-night-900/80 text-night-400 text-xs font-black uppercase tracking-widest border-b border-white/5">
                        <tr>
                            <th className="p-6">النوع</th>
                            <th className="p-6">الرقم المرجعي</th>
                            <th className="p-6">التاريخ</th>
                            <th className="p-6">المرسل / المستلم</th>
                            <th className="p-6">الموضوع</th>
                            <th className="p-6 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {correspondenceList.map(c => (
                            <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6"><span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.type === 'صادر' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/20' : 'bg-blue-600/20 text-blue-400 border border-blue-500/20'}`}>{c.type}</span></td>
                                <td className="p-6 font-mono text-white font-bold">{c.refNumber}</td>
                                <td className="p-6 text-night-400 font-mono text-xs">{c.date}</td>
                                <td className="p-6 text-white font-bold">{c.senderReceiver}</td>
                                <td className="p-6 text-night-300 text-sm max-w-xs truncate">{c.subject}</td>
                                <td className="p-6 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button className="p-2 bg-white/5 hover:bg-primary-600 rounded-xl text-white transition-all"><Eye size={16}/></button>
                                        <button className="p-2 bg-white/5 hover:bg-emerald-600 rounded-xl text-white transition-all"><Printer size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {correspondenceList.length === 0 && (
                            <tr><td colSpan={6} className="p-20 text-center text-night-600 font-bold italic opacity-30">لا توجد مراسلات مسجلة حالياً</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showCorrModal} onClose={() => setShowCorrModal(false)} title="تسجيل مراسلة رسمية" maxWidth="max-w-xl">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">نوع المراسلة</label>
                            <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={newCorr.type} onChange={e => setNewCorr({...newCorr, type: e.target.value as any})}>
                                <option>صادر</option><option>وارد</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">الرقم المرجعي</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-mono" value={newCorr.refNumber || ''} onChange={e => setNewCorr({...newCorr, refNumber: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">التاريخ</label>
                        <input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newCorr.date || ''} onChange={e => setNewCorr({...newCorr, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">المرسل / المستلم</label>
                        <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={newCorr.senderReceiver || ''} onChange={e => setNewCorr({...newCorr, senderReceiver: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">الموضوع</label>
                        <textarea className="w-full h-32 bg-night-900 border border-white/10 rounded-2xl p-4 text-white resize-none" value={newCorr.subject || ''} onChange={e => setNewCorr({...newCorr, subject: e.target.value})} />
                    </div>
                    <button onClick={handleSaveCorrespondence} className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all">تأكيد التسجيل</button>
                </div>
            </Modal>
        </div>
    );

    const renderMissionOrders = () => (
        <div className="space-y-6 animate-fade-in" dir="rtl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><ShieldCheck className="text-primary-500"/> سجل أوامر المهمة</h3>
                <button onClick={() => setShowMissionModal(true)} className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95"><Plus size={20}/> إصدار أمر بمهمة</button>
            </div>

            <div className="bg-night-800/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-night-900/80 text-night-400 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="p-6">الرقم</th>
                                <th className="p-6">المهمة</th>
                                <th className="p-6">القائد المسؤول</th>
                                <th className="p-6">الفترة</th>
                                <th className="p-6">الوجهة</th>
                                <th className="p-6">وسيلة النقل</th>
                                <th className="p-6 text-center">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs font-bold">
                            {missionOrders.map(m => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 font-mono text-primary-400">{m.orderNumber}</td>
                                    <td className="p-6 text-white">{m.mission}</td>
                                    <td className="p-6 text-white font-black">{m.responsibleLeader}</td>
                                    <td className="p-6 text-night-400 font-mono">{m.startDate} إلى {m.endDate}</td>
                                    <td className="p-6 text-night-300">{m.destination}</td>
                                    <td className="p-6 text-night-300">{m.transportType} - {m.transportNumber}</td>
                                    <td className="p-6 text-center">
                                        <button className="p-2 bg-white/5 hover:bg-primary-600 rounded-xl text-white transition-all"><Printer size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                            {missionOrders.length === 0 && (
                                <tr><td colSpan={7} className="p-20 text-center text-night-600 font-bold italic opacity-30">لا توجد أوامر مهام مسجلة</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={showMissionModal} onClose={() => setShowMissionModal(false)} title="إصدار أمر بمهمة كشفية" maxWidth="max-w-4xl">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">المهمة</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.mission || ''} onChange={e => setNewMission({...newMission, mission: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">الوجهة</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.destination || ''} onChange={e => setNewMission({...newMission, destination: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">السبب</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.reason || ''} onChange={e => setNewMission({...newMission, reason: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">تاريخ البداية</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.startDate || ''} onChange={e => setNewMission({...newMission, startDate: e.target.value})} /></div>
                            <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">تاريخ الانتهاء</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.endDate || ''} onChange={e => setNewMission({...newMission, endDate: e.target.value})} /></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">القائد المسؤول</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white font-bold" value={newMission.responsibleLeader || ''} onChange={e => setNewMission({...newMission, responsibleLeader: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">تاريخ الميلاد</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.leaderDOB || ''} onChange={e => setNewMission({...newMission, leaderDOB: e.target.value})} /></div>
                            <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">رقم بطاقة التعريف</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white font-mono" value={newMission.idCardNumber || ''} onChange={e => setNewMission({...newMission, idCardNumber: e.target.value})} /></div>
                        </div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">الوظيفة الكشفية</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.scoutJob || ''} onChange={e => setNewMission({...newMission, scoutJob: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">وسيلة النقل</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white" value={newMission.transportType || ''} onChange={e => setNewMission({...newMission, transportType: e.target.value})} /></div>
                            <div className="space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">رقم الوسيلة</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white font-mono" value={newMission.transportNumber || ''} onChange={e => setNewMission({...newMission, transportNumber: e.target.value})} /></div>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-1"><label className="text-[10px] font-black text-night-400 uppercase tracking-widest">المرافقين (أسماء أو عدد)</label><textarea className="w-full h-20 bg-night-900 border border-white/10 rounded-2xl p-4 text-white resize-none" value={newMission.companions || ''} onChange={e => setNewMission({...newMission, companions: e.target.value})} /></div>
                    <div className="col-span-2"><button onClick={handleSaveMission} className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all">تأكيد وحفظ أمر المهمة</button></div>
                </div>
            </Modal>
        </div>
    );

    const renderMedia = () => (
        <div className="space-y-8 animate-fade-in text-right" dir="rtl">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Megaphone className="text-primary-500"/> مركز الإعلام الكشفي</h3>
                <button onClick={() => setShowAnnounceModal(true)} className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95"><Plus size={20}/> نشر إعلان جديد</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {announcements.map(a => (
                    <div key={a.id} className="bg-night-800 border border-white/5 rounded-[2.5rem] p-8 shadow-xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-600"></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black text-primary-400 border border-white/10 uppercase">{a.type}</span>
                            <span className="text-night-500 text-[10px] font-mono">{a.date}</span>
                        </div>
                        <h4 className="text-xl font-black text-white mb-4 line-clamp-1">{a.title}</h4>
                        <p className="text-night-400 text-sm leading-relaxed mb-8 line-clamp-3">{a.content}</p>
                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400"><User size={12}/></div><span className="text-xs font-bold text-night-300">{a.author}</span></div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-night-400 hover:text-white"><Download size={14}/></button>
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-night-400 hover:text-white"><Edit size={14}/></button>
                                <button className="p-2 hover:bg-rose-600/10 rounded-lg transition-colors text-rose-500"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
                {announcements.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center gap-4">
                        <Megaphone size={64} className="text-night-700 opacity-20" />
                        <p className="text-night-500 text-xl font-bold italic opacity-40">لا توجد إعلانات منشورة حالياً</p>
                    </div>
                )}
            </div>

            <Modal isOpen={showAnnounceModal} onClose={() => setShowAnnounceModal(false)} title="تحرير محتوى إعلامي جديد">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">تصنيف المحتوى</label>
                            <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={newAnnounce.type} onChange={e => setNewAnnounce({...newAnnounce, type: e.target.value as any})}>
                                <option>تعليمات داخلية</option><option>أخبار ومراسلات</option><option>تحديثات الأنشطة والمخيمات</option><option>التواصل العام</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">تاريخ النشر</label>
                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newAnnounce.date || ''} onChange={e => setNewAnnounce({...newAnnounce, date: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">عنوان الخبر / الإعلان</label>
                        <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold text-lg" value={newAnnounce.title || ''} onChange={e => setNewAnnounce({...newAnnounce, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">محتوى النشر</label>
                        <textarea className="w-full h-48 bg-night-900 border border-white/10 rounded-2xl p-4 text-white resize-none leading-relaxed" value={newAnnounce.content || ''} onChange={e => setNewAnnounce({...newAnnounce, content: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">اسم الكاتب / الناشر</label>
                        <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newAnnounce.author || ''} onChange={e => setNewAnnounce({...newAnnounce, author: e.target.value})} />
                    </div>
                    <button onClick={handleSaveAnnouncement} className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all">نشر المحتوى فوراً</button>
                </div>
            </Modal>
        </div>
    );

    const renderMeetings = () => (
        <div className="space-y-8 animate-fade-in text-right" dir="rtl">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Users className="text-primary-500"/> إدارة الاجتماعات ومحاضر الجلسات</h3>
                <button onClick={() => setShowMeetingModal(true)} className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95"><Plus size={20}/> تسجيل اجتماع جديد</button>
            </div>

            <div className="bg-night-800/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-night-900/80 text-night-400 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="p-6">نوع الاجتماع</th>
                                <th className="p-6">التاريخ</th>
                                <th className="p-6">الوقت</th>
                                <th className="p-6">المكان</th>
                                <th className="p-6">أبرز النقاط</th>
                                <th className="p-6 text-center">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold">
                            {meetings.map(m => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6"><span className="bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-primary-400">{m.type}</span></td>
                                    <td className="p-6 text-night-400 font-mono">{m.date}</td>
                                    <td className="p-6 text-night-400 font-mono">{m.time}</td>
                                    <td className="p-6 text-white">{m.location}</td>
                                    <td className="p-6 text-night-300 text-xs max-w-xs truncate">{m.topics}</td>
                                    <td className="p-6 text-center">
                                        <button className="p-2 bg-white/5 hover:bg-primary-600 rounded-xl text-white transition-all"><FileText size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                            {meetings.length === 0 && (
                                <tr><td colSpan={6} className="p-20 text-center text-night-600 font-bold italic opacity-30">لا توجد اجتماعات موثقة</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)} title="تسجيل محضر اجتماع جديد">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">نوع الاجتماع</label>
                            <select className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white font-bold" value={newMeeting.type} onChange={e => setNewMeeting({...newMeeting, type: e.target.value as any})}>
                                <option>اجتماعات قيادية</option><option>اجتماعات وحدات أو طلائع</option><option>اجتماعات استثنائية أو خاصة</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">التاريخ</label>
                            <input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newMeeting.date || ''} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">توقيت الاجتماع</label>
                            <input type="time" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newMeeting.time || ''} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-night-400">مكان الاجتماع</label>
                            <input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white" value={newMeeting.location || ''} onChange={e => setNewMeeting({...newMeeting, location: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-night-400">الموضوعات والنقاط المدرجة</label>
                        <textarea className="w-full h-48 bg-night-900 border border-white/10 rounded-2xl p-4 text-white resize-none leading-relaxed" value={newMeeting.topics || ''} onChange={e => setNewMeeting({...newMeeting, topics: e.target.value})} />
                    </div>
                    <button onClick={handleSaveMeeting} className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl transition-all">توثيق محضر الاجتماع</button>
                </div>
            </Modal>
        </div>
    );

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in text-right font-['Cairo']" dir="rtl">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">إدارة الفوج المركزية</h2>
                    <p className="text-night-400 font-bold opacity-80 uppercase tracking-widest text-sm">التنسيق الإداري، المراسلات، وتوثيق الأوامر الرسمية والمهام.</p>
                </div>
                <div className="flex bg-night-800/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                    <button className="p-3 rounded-xl text-primary-400 hover:bg-white/5 transition-all"><Printer size={20}/></button>
                    <button className="p-3 rounded-xl text-emerald-400 hover:bg-white/5 transition-all"><FileSpreadsheet size={20}/></button>
                </div>
            </div>

            <div className="flex bg-night-800/30 p-1 rounded-[2rem] border border-white/5 mb-10 self-start shadow-inner overflow-x-auto no-scrollbar max-w-full">
                {TABS.map((tab, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveTab(idx)}
                        className={`px-10 py-4 font-black text-sm rounded-[1.8rem] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === idx ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={20}/> {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 pb-20">
                {activeTab === 0 && renderCorrespondence()}
                {activeTab === 1 && renderMissionOrders()}
                {activeTab === 2 && renderMedia()}
                {activeTab === 3 && renderMeetings()}
            </div>
        </div>
    );
};

export default Administration;
