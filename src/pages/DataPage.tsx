import { useState, useMemo } from 'react';
import { Layout } from '../components/layout';
import {
  Truck,
  Banknote,
  Calculator,
  Users,
  Wrench,
  Megaphone,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Target,
  Fuel,
  Route,
  Receipt,
  CreditCard,
  PiggyBank,
  FileText,
  UserPlus,
  UserMinus,
  Heart,
  Car,
  Settings,
  Timer,
  UserCheck,
  Percent,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { customers, getInvoiceSummary } from '../data/mockData';
import {
  drivers,
  staffEmployees,
  departmentHeadcount,
  totalHeadcount,
  getCashFlowStatus,
  getCustomerReceivables,
  getPayables,
  getFinancialSummary,
  type Employee,
  type Driver
} from '../data/transportDatabase';

type DepartmentTab = 'transport' | 'finance' | 'accounting' | 'hr' | 'maintenance' | 'marketing';

// ==================== Shared Components ====================

function MetricCard({
  label,
  value,
  unit = '',
  target,
  trend,
  status,
  icon: Icon,
  color = 'blue'
}: {
  label: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'good' | 'warning' | 'bad';
  icon?: any;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const statusColors = {
    good: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    bad: 'border-l-red-500',
  };

  return (
    <div className={`bg-white rounded-lg p-3 border border-gray-100 shadow-sm border-l-4 ${status ? statusColors[status] : 'border-l-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-800">{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {target && (
            <p className="text-xs text-gray-400 mt-1">เป้า: {target}{unit}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {Icon && (
            <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          {trend && (
            <span className={`text-xs flex items-center ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ title, description, type, action }: {
  title: string;
  description: string;
  type: 'warning' | 'danger' | 'info';
  action?: string;
}) {
  const typeConfig = {
    warning: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    danger: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    info: { icon: CheckCircle, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  };

  const { icon: Icon, bg, border, text } = typeConfig[type];

  return (
    <div className={`${bg} ${border} border rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 ${text} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${text}`}>{title}</p>
          <p className="text-xs text-gray-600 mt-0.5">{description}</p>
          {action && (
            <button className={`text-xs ${text} font-medium mt-2 flex items-center gap-1`}>
              {action} <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

function StaffCard({ employee, showRating }: { employee: Employee | Driver; showRating?: boolean }) {
  const isDriver = 'licenseNo' in employee;
  const driver = isDriver ? (employee as Driver) : null;

  return (
    <div className="bg-white rounded-lg p-2 border border-gray-100 flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
        {employee.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{employee.name}</p>
        <p className="text-xs text-gray-500 truncate">{employee.position}</p>
      </div>
      {showRating && driver && (
        <div className="text-right">
          <span className="text-xs text-yellow-600">★ {driver.rating.toFixed(1)}</span>
        </div>
      )}
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
        employee.status === 'active' ? 'bg-green-500' :
        employee.status === 'onleave' ? 'bg-yellow-500' : 'bg-gray-400'
      }`} />
    </div>
  );
}

function HeadcountSummary({ data, showDrivers }: {
  data: { manager: number; staff: number; drivers?: number; total: number };
  showDrivers?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-around text-center">
        <div>
          <p className="text-lg font-bold text-primary-600">{data.manager}</p>
          <p className="text-xs text-gray-500">ผู้จัดการ</p>
        </div>
        <div className="border-l border-gray-200 pl-4">
          <p className="text-lg font-bold text-blue-600">{data.staff}</p>
          <p className="text-xs text-gray-500">พนักงาน</p>
        </div>
        {showDrivers && data.drivers !== undefined && (
          <div className="border-l border-gray-200 pl-4">
            <p className="text-lg font-bold text-green-600">{data.drivers}</p>
            <p className="text-xs text-gray-500">คนขับ</p>
          </div>
        )}
        <div className="border-l border-gray-200 pl-4">
          <p className="text-lg font-bold text-gray-800">{data.total}</p>
          <p className="text-xs text-gray-500">รวม</p>
        </div>
      </div>
    </div>
  );
}

// ==================== Department Reports ====================

// ฝ่ายขนส่ง - Transport Department
function TransportReport() {
  const transportStaff = staffEmployees.filter(e => e.department === 'ขนส่ง');
  const activeDrivers = drivers.filter(d => d.status === 'active');
  const onLeaveDrivers = drivers.filter(d => d.status === 'onleave');
  const topDrivers = [...drivers].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const data = {
    todayTrips: 28,
    targetTrips: 32,
    onTimeRate: 87.5,
    targetOnTime: 95,
    fleetUtilization: 72,
    targetUtilization: 85,
    routeEfficiency: 68,
    fuelCostPerKm: 4.2,
    avgFuelCost: 3.8,
    pendingDeliveries: 4,
    delayedDeliveries: 2,
    availableVehicles: 62,
    totalVehicles: 85,
    breakdownVehicles: 3,
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="space-y-2">
        {data.delayedDeliveries > 0 && (
          <AlertCard
            type="danger"
            title={`${data.delayedDeliveries} เที่ยวล่าช้า`}
            description="มีงานส่งที่เกินเวลากำหนด ต้องติดตามด่วน"
            action="ดูรายละเอียด"
          />
        )}
        {data.onTimeRate < data.targetOnTime && (
          <AlertCard
            type="warning"
            title="On-time ต่ำกว่าเป้า"
            description={`อัตราส่งตรงเวลา ${data.onTimeRate}% (เป้า ${data.targetOnTime}%)`}
            action="วิเคราะห์สาเหตุ"
          />
        )}
      </div>

      {/* Key Metrics */}
      <div>
        <SectionHeader title="ประสิทธิภาพการขนส่ง" subtitle="KPIs หลักที่ต้องติดตาม" />
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="เที่ยววิ่งวันนี้"
            value={data.todayTrips}
            target={data.targetTrips}
            unit="เที่ยว"
            icon={Truck}
            color="blue"
            status={data.todayTrips >= data.targetTrips * 0.9 ? 'good' : 'warning'}
            trend="up"
          />
          <MetricCard
            label="ส่งตรงเวลา"
            value={data.onTimeRate}
            target={data.targetOnTime}
            unit="%"
            icon={Clock}
            color={data.onTimeRate >= 90 ? 'green' : 'yellow'}
            status={data.onTimeRate >= data.targetOnTime ? 'good' : data.onTimeRate >= 85 ? 'warning' : 'bad'}
            trend="down"
          />
          <MetricCard
            label="ใช้รถได้ประสิทธิภาพ"
            value={data.fleetUtilization}
            target={data.targetUtilization}
            unit="%"
            icon={Route}
            color="purple"
            status={data.fleetUtilization >= 80 ? 'good' : 'warning'}
          />
          <MetricCard
            label="ค่าน้ำมัน/กม."
            value={data.fuelCostPerKm}
            target={data.avgFuelCost}
            unit="฿"
            icon={Fuel}
            color={data.fuelCostPerKm <= data.avgFuelCost ? 'green' : 'red'}
            status={data.fuelCostPerKm <= data.avgFuelCost ? 'good' : 'bad'}
          />
        </div>
      </div>

      {/* Fleet Status */}
      <div>
        <SectionHeader title="สถานะรถ" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">รถพร้อมใช้งาน</span>
            <span className="text-lg font-bold text-green-600">{data.availableVehicles}/{data.totalVehicles}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(data.availableVehicles / data.totalVehicles) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              พร้อมใช้: {data.availableVehicles}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              ซ่อมบำรุง: {data.totalVehicles - data.availableVehicles - data.breakdownVehicles}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              เสีย: {data.breakdownVehicles}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div>
        <SectionHeader title="รอดำเนินการ" />
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{data.pendingDeliveries}</p>
            <p className="text-xs text-gray-600">รอส่ง</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{data.delayedDeliveries}</p>
            <p className="text-xs text-gray-600">ล่าช้า</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <SectionHeader title="ทีมงานฝ่ายขนส่ง" subtitle={`${departmentHeadcount.transport.total} คน`} />
        <HeadcountSummary data={departmentHeadcount.transport} showDrivers />
      </div>

      {/* Staff */}
      <div>
        <SectionHeader title="เจ้าหน้าที่" />
        <div className="space-y-2">
          {transportStaff.map(staff => (
            <StaffCard key={staff.id} employee={staff} />
          ))}
        </div>
      </div>

      {/* Top Drivers */}
      <div>
        <SectionHeader title="คนขับดีเด่น" subtitle={`Top 5 จาก ${drivers.length} คน`} />
        <div className="space-y-2">
          {topDrivers.map(driver => (
            <StaffCard key={driver.id} employee={driver} showRating />
          ))}
        </div>
      </div>

      {/* Driver Status */}
      <div>
        <SectionHeader title="สถานะคนขับ" />
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-green-600">{activeDrivers.length}</p>
            <p className="text-xs text-gray-600">พร้อมงาน</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-yellow-600">{onLeaveDrivers.length}</p>
            <p className="text-xs text-gray-600">ลา</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-gray-600">{drivers.length - activeDrivers.length - onLeaveDrivers.length}</p>
            <p className="text-xs text-gray-600">ไม่พร้อม</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ฝ่ายการเงิน - Finance Department
function FinanceReport() {
  const financeStaff = staffEmployees.filter(e => e.department === 'การเงิน');

  // ใช้ข้อมูลจริงจาก transport database
  const cashFlow = getCashFlowStatus();
  const summary = getFinancialSummary();
  const receivables = getCustomerReceivables();
  const payables = getPayables();

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return (amount / 1000000).toFixed(1);
    return (amount / 1000).toFixed(0) + 'K';
  };

  // สถานะวิกฤต
  const crisisConfig = {
    critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'วิกฤต' },
    warning: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'เตือน' },
    caution: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'ระวัง' },
    normal: { bg: 'bg-green-100', text: 'text-green-700', label: 'ปกติ' },
  };
  const crisis = crisisConfig[summary.crisisLevel];

  // ลูกหนี้ที่มีปัญหา
  const problemDebtors = receivables.filter(r => r.paymentHistory !== 'good');
  const urgentPayables = payables.filter(p => p.daysUntilDue <= 7 || p.isOverdue);

  return (
    <div className="space-y-4">
      {/* Crisis Status Banner */}
      <div className={`${crisis.bg} rounded-lg p-3 border-2 border-${summary.crisisLevel === 'critical' ? 'red' : summary.crisisLevel === 'warning' ? 'orange' : 'yellow'}-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {summary.crisisLevel === 'critical' ? '🚨' : summary.crisisLevel === 'warning' ? '⚠️' : '⚡'}
            </span>
            <div>
              <p className={`text-sm font-bold ${crisis.text}`}>สถานะสภาพคล่อง: {crisis.label}</p>
              {summary.crisisLevel !== 'normal' && (
                <p className="text-xs text-gray-600">เหลือ {summary.daysUntilCrisis} วัน ก่อนขาดเงินหมุน</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">เงินสดคงเหลือ</p>
            <p className={`text-lg font-bold ${summary.cashOnHand < 2000000 ? 'text-red-600' : 'text-gray-800'}`}>
              ฿{formatMoney(summary.cashOnHand)}M
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {summary.cashShortage > 0 && (
          <AlertCard
            type="danger"
            title={`ขาดเงินหมุนเวียน ฿${formatMoney(summary.cashShortage)}M`}
            description="ต้องการเงินสำหรับเงินเดือน + น้ำมัน แต่เงินสดไม่พอ"
            action="หาแหล่งเงินด่วน"
          />
        )}
        {summary.overduePercent > 30 && (
          <AlertCard
            type="danger"
            title={`ลูกหนี้เกินกำหนด ${summary.overduePercent}%`}
            description={`มียอดค้าง ฿${formatMoney(summary.overdueReceivable)}M เกินกำหนดชำระ`}
            action="ติดตามลูกหนี้ด่วน"
          />
        )}
        {summary.overduePayable > 0 && (
          <AlertCard
            type="warning"
            title={`เจ้าหนี้เลยกำหนด ฿${formatMoney(summary.overduePayable)}M`}
            description="มียอดที่ต้องจ่ายเลยกำหนดแล้ว"
            action="จัดลำดับการจ่าย"
          />
        )}
      </div>

      {/* Good News */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <div>
            <p className="text-sm font-medium text-green-800">ข่าวดี: งานเกินเป้า +{summary.tripVariance}%</p>
            <p className="text-xs text-green-600">
              รายได้ ฿{formatMoney(summary.monthlyRevenue)}M | กำไร ฿{formatMoney(summary.monthlyProfit)}M
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <SectionHeader title="สถานะการเงิน" subtitle="Cash Flow Crisis" />
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="เงินสดคงเหลือ"
            value={formatMoney(summary.cashOnHand)}
            unit="M฿"
            icon={PiggyBank}
            color={summary.cashOnHand < 2000000 ? 'red' : 'yellow'}
            status={summary.cashOnHand < 2000000 ? 'bad' : 'warning'}
          />
          <MetricCard
            label="ลูกหนี้รวม"
            value={formatMoney(summary.totalReceivable)}
            unit="M฿"
            icon={Receipt}
            color="orange"
            status={summary.overduePercent > 40 ? 'bad' : 'warning'}
          />
          <MetricCard
            label="เจ้าหนี้รอจ่าย"
            value={formatMoney(summary.totalPayable)}
            unit="M฿"
            icon={CreditCard}
            color="purple"
            status={summary.overduePayable > 0 ? 'bad' : 'warning'}
          />
          <MetricCard
            label="Working Capital"
            value={formatMoney(summary.workingCapital)}
            unit="M฿"
            icon={Banknote}
            color={summary.workingCapital > 0 ? 'blue' : 'red'}
            status={summary.workingCapital > 0 ? 'good' : 'bad'}
          />
        </div>
      </div>

      {/* Liquidity Ratios */}
      <div>
        <SectionHeader title="อัตราส่วนสภาพคล่อง" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Current Ratio</span>
              <span className={`text-sm font-medium ${summary.currentRatio >= 1.5 ? 'text-green-600' : summary.currentRatio >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                {summary.currentRatio.toFixed(2)}x
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Quick Ratio</span>
              <span className={`text-sm font-medium ${summary.quickRatio >= 1 ? 'text-green-600' : summary.quickRatio >= 0.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                {summary.quickRatio.toFixed(2)}x
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">วันเฉลี่ยเก็บเงิน</span>
              <span className={`text-sm font-medium ${cashFlow.avgCollectionDays <= 45 ? 'text-green-600' : 'text-red-600'}`}>
                {cashFlow.avgCollectionDays} วัน
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Debtors */}
      <div>
        <SectionHeader title="ลูกหนี้ที่ต้องติดตาม" subtitle={`${problemDebtors.length} ราย`} />
        <div className="space-y-2">
          {receivables.sort((a, b) => b.overdueAmount - a.overdueAmount).slice(0, 5).map((debtor) => (
            <div key={debtor.customerId} className="bg-white rounded-lg p-2 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  debtor.paymentHistory === 'problematic' ? 'bg-red-500' :
                  debtor.paymentHistory === 'slow' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{debtor.customerCode}</p>
                  <p className="text-xs text-gray-500">
                    {debtor.paymentHistory === 'problematic' ? 'ปัญหา' : debtor.paymentHistory === 'slow' ? 'จ่ายช้า' : 'ปกติ'}
                    {debtor.oldestOverdueDays > 0 && ` • ค้าง ${debtor.oldestOverdueDays} วัน`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">฿{formatMoney(debtor.totalOwed)}M</p>
                {debtor.overdueAmount > 0 && (
                  <p className="text-xs text-red-500">เกินกำหนด ฿{formatMoney(debtor.overdueAmount)}M</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Payables */}
      <div>
        <SectionHeader title="ต้องจ่ายเร่งด่วน" subtitle={`${urgentPayables.length} รายการ`} />
        <div className="space-y-2">
          {urgentPayables.map((payable) => (
            <div key={payable.id} className="bg-white rounded-lg p-2 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  payable.isOverdue ? 'bg-red-500' : payable.isPriority ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{payable.vendor}</p>
                  <p className={`text-xs ${payable.isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                    {payable.isOverdue ? `เลยกำหนด ${Math.abs(payable.daysUntilDue)} วัน` : `อีก ${payable.daysUntilDue} วัน`}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-bold ${payable.isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                ฿{formatMoney(payable.amount)}M
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <SectionHeader title="ทีมงานฝ่ายการเงิน" subtitle={`${departmentHeadcount.finance.total} คน`} />
        <HeadcountSummary data={departmentHeadcount.finance} />
      </div>

      {/* Staff */}
      <div>
        <SectionHeader title="เจ้าหน้าที่" />
        <div className="space-y-2">
          {financeStaff.map(staff => (
            <StaffCard key={staff.id} employee={staff} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ฝ่ายบัญชี - Accounting Department
function AccountingReport() {
  const accountingStaff = staffEmployees.filter(e => e.department === 'บัญชี');

  const data = {
    reportStatus: {
      daily: 'completed',
      weekly: 'completed',
      monthly: 'pending',
    },
    accuracy: 99.2,
    targetAccuracy: 98,
    closingProgress: 75,
    pendingEntries: 12,
    reconciledAccounts: 18,
    totalAccounts: 22,
    taxCompliance: 100,
    auditFindings: 2,
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="space-y-2">
        {data.pendingEntries > 10 && (
          <AlertCard
            type="warning"
            title={`${data.pendingEntries} รายการรอบันทึก`}
            description="มีเอกสารที่ยังไม่ได้บันทึกบัญชี"
            action="ดูรายการ"
          />
        )}
        {data.auditFindings > 0 && (
          <AlertCard
            type="info"
            title={`${data.auditFindings} ข้อสังเกตจาก Audit`}
            description="รายการที่ต้องแก้ไขจากการตรวจสอบ"
            action="ดูรายละเอียด"
          />
        )}
      </div>

      {/* Key Metrics */}
      <div>
        <SectionHeader title="ความถูกต้องและทันเวลา" />
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="ความถูกต้อง"
            value={data.accuracy}
            target={data.targetAccuracy}
            unit="%"
            icon={Target}
            color="green"
            status="good"
          />
          <MetricCard
            label="ปิดบัญชีเดือน"
            value={data.closingProgress}
            unit="%"
            icon={Calculator}
            color={data.closingProgress >= 80 ? 'green' : 'yellow'}
            status={data.closingProgress >= 80 ? 'good' : 'warning'}
          />
          <MetricCard
            label="บัญชี Reconciled"
            value={`${data.reconciledAccounts}/${data.totalAccounts}`}
            icon={CheckCircle}
            color="blue"
            status={data.reconciledAccounts === data.totalAccounts ? 'good' : 'warning'}
          />
          <MetricCard
            label="Tax Compliance"
            value={data.taxCompliance}
            unit="%"
            icon={FileText}
            color="purple"
            status="good"
          />
        </div>
      </div>

      {/* Report Status */}
      <div>
        <SectionHeader title="สถานะรายงาน" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm space-y-2">
          {Object.entries(data.reportStatus).map(([report, status]) => (
            <div key={report} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {report === 'daily' ? 'รายงานรายวัน' : report === 'weekly' ? 'รายงานรายสัปดาห์' : 'รายงานรายเดือน'}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {status === 'completed' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Items */}
      <div>
        <SectionHeader title="รอดำเนินการ" />
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{data.pendingEntries}</p>
            <p className="text-xs text-gray-600">รอบันทึกบัญชี</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{data.totalAccounts - data.reconciledAccounts}</p>
            <p className="text-xs text-gray-600">รอ Reconcile</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <SectionHeader title="ทีมงานฝ่ายบัญชี" subtitle={`${departmentHeadcount.accounting.total} คน`} />
        <HeadcountSummary data={departmentHeadcount.accounting} />
      </div>

      {/* Staff */}
      <div>
        <SectionHeader title="เจ้าหน้าที่" />
        <div className="space-y-2">
          {accountingStaff.map(staff => (
            <StaffCard key={staff.id} employee={staff} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ฝ่าย HR - Human Resources Department
function HRReport() {
  const allEmployees = [...staffEmployees, ...drivers];
  const activeEmployees = allEmployees.filter(e => e.status === 'active');
  const onLeaveEmployees = allEmployees.filter(e => e.status === 'onleave');

  const data = {
    totalEmployees: totalHeadcount.total,
    newHires: 3,
    resignations: 5,
    turnoverRate: 15,
    targetTurnover: 8,
    avgHiringDays: 42,
    targetHiringDays: 30,
    satisfaction: 58,
    targetSatisfaction: 75,
    trainingHours: 12,
    targetTraining: 20,
    attendance: 94,
    leaveToday: 4,
    openPositions: 5,
    interviewsScheduled: 8,
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="space-y-2">
        <AlertCard
          type="danger"
          title="อัตราลาออกสูง"
          description={`${data.turnoverRate}% สูงกว่าเป้า ${data.targetTurnover}% มาก`}
          action="วิเคราะห์สาเหตุ"
        />
        <AlertCard
          type="warning"
          title="ความพึงพอใจต่ำ"
          description={`คะแนน ${data.satisfaction}% ต่ำกว่าเป้า ${data.targetSatisfaction}%`}
          action="สำรวจเพิ่มเติม"
        />
      </div>

      {/* Key Metrics */}
      <div>
        <SectionHeader title="ตัวชี้วัดหลัก" subtitle="KPIs ที่ต้องปรับปรุงด่วน" />
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="อัตราลาออก"
            value={data.turnoverRate}
            target={data.targetTurnover}
            unit="%"
            icon={UserMinus}
            color="red"
            status="bad"
            trend="down"
          />
          <MetricCard
            label="ความเร็วจ้างงาน"
            value={data.avgHiringDays}
            target={data.targetHiringDays}
            unit="วัน"
            icon={UserPlus}
            color="yellow"
            status="warning"
          />
          <MetricCard
            label="ความพึงพอใจ"
            value={data.satisfaction}
            target={data.targetSatisfaction}
            unit="%"
            icon={Heart}
            color="red"
            status="bad"
            trend="down"
          />
          <MetricCard
            label="Attendance"
            value={data.attendance}
            unit="%"
            icon={UserCheck}
            color="green"
            status="good"
          />
        </div>
      </div>

      {/* Workforce Summary */}
      <div>
        <SectionHeader title="สรุปบุคลากร" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">{data.totalEmployees}</p>
              <p className="text-xs text-gray-500">พนักงานทั้งหมด</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">+{data.newHires}</p>
              <p className="text-xs text-gray-500">เข้าใหม่</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">-{data.resignations}</p>
              <p className="text-xs text-gray-500">ลาออก</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recruitment Pipeline */}
      <div>
        <SectionHeader title="สถานะการสรรหา" />
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{data.openPositions}</p>
            <p className="text-xs text-gray-600">ตำแหน่งว่าง</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{data.interviewsScheduled}</p>
            <p className="text-xs text-gray-600">นัดสัมภาษณ์</p>
          </div>
        </div>
      </div>

      {/* Today's Status */}
      <div>
        <SectionHeader title="วันนี้" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">พนักงานลา</p>
            <p className="text-xs text-gray-400">ป่วย/ลากิจ/พักร้อน</p>
          </div>
          <span className="text-2xl font-bold text-yellow-600">{data.leaveToday}</span>
        </div>
      </div>

      {/* Team */}
      <div>
        <SectionHeader title="ทีมงานฝ่าย HR" subtitle={`${departmentHeadcount.hr.total} คน`} />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-lg font-bold text-primary-600">{departmentHeadcount.hr.manager}</p>
              <p className="text-xs text-gray-500">ผู้จัดการ</p>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <p className="text-lg font-bold text-blue-600">{departmentHeadcount.hr.staff}</p>
              <p className="text-xs text-gray-500">พนักงาน</p>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">* ผจก.ทำงาน HR เองทั้งหมด</p>
        </div>
      </div>

      {/* Company Headcount Overview */}
      <div>
        <SectionHeader title="สรุปบุคลากรทั้งบริษัท" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-primary-600">{totalHeadcount.managers}</p>
              <p className="text-xs text-gray-500">ผู้จัดการ</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">{totalHeadcount.staff}</p>
              <p className="text-xs text-gray-500">พนักงาน</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">{totalHeadcount.drivers}</p>
              <p className="text-xs text-gray-500">คนขับ</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">{totalHeadcount.adminSupport}</p>
              <p className="text-xs text-gray-500">สนับสนุน</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-800">{totalHeadcount.total}</p>
            <p className="text-xs text-gray-500">พนักงานรวม</p>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div>
        <SectionHeader title="จำนวนพนักงานแต่ละแผนก" />
        <div className="space-y-2">
          {[
            { name: 'ขนส่ง', count: departmentHeadcount.transport.total, color: 'blue' },
            { name: 'ซ่อมบำรุง', count: departmentHeadcount.maintenance.total, color: 'orange' },
            { name: 'การตลาด', count: departmentHeadcount.marketing.total, color: 'pink' },
            { name: 'การเงิน', count: departmentHeadcount.finance.total, color: 'green' },
            { name: 'บัญชี', count: departmentHeadcount.accounting.total, color: 'purple' },
            { name: 'HR', count: departmentHeadcount.hr.total, color: 'red' },
          ].map(dept => (
            <div key={dept.name} className="bg-white rounded-lg p-2 border border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">{dept.name}</span>
              <span className="text-sm font-bold text-gray-800">{dept.count} คน</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ฝ่ายซ่อมบำรุง - Maintenance Department
function MaintenanceReport() {
  const maintenanceStaff = staffEmployees.filter(e => e.department === 'ซ่อมบำรุง');

  const data = {
    vehicleUptime: 82,
    targetUptime: 90,
    avgRepairTime: 4.2,
    targetRepairTime: 3,
    maintenanceCost: 850000,
    budgetCost: 800000,
    pendingRepairs: 8,
    inProgress: 5,
    completed: 23,
    preventiveMaintenance: 65,
    breakdowns: 3,
    partsInventory: 78,
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="space-y-2">
        {data.breakdowns > 0 && (
          <AlertCard
            type="danger"
            title={`${data.breakdowns} คันเสียฉุกเฉิน`}
            description="มีรถเสียกะทันหัน ต้องซ่อมด่วน"
            action="ดูรายละเอียด"
          />
        )}
        {data.vehicleUptime < data.targetUptime && (
          <AlertCard
            type="warning"
            title="รถพร้อมใช้งานต่ำกว่าเป้า"
            description={`${data.vehicleUptime}% (เป้า ${data.targetUptime}%)`}
            action="ตรวจสอบแผน PM"
          />
        )}
      </div>

      {/* Key Metrics */}
      <div>
        <SectionHeader title="ประสิทธิภาพซ่อมบำรุง" />
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="รถพร้อมใช้งาน"
            value={data.vehicleUptime}
            target={data.targetUptime}
            unit="%"
            icon={Car}
            color={data.vehicleUptime >= 85 ? 'green' : 'yellow'}
            status={data.vehicleUptime >= data.targetUptime ? 'good' : 'warning'}
          />
          <MetricCard
            label="เวลาซ่อมเฉลี่ย"
            value={data.avgRepairTime}
            target={data.targetRepairTime}
            unit="ชม."
            icon={Timer}
            color={data.avgRepairTime <= data.targetRepairTime ? 'green' : 'orange'}
            status={data.avgRepairTime <= data.targetRepairTime ? 'good' : 'warning'}
          />
          <MetricCard
            label="ค่าซ่อมเดือนนี้"
            value={(data.maintenanceCost / 1000).toFixed(0)}
            target={(data.budgetCost / 1000).toFixed(0)}
            unit="K฿"
            icon={Wrench}
            color={data.maintenanceCost <= data.budgetCost ? 'green' : 'red'}
            status={data.maintenanceCost <= data.budgetCost ? 'good' : 'bad'}
          />
          <MetricCard
            label="PM ตามแผน"
            value={data.preventiveMaintenance}
            unit="%"
            icon={Settings}
            color="purple"
            status={data.preventiveMaintenance >= 80 ? 'good' : 'warning'}
          />
        </div>
      </div>

      {/* Repair Status */}
      <div>
        <SectionHeader title="สถานะงานซ่อม" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{data.pendingRepairs}</p>
              <p className="text-xs text-gray-500">รอซ่อม</p>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <p className="text-2xl font-bold text-blue-600">{data.inProgress}</p>
              <p className="text-xs text-gray-500">กำลังซ่อม</p>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <p className="text-2xl font-bold text-green-600">{data.completed}</p>
              <p className="text-xs text-gray-500">เสร็จแล้ว</p>
            </div>
          </div>
        </div>
      </div>

      {/* Parts Inventory */}
      <div>
        <SectionHeader title="อะไหล่คงคลัง" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">ระดับสต็อก</span>
            <span className={`text-sm font-bold ${data.partsInventory >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
              {data.partsInventory}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${data.partsInventory >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${data.partsInventory}%` }}
            />
          </div>
          {data.partsInventory < 70 && (
            <p className="text-xs text-yellow-600 mt-2">* ควรเติมสต็อกบางรายการ</p>
          )}
        </div>
      </div>

      {/* Team */}
      <div>
        <SectionHeader title="ทีมงานฝ่ายซ่อมบำรุง" subtitle={`${departmentHeadcount.maintenance.total} คน`} />
        <HeadcountSummary data={departmentHeadcount.maintenance} />
      </div>

      {/* Staff */}
      <div>
        <SectionHeader title="ช่างประจำ" />
        <div className="space-y-2">
          {maintenanceStaff.map(staff => (
            <StaffCard key={staff.id} employee={staff} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ฝ่ายการตลาด - Marketing Department
function MarketingReport() {
  const marketingStaff = staffEmployees.filter(e => e.department === 'การตลาด');

  const data = {
    leads: 120,
    targetLeads: 100,
    conversionRate: 8.5,
    targetConversion: 10,
    brandAwareness: 72,
    targetAwareness: 75,
    newCustomers: 3,
    campaignROI: 2.5,
    socialFollowers: 15200,
    followerGrowth: 12,
    websiteVisits: 8500,
    costPerLead: 450,
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="space-y-2">
        {data.leads >= data.targetLeads && (
          <AlertCard
            type="info"
            title="เกินเป้า Lead!"
            description={`ได้ ${data.leads} leads เกินเป้า ${data.targetLeads} แล้ว`}
          />
        )}
        {data.conversionRate < data.targetConversion && (
          <AlertCard
            type="warning"
            title="Conversion Rate ต่ำกว่าเป้า"
            description={`${data.conversionRate}% (เป้า ${data.targetConversion}%)`}
            action="ปรับปรุง Sales Funnel"
          />
        )}
      </div>

      {/* Key Metrics */}
      <div>
        <SectionHeader title="ประสิทธิภาพการตลาด" />
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="Lead Generation"
            value={data.leads}
            target={data.targetLeads}
            unit="ราย"
            icon={UserPlus}
            color="green"
            status="good"
            trend="up"
          />
          <MetricCard
            label="Conversion Rate"
            value={data.conversionRate}
            target={data.targetConversion}
            unit="%"
            icon={Percent}
            color={data.conversionRate >= 8 ? 'blue' : 'yellow'}
            status={data.conversionRate >= data.targetConversion ? 'good' : 'warning'}
          />
          <MetricCard
            label="Brand Awareness"
            value={data.brandAwareness}
            target={data.targetAwareness}
            unit="%"
            icon={Eye}
            color="purple"
            status={data.brandAwareness >= 70 ? 'good' : 'warning'}
            trend="up"
          />
          <MetricCard
            label="Campaign ROI"
            value={data.campaignROI}
            unit="x"
            icon={TrendingUp}
            color="green"
            status="good"
          />
        </div>
      </div>

      {/* Digital Performance */}
      <div>
        <SectionHeader title="Digital Marketing" />
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Social Followers</p>
              <p className="text-xs text-green-600">+{data.followerGrowth}% เดือนนี้</p>
            </div>
            <span className="text-lg font-bold text-blue-600">{(data.socialFollowers / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Website Visits</p>
              <p className="text-xs text-gray-400">เดือนนี้</p>
            </div>
            <span className="text-lg font-bold text-purple-600">{(data.websiteVisits / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cost per Lead</p>
            </div>
            <span className="text-lg font-bold text-orange-600">฿{data.costPerLead}</span>
          </div>
        </div>
      </div>

      {/* New Customers */}
      <div>
        <SectionHeader title="ลูกค้าใหม่เดือนนี้" />
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{data.newCustomers}</p>
          <p className="text-sm text-gray-600">ราย</p>
        </div>
      </div>

      {/* Team */}
      <div>
        <SectionHeader title="ทีมงานฝ่ายการตลาด" subtitle={`${departmentHeadcount.marketing.total} คน`} />
        <HeadcountSummary data={departmentHeadcount.marketing} />
      </div>

      {/* Staff */}
      <div>
        <SectionHeader title="เจ้าหน้าที่" />
        <div className="space-y-2">
          {marketingStaff.map(staff => (
            <StaffCard key={staff.id} employee={staff} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== Main Component ====================

const departments = [
  { id: 'transport' as DepartmentTab, label: 'ขนส่ง', icon: Truck, color: 'blue' },
  { id: 'finance' as DepartmentTab, label: 'การเงิน', icon: Banknote, color: 'green' },
  { id: 'accounting' as DepartmentTab, label: 'บัญชี', icon: Calculator, color: 'purple' },
  { id: 'hr' as DepartmentTab, label: 'HR', icon: Users, color: 'red' },
  { id: 'maintenance' as DepartmentTab, label: 'ซ่อมบำรุง', icon: Wrench, color: 'orange' },
  { id: 'marketing' as DepartmentTab, label: 'การตลาด', icon: Megaphone, color: 'pink' },
];

export function DataPage() {
  const [activeTab, setActiveTab] = useState<DepartmentTab>('transport');

  const renderReport = () => {
    switch (activeTab) {
      case 'transport': return <TransportReport />;
      case 'finance': return <FinanceReport />;
      case 'accounting': return <AccountingReport />;
      case 'hr': return <HRReport />;
      case 'maintenance': return <MaintenanceReport />;
      case 'marketing': return <MarketingReport />;
    }
  };

  const activeDept = departments.find(d => d.id === activeTab);

  return (
    <Layout>
      <div className="space-y-3 pb-20">
        {/* Header */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <h1 className="text-base font-bold text-gray-800">รายงานแผนก</h1>
          <p className="text-xs text-gray-500">ข้อมูลสำคัญที่ผู้บริหารต้องรู้</p>
        </div>

        {/* Department Tabs - Scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {departments.map((dept) => {
            const Icon = dept.icon;
            const isActive = activeTab === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveTab(dept.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* Active Department Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-3 text-white">
          <div className="flex items-center gap-2">
            {activeDept && <activeDept.icon className="w-5 h-5" />}
            <span className="font-semibold">ฝ่าย{activeDept?.label}</span>
          </div>
          <p className="text-xs text-primary-100 mt-1">อัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        {/* Report Content */}
        {renderReport()}
      </div>
    </Layout>
  );
}
