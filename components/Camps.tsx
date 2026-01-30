
import React, { useState } from 'react';
import { Event, Member, UnitName } from '../types';
import { UNITS_LIST } from '../constants';
import { 
    Calendar, MapPin, Users, Plus, 
    ChevronLeft, Clock, Target, ArrowUpRight, Save, X, DollarSign, Briefcase, Tent, Image as ImageIcon
} from 'lucide-react';

interface CampsProps {
    camps: Event[];
    members: Member[];
    onUpdateCamp?: (camp: Event) => void;
    onAddCamp?: (camp: Event) => void;
    onFinancialTransfer?: any;
    globalTransactions?: any;
    onAddNotification?: any;
    onTransferSurplus?: any;
}

const Camps: React.FC<CampsProps> = ({ camps, members, onAddCamp }) => {
    const [selectedCamp, setSelectedCamp] = useState<Event | null>(null);
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PARTICIPANTS'>('OVERVIEW');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formTab, setFormTab] = useState(0);

    const initialForm: Partial<Event> = {
        title: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop',
        targetUnits: [],
        participants: [],
        leaderIds: [],
        goals: '',
        cost: 0,
        fee: 0,
        manager: '',
        isClosed: false,
        type: 'CAMP'
    };

    const [formData, setFormData] = useState<Partial<Event>>(initialForm);

    const handleOpenDetail = (camp: Event) => {
        setSelectedCamp(camp);
        setViewMode('DETAIL');
        setActiveTab('OVERVIEW');
    };

    const handleSave = () => {
        if (!formData.title || !formData.date) return;
        if (onAddCamp) {
            onAddCamp({ ...formData, id: `camp_${Date.now()}` } as Event);
            setShowAddModal(false);
            setFormData(initialForm);
        }
    };

    const getDaysRemaining = (dateStr: string) => {
        try {
            const today = new Date();
            today.setHours(0,0,0,0);
            const target = new Date(dateStr);
            target.setHours(0,0,0,0);
            const diff = target.getTime() - today.getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        } catch { return 0; }
    };

    const renderAddModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/95 backdrop-blur-md p-4 animate-fade-in overflow-hidden">
            <div className="bg-night-800 w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/30">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3"><Tent className="text-primary-500" size={32}/> إضافة مخيم / رحلة</h3>
                    <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-night-400 hover:text-white transition-all"><X size={24}/></button>
                </div>

                <div className="flex bg-night-900/50 border-b border-white/5 p-1">
                    {['التخطيط الأساسي', 'الميزانية والتموين', 'وصف الأهداف'].map((t, idx) => (
                        <button key={idx} onClick={() => setFormTab(idx)} className={`flex-1 py-4 text-xs font-black transition-all rounded-xl ${formTab === idx ? 'bg-primary-600 text-white shadow-lg' : 'text-night-500 hover:text-white'}`}>{t}</button>
                    ))}
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-night-900/20">
                    {formTab === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                            <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">اسم المخيم</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">تاريخ البدء</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-mono" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">مكان التخييم</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">رابط صورة الغلاف</label><div className="flex gap-2"><div className="w-14 h-14 rounded-xl bg-night-950 border border-white/5 overflow-hidden"><img src={formData.coverImage} className="w-full h-full object-cover"/></div><input type="text" className="flex-1 bg-night-900 border border-white/10 rounded-2xl p-4 text-xs text-night-400 outline-none" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} /></div></div>
                            <div className="space-y-2 md:col-span-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">الوحدات المعنية</label><div className="flex flex-wrap gap-2 pt-2">{UNITS_LIST.map(u => (
                                <button key={u} onClick={() => {
                                    const current = formData.targetUnits || [];
                                    setFormData({...formData, targetUnits: current.includes(u) ? current.filter(x => x !== u) : [...current, u]});
                                }} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formData.targetUnits?.includes(u) ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/20' : 'bg-night-900 border-white/5 text-night-500'}`}>{u}</button>
                            ))}</div></div>
                        </div>
                    )}

                    {formTab === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                            <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">ميزانية المخيم الكلية</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-mono text-xl font-bold" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} /></div>
                            <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">رسوم اشتراك الفرد</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-mono text-xl font-bold" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} /></div>
                            <div className="space-y-2 md:col-span-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">القائد المسؤول / مدير المخيم</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-2xl p-4 text-white focus:border-primary-500 outline-none font-bold" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} /></div>
                        </div>
                    )}

                    {formTab === 2 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-2"><label className="text-xs font-black text-night-400 uppercase tracking-widest">الأهداف التربوية والوصف</label><textarea className="w-full h-56 bg-night-900 border border-white/10 rounded-[2rem] p-6 text-white focus:border-primary-500 outline-none resize-none leading-relaxed" placeholder="اكتب تفاصيل وأهداف المخيم هنا..." value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} /></div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-white/10 bg-night-900/80 backdrop-blur-md flex justify-end gap-4">
                    <button onClick={() => setShowAddModal(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all">إلغاء</button>
                    <button onClick={handleSave} className="px-12 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-2xl shadow-primary-900/40 transition-all flex items-center gap-2 transform hover:scale-105"><Save size={20}/> تأكيد وإنشاء</button>
                </div>
            </div>
        </div>
    );

    const renderOverview = () => {
        if (!selectedCamp) return null;
        return (
            <div className="animate-fade-in space-y-8">
                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 h-80 group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <img src={selectedCamp.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Camp Cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-10 w-full">
                        <div className="flex gap-4 mb-4">
                             {selectedCamp.targetUnits.map(u => <span key={u} className="bg-primary-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">{u}</span>)}
                        </div>
                        <h2 className="text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">{selectedCamp.title}</h2>
                        <div className="flex gap-6 text-white/90">
                            <span className="flex items-center gap-2 bg-black/40 px-5 py-2 rounded-2xl text-sm font-bold backdrop-blur-xl border border-white/10"><MapPin size={20} className="text-primary-500"/> {selectedCamp.location}</span>
                            <span className="flex items-center gap-2 bg-black/40 px-5 py-2 rounded-2xl text-sm font-bold backdrop-blur-xl border border-white/10"><Calendar size={20} className="text-primary-500"/> {selectedCamp.date}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-night-800/60 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-5 shadow-xl">
                        <div className="p-4 rounded-2xl bg-primary-600/20 text-primary-400 shadow-inner"><Users size={32} /></div>
                        <div>
                            <p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">المشاركون</p>
                            <p className="text-white font-black text-2xl leading-none">{selectedCamp.participants.length + selectedCamp.leaderIds.length} <span className="text-xs text-night-500">فرد</span></p>
                        </div>
                    </div>
                    <div className="bg-night-800/60 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-5 shadow-xl">
                        <div className="p-4 rounded-2xl bg-emerald-600/20 text-emerald-400 shadow-inner"><DollarSign size={32} /></div>
                        <div>
                            <p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">ميزانية المخيم</p>
                            <p className="text-white font-black text-2xl leading-none font-mono">{selectedCamp.cost.toLocaleString()} <span className="text-xs text-night-500">DZD</span></p>
                        </div>
                    </div>
                    <div className="bg-night-800/60 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-5 shadow-xl">
                        <div className="p-4 rounded-2xl bg-purple-600/20 text-purple-400 shadow-inner"><Briefcase size={32} /></div>
                        <div>
                            <p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">مدير المخيم</p>
                            <p className="text-white font-black text-lg leading-none">{selectedCamp.manager || '---'}</p>
                        </div>
                    </div>
                    <div className="bg-night-800/60 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-5 shadow-xl">
                        <div className="p-4 rounded-2xl bg-yellow-600/20 text-yellow-400 shadow-inner"><Clock size={32} /></div>
                        <div>
                            <p className="text-night-500 text-[10px] font-black uppercase tracking-widest mb-1">العد التنازلي</p>
                            <p className="text-white font-black text-2xl leading-none">{getDaysRemaining(selectedCamp.date)} <span className="text-xs text-night-500">يوم</span></p>
                        </div>
                    </div>
                </div>

                <div className="bg-night-800/60 p-10 rounded-[3rem] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl group-hover:bg-primary-600/10 transition-colors"></div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3"><Target className="text-primary-500" size={28}/> الأهداف الاستراتيجية والتربوية</h3>
                    <div className="h-px bg-white/5 w-full"></div>
                    <p className="text-night-300 leading-[2] text-xl font-medium">{selectedCamp.goals}</p>
                </div>
            </div>
        );
    };

    const renderParticipants = () => {
        if (!selectedCamp) return null;
        const leaders = members.filter(m => selectedCamp.leaderIds.includes(m.id));
        const scouts = members.filter(m => selectedCamp.participants.includes(m.id));

        const ParticipantTable = ({ data, title }: { data: Member[], title: string }) => (
            <div className="bg-night-800/40 rounded-[2.5rem] border border-white/5 overflow-hidden mb-8 shadow-2xl backdrop-blur-xl">
                <div className="p-6 bg-night-900/50 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-black text-white flex items-center gap-3"><Users size={24} className="text-primary-500"/> {title} <span className="bg-white/5 px-3 py-0.5 rounded-xl text-sm text-night-400 font-bold">{data.length}</span></h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-night-950 text-night-300 text-[10px] font-black uppercase tracking-widest">
                            <tr><th className="p-5 pl-8">الاسم الكامل</th><th className="p-5">الوحدة الكشفية</th><th className="p-5">رقم التأمين</th><th className="p-5 text-center">الصفة</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {data.map(m => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 pl-8 font-black text-white flex items-center gap-4">
                                        <img src={m.image} className="w-12 h-12 rounded-2xl object-cover border-2 border-night-900 group-hover:border-primary-500 transition-colors" />
                                        <div>
                                            <p>{m.fullName}</p>
                                            <p className="text-[10px] text-night-500 font-mono tracking-widest">{m.membershipNumber}</p>
                                        </div>
                                    </td>
                                    <td className="p-5 text-night-300 font-bold">{m.unit}</td>
                                    <td className="p-5 font-mono text-night-300 tracking-wider">{m.insuranceNumber}</td>
                                    <td className="p-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${m.role.includes('قائد') ? 'bg-blue-600/20 text-blue-400 border-blue-500/20' : 'bg-night-900 text-night-500 border-white/5'}`}>{m.role}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        return (
            <div className="animate-fade-in space-y-4">
                <ParticipantTable data={leaders} title="هيئة القيادة والتأطير" />
                <ParticipantTable data={scouts} title="قائمة الكشافة المشاركين" />
            </div>
        );
    };

    if (viewMode === 'DETAIL' && selectedCamp) {
        return (
            <div className="p-8 h-full flex flex-col animate-fade-in relative">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setViewMode('LIST')} className="p-4 bg-night-800 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all shadow-lg hover:-translate-x-1 group">
                            <ChevronLeft size={28} className="group-hover:text-primary-400" />
                        </button>
                        <div>
                            <span className="text-[10px] text-primary-400 font-black uppercase tracking-[0.3em] mb-1 block">تفاصيل الفعالية الكبرى</span>
                            <h2 className="text-4xl font-black text-white tracking-tight">{selectedCamp.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex bg-night-800/30 p-1 rounded-2xl border border-white/5 mb-10 self-start">
                    <button onClick={() => setActiveTab('OVERVIEW')} className={`px-12 py-4 font-black text-xs rounded-xl transition-all ${activeTab === 'OVERVIEW' ? 'bg-primary-600 text-white shadow-xl' : 'text-night-400 hover:text-white hover:bg-white/5'}`}>نظرة استراتيجية</button>
                    <button onClick={() => setActiveTab('PARTICIPANTS')} className={`px-12 py-4 font-black text-xs rounded-xl transition-all ${activeTab === 'PARTICIPANTS' ? 'bg-primary-600 text-white shadow-xl' : 'text-night-400 hover:text-white hover:bg-white/5'}`}>إدارة المشاركين</button>
                </div>

                <div className="flex-1 pb-20">
                    {activeTab === 'OVERVIEW' && renderOverview()} 
                    {activeTab === 'PARTICIPANTS' && renderParticipants()}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col">
            {showAddModal && renderAddModal()}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">المخيمات والرحلات الكبرى</h2>
                    <p className="text-night-400 text-lg">إدارة وتخطيط الفعاليات الميدانية وحياة الخلاء.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-[2rem] flex items-center gap-3 font-black shadow-2xl shadow-primary-900/40 transition-all hover:scale-105 active:scale-95">
                    <Plus size={28} /> تسجيل مخيم جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {camps.length > 0 ? camps.map(camp => (
                    <div key={camp.id} onClick={() => handleOpenDetail(camp)} className="bg-night-800 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary-500/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-500 cursor-pointer group flex flex-col relative">
                        <div className="h-60 overflow-hidden relative">
                            <img src={camp.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={camp.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/20 to-transparent opacity-90"></div>
                            <div className="absolute top-6 left-6 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-[10px] font-black text-white border border-white/10 flex items-center gap-2 shadow-2xl bg-black/60">
                                <Clock size={16} className="text-primary-500"/> <span>{getDaysRemaining(camp.date)} يوم متبقي</span>
                            </div>
                        </div>
                        <div className="p-10 flex-1 flex flex-col">
                            <h3 className="text-3xl font-black text-white group-hover:text-primary-400 transition-colors mb-4 line-clamp-1 tracking-tighter">{camp.title}</h3>
                            <div className="text-sm text-night-400 space-y-4 mb-8">
                                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5"><Calendar size={20} className="text-primary-500" /> <span className="font-bold text-night-200">{camp.date}</span></div>
                                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5"><MapPin size={20} className="text-primary-500" /> <span className="font-bold text-night-200">{camp.location}</span></div>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-night-900 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-primary-500 transition-colors">
                                        <Users size={20} className="text-primary-500" />
                                    </div>
                                    <span className="font-black text-white text-2xl tracking-tighter">{camp.participants.length + camp.leaderIds.length}</span>
                                </div>
                                <span className="text-primary-400 text-xs font-black flex items-center gap-2 group-hover:translate-x-[-10px] transition-transform uppercase tracking-[0.2em]">التفاصيل <ArrowUpRight size={24} /></span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 bg-night-800/30 rounded-[4rem] border-4 border-white/5 border-dashed relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-white/5 transform group-hover:rotate-12 transition-transform"><Tent size={80} className="text-night-700" /></div>
                        <p className="text-night-500 text-3xl font-black opacity-50 tracking-tighter">أرشيف المخيمات فارغ حالياً</p>
                        <button onClick={() => setShowAddModal(true)} className="mt-10 px-8 py-3 bg-white/5 hover:bg-white/10 text-primary-400 rounded-2xl font-black border border-white/10 transition-all">ابدأ بتسجيل أول مخيم</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Camps;
