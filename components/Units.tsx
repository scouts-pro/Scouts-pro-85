
import React, { useState, useEffect } from 'react';
import { UnitName, Patrol, Member, MemberRole } from '../types';
import { UNITS_LIST } from '../constants';
import { 
    Tent, Users, ChevronLeft, Shield, Medal, Settings, Flag, 
    ChevronDown, Edit3, Power, Save, ArrowRight, LayoutGrid, List, 
    Quote, Image as ImageIcon, Star, Zap, Crown, Target, Plus, X, UserCog, Check, ArrowLeft,
    AlertCircle, Loader2, CheckCircle2, MoreHorizontal, Copy, Activity, User, Upload
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

interface UnitsProps {
  members: Member[];
  patrols: Patrol[];
  onAddPatrol?: (patrol: Patrol) => void;
  onUpdatePatrol?: (patrol: Patrol) => void;
  onUpdateMember?: (member: Member) => void;
}

// Local interface for Unit Metadata
interface UnitMetadata {
    description: string;
    slogan: string; // شعار الوحدة
    image?: string; // صورة الوحدة (Base64)
    leaderId: string;
    deputyLeaderId: string; // نائب قائد الوحدة
    assistantLeaderId: string; // مساعد قائد الوحدة
    seniorPatrolLeaderId: string; // العريف الأكبر
    isActive: boolean;
    color: string;
    shadowColor: string;
    gradient: string;
    icon: any;
}

// --- Custom Components ---

const Dropdown = ({ options, value, onChange, placeholder, disabled, label }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o: any) => o.value === value);
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className="space-y-2">
            {label && <label className="text-xs text-primary-200/80 font-bold block uppercase tracking-wider">{label}</label>}
            <div className="relative">
                <div 
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full bg-night-900/50 border border-white/10 rounded-xl p-3 flex items-center justify-between cursor-pointer text-white focus:border-primary-500 transition-all hover:bg-white/5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isOpen ? 'ring-1 ring-primary-500 border-primary-500' : ''}`}
                >
                    <span className="truncate">{displayLabel || 'اختر...'}</span>
                    <ChevronDown size={16} className={`text-night-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full left-0 w-full mt-1 bg-night-800 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                            {options.map((opt: any) => (
                                <div 
                                    key={opt.value} 
                                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={`p-3 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0 flex items-center justify-between ${opt.value === value ? 'bg-primary-600/10 text-primary-400' : ''}`}
                                >
                                    {opt.label}
                                    {opt.value === value && <Check size={14}/>}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const SCOUT_MISSION_ROLES = [
    'عريف الطليعة', 'نائب العريف', 'أمين السر', 'أمين الصندوق',
    'مسؤول العتاد', 'مسؤول الإعلام', 'مسؤول التحدي', 'مسعف', 'طاهي', 'عضو'
];

const Units: React.FC<UnitsProps> = ({ members, patrols, onAddPatrol, onUpdatePatrol, onUpdateMember }) => {
  const [selectedUnit, setSelectedUnit] = useState<UnitName | null>(null);
  const [selectedPatrol, setSelectedPatrol] = useState<Patrol | null>(null);
  const [activeTab, setActiveTab] = useState<'PATROLS' | 'MEMBERS' | 'SETTINGS'>('PATROLS');
  const [patrolViewMode, setPatrolViewMode] = useState<'GRID' | 'LIST'>('GRID');

  // Modal States
  const [showAddPatrolModal, setShowAddPatrolModal] = useState(false);
  const [editingPatrol, setEditingPatrol] = useState<Patrol | null>(null);
  const [patrolFormData, setPatrolFormData] = useState({ name: '', slogan: '', chant: '' });

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMemberForRole, setSelectedMemberForRole] = useState<Member | null>(null);
  const [newRole, setNewRole] = useState('');

  // UI States
  const [selectedPatrolFilter, setSelectedPatrolFilter] = useState<string>('ALL');
  const [isSavingSettings, setIsSavingSettings] = useState(false); // For Loading State

  // Enhanced Metadata
  const [unitsData, setUnitsData] = useState<Record<string, UnitMetadata>>({
    [UnitName.BRAEM]: { description: 'مرحلة الطفولة المبكرة، نركز على اللعب والتعلم.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-blue-400', shadowColor: 'shadow-blue-500/20', gradient: 'from-blue-500 to-cyan-400', icon: Tent },
    [UnitName.BRAEMAT]: { description: 'مرحلة البرعمات، بداية الاستكشاف واللعب.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-pink-400', shadowColor: 'shadow-pink-500/20', gradient: 'from-pink-500 to-rose-400', icon: Tent },
    [UnitName.ASHBAL]: { description: 'مرحلة الأشبال، بداية المغامرة الكشفية.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-yellow-400', shadowColor: 'shadow-yellow-500/20', gradient: 'from-yellow-500 to-orange-400', icon: Tent },
    [UnitName.ZAHARAT]: { description: 'مرحلة الزهرات، عالم من الإبداع والنشاط.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-rose-400', shadowColor: 'shadow-rose-500/20', gradient: 'from-rose-500 to-pink-400', icon: Tent },
    [UnitName.KASHAF]: { description: 'مرحلة الكشاف، الاعتماد على النفس وحياة الخلاء.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-emerald-400', shadowColor: 'shadow-emerald-500/20', gradient: 'from-emerald-500 to-teal-400', icon: Tent },
    [UnitName.MORSHIDAT]: { description: 'مرحلة المرشدات، الريادة والقيادة النسوية.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-teal-400', shadowColor: 'shadow-teal-500/20', gradient: 'from-teal-500 to-cyan-400', icon: Tent },
    [UnitName.MOTAQADEM]: { description: 'مرحلة المتقدم، التحدي والمغامرة الكبرى.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-red-500', shadowColor: 'shadow-red-500/20', gradient: 'from-red-600 to-orange-500', icon: Tent },
    [UnitName.MOTAQADEMAT]: { description: 'مرحلة المتقدمات، آفاق جديدة.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-orange-400', shadowColor: 'shadow-orange-500/20', gradient: 'from-orange-500 to-amber-400', icon: Tent },
    [UnitName.JAWALA]: { description: 'مرحلة الجوالة، خدمة وتنمية المجتمع.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-purple-500', shadowColor: 'shadow-purple-500/20', gradient: 'from-purple-600 to-indigo-500', icon: Tent },
    [UnitName.JAWALAT]: { description: 'مرحلة الجوالات، عطاء بلا حدود.', slogan: '', image: '', leaderId: '', deputyLeaderId: '', assistantLeaderId: '', seniorPatrolLeaderId: '', isActive: true, color: 'text-violet-400', shadowColor: 'shadow-violet-500/20', gradient: 'from-violet-600 to-fuchsia-500', icon: Tent },
  });

  // Derived Data
  const getUnitMembers = (unit: UnitName) => members.filter(m => m.unit === unit);
  const getUnitPatrols = (unit: UnitName) => patrols.filter(p => p.unit === unit);
  const getLeaderTitle = (unit: UnitName) => (unit === UnitName.ASHBAL || unit === UnitName.ZAHARAT) ? 'سادوس' : 'عريف';

  // --- Handlers ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUnit) return;
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUnitsData(prev => ({
                ...prev,
                [selectedUnit]: { ...prev[selectedUnit], image: reader.result as string }
            }));
        };
        reader.readAsDataURL(file);
    }
  };

  // Patrol Management
  const handleOpenAddModal = () => {
      setEditingPatrol(null);
      setPatrolFormData({ name: '', slogan: '', chant: '' });
      setShowAddPatrolModal(true);
  };

  const handleOpenManageModal = (patrol: Patrol) => {
      setEditingPatrol(patrol);
      setPatrolFormData({ name: patrol.name, slogan: patrol.slogan, chant: patrol.chant || '' });
      setShowAddPatrolModal(true);
  };

  const handleConfirmPatrolForm = () => {
      if (!selectedUnit || !patrolFormData.name) return;
      
      if (editingPatrol && onUpdatePatrol) {
          const updated: Patrol = { ...editingPatrol, name: patrolFormData.name, slogan: patrolFormData.slogan || '', chant: patrolFormData.chant || '' };
          onUpdatePatrol(updated);
          if (selectedPatrol && selectedPatrol.id === updated.id) setSelectedPatrol(updated); // Update view if open
      } else if (onAddPatrol) {
          const newPatrol: Patrol = {
              id: `p_${Date.now()}`, name: patrolFormData.name, slogan: patrolFormData.slogan || 'طليعة جديدة',
              chant: patrolFormData.chant || '', logo: '', unit: selectedUnit
          };
          onAddPatrol(newPatrol);
      }
      setShowAddPatrolModal(false);
  };

  // Role Assignment
  const openRoleModal = (member: Member) => {
      setSelectedMemberForRole(member);
      setNewRole(member.scoutMission || 'عضو');
      setShowRoleModal(true);
  };

  const handleSaveRole = () => {
      if (selectedMemberForRole && onUpdateMember) {
          onUpdateMember({ ...selectedMemberForRole, scoutMission: newRole });
      }
      setShowRoleModal(false);
      setSelectedMemberForRole(null);
  };

  // Unit Settings
  const handleSaveUnitSettings = () => {
      setIsSavingSettings(true);
      // Simulate API call
      setTimeout(() => {
          setIsSavingSettings(false);
          // In a real app, you would save this to backend. Here we updated local state `unitsData`.
          alert(`تم حفظ إعدادات ${selectedUnit} بنجاح!`);
      }, 1000);
  };

  const toggleUnitStatus = () => {
      if(selectedUnit) {
          const newState = !unitsData[selectedUnit].isActive;
          setUnitsData(prev => ({...prev, [selectedUnit]: {...prev[selectedUnit], isActive: newState}}));
      }
  };

  // --- Views ---

  // 1. Patrol Detail View (The Elegant Drill-down)
  const renderPatrolDetail = () => {
      if (!selectedPatrol || !selectedUnit) return null;
      const patrolMembers = members.filter(m => m.patrol === selectedPatrol.name && m.unit === selectedUnit);
      const metadata = unitsData[selectedUnit];

      return (
          <div className="animate-fade-in space-y-8">
              {/* Header Card */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl bg-night-800 group">
                  <div className={`absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l ${metadata.gradient} opacity-20 transition-opacity duration-500`}></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
                  
                  <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                      <div className="flex items-center gap-6">
                          <button onClick={() => setSelectedPatrol(null)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10 group/btn backdrop-blur-md">
                              <ArrowRight size={24} className="text-white group-hover/btn:-translate-x-1 transition-transform rtl:rotate-180" />
                          </button>
                          
                          <div className="flex items-center gap-6">
                              <div className="w-24 h-24 rounded-3xl bg-night-900/50 border-2 border-white/10 flex items-center justify-center shadow-2xl relative group/icon">
                                  <div className={`absolute inset-0 bg-gradient-to-br ${metadata.gradient} opacity-0 group-hover/icon:opacity-20 transition-opacity rounded-3xl`}></div>
                                  {selectedPatrol.logo ? (
                                      <img src={selectedPatrol.logo} className="w-full h-full rounded-3xl object-cover"/>
                                  ) : (
                                      <Flag size={40} className={metadata.color}/>
                                  )}
                              </div>
                              <div>
                                  <div className="flex items-center gap-3 mb-2">
                                      <h2 className="text-4xl font-bold text-white tracking-tight leading-none">طليعة {selectedPatrol.name}</h2>
                                      <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-bold text-night-300 backdrop-blur-sm">
                                          {selectedUnit}
                                      </span>
                                  </div>
                                  <p className="text-primary-200 text-lg font-medium italic opacity-80">"{selectedPatrol.slogan}"</p>
                              </div>
                          </div>
                      </div>

                      {/* Action Button */}
                      <button 
                          onClick={() => handleOpenManageModal(selectedPatrol)}
                          className="group/action flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 rounded-2xl text-white font-bold transition-all shadow-lg hover:shadow-primary-900/20 backdrop-blur-md"
                      >
                          <Settings size={20} className="text-night-300 group-hover/action:text-white transition-colors group-hover/action:rotate-90 duration-500" />
                          <span>إعدادات الطليعة</span>
                      </button>
                  </div>
              </div>

              {/* Members List (Elegant Table) */}
              <div className="bg-night-800/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-night-900/30">
                      <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                          <Users className={metadata.color} size={22}/> 
                          أفراد الطليعة <span className="bg-white/5 px-2 py-0.5 rounded text-sm text-night-400">{patrolMembers.length}</span>
                      </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                      <table className="w-full text-right border-collapse">
                          <thead className="bg-night-900/80 text-night-300 text-xs uppercase font-bold tracking-wider">
                              <tr>
                                  <th className="p-5 pl-8 text-right">العضو</th>
                                  <th className="p-5 text-right">تاريخ الميلاد</th>
                                  <th className="p-5 text-right">الوحدة</th>
                                  <th className="p-5 text-right">المهمة الكشفية</th>
                                  <th className="p-5 text-center">إجراءات</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {patrolMembers.map(member => {
                                  const isLeader = member.scoutMission.includes('عريف') || member.scoutMission.includes('سادوس');
                                  return (
                                      <tr key={member.id} className="hover:bg-white/5 transition-colors group/row">
                                          <td className="p-4 pl-8">
                                              <div className="flex items-center gap-4">
                                                  <div className={`relative w-12 h-12 rounded-full p-0.5 ${isLeader ? 'bg-gradient-to-tr from-yellow-500 to-orange-500' : 'bg-white/10'}`}>
                                                      <img src={member.image} className="w-full h-full rounded-full object-cover border-2 border-night-900" alt={member.fullName} />
                                                      {isLeader && <div className="absolute -top-1 -right-1 bg-yellow-500 text-black p-0.5 rounded-full shadow-sm"><Crown size={10}/></div>}
                                                  </div>
                                                  <div>
                                                      <p className="font-bold text-white text-sm">{member.fullName}</p>
                                                      <p className="text-xs text-night-400 font-mono tracking-wider">{member.membershipNumber || '---'}</p>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="p-4 text-night-300 text-sm font-mono">{member.birthDate}</td>
                                          <td className="p-4">
                                              <span className="text-xs px-2 py-1 rounded bg-white/5 text-night-300 border border-white/10">{member.unit}</span>
                                          </td>
                                          <td className="p-4">
                                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex w-fit items-center gap-2 ${
                                                  isLeader 
                                                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                                                  : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                                              }`}>
                                                  {isLeader && <Crown size={12}/>}
                                                  {member.scoutMission || 'عضو'}
                                              </span>
                                          </td>
                                          <td className="p-4 text-center">
                                              <button 
                                                  onClick={() => openRoleModal(member)}
                                                  className="p-2 bg-night-900 rounded-xl text-night-400 hover:text-white hover:bg-primary-600 transition-all border border-white/5 hover:border-primary-500 shadow-md group-hover/row:scale-105"
                                                  title="تعيين المهمة / العريف"
                                              >
                                                  <UserCog size={18} />
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })}
                              {patrolMembers.length === 0 && (
                                  <tr>
                                      <td colSpan={5} className="p-12 text-center text-night-500 italic">لا يوجد أعضاء في هذه الطليعة حالياً</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      );
  };

  // 2. Unit Detail View (Tabs & Config)
  const renderDetailView = () => {
    if (!selectedUnit) return null;
    const unitMembers = getUnitMembers(selectedUnit);
    const unitPatrols = getUnitPatrols(selectedUnit);
    const metadata = unitsData[selectedUnit];
    
    // Safety check: ensure metadata exists
    if (!metadata) return <div className="text-white text-center p-8">بيانات الوحدة غير متوفرة</div>;

    const leaderTitle = getLeaderTitle(selectedUnit);
    const potentialLeaders = members.filter(m => m.role === MemberRole.LEADER).map(m => ({ value: m.id, label: m.fullName }));
    const potentialSeniorScouts = unitMembers.filter(m => m.role === MemberRole.SCOUT).map(m => ({ value: m.id, label: m.fullName }));

    const displayedMembers = selectedPatrolFilter === 'ALL' ? unitMembers : unitMembers.filter(m => m.patrol === selectedPatrolFilter);

    return (
        <div className="animate-fade-in space-y-8">
             {/* Dynamic Unit Header */}
             <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl bg-night-800">
                <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${metadata.gradient} opacity-10`}></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSelectedUnit(null)} className="p-4 bg-night-900/50 rounded-2xl hover:bg-white/10 transition-colors border border-white/10 group backdrop-blur-md">
                            <ChevronLeft size={24} className="text-white group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-4">
                            {metadata.image && (
                                <img src={metadata.image} className="w-16 h-16 rounded-2xl border-2 border-white/10 object-cover shadow-lg" alt="Unit" />
                            )}
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${metadata.gradient} tracking-tight leading-normal`}>{selectedUnit}</h2>
                                    {!metadata.isActive && <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 flex items-center gap-1"><AlertCircle size={12}/> موقوفة</span>}
                                </div>
                                <p className="text-night-300 text-lg max-w-xl font-light leading-relaxed opacity-90">{metadata.description}</p>
                                {metadata.slogan && <p className="text-primary-400 text-sm mt-2 italic font-bold">"{metadata.slogan}"</p>}
                            </div>
                        </div>
                    </div>
                    
                    {/* Visual Stats Cards */}
                    <div className="flex gap-4">
                         <div className="bg-night-900/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center min-w-[110px]">
                             <Users className={`mx-auto mb-2 ${metadata.color}`} size={24}/>
                             <span className="block text-2xl font-bold text-white">{unitMembers.length}</span>
                             <span className="text-xs text-night-400 font-bold uppercase tracking-wide">عضو</span>
                         </div>
                         <div className="bg-night-900/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center min-w-[110px]">
                             <Flag className={`mx-auto mb-2 ${metadata.color}`} size={24}/>
                             <span className="block text-2xl font-bold text-white">{unitPatrols.length}</span>
                             <span className="text-xs text-night-400 font-bold uppercase tracking-wide">طليعة</span>
                         </div>
                         <div className="bg-night-900/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center min-w-[110px]">
                             <Zap className={`mx-auto mb-2 ${metadata.color}`} size={24}/>
                             <span className="block text-2xl font-bold text-white">85%</span>
                             <span className="text-xs text-night-400 font-bold uppercase tracking-wide">نشاط</span>
                         </div>
                    </div>
                </div>
             </div>

             {/* Navigation Tabs */}
             <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <div className="flex gap-2">
                    {[
                        {id: 'PATROLS', label: 'الطلائع والسداسيات', icon: Flag},
                        {id: 'MEMBERS', label: 'قائمة الأعضاء', icon: Users},
                        {id: 'SETTINGS', label: 'الإعدادات', icon: Settings}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)} 
                            className={`px-6 py-3 font-bold text-sm flex items-center gap-2 rounded-t-xl transition-all relative overflow-hidden ${activeTab === tab.id ? `text-white` : 'text-night-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {activeTab === tab.id && <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${metadata.gradient}`}></div>}
                            <tab.icon size={18} className={activeTab === tab.id ? metadata.color : ''} /> {tab.label}
                        </button>
                    ))}
                </div>
                
                {/* View Options */}
                {activeTab === 'PATROLS' && (
                    <div className="flex bg-night-800 rounded-lg p-1 border border-white/10">
                        <button onClick={() => setPatrolViewMode('GRID')} className={`p-2 rounded-md transition-all ${patrolViewMode === 'GRID' ? 'bg-white/10 text-white shadow-sm' : 'text-night-400 hover:text-white'}`}><LayoutGrid size={18}/></button>
                        <button onClick={() => setPatrolViewMode('LIST')} className={`p-2 rounded-md transition-all ${patrolViewMode === 'LIST' ? 'bg-white/10 text-white shadow-sm' : 'text-night-400 hover:text-white'}`}><List size={18}/></button>
                    </div>
                )}
             </div>

             {/* Tab Content */}
             <div className="min-h-[400px]">
                {/* 1. Patrols Tab */}
                {activeTab === 'PATROLS' && (
                    <div className="animate-fade-in">
                        {patrolViewMode === 'GRID' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {unitPatrols.map((patrol, idx) => (
                                    <div 
                                        key={patrol.id} 
                                        onClick={() => setSelectedPatrol(patrol)} 
                                        className="group relative bg-night-800 border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-xl cursor-pointer"
                                    >
                                        <div className={`h-32 bg-gradient-to-br ${metadata.gradient} opacity-20 relative`}>
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
                                        </div>
                                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                                            <div className="w-24 h-24 rounded-full bg-night-800 border-4 border-night-800 shadow-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
                                                {patrol.logo ? <img src={patrol.logo} className="w-full h-full rounded-full object-cover"/> : <Shield className={`w-10 h-10 ${metadata.color}`} />}
                                            </div>
                                        </div>
                                        <div className="pt-14 pb-6 px-6 text-center">
                                            <h3 className="text-2xl font-black text-white mb-1 tracking-wide">{patrol.name}</h3>
                                            <p className="text-xs text-night-400 mb-4 font-mono uppercase tracking-widest opacity-70">{`PT-${String(idx + 1).padStart(2, '0')}`}</p>
                                            <div className="relative bg-night-900/50 rounded-xl p-4 mb-6 border border-white/5">
                                                <Quote size={16} className={`absolute top-2 right-2 ${metadata.color} opacity-50`} />
                                                <p className="text-sm text-primary-100 font-medium italic leading-relaxed">"{patrol.slogan}"</p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-sm">
                                                <div>
                                                    <p className="text-night-500 text-xs mb-1 flex items-center justify-center gap-1">
                                                        <Crown size={12} className={metadata.color}/> {leaderTitle}
                                                    </p>
                                                    <p className="font-bold text-white truncate px-1">{members.find(m => m.id === patrol.leaderId)?.fullName.split(' ')[0] || '---'}</p>
                                                </div>
                                                <div className="border-r border-l border-white/5">
                                                    <p className="text-night-500 text-xs mb-1 flex items-center justify-center gap-1">
                                                        <Users size={12} className={metadata.color}/> الأعضاء
                                                    </p>
                                                    <p className="font-bold text-white">{unitMembers.filter(m => m.patrol === patrol.name).length}</p>
                                                </div>
                                                <div>
                                                    <p className="text-night-500 text-xs mb-1 flex items-center justify-center gap-1">
                                                        <Star size={12} className={metadata.color}/> النقاط
                                                    </p>
                                                    <p className={`font-bold ${metadata.color}`}>1250</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={handleOpenAddModal}
                                    className="border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-night-400 hover:border-primary-500/50 hover:text-primary-400 hover:bg-white/5 transition-all min-h-[350px] group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Plus size={32} />
                                    </div>
                                    <span className="font-bold text-lg">إضافة طليعة جديدة</span>
                                    <span className="text-xs text-night-500 mt-2">تكوين وتعيين العريف</span>
                                </button>
                            </div>
                        ) : (
                            <div className="bg-night-800/40 rounded-3xl border border-white/5 overflow-hidden">
                                {unitPatrols.map((patrol, idx) => (
                                    <div key={patrol.id} onClick={() => setSelectedPatrol(patrol)} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metadata.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>{idx + 1}</div>
                                            <div><h4 className="text-lg font-bold text-white">{patrol.name}</h4><p className="text-xs text-night-400 italic">"{patrol.slogan}"</p></div>
                                        </div>
                                        <div className="p-2 bg-night-900 rounded-lg text-night-400 group-hover:text-white group-hover:bg-primary-600 transition-all"><ArrowLeft size={18} className="rtl:rotate-180" /></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Members Tab */}
                {activeTab === 'MEMBERS' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center bg-night-800/60 p-4 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-white flex items-center gap-2"><Target className="text-primary-500" size={20}/> قائمة الكشافين ({displayedMembers.length})</h3>
                            <div className="w-64">
                                <Dropdown options={[{value: 'ALL', label: 'جميع الطلائع'}, ...unitPatrols.map(p => ({value: p.name, label: `طليعة ${p.name}`}))]} value={selectedPatrolFilter} onChange={setSelectedPatrolFilter} placeholder="تصفية حسب الطليعة" />
                            </div>
                        </div>
                        <div className="bg-night-800/40 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                            <table className="w-full text-right border-collapse">
                                <thead className="bg-night-900/80 text-night-300 text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="p-5 pl-8">العضو</th>
                                        <th className="p-5">الوحدة</th>
                                        <th className="p-5">الطليعة</th>
                                        <th className="p-5">المهمة الكشفية</th>
                                        <th className="p-5 text-center">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {displayedMembers.map(member => {
                                        const isLeader = member.scoutMission.includes('عريف') || member.scoutMission.includes('سادوس');
                                        return (
                                            <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 pl-8 flex items-center gap-4">
                                                    <img src={member.image} className="w-10 h-10 rounded-full border border-night-900" />
                                                    <span className="font-bold text-white text-sm">{member.fullName}</span>
                                                </td>
                                                <td className="p-4"><span className="text-xs px-2 py-1 rounded bg-white/5 text-night-300 border border-white/10">{member.unit}</span></td>
                                                <td className="p-4 text-night-300 text-sm font-bold">{member.patrol}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex w-fit items-center gap-2 ${isLeader ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-primary-500/10 text-primary-400 border-primary-500/20'}`}>
                                                        {isLeader && <Crown size={12}/>}{member.scoutMission || 'عضو'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => openRoleModal(member)} className="p-2 bg-night-900 rounded-lg text-night-400 hover:text-white hover:bg-primary-600 transition-all border border-white/5 hover:border-primary-500 shadow-md">
                                                        <UserCog size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. Settings Tab */}
                {activeTab === 'SETTINGS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        <div className="bg-night-800/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-lg space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Settings size={20} className="text-primary-500" /> إعدادات الوحدة</h3>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-primary-200/80 font-bold block uppercase tracking-wider">صورة الوحدة</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-night-900 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                                            {metadata.image ? <img src={metadata.image} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-night-600" />}
                                        </div>
                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 w-full text-center">
                                                <Upload size={16} />
                                                <span>رفع صورة الوحدة</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                            <p className="text-[10px] text-night-400">يدعم صيغ PNG, JPG. يفضل أبعاد مربعة.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-primary-200/80 font-bold block uppercase tracking-wider">شعار الوحدة (نص)</label>
                                    <input type="text" placeholder="أدخل شعار الوحدة هنا..." className="w-full bg-night-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none transition-all" value={metadata.slogan} onChange={(e) => setUnitsData({...unitsData, [selectedUnit]: {...metadata, slogan: e.target.value}})} />
                                </div>
                            </div>

                            <Dropdown label="قائد الوحدة المسؤول" value={metadata.leaderId} onChange={(val: string) => setUnitsData({...unitsData, [selectedUnit]: {...metadata, leaderId: val}})} options={potentialLeaders} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Dropdown label="نائب قائد الوحدة" value={metadata.deputyLeaderId} onChange={(val: string) => setUnitsData({...unitsData, [selectedUnit]: {...metadata, deputyLeaderId: val}})} options={potentialLeaders} />
                                <Dropdown label="مساعد قائد الوحدة" value={metadata.assistantLeaderId} onChange={(val: string) => setUnitsData({...unitsData, [selectedUnit]: {...metadata, assistantLeaderId: val}})} options={potentialLeaders} />
                            </div>

                            <Dropdown label="العريف الأكبر (أعلى رتبة بين الكشافين في الوحدة)" value={metadata.seniorPatrolLeaderId} onChange={(val: string) => setUnitsData({...unitsData, [selectedUnit]: {...metadata, seniorPatrolLeaderId: val}})} options={potentialSeniorScouts} />

                            <Dropdown label="حالة الوحدة" value={metadata.isActive ? 'true' : 'false'} onChange={(val: string) => setUnitsData({...unitsData, [selectedUnit]: {...metadata, isActive: val === 'true'}})} options={[{value: 'true', label: 'نشطة'}, {value: 'false', label: 'موقوفة'}]} />
                            
                            <div className="space-y-2">
                                <label className="text-xs text-primary-200/80 font-bold block uppercase tracking-wider">وصف الوحدة</label>
                                <textarea className="w-full bg-night-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 h-32 resize-none outline-none transition-all" value={metadata.description} onChange={(e) => setUnitsData({...unitsData, [selectedUnit]: {...metadata, description: e.target.value}})} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-night-800/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-full bg-yellow-500 opacity-20"></div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Crown size={20} className="text-yellow-500" /> مهام العريف الأكبر</h3>
                                <p className="text-night-400 text-sm leading-relaxed">
                                    العريف الأكبر هو حلقة الوصل المباشرة بين قيادة الوحدة وكافة الكشافين. يمثل أعلى رتبة كشفية (من فئة الكشافين) في الوحدة، ويتولى مسؤولية نقل التوجيهات وحل المشكلات البسيطة بين الطلائع.
                                </p>
                            </div>

                            <div className="bg-night-800/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-lg">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Power size={20} className="text-red-500" /> منطقة الخطر</h3>
                                <p className="text-night-400 text-sm mb-6">تجميد الوحدة سيمنع إضافة أعضاء جدد ويخفيها من القوائم النشطة.</p>
                                <button onClick={toggleUnitStatus} className="w-full py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl font-bold transition-all border border-red-500/20">
                                    {metadata.isActive ? 'تجميد الوحدة مؤقتاً' : 'إعادة تفعيل الوحدة'}
                                </button>
                            </div>
                             <button 
                                onClick={handleSaveUnitSettings}
                                disabled={isSavingSettings}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                {isSavingSettings ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
                                {isSavingSettings ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                             </button>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
  };

  // Main View (Grid)
  return (
    <div className="p-8 h-full animate-fade-in">
        {selectedPatrol ? renderPatrolDetail() : selectedUnit ? renderDetailView() : (
            <>
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-3">الوحدات والطلائع</h2>
                        <p className="text-night-400 text-lg">الهيكل التنظيمي الميداني للفوج الكشفي.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {UNITS_LIST.map((unit) => {
                        const metadata = unitsData[unit];
                        if (!metadata) return null; // Defensive check to avoid crash if unit missing in state
                        
                        const memberCount = getUnitMembers(unit).length;
                        const patrolCount = getUnitPatrols(unit).length;
                        const leader = members.find(m => m.id === metadata.leaderId);
                        
                        return (
                            <div key={unit} onClick={() => setSelectedUnit(unit)} className={`relative bg-night-800 border border-white/5 rounded-[2.5rem] p-8 cursor-pointer group hover:-translate-y-3 transition-all duration-500 shadow-xl overflow-hidden hover:shadow-2xl ${metadata.shadowColor}`}>
                                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${metadata.gradient} opacity-10 rounded-bl-[100px] transition-all duration-500 group-hover:scale-110 group-hover:opacity-20`}></div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-5 rounded-3xl bg-gradient-to-br ${metadata.gradient} shadow-lg text-white transform group-hover:rotate-12 transition-transform duration-500`}><metadata.icon size={36} /></div>
                                        <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5 group-hover:border-white/20"><ArrowRight size={22} className="text-night-400 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" /></div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-3 tracking-wide">{unit}</h3>
                                        {leader && (
                                            <div className="mb-4 flex items-center gap-3 bg-night-900/50 p-2 rounded-xl border border-white/5">
                                                <img src={leader.image} className="w-10 h-10 rounded-full border border-white/10" alt={leader.fullName} />
                                                <div>
                                                    <p className="text-[10px] text-night-400 flex items-center gap-1">
                                                        <User size={10}/> قائد الوحدة
                                                    </p>
                                                    <p className="text-sm font-bold text-white">{leader.fullName}</p>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-night-400 text-sm line-clamp-2 leading-relaxed h-10 mb-6">{metadata.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-night-900/50 border border-white/5"><Users size={16} className={metadata.color} /><span className="text-white font-bold text-sm">{memberCount} عضو</span></div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-night-900/50 border border-white/5"><Flag size={16} className={metadata.color} /><span className="text-white font-bold text-sm">{patrolCount} طليعة</span></div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-night-900/50 border border-white/5">
                                            <Activity size={16} className={metadata.color} />
                                            <span className="text-white font-bold text-sm">نشط</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        )}

        {/* Modals */}
        {showAddPatrolModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/90 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-night-800 w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-8 relative">
                    <button onClick={() => setShowAddPatrolModal(false)} className="absolute top-6 left-6 text-night-400 hover:text-white transition-colors"><X size={24}/></button>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500"><Flag size={32} /></div>
                        <h3 className="text-2xl font-bold text-white">{editingPatrol ? 'تعديل بيانات الطليعة' : 'إضافة طليعة جديدة'}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2"><label className="text-sm font-bold text-night-300">اسم الطليعة</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none" value={patrolFormData.name} onChange={(e) => setPatrolFormData({...patrolFormData, name: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-sm font-bold text-night-300">الشعار اللفظي</label><input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none" value={patrolFormData.slogan} onChange={(e) => setPatrolFormData({...patrolFormData, slogan: e.target.value})} /></div>
                        <div className="space-y-2"><label className="text-sm font-bold text-night-300">الصيحة</label><textarea className="w-full bg-night-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none h-24 resize-none" value={patrolFormData.chant} onChange={(e) => setPatrolFormData({...patrolFormData, chant: e.target.value})} /></div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button onClick={() => setShowAddPatrolModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">إلغاء</button>
                        <button onClick={handleConfirmPatrolForm} className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg transition-all">حفظ</button>
                    </div>
                </div>
            </div>
        )}

        {showRoleModal && selectedMemberForRole && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-night-900/90 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-night-800 w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 relative">
                    <button onClick={() => setShowRoleModal(false)} className="absolute top-4 left-4 text-night-400 hover:text-white"><X size={20}/></button>
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-tr from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"><Crown size={28} className="text-white"/></div>
                        <h3 className="text-lg font-bold text-white">تعيين المهام الكشفية</h3>
                        <p className="text-night-400 text-sm mt-1">{selectedMemberForRole.fullName}</p>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-1 mb-6">
                        {SCOUT_MISSION_ROLES.map(role => (
                            <div key={role} onClick={() => setNewRole(role)} className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${newRole === role ? 'bg-primary-600 border-primary-500 text-white shadow-md' : 'bg-night-900/50 border-white/5 text-night-300 hover:bg-white/5'}`}>
                                <span className="font-bold text-sm">{role}</span>
                                {newRole === role && <Check size={16}/>}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSaveRole} className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg transition-all">تأكيد التعيين</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Units;
