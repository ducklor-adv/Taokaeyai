import type { HealthStatus, HealthStatusConfig } from '../types';

export const HEALTH_STATUS_CONFIG: Record<HealthStatus, HealthStatusConfig> = {
  fit: {
    label: 'ฟิต',
    color: '#22c55e',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    range: { min: 80, max: 100 },
  },
  chill: {
    label: 'ชิวๆ',
    color: '#eab308',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    range: { min: 50, max: 79 },
  },
  bad: {
    label: 'แย่',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    range: { min: 0, max: 49 },
  },
};

export function calculateHealthStatus(score: number): HealthStatus {
  if (score >= 80) return 'fit';
  if (score >= 50) return 'chill';
  return 'bad';
}

export function getHealthConfig(status: HealthStatus): HealthStatusConfig {
  return HEALTH_STATUS_CONFIG[status];
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString('th-TH');
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(num: number): string {
  return num.toFixed(1) + '%';
}
