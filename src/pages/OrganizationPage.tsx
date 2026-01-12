import { Layout } from '../components/layout';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Manager } from '../types';
import { getHealthConfig } from '../utils/healthCalculator';
import { managers } from '../data/mockData';

// Network Node Component - Mobile optimized
function OrgNode({ manager, size = 'normal' }: { manager: Manager; size?: 'large' | 'normal' }) {
  const healthConfig = getHealthConfig(manager.healthStatus);
  const TrendIcon = manager.trend === 'up' ? TrendingUp : manager.trend === 'down' ? TrendingDown : Minus;
  const trendColor = manager.trend === 'up' ? 'text-green-500' : manager.trend === 'down' ? 'text-red-500' : 'text-gray-400';

  const isLarge = size === 'large';

  return (
    <div className="flex flex-col items-center">
      {/* Node Circle */}
      <div
        className={`relative rounded-full border-4 flex items-center justify-center bg-white shadow-lg ${
          isLarge ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'
        }`}
        style={{ borderColor: healthConfig.color }}
      >
        <img
          src={manager.avatar}
          alt={manager.name}
          className={`rounded-full object-cover ${isLarge ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-8 h-8 sm:w-10 sm:h-10'}`}
        />
        {/* Score Badge */}
        <div
          className={`absolute -bottom-1 -right-1 rounded-full flex items-center justify-center text-white font-bold border-2 border-white ${
            isLarge ? 'w-6 h-6 sm:w-7 sm:h-7 text-[10px] sm:text-xs' : 'w-5 h-5 text-[9px] sm:text-[10px]'
          }`}
          style={{ backgroundColor: healthConfig.color }}
        >
          {manager.score}
        </div>
        {/* Trend Icon */}
        <div className={`absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow ${trendColor}`}>
          <TrendIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </div>
      </div>

      {/* Info */}
      <div className={`text-center mt-1.5 sm:mt-2 ${isLarge ? 'max-w-20 sm:max-w-28' : 'max-w-16 sm:max-w-20'}`}>
        <p className={`font-semibold text-gray-800 truncate ${isLarge ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'}`}>
          {manager.name.split(' ')[0]}
        </p>
        <p className={`text-gray-500 truncate ${isLarge ? 'text-[10px] sm:text-xs' : 'text-[8px] sm:text-[10px]'}`}>
          {manager.position.replace('ผู้จัดการ', '')}
        </p>
        <span
          className={`inline-block mt-0.5 sm:mt-1 px-1.5 sm:px-2 py-0.5 rounded-full text-white ${isLarge ? 'text-[8px] sm:text-[10px]' : 'text-[7px] sm:text-[8px]'}`}
          style={{ backgroundColor: healthConfig.color }}
        >
          {healthConfig.label}
        </span>
      </div>
    </div>
  );
}

// Vertical connector line for mobile
function VerticalLine() {
  return (
    <div className="flex justify-center">
      <div className="w-0.5 h-6 bg-slate-300"></div>
    </div>
  );
}

// Horizontal connector with branches for mobile
function BranchConnector({ count }: { count: number }) {
  return (
    <div className="flex justify-center items-center py-2">
      <div className="flex items-center">
        {/* Left branches */}
        <div className="flex">
          {Array.from({ length: Math.ceil(count / 2) }).map((_, i) => (
            <div key={`left-${i}`} className="flex flex-col items-center mx-2 sm:mx-4">
              <div className="w-0.5 h-4 bg-slate-300"></div>
            </div>
          ))}
        </div>
        {/* Center line */}
        <div className="h-0.5 w-full bg-slate-300 absolute left-1/2 transform -translate-x-1/2" style={{ width: `${Math.min(count * 60, 280)}px` }}></div>
        {/* Right branches */}
        <div className="flex">
          {Array.from({ length: Math.floor(count / 2) }).map((_, i) => (
            <div key={`right-${i}`} className="flex flex-col items-center mx-2 sm:mx-4">
              <div className="w-0.5 h-4 bg-slate-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrganizationPage() {
  const ceo = managers.find((m) => m.position === 'ผู้จัดการทั่วไป');
  const otherManagers = managers.filter((m) => m.position !== 'ผู้จัดการทั่วไป');

  // Count by health status
  const fitCount = managers.filter((m) => m.healthStatus === 'fit').length;
  const chillCount = managers.filter((m) => m.healthStatus === 'chill').length;
  const badCount = managers.filter((m) => m.healthStatus === 'bad').length;

  // Split managers into rows (3 per row on mobile)
  const row1 = otherManagers.slice(0, 3);
  const row2 = otherManagers.slice(3, 6);

  return (
    <Layout>
      <div className="space-y-3 pb-20">
        {/* Header */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-base font-bold text-gray-800">ผังองค์กร</h1>
            <div className="flex items-center gap-1.5">
              {fitCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  {fitCount} ฟิต
                </span>
              )}
              {chillCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                  {chillCount} ชิวๆ
                </span>
              )}
              {badCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  {badCount} แย่
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500">โครงสร้างและสถานะสุขภาพองค์กร</p>
        </div>

        {/* Network Diagram - Mobile Optimized */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
          {/* CEO Level */}
          {ceo && (
            <div className="flex justify-center">
              <OrgNode manager={ceo} size="large" />
            </div>
          )}

          {/* Connector from CEO */}
          <div className="flex justify-center py-2">
            <div className="relative">
              <div className="w-0.5 h-6 bg-slate-300 mx-auto"></div>
              <div className="h-0.5 bg-slate-300 absolute bottom-0 left-1/2 transform -translate-x-1/2" style={{ width: '200px' }}></div>
            </div>
          </div>

          {/* Row 1 Managers */}
          <div className="relative">
            {/* Vertical lines down to nodes */}
            <div className="flex justify-around px-2 sm:px-4 mb-1">
              {row1.map((_, idx) => (
                <div key={idx} className="w-0.5 h-4 bg-slate-300"></div>
              ))}
            </div>
            {/* Manager nodes */}
            <div className="flex justify-around px-2 sm:px-4">
              {row1.map((manager) => (
                <OrgNode key={manager.id} manager={manager} />
              ))}
            </div>
          </div>

          {/* Row 2 if exists */}
          {row2.length > 0 && (
            <>
              {/* Connector between rows */}
              <div className="flex justify-center py-3">
                <div className="relative">
                  <div className="h-0.5 bg-slate-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ width: '180px' }}></div>
                </div>
              </div>

              {/* Vertical lines down to row 2 */}
              <div className="flex justify-around px-4 sm:px-8 mb-1">
                {row2.map((_, idx) => (
                  <div key={idx} className="w-0.5 h-4 bg-slate-300"></div>
                ))}
              </div>

              {/* Row 2 Manager nodes */}
              <div className="flex justify-around px-4 sm:px-8">
                {row2.map((manager) => (
                  <OrgNode key={manager.id} manager={manager} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[10px] font-medium text-gray-600 mb-1.5">สัญลักษณ์</p>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> ฟิต
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> ชิวๆ
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> แย่
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 text-green-500" /> ดีขึ้น
            </span>
            <span className="flex items-center gap-1">
              <TrendingDown className="w-2.5 h-2.5 text-red-500" /> แย่ลง
            </span>
            <span className="flex items-center gap-1">
              <Minus className="w-2.5 h-2.5 text-gray-400" /> คงที่
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
