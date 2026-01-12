import { AlertTriangle, Clock, Users, ChevronRight } from 'lucide-react';
import { getFinancialSummary, getCustomerReceivables, getPayables } from '../../data/transportDatabase';

export function CashCrisisCard() {
  const summary = getFinancialSummary();
  const receivables = getCustomerReceivables();
  const payables = getPayables();

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  const crisisConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      label: 'วิกฤต',
      icon: '🚨',
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      label: 'เตือน',
      icon: '⚠️',
    },
    caution: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      label: 'ระวัง',
      icon: '⚡',
    },
    normal: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      label: 'ปกติ',
      icon: '✅',
    },
  };

  const config = crisisConfig[summary.crisisLevel];

  // Top 3 ลูกหนี้ที่ต้องติดตาม
  const topDebtors = receivables
    .filter(r => r.paymentHistory !== 'good')
    .sort((a, b) => b.overdueAmount - a.overdueAmount)
    .slice(0, 3);

  // เจ้าหนี้ที่ต้องจ่ายด่วน
  const urgentPayables = payables.filter(p => p.daysUntilDue <= 7 || p.isOverdue);

  return (
    <div className={`rounded-xl ${config.bg} ${config.border} border-2 p-3 space-y-3`}>
      {/* Header - Crisis Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <div>
            <h3 className={`text-sm font-bold ${config.text}`}>สถานะสภาพคล่อง: {config.label}</h3>
            {summary.crisisLevel !== 'normal' && (
              <p className="text-xs text-gray-600">
                เหลือเวลา {summary.daysUntilCrisis} วัน ก่อนขาดเงินหมุน
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">เงินสดคงเหลือ</p>
          <p className={`text-lg font-bold ${summary.cashOnHand < 2000000 ? 'text-red-600' : 'text-gray-800'}`}>
            ฿{formatMoney(summary.cashOnHand)}
          </p>
        </div>
      </div>

      {/* Cash Flow Gap */}
      {summary.cashShortage > 0 && (
        <div className="bg-red-100 rounded-lg p-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-red-800 font-medium">
              ขาดเงินหมุนเวียน ฿{formatMoney(summary.cashShortage)}
            </p>
            <p className="text-xs text-red-600">
              (ต้องการ ฿4.2M สำหรับเงินเดือน+น้ำมัน)
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2">
        {/* ลูกหนี้ค้าง */}
        <div className="bg-white rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-orange-600">฿{formatMoney(summary.totalReceivable)}</p>
          <p className="text-xs text-gray-500">ลูกหนี้ค้าง</p>
          <p className="text-xs text-red-500 font-medium">{summary.overduePercent}% เกินกำหนด</p>
        </div>

        {/* เจ้าหนี้ */}
        <div className="bg-white rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-purple-600">฿{formatMoney(summary.totalPayable)}</p>
          <p className="text-xs text-gray-500">เจ้าหนี้รอจ่าย</p>
          <p className="text-xs text-red-500 font-medium">฿{formatMoney(summary.urgentPayable)} ด่วน</p>
        </div>

        {/* Working Capital */}
        <div className="bg-white rounded-lg p-2 text-center">
          <p className={`text-lg font-bold ${summary.workingCapital > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ฿{formatMoney(summary.workingCapital)}
          </p>
          <p className="text-xs text-gray-500">Working Capital</p>
          <p className="text-xs text-gray-400">Current Ratio: {summary.currentRatio.toFixed(1)}</p>
        </div>
      </div>

      {/* Good News - งานเยอะ! */}
      <div className="bg-green-100 rounded-lg p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <div>
              <p className="text-xs text-green-800 font-medium">ข่าวดี: งานเกินเป้า +{summary.tripVariance}%</p>
              <p className="text-xs text-green-600">
                รายได้เดือนนี้ ฿{formatMoney(summary.monthlyRevenue)} | กำไร ฿{formatMoney(summary.monthlyProfit)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ลูกหนี้ที่ต้องติดตาม */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
          <Users className="w-3 h-3" /> ลูกหนี้ที่ต้องติดตามด่วน
        </p>
        <div className="space-y-1">
          {topDebtors.map(debtor => (
            <div
              key={debtor.customerId}
              className="bg-white rounded-lg p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  debtor.paymentHistory === 'problematic' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-xs font-medium text-gray-800">{debtor.customerCode}</p>
                  <p className="text-xs text-gray-500">ค้าง {debtor.oldestOverdueDays} วัน</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-600">฿{formatMoney(debtor.overdueAmount)}</p>
                <p className="text-xs text-gray-400">เกินกำหนด</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* เจ้าหนี้ที่ต้องจ่าย */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
          <Clock className="w-3 h-3" /> ต้องจ่ายภายใน 7 วัน
        </p>
        <div className="space-y-1">
          {urgentPayables.slice(0, 3).map(payable => (
            <div
              key={payable.id}
              className="bg-white rounded-lg p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  payable.isOverdue ? 'bg-red-500' : payable.isPriority ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-xs font-medium text-gray-800">{payable.vendor}</p>
                  <p className={`text-xs ${payable.isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                    {payable.isOverdue ? `เลยกำหนด ${Math.abs(payable.daysUntilDue)} วัน` : `อีก ${payable.daysUntilDue} วัน`}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-bold ${payable.isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                ฿{formatMoney(payable.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-primary-600 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary-700 transition-colors">
        ดูแผนแก้ไขสภาพคล่อง <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
