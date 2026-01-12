import { useMemo } from 'react';
import { Truck, Users, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { TimeRange } from '../../types';
import { getTransportQuickStats } from '../../data/mockData';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  color: string;
  iconColor: string;
}

interface QuickStatsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: 'daily', label: 'รายวัน' },
  { value: 'monthly', label: 'รายเดือน' },
  { value: 'yearly', label: 'รายปี' },
];

function StatCard({ icon, label, value, change, color, iconColor }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className={'rounded-lg p-2 cursor-pointer hover:opacity-80 transition-opacity ' + color}>
      <div className="flex items-center gap-2">
        <div className={iconColor}>{icon}</div>
        <span className="text-lg font-bold text-gray-800">{value}</span>
        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </span>
      </div>
      <p className="text-xs text-gray-600 mt-0.5 truncate">{label}</p>
    </div>
  );
}

export function QuickStats({ timeRange, onTimeRangeChange }: QuickStatsProps) {
  // Use transport database with seasonal factors
  const data = useMemo(() => getTransportQuickStats(timeRange), [timeRange]);

  const stats: StatCardProps[] = [
    {
      icon: <Truck className="w-4 h-4" />,
      label: data.tripLabel,
      value: data.trips.toLocaleString(),
      change: 12,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'สำเร็จ',
      value: data.success.toLocaleString(),
      change: 8,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'รอส่ง',
      value: data.pending.toLocaleString(),
      change: -15,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'พนักงาน',
      value: data.employees.toLocaleString(),
      change: 2,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Time Range Selector */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => onTimeRangeChange(range.value)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              timeRange === range.value
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
