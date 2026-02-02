
// Enums and Interfaces based on the Master Prompt

export enum MemberRole {
  SCOUT = 'كشاف',
  LEADER = 'قائد',
  AFFILIATE = 'منخرط', 
  HONORARY = 'عضو شرفي'
}

export enum UnitName {
  BRAEM = 'وحدة البراعم',
  BRAEMAT = 'وحدة البرعمات',
  ASHBAL = 'وحدة الأشبال',
  ZAHARAT = 'وحدة الزهرات',
  KASHAF = 'وحدة الكشاف',
  MORSHIDAT = 'وحدة المرشدات',
  MOTAQADEM = 'وحدة المتقدم',
  MOTAQADEMAT = 'وحدة المتقدمات',
  JAWALA = 'وحدة الجوالة',
  JAWALAT = 'وحدة الجوالات'
}

export interface Member {
  id: string;
  scoutYear: string;
  fullName: string;
  fullNameEn?: string;
  role: MemberRole | string;
  image: string;
  gender: 'ذكر' | 'أنثى';
  birthDate: string;
  birthPlace: string;
  age: number;
  phone?: string;
  email?: string;
  address: string;
  addressDetail?: string;
  bloodType: string;
  membershipNumber: string;
  insuranceNumber: string;
  joinDate?: string;
  isActive: boolean; 
  scoutStatus?: 'نشط' | 'غير نشط' | 'معلق';
  subscriptionPaid: boolean; 
  insurancePaid: boolean; 
  financialNotes?: string;
  guardianName: string;
  guardianJob?: string;
  guardianPhone: string;
  motherName?: string;
  motherJob?: string;
  guardianRelation: string;
  siblingsCount: number;
  birthOrder: number;
  birthOrderLabel?: 'الأول' | 'الأوسط' | 'الأخير' | 'وحيد';
  familyStatus?: string;
  studyStatus: string;
  educationLevel: string;
  institution: string;
  unit: UnitName | string;
  patrol: string;
  scoutMission: string;
  points: number;
  earnedBadges: string[];
  trainingHistory?: string;
  participationHistory?: string;
  otherActivities?: string;
  rank: string;
  financialStatus?: string;
  isOrphan?: boolean;
  healthStatus?: string;
  chronicDiseases?: string;
  allergies?: string;
  housingType?: string;
  familyMembersCount?: number;
  roomCount?: number;
  specialSocialCases?: string;
  livingEnvironment?: string;
  hobbies?: string;
  activityIds?: string[];
  scoutJob?: string;
  disabilityType?: string;
  classSection?: string;
  graduationYear?: string;
  stopYear?: string;
  specialty?: string;
  vaccines?: string;
  emergencyContact?: string;
  healthNotes?: string;
  socialNotes?: string;
  isOrphanMember?: boolean;
  job?: string;
  schoolingChildren?: string;
  scoutChildren?: string;
}

export interface Patrol {
  id: string;
  name: string;
  slogan: string;
  chant?: string;
  logo: string;
  unit: UnitName | string;
  leaderId?: string;
}

export interface Treasury {
  id: string;
  name: string;
  isMain: boolean;
  balance: number;
  manager: string;
  image?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  manager: string;
  balance: number;
  image?: string;
  branchName?: string;
  iban?: string;
  accountType?: string;
}

export type FinanceOpType = 'INCOME' | 'EXPENSE' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ActivityExpense {
  id: string;
  type: 'نقل' | 'تغذية' | 'لوازم' | 'كراء' | 'خدمات' | 'طباعة' | 'تجهيزات' | 'مصاريف أخرى';
  amount: number;
  date: string;
  purpose: string;
  source: string;
  day?: string; 
  notes?: string;
}

export interface ActivityFundingSource {
  id: string;
  label: string;
  amount: number;
  date: string;
}

export interface FinanceOperation {
  id: string;
  transferNumber?: string; 
  type: FinanceOpType;
  date: string;
  amount: number;
  responsible: string;
  notes: string;
  category: 'INSURANCE' | 'SUBSCRIPTION' | 'ACTIVITY' | 'CAMP' | 'AID' | 'TRANSFER' | 'OTHER';
  approvalStatus: ApprovalStatus;
  approvedBy?: string[]; 
  treasuryId?: string; 
  transferType?: 'TREASURY' | 'ACTIVITY' | 'CAMP'; 
  bankAccountId?: string;
  source?: 'بلدية' | 'ولاية' | 'DJS' | 'أخرى' | string;
  proofLink?: string; 
  relatedEntityId?: string; 
  destination: 'المحافظة الولائية' | 'القيادة العامة' | 'خزينة أخرى' | 'نشاط' | 'مخيم' | string;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'INSURANCE' | 'SUBSCRIPTION' | 'ACTIVITY' | 'CAMP' | 'PROJECT' | 'EQUIPMENT' | 'OTHER';
  amount: number;
  date: string;
  description: string;
  relatedEntityId?: string; 
}

export interface AttendanceSession {
  id: string;
  number: number;
  name: string;      
  date: string;
  location: string;  
  time: string;      
  records: { memberId: string; status: AttendanceStatus }[];
}

export interface Sanction {
  id: string;
  memberId: string;
  type: string;
  reason: string;
  status: 'مفعّلة' | 'معلّقة' | 'منتهية';
  date: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'ACTIVITY' | 'CAMP' | 'TRIP';
  date: string;
  location: string;
  coverImage: string;
  targetUnits: UnitName[];
  participants: string[];
  leaderIds: string[];
  goals: string;
  cost: number;
  fee?: number;
  leaderFee?: number;
  manager?: string;
  isClosed?: boolean;
  activityId?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
  activityTime?: string;
  slogan?: string;
  description?: string;
  maxParticipants?: number;
  logoImage?: string;
  managerId?: string;
  leaderResponsibilities?: Record<string, string>;
  activityExpenses?: ActivityExpense[];
  additionalFunding?: ActivityFundingSource[];
  surplusTransfers?: { amount: number; date: string; destination: string; status: ApprovalStatus }[];
}

export interface Project {
  id: string;
  name: string;
  managerId: string;
  budget: number;
  profit: number;
  status: 'قيد التخطيط' | 'جاري' | 'مكتمل';
  description: string;
}

export type EquipmentStatus = 'متاح' | 'مسلم' | 'مخصص' | 'صيانة' | 'تالف' | 'مفقود' | 'متلف';
export type DeliveryType = 'دائم' | 'مؤقت';

export interface EquipmentItem {
  id: string;
  uniqueId: string;
  name: string;
  category: 'لباس' | 'عتاد';
  subCategory?: string;
  status: EquipmentStatus | string;
  condition: 'جديد' | 'مستعمل' | 'يحتاج صيانة' | 'تالف';
  location: string;
  assignedTo?: string;
  deliveryType?: DeliveryType | string;
  assignmentDate?: string;
  returnDate?: string;
  size?: string;
  color?: string;
  description?: string;
  purchaseDate?: string;
  eventId?: string; 
  fineAmount?: number; 
  issuedBy?: string; 
}

export interface Badge {
  id: string;
  name: string;
  pointsValue: number;
  description?: string;
}

export interface PointRecord {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  reason?: string;
  source?: string;
}

export interface RankLevel {
  id: string;
  name: string;
  minPoints: number;
  color: string;
}

export interface AttendanceSettings {
  presentPoints: number;
  latePoints: number;
  absentPoints: number;
  unjustifiedPoints: number;
}

export type AttendanceStatus = 'حاضر' | 'متأخر' | 'غائب' | 'غياب غير مبرر';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'WARNING' | 'INFO';
  timestamp: number;
  action?: () => void;
  actionLabel?: string;
}

// --- Administration Section Types ---

export interface Correspondence {
  id: string;
  type: 'صادر' | 'وارد';
  refNumber: string;
  date: string;
  senderReceiver: string;
  subject: string;
  attachments?: string[];
}

export interface MissionOrder {
  id: string;
  orderNumber: string;
  mission: string;
  destination: string;
  reason: string;
  startDate: string;
  endDate: string;
  responsibleLeader: string;
  leaderDOB: string;
  idCardNumber: string;
  scoutJob: string;
  companions: string;
  transportType: string;
  transportNumber: string;
}

export interface Announcement {
  id: string;
  type: 'تعليمات داخلية' | 'أخبار ومراسلات' | 'تحديثات الأنشطة والمخيمات' | 'التواصل العام';
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Meeting {
  id: string;
  type: 'اجتماعات قيادية' | 'اجتماعات وحدات أو طلائع' | 'اجتماعات استثنائية أو خاصة';
  date: string;
  time: string;
  location: string;
  attendees: string[];
  topics: string;
}

// --- Archive Section Types ---

export interface ArchiveDocument {
  id: string;
  name: string;
  type: 'عقد' | 'مراسلة' | 'قرار' | 'ترخيص' | 'تحويل مالي' | 'فاتورة' | 'إيصال دفع' | 'ميزانية' | string;
  year: string;
  department: string;
  relatedEntityId?: string;
  date: string;
  fileLink?: string;
}

// --- Programming Section Types ---

export type ProgramStatus = 'مخطط' | 'جاري' | 'مكتمل' | 'ملغى';

export interface ProgramActivity {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  responsible: string;
  expectedParticipants: number;
  status: ProgramStatus;
  progress: number;
  description: string;
  team: string[];
  timeline: { title: string; time: string; status: string }[];
  plannedCost: number;
  actualCost: number;
  strengths: string[];
  challenges: string[];
  evaluationNotes: string;
}

export type Section = 
  | 'DASHBOARD'
  | 'MEMBERS'
  | 'UNITS'
  | 'INSURANCE'
  | 'FINANCE'
  | 'DISCIPLINE'
  | 'RANKING'
  | 'ACTIVITIES'
  | 'CAMPS'
  | 'ADMINISTRATION'
  | 'PROGRAMMING'
  | 'REPORTS'
  | 'ARCHIVE'
  | 'PROJECTS'
  | 'EQUIPMENT'
  | 'SETTINGS';
