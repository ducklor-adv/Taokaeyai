// Health Status Types
export type HealthStatus = 'fit' | 'chill' | 'bad';

export interface HealthStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  range: { min: number; max: number };
}

// Manager Types
export interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Manager {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  score: number;
  healthStatus: HealthStatus;
  kpis: KPI[];
  trend: 'up' | 'down' | 'stable';
}

// Performance Data Types
export type TimeRange = 'daily' | 'monthly' | 'yearly';

export interface PerformanceDataPoint {
  date: string;
  revenue: number;
  expense: number;
  profit: number;
  trips: number;
}

export interface ForecastDataPoint extends PerformanceDataPoint {
  isForecast: boolean;
}

// Company Stats Types
export interface CompanyStats {
  totalRevenue: number;
  totalExpense: number;
  totalProfit: number;
  profitMargin: number;
  totalTrips: number;
  totalVehicles: number;
  activeVehicles: number;
  onTimeDeliveryRate: number;
  customerSatisfaction: number;
  overallHealth: number;
  trend: 'up' | 'down' | 'stable';
}

// Chart Types
export interface ChartData {
  past: PerformanceDataPoint[];
  current: PerformanceDataPoint[];
  forecast: ForecastDataPoint[];
}
