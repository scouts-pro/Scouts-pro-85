
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Units from './components/Units';
import Finance from './components/Finance';
import Insurance from './components/Insurance';
import Discipline from './components/Discipline';
import Activities from './components/Activities';
import Camps from './components/Camps';
import Administration from './components/Administration';
import Programming from './components/Programming';
import Reports from './components/Reports';
import Archive from './components/Archive';
import Projects from './components/Projects';
import Ranking from './components/Ranking';
import Settings from './components/Settings';
import Equipment from './components/Equipment';
import LandingPage from './components/LandingPage';
import { Section, Member, UnitName, MemberRole, Patrol, Transaction, AttendanceSession, Sanction, Event, Project, Badge, PointRecord, RankLevel, AttendanceSettings, Notification, EquipmentItem, Treasury, BankAccount } from './types';
import { Bell, CheckCircle2, AlertTriangle, Info, X, Menu, PanelRightOpen } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>('DASHBOARD');
  
  // القائمة مطوية افتراضياً
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock Data States
  const [members, setMembers] = useState<Member[]>([
      {
        id: '1',
        scoutYear: '2024-2025',
        fullName: 'أحمد بن محمد',
        role: MemberRole.SCOUT,
        unit: UnitName.KASHAF,
        patrol: 'النسور',
        image: 'https://i.pravatar.cc/150?u=1',
        gender: 'ذكر',
        birthDate: '2010-05-15',
        birthPlace: 'الجزائر',
        age: 14,
        address: 'الجزائر',
        bloodType: 'O+',
        membershipNumber: '2024001',
        insuranceNumber: 'INS001',
        isActive: true,
        subscriptionPaid: true,
        insurancePaid: true,
        guardianName: 'محمد بن أحمد',
        guardianPhone: '0555123456',
        guardianRelation: 'أب',
        siblingsCount: 2,
        birthOrder: 1,
        financialStatus: 'متوسطة',
        housingType: 'ملكية',
        livingEnvironment: 'حضري',
        familyMembersCount: 5,
        specialSocialCases: 'لا يوجد',
        socialNotes: '',
        educationLevel: 'متوسط',
        institution: 'متوسطة النور',
        studyStatus: 'متمدرس',
        scoutMission: 'عريف طليعة',
        scoutJob: 'قيادة الطليعة',
        rank: 'مبتدئ',
        hobbies: 'السباحة، المطالعة',
        activityIds: [],
        points: 120,
        earnedBadges: []
      }
  ]);
  
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSession[]>([]);
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  const [treasuries, setTreasuries] = useState<Treasury[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [events, setEvents] = useState<Event[]>([
      {
        id: 'act1',
        title: 'نشاط الجمعة التربوي',
        type: 'ACTIVITY',
        date: '2024-11-01',
        location: 'مقر الفوج',
        coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop',
        targetUnits: [UnitName.ASHBAL, UnitName.KASHAF],
        participants: ['1'],
        leaderIds: [],
        goals: 'غرس القيم الكشفية والتدريب على العقد.',
        cost: 2000,
        fee: 50,
        leaderFee: 100,
        manager: 'القائد أحمد',
        isClosed: false,
        activityExpenses: [],
        additionalFunding: [],
        surplusTransfers: []
      },
      {
        id: 'cmp1',
        title: 'مخيم الشتاء التدريبي',
        type: 'CAMP',
        date: '2024-12-15',
        location: 'غابة باينام',
        coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop',
        targetUnits: [UnitName.KASHAF, UnitName.MOTAQADEM],
        participants: ['1'],
        leaderIds: [],
        goals: 'حياة الخلاء والاعتماد على النفس.',
        cost: 15000,
        fee: 500,
        leaderFee: 500,
        manager: 'القائد محمد',
        isClosed: false,
        activityExpenses: [],
        additionalFunding: [],
        surplusTransfers: []
      }
  ]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointRecord[]>([]);
  const [rankLevels, setRankLevels] = useState<RankLevel[]>([]);
  const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettings>({
      presentPoints: 10, latePoints: 5, absentPoints: -5, unjustifiedPoints: -10
  });

  const addNotification = (title: string, message: string, type: 'SUCCESS' | 'WARNING' | 'INFO' = 'INFO', action?: () => void, actionLabel?: string) => {
      const id = Date.now().toString();
      setNotifications(prev => [{id, title, message, type, timestamp: Date.now(), action, actionLabel}, ...prev]);
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  if (!isLoggedIn) {
      return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
      switch(currentSection) {
          case 'DASHBOARD': return <Dashboard members={members} events={events} onNavigate={setCurrentSection} />;
          case 'MEMBERS': return <Members members={members} onAddMember={(m) => setMembers([...members, m])} onUpdateMember={(m) => setMembers(members.map(mem => mem.id === m.id ? m : mem))} onDeleteMember={(id) => setMembers(members.filter(m => m.id !== id))} equipmentList={equipment} />;
          case 'UNITS': return <Units members={members} patrols={patrols} onAddPatrol={(p) => setPatrols([...patrols, p])} onUpdatePatrol={(p) => setPatrols(patrols.map(pat => pat.id === p.id ? p : pat))} onUpdateMember={(m) => setMembers(members.map(mem => mem.id === m.id ? m : mem))} />;
          case 'FINANCE': return <Finance transactions={transactions} insuranceTotal={0} onAddTransaction={(t) => setTransactions([...transactions, t])} events={events} projects={projects} />;
          case 'INSURANCE': return <Insurance members={members} transactions={transactions} onTransferToFinance={(data) => {
              const trans: Transaction = {
                  id: Date.now().toString(),
                  type: data.type === 'INSURANCE' ? 'EXPENSE' : 'INCOME',
                  category: data.type,
                  amount: data.amount,
                  date: new Date().toISOString().split('T')[0],
                  description: `تحويل ${data.type === 'INSURANCE' ? 'تأمينات' : 'اشتراكات'} لعدد ${data.count} أعضاء -> ${data.destination}`
              };
              setTransactions([...transactions, trans]);
          }} />;
          case 'DISCIPLINE': return < Discipline attendance={attendance} sanctions={sanctions} members={members} onAddSession={(s) => setAttendance([...attendance, s])} attendanceSettings={attendanceSettings} onUpdateSettings={setAttendanceSettings} />;
          case 'ACTIVITIES': return <Activities 
              type="ACTIVITY" 
              events={events.filter(e => e.type === 'ACTIVITY')} 
              members={members} 
              onFinancialTransfer={(amount, desc, date, relId) => setTransactions([...transactions, {id: Date.now().toString(), type: 'INCOME', category: 'ACTIVITY', amount, description: desc, date, relatedEntityId: relId}])} 
              globalTransactions={transactions} 
              onAddNotification={addNotification} 
              onTransferSurplus={(amount, entityId, entityTitle) => {
               setTransactions([...transactions, {id: Date.now().toString(), type: 'INCOME', category: 'ACTIVITY', amount, description: `تحويل فائض نشاط: ${entityTitle}`, date: new Date().toISOString().split('T')[0], relatedEntityId: entityId}]);
              }} 
              onUpdateActivity={(e) => setEvents(events.map(ev => ev.id === e.id ? e : ev))} 
              onAddActivity={(e) => setEvents([...events, e])} 
              treasuries={treasuries}
              bankAccounts={bankAccounts}
              equipmentList={equipment}
              onUpdateEquipment={setEquipment}
          />;
          case 'CAMPS': return <Camps 
              camps={events.filter(e => e.type === 'CAMP')} 
              members={members} 
              onUpdateCamp={(c) => setEvents(events.map(ev => ev.id === c.id ? c : ev))} 
              onFinancialTransfer={(amount, desc, date, relId) => setTransactions([...transactions, {id: Date.now().toString(), type: 'INCOME', category: 'CAMP', amount, description: desc, date, relatedEntityId: relId}])} 
              globalTransactions={transactions} 
              onAddNotification={addNotification} 
              onTransferSurplus={(amount, entityId, entityTitle) => {
               setTransactions([...transactions, {id: Date.now().toString(), type: 'INCOME', category: 'CAMP', amount, description: `تحويل فائض مخيم: ${entityTitle}`, date: new Date().toISOString().split('T')[0], relatedEntityId: entityId}]);
              }} 
              onAddCamp={(e) => setEvents([...events, e])}
              treasuries={treasuries}
              bankAccounts={bankAccounts}
              equipmentList={equipment}
              onUpdateEquipment={setEquipment}
          />;
          case 'ADMINISTRATION': return <Administration onAddNotification={addNotification} />;
          case 'PROGRAMMING': return <Programming onAddNotification={addNotification} />;
          case 'REPORTS': return <Reports onAddNotification={addNotification} members={members} transactions={transactions} events={events} />;
          case 'ARCHIVE': return <Archive members={members} events={events} transactions={transactions} projects={projects} attendance={attendance} />;
          case 'PROJECTS': return <Projects projects={projects} onAddProject={(p) => setProjects([...projects, p])} />;
          case 'RANKING': return <Ranking members={members} badges={badges} pointsHistory={pointsHistory} rankLevels={rankLevels} patrols={patrols} />;
          case 'EQUIPMENT': return <Equipment items={equipment} members={members} onUpdateEquipment={setEquipment} />;
          case 'SETTINGS': return <Settings />;
          default: return <Dashboard members={members} />;
      }
  };

  return (
    <div className="flex h-screen bg-night-900 text-white font-sans overflow-hidden" dir="rtl">
        {/* القائمة الجانبية */}
        <Sidebar 
            currentSection={currentSection} 
            onNavigate={setCurrentSection} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
        />
        
        {/* زر الموبايل */}
        <button 
            className="fixed top-4 left-4 z-40 p-3 bg-night-800 text-white rounded-xl shadow-lg border border-white/10 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
        >
            <Menu size={24} />
        </button>

        {/* محتوى التطبيق الرئيسي - تم إلغاء التحويل (Transform) والشفافية ليبقى ثابتاً */}
        <main className={`
            flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            md:mr-20 
        `}>
            <div className="flex-1 flex flex-col h-full">
                
                {/* Notifications Overlay */}
                <div className="absolute top-20 left-4 z-50 flex flex-col gap-2 w-80 pointer-events-none">
                    {notifications.map(n => (
                        <div key={n.id} className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-3 animate-slide-in ${
                            n.type === 'SUCCESS' ? 'bg-emerald-900/95 border-emerald-500/50 text-emerald-100' :
                            n.type === 'WARNING' ? 'bg-amber-900/95 border-amber-500/50 text-amber-100' :
                            'bg-blue-900/95 border-blue-500/50 text-blue-100'
                        }`}>
                            {n.type === 'SUCCESS' ? <CheckCircle2 size={20} className="mt-0.5" /> : n.type === 'WARNING' ? <AlertTriangle size={20} className="mt-0.5" /> : <Info size={20} className="mt-0.5" />}
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">{n.title}</h4>
                                <p className="text-xs opacity-90 mt-1">{n.message}</p>
                                {n.action && (
                                    <button onClick={() => { n.action?.(); setNotifications(prev => prev.filter(x => x.id !== n.id)); }} className="mt-2 text-xs font-bold underline hover:no-underline">
                                        {n.actionLabel || 'تنفيذ الإجراء'}
                                    </button>
                                )}
                            </div>
                            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="opacity-70 hover:opacity-100"><X size={16}/></button>
                        </div>
                    ))}
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                    {renderContent()}
                </div>
            </div>
        </main>
    </div>
  );
};

export default App;
