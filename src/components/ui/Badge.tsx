import { clsx } from 'clsx';
import type { HealthStatus } from '../../types';
import { getHealthConfig } from '../../utils/healthCalculator';

interface BadgeProps {
  status: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ status, size = 'md' }: BadgeProps) {
  const config = getHealthConfig(status);

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        config.bgColor,
        config.textColor,
        sizeClasses[size]
      )}
    >
      <span
        className="w-2 h-2 rounded-full mr-1.5"
        style={{ backgroundColor: config.color }}
      ></span>
      {config.label}
    </span>
  );
}
