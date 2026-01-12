import { useState } from 'react';
import { StatusIndicator } from '../ui/StatusIndicator';
import type { CompanyStats, Manager } from '../../types';
import { calculateHealthStatus, getHealthConfig } from '../../utils/healthCalculator';
import { Search, X, Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

interface CompanyHealthCardProps {
  stats: CompanyStats;
  managers?: Manager[];
}

export function CompanyHealthCard({ stats, managers = [] }: CompanyHealthCardProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const healthStatus = calculateHealthStatus(stats.overallHealth);

  const getHealthColor = () => {
    switch (healthStatus) {
      case 'fit': return 'text-green-500';
      case 'chill': return 'text-yellow-500';
      case 'bad': return 'text-red-500';
    }
  };

  const getHealthBg = () => {
    switch (healthStatus) {
      case 'fit': return 'bg-green-500';
      case 'chill': return 'bg-yellow-500';
      case 'bad': return 'bg-red-500';
    }
  };

  const getHealthLabel = () => {
    switch (healthStatus) {
      case 'fit': return 'ฟิต';
      case 'chill': return 'ชิวๆ';
      case 'bad': return 'แย่';
    }
  };

  const strokeColor = healthStatus === 'fit' ? '#22c55e' : healthStatus === 'chill' ? '#eab308' : '#ef4444';
  const dashArray = ((stats.overallHealth / 100) * 150) + ' 150';

  // Mock scanning function
  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setShowReport(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Generate analysis report
  const generateReport = () => {
    const fitManagers = managers.filter((m) => m.healthStatus === 'fit');
    const chillManagers = managers.filter((m) => m.healthStatus === 'chill');
    const badManagers = managers.filter((m) => m.healthStatus === 'bad');

    const avgScore = managers.length > 0
      ? Math.round(managers.reduce((sum, m) => sum + m.score, 0) / managers.length)
      : 0;

    return {
      fitManagers,
      chillManagers,
      badManagers,
      avgScore,
      summary: badManagers.length > 0
        ? `พบ ${badManagers.length} แผนกที่ต้องปรับปรุงด่วน ซึ่งส่งผลกระทบต่อประสิทธิภาพรวมของบริษัท`
        : chillManagers.length > fitManagers.length
          ? 'ภาพรวมอยู่ในเกณฑ์ปานกลาง ควรพัฒนาเพิ่มเติมในบางแผนก'
          : 'สุขภาพองค์กรอยู่ในเกณฑ์ดี ทุกแผนกทำงานได้ตามเป้าหมาย',
    };
  };

  const report = generateReport();

  return (
    <>
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          {/* Mini Circle */}
          <div className="relative flex-shrink-0">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="#e5e7eb" strokeWidth="5" fill="none" />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke={strokeColor}
                strokeWidth="5"
                fill="none"
                strokeDasharray={dashArray}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={'text-sm font-bold ' + getHealthColor()}>
                {stats.overallHealth}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">สุขภาพบริษัท</span>
              <StatusIndicator trend={stats.trend} size="sm" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={'text-xs px-2 py-0.5 rounded-full text-white ' + getHealthBg()}>
                {getHealthLabel()}
              </span>
              <span className="text-xs text-gray-500">
                ส่งตรงเวลา {stats.onTimeDeliveryRate.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Scan Button */}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{scanProgress}%</span>
              </>
            ) : (
              <>
                <Search className="w-3 h-3" />
                <span>สแกน</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Popup */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">รายงานวิเคราะห์สุขภาพองค์กร</h2>
                  <p className="text-xs text-primary-100">สแกนเมื่อ {new Date().toLocaleString('th-TH')}</p>
                </div>
                <button
                  onClick={() => setShowReport(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* Overall Score */}
              <div className="text-center mb-4 pb-4 border-b border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200">
                  <span className="text-3xl font-bold text-primary-700">{report.avgScore}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">คะแนนเฉลี่ยองค์กร</p>
              </div>

              {/* Status Summary */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{report.fitManagers.length}</p>
                  <p className="text-xs text-gray-600">ฟิต</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{report.chillManagers.length}</p>
                  <p className="text-xs text-gray-600">ชิวๆ</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{report.badManagers.length}</p>
                  <p className="text-xs text-gray-600">แย่</p>
                </div>
              </div>

              {/* Manager Details */}
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-700">รายละเอียดแต่ละแผนก</h3>
                {managers.map((manager) => {
                  const config = getHealthConfig(manager.healthStatus);
                  const TrendIcon = manager.trend === 'up' ? TrendingUp : manager.trend === 'down' ? TrendingDown : Minus;
                  const trendColor = manager.trend === 'up' ? 'text-green-500' : manager.trend === 'down' ? 'text-red-500' : 'text-gray-400';

                  return (
                    <div
                      key={manager.id}
                      className="flex items-center gap-3 p-2 rounded-lg border"
                      style={{ borderLeftColor: config.color, borderLeftWidth: '3px' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: config.color }}
                      >
                        {manager.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{manager.name}</p>
                        <p className="text-xs text-gray-500">{manager.position}</p>
                      </div>
                      <TrendIcon className={'w-4 h-4 ' + trendColor} />
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: config.color }}
                      >
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className={`p-3 rounded-lg ${report.badManagers.length > 0 ? 'bg-red-50' : report.chillManagers.length > report.fitManagers.length ? 'bg-yellow-50' : 'bg-green-50'}`}>
                <div className="flex items-start gap-2">
                  {report.badManagers.length > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">สรุปผลกระทบต่อการดำเนินงาน</h4>
                    <p className="text-xs text-gray-600 mt-1">{report.summary}</p>
                    {report.badManagers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-700">แผนกที่ต้องปรับปรุงด่วน:</p>
                        <ul className="text-xs text-red-600 mt-1">
                          {report.badManagers.map((m) => (
                            <li key={m.id}>• {m.position} ({m.name}) - คะแนน {m.score}%</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowReport(false)}
                className="w-full py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
