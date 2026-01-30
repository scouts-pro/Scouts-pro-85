
import { UnitName, MemberRole } from './types';

export const UNITS_LIST = Object.values(UnitName);
export const ROLES_LIST = Object.values(MemberRole);

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const SCOUT_YEARS = ['2023-2024', '2024-2025', '2025-2026'];

export const RELATIONSHIPS = ['أب', 'أم', 'عم/عمة', 'خال/خالة', 'جد/جدة', 'كافل'];

export const FINANCIAL_STATUS = ['ميسورة', 'جيد جداً', 'جيد', 'متوسطة', 'دون المتوسطة', 'يحتاج دعم'];

export const LINEAGE_STATUS = ['لا', 'الأب', 'الوالدين'];

export const YES_NO = ['نعم', 'لا'];

export const EDUCATIONAL_LEVELS = ['تحضيري', 'ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'تكوين مهني'];

export const ALGERIA_WILAYAS = [
  'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار', 'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر', 'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة', 'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض', 'إليزي', 'برج بوعريريج', 'بومرداس', 'الطرف', 'تندوف', 'تيسمسيلت', 'الوادي', 'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت', 'غرداية', 'غليزان',
  'تيميمون', 'برج باجي مختار', 'أولاد جلال', 'بني عباس', 'إن صالح', 'إن قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
];

export const HEALTH_STATUS_OPTIONS = ['جيد', 'متوسط', 'ضعيف', 'بحاجة لمتابعة طبية'];

export const FAMILY_STATUS_OPTIONS = ['متزوج', 'أعزب', 'مطلق', 'أرمل', 'يتيم', 'مجهول النسب'];

export const BIRTH_ORDER_LABELS = ['الأول', 'الأوسط', 'الأخير', 'وحيد'];

export const SCOUT_MISSIONS_SCOUT = ['عضو منتسب', 'عضو غير منتسب'];
export const SCOUT_MISSIONS_LEADER = ['قائد الفوج', 'نائب قائد الفوج', 'مسؤول الوسائل و المالية', 'قائد وحدة', 'نائب قائد وحدة', 'مساعد قائد وحدة', 'قائد متربص'];

export const RANKS_SMALL_UNITS = ['سادوس', 'سادوسة', 'نائب السادوس', 'نائبة السادوسة', 'عضو السداسية'];
export const RANKS_LARGE_UNITS = ['عريف', 'عريفة', 'نائب العريف', 'نائبة العريفة', 'عضو الطليعة', 'أمين السر', 'أمين المخزن', 'مسؤول البرمجة', 'مسؤول العتاد', 'مسؤول النظافة', 'مسؤول الأمن'];

export const NAV_ITEMS = [
  { id: 'DASHBOARD', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
  { id: 'MEMBERS', label: 'إدارة الأعضاء', icon: 'Users' },
  { id: 'UNITS', label: 'الوحدات والطلائع', icon: 'Tent' },
  { id: 'INSURANCE', label: 'التأمينات', icon: 'ShieldCheck' },
  { id: 'FINANCE', label: 'المالية', icon: 'Coins' },
  { id: 'DISCIPLINE', label: 'الانضباط', icon: 'Gavel' },
  { id: 'RANKING', label: 'الترتيب والأوسمة', icon: 'Medal' },
  { id: 'EQUIPMENT', label: 'العتاد واللباس', icon: 'Box' },
  { id: 'ACTIVITIES', label: 'الأنشطة', icon: 'Calendar' },
  { id: 'CAMPS', label: 'المخيمات', icon: 'Map' },
  { id: 'STRATEGY', label: 'الاستراتيجية', icon: 'BrainCircuit' },
  { id: 'PROJECTS', label: 'المشاريع', icon: 'Briefcase' },
  { id: 'SETTINGS', label: 'الإعدادات', icon: 'Settings' },
];
