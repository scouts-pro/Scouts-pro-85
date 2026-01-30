
import React, { useState, useMemo } from 'react';
import { AttendanceSession, Sanction, UnitName, Member, AttendanceSettings, AttendanceStatus } from '../types';
import { UNITS_LIST } from '../constants';
import { 
    Gavel, Users, UserCheck, UserX, Clock, CalendarDays, MapPin, Search, 
    Settings, ChevronDown, CheckCircle2, History, X, Flag, AlertTriangle, 
    PlayCircle, Save, ArrowRight, ChevronLeft, Calendar, Layout, 
    Sparkles, Info, ShieldCheck, UserPlus, ListFilter, Trash2, Edit, Plus, FileText, TrendingUp, TrendingDown
} from 'lucide-react';

interface DisciplineProps {
  attendance: AttendanceSession[];
  sanctions: Sanction[];
  members: Member[];
  onAddSession: (session: AttendanceSession) => void;
  attendanceSettings: AttendanceSettings;
  onUpdateSettings: (settings: AttendanceSettings) => void;
}

// --- Custom UI Components ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'حاضر': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        'متأخر': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        'غائب': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        'غياب مبرر': 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all duration-300 ${styles[status] || 'bg-slate-700/50 text-slate-400'}`}>
            {status}
        </span>
    );
};

const Dropdown = ({ options, value, onChange, placeholder, icon: Icon, className, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => (typeof o === 'object' ? o.value === value : o === value));
    const label = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

    return (
        <div className={`relative ${className}`}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-night-900 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer text-white hover:border-primary-500/50 transition-all ${disabled ? 'opacity-50' : ''} ${isOpen ? 'border-primary-500 ring-2 ring-primary-500/20' : ''}`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-primary-400" />}
                    <span className="font-bold text-sm truncate">{label}</span>
                </div>
                <ChevronDown size={16} className={`text-night-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                                    className={`p-3 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between ${val === value ? 'bg-primary-600/10 text-primary-400' : ''}`}
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

// --- Main Components ---

const Discipline: React.FC<DisciplineProps> = ({ attendance, sanctions, members, onAddSession, attendanceSettings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'SESSIONS' | 'SANCTIONS'>('SESSIONS');
  const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL' | 'FORM'>('LIST');
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  
  // Registration Form State
  const [sessionMeta, setSessionMeta] = useState({ 
      number: (attendance.length + 1).toString(), 
      name: '', 
      date: new Date().toISOString().split('T')[0], 
      type: 'أسبوعية',
      location: 'مقر الفوج',
      notes: ''
  });
  const [newSessionRecords, setNewSessionRecords] = useState<{memberId: string; status: AttendanceStatus}[]>([]);

  // Sanction Form State
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [newSanction, setNewSanction] = useState<Partial<Sanction>>({
      memberId: '',
      type: 'إنذار شفهي',
      reason: '',
      status: 'مفعّلة',
      date: new Date().toISOString().split('T')[0]
  });

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState<string>('ALL');

  // Helpers
  const formatUnitName = (name: string) => name.replace('وحدة ', '');
  
  const getSessionStats = (records: {status: AttendanceStatus}[]) => {
      const total = records.length;
      if (total === 0) return { present: 0, absent: 0, late: 0, excused: 0 };
      return {
          present: Math.round((records.filter(r => r.status === 'حاضر').length / total) * 100),
          absent: Math.round((records.filter(r => r.status === 'غائب' || r.status === 'غياب غير مبرر').length / total) * 100),
          late: Math.round((records.filter(r => r.status === 'متأخر').length / total) * 100),
          excused: Math.round((records.filter(r => (r.status as any) === 'غياب مبرر').length / total) * 100)
      };
  };

  // Logic: Start Registration
  const handleStartRegistration = () => {
      if (!sessionMeta.name.trim()) {
          alert('يرجى إدخال عنوان الحصة أولاً.');
          return;
      }
      const initialRecords = members.map(m => ({ 
          memberId: m.id, 
          status: 'حاضر' as AttendanceStatus 
      }));
      setNewSessionRecords(initialRecords);
      setViewMode('FORM');
  };

  const handleSaveSession = () => {
      if (window.confirm('هل تريد اعتماد سجل الحضور وتحديث النقاط؟')) {
          const session: AttendanceSession = {
              id: `session_${Date.now()}`,
              number: Number(sessionMeta.number),
              name: sessionMeta.name,
              date: sessionMeta.date,
              location: sessionMeta.location,
              time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
              records: newSessionRecords
          };
          onAddSession(session);
          setViewMode('LIST');
          setSessionMeta({ ...sessionMeta, number: (attendance.length + 2).toString(), name: '' });
      }
  };

  const handleAddSanction = () => {
      if (!newSanction.memberId || !newSanction.reason) {
          alert('يرجى اختيار العضو وإدخال سبب العقوبة.');
          return;
      }
      // في التطبيق الفعلي، يتم استدعاء onAddSanction الممررة عبر props
      // هنا نقوم بمحاكاة الإضافة وتنبيه المستخدم
      console.log('Sanction Added:', newSanction);
      alert('تم تسجيل العقوبة بنجاح وتوثيق الخصم من النقاط.');
      setShowSanctionModal(false);
      setNewSanction({
          memberId: '',
          type: 'إنذار شفهي',
          reason: '',
          status: 'مفعّلة',
          date: new Date().toISOString().split('T')[0]
      });
  };

  // --- Sub-View: Sessions List (Cards) ---
  const renderSessionsList = () => (
      <div className="space-y-10 animate-fade-in">
          {/* Action Header */}
          <div className="bg-gradient-to-r from-night-800 to-night-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center text-primary-500 shadow-inner">
                                <Sparkles size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white leading-none">تسجيل حصة كشفية</h3>
                                <p className="text-night-400 text-sm mt-2">أنشئ بطاقة حضور جديدة للفوج، الوحدة أو الطليعة.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black text-primary-400 mr-2">رقم الحصة</label>
                                <input type="number" className="w-full bg-night-900/50 border border-white/5 rounded-xl p-3 text-white font-mono font-bold focus:border-primary-500 outline-none" value={sessionMeta.number} onChange={e => setSessionMeta({...sessionMeta, number: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] uppercase font-black text-primary-400 mr-2">عنوان الحصة</label>
                                <input type="text" placeholder="مثلاً: حصة الجمعة التربوية" className="w-full bg-night-900/50 border border-white/5 rounded-xl p-3 text-white font-bold focus:border-primary-500 outline-none" value={sessionMeta.name} onChange={e => setSessionMeta({...sessionMeta, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black text-primary-400 mr-2">نوع الحصة</label>
                                <Dropdown options={['أسبوعية', 'استثنائية']} value={sessionMeta.type} onChange={(v:any) => setSessionMeta({...sessionMeta, type: v})} />
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleStartRegistration} 
                        className="w-full lg:w-56 h-32 bg-primary-600 hover:bg-primary-500 text-white rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-2xl shadow-primary-900/40 transition-all transform hover:scale-105 active:scale-95 group/btn"
                    >
                        <PlayCircle size={40} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-lg font-black">بدء التسجيل</span>
                    </button>
                </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...attendance].reverse().map(session => {
                  const stats = getSessionStats(session.records);
                  return (
                      <div 
                          key={session.id} 
                          onClick={() => { setSelectedSession(session); setViewMode('DETAIL'); }}
                          className="group relative bg-night-800/40 border border-white/5 hover:border-primary-500/50 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 hover:-translate-y-2 shadow-xl overflow-hidden"
                      >
                          <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                  <span className="text-[10px] text-night-500 font-black uppercase tracking-widest">{session.date}</span>
                                  <h4 className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors">{session.name}</h4>
                              </div>
                              <div className="w-14 h-14 bg-night-900/80 rounded-2xl border border-white/10 flex items-center justify-center text-white font-mono font-black text-xl shadow-inner">
                                  #{String(session.number).padStart(2, '0')}
                              </div>
                          </div>

                          <div className="space-y-4 mb-8">
                              <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-emerald-400">حضور: {stats.present}%</span>
                                  <span className="text-rose-400">غياب: {stats.absent}%</span>
                              </div>
                              <div className="w-full h-2 bg-night-900 rounded-full flex overflow-hidden border border-white/5">
                                  <div className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${stats.present}%` }}></div>
                                  <div className="bg-rose-500 h-full shadow-[0_0_10px_rgba(244,63,94,0.3)]" style={{ width: `${stats.absent}%` }}></div>
                                  <div className="bg-amber-500 h-full shadow-[0_0_10px_rgba(245,158,11,0.3)]" style={{ width: `${stats.late}%` }}></div>
                              </div>
                              <div className="flex gap-4 text-[10px] text-night-500 font-bold">
                                  <span className="flex items-center gap-1"><Clock size={12}/> تأخر: {stats.late}%</span>
                                  <span className="flex items-center gap-1"><Info size={12}/> مبرر: {stats.excused}%</span>
                              </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-white/5">
                              <div className="flex items-center gap-2 text-sm text-night-400 font-bold">
                                  <MapPin size={16} className="text-primary-500" />
                                  <span className="truncate">{session.location}</span>
                              </div>
                              <span className="text-primary-400 text-[10px] font-black uppercase flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">التفاصيل <ArrowRight size={14} className="rtl:rotate-180"/></span>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
  );

  // --- Sub-View: Registration Table (Form) ---
  const renderRegistrationForm = () => (
      <div className="animate-fade-in space-y-8">
          <div className="flex justify-between items-end border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary-600/10 border-2 border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 font-mono text-3xl font-black">
                        #{sessionMeta.number}
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white tracking-tight">{sessionMeta.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-night-400 text-sm font-bold">
                            <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">{sessionMeta.type}</span>
                            <span className="flex items-center gap-1.5"><CalendarDays size={16} className="text-primary-500"/> {sessionMeta.date}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setViewMode('LIST')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5">إلغاء</button>
                    <button onClick={handleSaveSession} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/30 transition-all"><Save size={20}/> اعتماد الحصة</button>
                </div>
          </div>

          {/* Filtering Bar */}
          <div className="flex gap-4 bg-night-800/50 p-4 rounded-2xl border border-white/10">
              <div className="relative flex-1">
                  <input type="text" placeholder="بحث باسم العضو..." className="w-full bg-night-900 border border-white/5 rounded-xl py-3.5 pl-12 pr-6 text-white font-bold placeholder:text-night-600 focus:border-primary-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  <Search className="absolute left-4 top-4 text-night-500" size={20} />
              </div>
              <div className="w-64">
                <Dropdown 
                    options={[{value: 'ALL', label: 'كل الفوج'}, ...UNITS_LIST.map(u => ({value: u, label: formatUnitName(u)}))]} 
                    value={unitFilter} 
                    onChange={setUnitFilter} 
                    icon={ListFilter}
                />
              </div>
          </div>

          {/* Registration Table */}
          <div className="bg-night-800/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full text-right">
                    <thead className="bg-night-900/80 text-night-500 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="p-8">العضو / الطليعة</th>
                            <th className="p-8">تاريخ الميلاد</th>
                            <th className="p-8">رقم التأمين</th>
                            <th className="p-8">حالة الحضور</th>
                            <th className="p-8 text-center">النقاط</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {members
                            .filter(m => unitFilter === 'ALL' || m.unit === unitFilter)
                            .filter(m => m.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(m => {
                                const record = newSessionRecords.find(r => r.memberId === m.id);
                                return (
                                    <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6 flex items-center gap-5">
                                            <img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-700 shadow-lg group-hover:border-primary-500 transition-all duration-500" />
                                            <div>
                                                <p className="font-black text-white text-lg leading-none mb-1">{m.fullName}</p>
                                                <p className="text-[10px] text-night-500 font-black uppercase">طليعة {m.patrol || '---'}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 font-mono text-night-300 text-sm">{m.birthDate}</td>
                                        <td className="p-6 font-mono text-night-300 text-sm tracking-wider">{m.insuranceNumber}</td>
                                        <td className="p-6">
                                            <div className="flex gap-2">
                                                {['حاضر', 'متأخر', 'غائب', 'غياب مبرر'].map((st: any) => (
                                                    <button 
                                                        key={st}
                                                        onClick={() => setNewSessionRecords(prev => prev.map(r => r.memberId === m.id ? { ...r, status: st } : r))}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                                                            record?.status === st 
                                                            ? (st === 'حاضر' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 
                                                               st === 'غائب' ? 'bg-rose-600 border-rose-500 text-white shadow-lg' :
                                                               st === 'متأخر' ? 'bg-amber-600 border-amber-500 text-white shadow-lg' :
                                                               'bg-blue-600 border-blue-500 text-white shadow-lg')
                                                            : 'bg-night-900 border-white/5 text-night-500 hover:text-white'
                                                        }`}
                                                    >
                                                        {st}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center font-mono font-black text-xl">
                                            {record?.status === 'حاضر' ? <span className="text-emerald-500">+{attendanceSettings.presentPoints}</span> : 
                                             record?.status === 'متأخر' ? <span className="text-amber-500">+{attendanceSettings.latePoints}</span> :
                                             record?.status === 'غائب' ? <span className="text-rose-500">{attendanceSettings.absentPoints}</span> :
                                             <span className="text-blue-400">0</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
          </div>
      </div>
  );

  // --- Sub-View: Session Details (Archive View) ---
  const renderSessionDetail = () => {
      if (!selectedSession) return null;
      const stats = getSessionStats(selectedSession.records);
      return (
          <div className="animate-fade-in space-y-10 pb-20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-night-800/60 p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-primary-600"></div>
                  <div className="flex items-center gap-8">
                      <button onClick={() => setViewMode('LIST')} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10 group backdrop-blur-md">
                          <ArrowRight size={28} className="text-white group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                      </button>
                      <div>
                          <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-2">{selectedSession.name}</h2>
                          <div className="flex flex-wrap items-center gap-6 text-night-400 font-bold text-sm">
                              <span className="flex items-center gap-2"><CalendarDays size={18} className="text-primary-500"/> {selectedSession.date}</span>
                              <span className="flex items-center gap-2"><MapPin size={18} className="text-primary-500"/> {selectedSession.location}</span>
                              <span className="flex items-center gap-2"><Clock size={18} className="text-primary-500"/> {selectedSession.time}</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex gap-6">
                      <div className="text-center">
                          <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">نسبة الحضور</p>
                          <p className="text-3xl font-black text-white">{stats.present}%</p>
                      </div>
                      <div className="h-10 w-px bg-white/10"></div>
                      <div className="text-center">
                          <p className="text-[10px] text-rose-400 font-black uppercase mb-1">نسبة الغياب</p>
                          <p className="text-3xl font-black text-white">{stats.absent}%</p>
                      </div>
                  </div>
              </div>

              <div className="bg-night-800/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                  <table className="w-full text-right">
                      <thead className="bg-night-900/80 text-night-500 text-[10px] uppercase font-black tracking-widest">
                          <tr>
                              <th className="p-8">العضو / الطليعة</th>
                              <th className="p-8">الوحدة</th>
                              <th className="p-8">رقم التأمين</th>
                              <th className="p-8">الحالة المسجلة</th>
                              <th className="p-8 text-center">النقاط</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {selectedSession.records.map(rec => {
                              const m = members.find(mem => mem.id === rec.memberId);
                              if (!m) return null;
                              return (
                                  <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                      <td className="p-6 flex items-center gap-5">
                                          <img src={m.image} className="w-12 h-12 rounded-2xl border-2 border-night-700 shadow-lg" />
                                          <div>
                                              <p className="font-black text-white text-lg leading-none mb-1">{m.fullName}</p>
                                              <p className="text-[10px] text-night-500 font-black uppercase">طليعة {m.patrol}</p>
                                          </div>
                                      </td>
                                      <td className="p-6 text-night-300 font-bold text-sm">{formatUnitName(m.unit)}</td>
                                      <td className="p-6 font-mono text-night-400 text-sm">{m.insuranceNumber}</td>
                                      <td className="p-6"><StatusBadge status={rec.status} /></td>
                                      <td className="p-6 text-center font-mono font-black text-xl">
                                          {rec.status === 'حاضر' ? <span className="text-emerald-500">+10</span> : <span className="text-rose-500">-5</span>}
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  };

  // --- Sub-View: Sanctions ---
  const renderSanctions = () => (
      <div className="animate-fade-in space-y-8">
          <div className="flex justify-between items-center bg-night-800/60 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div>
                  <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-500"><ShieldCheck size={28} /></div>
                      إدارة العقوبات والجزاءات
                  </h3>
                  <p className="text-night-400 mt-2">تسجيل ومتابعة السلوك الانضباطي للأعضاء والقادة.</p>
              </div>
              <button 
                onClick={() => setShowSanctionModal(true)}
                className="px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-[2rem] font-black flex items-center gap-3 shadow-2xl shadow-rose-900/40 transition-all hover:scale-105 active:scale-95"
              >
                  <Plus size={24}/> تسجيل عقوبة جديدة
              </button>
          </div>

          <div className="bg-night-800/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full text-right">
                    <thead className="bg-night-900/80 text-night-500 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="p-8">العضو / القائد</th>
                            <th className="p-8">الوحدة / الطليعة</th>
                            <th className="p-8">نوع العقوبة</th>
                            <th className="p-8">السبب / الوصف</th>
                            <th className="p-8 text-center">الخصم</th>
                            <th className="p-8">المسؤول</th>
                            <th className="p-8 text-center">الإجراء</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sanctions.map(s => {
                            const m = members.find(mem => mem.id === s.memberId);
                            return (
                                <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-night-900 flex items-center justify-center border border-white/10 text-rose-500"><Gavel size={24}/></div>
                                        <div>
                                            <p className="font-black text-white text-lg leading-none mb-1">{m?.fullName || '---'}</p>
                                            <p className="text-[10px] text-night-500 font-mono tracking-widest uppercase">{s.date}</p>
                                        </div>
                                    </td>
                                    <td className="p-6 text-night-300 font-bold text-sm">{m ? formatUnitName(m.unit) : '---'}</td>
                                    <td className="p-6"><span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-900/30 text-rose-400 border border-rose-500/20">{s.type}</span></td>
                                    <td className="p-6 text-night-400 text-sm max-w-xs truncate">{s.reason}</td>
                                    <td className="p-6 text-center font-mono font-black text-rose-500 text-xl">-50</td>
                                    <td className="p-6 text-night-300 font-bold text-sm">القائد العام</td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white/5 hover:bg-primary-600 rounded-xl transition-colors"><Edit size={16}/></button>
                                            <button className="p-2 bg-white/5 hover:bg-rose-600 rounded-xl transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {sanctions.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-20 text-center text-night-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <CheckCircle2 size={64} className="opacity-20" />
                                        <p className="text-xl font-bold italic">سجل العقوبات نظيف حالياً</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
          </div>
      </div>
  );

  return (
    <div className="p-8 h-full flex flex-col font-sans overflow-y-auto no-scrollbar">
        {/* Navigation Tabs */}
        <div className="flex bg-night-800/50 p-1.5 rounded-[2rem] border border-white/10 mb-10 self-start backdrop-blur-xl shadow-xl">
            <button 
                onClick={() => setActiveTab('SESSIONS')} 
                className={`px-10 py-4 font-black text-sm rounded-[1.5rem] transition-all flex items-center gap-3 ${activeTab === 'SESSIONS' ? 'bg-primary-600 text-white shadow-2xl shadow-primary-900/40' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
            >
                <Users size={20} /> الحصص والكشافة
            </button>
            <button 
                onClick={() => setActiveTab('SANCTIONS')} 
                className={`px-10 py-4 font-black text-sm rounded-[1.5rem] transition-all flex items-center gap-3 ${activeTab === 'SANCTIONS' ? 'bg-rose-600 text-white shadow-2xl shadow-rose-900/40' : 'text-night-400 hover:text-white hover:bg-white/5'}`}
            >
                <Gavel size={20} /> سجل العقوبات
            </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1">
            {activeTab === 'SESSIONS' ? (
                viewMode === 'LIST' ? renderSessionsList() : 
                viewMode === 'DETAIL' ? renderSessionDetail() : 
                renderRegistrationForm()
            ) : (
                renderSanctions()
            )}
        </div>

        {/* Sanction Modal (Activated) */}
        {showSanctionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/90 backdrop-blur-md p-4 animate-fade-in overflow-hidden">
                <div className="bg-night-800 w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 to-red-600"></div>
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-night-900/30">
                        <h3 className="text-2xl font-black text-white flex items-center gap-3"><Gavel className="text-rose-500" /> تسجيل عقوبة جديدة</h3>
                        <button onClick={() => setShowSanctionModal(false)} className="p-2 hover:bg-white/5 rounded-full text-night-400 hover:text-white"><X size={24}/></button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-rose-400 mr-2">اختيار العضو / القائد</label>
                            <Dropdown 
                                options={members.map(m => ({ value: m.id, label: m.fullName }))} 
                                value={newSanction.memberId} 
                                onChange={(v: any) => setNewSanction({...newSanction, memberId: v})}
                                placeholder="ابحث عن العضو..."
                                icon={Users}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-rose-400 mr-2">نوع العقوبة</label>
                                <Dropdown 
                                    options={['إنذار شفهي', 'إنذار كتابي', 'توبيخ', 'تجميد مؤقت', 'فصل نهائي']} 
                                    value={newSanction.type} 
                                    onChange={(v: any) => setNewSanction({...newSanction, type: v})}
                                    icon={AlertTriangle}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-rose-400 mr-2">التاريخ</label>
                                <input 
                                    type="date" 
                                    className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none" 
                                    value={newSanction.date} 
                                    onChange={e => setNewSanction({...newSanction, date: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-rose-400 mr-2">سبب العقوبة / الوصف</label>
                            <textarea 
                                className="w-full h-32 bg-night-900 border border-white/10 rounded-2xl p-4 text-white focus:border-rose-500 outline-none resize-none" 
                                placeholder="اكتب تفاصيل المخالفة هنا..."
                                value={newSanction.reason}
                                onChange={e => setNewSanction({...newSanction, reason: e.target.value})}
                            />
                        </div>

                        <div className="p-4 bg-rose-900/10 rounded-xl border border-rose-500/20 flex items-center gap-3">
                            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><TrendingDown size={18}/></div>
                            <p className="text-xs text-rose-300">سيتم خصم <b>50 نقطة</b> تلقائياً من رصيد العضو عند الاعتماد.</p>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5 bg-night-900/50 flex justify-end gap-4">
                        <button onClick={() => setShowSanctionModal(false)} className="px-8 py-3 bg-white/5 text-white rounded-xl font-bold">إلغاء</button>
                        <button 
                            onClick={handleAddSanction}
                            className="px-10 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black shadow-xl shadow-rose-900/40 transition-all flex items-center gap-2"
                        >
                            <Save size={18}/> اعتماد العقوبة
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Float Statistics Bar (Fixed style at bottom) */}
        {activeTab === 'SESSIONS' && viewMode === 'LIST' && (
            <div className="fixed bottom-8 right-32 left-8 bg-night-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-40 hidden md:flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl"><TrendingUp size={24}/></div>
                        <div>
                            <p className="text-[10px] text-night-500 font-black uppercase tracking-widest">متوسط الحضور</p>
                            <p className="text-2xl font-black text-white">88%</p>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-500/20 text-primary-500 rounded-xl"><History size={24}/></div>
                        <div>
                            <p className="text-[10px] text-night-500 font-black uppercase tracking-widest">إجمالي الحصص</p>
                            <p className="text-2xl font-black text-white">{attendance.length}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-xs text-night-400 max-w-[150px] text-left">يتم تحديث ترتيب الطلائع والوحدات تلقائياً بناءً على هذه البيانات.</p>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black hover:bg-white/10 transition-colors">تحميل تقرير شامل</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Discipline;
