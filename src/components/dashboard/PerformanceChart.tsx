import { useState, useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  ReferenceLine,
} from 'recharts';
import type { TimeRange } from '../../types';
import { getIndicatorData, type IndicatorType } from '../../data/mockData';
import { calculateHealthStatus, getHealthConfig } from '../../utils/healthCalculator';

interface PerformanceChartProps {
  timeRange: TimeRange;
}

const indicators = [
  { id: 'health' as IndicatorType, label: 'สุขภาพ', short: 'สุขภาพ' },
  { id: 'pnl' as IndicatorType, label: 'งบกำไรขาดทุน', short: 'P&L' },
  { id: 'cashflow' as IndicatorType, label: 'กระแสเงินสด', short: 'Cash' },
];

// Tooltip for Health
const HealthTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    const actualValue = payload.find((p: any) => p.dataKey === 'actual')?.value;
    const budgetValue = payload.find((p: any) => p.dataKey === 'budget')?.value;
    const diff = actualValue - budgetValue;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs">
        <p className="font-medium text-gray-800 mb-1">
          {label} {data?.isToday && '(ปัจจุบัน)'}
        </p>
        <p className="text-green-600">Actual: {actualValue}%</p>
        <p className="text-blue-600">Budget: {budgetValue}%</p>
        <p className={diff >= 0 ? 'text-green-600' : 'text-red-600'}>
          {diff >= 0 ? '+' : ''}{diff}%
        </p>
        {data?.isForecast && <p className="text-gray-400 mt-1">* พยากรณ์</p>}
      </div>
    );
  }
  return null;
};

// Tooltip for P&L
const PnLTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs">
        <p className="font-medium text-gray-800 mb-1">
          {label} {data?.isToday && '(ปัจจุบัน)'}
        </p>
        <p className="text-blue-600">รายได้: {data?.revenue}M</p>
        <p className="text-orange-600">ค่าใช้จ่าย: {data?.expense}M</p>
        <p className={data?.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
          กำไร: {data?.profit}M
        </p>
        {data?.isForecast && <p className="text-gray-400 mt-1">* พยากรณ์</p>}
      </div>
    );
  }
  return null;
};

// Tooltip for Cash Flow
const CashFlowTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs">
        <p className="font-medium text-gray-800 mb-1">
          {label} {data?.isToday && '(ปัจจุบัน)'}
        </p>
        <p className="text-blue-600">เงินสดคงเหลือ: {data?.cashBalance?.toFixed(1)}M</p>
        <p className={data?.freeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
          FCF: {data?.freeCashFlow >= 0 ? '+' : ''}{data?.freeCashFlow?.toFixed(1)}M
        </p>
        {data?.isForecast && <p className="text-gray-400 mt-1">* พยากรณ์</p>}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({ timeRange }: PerformanceChartProps) {
  const [indicator, setIndicator] = useState<IndicatorType>('health');

  const chartData = useMemo(() => getIndicatorData(indicator, timeRange), [indicator, timeRange]);
  const todayData = chartData.find((d: any) => d.isToday);

  const getTimeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'วันนี้';
      case 'monthly': return 'เดือนนี้';
      case 'yearly': return 'ปีนี้';
    }
  };

  // Render different charts based on indicator
  const renderChart = () => {
    switch (indicator) {
      case 'health':
        return renderHealthChart();
      case 'pnl':
        return renderPnLChart();
      case 'cashflow':
        return renderCashFlowChart();
    }
  };

  const renderHealthChart = () => {
    const healthData = todayData as { actual?: number; budget?: number } | undefined;
    const todayActual = healthData?.actual || 0;
    const todayBudget = healthData?.budget || 80;
    const todayDiff = todayActual - todayBudget;

    return (
      <>
        {/* Summary */}
        <div className="flex gap-2 mb-2">
          <div className="text-center flex-1 bg-green-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">Actual</p>
            <p className="text-lg font-bold text-green-600">{todayActual}%</p>
          </div>
          <div className="text-center flex-1 bg-blue-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-lg font-bold text-blue-600">{todayBudget}%</p>
          </div>
          <div className="text-center flex-1 bg-gray-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">Gap</p>
            <p className={'text-lg font-bold ' + (todayDiff >= 0 ? 'text-green-600' : 'text-red-600')}>
              {todayDiff >= 0 ? '+' : ''}{todayDiff}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} ticks={[0, 50, 80, 100]} />
              <Tooltip content={<HealthTooltip />} />
              {todayData && <ReferenceLine x={todayData.date} stroke="#6366f1" strokeWidth={2} />}
              <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} fill="url(#colorActual)"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isToday) {
                    const healthStatus = calculateHealthStatus(payload.actual);
                    const healthConfig = getHealthConfig(healthStatus);
                    return (
                      <g key={`t-${cx}`}>
                        {/* Background circle */}
                        <circle cx={cx} cy={cy} r={14} fill="white" stroke={healthConfig.color} strokeWidth={2} />
                        {/* Health emoji */}
                        <text
                          x={cx}
                          y={cy + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={12}
                        >
                          {healthStatus === 'fit' ? '💪' : healthStatus === 'chill' ? '😊' : '😰'}
                        </text>
                      </g>
                    );
                  }
                  if (payload.isForecast) return <circle key={`f-${cx}`} cx={cx} cy={cy} r={3} fill="#fff" stroke="#22c55e" strokeWidth={2} />;
                  return <circle key={`p-${cx}`} cx={cx} cy={cy} r={3} fill="#22c55e" />;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  const renderPnLChart = () => {
    const pnlData = todayData as { revenue?: number; expense?: number; profit?: number } | undefined;
    const revenue = pnlData?.revenue || 0;
    const expense = pnlData?.expense || 0;
    const profit = pnlData?.profit || 0;

    return (
      <>
        {/* Summary */}
        <div className="flex gap-2 mb-2">
          <div className="text-center flex-1 bg-blue-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">รายได้</p>
            <p className="text-lg font-bold text-blue-600">{revenue}M</p>
          </div>
          <div className="text-center flex-1 bg-orange-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">ค่าใช้จ่าย</p>
            <p className="text-lg font-bold text-orange-600">{expense}M</p>
          </div>
          <div className="text-center flex-1 bg-green-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">กำไร</p>
            <p className={'text-lg font-bold ' + (profit >= 0 ? 'text-green-600' : 'text-red-600')}>
              {profit}M
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip content={<PnLTooltip />} />
              {todayData && <ReferenceLine x={todayData.date} stroke="#6366f1" strokeWidth={2} />}
              <Bar dataKey="revenue" fill="#3b82f6" opacity={0.8} radius={[2, 2, 0, 0]} />
              <Bar dataKey="expense" fill="#f97316" opacity={0.8} radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isToday) return <circle key={`t-${cx}`} cx={cx} cy={cy} r={5} fill="#6366f1" />;
                  return <circle key={`p-${cx}`} cx={cx} cy={cy} r={3} fill="#22c55e" />;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  const renderCashFlowChart = () => {
    const cashData = todayData as { cashBalance?: number; freeCashFlow?: number } | undefined;
    const cashBalance = cashData?.cashBalance || 0;
    const fcf = cashData?.freeCashFlow || 0;

    return (
      <>
        {/* Summary */}
        <div className="flex gap-2 mb-2">
          <div className="text-center flex-1 bg-blue-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">เงินสดคงเหลือ</p>
            <p className="text-lg font-bold text-blue-600">{cashBalance.toFixed(1)}M</p>
          </div>
          <div className="text-center flex-1 bg-green-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-500">Free Cash Flow</p>
            <p className={'text-lg font-bold ' + (fcf >= 0 ? 'text-green-600' : 'text-red-600')}>
              {fcf >= 0 ? '+' : ''}{fcf.toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={0} />
              <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CashFlowTooltip />} />
              {todayData && <ReferenceLine x={todayData.date} stroke="#6366f1" strokeWidth={2} yAxisId="left" />}
              <Area yAxisId="left" type="monotone" dataKey="cashBalance" stroke="#3b82f6" strokeWidth={2} fill="url(#colorCash)"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isToday) return <circle key={`t-${cx}`} cx={cx} cy={cy} r={5} fill="#6366f1" />;
                  return <circle key={`p-${cx}`} cx={cx} cy={cy} r={3} fill="#3b82f6" />;
                }}
              />
              <Bar yAxisId="right" dataKey="freeCashFlow" fill="#22c55e" opacity={0.7} radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      {/* Indicator tabs */}
      <div className="flex items-center gap-1 mb-3">
        {indicators.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setIndicator(ind.id)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              indicator === ind.id
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {ind.short}
          </button>
        ))}
      </div>

      {/* Time axis labels */}
      <div className="flex justify-between text-xs text-gray-400 mb-1 px-2">
        <span>อดีต</span>
        <span className="font-medium text-primary-600">{getTimeLabel()}</span>
        <span>อนาคต</span>
      </div>

      {/* Dynamic Chart with Summary */}
      {renderChart()}

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
        {indicator === 'health' && (
          <>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-green-500 rounded"></span>Actual</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t-2 border-dashed border-blue-500"></span>Budget</span>
          </>
        )}
        {indicator === 'pnl' && (
          <>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span>รายได้</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span>ค่าใช้จ่าย</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-green-500 rounded"></span>กำไร</span>
          </>
        )}
        {indicator === 'cashflow' && (
          <>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span>เงินสด</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span>FCF</span>
          </>
        )}
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>ปัจจุบัน</span>
      </div>
    </div>
  );
}
