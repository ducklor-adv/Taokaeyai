import type { Manager, CompanyStats, PerformanceDataPoint, ForecastDataPoint, ChartData, TimeRange } from '../types';
import {
  getTransportHealthData,
  getTransportPnLData,
  getTransportCashFlowData,
  getQuickStatsData as getTransportQuickStats,
  getMonthlyPerformanceSummary,
  customers,
  generateMonthlyInvoices,
  getInvoiceSummary,
} from './transportDatabase';

// Re-export transport database functions
export { customers, generateMonthlyInvoices, getInvoiceSummary, getMonthlyPerformanceSummary };
export { getTransportQuickStats };

// Helper function to generate random number in range
const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Manager Mock Data
export const managers: Manager[] = [
  {
    id: '1',
    name: 'คุณสมชาย วิเศษกุล',
    position: 'ผู้จัดการทั่วไป',
    department: 'บริหาร',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=somchai',
    score: 85,
    healthStatus: 'fit',
    trend: 'up',
    kpis: [
      { name: 'คะแนนรวมบริษัท', value: 85, target: 80, unit: '%', trend: 'up' },
      { name: 'ความเร็วตัดสินใจ', value: 92, target: 85, unit: '%', trend: 'up' },
      { name: 'เป้าหมายกลยุทธ์', value: 78, target: 75, unit: '%', trend: 'stable' },
    ],
  },
  {
    id: '2',
    name: 'คุณวิภา ขนส่งดี',
    position: 'ผู้จัดการขนส่ง',
    department: 'ปฏิบัติการ',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=wipa',
    score: 72,
    healthStatus: 'chill',
    trend: 'stable',
    kpis: [
      { name: 'ส่งตรงเวลา', value: 88, target: 95, unit: '%', trend: 'down' },
      { name: 'ใช้รถได้ประสิทธิภาพ', value: 75, target: 80, unit: '%', trend: 'stable' },
      { name: 'ประสิทธิภาพเส้นทาง', value: 68, target: 70, unit: '%', trend: 'up' },
    ],
  },
  {
    id: '3',
    name: 'คุณมานะ เงินทอง',
    position: 'ผู้จัดการการเงิน',
    department: 'การเงิน',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=mana',
    score: 91,
    healthStatus: 'fit',
    trend: 'up',
    kpis: [
      { name: 'กระแสเงินสด', value: 95, target: 90, unit: '%', trend: 'up' },
      { name: 'ใช้งบประมาณ', value: 88, target: 85, unit: '%', trend: 'stable' },
      { name: 'อัตราเก็บเงิน', value: 92, target: 90, unit: '%', trend: 'up' },
    ],
  },
  {
    id: '4',
    name: 'คุณสุดา บัญชีการ',
    position: 'ผู้จัดการบัญชี',
    department: 'บัญชี',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=suda',
    score: 88,
    healthStatus: 'fit',
    trend: 'stable',
    kpis: [
      { name: 'ความถูกต้อง', value: 99, target: 98, unit: '%', trend: 'stable' },
      { name: 'รายงานตรงเวลา', value: 85, target: 90, unit: '%', trend: 'up' },
      { name: 'ความสอดคล้อง', value: 92, target: 95, unit: '%', trend: 'stable' },
    ],
  },
  {
    id: '5',
    name: 'คุณพิมพ์ใจ รักษาคน',
    position: 'ผู้จัดการ HR',
    department: 'ทรัพยากรบุคคล',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=pimjai',
    score: 45,
    healthStatus: 'bad',
    trend: 'down',
    kpis: [
      { name: 'อัตราลาออก', value: 15, target: 8, unit: '%', trend: 'down' },
      { name: 'ความเร็วจ้างงาน', value: 42, target: 30, unit: 'วัน', trend: 'down' },
      { name: 'ความพึงพอใจพนักงาน', value: 58, target: 75, unit: '%', trend: 'down' },
    ],
  },
  {
    id: '6',
    name: 'คุณช่างชัย ซ่อมเก่ง',
    position: 'ผู้จัดการซ่อมบำรุง',
    department: 'ซ่อมบำรุง',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=changchai',
    score: 67,
    healthStatus: 'chill',
    trend: 'up',
    kpis: [
      { name: 'รถพร้อมใช้งาน', value: 82, target: 90, unit: '%', trend: 'up' },
      { name: 'ค่าซ่อมบำรุง', value: 72, target: 80, unit: '%', trend: 'stable' },
      { name: 'เวลาตอบสนอง', value: 65, target: 60, unit: 'นาที', trend: 'up' },
    ],
  },
  {
    id: '7',
    name: 'คุณมาร์เก็ต ตลาดรุ่ง',
    position: 'ผู้จัดการการตลาด',
    department: 'การตลาด',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=market',
    score: 78,
    healthStatus: 'chill',
    trend: 'up',
    kpis: [
      { name: 'Lead Generation', value: 120, target: 100, unit: 'ราย', trend: 'up' },
      { name: 'Conversion Rate', value: 8.5, target: 10, unit: '%', trend: 'stable' },
      { name: 'Brand Awareness', value: 72, target: 75, unit: '%', trend: 'up' },
    ],
  },
];

// Company Stats Mock Data
export const companyStats: CompanyStats = {
  totalRevenue: 45600000,
  totalExpense: 32800000,
  totalProfit: 12800000,
  profitMargin: 28.07,
  totalTrips: 1250,
  totalVehicles: 85,
  activeVehicles: 72,
  onTimeDeliveryRate: 88.5,
  customerSatisfaction: 4.2,
  overallHealth: 76,
  trend: 'up',
};

// Generate health vs budget data for daily (past 7 days + today + future 7 days)
function generateHealthBudgetDaily() {
  const data: any[] = [];
  const today = new Date();
  const budgetHealth = 80;

  // Past 7 days + today (center) + future 7 days = 15 points total
  for (let i = -7; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const isFuture = i > 0;
    const isToday = i === 0;
    const actualHealth = isFuture
      ? budgetHealth + randomInRange(-5, 10)
      : budgetHealth + randomInRange(-15, 15);

    data.push({
      date: date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
      actual: Math.min(100, Math.max(0, actualHealth)),
      budget: budgetHealth,
      isForecast: isFuture,
      isToday: isToday,
    });
  }

  return data;
}

// Generate health vs budget data for monthly (past 6 months + this month + future 6 months)
function generateHealthBudgetMonthly() {
  const data: any[] = [];
  const today = new Date();
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const budgetHealth = 80;

  // Past 6 months + this month (center) + future 6 months = 13 points total
  for (let i = -6; i <= 6; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() + i);

    const isFuture = i > 0;
    const isThisMonth = i === 0;
    const actualHealth = isFuture
      ? budgetHealth + randomInRange(-5, 12)
      : budgetHealth + randomInRange(-20, 18);

    // Add year suffix to make each month unique (e.g. "ม.ค.'68")
    const yearSuffix = String(date.getFullYear()).slice(-2);
    const dateLabel = thaiMonths[date.getMonth()] + "'" + yearSuffix;

    data.push({
      date: dateLabel,
      actual: Math.min(100, Math.max(0, actualHealth)),
      budget: budgetHealth,
      isForecast: isFuture,
      isToday: isThisMonth,
    });
  }

  return data;
}

// Generate health vs budget data for yearly (past 3 years + this year + future 3 years)
function generateHealthBudgetYearly() {
  const data: any[] = [];
  const currentYear = new Date().getFullYear();
  const budgetHealth = 80;

  // Past 3 years + this year (center) + future 3 years = 7 points total
  for (let i = -3; i <= 3; i++) {
    const year = currentYear + i;

    const isFuture = i > 0;
    const isThisYear = i === 0;
    const actualHealth = isFuture
      ? budgetHealth + randomInRange(0, 10)
      : budgetHealth + randomInRange(-25, 20);

    data.push({
      date: String(year),
      actual: Math.min(100, Math.max(0, actualHealth)),
      budget: budgetHealth,
      isForecast: isFuture,
      isToday: isThisYear,
    });
  }

  return data;
}

export function getChartData(timeRange: TimeRange): ChartData {
  return {
    past: [],
    current: [],
    forecast: [],
  };
}

export function getHealthBudgetData(timeRange: TimeRange) {
  switch (timeRange) {
    case 'daily':
      return generateHealthBudgetDaily();
    case 'monthly':
      return generateHealthBudgetMonthly();
    case 'yearly':
      return generateHealthBudgetYearly();
    default:
      return [];
  }
}

// ==================== Financial Data ====================

export type IndicatorType = 'health' | 'pnl' | 'cashflow';

// Generate P&L (งบกำไรขาดทุน) data
function generatePnLMonthly() {
  const data: any[] = [];
  const today = new Date();
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  for (let i = -6; i <= 6; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() + i);

    const isFuture = i > 0;
    const isThisMonth = i === 0;

    // Base values in millions
    const baseRevenue = 45 + randomInRange(-8, 12);
    const baseExpense = 32 + randomInRange(-5, 8);
    const profit = baseRevenue - baseExpense;

    const yearSuffix = String(date.getFullYear()).slice(-2);
    const dateLabel = thaiMonths[date.getMonth()] + "'" + yearSuffix;

    data.push({
      date: dateLabel,
      revenue: isFuture ? baseRevenue + randomInRange(0, 5) : baseRevenue,
      expense: isFuture ? baseExpense + randomInRange(-2, 3) : baseExpense,
      profit: isFuture ? profit + randomInRange(0, 3) : profit,
      isForecast: isFuture,
      isToday: isThisMonth,
    });
  }

  return data;
}

function generatePnLYearly() {
  const data: any[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = -3; i <= 3; i++) {
    const year = currentYear + i;
    const isFuture = i > 0;
    const isThisYear = i === 0;

    // Base values in millions (yearly)
    const baseRevenue = 500 + randomInRange(-50, 80);
    const baseExpense = 360 + randomInRange(-30, 50);
    const profit = baseRevenue - baseExpense;

    data.push({
      date: String(year),
      revenue: isFuture ? baseRevenue + randomInRange(10, 30) : baseRevenue,
      expense: isFuture ? baseExpense + randomInRange(-10, 20) : baseExpense,
      profit: isFuture ? profit + randomInRange(5, 15) : profit,
      isForecast: isFuture,
      isToday: isThisYear,
    });
  }

  return data;
}

// Generate Cash Flow data
function generateCashFlowMonthly() {
  const data: any[] = [];
  const today = new Date();
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  let runningCash = 25; // Starting cash balance in millions

  for (let i = -6; i <= 6; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() + i);

    const isFuture = i > 0;
    const isThisMonth = i === 0;

    // Free Cash Flow = Operating Cash Flow - CapEx
    const operatingCF = 8 + randomInRange(-3, 5);
    const capex = 2 + randomInRange(0, 3);
    const freeCashFlow = operatingCF - capex;

    runningCash += freeCashFlow;

    const yearSuffix = String(date.getFullYear()).slice(-2);
    const dateLabel = thaiMonths[date.getMonth()] + "'" + yearSuffix;

    data.push({
      date: dateLabel,
      cashBalance: Math.max(0, runningCash),
      freeCashFlow: freeCashFlow,
      isForecast: isFuture,
      isToday: isThisMonth,
    });
  }

  return data;
}

function generateCashFlowYearly() {
  const data: any[] = [];
  const currentYear = new Date().getFullYear();

  let runningCash = 80; // Starting cash balance in millions

  for (let i = -3; i <= 3; i++) {
    const year = currentYear + i;
    const isFuture = i > 0;
    const isThisYear = i === 0;

    const operatingCF = 80 + randomInRange(-20, 30);
    const capex = 25 + randomInRange(0, 15);
    const freeCashFlow = operatingCF - capex;

    runningCash += freeCashFlow;

    data.push({
      date: String(year),
      cashBalance: Math.max(0, runningCash),
      freeCashFlow: freeCashFlow,
      isForecast: isFuture,
      isToday: isThisYear,
    });
  }

  return data;
}

export function getIndicatorData(indicator: IndicatorType, timeRange: TimeRange) {
  // Use new transport database for realistic seasonal data
  switch (indicator) {
    case 'health':
      return getTransportHealthData(timeRange);
    case 'pnl':
      return getTransportPnLData(timeRange);
    case 'cashflow':
      return getTransportCashFlowData(timeRange);
    default:
      return [];
  }
}
