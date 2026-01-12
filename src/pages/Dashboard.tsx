import { useState } from 'react';
import { Layout } from '../components/layout';
import {
  CompanyHealthCard,
  PerformanceChart,
  ManagerGrid,
  QuickStats,
  CashCrisisCard,
} from '../components/dashboard';
import { managers, companyStats } from '../data/mockData';
import type { TimeRange } from '../types';

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  return (
    <Layout>
      <div className="space-y-3">
        {/* Cash Crisis Alert - แสดงบนสุดเพราะสำคัญ! */}
        <CashCrisisCard />

        {/* Quick Stats with TimeRange selector */}
        <QuickStats timeRange={timeRange} onTimeRangeChange={setTimeRange} />

        {/* Company Health Overview with Scan Button */}
        <CompanyHealthCard stats={companyStats} managers={managers} />

        {/* Performance Chart - synced with TimeRange */}
        <PerformanceChart timeRange={timeRange} />

        {/* Manager Grid */}
        <ManagerGrid managers={managers} />
      </div>
    </Layout>
  );
}
