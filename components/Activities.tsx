
import React, { useState } from 'react';
import { Event, Member, UnitName } from '../types';
import { UNITS_LIST } from '../constants';
import { 
    Calendar, MapPin, Users, Plus, ArrowUpRight,
    Clock, Search, X, ChevronLeft, LayoutDashboard, Target, Save, DollarSign, Briefcase, FileText
} from 'lucide-react';

interface ActivitiesProps {
  events: Event[];
  members: Member[];
  type: 'ACTIVITY' | 'CAMP';
  onFinancialTransfer?: any; 
  globalTransactions?: any; 
  onAddNotification?: any;
  onTransferSurplus?: any;
  onUpdateActivity?: (event: Event) => void;
  onAddActivity?: (event: Event) => void;
}

const Activities: React.FC<ActivitiesProps> = ({ events, members, type, onUpdateActivity, onAddActivity }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PARTICIPANTS'>('OVERVIEW');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formTab, setFormTab] = useState(0);

  const initialForm: Partial<Event> = {
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop',
      targetUnits: [],
      participants: [],
      leaderIds: [],
      goals: '',
      cost: 0,
      fee: 0,
      manager: '',
      isClosed: false,
      type: type
  };

  const [formData, setFormData] = useState<Partial<Event>>(initialForm);

  const title = type === 'CAMP' ? 'المخيمات والرحلات' : 'الأنشطة الأسبوعية';

  const handleOpenDetail = (event: Event) => {
      setSelectedEvent(event);
      setView('DETAIL');
      setActiveTab('OVERVIEW');
  };

  const getDaysRemaining = (dateStr: string) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const target = new Date(dateStr);
        target.setHours(0,0,0,0);
        const diff = target.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleSave = () => {
      if (!formData.title || !formData.date) return;
      if (onAddActivity) {
          onAddActivity({ ...formData, id: Date.now().toString() } as Event);
          setShowAddModal(false);
          setFormData(initialForm);
      }
  };

  const renderAddModal = () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/95 backdrop-blur-md p-4 animate-fade-in overflow-hidden">
          <div className="bg-night-800 w-full max-w-2xl rounded-[2rem] border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Plus className="text-primary-500"/> إضافة {type === 'ACTIVITY' ? 'نشاط' : 'مخيم'} جديد</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-night-400 hover:text-white"><X size={24}/></button>
              </div>

              <div className="flex bg-night-900/50 border-b border-white/5">
                  {['المعلومات الأساسية', 'البيانات المالية', 'الأهداف والوصف'].map((t, idx) => (
                      <button key={idx} onClick={() => setFormTab(idx)} className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 ${formTab === idx ? 'border-primary-500 text-primary-400' : 'border-transparent text-night-500 hover:text-white'}`}>{t}</button>
                  ))}
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                  {formTab === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                          <div className="space-y-2"><label className="text-sm font-bold text-night-300">عنوان الفعالية</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                          <div className="space-y-2"><label className="text-sm font-bold text-night-300">التاريخ</label><input type="date" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                          <div className="space-y-2"><label className="text-sm font-bold text-night-300">الموقع</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                          <div className="space-y-2"><label className="text-sm font-bold text-night-300">الوحدات المستهدفة</label><div className="flex flex-wrap gap-2">{UNITS_LIST.map(u => (
                              <button key={u} onClick={() => {
                                  const current = formData.targetUnits || [];
                                  setFormData({...formData, targetUnits: current.includes(u) ? current.filter(x => x !== u) : [...current, u]});
                              }} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${formData.targetUnits?.includes(u) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-night-900 border-white/10 text-night-500'}`}>{u}</button>
                          ))}</div></div>
                      </div>
                  )}

                  {formTab === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                          <div className="space-y-2"><label className="text-sm font-bold text-night-300">التكلفة الإجمالية (تقديرية)</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} /></div>
                          <div className="space-y-2"><label className="text-sm font-bold text-night-300">رسوم اشتراك العضو</label><input type="number" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} /></div>
                          <div className="space-y-2 md:col-span-2"><label className="text-sm font-bold text-night-300">المسؤول عن الفعالية</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} /></div>
                      </div>
                  )}

                  {formTab === 2 && (
                      <div className="space-y-4 animate-fade-in">
                          <div className="space-y-2"><label className="text-sm font-bold text-night-300">أهداف الفعالية / وصف</label><textarea className="w-full h-40 bg-night-900 border border-white/10 rounded-xl p-4 text-white focus:border-primary-500 outline-none resize-none" value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} /></div>
                      </div>
                  )}
              </div>

              <div className="p-6 border-t border-white/10 bg-night-900/50 flex justify-end gap-3">
                  <button onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all">إلغاء</button>
                  <button onClick={handleSave} className="px-8 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-900/30 transition-all flex items-center gap-2"><Save size={18}/> حفظ البيانات</button>
              </div>
          </div>
      </div>
  );

  const renderOverview = () => {
      if (!selectedEvent) return null;
      const daysLeft = getDaysRemaining(selectedEvent.date);

      return (
          <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-night-800/60 p-6 rounded-2xl border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Clock size={24}/></div>
                          <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-night-400">التوقيت</span>
                      </div>
                      <p className="text-sm text-night-400 mb-1">العد التنازلي</p>
                      <p className="text-2xl font-bold text-white">
                          {daysLeft > 0 ? <>{daysLeft} <span className="text-sm">يوم</span></> : (daysLeft === 0 ? 'اليوم' : 'منتهي')}
                      </p>
                  </div>

                  <div className="bg-night-800/60 p-6 rounded-2xl border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-primary-500/10 rounded-xl text-primary-500"><Users size={24}/></div>
                          <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-night-400">المشاركون</span>
                      </div>
                      <p className="text-sm text-night-400 mb-1">الحضور المسجل</p>
                      <p className="text-2xl font-bold text-white">{selectedEvent.participants.length + selectedEvent.leaderIds.length} <span className="text-sm text-night-500">فرد</span></p>
                  </div>

                  <div className="bg-night-800/60 p-6 rounded-2xl border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Target size={24}/></div>
                      </div>
                      <p className="text-sm text-night-400 mb-1">الموقع</p>
                      <p className="text-lg font-bold text-white truncate">{selectedEvent.location}</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-night-800/40 p-8 rounded-[2rem] border border-white/5">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText className="text-primary-500"/> تفاصيل النشاط</h3>
                      <p className="text-night-300 leading-relaxed">{selectedEvent.goals || 'لا يوجد وصف متاح.'}</p>
                      <div className="flex flex-wrap gap-2 mt-6">
                          {selectedEvent.targetUnits.map(unit => (
                              <span key={unit} className="px-3 py-1 bg-night-900 border border-white/10 rounded-full text-xs text-night-400">{unit}</span>
                          ))}
                      </div>
                  </div>

                  <div className="bg-night-800/40 p-8 rounded-[2rem] border border-white/5 space-y-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><DollarSign className="text-emerald-500"/> الميزانية والمالية</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-night-900/50 p-4 rounded-xl border border-white/5">
                              <p className="text-xs text-night-400 mb-1">التكلفة المرصودة</p>
                              <p className="text-xl font-bold text-white font-mono">{selectedEvent.cost.toLocaleString()} DZD</p>
                          </div>
                          <div className="bg-night-900/50 p-4 rounded-xl border border-white/5">
                              <p className="text-xs text-night-400 mb-1">رسوم الاشتراك</p>
                              <p className="text-xl font-bold text-emerald-400 font-mono">{selectedEvent.fee?.toLocaleString()} DZD</p>
                          </div>
                      </div>
                      <div className="bg-night-900/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                          <div>
                              <p className="text-xs text-night-400">مسؤول النشاط</p>
                              <p className="font-bold text-white">{selectedEvent.manager || '---'}</p>
                          </div>
                          <Briefcase className="text-night-600" />
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderParticipants = () => {
      if (!selectedEvent) return null;
      const allParticipants = members.filter(m => selectedEvent.participants.includes(m.id) || selectedEvent.leaderIds.includes(m.id));

      return (
          <div className="animate-fade-in bg-night-800/40 rounded-xl border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-right">
                  <thead className="bg-night-900 text-night-300 text-xs uppercase font-bold tracking-wider">
                      <tr>
                          <th className="p-4">الاسم الكامل</th>
                          <th className="p-4">الوحدة</th>
                          <th className="p-4 text-center">الصفة</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {allParticipants.map(m => (
                          <tr key={m.id} className="hover:bg-white/5 text-sm transition-colors group">
                              <td className="p-4 font-bold text-white flex items-center gap-3">
                                  <img src={m.image} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-primary-500/50 transition-colors" alt={m.fullName}/>
                                  {m.fullName}
                              </td>
                              <td className="p-4 text-night-300">
                                  <span className="bg-white/5 px-3 py-1 rounded-lg text-xs border border-white/5">{m.unit}</span>
                              </td>
                              <td className="p-4 text-night-400 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${m.role.includes('قائد') ? 'bg-blue-600/20 text-blue-400' : 'bg-night-900 text-night-500'}`}>{m.role}</span>
                              </td>
                          </tr>
                      ))}
                      {allParticipants.length === 0 && <tr><td colSpan={3} className="p-12 text-center text-night-500 italic">لا يوجد مشاركين مسجلين في هذا النشاط حالياً</td></tr>}
                  </tbody>
              </table>
          </div>
      );
  };

  if (view === 'DETAIL' && selectedEvent) {
      return (
          <div className="p-8 h-full flex flex-col animate-fade-in relative">
              <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setView('LIST')} className="p-3 bg-night-800 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors group">
                      <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <div>
                      <h2 className="text-3xl font-bold text-white tracking-tight">{selectedEvent.title}</h2>
                      <p className="text-night-400 flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={14} className="text-primary-500"/> {selectedEvent.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} className="text-primary-500"/> {selectedEvent.location}</span>
                      </p>
                  </div>
              </div>
              
              <div className="flex border-b border-white/10 mb-8 bg-night-800/30 p-1 rounded-xl">
                  <button onClick={() => setActiveTab('OVERVIEW')} className={`flex-1 md:flex-initial px-8 py-3 font-bold text-sm rounded-lg transition-all ${activeTab === 'OVERVIEW' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30' : 'text-night-400 hover:text-white hover:bg-white/5'}`}>نظرة عامة</button>
                  <button onClick={() => setActiveTab('PARTICIPANTS')} className={`flex-1 md:flex-initial px-8 py-3 font-bold text-sm rounded-lg transition-all ${activeTab === 'PARTICIPANTS' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30' : 'text-night-400 hover:text-white hover:bg-white/5'}`}>المشاركون</button>
              </div>

              <div className="flex-1 pb-12">
                  {activeTab === 'OVERVIEW' && renderOverview()} 
                  {activeTab === 'PARTICIPANTS' && renderParticipants()}
              </div>
          </div>
      );
  }

  return (
      <div className="p-8 animate-fade-in flex flex-col h-full">
          {showAddModal && renderAddModal()}
          <div className="flex justify-between items-center mb-8">
              <div>
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{title}</h2>
                  <p className="text-night-400">تخطيط وإدارة الأنشطة والبرامج الكشفية للفوج.</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-primary-900/40 transition-transform hover:scale-105 active:scale-95">
                  <Plus size={24} /> نشاط جديد
              </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.length > 0 ? events.map(event => {
                  const daysLeft = getDaysRemaining(event.date);
                  return (
                      <div 
                          key={event.id} 
                          onClick={() => handleOpenDetail(event)}
                          className="bg-night-800 border border-white/5 rounded-3xl overflow-hidden hover:border-primary-500/50 hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col relative"
                      >
                          <div className="h-56 overflow-hidden relative">
                              <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                              <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent opacity-90"></div>
                              <div className={`absolute top-4 left-4 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-white border border-white/10 flex items-center gap-1 shadow-2xl ${daysLeft > 0 ? 'bg-black/60' : 'bg-red-600/80 border-red-500/20'}`}>
                                  <Clock size={14}/> <span>{daysLeft > 0 ? `${daysLeft} يوم متبقي` : 'نشاط منتهي'}</span>
                              </div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                              <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors mb-4 line-clamp-1 tracking-tight">{event.title}</h3>
                              <div className="text-sm text-night-400 space-y-3 mb-8">
                                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5"><Calendar size={18} className="text-primary-500" /> <span className="font-bold text-night-200">{event.date}</span></div>
                                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5"><MapPin size={18} className="text-primary-500" /> <span className="font-bold text-night-200">{event.location}</span></div>
                              </div>
                              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/10">
                                  <div className="flex items-center gap-2 text-night-300">
                                      <div className="flex -space-x-2 rtl:space-x-reverse">
                                          {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-night-800 bg-night-700 flex items-center justify-center"><Users size={12}/></div>)}
                                      </div>
                                      <span className="font-black text-white text-lg mr-1">{event.participants.length + event.leaderIds.length}</span>
                                  </div>
                                  <span className="text-primary-400 text-sm font-black flex items-center gap-2 group-hover:translate-x-[-8px] transition-transform uppercase tracking-widest">عرض التفاصيل <ArrowUpRight size={20} /></span>
                              </div>
                          </div>
                      </div>
                  );
              }) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-32 bg-night-800/30 rounded-[3rem] border-4 border-white/5 border-dashed">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner"><Calendar size={64} className="text-night-700" /></div>
                      <p className="text-night-500 text-2xl font-black opacity-50 tracking-tight">لا توجد أنشطة مسجلة حالياً في النظام</p>
                      <button onClick={() => setShowAddModal(true)} className="mt-8 text-primary-400 font-bold hover:underline">اضغط هنا لإضافة أول نشاط</button>
                  </div>
              )}
          </div>
      </div>
  );
};

export default Activities;
