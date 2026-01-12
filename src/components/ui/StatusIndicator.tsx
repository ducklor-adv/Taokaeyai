import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface StatusIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

export function StatusIndicator({ trend, size = 'md' }: StatusIndicatorProps) {
  const iconClass = sizeClasses[size];

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full p-1',
        trend === 'up' && 'bg-green-100 text-green-600',
        trend === 'down' && 'bg-red-100 text-red-600',
        trend === 'stable' && 'bg-gray-100 text-gray-600'
      )}
    >
      {trend === 'up' && <TrendingUp className={iconClass} />}
      {trend === 'down' && <TrendingDown className={iconClass} />}
      {trend === 'stable' && <Minus className={iconClass} />}
    </span>
  );
}
