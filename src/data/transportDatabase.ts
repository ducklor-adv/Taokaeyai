// ==================== ฐานข้อมูลจำลอง บริษัทขนส่ง 650 เที่ยว/เดือน ====================
// Seasonal Pattern: High season (พ.ย.-ก.พ.), Low season (มี.ค.-พ.ค.), Normal (มิ.ย.-ต.ค.)
//
// สถานการณ์: "รับงานเยอะ แต่สภาพคล่องตึง"
// - เที่ยววิ่งเกินเป้า (105-115%)
// - รายได้ดีมาก
// - แต่ลูกค้าจ่ายช้า (เก็บเงินได้ 55-65%)
// - ลูกหนี้ค้างเยอะ (40% overdue)
// - เงินสดเหลือน้อย ต้องจ่ายเจ้าหนี้ทุกเดือน (น้ำมัน, เงินเดือน, ซ่อมบำรุง)

import type { TimeRange } from '../types';

// ==================== Types ====================

export interface Customer {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  address: string;
  creditDays: number;
  avgTripsPerMonth: number;
  avgRatePerTrip: number;
}

export interface Trip {
  id: string;
  tripDate: Date;
  customerId: string;
  origin: string;
  destination: string;
  distance: number;
  rate: number;
  fuelCost: number;
  driverCost: number;
  otherCost: number;
  status: 'completed' | 'pending' | 'cancelled';
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  trips: string[];
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: Date;
}

export interface MonthlyFinancial {
  month: number;
  year: number;
  monthLabel: string;
  // Revenue
  budgetRevenue: number;
  actualRevenue: number;
  // Expenses
  budgetExpense: number;
  actualExpense: number;
  // Breakdown
  fuelExpense: number;
  salaryExpense: number;
  maintenanceExpense: number;
  adminExpense: number;
  otherExpense: number;
  // Trips
  budgetTrips: number;
  actualTrips: number;
  // Health metrics
  healthScore: number;
  budgetHealthScore: number;
  // Cash flow
  cashInflow: number;
  cashOutflow: number;
  freeCashFlow: number;
  cashBalance: number;
  // Status
  isForecast: boolean;
  isCurrentMonth: boolean;
}

export interface DailyTrips {
  date: Date;
  dateLabel: string;
  budgetTrips: number;
  actualTrips: number;
  completedTrips: number;
  pendingTrips: number;
  revenue: number;
  expense: number;
  healthScore: number;
  budgetHealthScore: number;
  isForecast: boolean;
  isToday: boolean;
}

// ==================== Cash Crisis Types ====================

export interface CashFlowStatus {
  // เงินสดปัจจุบัน
  cashOnHand: number;
  minCashRequired: number; // ขั้นต่ำที่ต้องมี (เงินเดือน + น้ำมัน)
  cashShortage: number; // ขาดเท่าไหร่

  // ลูกหนี้ (AR)
  totalReceivable: number;
  currentReceivable: number; // ยังไม่ครบกำหนด
  overdueReceivable: number; // เกินกำหนด
  overduePercent: number;
  avgCollectionDays: number; // วันเฉลี่ยที่เก็บได้

  // เจ้าหนี้ (AP)
  totalPayable: number;
  urgentPayable: number; // ต้องจ่ายใน 7 วัน
  overduePayable: number; // เลยกำหนดแล้ว

  // สถานะ
  crisisLevel: 'critical' | 'warning' | 'caution' | 'normal';
  daysUntilCrisis: number; // อีกกี่วันจะไม่มีเงินจ่าย
}

export interface CustomerReceivable {
  customerId: string;
  customerName: string;
  customerCode: string;
  totalOwed: number;
  currentAmount: number;
  overdueAmount: number;
  oldestOverdueDays: number;
  creditDays: number;
  lastPaymentDate?: Date;
  paymentHistory: 'good' | 'slow' | 'problematic';
}

export interface PayableItem {
  id: string;
  vendor: string;
  category: 'fuel' | 'salary' | 'maintenance' | 'insurance' | 'other';
  amount: number;
  dueDate: Date;
  daysUntilDue: number;
  isOverdue: boolean;
  isPriority: boolean;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  managerId?: string;
  phone: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'onleave';
}

export interface Driver extends Employee {
  licenseNo: string;
  licenseExpiry: Date;
  vehicleId?: string;
  totalTrips: number;
  rating: number;
}

// ==================== โครงสร้างพนักงาน ====================
// รวม 68 คน: Manager 7 + Staff 14 + Driver 30 + Admin/Other 17

// คนขับรถ 30 คน
export const drivers: Driver[] = Array.from({ length: 30 }, (_, i) => {
  const names = [
    'สมชาย', 'วิชัย', 'สมศักดิ์', 'ประเสริฐ', 'มานะ', 'สุชาติ', 'วิรัตน์', 'สมหมาย',
    'สมบัติ', 'สุรชัย', 'วิเชียร', 'ประสิทธิ์', 'สมพงษ์', 'วิโรจน์', 'สุวิทย์',
    'สมเกียรติ', 'วิทยา', 'ประยุทธ์', 'สมนึก', 'สุเทพ', 'วิชิต', 'ประพันธ์',
    'สมปอง', 'สุรศักดิ์', 'วิรุฬห์', 'ประจวบ', 'สมโภชน์', 'สุรพล', 'วิสิทธิ์', 'ประดิษฐ์'
  ];
  const surnames = ['ใจดี', 'รักงาน', 'ขยัน', 'ซื่อสัตย์', 'มั่นคง'];

  return {
    id: `DRV${String(i + 1).padStart(3, '0')}`,
    name: `${names[i]} ${surnames[i % 5]}`,
    position: 'พนักงานขับรถ',
    department: 'ขนส่ง',
    managerId: '2', // ผจก.ขนส่ง
    phone: `08${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`,
    hireDate: new Date(2020 + Math.floor(i / 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    salary: 18000 + Math.floor(Math.random() * 5000),
    status: i < 28 ? 'active' : (i === 28 ? 'onleave' : 'inactive') as 'active' | 'inactive' | 'onleave',
    licenseNo: `${50 + Math.floor(i / 10)}${String(100000 + i).slice(-6)}`,
    licenseExpiry: new Date(2025 + Math.floor(i / 15), Math.floor(Math.random() * 12), 1),
    vehicleId: i < 25 ? `TRK${String(i + 1).padStart(3, '0')}` : undefined,
    totalTrips: 500 + Math.floor(Math.random() * 1500),
    rating: 3.5 + Math.random() * 1.5,
  };
});

// พนักงาน Staff แต่ละแผนก
export const staffEmployees: Employee[] = [
  // ฝ่ายขนส่ง - 3 คน (ไม่รวมคนขับ)
  {
    id: 'TRP001',
    name: 'สุนีย์ วางแผน',
    position: 'เจ้าหน้าที่วางแผนเส้นทาง',
    department: 'ขนส่ง',
    managerId: '2',
    phone: '081-234-5678',
    hireDate: new Date(2021, 2, 1),
    salary: 22000,
    status: 'active',
  },
  {
    id: 'TRP002',
    name: 'วิภาวี ติดตาม',
    position: 'เจ้าหน้าที่ติดตามงาน',
    department: 'ขนส่ง',
    managerId: '2',
    phone: '081-234-5679',
    hireDate: new Date(2022, 5, 15),
    salary: 20000,
    status: 'active',
  },
  {
    id: 'TRP003',
    name: 'ปรีชา ประสานงาน',
    position: 'เจ้าหน้าที่ประสานงาน',
    department: 'ขนส่ง',
    managerId: '2',
    phone: '081-234-5680',
    hireDate: new Date(2023, 0, 10),
    salary: 18000,
    status: 'active',
  },

  // ฝ่ายการเงิน - 2 คน (AR + AP)
  {
    id: 'FIN001',
    name: 'รัชนี รับเงิน',
    position: 'เจ้าหน้าที่ AR (ลูกหนี้)',
    department: 'การเงิน',
    managerId: '3',
    phone: '081-345-6789',
    hireDate: new Date(2020, 8, 1),
    salary: 25000,
    status: 'active',
  },
  {
    id: 'FIN002',
    name: 'พิมพ์พา จ่ายเงิน',
    position: 'เจ้าหน้าที่ AP (เจ้าหนี้)',
    department: 'การเงิน',
    managerId: '3',
    phone: '081-345-6790',
    hireDate: new Date(2021, 3, 15),
    salary: 24000,
    status: 'active',
  },

  // ฝ่ายบัญชี - 1 คน
  {
    id: 'ACC001',
    name: 'นิภา บันทึก',
    position: 'เจ้าหน้าที่บัญชี',
    department: 'บัญชี',
    managerId: '4',
    phone: '081-456-7890',
    hireDate: new Date(2022, 1, 1),
    salary: 22000,
    status: 'active',
  },

  // ฝ่าย HR - 0 คน (ผจก.ทำเอง)

  // ฝ่ายซ่อมบำรุง - 5 คน
  {
    id: 'MNT001',
    name: 'สมบูรณ์ ช่างยนต์',
    position: 'ช่างเครื่องยนต์อาวุโส',
    department: 'ซ่อมบำรุง',
    managerId: '6',
    phone: '081-567-8901',
    hireDate: new Date(2019, 5, 1),
    salary: 28000,
    status: 'active',
  },
  {
    id: 'MNT002',
    name: 'ประเทือง ช่างไฟ',
    position: 'ช่างไฟฟ้า',
    department: 'ซ่อมบำรุง',
    managerId: '6',
    phone: '081-567-8902',
    hireDate: new Date(2020, 8, 15),
    salary: 25000,
    status: 'active',
  },
  {
    id: 'MNT003',
    name: 'วิชัย ช่างเชื่อม',
    position: 'ช่างเชื่อม',
    department: 'ซ่อมบำรุง',
    managerId: '6',
    phone: '081-567-8903',
    hireDate: new Date(2021, 2, 1),
    salary: 23000,
    status: 'active',
  },
  {
    id: 'MNT004',
    name: 'สุรชัย ช่างยาง',
    position: 'ช่างยาง',
    department: 'ซ่อมบำรุง',
    managerId: '6',
    phone: '081-567-8904',
    hireDate: new Date(2022, 6, 1),
    salary: 20000,
    status: 'active',
  },
  {
    id: 'MNT005',
    name: 'มานพ ช่างทั่วไป',
    position: 'ช่างทั่วไป',
    department: 'ซ่อมบำรุง',
    managerId: '6',
    phone: '081-567-8905',
    hireDate: new Date(2023, 1, 15),
    salary: 18000,
    status: 'active',
  },

  // ฝ่ายการตลาด - 3 คน
  {
    id: 'MKT001',
    name: 'ปิยะ โปรโมท',
    position: 'เจ้าหน้าที่การตลาด',
    department: 'การตลาด',
    managerId: '7',
    phone: '081-678-9012',
    hireDate: new Date(2021, 9, 1),
    salary: 25000,
    status: 'active',
  },
  {
    id: 'MKT002',
    name: 'อรอนงค์ ออนไลน์',
    position: 'เจ้าหน้าที่ Digital Marketing',
    department: 'การตลาด',
    managerId: '7',
    phone: '081-678-9013',
    hireDate: new Date(2022, 3, 15),
    salary: 28000,
    status: 'active',
  },
  {
    id: 'MKT003',
    name: 'ธนกร ขายดี',
    position: 'เจ้าหน้าที่ขาย',
    department: 'การตลาด',
    managerId: '7',
    phone: '081-678-9014',
    hireDate: new Date(2023, 0, 2),
    salary: 22000,
    status: 'active',
  },
];

// สรุปจำนวนพนักงานแต่ละแผนก
export const departmentHeadcount = {
  transport: {
    manager: 1,
    staff: 3,
    drivers: 30,
    total: 34,
  },
  finance: {
    manager: 1,
    staff: 2, // AR + AP
    total: 3,
  },
  accounting: {
    manager: 1,
    staff: 1,
    total: 2,
  },
  hr: {
    manager: 1,
    staff: 0, // ผจก.ทำเอง
    total: 1,
  },
  maintenance: {
    manager: 1,
    staff: 5,
    total: 6,
  },
  marketing: {
    manager: 1,
    staff: 3,
    total: 4,
  },
  executive: {
    manager: 1, // ผจก.ทั่วไป
    total: 1,
  },
};

// รวมทั้งหมด: 7 managers + 14 staff + 30 drivers + 17 admin/support = 68 คน
export const totalHeadcount = {
  managers: 7,
  staff: 14,
  drivers: 30,
  adminSupport: 17, // รปภ., แม่บ้าน, ธุรการ ฯลฯ
  total: 68,
};

// ==================== ลูกค้าประจำ 5 ราย ====================

export const customers: Customer[] = [
  {
    id: 'C001',
    name: 'บริษัท ปูนซีเมนต์ไทย จำกัด',
    code: 'SCG',
    contactPerson: 'คุณสมศักดิ์',
    phone: '02-123-4567',
    address: '1 ถ.ปูนซีเมนต์ไทย บางซื่อ กทม.',
    creditDays: 30,
    avgTripsPerMonth: 180,
    avgRatePerTrip: 12000,
  },
  {
    id: 'C002',
    name: 'บริษัท ซีพี ออลล์ จำกัด (มหาชน)',
    code: 'CPALL',
    contactPerson: 'คุณวิไล',
    phone: '02-234-5678',
    address: '313 ถ.สีลม บางรัก กทม.',
    creditDays: 45,
    avgTripsPerMonth: 200,
    avgRatePerTrip: 8500,
  },
  {
    id: 'C003',
    name: 'บริษัท ไทยเบฟเวอเรจ จำกัด (มหาชน)',
    code: 'THAIBEV',
    contactPerson: 'คุณประเสริฐ',
    phone: '02-345-6789',
    address: '14 ถ.วิภาวดี จตุจักร กทม.',
    creditDays: 30,
    avgTripsPerMonth: 150,
    avgRatePerTrip: 9500,
  },
  {
    id: 'C004',
    name: 'บริษัท เซ็นทรัล รีเทล จำกัด',
    code: 'CRC',
    contactPerson: 'คุณนภา',
    phone: '02-456-7890',
    address: '22 ถ.พระราม 1 ปทุมวัน กทม.',
    creditDays: 60,
    avgTripsPerMonth: 80,
    avgRatePerTrip: 15000,
  },
  {
    id: 'C005',
    name: 'บริษัท บิ๊กซี ซูเปอร์เซ็นเตอร์ จำกัด',
    code: 'BIGC',
    contactPerson: 'คุณมานี',
    phone: '02-567-8901',
    address: '97/11 ถ.ราชดำริห์ ปทุมวัน กทม.',
    creditDays: 45,
    avgTripsPerMonth: 90,
    avgRatePerTrip: 11000,
  },
];

// ==================== Seasonal Factors ====================
// High: พ.ย., ธ.ค., ม.ค., ก.พ. (เทศกาล + ปีใหม่)
// Low: มี.ค., เม.ย., พ.ค. (หลังเทศกาล + ร้อน)
// Normal: มิ.ย., ก.ค., ส.ค., ก.ย., ต.ค.

const seasonalFactors: Record<number, number> = {
  0: 1.25,  // ม.ค. - High (ปีใหม่)
  1: 1.20,  // ก.พ. - High (ตรุษจีน)
  2: 0.75,  // มี.ค. - Low (หลังเทศกาล)
  3: 0.70,  // เม.ย. - Low (สงกรานต์)
  4: 0.80,  // พ.ค. - Low
  5: 0.95,  // มิ.ย. - Normal
  6: 1.00,  // ก.ค. - Normal
  7: 1.00,  // ส.ค. - Normal
  8: 1.05,  // ก.ย. - Normal
  9: 1.10,  // ต.ค. - Normal
  10: 1.30, // พ.ย. - High (เริ่ม high season)
  11: 1.35, // ธ.ค. - High (คริสต์มาส)
};

const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// ==================== Helper Functions ====================

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// ==================== Generate Monthly Financial Data (6 เดือน) ====================
// สถานการณ์: งานเยอะ รายได้ดี แต่เก็บเงินได้ช้า สภาพคล่องตึง

export function generateMonthlyFinancials(): MonthlyFinancial[] {
  const data: MonthlyFinancial[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Base values
  const baseTripsPerMonth = 650;
  const avgRevenuePerTrip = 10500; // บาท
  const avgCostPerTrip = 7800; // บาท

  // Starting cash balance - ต่ำเพราะสภาพคล่องตึง
  let runningCashBalance = 1800000; // 1.8M (น้อยมาก แค่พอจ่ายเงินเดือนเดือนเดียว)

  // Generate 6 months back + current + 6 months forward
  for (let i = -6; i <= 6; i++) {
    const targetDate = new Date(currentYear, currentMonth + i, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    const seed = year * 100 + month;
    const random = seededRandom(seed);

    const seasonFactor = seasonalFactors[month];
    const isForecast = i > 0;
    const isCurrentMonth = i === 0;

    // Budget values
    const budgetTrips = Math.round(baseTripsPerMonth * seasonFactor);
    const budgetRevenue = budgetTrips * avgRevenuePerTrip;
    const budgetExpense = budgetTrips * avgCostPerTrip * 0.95;

    // Actual values - งานเกินเป้า! (105-115%)
    const performanceFactor = isForecast
      ? 1.05 + (random() * 0.1) // Forecast: 105-115%
      : 1.05 + (random() * 0.1); // Actual: 105-115% of budget - งานเยอะมาก!

    const actualTrips = Math.round(budgetTrips * performanceFactor);
    const actualRevenue = Math.round(actualTrips * avgRevenuePerTrip * (0.98 + random() * 0.05));

    // Expense breakdown - ค่าใช้จ่ายสูงตามงานที่เพิ่ม
    const fuelExpense = Math.round(actualTrips * 2900 * (0.95 + random() * 0.15)); // น้ำมันแพงขึ้น
    const salaryExpense = Math.round(2400000 + random() * 200000); // เงินเดือน + OT เยอะ
    const maintenanceExpense = Math.round(950000 + random() * 350000); // ซ่อมเยอะเพราะใช้รถหนัก
    const adminExpense = Math.round(550000 + random() * 100000);
    const otherExpense = Math.round(250000 + random() * 150000);
    const actualExpense = fuelExpense + salaryExpense + maintenanceExpense + adminExpense + otherExpense;

    // Health score - งานดี แต่ cash flow แย่
    const revenueScore = Math.min(100, (actualRevenue / budgetRevenue) * 100);
    const tripScore = Math.min(100, (actualTrips / budgetTrips) * 100);
    const costScore = Math.min(100, (budgetExpense / actualExpense) * 100);
    // Health ยังพอใช้ได้เพราะงานดี (แต่ไม่ได้วัด cash)
    const healthScore = Math.round((revenueScore * 0.4 + tripScore * 0.35 + costScore * 0.25));
    const budgetHealthScore = 80;

    // Cash flow - ปัญหาอยู่ตรงนี้!
    // เก็บเงินได้น้อย (55-65%) เพราะลูกค้าจ่ายช้า
    const collectionRate = 0.55 + random() * 0.1;
    const cashInflow = Math.round(actualRevenue * collectionRate);
    // แต่ต้องจ่ายเจ้าหนี้เกือบเต็ม (92-98%) เพราะปั๊มน้ำมัน/เงินเดือนรอไม่ได้
    const cashOutflow = Math.round(actualExpense * (0.92 + random() * 0.06));
    const freeCashFlow = cashInflow - cashOutflow; // ติดลบทุกเดือน!
    runningCashBalance += freeCashFlow;

    // ไม่ให้ติดลบเกินไป (สมมติยืมเงินมาหมุน)
    if (runningCashBalance < 500000) {
      runningCashBalance = 500000 + random() * 300000;
    }

    const yearSuffix = String(year).slice(-2);

    data.push({
      month,
      year,
      monthLabel: `${thaiMonths[month]}'${yearSuffix}`,
      budgetRevenue,
      actualRevenue,
      budgetExpense,
      actualExpense,
      fuelExpense,
      salaryExpense,
      maintenanceExpense,
      adminExpense,
      otherExpense,
      budgetTrips,
      actualTrips,
      healthScore,
      budgetHealthScore,
      cashInflow,
      cashOutflow,
      freeCashFlow,
      cashBalance: runningCashBalance,
      isForecast,
      isCurrentMonth,
    });
  }

  return data;
}

// ==================== Generate Daily Data (15 วัน: 7 อดีต + วันนี้ + 7 อนาคต) ====================
// งานเกินเป้าทุกวัน!

export function generateDailyData(): DailyTrips[] {
  const data: DailyTrips[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const seasonFactor = seasonalFactors[currentMonth];

  // Daily base (650 trips/month ÷ 26 working days)
  const baseDailyTrips = Math.round((650 * seasonFactor) / 26);
  const avgRevenuePerTrip = 10500;
  const avgCostPerTrip = 7800;

  for (let i = -7; i <= 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);

    const seed = targetDate.getFullYear() * 10000 + (targetDate.getMonth() + 1) * 100 + targetDate.getDate();
    const random = seededRandom(seed);

    const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;
    const dayFactor = isWeekend ? 0.6 : 1.0;

    const isForecast = i > 0;
    const isToday = i === 0;

    // Budget
    const budgetTrips = Math.round(baseDailyTrips * dayFactor);
    const budgetHealthScore = 80;

    // Actual - งานเกินเป้า! (105-118%)
    const performanceFactor = isForecast
      ? 1.05 + (random() * 0.13)
      : 1.05 + (random() * 0.13);

    const actualTrips = Math.round(budgetTrips * performanceFactor);
    const completedTrips = Math.round(actualTrips * (0.92 + random() * 0.06)); // ทำงานได้ดี
    const pendingTrips = actualTrips - completedTrips;

    const revenue = actualTrips * avgRevenuePerTrip;
    const expense = actualTrips * avgCostPerTrip;

    const healthScore = Math.round(
      (actualTrips / budgetTrips) * 50 +
      (completedTrips / actualTrips) * 50
    );

    data.push({
      date: targetDate,
      dateLabel: targetDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
      budgetTrips,
      actualTrips,
      completedTrips,
      pendingTrips,
      revenue,
      expense,
      healthScore: Math.min(100, healthScore),
      budgetHealthScore,
      isForecast,
      isToday,
    });
  }

  return data;
}

// ==================== Generate Yearly Data (7 ปี: 3 อดีต + ปีนี้ + 3 อนาคต) ====================

export function generateYearlyData(): MonthlyFinancial[] {
  const data: MonthlyFinancial[] = [];
  const currentYear = new Date().getFullYear();

  const baseAnnualTrips = 650 * 12; // ~7,800 trips/year
  const avgRevenuePerTrip = 10500;
  const avgCostPerTrip = 7800;

  let runningCashBalance = 50000000; // 50M starting

  for (let i = -3; i <= 3; i++) {
    const year = currentYear + i;
    const seed = year;
    const random = seededRandom(seed);

    const isForecast = i > 0;
    const isCurrentYear = i === 0;

    // Year-over-year growth
    const growthFactor = 1 + (i * 0.05) + (random() * 0.08 - 0.04);

    // Budget (aggressive targets)
    const budgetTrips = Math.round(baseAnnualTrips * growthFactor * 1.05);
    const budgetRevenue = budgetTrips * avgRevenuePerTrip;
    const budgetExpense = budgetTrips * avgCostPerTrip * 0.92;

    // Actual (under budget)
    const performanceFactor = isForecast
      ? 0.94 + (random() * 0.08)
      : 0.88 + (random() * 0.1);

    const actualTrips = Math.round(budgetTrips * performanceFactor);
    const actualRevenue = Math.round(actualTrips * avgRevenuePerTrip * (0.95 + random() * 0.08));

    const fuelExpense = Math.round(actualTrips * 2800);
    const salaryExpense = Math.round(26000000 + random() * 4000000);
    const maintenanceExpense = Math.round(10000000 + random() * 3000000);
    const adminExpense = Math.round(6000000 + random() * 1000000);
    const otherExpense = Math.round(3000000 + random() * 1500000);
    const actualExpense = fuelExpense + salaryExpense + maintenanceExpense + adminExpense + otherExpense;

    // Health
    const healthScore = Math.round((actualRevenue / budgetRevenue) * 50 + (budgetExpense / actualExpense) * 50);

    // Cash flow
    const cashInflow = Math.round(actualRevenue * 0.92);
    const cashOutflow = Math.round(actualExpense * 0.94);
    const freeCashFlow = cashInflow - cashOutflow;
    runningCashBalance += freeCashFlow;

    data.push({
      month: -1, // Not applicable for yearly
      year,
      monthLabel: String(year),
      budgetRevenue,
      actualRevenue,
      budgetExpense,
      actualExpense,
      fuelExpense,
      salaryExpense,
      maintenanceExpense,
      adminExpense,
      otherExpense,
      budgetTrips,
      actualTrips,
      healthScore: Math.min(100, healthScore),
      budgetHealthScore: 80,
      cashInflow,
      cashOutflow,
      freeCashFlow,
      cashBalance: runningCashBalance,
      isForecast,
      isCurrentMonth: isCurrentYear,
    });
  }

  return data;
}

// ==================== Generate Invoices (5 ใบวางบิล/เดือน) ====================

export function generateMonthlyInvoices(year: number, month: number): Invoice[] {
  const invoices: Invoice[] = [];
  const seed = year * 100 + month;
  const random = seededRandom(seed);

  const seasonFactor = seasonalFactors[month];
  const totalMonthlyTrips = Math.round(650 * seasonFactor);

  // Distribute trips among 5 customers
  const customerTrips = customers.map((customer) => {
    const baseProportion = customer.avgTripsPerMonth / 700; // Total avg trips
    const variance = 0.9 + random() * 0.2;
    return Math.round(totalMonthlyTrips * baseProportion * variance);
  });

  // Normalize to match total
  const sum = customerTrips.reduce((a, b) => a + b, 0);
  const normalizedTrips = customerTrips.map(t => Math.round(t * totalMonthlyTrips / sum));

  customers.forEach((customer, idx) => {
    const trips = normalizedTrips[idx];
    const rateVariance = 0.95 + random() * 0.1;
    const amount = Math.round(trips * customer.avgRatePerTrip * rateVariance);

    const issueDate = new Date(year, month, 25 + Math.floor(random() * 5));
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + customer.creditDays);

    const today = new Date();
    let status: 'paid' | 'pending' | 'overdue' = 'pending';
    let paidDate: Date | undefined;

    if (issueDate < today) {
      if (dueDate < today) {
        // Past due date
        if (random() > 0.15) {
          status = 'paid';
          paidDate = new Date(dueDate);
          paidDate.setDate(paidDate.getDate() + Math.floor(random() * 10));
        } else {
          status = 'overdue';
        }
      } else {
        // Before due date
        if (random() > 0.6) {
          status = 'paid';
          paidDate = new Date(issueDate);
          paidDate.setDate(paidDate.getDate() + Math.floor(random() * customer.creditDays));
        }
      }
    }

    const invoiceNo = `INV${year}${String(month + 1).padStart(2, '0')}${String(idx + 1).padStart(3, '0')}`;

    invoices.push({
      id: `${year}-${month}-${customer.id}`,
      invoiceNo,
      customerId: customer.id,
      issueDate,
      dueDate,
      trips: [], // Would contain trip IDs
      totalAmount: amount,
      status,
      paidDate,
    });
  });

  return invoices;
}

// ==================== Chart Data Adapters ====================

export function getTransportHealthData(timeRange: TimeRange) {
  switch (timeRange) {
    case 'daily': {
      const dailyData = generateDailyData();
      return dailyData.map(d => ({
        date: d.dateLabel,
        actual: d.healthScore,
        budget: d.budgetHealthScore,
        isForecast: d.isForecast,
        isToday: d.isToday,
      }));
    }
    case 'monthly': {
      const monthlyData = generateMonthlyFinancials();
      return monthlyData.map(d => ({
        date: d.monthLabel,
        actual: d.healthScore,
        budget: d.budgetHealthScore,
        isForecast: d.isForecast,
        isToday: d.isCurrentMonth,
      }));
    }
    case 'yearly': {
      const yearlyData = generateYearlyData();
      return yearlyData.map(d => ({
        date: d.monthLabel,
        actual: d.healthScore,
        budget: d.budgetHealthScore,
        isForecast: d.isForecast,
        isToday: d.isCurrentMonth,
      }));
    }
  }
}

export function getTransportPnLData(timeRange: TimeRange) {
  switch (timeRange) {
    case 'daily': {
      const dailyData = generateDailyData();
      return dailyData.map(d => ({
        date: d.dateLabel,
        revenue: Math.round(d.revenue / 1000000 * 10) / 10, // Convert to millions
        expense: Math.round(d.expense / 1000000 * 10) / 10,
        profit: Math.round((d.revenue - d.expense) / 1000000 * 10) / 10,
        isForecast: d.isForecast,
        isToday: d.isToday,
      }));
    }
    case 'monthly': {
      const monthlyData = generateMonthlyFinancials();
      return monthlyData.map(d => ({
        date: d.monthLabel,
        revenue: Math.round(d.actualRevenue / 1000000 * 10) / 10,
        expense: Math.round(d.actualExpense / 1000000 * 10) / 10,
        profit: Math.round((d.actualRevenue - d.actualExpense) / 1000000 * 10) / 10,
        isForecast: d.isForecast,
        isToday: d.isCurrentMonth,
      }));
    }
    case 'yearly': {
      const yearlyData = generateYearlyData();
      return yearlyData.map(d => ({
        date: d.monthLabel,
        revenue: Math.round(d.actualRevenue / 1000000),
        expense: Math.round(d.actualExpense / 1000000),
        profit: Math.round((d.actualRevenue - d.actualExpense) / 1000000),
        isForecast: d.isForecast,
        isToday: d.isCurrentMonth,
      }));
    }
  }
}

export function getTransportCashFlowData(timeRange: TimeRange) {
  switch (timeRange) {
    case 'daily': {
      const dailyData = generateDailyData();
      let runningBalance = 8500000;
      return dailyData.map(d => {
        const fcf = (d.revenue * 0.9) - (d.expense * 0.95);
        runningBalance += fcf;
        return {
          date: d.dateLabel,
          cashBalance: Math.round(runningBalance / 1000000 * 10) / 10,
          freeCashFlow: Math.round(fcf / 1000000 * 10) / 10,
          isForecast: d.isForecast,
          isToday: d.isToday,
        };
      });
    }
    case 'monthly': {
      const monthlyData = generateMonthlyFinancials();
      return monthlyData.map(d => ({
        date: d.monthLabel,
        cashBalance: Math.round(d.cashBalance / 1000000 * 10) / 10,
        freeCashFlow: Math.round(d.freeCashFlow / 1000000 * 10) / 10,
        isForecast: d.isForecast,
        isToday: d.isCurrentMonth,
      }));
    }
    case 'yearly': {
      const yearlyData = generateYearlyData();
      return yearlyData.map(d => ({
        date: d.monthLabel,
        cashBalance: Math.round(d.cashBalance / 1000000),
        freeCashFlow: Math.round(d.freeCashFlow / 1000000),
        isForecast: d.isForecast,
        isToday: d.isCurrentMonth,
      }));
    }
  }
}

// ==================== Quick Stats Data ====================

export function getQuickStatsData(timeRange: TimeRange) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const seasonFactor = seasonalFactors[currentMonth];

  switch (timeRange) {
    case 'daily': {
      const dailyTrips = Math.round((650 * seasonFactor) / 26 * 0.92);
      const completed = Math.round(dailyTrips * 0.9);
      return {
        trips: dailyTrips,
        success: completed,
        pending: dailyTrips - completed,
        employees: 68,
        tripLabel: 'วิ่งวันนี้',
      };
    }
    case 'monthly': {
      const monthlyTrips = Math.round(650 * seasonFactor * 0.92);
      const completed = Math.round(monthlyTrips * 0.94);
      return {
        trips: monthlyTrips,
        success: completed,
        pending: monthlyTrips - completed,
        employees: 68,
        tripLabel: 'วิ่งเดือนนี้',
      };
    }
    case 'yearly': {
      const yearlyTrips = Math.round(650 * 12 * 0.93);
      const completed = Math.round(yearlyTrips * 0.95);
      return {
        trips: yearlyTrips,
        success: completed,
        pending: yearlyTrips - completed,
        employees: 68,
        tripLabel: 'วิ่งปีนี้',
      };
    }
  }
}

// ==================== Summary Functions ====================

export function getInvoiceSummary(year: number, month: number) {
  const invoices = generateMonthlyInvoices(year, month);
  const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pending = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const overdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

  return {
    totalInvoices: invoices.length,
    totalAmount: total,
    paidAmount: paid,
    pendingAmount: pending,
    overdueAmount: overdue,
    collectionRate: Math.round((paid / total) * 100),
    invoices,
  };
}

export function getMonthlyPerformanceSummary() {
  const monthlyData = generateMonthlyFinancials();
  const current = monthlyData.find(d => d.isCurrentMonth);

  if (!current) return null;

  return {
    revenue: current.actualRevenue,
    budgetRevenue: current.budgetRevenue,
    revenueVariance: Math.round(((current.actualRevenue - current.budgetRevenue) / current.budgetRevenue) * 100),
    expense: current.actualExpense,
    budgetExpense: current.budgetExpense,
    expenseVariance: Math.round(((current.actualExpense - current.budgetExpense) / current.budgetExpense) * 100),
    profit: current.actualRevenue - current.actualExpense,
    trips: current.actualTrips,
    budgetTrips: current.budgetTrips,
    tripVariance: Math.round(((current.actualTrips - current.budgetTrips) / current.budgetTrips) * 100),
    healthScore: current.healthScore,
    cashBalance: current.cashBalance,
  };
}

// ==================== Cash Flow Crisis Data ====================
// สถานการณ์: งานเยอะ แต่ลูกค้าจ่ายช้า เงินสดน้อย

export function getCashFlowStatus(): CashFlowStatus {
  const monthlyData = generateMonthlyFinancials();
  const current = monthlyData.find(d => d.isCurrentMonth);

  // เงินสดปัจจุบัน - น้อยมาก!
  const cashOnHand = current?.cashBalance || 850000;

  // ขั้นต่ำที่ต้องมี: เงินเดือน 2.4M + น้ำมัน 1.8M = 4.2M
  const minCashRequired = 4200000;
  const cashShortage = Math.max(0, minCashRequired - cashOnHand);

  // ลูกหนี้ - ค้างเยอะมาก!
  const totalReceivable = 12500000; // 12.5M ค้างอยู่
  const overdueReceivable = 5200000; // 5.2M เกินกำหนด (42%)
  const currentReceivable = totalReceivable - overdueReceivable;
  const avgCollectionDays = 52; // เก็บได้ช้า! (ปกติควร 30-45)

  // เจ้าหนี้ - ต้องจ่ายเร่งด่วน
  const totalPayable = 6800000;
  const urgentPayable = 3500000; // 3.5M ต้องจ่ายใน 7 วัน (น้ำมัน + เงินเดือน)
  const overduePayable = 1200000; // 1.2M เลยกำหนดแล้ว (เจ้าหนี้ซ่อมบำรุง)

  // คำนวณสถานะวิกฤต
  let crisisLevel: 'critical' | 'warning' | 'caution' | 'normal' = 'normal';
  let daysUntilCrisis = 30;

  if (cashOnHand < urgentPayable) {
    crisisLevel = 'critical';
    daysUntilCrisis = Math.floor(cashOnHand / (urgentPayable / 7));
  } else if (cashOnHand < minCashRequired * 0.5) {
    crisisLevel = 'warning';
    daysUntilCrisis = 7;
  } else if (cashOnHand < minCashRequired) {
    crisisLevel = 'caution';
    daysUntilCrisis = 14;
  }

  return {
    cashOnHand,
    minCashRequired,
    cashShortage,
    totalReceivable,
    currentReceivable,
    overdueReceivable,
    overduePercent: Math.round((overdueReceivable / totalReceivable) * 100),
    avgCollectionDays,
    totalPayable,
    urgentPayable,
    overduePayable,
    crisisLevel,
    daysUntilCrisis,
  };
}

// ข้อมูลลูกหนี้รายลูกค้า
export function getCustomerReceivables(): CustomerReceivable[] {
  const random = seededRandom(new Date().getMonth());

  return customers.map((customer, idx) => {
    // ลูกค้าแต่ละรายมีพฤติกรรมต่างกัน
    const paymentBehavior: ('good' | 'slow' | 'problematic')[] = ['slow', 'problematic', 'slow', 'good', 'problematic'];
    const behavior = paymentBehavior[idx];

    // คำนวณยอดค้าง
    const monthlyRevenue = customer.avgTripsPerMonth * customer.avgRatePerTrip;
    let totalOwed: number;
    let overdueAmount: number;
    let oldestOverdueDays: number;

    switch (behavior) {
      case 'problematic':
        // ลูกค้าปัญหา - ค้างเยอะ เกินกำหนดเยอะ
        totalOwed = monthlyRevenue * (2.5 + random() * 0.5);
        overdueAmount = totalOwed * (0.6 + random() * 0.2);
        oldestOverdueDays = 75 + Math.floor(random() * 30);
        break;
      case 'slow':
        // จ่ายช้า - ค้างปานกลาง
        totalOwed = monthlyRevenue * (1.8 + random() * 0.4);
        overdueAmount = totalOwed * (0.35 + random() * 0.15);
        oldestOverdueDays = 45 + Math.floor(random() * 20);
        break;
      default:
        // จ่ายปกติ
        totalOwed = monthlyRevenue * (1.0 + random() * 0.3);
        overdueAmount = totalOwed * (0.1 + random() * 0.1);
        oldestOverdueDays = 15 + Math.floor(random() * 15);
    }

    return {
      customerId: customer.id,
      customerName: customer.name,
      customerCode: customer.code,
      totalOwed: Math.round(totalOwed),
      currentAmount: Math.round(totalOwed - overdueAmount),
      overdueAmount: Math.round(overdueAmount),
      oldestOverdueDays,
      creditDays: customer.creditDays,
      lastPaymentDate: behavior === 'problematic'
        ? new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() - (10 + Math.floor(random() * 20)) * 24 * 60 * 60 * 1000),
      paymentHistory: behavior,
    };
  });
}

// ข้อมูลเจ้าหนี้ที่ต้องจ่าย
export function getPayables(): PayableItem[] {
  const today = new Date();

  const payables: PayableItem[] = [
    // น้ำมัน - ต้องจ่ายด่วน!
    {
      id: 'AP001',
      vendor: 'ปตท. (น้ำมันเครดิต)',
      category: 'fuel',
      amount: 1850000,
      dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      daysUntilDue: 3,
      isOverdue: false,
      isPriority: true,
    },
    // เงินเดือน - ต้องจ่ายทุกสิ้นเดือน
    {
      id: 'AP002',
      vendor: 'เงินเดือนพนักงาน',
      category: 'salary',
      amount: 2400000,
      dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 0), // สิ้นเดือน
      daysUntilDue: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate(),
      isOverdue: false,
      isPriority: true,
    },
    // ค่าซ่อม - เลยกำหนดแล้ว!
    {
      id: 'AP003',
      vendor: 'อู่เฮงอะไหล่ยนต์',
      category: 'maintenance',
      amount: 680000,
      dueDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
      daysUntilDue: -15,
      isOverdue: true,
      isPriority: false,
    },
    {
      id: 'AP004',
      vendor: 'บ.ยางรถยนต์ไทย',
      category: 'maintenance',
      amount: 520000,
      dueDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
      daysUntilDue: -8,
      isOverdue: true,
      isPriority: false,
    },
    // ประกันภัย
    {
      id: 'AP005',
      vendor: 'ประกันภัยรถยนต์ (งวด 2)',
      category: 'insurance',
      amount: 450000,
      dueDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
      daysUntilDue: 12,
      isOverdue: false,
      isPriority: false,
    },
    // อื่นๆ
    {
      id: 'AP006',
      vendor: 'ค่าเช่าออฟฟิศ + ลานจอดรถ',
      category: 'other',
      amount: 180000,
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      daysUntilDue: 5,
      isOverdue: false,
      isPriority: false,
    },
    {
      id: 'AP007',
      vendor: 'ค่าโทรศัพท์ + Internet',
      category: 'other',
      amount: 35000,
      dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      daysUntilDue: 10,
      isOverdue: false,
      isPriority: false,
    },
  ];

  return payables.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

// สรุปสถานะการเงินแบบรวม
export function getFinancialSummary() {
  const cashFlow = getCashFlowStatus();
  const receivables = getCustomerReceivables();
  const payables = getPayables();
  const monthlyData = generateMonthlyFinancials();
  const current = monthlyData.find(d => d.isCurrentMonth);

  const totalReceivable = receivables.reduce((sum, r) => sum + r.totalOwed, 0);
  const totalOverdue = receivables.reduce((sum, r) => sum + r.overdueAmount, 0);
  const totalPayable = payables.reduce((sum, p) => sum + p.amount, 0);
  const overduePayable = payables.filter(p => p.isOverdue).reduce((sum, p) => sum + p.amount, 0);
  const urgentPayable = payables.filter(p => p.daysUntilDue <= 7 && !p.isOverdue).reduce((sum, p) => sum + p.amount, 0);

  return {
    // เงินสด
    cashOnHand: cashFlow.cashOnHand,
    cashShortage: cashFlow.cashShortage,
    crisisLevel: cashFlow.crisisLevel,
    daysUntilCrisis: cashFlow.daysUntilCrisis,

    // ลูกหนี้
    totalReceivable,
    overdueReceivable: totalOverdue,
    overduePercent: Math.round((totalOverdue / totalReceivable) * 100),
    avgCollectionDays: cashFlow.avgCollectionDays,
    problemCustomers: receivables.filter(r => r.paymentHistory === 'problematic').length,

    // เจ้าหนี้
    totalPayable,
    overduePayable,
    urgentPayable,

    // สภาพคล่อง
    workingCapital: cashFlow.cashOnHand + totalReceivable - totalPayable,
    currentRatio: (cashFlow.cashOnHand + totalReceivable) / totalPayable,
    quickRatio: cashFlow.cashOnHand / (overduePayable + urgentPayable),

    // รายได้/กำไร (บวก!)
    monthlyRevenue: current?.actualRevenue || 0,
    monthlyExpense: current?.actualExpense || 0,
    monthlyProfit: (current?.actualRevenue || 0) - (current?.actualExpense || 0),
    trips: current?.actualTrips || 0,
    tripVariance: current ? Math.round(((current.actualTrips - current.budgetTrips) / current.budgetTrips) * 100) : 0,
  };
}
