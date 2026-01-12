import { ChevronRight } from 'lucide-react';
import type { Manager } from '../../types';
import { getHealthConfig } from '../../utils/healthCalculator';

interface ManagerGridProps {
  managers: Manager[];
}

function MiniCard({ manager }: { manager: Manager }) {
  const healthConfig = getHealthConfig(manager.healthStatus);

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-lg border hover:shadow-sm cursor-pointer transition-shadow bg-white"
      style={{ borderLeftColor: healthConfig.color, borderLeftWidth: '3px' }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: healthConfig.color }}
      >
        {manager.score}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-800 truncate">{manager.name}</p>
        <p className="text-xs text-gray-500 truncate">{manager.position}</p>
      </div>
    </div>
  );
}

export function ManagerGrid({ managers }: ManagerGridProps) {
  const fitCount = managers.filter((m) => m.healthStatus === 'fit').length;
  const chillCount = managers.filter((m) => m.healthStatus === 'chill').length;
  const badCount = managers.filter((m) => m.healthStatus === 'bad').length;

  // Show only first 6 managers
  const displayManagers = managers.slice(0, 6);
  const remainingCount = managers.length - 6;

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">สถานะ Manager</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-1">
          {fitCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
              {fitCount}
            </span>
          )}
          {chillCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
              {chillCount}
            </span>
          )}
          {badCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
              {badCount}
            </span>
          )}
        </div>
      </div>

      {/* Compact Grid */}
      <div className="grid grid-cols-2 gap-2">
        {displayManagers.map((manager) => (
          <MiniCard key={manager.id} manager={manager} />
        ))}
      </div>

      {/* Show more */}
      {remainingCount > 0 && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 cursor-pointer hover:text-primary-600">
            +{remainingCount} คน ดูทั้งหมด
          </span>
        </div>
      )}
    </div>
  );
}
