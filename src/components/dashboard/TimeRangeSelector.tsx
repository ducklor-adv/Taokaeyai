import { clsx } from 'clsx';
import type { TimeRange } from '../../types';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const options: { value: TimeRange; label: string; icon: React.ReactNode }[] = [
  { value: 'daily', label: 'รายวัน', icon: <Calendar className="w-4 h-4" /> },
  { value: 'monthly', label: 'รายเดือน', icon: <CalendarDays className="w-4 h-4" /> },
  { value: 'yearly', label: 'รายปี', icon: <CalendarRange className="w-4 h-4" /> },
];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
            value === option.value
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
