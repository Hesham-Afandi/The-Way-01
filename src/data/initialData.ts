import {
  Student,
  Teacher,
  Subject,
  Room,
  TeacherAssignment,
  Contract,
  Session,
  AttendanceRecord,
  Payment,
  TeacherPayment,
  NotificationItem,
  AuditLogItem,
  User,
  CenterSettings,
  StudentStatus,
  ContractStatus,
  SessionStatus,
  SessionType,
  AttendanceStatus,
  PaymentMethod,
  UserRole,
  AuditAction
} from '../types';

const today = new Date().toISOString().split('T')[0];

export const initialSettings: CenterSettings = {
  centerName: 'The Way Educational Center - UAE',
  phone: '+971 4 234 5678',
  whatsapp: '+971 50 123 4567',
  address: 'دولة الإمارات العربية المتحدة - دبي - الخليج التجاري / شارع الشيخ زايد',
  email: 'info@theway-center.ae',
  currency: 'د.إ',
  defaultSessionDuration: 90,
  attendanceGracePeriod: 15,
  cancellationPolicy: 'free_if_24h',
  contractExpiryAlertDays: 7,
  lowSessionsAlertThreshold: 3,
  allowOverlappingSessions: false,
  enforceRoomCapacity: true
};

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'أ. ولاء حمدان (المدير العام)',
    username: 'admin',
    email: 'walaa@theway-center.ae',
    role: UserRole.SUPER_ADMIN,
    department: 'إدارة',
    departmentDescription: 'كامل صلاحيات الإدارة، التعديل والاطلاع على كافة الأقسام والتقارير والإعدادات وطاقم العمل',
    phone: '+971 50 998 8776',
    password: '123',
    isActive: true
  },
  {
    id: 'usr-2',
    name: 'فاطمة المنصوري (مسؤولة الاستقبال)',
    username: 'reception',
    email: 'reception@theway-center.ae',
    role: UserRole.RECEPTION,
    department: 'ريسبشن',
    departmentDescription: 'تنظيم شؤون الطلاب، تسجيل الحضور والغياب اليومي، كود الطالب، وجدولة الحصص والقاعات',
    phone: '+971 52 233 4455',
    password: '123',
    isActive: true
  },
  {
    id: 'usr-3',
    name: 'راشد القاسمي (مسؤول المبيعات والاشتراكات)',
    username: 'sales',
    email: 'sales@theway-center.ae',
    role: UserRole.SALES,
    department: 'سيلز',
    departmentDescription: 'إدارة الاشتراكات والعقود، سندات القبض والدفعات، وتسجيل الطلاب في الباقات التعليمية',
    phone: '+971 55 544 3322',
    password: '123',
    isActive: true
  },
  {
    id: 'usr-4',
    name: 'د. محمد هشام (مدرس الرياضيات والفيزياء)',
    username: 'teacher',
    email: 'mohammed@theway-center.ae',
    role: UserRole.TEACHER,
    department: 'مدرسين',
    departmentDescription: 'إدارة حصصه الدراسية، تسجيل حضور طلاب مجموعته ومتابعة الملاحظات والواجبات',
    phone: '+971 50 112 2334',
    teacherId: 'tch-1',
    password: '123',
    isActive: true
  },
  {
    id: 'usr-5',
    name: 'سامح الكعبي (المحاسب المالي)',
    username: 'accountant',
    email: 'accounts@theway-center.ae',
    role: UserRole.ACCOUNTANT,
    department: 'حسابات',
    departmentDescription: 'التحصيل المالي، صرف مستحقات المدرسين، والتقارير المالية والميزانية بالدرهم الإماراتي',
    phone: '+971 56 334 4556',
    password: '123',
    isActive: true
  }
];

export const initialSubjects: Subject[] = [
  {
    id: 'sbj-1',
    code: 'MATH-12A',
    name: 'الرياضيات - المسار المتقدم (Grade 12)',
    category: 'المنهاج الوزاري الإماراتي',
    description: 'منهج الرياضيات المتقدم والتفاضل والتكامل والجبر الخطي للصف الثاني عشر',
    color: '#2563eb',
    isActive: true,
    gradeLevels: ['الصف الثاني عشر (Grade 12)', 'الصف الحادي عشر (Grade 11)'],
    defaultSessionPrice: 220
  },
  {
    id: 'sbj-2',
    code: 'PHYS-12A',
    name: 'الفيزياء - المسار المتقدم (Grade 12)',
    category: 'المنهاج الوزاري الإماراتي',
    description: 'الفيزياء الحديثة والكهرومغناطيسية والميكانيكا المتقدمة لاختبارات الوزارة و EmSAT',
    color: '#4f46e5',
    isActive: true,
    gradeLevels: ['الصف الثاني عشر (Grade 12)', 'الصف الحادي عشر (Grade 11)'],
    defaultSessionPrice: 240
  },
  {
    id: 'sbj-3',
    code: 'CHEM-11G',
    name: 'الكيمياء العامة والعضوية',
    category: 'المنهاج الوزاري الإماراتي',
    description: 'الكيمياء العامة والحركية والكهربائية للمسارين العام والمتقدم',
    color: '#0891b2',
    isActive: true,
    gradeLevels: ['الصف الحادي عشر (Grade 11)', 'الصف العاشر (Grade 10)'],
    defaultSessionPrice: 200
  },
  {
    id: 'sbj-4',
    code: 'BIO-10',
    name: 'الأحياء والعلوم الصحية',
    category: 'المنهاج الوزاري الإماراتي',
    description: 'علم الأحياء، الوراثة، والعلوم الحيوية للمرحلة الثانوية',
    color: '#059669',
    isActive: true,
    gradeLevels: ['الصف العاشر (Grade 10)', 'الصف التاسع (Grade 9)'],
    defaultSessionPrice: 190
  },
  {
    id: 'sbj-5',
    code: 'ENG-EMSAT',
    name: 'اللغة الإنجليزية و EmSAT / IELTS',
    category: 'اللغات والاختبارات القياسية',
    description: 'تأهيل اختبارات EmSAT Achieve English واختبارات القبول الجامعي والدراسات الدولية',
    color: '#d97706',
    isActive: true,
    gradeLevels: ['الصف الثاني عشر (Grade 12)', 'الصف الحادي عشر (Grade 11)', 'الصف العاشر (Grade 10)'],
    defaultSessionPrice: 250
  },
  {
    id: 'sbj-6',
    code: 'ARAB-09',
    name: 'اللغة العربية والتربية الإسلامية',
    category: 'المواد الوزارية الأساسية',
    description: 'قواعد النحو، البلاغة، والأدب والتربية الإسلامية لجميع المراحل',
    color: '#7c3aed',
    isActive: true,
    gradeLevels: ['الصف التاسع (Grade 9)', 'الصف الثامن (Grade 8)', 'الصف السابع (Grade 7)'],
    defaultSessionPrice: 180
  },
  {
    id: 'sbj-7',
    code: 'SCI-06',
    name: 'العلوم العامة للمرحلة المتوسطة (Grade 6 - 8)',
    category: 'المنهاج الأساسي',
    description: 'مبادئ الفيزياء والكيمياء والأحياء المبسطة',
    color: '#0284c7',
    isActive: true,
    gradeLevels: ['الصف السادس (Grade 6)', 'الصف السابع (Grade 7)', 'الصف الثامن (Grade 8)'],
    defaultSessionPrice: 170
  },
  {
    id: 'sbj-8',
    code: 'KG-FOUND',
    name: 'التأسيس اللغوي والحسابي (KG1 - KG2)',
    category: 'رياض الأطفال والتأسيس',
    description: 'القراءة والكتابة والحساب الذهني المبكر وتنمية المهارات',
    color: '#ea580c',
    isActive: true,
    gradeLevels: ['روضة أولى (KG 1)', 'روضة ثانية (KG 2)'],
    defaultSessionPrice: 150
  }
];

export const initialRooms: Room[] = [
  {
    id: 'rm-1',
    code: 'RM-101',
    name: 'قاعة دبي للمتفوقين 1',
    number: '101',
    capacity: 16,
    type: 'classroom',
    equipment: ['شاشة تفاعلية ذكية 75 بوصة', 'تكييف مركزي', 'سبورة رقمية وكاميرا'],
    status: 'occupied',
    isActive: true
  },
  {
    id: 'rm-2',
    code: 'RM-102',
    name: 'قاعة أبوظبي للنجاح 2',
    number: '102',
    capacity: 12,
    type: 'classroom',
    equipment: ['شاشة ذكية 4K', 'تكييف مركزي', 'وايت بورد تفاعلي'],
    status: 'available',
    isActive: true
  },
  {
    id: 'rm-3',
    code: 'RM-103',
    name: 'مختبر العلوم والفيزياء 3',
    number: '103',
    capacity: 14,
    type: 'lab',
    equipment: ['أدوات تجارب علمية', 'بروجكتور ليزري تفاعلي', 'محطات حاسوب'],
    status: 'available',
    isActive: true
  },
  {
    id: 'rm-4',
    code: 'RM-104',
    name: 'قاعة الدروس الفردية VIP (Private Hall)',
    number: '104',
    capacity: 4,
    type: 'private_hall',
    equipment: ['شاشة ذكية 4K', 'تكييف مركزي', 'نظام صوتي وعزل صوت تام'],
    status: 'occupied',
    isActive: true
  },
  {
    id: 'online',
    code: 'NET-01',
    name: 'منصة البث الأونلاين The Way Live UAE',
    number: 'NET',
    capacity: 150,
    type: 'online',
    equipment: ['سيرفرات بث مباشر فائقة السرعة', 'تسجيل ومزامنة سحابية عالية الدقة'],
    status: 'available',
    isActive: true
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'tch-1',
    code: 'TCH-101',
    name: 'د. محمد هشام',
    phone: '+971 50 112 2334',
    email: 'mohammed.hesham@theway-center.ae',
    address: 'دبي - واحة دبي للسيليكون',
    subjectIds: ['sbj-1', 'sbj-2'],
    hourlyRate: 250,
    rateType: 'percentage',
    defaultRate: 75,
    status: 'active',
    color: '#1D4ED8',
    bio: 'خبير تدريس الرياضيات والفيزياء للمسارين المتقدم والعام واختبارات EmSAT والقبول الجامعي بخبرة 12 عاماً في مدارس الإمارات.',
    joinedDate: '2023-01-01'
  },
  {
    id: 'tch-2',
    code: 'TCH-102',
    name: 'أ. مريم الشامسي',
    phone: '+971 52 987 6543',
    email: 'mariam.shamsi@theway-center.ae',
    address: 'الشارقة - الخزامية',
    subjectIds: ['sbj-3', 'sbj-4'],
    hourlyRate: 230,
    rateType: 'percentage',
    defaultRate: 70,
    status: 'active',
    color: '#059669',
    bio: 'معلمة معتمدة للكيمياء والأحياء للمرحلة الثانوية مع إعداد مكثف للتدريبات العملية والاختبارات المعيارية.',
    joinedDate: '2023-09-01'
  },
  {
    id: 'tch-3',
    code: 'TCH-103',
    name: 'أ. ديفيد ويليامز (David Williams)',
    phone: '+971 55 432 1098',
    email: 'david.w@theway-center.ae',
    address: 'دبي - المارينا',
    subjectIds: ['sbj-5'],
    hourlyRate: 260,
    rateType: 'percentage',
    defaultRate: 75,
    status: 'active',
    color: '#d97706',
    bio: 'مدرس لغة إنجليزية معتمد لاختبارات EmSAT و IELTS والمهارات اللغوية للمرحلة الثانوية والجامعية.',
    joinedDate: '2024-01-15'
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std-1',
    code: 'STD-1001',
    name: 'حمد سلطان النعيمي',
    gender: 'male',
    birthDate: '2007-04-12',
    grade: 'الصف الثاني عشر (Grade 12)',
    track: 'advanced',
    school: 'مدرسة دبي الوطنية - البرشاء',
    phone: '+971 50 111 2233',
    parent: {
      id: 'par-1',
      name: 'سلطان النعيمي',
      phone: '+971 50 991 1223',
      whatsapp: '+971 50 991 1223',
      email: 'sultan.alnuaimi@emirates.ae',
      relationship: 'الأب'
    },
    address: 'دبي - منطقة ند الشبا',
    status: StudentStatus.ACTIVE,
    registrationDate: '2024-09-01',
    notes: 'طالب متميز مسجل في المسار المتقدم ويستعد لاختبارات EmSAT في الرياضيات والفيزياء',
    avatarColor: '#1d4ed8',
    subjectIds: ['sbj-1', 'sbj-2']
  },
  {
    id: 'std-2',
    code: 'STD-1002',
    name: 'ميثاء خليفة المزروعي',
    gender: 'female',
    birthDate: '2007-09-20',
    grade: 'الصف الثاني عشر (Grade 12)',
    track: 'advanced',
    school: 'مدرسة المواكب - القرهود',
    phone: '+971 52 333 4445',
    parent: {
      id: 'par-2',
      name: 'خليفة المزروعي',
      phone: '+971 50 882 2334',
      whatsapp: '+971 50 882 2334',
      email: 'khalifa.almazrouei@gmail.com',
      relationship: 'الأب'
    },
    address: 'دبي - الورقاء 2',
    status: StudentStatus.ACTIVE,
    registrationDate: '2024-09-05',
    notes: 'منتظمة في حضور حصص الفيزياء المتقدمة والمراجعات النهائية',
    avatarColor: '#ec4899',
    subjectIds: ['sbj-2']
  },
  {
    id: 'std-3',
    code: 'STD-1003',
    name: 'سعود راشد المنصوري',
    gender: 'male',
    birthDate: '2008-01-15',
    grade: 'الصف الحادي عشر (Grade 11)',
    track: 'general',
    school: 'مدرسة الإمارات الوطنية - دبي',
    phone: '+971 55 444 5556',
    parent: {
      id: 'par-3',
      name: 'راشد المنصوري',
      phone: '+971 55 773 3445',
      whatsapp: '+971 55 773 3445',
      email: 'rashid.almansoori@yahoo.com',
      relationship: 'الأب'
    },
    address: 'دبي - الجميرا 3',
    status: StudentStatus.ACTIVE,
    registrationDate: '2024-08-20',
    notes: 'مشترك في باقة الرياضيات والكيمياء للمسار العام',
    avatarColor: '#059669',
    subjectIds: ['sbj-1', 'sbj-3']
  },
  {
    id: 'std-4',
    code: 'STD-1004',
    name: 'شما محمد الهاشمي',
    gender: 'female',
    birthDate: '2009-11-05',
    grade: 'الصف العاشر (Grade 10)',
    track: 'general',
    school: 'مدرسة راشد للبنات - دبي',
    phone: '+971 56 555 6667',
    parent: {
      id: 'par-4',
      name: 'محمد الهاشمي',
      phone: '+971 56 664 4556',
      whatsapp: '+971 56 664 4556',
      email: 'm.alhashemi@gmail.com',
      relationship: 'الأب'
    },
    address: 'دبي - مردف',
    status: StudentStatus.ACTIVE,
    registrationDate: '2024-10-01',
    notes: 'تأخذ دروس الأحياء واللغة الإنجليزية',
    avatarColor: '#3b82f6',
    subjectIds: ['sbj-4', 'sbj-5']
  },
  {
    id: 'std-5',
    code: 'STD-1005',
    name: 'عبدالله هزاع الكعبي',
    gender: 'male',
    birthDate: '2007-06-30',
    grade: 'الصف الثاني عشر (Grade 12)',
    track: 'advanced',
    school: 'مدرسة الاتحاد الخاصة - الممزر',
    phone: '+971 50 666 7778',
    parent: {
      id: 'par-5',
      name: 'هزاع الكعبي',
      phone: '+971 50 555 6677',
      whatsapp: '+971 50 555 6677',
      relationship: 'الأب'
    },
    address: 'الشارقة - المجاز 3',
    status: StudentStatus.ACTIVE,
    registrationDate: '2024-09-10',
    avatarColor: '#1e40af',
    subjectIds: ['sbj-1', 'sbj-2']
  },
  {
    id: 'std-6',
    code: 'STD-1006',
    name: 'زايد عيسى الفلاسي',
    gender: 'male',
    birthDate: '2007-08-19',
    grade: 'الصف الثاني عشر (Grade 12)',
    track: 'advanced',
    school: 'مدرسة الأفق النموذجية',
    phone: '+971 54 123 4123',
    parent: {
      id: 'par-6',
      name: 'عيسى الفلاسي',
      phone: '+971 54 998 8112',
      whatsapp: '+971 54 998 8112',
      relationship: 'الأب'
    },
    address: 'دبي - زعبيل 1',
    status: StudentStatus.ACTIVE,
    registrationDate: '2024-09-08',
    avatarColor: '#1d4ed8',
    subjectIds: ['sbj-1', 'sbj-2']
  }
];

export const initialTeacherAssignments: TeacherAssignment[] = [
  { id: 'asg-1', studentId: 'std-1', subjectId: 'sbj-1', teacherId: 'tch-1', assignedDate: '2024-09-01', ratePerSession: 220 },
  { id: 'asg-2', studentId: 'std-1', subjectId: 'sbj-2', teacherId: 'tch-1', assignedDate: '2024-09-01', ratePerSession: 240 },
  { id: 'asg-3', studentId: 'std-2', subjectId: 'sbj-2', teacherId: 'tch-1', assignedDate: '2024-09-05', ratePerSession: 240 },
  { id: 'asg-4', studentId: 'std-3', subjectId: 'sbj-1', teacherId: 'tch-1', assignedDate: '2024-08-20', ratePerSession: 220 },
  { id: 'asg-5', studentId: 'std-3', subjectId: 'sbj-3', teacherId: 'tch-2', assignedDate: '2024-08-20', ratePerSession: 200 },
  { id: 'asg-6', studentId: 'std-4', subjectId: 'sbj-4', teacherId: 'tch-2', assignedDate: '2024-10-01', ratePerSession: 190 },
  { id: 'asg-7', studentId: 'std-4', subjectId: 'sbj-5', teacherId: 'tch-3', assignedDate: '2024-10-01', ratePerSession: 250 },
  { id: 'asg-8', studentId: 'std-5', subjectId: 'sbj-1', teacherId: 'tch-1', assignedDate: '2024-09-10', ratePerSession: 220 },
  { id: 'asg-9', studentId: 'std-5', subjectId: 'sbj-2', teacherId: 'tch-1', assignedDate: '2024-09-10', ratePerSession: 240 },
  { id: 'asg-10', studentId: 'std-6', subjectId: 'sbj-1', teacherId: 'tch-1', assignedDate: '2024-09-08', ratePerSession: 220 }
];

export const initialContracts: Contract[] = [
  {
    id: 'cnt-1',
    contractNumber: 'CNT-UAE-2025-001',
    studentId: 'std-1',
    subjectIds: ['sbj-1', 'sbj-2'],
    teacherId: 'tch-1',
    startDate: '2025-01-01',
    endDate: '2025-05-30',
    totalSessions: 32,
    usedSessions: 22,
    sessionDurationMinutes: 90,
    pricePerSession: 250,
    totalPrice: 8000,
    paidAmount: 6000,
    status: ContractStatus.ACTIVE,
    notes: 'باقة المسار المتقدم للثانوية العامة (رياضيات وفيزياء EmSAT) مع د. محمد هشام',
    createdAt: '2025-01-01'
  },
  {
    id: 'cnt-2',
    contractNumber: 'CNT-UAE-2025-002',
    studentId: 'std-2',
    subjectIds: ['sbj-2'],
    teacherId: 'tch-1',
    startDate: '2025-01-05',
    endDate: '2025-06-15',
    totalSessions: 24,
    usedSessions: 22,
    sessionDurationMinutes: 90,
    pricePerSession: 240,
    totalPrice: 5760,
    paidAmount: 5760,
    status: ContractStatus.EXPIRING_SOON,
    notes: 'باقة الفيزياء المتقدمة - يتبقى حصتان فقط للتجديد',
    createdAt: '2025-01-05'
  },
  {
    id: 'cnt-3',
    contractNumber: 'CNT-UAE-2025-003',
    studentId: 'std-3',
    subjectIds: ['sbj-1', 'sbj-3'],
    teacherId: 'tch-1',
    startDate: '2025-01-10',
    endDate: '2025-05-20',
    totalSessions: 20,
    usedSessions: 14,
    sessionDurationMinutes: 90,
    pricePerSession: 220,
    totalPrice: 4400,
    paidAmount: 3000,
    status: ContractStatus.ACTIVE,
    notes: 'باقة الرياضيات والكيمياء للصف الحادي عشر',
    createdAt: '2025-01-10'
  },
  {
    id: 'cnt-4',
    contractNumber: 'CNT-UAE-2025-004',
    studentId: 'std-4',
    subjectIds: ['sbj-4', 'sbj-5'],
    teacherId: 'tch-3',
    startDate: '2025-02-01',
    endDate: '2025-06-01',
    totalSessions: 16,
    usedSessions: 6,
    sessionDurationMinutes: 90,
    pricePerSession: 250,
    totalPrice: 4000,
    paidAmount: 4000,
    status: ContractStatus.ACTIVE,
    notes: 'باقة الأحياء واللغة الإنجليزية EmSAT',
    createdAt: '2025-02-01'
  },
  {
    id: 'cnt-5',
    contractNumber: 'CNT-UAE-2025-005',
    studentId: 'std-5',
    subjectIds: ['sbj-1', 'sbj-2'],
    teacherId: 'tch-1',
    startDate: '2025-01-15',
    endDate: '2025-05-15',
    totalSessions: 24,
    usedSessions: 15,
    sessionDurationMinutes: 90,
    pricePerSession: 240,
    totalPrice: 5760,
    paidAmount: 4000,
    status: ContractStatus.ACTIVE,
    createdAt: '2025-01-15'
  },
  {
    id: 'cnt-6',
    contractNumber: 'CNT-UAE-2025-006',
    studentId: 'std-6',
    subjectIds: ['sbj-1'],
    teacherId: 'tch-1',
    startDate: '2025-01-15',
    endDate: '2025-05-15',
    totalSessions: 18,
    usedSessions: 10,
    sessionDurationMinutes: 90,
    pricePerSession: 220,
    totalPrice: 3960,
    paidAmount: 2500,
    status: ContractStatus.ACTIVE,
    createdAt: '2025-01-15'
  }
];

export const initialSessions: Session[] = [
  // 1. LIVE NOW Session (1) - Mathematics Advanced
  {
    id: 'ses-live-1',
    sessionCode: 'SES-UAE-101',
    title: 'مجموعة التفوق - الرياضيات المتقدمة والتفاضل والتكامل (Grade 12)',
    type: SessionType.GROUP,
    subjectId: 'sbj-1',
    teacherId: 'tch-1',
    roomId: 'rm-1',
    studentIds: ['std-1', 'std-5', 'std-6'],
    date: today,
    startTime: '12:00',
    endTime: '23:59',
    durationMinutes: 90,
    status: SessionStatus.LIVE,
    contractId: 'cnt-1',
    notes: 'مراجعة تطبيقات القيم العظمى والصغرى ونهايات الدوال مع د. محمد هشام',
    countAgainstStudentSessions: true
  },
  // 2. LIVE NOW Session (2) - Physics VIP
  {
    id: 'ses-live-2',
    sessionCode: 'SES-UAE-102',
    title: 'درس خاص VIP - فيزياء كهربية ومغناطيسية متقدمة',
    type: SessionType.INDIVIDUAL,
    subjectId: 'sbj-2',
    teacherId: 'tch-1',
    roomId: 'rm-4',
    studentIds: ['std-1'],
    date: today,
    startTime: '11:30',
    endTime: '23:45',
    durationMinutes: 90,
    status: SessionStatus.LIVE,
    contractId: 'cnt-1',
    notes: 'حل مسائل كيرشوف ونماذج اختبارات EmSAT السابقة',
    countAgainstStudentSessions: true
  },
  // 3. Completed Earlier Today
  {
    id: 'ses-comp-1',
    sessionCode: 'SES-UAE-001',
    title: 'حصة فيزياء متقدمة - الديناميكا والحرارة',
    type: SessionType.GROUP,
    subjectId: 'sbj-2',
    teacherId: 'tch-1',
    roomId: 'rm-2',
    studentIds: ['std-2', 'std-5'],
    date: today,
    startTime: '09:00',
    endTime: '10:30',
    durationMinutes: 90,
    status: SessionStatus.COMPLETED,
    contractId: 'cnt-2',
    notes: 'شرح قوانين الحركة وتطبيقات الطاقة',
    countAgainstStudentSessions: true
  },
  // 4. Upcoming Today Evening
  {
    id: 'ses-up-1',
    sessionCode: 'SES-UAE-002',
    title: 'مكثف اللغة الإنجليزية واختبارات EmSAT / IELTS',
    type: SessionType.GROUP,
    subjectId: 'sbj-5',
    teacherId: 'tch-3',
    roomId: 'rm-1',
    studentIds: ['std-3', 'std-4'],
    date: today,
    startTime: '18:00',
    endTime: '20:00',
    durationMinutes: 120,
    status: SessionStatus.SCHEDULED,
    contractId: 'cnt-3',
    notes: 'تدريب مكثف على مهارات القراءة والكتابة الأكاديمية واختبار تجريبي',
    countAgainstStudentSessions: true
  },
  // 5. Upcoming Online
  {
    id: 'ses-up-2',
    sessionCode: 'SES-UAE-003',
    title: 'The Way Live UAE - حل مسائل الكيمياء والأحياء المتقدمة',
    type: SessionType.INDIVIDUAL,
    subjectId: 'sbj-3',
    teacherId: 'tch-2',
    roomId: 'online',
    studentIds: ['std-3'],
    date: today,
    startTime: '20:30',
    endTime: '22:00',
    durationMinutes: 90,
    status: SessionStatus.SCHEDULED,
    contractId: 'cnt-3',
    notes: 'بث أونلاين مباشر لمراجعة أسئلة نهاية الفصل الدراسي',
    countAgainstStudentSessions: true
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    sessionId: 'ses-comp-1',
    studentId: 'std-2',
    teacherId: 'tch-1',
    date: today,
    status: AttendanceStatus.PRESENT,
    checkInTime: '08:55',
    checkOutTime: '10:30',
    notes: 'حضور مبكر ومشاركة ممتازة في حل مسائل الفيزياء',
    markedByUserId: 'usr-2',
    createdAt: `${today}T08:55:00Z`
  },
  {
    id: 'att-2',
    sessionId: 'ses-comp-1',
    studentId: 'std-5',
    teacherId: 'tch-1',
    date: today,
    status: AttendanceStatus.PRESENT,
    checkInTime: '09:02',
    checkOutTime: '10:30',
    markedByUserId: 'usr-2',
    createdAt: `${today}T09:02:00Z`
  },
  {
    id: 'att-3',
    sessionId: 'ses-live-1',
    studentId: 'std-1',
    teacherId: 'tch-1',
    date: today,
    status: AttendanceStatus.PRESENT,
    checkInTime: '12:05',
    notes: 'تسجيل الحضور عبر كود الطالب من مكتب الاستقبال',
    markedByUserId: 'usr-2',
    createdAt: `${today}T12:05:00Z`
  },
  {
    id: 'att-4',
    sessionId: 'ses-live-1',
    studentId: 'std-5',
    teacherId: 'tch-1',
    date: today,
    status: AttendanceStatus.PRESENT,
    checkInTime: '12:10',
    markedByUserId: 'usr-2',
    createdAt: `${today}T12:10:00Z`
  },
  {
    id: 'att-5',
    sessionId: 'ses-live-1',
    studentId: 'std-6',
    teacherId: 'tch-1',
    date: today,
    status: AttendanceStatus.LATE,
    checkInTime: '12:20',
    notes: 'تأخر 20 دقيقة بعذر مسبق',
    markedByUserId: 'usr-2',
    createdAt: `${today}T12:20:00Z`
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    receiptNumber: 'REC-UAE-5001',
    contractId: 'cnt-1',
    studentId: 'std-1',
    amount: 3000,
    date: '2025-01-01',
    paymentMethod: PaymentMethod.CASH,
    notes: 'الدفعة الأولى - اشتراك باقة الرياضيات والفيزياء المتقدمة (د.إ)',
    collectedByUserId: 'usr-2',
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 'pay-2',
    receiptNumber: 'REC-UAE-5002',
    contractId: 'cnt-1',
    studentId: 'std-1',
    amount: 3000,
    date: '2025-02-01',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: 'الدفعة الثانية - تحويل مصرفي مباشر (ENBD / ADCB)',
    collectedByUserId: 'usr-3',
    createdAt: '2025-02-01T14:30:00Z'
  },
  {
    id: 'pay-3',
    receiptNumber: 'REC-UAE-5003',
    contractId: 'cnt-2',
    studentId: 'std-2',
    amount: 5760,
    date: '2025-01-05',
    paymentMethod: PaymentMethod.CARD,
    notes: 'سداد كامل قيمة باقة الفيزياء بالبطاقة الائتمانية',
    collectedByUserId: 'usr-2',
    createdAt: '2025-01-05T12:00:00Z'
  },
  {
    id: 'pay-4',
    receiptNumber: 'REC-UAE-5004',
    contractId: 'cnt-3',
    studentId: 'std-3',
    amount: 3000,
    date: '2025-01-10',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: 'دفعة أولى - دورة الرياضيات والكيمياء للصف الحادي عشر',
    collectedByUserId: 'usr-3',
    createdAt: '2025-01-10T16:00:00Z'
  },
  {
    id: 'pay-5',
    receiptNumber: 'REC-UAE-5005',
    contractId: 'cnt-4',
    studentId: 'std-4',
    amount: 4000,
    date: '2025-02-01',
    paymentMethod: PaymentMethod.CASH,
    notes: 'سداد كامل باقة الأحياء واللغة الإنجليزية EmSAT',
    collectedByUserId: 'usr-2',
    createdAt: '2025-02-01T11:00:00Z'
  }
];

export const initialTeacherPayments: TeacherPayment[] = [
  {
    id: 'tp-1',
    payoutNumber: 'PAY-UAE-7001',
    teacherId: 'tch-1',
    amount: 8500,
    sessionsCount: 22,
    totalHours: 33,
    periodStart: '2025-01-01',
    periodEnd: '2025-01-31',
    date: '2025-02-02',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: 'مستحقات شهر يناير 2025 - د. محمد هشام (رياضيات وفيزياء متقدمة)',
    createdAt: '2025-02-02T12:00:00Z'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'low_sessions',
    title: 'تنبيه: رصيد حصص منخفض',
    message: 'الطالبة "ميثاء خليفة المزروعي" متبقي لها حصتان فقط في عقد الفيزياء المتقدمة (CNT-UAE-2025-002).',
    date: today,
    isRead: false,
    relatedEntityId: 'std-2',
    relatedEntityType: 'student',
    priority: 'high'
  },
  {
    id: 'notif-2',
    type: 'payment_overdue',
    title: 'مستحقات دفع متبقية',
    message: 'يوجد متبقي 1,400 د.إ على عقد الطالب "سعود راشد المنصوري" (CNT-UAE-2025-003).',
    date: today,
    isRead: false,
    relatedEntityId: 'cnt-3',
    relatedEntityType: 'contract',
    priority: 'medium'
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'log-1',
    userId: 'usr-1',
    userName: 'أ. ولاء حمدان (المدير العام)',
    action: AuditAction.CREATE,
    entityType: 'Contract',
    entityId: 'cnt-1',
    entityName: 'عقد جديد CNT-UAE-2025-001',
    timestamp: '2025-01-01 10:15:00',
    details: 'تم إنشاء عقد جديد للطالب حمد سلطان النعيمي بعدد 32 حصة بقيمة 8,000 د.إ'
  },
  {
    id: 'log-2',
    userId: 'usr-2',
    userName: 'فاطمة المنصوري (الاستقبال)',
    action: AuditAction.PAYMENT_RECORDED,
    entityType: 'Payment',
    entityId: 'pay-1',
    entityName: 'سند قبض REC-UAE-5001',
    timestamp: '2025-01-01 10:30:00',
    details: 'تم تحصيل مبلغ 3,000 د.إ نقداً من الطالب حمد سلطان النعيمي'
  },
  {
    id: 'log-3',
    userId: 'usr-2',
    userName: 'فاطمة المنصوري (الاستقبال)',
    action: AuditAction.ATTENDANCE_MARKED,
    entityType: 'Attendance',
    entityId: 'att-1',
    entityName: 'تسجيل حضور سريع',
    timestamp: `${today} 08:55:00`,
    details: 'تم تسجيل حضور الطالبة ميثاء خليفة المزروعي عبر كود الطالب'
  },
  {
    id: 'log-4',
    userId: 'usr-1',
    userName: 'أ. ولاء حمدان (المدير العام)',
    action: AuditAction.TEACHER_ASSIGNED,
    entityType: 'Assignment',
    entityId: 'asg-1',
    entityName: 'تعيين مدرس',
    timestamp: '2024-09-01 12:00:00',
    details: 'تم تعيين د. محمد هشام للطالب حمد سلطان النعيمي في مادتي الرياضيات والفيزياء المتقدمة'
  }
];
