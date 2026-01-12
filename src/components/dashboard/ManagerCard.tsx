import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StatusIndicator } from '../ui/StatusIndicator';
import type { Manager } from '../../types';
import { clsx } from 'clsx';

interface ManagerCardProps {
  manager: Manager;
}

export function ManagerCard({ manager }: ManagerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" padding="md">
      <div className="flex items-start gap-3">
        <img
          src={manager.avatar}
          alt={manager.name}
          className="w-12 h-12 rounded-full bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-gray-800 truncate">{manager.name}</h4>
              <p className="text-sm text-gray-500">{manager.position}</p>
            </div>
            <StatusIndicator trend={manager.trend} size="sm" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge status={manager.healthStatus} size="sm" />
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-gray-800">{manager.score}</span>
          <span className="text-sm text-gray-500">%</span>
        </div>
      </div>

      {/* KPI Preview */}
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
        {manager.kpis.slice(0, 3).map((kpi) => (
          <div key={kpi.name} className="flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate flex-1">{kpi.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'text-xs font-medium',
                  kpi.value >= kpi.target ? 'text-green-600' : 'text-red-600'
                )}
              >
                {kpi.value}{kpi.unit === '%' || kpi.unit === 'วัน' || kpi.unit === 'นาที' || kpi.unit === 'ราย' ? kpi.unit : ''}
              </span>
              <span className="text-xs text-gray-400">/{kpi.target}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
