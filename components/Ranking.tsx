
import React, { useState, useMemo } from 'react';
import { Member, Badge, PointRecord, RankLevel, UnitName, Patrol } from '../types';
import { UNITS_LIST } from '../constants';
import { Medal, Trophy, Star, History, Target, Crown, ChevronDown, Filter, AlertCircle, CheckCircle2, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RankingProps {
  members: Member[];
  badges: Badge[];
  pointsHistory: PointRecord[];
  rankLevels: RankLevel[];
  patrols: Patrol[];
}

const Ranking: React.FC<RankingProps> = ({ members, badges, pointsHistory, rankLevels, patrols }) => {
  const [activeTab, setActiveTab] = useState<'LEADERBOARD' | 'POINTS' | 'BADGES' | 'RANKS'>('LEADERBOARD');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedPatrol, setSelectedPatrol] = useState<string>('ALL');

  // --- Filtering Logic ---
  const filteredMembers = useMemo(() => {
    let result = [...members];
    if (selectedUnit !== 'ALL') {
      result = result.filter(m => m.unit === selectedUnit);
    }
    if (selectedPatrol !== 'ALL') {
      result = result.filter(m => m.patrol === selectedPatrol);
    }
    // Sort by points Descending
    return result.sort((a, b) => b.points - a.points);
  }, [members, selectedUnit, selectedPatrol]);

  const topThree = filteredMembers.slice(0, 3);
  const restOfMembers = filteredMembers.slice(3);

  // --- Helper to get Rank ---
  const getRankForPoints = (points: number) => {
    // Sort levels descending by minPoints
    const sortedLevels = [...rankLevels].sort((a, b) => b.minPoints - a.minPoints);
    return sortedLevels.find(l => points >= l.minPoints) || sortedLevels[sortedLevels.length - 1];
  };

  const getNextRank = (points: number) => {
     const sortedLevels = [...rankLevels].sort((a, b) => a.minPoints - b.minPoints);
     return sortedLevels.find(l => l.minPoints > points);
  };

  // --- Chart Data ---
  const chartData = filteredMembers.slice(0, 10).map(m => ({
    name: m.fullName.split(' ')[0], // First name only for chart
    points: m.points,
  }));

  // --- Components ---

  const renderLeaderboard = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-12 min-h-[300px]">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="relative order-2 md:order-1 flex flex-col items-center group">
               <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity text-center bg-night-800 px-3 py-1 rounded-lg border border-night-700 text-sm">
                  {topThree[1].unit}
               </div>
               <div className="w-24 h-24 rounded-full border-4 border-gray-400 shadow-[0_0_20px_#9ca3af] overflow-hidden mb-4 relative z-10">
                  <img src={topThree[1].image} className="w-full h-full object-cover" />
               </div>
               <div className="bg-gradient-to-t from-gray-500/20 to-gray-400/10 backdrop-blur-md border border-gray-400/30 w-32 h-40 rounded-t-2xl flex flex-col items-center justify-end p-4 shadow-xl">
                  <span className="text-3xl font-bold text-gray-300 mb-1">2</span>
                  <span className="text-sm font-bold text-white text-center truncate w-full">{topThree[1].fullName}</span>
                  <span className="text-xs text-gray-400 font-mono mt-1">{topThree[1].points} PTS</span>
               </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="relative order-1 md:order-2 flex flex-col items-center z-20 -mt-8 group">
               <div className="absolute -top-16 text-yellow-500 animate-bounce">
                  <Crown size={32} fill="currentColor" />
               </div>
               <div className="w-32 h-32 rounded-full border-4 border-yellow-500 shadow-[0_0_30px_#eab308] overflow-hidden mb-4 relative z-10">
                  <img src={topThree[0].image} className="w-full h-full object-cover" />
               </div>
               <div className="bg-gradient-to-t from-yellow-600/20 to-yellow-500/10 backdrop-blur-md border border-yellow-500/30 w-40 h-52 rounded-t-2xl flex flex-col items-center justify-end p-4 shadow-2xl">
                  <span className="text-4xl font-bold text-yellow-400 mb-1">1</span>
                  <span className="text-base font-bold text-white text-center truncate w-full">{topThree[0].fullName}</span>
                  <span className="text-sm text-yellow-200/80 font-mono mt-1">{topThree[0].points} PTS</span>
               </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="relative order-3 md:order-3 flex flex-col items-center group">
               <div className="w-24 h-24 rounded-full border-4 border-orange-700 shadow-[0_0_20px_#c2410c] overflow-hidden mb-4 relative z-10">
                  <img src={topThree[2].image} className="w-full h-full object-cover" />
               </div>
               <div className="bg-gradient-to-t from-orange-800/20 to-orange-700/10 backdrop-blur-md border border-orange-700/30 w-32 h-32 rounded-t-2xl flex flex-col items-center justify-end p-4 shadow-xl">
                  <span className="text-3xl font-bold text-orange-600 mb-1">3</span>
                  <span className="text-sm font-bold text-white text-center truncate w-full">{topThree[2].fullName}</span>
                  <span className="text-xs text-orange-400 font-mono mt-1">{topThree[2].points} PTS</span>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Chart */}
      <div className="bg-night-800/50 backdrop-blur-md border border-night-700 rounded-xl p-6 mb-8 h-64">
         <h4 className="text-sm font-bold text-night-300 mb-4 flex items-center gap-2"><Trophy size={16}/> إحصائيات النقاط (أفضل 10)</h4>
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.2}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? '#eab308' : '#3b82f6'} />
                    ))}
                </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>

      {/* Rest of List */}
      <div className="bg-night-800/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-right">
            <thead className="bg-white/5 text-night-300">
                <tr>
                    <th className="p-4 text-center w-16">#</th>
                    <th className="p-4">العضو</th>
                    <th className="p-4">الوحدة / الطليعة</th>
                    <th className="p-4">المرتبة الحالية</th>
                    <th className="p-4 text-center">النقاط</th>
                    <th className="p-4 text-center">التقدم</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {restOfMembers.map((member, idx) => {
                    const rank = getRankForPoints(member.points);
                    const nextRank = getNextRank(member.points);
                    const progress = nextRank 
                        ? ((member.points - rank.minPoints) / (nextRank.minPoints - rank.minPoints)) * 100 
                        : 100;
                    
                    return (
                        <tr key={member.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-center font-mono text-night-400">{idx + 4}</td>
                            <td className="p-4 flex items-center gap-3">
                                <img src={member.image} className="w-8 h-8 rounded-full border border-white/10" />
                                <span className="font-medium text-white">{member.fullName}</span>
                            </td>
                            <td className="p-4 text-sm text-night-300">
                                {member.unit} <span className="mx-1">•</span> {member.patrol}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs border bg-opacity-20 flex w-fit items-center gap-1`} style={{ borderColor: rank.color, color: rank.color, backgroundColor: rank.color }}>
                                    {rank.name}
                                </span>
                            </td>
                            <td className="p-4 text-center font-bold font-mono text-white">{member.points}</td>
                            <td className="p-4">
                                <div className="w-24 h-1.5 bg-night-900 rounded-full overflow-hidden mx-auto">
                                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );

  const renderPointsHistory = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center bg-night-800/50 p-4 rounded-xl border border-white/5">
              <div>
                  <h3 className="text-xl font-bold text-white">سجل النقاط</h3>
                  <p className="text-night-400 text-sm">تتبع دقيق لكل النقاط الممنوحة والمخصومة</p>
              </div>
              <div className="flex gap-2">
                   <button className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-lg text-sm hover:bg-emerald-600/30 transition-colors">تصدير CSV</button>
              </div>
          </div>

          <div className="bg-night-800/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-right">
                <thead className="bg-white/5 text-night-300">
                    <tr>
                        <th className="p-4">التاريخ</th>
                        <th className="p-4">العضو</th>
                        <th className="p-4">المصدر</th>
                        <th className="p-4">السبب</th>
                        <th className="p-4 text-center">النقاط</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {pointsHistory.map(record => {
                         const member = members.find(m => m.id === record.memberId);
                         return (
                            <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm text-night-400 font-mono">{record.date}</td>
                                <td className="p-4 font-medium text-white">{member?.fullName || 'عضو محذوف'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        record.source === 'DISCIPLINE' ? 'bg-red-900/50 text-red-400' :
                                        record.source === 'ATTENDANCE' ? 'bg-blue-900/50 text-blue-400' :
                                        'bg-purple-900/50 text-purple-400'
                                    }`}>
                                        {record.source === 'DISCIPLINE' ? 'الانضباط' : 
                                         record.source === 'ATTENDANCE' ? 'الحضور' : 
                                         record.source === 'ACTIVITY' ? 'نشاط' : 'وسام'}
                                    </span>
                                </td>
                                <td className="p-4 text-night-300 text-sm">{record.reason}</td>
                                <td className={`p-4 text-center font-bold font-mono ${record.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {record.amount > 0 ? '+' : ''}{record.amount}
                                </td>
                            </tr>
                         );
                    })}
                </tbody>
            </table>
          </div>
      </div>
  );

  const renderBadges = () => (
      <div className="animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map(badge => (
                <div key={badge.id} className="bg-gradient-to-br from-night-800 to-night-900 border border-white/10 p-6 rounded-2xl hover:border-primary-500/50 hover:shadow-lg transition-all group flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="w-20 h-20 bg-night-900 rounded-full flex items-center justify-center mb-4 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        <Award size={40} className="text-yellow-500" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{badge.name}</h3>
                    <p className="text-sm text-night-400 mb-4 h-10 overflow-hidden">{badge.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 w-full flex justify-between items-center">
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-night-300">المتطلبات</span>
                        <span className="text-emerald-400 font-bold font-mono">+{badge.pointsValue} نقطة</span>
                    </div>
                </div>
            ))}
            
            <button className="border-2 border-dashed border-night-700 rounded-2xl flex flex-col items-center justify-center text-night-400 hover:border-primary-600 hover:text-primary-500 transition-colors min-h-[200px]">
                <Target size={40} className="mb-2 opacity-50" />
                <span className="font-medium">إضافة وسام جديد</span>
            </button>
         </div>
      </div>
  );

  const renderRanks = () => (
      <div className="animate-fade-in space-y-8">
           <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-8 rounded-3xl">
               <h3 className="text-2xl font-bold text-white mb-2">القارات ومراتب الترقية</h3>
               <p className="text-night-300 max-w-2xl">
                   يتم الترقية تلقائياً بناءً على مجموع النقاط. لا يمكن سحب الرتبة إلا عبر مجلس تأديب (قسم الانضباط).
               </p>
           </div>

           <div className="relative">
               {/* Timeline Line */}
               <div className="absolute right-8 top-0 bottom-0 w-1 bg-night-800 rounded-full"></div>

               <div className="space-y-8">
                   {rankLevels.sort((a,b) => a.minPoints - b.minPoints).map((rank, idx) => (
                       <div key={rank.id} className="relative flex gap-8 items-center group">
                           {/* Dot */}
                           <div className="w-16 h-16 rounded-full bg-night-900 border-4 z-10 flex items-center justify-center shadow-xl transition-transform group-hover:scale-110" style={{ borderColor: rank.color }}>
                                <Crown size={24} style={{ color: rank.color }} />
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1 bg-night-800/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all shadow-lg flex justify-between items-center">
                               <div>
                                   <h4 className="text-xl font-bold text-white mb-1">{rank.name}</h4>
                                   <p className="text-sm text-night-400">يتطلب الوصول إلى هذا المستوى تجميع النقاط والالتزام بالقانون الكشفي.</p>
                               </div>
                               <div className="text-center">
                                   <p className="text-xs text-night-400 uppercase tracking-wider mb-1">الحد الأدنى</p>
                                   <p className="text-2xl font-bold font-mono text-white">{rank.minPoints} <span className="text-sm text-night-500">نقطة</span></p>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
      </div>
  );

  return (
    <div className="p-8 h-full flex flex-col">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20"><Medal size={32} /></span>
                    الترتيب والأوسمة
                </h2>
                <p className="text-night-400 mt-2">نظام تقييم مركزي يعتمد على النقاط والاستحقاق</p>
            </div>
            
            {/* Context Filters (Only showing for Leaderboard) */}
            {activeTab === 'LEADERBOARD' && (
                <div className="flex gap-3 bg-night-800 p-1.5 rounded-xl border border-night-700">
                    <div className="relative group">
                        <select 
                            value={selectedUnit} 
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            className="appearance-none bg-night-900 text-white pl-8 pr-4 py-2 rounded-lg border border-night-600 focus:border-primary-500 outline-none text-sm cursor-pointer hover:bg-night-700 transition-colors"
                        >
                            <option value="ALL">كل الوحدات</option>
                            {UNITS_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <ChevronDown className="absolute left-2 top-2.5 text-night-400 pointer-events-none" size={14} />
                    </div>
                     <div className="relative group">
                        <select 
                            value={selectedPatrol} 
                            onChange={(e) => setSelectedPatrol(e.target.value)}
                            className="appearance-none bg-night-900 text-white pl-8 pr-4 py-2 rounded-lg border border-night-600 focus:border-primary-500 outline-none text-sm cursor-pointer hover:bg-night-700 transition-colors"
                        >
                            <option value="ALL">كل الطلائع</option>
                            {patrols.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                         <ChevronDown className="absolute left-2 top-2.5 text-night-400 pointer-events-none" size={14} />
                    </div>
                    <div className="px-3 py-2 flex items-center justify-center text-night-400 border-r border-night-600">
                        <Filter size={18} />
                    </div>
                </div>
            )}
       </div>

       {/* Tabs Navigation */}
       <div className="flex border-b border-white/10 mb-8 overflow-x-auto pb-1">
            <button 
                onClick={() => setActiveTab('LEADERBOARD')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'LEADERBOARD' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/5' : 'border-transparent text-night-400 hover:text-white'}`}
            >
                <Trophy size={20} /> <span className="font-bold">الترتيب العام</span>
            </button>
            <button 
                onClick={() => setActiveTab('POINTS')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'POINTS' ? 'border-primary-500 text-primary-400 bg-primary-500/5' : 'border-transparent text-night-400 hover:text-white'}`}
            >
                <History size={20} /> <span className="font-bold">سجل النقاط</span>
            </button>
             <button 
                onClick={() => setActiveTab('BADGES')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'BADGES' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-night-400 hover:text-white'}`}
            >
                <Award size={20} /> <span className="font-bold">الأوسمة والشارات</span>
            </button>
             <button 
                onClick={() => setActiveTab('RANKS')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'RANKS' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-night-400 hover:text-white'}`}
            >
                <Crown size={20} /> <span className="font-bold">القارات (المراتب)</span>
            </button>
       </div>

       {/* Content Area */}
       <div className="flex-1">
           {activeTab === 'LEADERBOARD' && renderLeaderboard()}
           {activeTab === 'POINTS' && renderPointsHistory()}
           {activeTab === 'BADGES' && renderBadges()}
           {activeTab === 'RANKS' && renderRanks()}
       </div>
    </div>
  );
};

export default Ranking;
