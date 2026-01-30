
// Enums and Interfaces based on the Master Prompt

export enum MemberRole {
  SCOUT = 'كشاف',
  LEADER = 'قائد',
  AFFILIATE = 'منخرط', // Used for Honorary as per previous context, or mapped logically
  HONORARY = 'عضو شرفي' // Explicitly added for the new form requirement
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
  // Personal
  fullName: string; // الاسم الكامل (اللقب + الاسم)
  fullNameEn?: string; // الاسم باللاتينية
  role: MemberRole | string; // Allowing string for flexibility
  image: string;
  gender: 'ذكر' | 'أنثى';
  birthDate: string;
  birthPlace: string;
  age: number;
  phone?: string;
  email?: string;
  address: string; // Wilaya
  addressDetail?: string; // Free text address
  bloodType: string;
  
  // IDs
  membershipNumber: string;
  insuranceNumber: string;
  joinDate?: string;
  
  // Status Flags
  isActive: boolean; 
  scoutStatus?: 'نشط' | 'غير نشط' | 'معلق'; // Detailed status
  subscriptionPaid: boolean; 
  insurancePaid: boolean; 
  financialNotes?: string;

  // Health
  healthStatus?: string; // Good, Medium, Bad...
  healthStatusNote?: string;
  chronicDiseases?: string;
  allergies?: string;
  vaccines?: string;
  emergencyContact?: string;
  healthNotes?: string;
  // New Health Fields
  disabilityType?: string;
  disabilityNote?: string;

  // Family (Scout Specific mostly)
  guardianName: string;
  guardianJob?: string;
  guardianPhone: string;
  motherName?: string;
  motherJob?: string;
  guardianRelation: string;
  siblingsCount: number;
  birthOrder: number; // 1 = First, etc.
  birthOrderLabel?: 'الأول' | 'الأوسط' | 'الأخير' | 'وحيد';
  familyStatus?: string; // Married, Single, Divorced...
  familyStatusNote?: string;
  isOrphan?: boolean;
  stepParentStatus?: string; // Lives with stepmother/stepfather
  
  // New Family Fields for Leaders/Honorary
  schoolingChildren?: string;
  scoutChildren?: string;

  // Social
  financialStatus: 'ميسورة' | 'متوسطة' | 'دون المتوسطة' | 'جيد جدًا' | 'جيد' | 'يحتاج دعم' | string;
  financialStatusNote?: string;
  housingType: string;
  livingEnvironment: string;
  familyMembersCount: number;
  specialSocialCases: string;
  socialNotes: string;
  job?: string; // For Leaders/Honorary
  roomCount?: number; // Added explicitly

  // Academic
  educationLevel: string;
  institution: string;
  studyStatus: string;
  specialty?: string; // For university/leaders
  classSection?: string; // القسم
  graduationYear?: string;
  stopYear?: string;

  // Scout Specific
  unit: UnitName | string;
  patrol: string; // Sadasia or Talia
  scoutMission: string; // Member/Leader specific mission
  scoutJob: string;
  rank: string;
  hobbies: string;
  activityIds: string[];
  
  // New Activity Fields
  trainingHistory?: string; // الدورات
  participationHistory?: string; // المشاركات
  otherActivities?: string; // وغيرها

  // Honorary
  honoraryTitle?: string;
  honoraryReason?: string;

  // Ranking & Points
  points: number;
  earnedBadges: string[]; // IDs of badges
}

// Units & Patrols
export interface Patrol {
  id: string;
  name: string;
  slogan: string; // شعار الطليعة (نص)
  chant?: string; // الصيحة (منفصلة)
  logo: string;
  unit: UnitName;
  leaderId?: string; // العريف/السادوس
}

// Finance
export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'INSURANCE' | 'SUBSCRIPTION' | 'ACTIVITY' | 'CAMP' | 'PROJECT' | 'EQUIPMENT' | 'OTHER';
  amount: number;
  date: string;
  description: string;
  relatedEntityId?: string; 
}

// Discipline
export interface AttendanceSettings {
  presentPoints: number;
  latePoints: number;
  absentPoints: number; // غياب
  unjustifiedPoints: number; // غياب غير مبرر
}

export type AttendanceStatus = 'حاضر' | 'متأخر' | 'غائب' | 'غياب غير مبرر';

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

// Activities & Camps
export interface Event {
  id: string;
  title: string;
  type: 'ACTIVITY' | 'CAMP' | 'TRIP';
  date: string;
  location: string;
  coverImage: string;
  targetUnits: UnitName[];
  participants: string[]; // Member IDs
  leaderIds: string[];
  goals: string;
  cost: number;
  fee?: number; // رسوم الاشتراك للفرد
  manager?: string; // مسؤول النشاط
  isClosed?: boolean; // New: Financial Closure Status
  closureDate?: string; // New: Date of closure
}

// Projects
export interface Project {
  id: string;
  name: string;
  managerId: string; // Member ID
  budget: number;
  profit: number;
  status: 'قيد التخطيط' | 'جاري' | 'مكتمل';
  description: string;
}

// --- EQUIPMENT & UNIFORMS (STRICT UPDATE) ---

export type EquipmentStatus = 
  | 'متاح' 
  | 'مسلم' // Issued / Loaned
  | 'مخصص' // Reserved
  | 'صيانة' // Maintenance
  | 'تالف' 
  | 'مفقود' 
  | 'متلف'; // Written-off

export type DeliveryType = 
  | 'دائم' // Permanent (Uniforms)
  | 'مؤقت'; // Temporary (Activity/Camp)

export interface EquipmentItem {
  id: string; // Internal System ID
  uniqueId: string; // The Unique Visual ID (e.g., EQ-1001) - MANDATORY
  barcode?: string;
  
  name: string;
  category: 'لباس' | 'عتاد'; // Strict Separation
  subCategory?: string; // e.g., 'Camping', 'Kitchen', 'Shirt'
  
  // Details for Uniforms/Equipment
  size?: string; // XS, S, M, L...
  color?: string; 
  notes?: string;

  status: EquipmentStatus;
  condition: 'جديد' | 'مستعمل' | 'يحتاج صيانة' | 'تالف';
  
  location: string; // Warehouse Name
  
  // Assignment Logic
  assignedTo?: string; // Member ID (Must exist if status is 'مسلم')
  deliveryType?: DeliveryType;
  assignmentDate?: string;
  returnDate?: string; // Mandatory if 'مؤقت'
  relatedActivityId?: string; // Optional: Link to Activity/Camp
  
  // Meta
  description?: string;
  image?: string;
  purchaseDate?: string;
  price?: number;
}

// Ranking System
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageIcon: string; // Lucide icon name or image url
  pointsValue: number;
  requirements: string;
}

export interface PointRecord {
  id: string;
  memberId: string;
  source: 'ACTIVITY' | 'CAMP' | 'DISCIPLINE' | 'ATTENDANCE' | 'BADGE';
  reason: string;
  amount: number; // Positive or negative
  date: string;
}

export interface RankLevel {
  id: string;
  name: string;
  minPoints: number;
  color: string;
  icon: string;
}

// Notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'WARNING' | 'INFO';
  timestamp: number;
  action?: () => void; // Action callback (e.g. Approve)
  actionLabel?: string;
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
  | 'STRATEGY'
  | 'PROJECTS'
  | 'EQUIPMENT'
  | 'SETTINGS';
