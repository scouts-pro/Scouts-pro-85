
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // --- توليد البيانات التجريبية ---
  
  // 1. الطلائع (طلعتين لكل وحدة)
  const generatedPatrols: Patrol[] = [];
  Object.values(UnitName).forEach((unit, uIdx) => {
    generatedPatrols.push(
      { id: `p-${uIdx}-1`, name: `طليعة الأسد - ${unit}`, slogan: 'القوة والاتحاد', logo: '', unit: unit, leaderId: `leader-${uIdx}` },
      { id: `p-${uIdx}-2`, name: `طليعة الصقر - ${unit}`, slogan: 'التحليق عالياً', logo: '', unit: unit, leaderId: `leader-${uIdx}` }
    );
  });

  // 2. الأعضاء
  const generatedMembers: Member[] = [];
  
  // إضافة الكشافين (6 لكل طليعة)
  generatedPatrols.forEach((patrol) => {
    for (let i = 1; i <= 6; i++) {
      generatedMembers.push({
        id: `m-${patrol.id}-${i}`,
        scoutYear: '2024-2025',
        fullName: `كشاف ${i} - ${patrol.name}`,
        role: MemberRole.SCOUT,
        unit: patrol.unit,
        patrol: patrol.name,
        image: `https://i.pravatar.cc/150?u=m-${patrol.id}-${i}`,
        gender: i % 2 === 0 ? 'ذكر' : 'أنثى',
        birthDate: '2012-01-01',
        birthPlace: 'الجزائر',
        age: 12,
        address: 'الجزائر العاصمة',
        // Fix: Added missing required properties 'nationality' and 'hasSecondNationality'
        nationality: 'الجزائرية',
        hasSecondNationality: false,
        bloodType: 'A+',
        membershipNumber: `K-${patrol.id}-${i}`,
        insuranceNumber: `INS-${patrol.id}-${i}`,
        isActive: true,
        subscriptionPaid: true,
        insurancePaid: true,
        guardianName: 'ولي الأمر',
        guardianPhone: '0555000000',
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
        institution: 'مدرسة النجاح',
        studyStatus: 'متمدرس',
        scoutMission: 'عضو',
        scoutJob: 'كشاف',
        rank: 'مبتدئ',
        hobbies: 'الكشفية',
        activityIds: [],
        points: 100,
        earnedBadges: []
      });
    }
  });

  // إضافة 6 قادة
  for (let i = 1; i <= 6; i++) {
    generatedMembers.push({
      ...generatedMembers[0],
      id: `leader-${i}`,
      fullName: `القائد المسؤول ${i}`,
      role: MemberRole.LEADER,
      membershipNumber: `LDR-00${i}`,
      unit: i <= 3 ? UnitName.KASHAF : UnitName.ASHBAL,
      scoutMission: 'قائد وحدة'
    });
  }

  // إضافة 6 منخرطين
  for (let i = 1; i <= 6; i++) {
    generatedMembers.push({
      ...generatedMembers[0],
      id: `affiliate-${i}`,
      fullName: `المنخرط ${i}`,
      role: MemberRole.AFFILIATE,
      membershipNumber: `AFF-00${i}`,
      scoutMission: 'منخرط'
    });
  }

  // إضافة 5 أعضاء شرفيين
  for (let i = 1; i <= 5; i++) {
    generatedMembers.push({
      ...generatedMembers[0],
      id: `honorary-${i}`,
      fullName: `عضو شرفي ${i}`,
      role: MemberRole.HONORARY,
      membershipNumber: `HON-00${i}`,
      scoutMission: 'داعم'
    });
  }

  // إضافة 3 عمداء
  for (let i = 1; i <= 3; i++) {
    generatedMembers.push({
      ...generatedMembers[0],
      id: `dean-${i}`,
      fullName: `العميد ${i}`,
      role: MemberRole.DEAN,
      membershipNumber: `DEN-00${i}`,
      scoutMission: 'مستشار'
    });
  }

  const [members, setMembers] = useState<Member[]>(generatedMembers);
  const [patrols, setPatrols] = useState<Patrol[]>(generatedPatrols);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSession[]>([]);
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  
  // 3. المالية (خزينة وحساب بنكي)
  const [treasuries, setTreasuries] = useState<Treasury[]>([
    { id: 'tr-main', name: 'خزينة الفوج الرئيسية', isMain: true, balance: 25000, manager: 'القائد أمين المال' }
  ]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 'bnk-1', bankName: 'بنك التنمية المحلية BDL', accountNumber: '00123456789012345678', currency: 'DZD', manager: 'قائد الفوج', balance: 150000 }
  ]);

  // 4. الفعاليات (3 أنشطة و 2 مخيمات)
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'act-1', title: 'نشاط الجمعة التربوي الموحد', type: 'ACTIVITY', date: '2024-11-22', location: 'مقر الفوج',
      coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846',
      targetUnits: [UnitName.ASHBAL, UnitName.KASHAF], participants: ['m-p-0-1-1'], leaderIds: ['leader-1'],
      goals: 'التربية الكشفية', cost: 5000, fee: 100, activityExpenses: [], additionalFunding: [], surplusTransfers: []
    },
    {
      id: 'act-2', title: 'دورة في الإسعافات الأولية', type: 'ACTIVITY', date: '2024-11-29', location: 'دار الشباب',
      coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846',
      targetUnits: [UnitName.MOTAQADEM, UnitName.JAWALA], participants: [], leaderIds: ['leader-2'],
      goals: 'تعلم الإسعاف', cost: 3000, fee: 200, activityExpenses: [], additionalFunding: [], surplusTransfers: []
    },
    {
      id: 'act-3', title: 'زيارة لدار الأيتام', type: 'ACTIVITY', date: '2024-12-05', location: 'وسط المدينة',
      coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846',
      targetUnits: [UnitName.ASHBAL, UnitName.KASHAF], participants: [], leaderIds: ['leader-3'],
      goals: 'العمل التطوعي', cost: 2000, fee: 0, activityExpenses: [], additionalFunding: [], surplusTransfers: []
    },
    {
      id: 'cmp-1', title: 'مخيم الشتاء "أشبال التحدي"', type: 'CAMP', date: '2024-12-20', location: 'غابة تيكجدة',
      coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
      targetUnits: [UnitName.ASHBAL], participants: [], leaderIds: ['leader-1', 'leader-2'],
      goals: 'حياة الخلاء', cost: 45000, fee: 2500, leaderFee: 1500, activityExpenses: [], additionalFunding: [], surplusTransfers: []
    },
    {
      id: 'cmp-2', title: 'المخيم التدريبي للقادة', type: 'CAMP', date: '2025-01-10', location: 'مركز التخييم بسيدي فرج',
      coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
      targetUnits: [], participants: [], leaderIds: ['leader-1', 'leader-2', 'leader-3', 'leader-4'],
      goals: 'تطوير المهارات القيادية', cost: 60000, fee: 0, leaderFee: 2000, activityExpenses: [], additionalFunding: [], surplusTransfers: []
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([]);

  // 5. العتاد (لباس وعتاد)
  const [equipment, setEquipment] = useState<EquipmentItem[]>([
    { id: 'eq-1', uniqueId: 'UNI-2024-01', name: 'زي كشفي رسمي - كامل', category: 'لباس', status: 'متاح', condition: 'جديد', location: 'المخزن الرئيسي', size: 'L' },
    { id: 'eq-2', uniqueId: 'TEN-2024-01', name: 'خيمة عملاقة 8 أشخاص', category: 'عتاد', status: 'متاح', condition: 'ممتازة', location: 'المخزن الرئيسي', description: 'خيمة مبيت جماعي' }
  ]);

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
          case 'MEMBERS': return <Members members={members} onAddMember={(m) => setMembers([...members, m])} onUpdateMember={(m) => setMembers(members.map(mem => mem.id === m.id ? m : mem))} onDeleteMember={(id) => setMembers(members.filter(m => m.id !== id))} />;
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
          case 'EQUIPMENT': return <Equipment items={equipment} members={members} events={events} onUpdateEquipment={setEquipment} />;
          case 'SETTINGS': return <Settings />;
          default: return <Dashboard members={members} />;
      }
  };

  return (
    <div className="flex h-screen bg-night-900 text-white font-sans overflow-hidden" dir="rtl">
        <Sidebar 
            currentSection={currentSection} 
            onNavigate={setCurrentSection} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
        />
        
        <button 
            className="fixed top-4 left-4 z-40 p-3 bg-night-800 text-white rounded-xl shadow-lg border border-white/10 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
        >
            <Menu size={24} />
        </button>

        <main className={`
            flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            md:mr-20 
        `}>
            <div className="flex-1 flex flex-col h-full">
                
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

                <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                    {renderContent()}
                </div>
            </div>
        </main>
    </div>
  );
};

export default App;
